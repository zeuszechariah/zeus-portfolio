import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

function GalleryCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const N = 55
    const HOVER_RADIUS = 90
    const BASE_OPACITY = 0.045
    let W, H, points, restPoints, triangles, retriFrame
    const smoothGlow = new Float32Array(N)
    const triGlow = new Float32Array(500)
    const mouse = { x: -9999, y: -9999, active: false }
    let mouseTimer

    function getPositionalColor(x, y) {
      const nx = x / W, ny = y / H
      return [
        Math.round(255*(1-nx)*(1-ny) + 255*nx*(1-ny) + 255*(1-nx)*ny + 255*nx*ny),
        Math.round(110*(1-nx)*(1-ny) + 185*nx*(1-ny) +  85*(1-nx)*ny + 160*nx*ny),
        Math.round(  0*(1-nx)*(1-ny) +  35*nx*(1-ny) +   0*(1-nx)*ny +  10*nx*ny),
      ]
    }

    function circumcircle(a, b, c) {
      const D = 2*(a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y))
      if (Math.abs(D) < 1e-10) return null
      const ax2=a.x*a.x+a.y*a.y, bx2=b.x*b.x+b.y*b.y, cx2=c.x*c.x+c.y*c.y
      const ux=(ax2*(b.y-c.y)+bx2*(c.y-a.y)+cx2*(a.y-b.y))/D
      const uy=(ax2*(c.x-b.x)+bx2*(a.x-c.x)+cx2*(b.x-a.x))/D
      return { x:ux, y:uy, r:Math.hypot(a.x-ux,a.y-uy) }
    }
    function triangulate() {
      const n=points.length, s1=n-3, s2=n-2, s3=n-1
      let tris=[{a:s1,b:s2,c:s3}]
      for (let i=0;i<N;i++) {
        const p=points[i]; const edges=[]
        tris=tris.filter(t=>{
          const cc=circumcircle(points[t.a],points[t.b],points[t.c])
          if(cc&&Math.hypot(p.x-cc.x,p.y-cc.y)<cc.r){edges.push([t.a,t.b],[t.b,t.c],[t.c,t.a]);return false}
          return true
        })
        edges.filter((e,i)=>!edges.some((f,j)=>j!==i&&((f[0]===e[0]&&f[1]===e[1])||(f[0]===e[1]&&f[1]===e[0]))))
          .forEach(e=>tris.push({a:e[0],b:e[1],c:i}))
      }
      triangles=tris.filter(t=>t.a<N&&t.b<N&&t.c<N)
    }
    function init() {
      W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight
      points=[]; restPoints=[]; retriFrame=0
      const cols=Math.ceil(Math.sqrt(N*W/H)), rows=Math.ceil(N/cols)
      let idx=0
      for (let r=0;r<rows&&idx<N;r++)
        for (let c=0;c<cols&&idx<N;c++) {
          const x=(c+0.5+(Math.random()-0.5)*0.8)/cols*W
          const y=(r+0.5+(Math.random()-0.5)*0.8)/rows*H
          points.push({x,y,vx:0,vy:0}); restPoints.push({x,y}); idx++
        }
      points.push({x:-W*2,y:-H},{x:W*3,y:-H},{x:W/2,y:H*3})
      triangulate()
    }

    let rafId = null
    ctx.lineJoin='miter'; ctx.miterLimit=6; ctx.lineCap='butt'

    function loop() {
      ctx.clearRect(0,0,W,H)
      retriFrame++
      let totalMov=0
      for (let i=0;i<N;i++) {
        const p=points[i], rx=restPoints[i].x, ry=restPoints[i].y
        if (mouse.active) {
          const dx=mouse.x-p.x, dy=mouse.y-p.y, d=Math.hypot(dx,dy)
          if (d<HOVER_RADIUS*2&&d>1) { const f=1-d/(HOVER_RADIUS*2); p.vx+=dx/d*f*4; p.vy+=dy/d*f*4 }
        }
        p.vx+=(rx-p.x)*0.30; p.vy+=(ry-p.y)*0.30; p.vx*=0.52; p.vy*=0.52
        p.x+=p.vx; p.y+=p.vy
        totalMov+=Math.abs(p.vx)+Math.abs(p.vy)
        const pd=mouse.active?Math.hypot(p.x-mouse.x,p.y-mouse.y):9999
        const tgt=Math.max(0,1-pd/HOVER_RADIUS)
        smoothGlow[i]+=(tgt-smoothGlow[i])*(tgt>smoothGlow[i]?0.5:0.15)
      }
      if (totalMov>2.5&&retriFrame%20===0) triangulate()

      const len=triangles.length
      for (let k=0;k<len;k++) {
        const t=triangles[k]
        const a=points[t.a],b=points[t.b],c=points[t.c]
        const mx=(a.x+b.x+c.x)/3, my=(a.y+b.y+c.y)/3
        const d=Math.hypot(mx-mouse.x,my-mouse.y)
        const hotspot=mouse.active?Math.max(0,1-d/HOVER_RADIUS):0
        const soft=mouse.active?Math.max(0,1-d/(HOVER_RADIUS*3.5))*0.28:0
        const va=(smoothGlow[t.a]+smoothGlow[t.b]+smoothGlow[t.c])/3
        triGlow[k]=Math.max(hotspot,soft,va*0.55)
      }

      ctx.globalAlpha=BASE_OPACITY
      ctx.strokeStyle='rgba(242,237,228,0.55)'
      ctx.lineWidth=0.5
      ctx.beginPath()
      for (let k=0;k<len;k++) {
        if (triGlow[k]<0.04) {
          const t=triangles[k], a=points[t.a],b=points[t.b],c=points[t.c]
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath()
        }
      }
      ctx.stroke()

      for (let k=0;k<len;k++) {
        const g=triGlow[k]
        if (g<0.04) continue
        const t=triangles[k], a=points[t.a],b=points[t.b],c=points[t.c]
        const mx=(a.x+b.x+c.x)/3, my=(a.y+b.y+c.y)/3
        const [cr,cg,cb]=getPositionalColor(mx,my)
        const inv=1-g
        ctx.globalAlpha=Math.min(1, BASE_OPACITY+g*1.3)
        ctx.lineWidth=0.5+g*0.9
        ctx.strokeStyle=`rgb(${Math.round(242*inv+cr*g)},${Math.round(237*inv+cg*g)},${Math.round(228*inv+cb*g)})`
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath(); ctx.stroke()
      }

      for (let i=0;i<N;i++) {
        const p=points[i], g=smoothGlow[i]
        ctx.shadowBlur = 5 + g * 10
        ctx.shadowColor = `rgba(242,237,228,${0.55 + g * 0.45})`
        ctx.globalAlpha = 0.72 + g * 0.28
        ctx.fillStyle = '#F2EDE4'
        ctx.beginPath(); ctx.arc(p.x,p.y,0.8+g*1.2,0,Math.PI*2); ctx.fill()
      }
      ctx.shadowBlur=0; ctx.shadowColor='transparent'; ctx.globalAlpha=1
      rafId=requestAnimationFrame(loop)
    }

    const onMouse = e => {
      const rect=canvas.getBoundingClientRect()
      mouse.x=e.clientX-rect.left; mouse.y=e.clientY-rect.top
      mouse.active=true; clearTimeout(mouseTimer)
      mouseTimer=setTimeout(()=>{ mouse.active=false },160)
    }
    window.addEventListener('mousemove', onMouse, { passive:true })
    const onResize = () => init()
    window.addEventListener('resize', onResize, { passive:true })

    let visible=false
    const observer=new IntersectionObserver(([e])=>{
      visible=e.isIntersecting
      if (visible&&!rafId) rafId=requestAnimationFrame(loop)
      else if (!visible&&rafId) { cancelAnimationFrame(rafId); rafId=null }
    },{ threshold:0.01 })
    observer.observe(canvas)

    const onVis=()=>{
      if (document.hidden) { if (rafId) { cancelAnimationFrame(rafId); rafId=null } }
      else if (visible&&!rafId) rafId=requestAnimationFrame(loop)
    }
    document.addEventListener('visibilitychange', onVis)
    init()

    return () => {
      cancelAnimationFrame(rafId); observer.disconnect(); clearTimeout(mouseTimer)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }} />
}

