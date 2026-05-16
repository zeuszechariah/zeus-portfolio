import { useRef, useEffect } from 'react'

// ─── Shaders ──────────────────────────────────────────────
const VERT = `#version 300 es
in vec2 a;
out vec2 v;
void main(){
  v = vec2(a.x * 0.5 + 0.5, 0.5 - a.y * 0.5);
  gl_Position = vec4(a, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D u;
uniform float t;
uniform float sp;
uniform float ca;
in vec2 v;
out vec4 o;

float metal(vec2 p, float tm) {
  float ang = p.x * 2.6 - p.y * 1.15;
  float s1  = sin((ang        + tm * sp)        * 6.2832) * 0.5 + 0.5;
  float s2  = sin((ang * 2.0  + tm * sp * 0.6 + 1.5) * 6.2832) * 0.5 + 0.5;
  float s3  = sin((ang * 0.45 + tm * sp * 1.6 + 3.1) * 6.2832) * 0.5 + 0.5;
  return s1 * 0.50 + s2 * 0.30 + s3 * 0.20;
}

void main() {
  // Chromatic aberration — split R/B channels
  vec2 off = vec2(ca, ca * 0.25);
  float r  = texture(u, v + off).a;
  float g  = texture(u, v      ).a;
  float b  = texture(u, v - off).a;

  // Edge glow — brightens the bevel
  float edge = clamp(length(vec2(dFdx(g), dFdy(g))) * 8.0, 0.0, 1.0);

  // Flowing stripe, boosted at edges
  float f = clamp(mix(metal(v, t), 1.0, edge * 0.80), 0.0, 1.0);
  float f2 = f * f; // gamma curve for contrast

  // Chrome palette: deep shadow → silver → warm white
  vec3 shadow = vec3(0.03, 0.03, 0.04);
  vec3 silver = vec3(0.50, 0.50, 0.56);
  vec3 bright = vec3(0.97, 0.95, 0.90);
  vec3 c = f2 < 0.5
    ? mix(shadow, silver, f2 * 2.0)
    : mix(silver, bright, (f2 - 0.5) * 2.0);

  // Pre-multiplied alpha
  o = vec4(c.r * r, c.g * g, c.b * b, g);
}`

// ─── Helpers ──────────────────────────────────────────────
function mkShader(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.warn('[LiquidMetal] shader error:', gl.getShaderInfoLog(s))
  return s
}

// ─── Component ────────────────────────────────────────────
export default function LiquidMetalText({ children }) {
  const wrapRef   = useRef(null)
  const canvasRef = useRef(null)
  const disposeRef = useRef(null)

  useEffect(() => {
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    let dead = false
    const t0 = performance.now()

    async function boot() {
      // Wait for fonts, then add a tick so layout has settled
      await document.fonts.ready
      await new Promise(r => setTimeout(r, 80))
      if (dead) return

      const dpr  = Math.min(window.devicePixelRatio || 1, 2)
      const rect = wrap.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const W = Math.round(rect.width  * dpr)
      const H = Math.round(rect.height * dpr)
      canvas.width  = W
      canvas.height = H

      // ── Draw text as white-on-transparent to an offscreen canvas ──
      const off = document.createElement('canvas')
      off.width  = W
      off.height = H
      const ctx = off.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = 'white'
      ctx.textBaseline = 'alphabetic'

      wrap.querySelectorAll('[data-lm]').forEach(el => {
        const cs   = getComputedStyle(el)
        const er   = el.getBoundingClientRect()
        const sz   = parseFloat(cs.fontSize) * dpr
        const x    = (er.left - rect.left) * dpr
        // Alphabetic baseline ≈ 82% of fontSize from top of element
        const y    = (er.top - rect.top) * dpr + sz * 0.82
        ctx.font   = `${cs.fontWeight} ${sz}px ${cs.fontFamily}`
        ctx.letterSpacing = cs.letterSpacing
        ctx.fillText(el.textContent.trim(), x, y)
      })

      // ── WebGL2 ────────────────────────────────────────────
      const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true })
      if (!gl || dead) return

      const vs   = mkShader(gl, gl.VERTEX_SHADER,   VERT)
      const fs   = mkShader(gl, gl.FRAGMENT_SHADER, FRAG)
      const prog = gl.createProgram()
      gl.attachShader(prog, vs); gl.attachShader(prog, fs)
      gl.linkProgram(prog)
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
        console.warn('[LiquidMetal] link error:', gl.getProgramInfoLog(prog))
      gl.useProgram(prog)

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
      const vao = gl.createVertexArray()
      gl.bindVertexArray(vao)
      const al = gl.getAttribLocation(prog, 'a')
      gl.enableVertexAttribArray(al)
      gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0)

      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off)

      gl.uniform1i(gl.getUniformLocation(prog, 'u'),  0)
      gl.uniform1f(gl.getUniformLocation(prog, 'sp'), 0.14)  // flow speed
      gl.uniform1f(gl.getUniformLocation(prog, 'ca'), 0.006) // chromatic aberration

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const uT = gl.getUniformLocation(prog, 't')
      let raf

      function frame() {
        if (dead) return
        const elapsed = (performance.now() - t0) / 1000
        gl.viewport(0, 0, W, H)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(uT, elapsed)
        gl.bindVertexArray(vao)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        raf = requestAnimationFrame(frame)
      }
      frame()

      disposeRef.current = () => {
        cancelAnimationFrame(raf)
        gl.deleteTexture(tex)
        gl.deleteBuffer(buf)
        gl.deleteVertexArray(vao)
        gl.deleteProgram(prog)
        gl.deleteShader(vs)
        gl.deleteShader(fs)
      }
    }

    boot()
    return () => { dead = true; disposeRef.current?.() }
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: 'fit-content' }}>
      {/* Invisible layout layer — keeps space + allows font/size measurement */}
      <div style={{ visibility: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        {children}
      </div>
      {/* WebGL2 canvas sits exactly on top */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
