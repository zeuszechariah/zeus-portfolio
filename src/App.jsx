import { Analytics } from '@vercel/analytics/react'
import { useRef, useEffect, useState, lazy, Suspense } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useInView } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { EASE, SPRING_STIFF, Bolt, ProgressBar, Nav, Footer, MaskReveal, Reveal, CookieBanner, SectionExit } from './shared.jsx'
const About        = lazy(() => import('./About.jsx'))
const Imprint      = lazy(() => import('./Imprint.jsx'))
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy.jsx'))
const Press        = lazy(() => import('./Press.jsx'))
const GetSetGlobe  = lazy(() => import('./GetSetGlobe.jsx'))

const PROJECTS = [
  { id:1, name:'Study Buddy',     tags:'UX Research · Mobile',   desc:'Rethinking how Indian students study & building habits that actually stick.', color:'from-[#061528] via-[#0f2d52] to-[#1b4a8a]', pitch:'https://pitch.com/v/study-buddy-pqwx5j', thumb:'/thumnail-1-opt.gif' },
  { id:2, name:'Get Set Globe',   tags:'EdTech · Product Design', desc:'Making Earth science something children feel, not just memorise.', color:'from-[#050f08] via-[#0b2e16] to-[#135728]', pitch:'https://pitch.com/v/get-set-globe-hefqux', thumb:'/thumb-getsetglobe.jpg', thumbPos:'50% 0%' },
  { id:3, name:'Spectra',         tags:'Data Viz · Experience',   desc:'Two invisible threats, one shared sky. Mapping the overlap of air and light pollution across urban India.', color:'from-[#0d0702] via-[#2e1606] to-[#7a430e]', pitch:'https://pitch.com/v/spectra-2vnqiq', thumb:'/thumb-spectra-opt.jpg', thumbPos:'50% 15%', thumbFilter:'saturate(0.75)' },
  { id:4, name:'Finance for semi/less literate', tags:'Research · Social Design', desc:'Researching financial literacy through scam resilience and financial literacy.', color:'from-[#040409] via-[#0e0e30] to-[#1a1060]', pitch:'https://canva.link/ryd4ojcrh70b9qq', thumb:'/thumb-finance.jpg', thumbBg:'#EEF3DF' },
]

const SERVICES = [
  'UX Design',
  'Visual Design & Branding',
  'Systems & Service Design',
  'Creative Direction & Strategy',
]

const VITALS = [
  { stat:'06+',  label:'Years in Design',         desc:'Academic + Professional\njourney' },
  { stat:'80%',  label:'Time in Design Thinking', desc:'Discussions, sticky notes, mind-maps and more' },
  { stat:'20%',  label:'Time in Making',          desc:'Headphones and shifting\npixels' },
  { stat:'100%', label:'Zeal',                    desc:'Trying my best (guaranteed)\n:)' },
]

// Brand logos — whitened via CSS filter brightness(0) invert(1)
// hasBg: true = PNG with white/light bg, needs mix-blend-mode:screen to kill it
const BRANDS = [
  { id:1, name:'Fosite',     src: '/logos/fosite.png',                                                     label:'Fosite Co., Bengaluru',                       year:'2023–24', hasBg: false, maxH: 80 },
  { id:2, name:'GIZ',        src: 'https://www.giz.de/themes/custom/dreist/build/giz-logo-with-claim.svg', label:'German International Co-Operation, New Delhi', year:'2023',    hasBg: false, maxH: 38 },
  { id:3, name:'ADI',        src: '/logos/adi.svg',                                                        label:'Association of Designers BLR Chapter',         year:'2022',    hasBg: false, maxH: 38 },
  { id:4, name:'Tata Elxsi', src: '/logos/tata-elxsi.svg',                                                 label:'Tata Elxsi Ltd., Bengaluru',                   year:'2022',    hasBg: false, maxH: 38 },
]

// ─── Stagger List ─────────────────────────────────────
function StaggerList({ children, className = '' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, amount:0.08 })
  return (
    <motion.ul ref={ref} className={className}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={{ visible:{ transition:{ staggerChildren:0.07 } } }}
    >{children}</motion.ul>
  )
}
function StaggerItem({ children, className = '' }) {
  return (
    <motion.li className={className}
      variants={{
        hidden:  { opacity:0, y:16 },
        visible: { opacity:1, y:0, transition:{ duration:0.55, ease:EASE } },
      }}
    >{children}</motion.li>
  )
}

// ─── 3D Tilt Card ─────────────────────────────────────
function TiltCard({ children, className = '', style = {} }) {
  const ref    = useRef(null)
  const x      = useMotionValue(0.5)
  const y      = useMotionValue(0.5)
  const rotX   = useTransform(y, [0,1], [6,-6])
  const rotY   = useTransform(x, [0,1], [-8,8])
  const sRX    = useSpring(rotX, SPRING_STIFF)
  const sRY    = useSpring(rotY, SPRING_STIFF)
  const scale  = useMotionValue(1)
  const sScale = useSpring(scale, SPRING_STIFF)
  return (
    <motion.div ref={ref} className={className}
      style={{ rotateX:sRX, rotateY:sRY, scale:sScale, transformPerspective:900, transformStyle:'preserve-3d', ...style }}
      onMouseMove={e=>{ const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left)/r.width); y.set((e.clientY-r.top)/r.height) }}
      onMouseEnter={()=>scale.set(1.01)}
      onMouseLeave={()=>{ x.set(0.5); y.set(0.5); scale.set(1) }}
      whileTap={{ scale: 0.98 }}
    >{children}</motion.div>
  )
}