const EASE = [0.22, 1, 0.36, 1]

const POLAROIDS = [
  // Row 1
  { id: 1,  src: '/folio/eiffel.jpg',            caption: 'Paris',             objPos: '50% 15%', w: 180, rot:   7, x: '13%', y: 15  },
  { id: 3,  src: '/folio/child-zeus.jpg',        caption: 'age 5',             objPos: '50% 20%', w: 188, rot:  12, x: '38%', y: 22  },
  { id: 4,  src: '/folio/hoian.jpg',             caption: 'Hội An',            objPos: '50% 40%', w: 178, rot:  -8, x: '51%', y: 58  },
  { id: 5,  src: '/folio/dubai-waterpark.jpg',   caption: 'Dubai, 2019',       objPos: '50% 45%', w: 182, rot:   6, x: '64%', y: 18  },
  { id: 6,  src: '/folio/nid-campus.jpg',        caption: 'NID Ahmedabad',     objPos: '50% 55%', w: 172, rot: -10, x: '77%', y: 50  },
  // Row 2
  { id: 7,  src: '/folio/berlin-cathedral.jpg',  caption: 'Berlin Dom',        objPos: '50% 32%', w: 185, rot:   9, x: '3%',  y: 245 },
  { id: 10, src: '/folio/snowman.jpg',           caption: 'first snow of 2026', objPos: '50% 30%', w: 172, rot:  -9, x: '42%', y: 278 },
  { id: 11, src: '/folio/football-sunset.jpg',   caption: 'Berlin',            objPos: '50% 18%', w: 178, rot:   7, x: '55%', y: 248 },
  { id: 12, src: '/folio/leather-jacket.jpg',    caption: 'age 25',            objPos: '50% 32%', w: 182, rot: -11, x: '68%', y: 272, imgFilter: 'grayscale(1)' },
  // Row 3
  { id: 14, src: '/folio/hcmc-skyline.jpg',      caption: 'Ho Chi Minh City',  objPos: '50% 58%', w: 182, rot:  -7, x: '10%', y: 480 },
  { id: 15, src: '/folio/shimla.jpg',            caption: 'Shimla',            objPos: '50% 48%', w: 192, rot:  13, x: '37%', y: 458 },
  { id: 16, src: '/folio/brandenburg.jpg',       caption: 'Brandenburger Tor', objPos: '50% 22%', w: 182, rot:  -8, x: '63%', y: 478 },
]

