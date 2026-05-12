import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h, { passive: true })
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

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
        Math.round(255*(1-nx)*(1-ny) + 255*nx*(1-ny) + 250*(1-nx)*ny + 255*nx*ny),
        Math.round(150*(1-nx)*(1-ny) + 180*nx*(1-ny) + 130*(1-nx)*ny + 165*nx*ny),
        Math.round(  0*(1-nx)*(1-ny) +   5*nx*(1-ny) +   0*(1-nx)*ny +   2*nx*ny),
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
      ctx.strokeStyle='rgba(255,165,0,0.30)'
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
        ctx.strokeStyle=`rgb(${Math.round(180*inv+cr*g)},${Math.round(120*inv+cg*g)},${Math.round(0*inv+cb*g)})`
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath(); ctx.stroke()
      }

      for (let i=0;i<N;i++) {
        const p=points[i], g=smoothGlow[i]
        ctx.shadowBlur = 5 + g * 10
        ctx.shadowColor = `rgba(255,165,0,${0.45 + g * 0.55})`
        ctx.globalAlpha = 0.65 + g * 0.35
        ctx.fillStyle = `rgb(${Math.round(180+g*75)},${Math.round(120+g*45)},${Math.round(0)})`
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

const PHOTOS = [
  { id: 1,  src: '/folio/eiffel.jpg',           caption: 'Paris',              objPos: '50% 15%' },
  { id: 10, src: '/folio/snowman.jpg',           caption: 'first snow of 2026', objPos: '50% 30%' },
  { id: 4,  src: '/folio/hoian-lanterns.jpg',   caption: 'Hội An',             objPos: '50% 50%' },
  { id: 5,  src: '/folio/dubai-waterpark.jpg',  caption: 'Dubai',              objPos: '50% 45%' },
  { id: 6,  src: '/folio/nid-campus.jpg',       caption: 'NID Ahmedabad',      objPos: '50% 55%' },
  { id: 7,  src: '/folio/berlin-cathedral.jpg', caption: 'Berlin Dom',         objPos: '50% 32%' },
  { id: 3,  src: '/folio/child-zeus.jpg',        caption: 'age 5',              objPos: '50% 20%' },
  { id: 11, src: '/folio/football-sunset.jpg',  caption: 'Berlin',             objPos: '50% 18%' },
  { id: 12, src: '/folio/leather-jacket.jpg',   caption: 'age 25',             objPos: '50% 42%', imgFilter: 'grayscale(1)' },
  { id: 14, src: '/folio/hcmc-skyline.jpg',     caption: 'Ho Chi Minh City',   objPos: '50% 58%' },
  { id: 15, src: '/folio/shimla.jpg',           caption: 'Shimla',             objPos: '50% 48%', imgScale: 1.15 },
  { id: 16, src: '/folio/brandenburg.jpg',      caption: 'Brandenburger Tor',  objPos: '50% 22%' },
  { id: 17, src: '/folio/la-universal.jpg',     caption: 'L.A.',               objPos: '50% 55%' },
  { id: 18, src: '/folio/home-terrace.jpg',     caption: 'home 𖹭',            objPos: '50% 50%' },
  { id: 19, src: '/folio/prague.jpg',           caption: 'Prague',             objPos: '50% 40%' },
  { id: 20, src: '/folio/brussels.jpg',         caption: 'Brussels',           objPos: '50% 45%' },
  { id: 21, src: '/folio/vienna.jpg',           caption: 'Vienna',             objPos: '50% 35%' },
  { id: 22, src: '/folio/amsterdam.jpg',        caption: 'Amsterdam',          objPos: '50% 50%' },
]

const CARD_W  = 220
const CARD_H  = 300
const RADIUS  = 320

function PolaroidFace({ photo }) {
  return (
    <div style={{
      width:         '100%',
      height:        '100%',
      background:    'white',
      borderRadius:  '4px',
      boxShadow:     '0 8px 32px rgba(0,0,0,0.6)',
      display:       'flex',
      flexDirection: 'column',
      padding:       '10px 10px 0 10px',
      boxSizing:     'border-box',
      position:      'relative',
    }}>
      <div style={{
        position:      'absolute',
        inset:         0,
        borderRadius:  '4px',
        background:    'linear-gradient(135deg, transparent 35%, rgba(0,0,0,0.52) 100%)',
        pointerEvents: 'none',
        zIndex:        2,
      }} />
      <div style={{ flex: 1, overflow: 'hidden', borderRadius: '2px', position: 'relative' }}>
        <img
          src={photo.src}
          alt={photo.caption || ''}
          draggable={false}
          style={{
            width:          '100%',
            height:         '100%',
            objectFit:      'cover',
            objectPosition: photo.objPos || '50% 50%',
            filter:         photo.imgFilter || undefined,
            display:        'block',
            transform:      photo.imgScale ? `scale(${photo.imgScale})` : undefined,
          }}
        />
        {photo.imgBottomCover && (
          <div style={{
            position:   'absolute',
            bottom:     0,
            left:       0,
            right:      0,
            height:     photo.imgBottomCover,
            background: '#000',
          }} />
        )}
      </div>
      <div style={{
        height:         '40px',
        flexShrink:     0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:      '11px',
          letterSpacing: '0.05em',
          color:         '#333',
        }}>
          {photo.caption}
        </span>
      </div>
    </div>
  )
}

function BarrelCarousel({ focusedIdx, setFocusedIdx, flipped, setFlipped }) {
  const pairs = []
  for (let i = 0; i < PHOTOS.length; i += 2) {
    pairs.push({ front: PHOTOS[i], back: PHOTOS[i + 1] })
  }
  const count   = pairs.length
  const degStep = 360 / count

  const focused = focusedIdx !== null ? pairs[focusedIdx] : null

  function openCard(i) { setFocusedIdx(i); setFlipped(false) }
  function closeCard()  { setFocusedIdx(null); setFlipped(false) }

  return (
    <>
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          '100%',
        height:         '560px',
        position:       'relative',
        zIndex:         2,
      }}>

        <style>{`
          @keyframes spinY {
            from { transform: rotateY(0deg); }
            to   { transform: rotateY(-360deg); }
          }
        `}</style>

        {/* Bottom darkness */}
        <div style={{
          position:      'absolute',
          top:           0,
          left:          0,
          right:         0,
          bottom:        '-40px',
          background:    'radial-gradient(ellipse 100% 40% at 50% 115%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 40%, transparent 55%)',
          pointerEvents: 'none',
          zIndex:        3,
        }} />

        <div style={{ position: 'relative', zIndex: 1, overflow: 'visible' }}>
          <div style={{
            width:          `${CARD_W}px`,
            height:         `${CARD_H}px`,
            transformStyle: 'preserve-3d',
            transform:      'perspective(1200px) scale(1.18) rotate(24deg) rotateX(-22deg)',
          }}>
            <div style={{
              width:               '100%',
              height:              '100%',
              transformStyle:      'preserve-3d',
              position:            'relative',
              animation:           'spinY 26s linear infinite',
              animationPlayState:  focused ? 'paused' : 'running',
            }}>
              {pairs.map((pair, i) => (
                <div
                  key={pair.front.id}
                  onClick={() => openCard(i)}
                  style={{
                    position:        'absolute',
                    top:             '50%',
                    left:            '50%',
                    marginLeft:      '0',
                    marginTop:       `-${CARD_H / 2}px`,
                    width:           `${CARD_W}px`,
                    height:          `${CARD_H}px`,
                    transformOrigin: '0% 50%',
                    transformStyle:  'preserve-3d',
                    transform:       `rotateY(${i * degStep}deg) translateZ(55px)`,
                    cursor:          'pointer',
                  }}
                >
                  <div style={{
                    position:                 'absolute',
                    inset:                    0,
                    backfaceVisibility:       'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}>
                    <PolaroidFace photo={pair.front} />
                  </div>

                  <div style={{
                    position:                 'absolute',
                    inset:                    0,
                    backfaceVisibility:       'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform:                'rotateY(180deg)',
                  }}>
                    <PolaroidFace photo={pair.back} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dark overlay */}
      {focused && (
        <div
          onClick={closeCard}
          style={{
            position:   'fixed',
            inset:      0,
            background: 'rgba(0,0,0,0.75)',
            zIndex:     1000,
            cursor:     'pointer',
          }}
        />
      )}

      {/* Focused card — front first, tap to flip */}
      {focused && (
        <div
          onClick={e => { e.stopPropagation(); setFlipped(f => !f) }}
          style={{
            position:    'fixed',
            top:         '50%',
            left:        '50%',
            transform:   'translate(-50%, -50%)',
            width:       '300px',
            height:      '410px',
            zIndex:      1001,
            perspective: '1000px',
            cursor:      'pointer',
          }}
        >
          <div style={{
            width:          '100%',
            height:         '100%',
            position:       'relative',
            transformStyle: 'preserve-3d',
            transform:      flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition:     'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {/* Front */}
            <div style={{
              position:                 'absolute',
              inset:                    0,
              backfaceVisibility:       'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}>
              <PolaroidFace photo={focused.front} />
            </div>
            {/* Back */}
            <div style={{
              position:                 'absolute',
              inset:                    0,
              backfaceVisibility:       'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform:                'rotateY(180deg)',
            }}>
              <PolaroidFace photo={focused.back} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Mobile polaroid strip ────────────────────────────
function MobilePolaroidStrip({ setFocusedIdx, setFlipped }) {
  const pairs = []
  for (let i = 0; i < PHOTOS.length; i += 2) pairs.push({ front: PHOTOS[i], back: PHOTOS[i + 1] })
  const rotations = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2, -1]
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 20px 24px', display: 'flex', gap: '14px', position: 'relative', zIndex: 2 }}>
      {pairs.map((pair, i) => (
        <div
          key={pair.front.id}
          onClick={() => { setFocusedIdx(i); setFlipped(false) }}
          style={{ width: '150px', height: '205px', flexShrink: 0, transform: `rotate(${rotations[i % rotations.length]}deg)`, cursor: 'pointer' }}
        >
          <PolaroidFace photo={pair.front} />
        </div>
      ))}
    </div>
  )
}

export default function PersonalGallery() {
  const sectionRef    = useRef(null)
  const inView        = useInView(sectionRef, { once: true, amount: 0.10 })
  const cursorRef     = useRef(null)
  const isMobile      = useIsMobile()

  const [focusedIdx, setFocusedIdx] = useState(null)
  const [flipped, setFlipped]       = useState(false)
  const isFocused = focusedIdx !== null

  function handleMouseMove(e) {
    if (!cursorRef.current) return
    cursorRef.current.style.left    = `${e.clientX + 14}px`
    cursorRef.current.style.top     = `${e.clientY + 20}px`
    cursorRef.current.style.opacity = '1'
  }
  function handleMouseLeave() {
    if (cursorRef.current) cursorRef.current.style.opacity = '0'
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background:    '#000000',
        position:      'relative',
        overflow:      'visible',
        paddingTop:    'clamp(5rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 6vw, 5rem)',
      }}
    >
      {/* Cursor label */}
      <div
        ref={cursorRef}
        style={{
          position:      'fixed',
          pointerEvents: 'none',
          zIndex:        2000,
          opacity:       0,
          transition:    'opacity 0.2s',
          textAlign:     'center',
          lineHeight:    1.55,
        }}
      >
        {isFocused ? (
          <>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,237,228,0.45)', display: 'block' }}>tap to flip polaroid</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,237,228,0.28)', display: 'block' }}>click anywhere to close</span>
          </>
        ) : (
          <>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,237,228,0.45)', display: 'block' }}>tap on polaroid</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(242,237,228,0.45)', display: 'block' }}>to view</span>
          </>
        )}
      </div>
      {!isMobile && <GalleryCanvas />}

      {/* Teal blob behind polaroids */}
      <div aria-hidden="true" style={{
        position:     'absolute',
        top:          '50%',
        left:         '50%',
        transform:    'translate(-50%, -20%)',
        width:        'clamp(320px, 48vw, 640px)',
        height:       'clamp(320px, 48vw, 640px)',
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(7,80,86,0.48) 0%, rgba(7,80,86,0.22) 45%, transparent 70%)',
        filter:       'blur(72px)',
        pointerEvents:'none',
        zIndex:       0,
      }} />

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
          On &amp; off the clock
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
          The two aren't separate for me. I design experiences by living them. Every detour, conversation, and place I've found myself in feeds directly into how I think and what I make.
        </motion.p>
      </div>

      {/* Deep sea green glow blob behind the carousel */}
      <div aria-hidden="true" style={{
        position:      'absolute',
        top:           '50%',
        left:          '50%',
        transform:     'translate(-50%, -38%)',
        width:         'clamp(320px, 48vw, 640px)',
        height:        'clamp(320px, 48vw, 640px)',
        borderRadius:  '50%',
        background:    'radial-gradient(circle, rgba(0,0,0,0) 0%, transparent 70%)',
        filter:        'blur(72px)',
        pointerEvents: 'none',
        zIndex:        0,
      }} />
      <div aria-hidden="true" style={{
        position:        'absolute',
        top:             '50%',
        left:            '50%',
        transform:       'translate(-50%, -38%)',
        width:           'clamp(320px, 48vw, 640px)',
        height:          'clamp(320px, 48vw, 640px)',
        borderRadius:    '50%',
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        backgroundSize:  '180px 180px',
        opacity:         0.08,
        mixBlendMode:    'overlay',
        pointerEvents:   'none',
        zIndex:          0,
      }} />

      {isMobile
        ? <MobilePolaroidStrip setFocusedIdx={setFocusedIdx} setFlipped={setFlipped} />
        : <BarrelCarousel focusedIdx={focusedIdx} setFocusedIdx={setFocusedIdx} flipped={flipped} setFlipped={setFlipped} />
      }

      {/* Focused overlay — mobile only (BarrelCarousel handles desktop) */}
      {isMobile && focusedIdx !== null && (() => {
        const pairs = []
        for (let i = 0; i < PHOTOS.length; i += 2) pairs.push({ front: PHOTOS[i], back: PHOTOS[i + 1] })
        const focused = pairs[focusedIdx]
        return (
          <>
            <div onClick={() => { setFocusedIdx(null); setFlipped(false) }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, cursor: 'pointer' }} />
            <div onClick={e => { e.stopPropagation(); setFlipped(f => !f) }}
              style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: isMobile ? '80vw' : '300px', height: isMobile ? 'calc(80vw * 300/220)' : '410px', zIndex: 1001, perspective: '1000px', cursor: 'pointer' }}>
              <div style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' }}>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}><PolaroidFace photo={focused.front} /></div>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}><PolaroidFace photo={focused.back} /></div>
              </div>
            </div>
          </>
        )
      })()}
    </section>
  )
}