// ─── Hero Canvas (Delaunay triangulation) ────────────
function HeroCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const N = 130
    const HOVER_RADIUS = 90
    const BASE_OPACITY = 0.055
    let W, H, points, restPoints, triangles, retriFrame
    const smoothGlow = new Float32Array(N)
    const triGlow = new Float32Array(2000)
    const mouse = { x: -9999, y: -9999, active: false }
    let mouseTimer

    // ── Colour (warm amber glow on dark bg) ──
    function getPositionalColor(x, y) {
      const nx = x / W, ny = y / H
      return [
        Math.round(255*(1-nx)*(1-ny) + 255*nx*(1-ny) + 255*(1-nx)*ny + 255*nx*ny),
        Math.round(110*(1-nx)*(1-ny) + 185*nx*(1-ny) +  85*(1-nx)*ny + 160*nx*ny),
        Math.round(  0*(1-nx)*(1-ny) +  35*nx*(1-ny) +   0*(1-nx)*ny +  10*nx*ny),
      ]
    }

    // ── Delaunay ──
    function circumcircle(a,b,c) {
      const D=2*(a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y))
      if (Math.abs(D)<1e-10) return null
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

    // ── Render loop with batched draw calls ──
    let rafId=null
    ctx.lineJoin='miter'; ctx.miterLimit=6; ctx.lineCap='butt'

    function loop() {
      ctx.clearRect(0,0,W,H)
      retriFrame++

      // ── Physics + glow update ──
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

      // ── Pre-compute glow per triangle ──
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

      // ── Pass 1: batch all dark triangles (subtle cream on dark bg) ──
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

      // ── Pass 2: glowing triangles individually ──
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

      // ── Vertices (cream dots on dark bg) ──
      ctx.beginPath()
      for (let i=0;i<N;i++) {
        const p=points[i], g=smoothGlow[i]
        ctx.globalAlpha=0.18+g*0.7
        ctx.fillStyle=`rgba(242,237,228,${0.5+g*0.5})`
        ctx.arc(p.x,p.y,1.0+g*2,0,Math.PI*2); ctx.closePath()
      }
      ctx.fill()

      ctx.globalAlpha=1
      rafId=requestAnimationFrame(loop)
    }

    // ── Mouse ──
    const onMouse = e => {
      const rect=canvas.getBoundingClientRect()
      mouse.x=e.clientX-rect.left; mouse.y=e.clientY-rect.top
      mouse.active=true; clearTimeout(mouseTimer)
      mouseTimer=setTimeout(()=>{ mouse.active=false },160)
    }
    window.addEventListener('mousemove', onMouse, { passive:true })
    const onResize = () => init()
    window.addEventListener('resize', onResize, { passive:true })

    // ── IntersectionObserver — pause when off-screen ──
    let visible=false
    const observer=new IntersectionObserver(([e])=>{
      visible=e.isIntersecting
      if (visible&&!rafId) rafId=requestAnimationFrame(loop)
      else if (!visible&&rafId) { cancelAnimationFrame(rafId); rafId=null }
    },{ threshold:0.01 })
    observer.observe(canvas)

    // ── Visibility API ──
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex:0 }} />
}

// ─── Video Intro ──────────────────────────────────────
// Autoplays fullscreen, shows "loading" label bottom-right,
// then fades out — no scroll interaction.
function VideoIntro({ onComplete }) {
  const videoRef = useRef(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const trigger = () => setFading(true)
    // Start fade ~0.6s before end so it exits cleanly
    const check = () => {
      if (vid.duration && vid.currentTime >= vid.duration - 0.6) trigger()
    }
    vid.addEventListener('ended', trigger)
    vid.addEventListener('timeupdate', check)
    return () => {
      vid.removeEventListener('ended', trigger)
      vid.removeEventListener('timeupdate', check)
    }
  }, [])

  return (
    <div className="pointer-events-none"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#060606',
        opacity: fading ? 0 : 1,
        transition: 'opacity 1.4s cubic-bezier(0.16,1,0.3,1)',
      }}
      onTransitionEnd={() => { if (fading) onComplete?.() }}
    >
      {/* Video at 75% size, centred — black bg fills the rest */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '75%', height: '75%', overflow: 'hidden',
      }}>
        <video ref={videoRef} autoPlay muted playsInline preload="none"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="/headervideo.mp4" />
        <div className="absolute inset-0" style={{
          background: [
            'linear-gradient(to bottom, #060606 0%, transparent 18%)',
            'linear-gradient(to top,    #060606 0%, transparent 18%)',
            'linear-gradient(to right,  #060606 0%, transparent 14%)',
            'linear-gradient(to left,   #060606 0%, transparent 14%)',
          ].join(', ')
        }} />
      </div>
      {/* Loading label */}
      <span style={{
        position: 'absolute',
        bottom: 'clamp(1.5rem,3vw,2rem)',
        right: 'clamp(1.5rem,3vw,2rem)',
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.6rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(242,237,228,0.32)',
      }}>loading</span>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────