function Polaroid({ p, inView, sectionRef, zOverride, bringToFront }) {
  const [dragging, setDragging] = useState(false)

  const imgH   = p.w - 16
  const totalH = imgH + 46

  return (
    <motion.div
      drag
      dragConstraints={sectionRef}
      dragElastic={0.05}
      dragMomentum={false}
      onPointerDown={() => bringToFront(p.id)}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      initial={{ opacity: 0, scale: 0.78 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: p.id * 0.02, ease: EASE }}
      whileHover={!dragging ? { scale: 1.04, transition: { duration: 0.25, ease: EASE } } : {}}
      style={{
        position:        'absolute',
        left:            p.x,
        top:             p.y,
        width:           p.w,
        rotate:          p.rot,
        zIndex:          dragging ? 100 : (zOverride ?? 3),
        cursor:          dragging ? 'grabbing' : 'grab',
        transformOrigin: 'center bottom',
      }}
    >
      <div style={{
        width:        p.w,
        height:       totalH,
        background:   '#FFFFFF',
        padding:      '8px 8px 0',
        borderRadius: '3px',
        boxShadow:    dragging
          ? '0 22px 64px rgba(0,0,0,0.72), 0 6px 20px rgba(0,0,0,0.5)'
          : '0 8px 40px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.35)',
        transition:   'box-shadow 0.2s ease',
        userSelect:   'none',
      }}>
        <div style={{
          width:    '100%',
          height:   imgH,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {p.src ? (
            <img
              src={p.src}
              alt={p.caption || ''}
              draggable={false}
              style={{
                width:          '100%',
                height:         '100%',
                objectFit:      'cover',
                objectPosition: p.objPos || '50% 50%',
                filter:         p.imgFilter || undefined,
                display:        'block',
              }}
            />
          ) : (
            <div style={{
              width:          '100%',
              height:         '100%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              background:     'linear-gradient(145deg, #1c1c1c 0%, #111 100%)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity="0.2">
                <rect x="2" y="5" width="20" height="15" rx="2" stroke="#fff" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3.5" stroke="#fff" strokeWidth="1.5"/>
                <path d="M8 5V4a1 1 0 011-1h6a1 1 0 011 1v1" stroke="#fff" strokeWidth="1.5"/>
              </svg>
            </div>
          )}
        </div>

        <div style={{
          height:         '38px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}>
          {p.caption && (
            <span style={{
              fontFamily:    "'Space Mono', monospace",
              fontSize:      '0.52rem',
              letterSpacing: '0.08em',
              color:         '#888',
              textAlign:     'center',
              lineHeight:    1.4,
            }}>
              {p.caption}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function PersonalGallery() {
  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once: true, amount: 0.10 })

  const zCounter = useRef(10)
  const [zMap, setZMap] = useState({})

  const bringToFront = (id) => {
    zCounter.current += 1
    setZMap(prev => ({ ...prev, [id]: zCounter.current }))
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background:    '#000000',
        position:      'relative',
        overflow:      'hidden',
        paddingTop:    'clamp(5rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 6vw, 5rem)',
      }}
    >
      <GalleryCanvas />
      {/* Top fade */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
        background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Bottom fade */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
        background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Text block */}
      <div style={{
        maxWidth:     '1200px',
        margin:       '0 auto',
        padding:      '0 44px',
        width:        '100%',
        position:     'relative',
        zIndex:       2,
        marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            fontFamily:    "'Space Mono', monospace",
            fontSize:      '11px',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color:         'rgba(242,237,228,0.34)',
            margin:        '0 0 16px',
          }}
        >
          Beyond the work
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          style={{
            fontFamily:    "'Syne', sans-serif",
            fontSize:      'clamp(1.9rem, 3.8vw, 3rem)',
            fontWeight:    600,
            color:         '#F2EDE4',
            lineHeight:    1.08,
            margin:        '0 0 20px',
            letterSpacing: '-0.025em',
            maxWidth:      '20ch',
          }}
        >
          Experience designer.<br />Experience collector.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.14, ease: EASE }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize:   'clamp(0.9rem, 1.4vw, 1rem)',
            color:      'rgba(242,237,228,0.52)',
            lineHeight: 1.75,
            maxWidth:   '52ch',
            margin:     0,
          }}
        >
          The two aren't separate for me. I design experiences by living them — every detour, conversation, and place I've found myself in feeds directly into how I think and what I make.
        </motion.p>
      </div>

      {/* Polaroid scatter — drag is constrained to sectionRef so the full section is reachable */}
      <div style={{
        position: 'relative',
        width:    '100%',
        height:   '740px',
        zIndex:   2,
      }}>
        {POLAROIDS.map(p => (
          <Polaroid
            key={p.id}
            p={p}
            inView={inView}
            sectionRef={sectionRef}
            zOverride={zMap[p.id]}
            bringToFront={bringToFront}
          />
        ))}
      </div>
    </section>
  )
}