function Hero() {
  const heroRef = useRef(null)

  const lines = [
    { text: "I'm an Indian designer,",          cls: 'font-sans font-semibold tracking-[-0.04em]', italic: false },
    { text: 'global in practice, focused',      cls: 'font-sans font-semibold tracking-[-0.04em]', italic: false },
    { text: 'on structure, sensation, & more.', cls: 'font-display',                                italic: true  },
  ]

  return (
    <section ref={heroRef} id="main-content"
      className="relative flex flex-col justify-end overflow-hidden"
      style={{
        minHeight: '100svh',
        padding: '0 clamp(1.5rem,5vw,3.5rem) clamp(4rem,8vw,6rem)',
      }}
    >
      <HeroCanvas />
      <div className="absolute pointer-events-none" style={{ width:'clamp(500px,60vw,820px)',height:'clamp(500px,60vw,820px)',borderRadius:'50%',top:'-25%',left:'-18%',zIndex:0,background:'radial-gradient(circle,rgba(124,58,237,0.14) 0%,transparent 65%)' }} />
      <div className="absolute pointer-events-none" style={{ width:'clamp(350px,42vw,600px)',height:'clamp(350px,42vw,600px)',borderRadius:'50%',bottom:'-12%',right:'-10%',zIndex:0,background:'radial-gradient(circle,rgba(255,75,143,0.09) 0%,transparent 65%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex:1, background:'linear-gradient(to bottom,#060606 0%,transparent 22%),linear-gradient(to top,#060606 0%,transparent 22%),linear-gradient(to right,#060606 0%,transparent 18%),linear-gradient(to left,#060606 0%,transparent 18%)' }} />

      <div className="relative z-[3] w-full flex items-end justify-between gap-6">
        <h1>
          {lines.map(({ text, cls, italic }, i) => (
            <MaskReveal key={text} delay={i * 0.13}>
              <span
                className={`block hero-glow ${cls}`}
                style={{
                  fontSize: 'clamp(1.575rem,3.85vw,3.675rem)',
                  lineHeight: italic ? 1.22 : 1.1,
                  color: 'rgba(242,237,228,1)',
                  fontStyle: italic ? 'italic' : 'normal',
                }}
              >
                {text}
              </span>
            </MaskReveal>
          ))}
        </h1>
        <Reveal delay={0.45} className="flex-shrink-0 pb-[0.18em]">
          <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/40">
            <span className="w-[7px] h-[7px] rounded-full bg-[#00FF87] availability-dot flex-shrink-0" />BLR, India
          </span>
        </Reveal>
      </div>

      <div className="absolute flex items-center gap-3 pointer-events-none select-none"
        style={{ zIndex: 3, bottom: 'clamp(1.5rem,4vw,2.5rem)', left: 'clamp(1.5rem,5vw,3.5rem)', opacity: 0.55 }}
      >
        <div className="w-[1px] h-7 relative overflow-hidden" style={{ background: 'rgba(242,237,228,0.08)' }}>
          <div className="scroll-line-inner absolute inset-x-0 h-1/2" style={{ background: 'rgba(242,237,228,0.35)' }} />
        </div>
        <span className="font-mono text-[0.5rem] tracking-[0.22em] uppercase" style={{ color: 'rgba(242,237,228,0.22)' }}>Scroll</span>
      </div>
    </section>
  )
}

// Clockwise grid positions: TL(grid 0) → TR(grid 1) → BR(grid 3) → BL(grid 2)
const CW_TO_GRID = [0, 1, 3, 2]
function getRotatedServices(offset) {
  const result = new Array(4)
  for (let cw = 0; cw < 4; cw++) result[CW_TO_GRID[cw]] = SERVICES[(cw + offset) % 4]
  return result
}

// ─── Services ─────────────────────────────────────────
function Services() {
  const wrapRef = useRef(null)
  const [svgPath, setSvgPath] = useState('')
  const [offset, setOffset]   = useState(0)
  const inView  = useInView(wrapRef, { once: true, amount: 0.25 })

  // SVG path — computed from wrapper geometry, never depends on dotRefs
  useEffect(() => {
    const compute = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const wr = wrap.getBoundingClientRect()
      // Circle radius mirrors the CSS clamp(150px, 17vw, 230px)
      const r = Math.min(Math.max(150, window.innerWidth * 0.17), 230) / 2
      // 2×2 grid: cell centres at 25%/75% of wrapper width & height
      const tl = { x: wr.width * 0.25, y: wr.height * 0.25 }
      const tr = { x: wr.width * 0.75, y: wr.height * 0.25 }
      const bl = { x: wr.width * 0.25, y: wr.height * 0.75 }
      const br = { x: wr.width * 0.75, y: wr.height * 0.75 }
      setSvgPath([
        `M ${tl.x + r} ${tl.y} L ${tr.x - r} ${tr.y}`,
        `M ${tr.x} ${tr.y + r} L ${br.x} ${br.y - r}`,
        `M ${br.x - r} ${br.y} L ${bl.x + r} ${bl.y}`,
        `M ${bl.x} ${bl.y - r} L ${tl.x} ${tl.y + r}`,
      ].join(' '))
    }
    compute()
    window.addEventListener('resize', compute, { passive: true })
    return () => window.removeEventListener('resize', compute)
  }, [])

  // Start rotating 1.2s after entrance (after entrance animation finishes)
  useEffect(() => {
    if (!inView) return
    let intervalId
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => setOffset(o => (o - 1 + 4) % 4), 3000)
    }, 1200)
    return () => { clearTimeout(timeoutId); clearInterval(intervalId) }
  }, [inView])

  const displayed = getRotatedServices(offset)

  return (
    <section style={{ background:'#060606' }} className="pt-[clamp(3.5rem,6vw,5rem)] pb-[clamp(3.5rem,5.5vw,5.5rem)] border-t border-white/[0.04] relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{ width:'clamp(400px,50vw,680px)',height:'clamp(400px,50vw,680px)',borderRadius:'50%',top:'-20%',right:'-8%',background:'radial-gradient(circle,rgba(124,58,237,0.077) 0%,transparent 65%)' }} />
      <div className="absolute pointer-events-none" style={{ width:'clamp(280px,36vw,480px)',height:'clamp(280px,36vw,480px)',borderRadius:'50%',bottom:'-15%',left:'-5%',background:'radial-gradient(circle,rgba(255,75,143,0.055) 0%,transparent 65%)' }} />
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">

        <div className="mb-[clamp(3rem,5vw,4rem)]">
          <Reveal>
            <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-5">
              <span className="inline-block w-4 h-[1px] bg-ink/18" />What I do
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]"
              style={{ fontSize:'clamp(2.5rem,6vw,5rem)' }}>
            <MaskReveal>What I bring</MaskReveal>
            <MaskReveal delay={0.1}>to the table.</MaskReveal>
          </h2>
        </div>

        {/* 2×2 grid */}
        <div ref={wrapRef} className="relative grid grid-cols-2">

          {/* Centre glow */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width:'clamp(380px,42vw,580px)',height:'clamp(380px,42vw,580px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(149,80,255,0.22) 0%,rgba(140,60,240,0.16) 20%,rgba(120,48,200,0.09) 45%,rgba(100,40,160,0.03) 65%,transparent 80%)',filter:'blur(72px)',opacity:0.65,zIndex:0 }} />

          {/* Clockwise traveling runner */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0, overflow: 'visible' }}>
            {svgPath && (
              <motion.path
                d={svgPath}
                fill="none"
                stroke="rgba(242,237,228,0.88)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathOffset: 0, pathLength: 0 }}
                animate={inView ? {
                  pathOffset: [0, 0, 0.82, 1],
                  pathLength: [0, 0.20, 0.20, 0],
                } : {}}
                transition={{
                  duration: 2.0,
                  times: [0, 0.08, 0.88, 1],
                  ease: ['easeOut', 'linear', 'easeOut'],
                  repeat: Infinity,
                  repeatDelay: 0.1,
                }}
              />
            )}
          </svg>

          {/* Central bolt — fixed at the intersection of the four circles */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 2 }}>
            <span style={{ color: 'rgba(242,237,228,0.55)', filter: 'drop-shadow(0 0 12px rgba(242,237,228,0.3))' }}>
              <Bolt size={38} />
            </span>
          </div>

          {displayed.map((title, i) => (
            <motion.div
              key={title}
              layout
              className="flex items-center justify-center"
              style={{ padding: 'clamp(1.75rem,4vw,4rem)', position: 'relative', zIndex: 1 }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{
                layout: { type: 'spring', duration: 0.45, bounce: 0.18 },
                opacity: { duration: 0.55, ease: EASE, delay: 0.1 + i * 0.09 },
              }}
            >
              <div
                className="relative flex items-center justify-center rounded-full border border-white/[0.10]"
                style={{
                  width:  'clamp(150px,17vw,230px)',
                  height: 'clamp(150px,17vw,230px)',
                  background: '#060606',
                }}
              >
                <span
                  className="relative font-sans font-semibold text-center leading-[1.45] select-none"
                  style={{
                    fontSize: 'clamp(0.9rem,1.2vw,1.1rem)',
                    padding: '0 16%',
                    color: 'rgba(242,237,228,0.82)',
                    textShadow: '0 0 16px rgba(242,237,228,0.45), 0 0 40px rgba(242,237,228,0.18)',
                  }}
                >
                  {title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See Work hint */}
        <motion.div
          className="flex justify-end mt-5"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE, delay: 0.9 }}
        >
          <a href="/#work"
             className="flex items-center gap-2 font-mono text-[0.58rem] tracking-[0.14em] uppercase text-ink/28 hover:text-ink/55 transition-colors duration-300">
            See Work <span style={{ fontSize: '0.65rem' }}>↘</span>
          </a>
        </motion.div>

      </div>
    </section>
  )
}

// ─── Project Card ─────────────────────────────────────
function ProjectCard({ project, delay = 0 }) {
  const ref=useRef(null), inView=useInView(ref,{ once:true, amount:0.06 })
  const mockupY=useMotionValue(0), sMockupY=useSpring(mockupY, SPRING_STIFF)
  const inner = (
    <TiltCard className="h-full flex flex-col rounded-[18px] overflow-hidden cursor-pointer border border-black/[0.07]" style={{ background:'#EAEAEA' }}>
      <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio:'2/3', background: project.thumbBg || undefined }}>
        {project.thumb ? (
          <img src={project.thumb} alt={project.name} loading="lazy" decoding="async"
            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ objectFit: project.thumbBg ? 'contain' : 'cover', objectPosition: project.thumbPos || '50% 50%', filter: project.thumbFilter || undefined }} />
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} transition-transform duration-700 group-hover:scale-[1.03]`} />
            <motion.div className="absolute bottom-[-4%] left-0 right-0 flex justify-center pointer-events-none" style={{ y:sMockupY, zIndex:2 }}
              onMouseEnter={()=>mockupY.set(-12)} onMouseLeave={()=>mockupY.set(0)}>
              <div className="w-[72%] max-w-[300px]" style={{ filter:'drop-shadow(0 18px 48px rgba(0,0,0,0.75))' }}>
                <div className="rounded-t-[7px] rounded-b-[2px] border border-b-0 border-white/[0.1] px-[3.5%] pt-[5%] pb-[2%] relative" style={{ background:'linear-gradient(175deg,#252525 0%,#1c1c1c 100%)' }}>
                  <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 w-[7%] h-[4px] rounded-b bg-black/80" />
                  <div className="aspect-[16/10] rounded overflow-hidden relative" style={{ boxShadow:'inset 0 0 0 1px rgba(0,0,0,0.6)' }}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} brightness-[1.3]`} />
                    <div className="absolute inset-0 p-[10%] z-10 flex flex-col gap-[5%]">
                      <div className="h-[2px] w-3/5 rounded" style={{ background:'rgba(255,255,255,0.22)' }} />
                      <div className="h-[2px] w-2/5 rounded" style={{ background:'rgba(255,255,255,0.12)' }} />
                      <div className="flex gap-[4%] mt-[5%]">{[1,2,3].map(i=><div key={i} className="flex-1 rounded border" style={{ aspectRatio:'1/0.65',background:'rgba(255,255,255,0.07)',borderColor:'rgba(255,255,255,0.08)' }} />)}</div>
                    </div>
                    <div className="absolute inset-0 z-20" style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 42%)' }} />
                  </div>
                </div>
                <div className="h-[2px] border-x border-white/[0.07]" style={{ background:'linear-gradient(90deg,#181818,#2e2e2e 50%,#181818)' }} />
                <div className="rounded-b-[5px] px-[6%] pt-[3%] pb-[4%] border border-t-0 border-white/[0.1]" style={{ background:'linear-gradient(180deg,#202020 0%,#191919 100%)' }}>
                  <div className="h-[5px] rounded mb-[4px]" style={{ background:'repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 5px)' }} />
                  <div className="w-[28%] h-[4px] rounded mx-auto border" style={{ background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.05)' }} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
      <div className="flex-1 p-[clamp(1rem,2vw,1.375rem)] flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div>
            <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase mb-[0.35rem]" style={{ color:'#9a9a9a' }}>{project.tags}</p>
            <h3 className="font-sans font-semibold text-black tracking-[-0.022em]" style={{ fontSize:'clamp(1rem,1.6vw,1.2rem)', lineHeight:1.2 }}>
              <MaskReveal>{project.name}</MaskReveal>
            </h3>
          </div>
          <span className="w-[28px] h-[28px] rounded-full border border-black/15 flex items-center justify-center text-[0.65rem] text-black/40 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:border-black/35 group-hover:bg-black/[0.04] flex-shrink-0" aria-hidden="true">↗</span>
        </div>
        <p className="font-sans leading-[1.7] mt-auto" style={{ fontSize:'clamp(0.72rem,0.9vw,0.8rem)', color:'#7a7a7a' }}>{project.desc}</p>
      </div>
    </TiltCard>
  )
  return (
    <motion.div ref={ref} className="group relative h-full"
      initial={{ opacity:0, y:28 }} animate={inView?{ opacity:1, y:0 }:{}} transition={{ duration:0.65, ease:EASE, delay }}>
      {project.slug
        ? <Link to={project.slug} className="block h-full">{inner}</Link>
        : project.pitch
          ? <a href={project.pitch} target="_blank" rel="noopener noreferrer" className="block h-full">{inner}</a>
          : inner}
    </motion.div>
  )
}

// ─── Work ─────────────────────────────────────────────
function Work() {
  return (
    <section id="work" style={{ background:'#F2EDE4', boxShadow:'inset 0 0 160px rgba(6,6,6,0.22), inset 0 60px 80px -20px rgba(6,6,6,0.14), inset 0 -60px 80px -20px rgba(6,6,6,0.14)' }} className="relative overflow-hidden py-[clamp(4rem,6.5vw,6rem)]">
      <div className="relative z-[1] max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="flex items-end justify-between mb-[clamp(3rem,5.5vw,4.5rem)] gap-6 flex-wrap">
          <div>
            <Reveal>
              <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-black/30 mb-5">
                <span className="inline-block w-4 h-[1px] bg-black/18" />Work
              </span>
            </Reveal>
            <h2 className="font-sans font-semibold text-black tracking-[-0.04em] leading-[0.93]" style={{ fontSize:'clamp(2.5rem,6vw,5rem)' }}>
              <MaskReveal>Select Projects</MaskReveal>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(0.625rem,1vw,0.875rem)] items-stretch">
          {PROJECTS.map((p,i) => <ProjectCard key={p.id} project={p} delay={i*0.07} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Vital Stat Cell — counter animation ──────────────
function VitalStatCell({ v, index }) {
  const ref=useRef(null), inView=useInView(ref,{ once:true, amount:0.3 })
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    if (!inView) return
    const match=v.stat.match(/^(\d+)(.*)$/)
    if (!match){ setDisplay(v.stat); return }
    const numStr=match[1],target=parseInt(numStr,10),suffix=match[2],duration=2200,delay=index*180
    const pad=numStr.length>1&&numStr.startsWith('0')
    let startTime=null,rafId
    const animate=ts=>{ if(!startTime)startTime=ts; const e=ts-startTime-delay; if(e<0){rafId=requestAnimationFrame(animate);return}; const p=Math.min(e/duration,1),ea=1-Math.pow(1-p,3); const cur=Math.round(ea*target); setDisplay((pad?String(cur).padStart(numStr.length,'0'):String(cur))+suffix); if(p<1)rafId=requestAnimationFrame(animate);else setDisplay(v.stat) }
    rafId=requestAnimationFrame(animate)
    return ()=>cancelAnimationFrame(rafId)
  }, [inView, v.stat, index])
  return (
    <div ref={ref} className="flex flex-col p-[clamp(1.75rem,3vw,2.5rem)]">
      <div style={{ minHeight:'5.5rem',display:'flex',alignItems:'flex-end',paddingBottom:'0.625rem' }}>
        <p className="font-sans font-semibold text-ink leading-none tracking-[-0.03em]" style={{ fontSize:'clamp(2.75rem,5vw,4.5rem)' }}>{display}</p>
      </div>
      <p className="font-display italic text-ink mb-2" style={{ fontSize:'clamp(1rem,1.4vw,1.1875rem)', lineHeight: 1.35 }}>{v.label}</p>
      <p className="font-sans text-ink/38 leading-[1.65]" style={{ fontSize:'clamp(0.75rem,1vw,0.875rem)', whiteSpace:'pre-line' }}>{v.desc}</p>
    </div>
  )
}

// ─── Vital Signs ──────────────────────────────────────
function VitalSigns() {
  return (
    <section style={{ background:'#060606' }} className="py-[clamp(3.5rem,5.5vw,5rem)] border-t border-white/[0.04] relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{ width:'clamp(350px,44vw,600px)',height:'clamp(350px,44vw,600px)',borderRadius:'50%',bottom:'-25%',right:'-6%',background:'radial-gradient(circle,rgba(124,58,237,0.085) 0%,transparent 65%)' }} />
      <div className="absolute pointer-events-none" style={{ width:'clamp(260px,32vw,440px)',height:'clamp(260px,32vw,440px)',borderRadius:'50%',top:'-18%',left:'30%',background:'radial-gradient(circle,rgba(255,75,143,0.058) 0%,transparent 65%)' }} />
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="mb-[clamp(3rem,5vw,4rem)]">
          <Reveal>
            <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-5">
              <span className="inline-block w-4 h-[1px] bg-ink/18" />(Not so) Vital Signs
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]"
              style={{ fontSize:'clamp(2.5rem,6vw,5rem)' }}>
            <MaskReveal>Distilled</MaskReveal>
            <MaskReveal delay={0.08}><em className="font-display" style={{ fontStyle:'italic', fontSize:'1.08em' }}>to digits.</em></MaskReveal>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-[18px] overflow-hidden"
             style={{ background:'#0d0d0d', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
          {VITALS.map((v,i) => <VitalStatCell key={v.label} v={v} index={i} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Professional Exposure ────────────────────────────
function ProfessionalExposure() {
  return (
    <section id="about" style={{ background:'#060606' }} className="py-[clamp(4rem,6.5vw,6rem)] border-t border-white/[0.04] relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{ width:'clamp(460px,55vw,740px)',height:'clamp(460px,55vw,740px)',borderRadius:'50%',top:'-22%',left:'-12%',background:'radial-gradient(circle,rgba(124,58,237,0.085) 0%,transparent 65%)' }} />
      <div className="absolute pointer-events-none" style={{ width:'clamp(300px,38vw,520px)',height:'clamp(300px,38vw,520px)',borderRadius:'50%',bottom:'-18%',right:'-4%',background:'radial-gradient(circle,rgba(255,75,143,0.062) 0%,transparent 65%)' }} />
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="mb-[clamp(3.5rem,6vw,5rem)]">
          <Reveal>
            <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-5">
              <span className="inline-block w-4 h-[1px] bg-ink/18" />Brands & Studios
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]" style={{ fontSize:'clamp(2.5rem,6vw,5rem)' }}>
            <MaskReveal>Professional</MaskReveal>
            <MaskReveal delay={0.1}>Exposure</MaskReveal>
          </h2>
          <Reveal delay={0.15}>
            <p className="font-sans text-ink/40 leading-[1.8] mt-5 max-w-[44ch]" style={{ fontSize:'clamp(0.875rem,1.1vw,0.9375rem)' }}>
              Exposure to outstanding professionals at
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] rounded-[18px] overflow-hidden border border-white/[0.06]"
             style={{ background:'rgba(255,255,255,0.04)' }}>
          {BRANDS.map(({ id, name, src, label, year, hasBg, maxH }, i) => (
            <Reveal key={id} delay={i * 0.09}
              className="flex flex-col items-center justify-center gap-4 bg-[#060606] p-[clamp(2rem,4vw,3rem)] cursor-default"
            >
              <div className="w-full flex items-center justify-center" style={{ minHeight: 56 }}>
                <img src={src} alt={name}
                  style={{ maxWidth:'85%', height:'auto', maxHeight: maxH,
                    filter:'brightness(0) invert(1)', opacity: 0.72,
                    mixBlendMode: hasBg ? 'screen' : 'normal',
                    display: 'block' }} />
              </div>
              <div className="flex flex-col items-center gap-[6px]">
                <span className="font-mono text-[0.52rem] tracking-[0.08em] uppercase text-ink/14 text-center leading-[1.5]"
                  style={{ minHeight:'4.5em', display:'flex', alignItems:'flex-start', justifyContent:'center', flexDirection:'column' }}>
                  {label.includes(', ') ? <>{label.slice(0, label.lastIndexOf(',') + 1)}<br />{label.slice(label.lastIndexOf(', ') + 2)}</> : label}
                </span>
                <span className="font-mono text-[0.52rem] tracking-[0.06em] text-ink/38">{year}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Marquee Gallery ──────────────────────────────────
// Images live in /public/glimpses/ — filenames listed below
const CARD_SIZE = 252   // square px

const GALLERY_ROWS = [
  [], // unused (row 0 reserved)

  // Row 1 — scrolls right. Warm/colourful/brand-forward.
  [
    { id: 'r1a', img: '/glimpses/brewteaful.png',    pos: '50% 28%'  }, // Brewteaful — earthy editorial, portrait crop hits phone+logo
    { id: 'r1b', img: '/glimpses/kufri-banner.png',  pos: '50% 38%'  }, // Kufri Zoo banners — portrait, crop to show both banners
    { id: 'r1c', img: '/glimpses/staple-cans.png',   pos: '50% 50%'  }, // Staple containers — nearly square, full bleed works
    { id: 'r1d', img: '/glimpses/dokitti-face.png',  pos: '50% 35%'  }, // Dokitti face — horizontal, crop to face
    { id: 'r1e', img: '/glimpses/service-design.png', pos: '55% 45%'  }, // Service design ecosystem map — crop to dense central cluster
    { id: 'r1f', img: '/glimpses/blr-dw-mobile.png', pos: '50% 48%'  }, // BLR DW mobile — wide, centre on phones
    { id: 'r1g', img: '/glimpses/getsetglobe.png',   pos: '50% 45%'  }, // Get Set Globe — devices mockup, centre
    { id: 'r1h', img: '/glimpses/taylors.png',       pos: '50% 42%'  }, // Taylors tea — portrait boxes, centre crop
  ],

  // Row 2 — scrolls left. Dark/illustrative/textured.
  [
    { id: 'r2a', img: '/glimpses/industrial.png',    pos: '50% 50%', fit: 'contain', bg: '#000000', filter: 'brightness(0.85) contrast(1.8)' }, // crush blacks to pure black
    { id: 'r2b', img: '/glimpses/kufri-badges.png',  pos: '50% 50%'  }, // Kufri Zoo badges — square, centred teal
    { id: 'r2c', img: '/glimpses/dokitti-sweater.png', pos: '50% 28%' }, // Dokitti sweater — portrait, crop to face+logo
    { id: 'r2d', img: '/glimpses/nike-infographic.png', pos: '50% 50%' }, // Nike infographic — landscape, centre spread
    { id: 'r2e', img: '/glimpses/kufri-tote.png',    pos: '50% 42%'  }, // Kufri Zoo tote — portrait, show bag fully
    { id: 'r2f', img: '/glimpses/staple-menu.png',   pos: '50% 45%'  }, // Staple menu — wide landscape, centre both pages
    { id: 'r2g', img: '/glimpses/staple-icons.png',  pos: '50% 40%'  }, // Staple icons — square, crop to icon grid
  ],
]

function MarqueeCard({ item }) {
  const contain = item.fit === 'contain'
  return (
    <div
      className="relative flex-shrink-0 rounded-[12px] overflow-hidden select-none"
      style={{ width: CARD_SIZE, height: CARD_SIZE, background: item.bg || '#111' }}
    >
      <img
        src={item.img} alt="" draggable={false}
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: contain ? 'contain' : 'cover',
          objectPosition: item.pos || '50% 50%',
          padding: contain ? '10%' : 0,
          filter: item.filter || 'none',
        }}
      />
      <div className="absolute inset-0 rounded-[12px]" style={{ boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.08)' }} />
    </div>
  )
}

function MarqueeRow({ items, reverse = false, speed = 45 }) {
  const doubled = [...items, ...items]
  return (
    <div
      className="marquee-track flex"
      style={{
        gap: '14px',
        width: 'max-content',
        animation: `${reverse ? 'marqueeR' : 'marqueeL'} ${speed}s linear infinite`,
        willChange: 'transform',
      }}
    >
      {doubled.map((item, i) => <MarqueeCard key={`${item.id}-${i}`} item={item} />)}
    </div>
  )
}

function MarqueeGallery() {
  return (
    // overflowX:clip clips horizontally without creating a scroll container,
    // so the perspective-rotated rows can overflow top/bottom naturally
    // and are covered by the tall top/bottom fades instead of hard-clipped.
    <section
      id="contact"
      style={{ background:'#060606', overflowX:'clip' }}
      className="relative border-t border-white/[0.04] pt-[clamp(4rem,7vw,6rem)]"
    >
      {/* Section header */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)] mb-[clamp(2.5rem,5vw,4rem)]">
        <Reveal>
          <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-5">
            <span className="inline-block w-4 h-[1px] bg-ink/18" />showcase of other projects
          </span>
        </Reveal>
        <MaskReveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]"
            style={{ fontSize:'clamp(2.5rem,6vw,5rem)' }}>
            Glimpses
          </h2>
        </MaskReveal>
      </div>

      {/* Left / right fades */}
      <div className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{ width:'22vw', background:'linear-gradient(to right,#060606 15%,transparent 100%)' }} />
      <div className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{ width:'22vw', background:'linear-gradient(to left,#060606 15%,transparent 100%)' }} />
      {/* Top / bottom fades */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{ height:'clamp(100px,14vw,180px)', background:'linear-gradient(to bottom,#060606 0%,transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{ height:'clamp(100px,14vw,180px)', background:'linear-gradient(to top,#060606 0%,transparent 100%)' }} />

      {/* Perspective tilt */}
      <div style={{ perspective:'1100px', perspectiveOrigin:'50% 50%' }}>
        <div
          style={{
            transform: 'rotateX(25deg) rotateZ(-5deg)',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
          className="flex flex-col gap-[14px]"
        >
          <MarqueeRow items={GALLERY_ROWS[1]} reverse={true}  speed={46} />
          <MarqueeRow items={GALLERY_ROWS[2]} reverse={false} speed={60} />
        </div>
      </div>

      {/* CTA — merged below the marquee */}
      <div className="relative z-20 text-center py-[clamp(5rem,9vw,8rem)]">
        {/* Glows */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width:800,height:500,background:'radial-gradient(ellipse,rgba(124,58,237,0.14) 0%,transparent 62%)' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width:400,height:250,background:'radial-gradient(ellipse,rgba(255,75,143,0.085) 0%,transparent 65%)' }} />
        <div className="relative max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
          <Reveal>
            <span className="flex items-center justify-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-8">
              <span className="inline-block w-4 h-[1px] bg-ink/18" />Let's work together
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.95] mb-14" style={{ fontSize:'clamp(2.75rem,7vw,6.5rem)' }}>
            <MaskReveal>Got a project?</MaskReveal>
            <MaskReveal delay={0.1}><em className="font-display not-italic" style={{ fontStyle:'italic', fontFamily:'"Cormorant Garamond", Georgia, serif', fontSize:'1.08em' }}>Let's talk.</em></MaskReveal>
          </h2>
          <Reveal delay={0.12} className="flex items-center justify-center gap-3 flex-wrap">
            <a href="mailto:zeusbatkhar.2000@gmail.com"
               className="relative overflow-hidden group/cta inline-flex items-center font-sans font-semibold text-bg bg-ink rounded-full tracking-[0.01em] transition-[transform,box-shadow] duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(242,237,228,0.15)]"
               style={{ fontSize:'0.8125rem', padding:'0.8125rem 1.75rem' }}>
              <span className="relative z-10">Get in touch ↗</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 ease-in-out" />
            </a>
            <a href="https://www.linkedin.com/in/zeusbatkhar" target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center font-sans font-medium text-ink rounded-full tracking-[0.01em] border border-white/[0.14] transition-[background,border-color,transform,box-shadow] duration-300 hover:bg-white/[0.06] hover:border-white/[0.26] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
               style={{ fontSize:'0.8125rem', padding:'0.8125rem 1.75rem' }}>LinkedIn ↗</a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// Module-level flag: resets on every page refresh, survives SPA navigation
let introPlayedThisLoad = false

// ─── Home ─────────────────────────────────────────────
// Flow: VideoIntro (once per page load) → Hero → Services → Work → VitalSigns → Professional Exposure → MarqueeGallery (+ CTA merged) → Footer
function Home() {
  const [introComplete, setIntroComplete] = useState(introPlayedThisLoad)

  const handleIntroComplete = () => {
    introPlayedThisLoad = true
    setIntroComplete(true)
  }

  return (
    <div style={{ background:'#060606' }} className="text-ink overflow-x-hidden">
      {!introComplete && <VideoIntro onComplete={handleIntroComplete} />}
      {introComplete && (
        <>
          <ProgressBar />
          <Nav />
          <SectionExit><Hero /></SectionExit>
          <SectionExit><Services /></SectionExit>
          <SectionExit><Work /></SectionExit>
          <SectionExit><VitalSigns /></SectionExit>
          <SectionExit><ProfessionalExposure /></SectionExit>
          <MarqueeGallery />
          <Footer />
        </>
      )}
    </div>
  )
}

// ─── App (Router) ──────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <CookieBanner />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/imprint" element={<Imprint />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/press" element={<Press />} />
          <Route path="/work/get-set-globe" element={<GetSetGlobe />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    <Analytics />
  )
}
