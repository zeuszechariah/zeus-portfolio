import { Analytics } from '@vercel/analytics/react'
import { useRef, useEffect, useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useInView, useScroll } from 'framer-motion'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { EASE, SPRING_STIFF, Bolt, ProgressBar, Nav, Footer, MaskReveal, Reveal, CookieBanner, SectionExit, HeroButton } from './shared.jsx'
import WhatIDo from './WhatIDo.jsx'
import PersonalGallery from './PersonalGallery.jsx'
const About        = lazy(() => import('./About.jsx'))
const Imprint      = lazy(() => import('./Imprint.jsx'))
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy.jsx'))
const Press        = lazy(() => import('./Press.jsx'))
const GetSetGlobe  = lazy(() => import('./GetSetGlobe.jsx'))
const StudyBuddy   = lazy(() => import('./StudyBuddy.jsx'))
const Finance      = lazy(() => import('./Finance.jsx'))
const Aadhaar      = lazy(() => import('./Aadhaar.jsx'))
const CloutCart    = lazy(() => import('./CloutCart.jsx'))

const PROJECTS = [
  { id:1, name:'Study Buddy',     tags:'UX Research · Mobile',   desc:'Rethinking how Indian students study & building habits that actually stick.', color:'from-[#061528] via-[#0f2d52] to-[#1b4a8a]', pitch:'https://pitch.com/v/study-buddy-pqwx5j', thumb:'/thumnail-1-opt.gif', slug:'/work/study-buddy',   filterKeys:['ux','research'] },
  { id:2, name:'Get Set Globe',   tags:'EdTech · Product Design', desc:'Making Earth science something children feel, not just memorise.', color:'from-[#050f08] via-[#0b2e16] to-[#135728]', thumb:'/thumb-getsetglobe.jpg', thumbPos:'50% 0%', slug:'/work/get-set-globe',  filterKeys:['ux','system']   },
  { id:3, name:'Spectra',         tags:'Data Viz · Experience',   desc:'Two invisible threats, one shared sky. Mapping the overlap of air and light pollution across urban India.', color:'from-[#0d0702] via-[#2e1606] to-[#7a430e]', pitch:'https://pitch.com/v/spectra-2vnqiq', thumb:'/thumb-spectra-opt.jpg', thumbPos:'50% 15%', thumbFilter:'saturate(0.75)', filterKeys:['branding','ux'] },
  { id:4, name:'Finance for semi/less literate', tags:'Research · Social Design', desc:'Researching financial literacy through scam resilience and financial literacy.', color:'from-[#040409] via-[#0e0e30] to-[#1a1060]', pitch:'https://canva.link/ryd4ojcrh70b9qq', thumb:'/thumb-finance.jpg', thumbBg:'#EEF3DF', slug:'/work/finance', filterKeys:['research']       },
  { id:5, name:'Aadhaar Research', tags:'UX Research · Social Design', desc:'Mapping the invisible friction elderly citizens face when Aadhaar fails them in moments of urgency.', color:'from-[#0A1E1E] via-[#075959] to-[#0D7878]', slug:'/work/aadhaar', filterKeys:['research','ux']  },
  { id:6, name:'CloutCart', tags:'Product Strategy · Creator Economy', desc:'Where brands cart their next collab. A vibe-led influencer-enterprise matchmaking platform.', color:'from-[#1A0A2E] via-[#3B0764] to-[#6D28D9]', slug:'/work/cloutcart', filterKeys:['system','ux']    },
]

const FILTER_TABS = [
  { key: 'all',      label: 'All' },
  { key: 'ux',       label: 'UX' },
  { key: 'research', label: 'Research Case Study' },
  { key: 'system',   label: 'System & Service' },
  { key: 'branding', label: 'Branding' },
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

    const N = 55
    const HOVER_RADIUS = 90
    const BASE_OPACITY = 0.045
    let W, H, points, restPoints, triangles, retriFrame
    const smoothGlow = new Float32Array(N)
    const triGlow = new Float32Array(500)
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

      // ── Vertices (star points — bright with glow) ──
      for (let i=0;i<N;i++) {
        const p=points[i], g=smoothGlow[i]
        const baseAlpha = 0.72 + g * 0.28
        const r = 0.8 + g * 1.2
        // Outer glow halo
        ctx.shadowBlur = 5 + g * 10
        ctx.shadowColor = `rgba(242,237,228,${0.55 + g * 0.45})`
        ctx.globalAlpha = baseAlpha
        ctx.fillStyle = '#F2EDE4'
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      ctx.shadowColor = 'transparent'

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
        background: '#000000',
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
            'linear-gradient(to bottom, #000000 0%, transparent 18%)',
            'linear-gradient(to top,    #000000 0%, transparent 18%)',
            'linear-gradient(to right,  #000000 0%, transparent 14%)',
            'linear-gradient(to left,   #000000 0%, transparent 14%)',
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

// ─── Enneagram SVG ────────────────────────────────────
// Outer nonagon (9-sided polygon) + triangle (3-6-9) + hexad (1-4-2-8-5-7-1).
// Stroke uses a diagonal gradient: mid-grey → white → mid-grey.
function Enneagram({ size = 700 }) {
  const cx = size / 2
  const cy = size / 2
  const r  = size * 0.44
  const sw = 0.5

  const pts = Array.from({ length: 9 }, (_, i) => {
    const a = ((i * 40) - 90) * (Math.PI / 180)
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })
  const p = (n) => pts[n === 9 ? 0 : n]

  const poly = (nodes) =>
    nodes.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ') + 'Z'

  const nonagon  = poly([p(9), p(1), p(2), p(3), p(4), p(5), p(6), p(7), p(8)])
  const triangle = poly([p(9), p(3), p(6)])
  const hexad    = poly([p(1), p(4), p(2), p(8), p(5), p(7)])

  const [x6, y6] = p(6)
  const [x7, y7] = p(7)

  const BOLT_H = 54
  const BOLT_W = BOLT_H * (10 / 16)
  const bScale = BOLT_H / 16

  // Timing (seconds)
  const T_NONAGON  = { delay: 0.2,  duration: 1.8 }
  const T_TRIANGLE = { delay: 1.6,  duration: 1.4 }
  const T_HEXAD    = { delay: 2.4,  duration: 1.8 }
  const T_DOTS     = { delay: 4.0 }
  const T_LABELS   = { delay: 4.4 }
  const T_BOLT     = { delay: 4.2 }

  const pathProps = (timing) => ({
    stroke:          'url(#ennea-sg)',
    strokeWidth:     sw,
    strokeLinejoin:  'miter',
    fill:            'none',
    initial:         { pathLength: 0, opacity: 0 },
    animate:         { pathLength: 1, opacity: 1 },
    transition: {
      pathLength: { delay: timing.delay, duration: timing.duration, ease: 'easeInOut' },
      opacity:    { delay: timing.delay, duration: 0.01 },
    },
  })

  const LABEL_STYLE = {
    fontFamily:    "'Space Mono', monospace",
    fontSize:      '9px',
    letterSpacing: '0.12em',
  }

  return (
    <svg
      className="ennea-glow"
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="ennea-sg" x1="0" y1="0" x2={size} y2={size} gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#8a8a8a" stopOpacity="0.55" />
          <stop offset="40%"  stopColor="#F2EDE4" stopOpacity="0.90" />
          <stop offset="70%"  stopColor="#ffffff" stopOpacity="1.00" />
          <stop offset="100%" stopColor="#7a7a7a" stopOpacity="0.45" />
        </linearGradient>
        <filter id="dot-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="bolt-glow" x="-180%" y="-160%" width="460%" height="420%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="outerBloom" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="4"  result="innerGlow" />
          <feMerge>
            <feMergeNode in="outerBloom" />
            <feMergeNode in="innerGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Phase 1: draw paths ── */}
      <motion.path d={nonagon}  {...pathProps(T_NONAGON)} />
      <motion.path d={triangle} {...pathProps(T_TRIANGLE)} />
      <motion.path d={hexad}    {...pathProps(T_HEXAD)} />

      {/* ── Phase 2: dots bounce in ── */}
      {/* Wrap in translated <g> so scale origin = circle centre */}
      <motion.g
        style={{ originX: x6, originY: y6 }}
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ delay: T_DOTS.delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <circle cx={x6} cy={y6} r={4} fill="#7C3AED" filter="url(#dot-glow)" />
      </motion.g>

      <motion.g
        style={{ originX: x7, originY: y7 }}
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ delay: T_DOTS.delay + 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <circle cx={x7} cy={y7} r={4} fill="#FF4B8F" filter="url(#dot-glow)" />
      </motion.g>

      {/* ── Phase 3: labels fade in ── */}
      <motion.text
        x={x6 - 12} y={y6 + 4} textAnchor="end"
        fill="rgba(242,237,228,0.58)" {...LABEL_STYLE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: T_LABELS.delay, duration: 0.7 }}
      >
        The Troubleshooter
      </motion.text>

      <motion.text
        x={x7 - 12} y={y7 + 4} textAnchor="end"
        fill="rgba(242,237,228,0.58)" {...LABEL_STYLE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: T_LABELS.delay + 0.15, duration: 0.7 }}
      >
        The Enthusiast
      </motion.text>

      {/* ── Phase 3: bolt fades + scales in ── */}
      <motion.g
        style={{ originX: cx, originY: cy }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: T_BOLT.delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        filter="url(#bolt-glow)"
      >
        <g transform={`translate(${cx - BOLT_W / 2}, ${cy - BOLT_H / 2}) scale(${bScale})`}>
          <g transform="scale(-1,1) translate(-10,0)">
            <path d="M7.5 0L0.5 9H5L2 16L9.5 7H5L7.5 0Z" fill="#F2EDE4" />
          </g>
        </g>
      </motion.g>
    </svg>
  )
}

// ─── Smoke Canvas ────────────────────────────────────
// 9 independent plumes, each drawn in two passes (core + halo)
// using ctx.createRadialGradient + ctx.filter blur.
// globalCompositeOperation='lighter' makes overlapping plumes bloom.
// Smoke anchored to right-centre; left ~28% stays pure black.
function SmokeCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let rafId = null, W = 0, H = 0

    // rx/ry   — rest position as viewport fraction
    // sxf/syf — ellipse size as viewport fraction
    // alpha   — peak opacity
    // speed   — animation rate (rad/ms)
    // phase   — offset so no two plumes sync
    // drift   — lateral oscillation amplitude
    // cb/hb   — core blur px / halo blur px
    const PLUMES = [
      // Primary mass — right centre, large, brightest
      { rx:0.72, ry:0.50, sxf:0.22, syf:0.58, alpha:0.42, speed:0.00027, phase:0.00, drift:0.036, cb:32, hb:134 },
      // Upper lobe
      { rx:0.80, ry:0.28, sxf:0.18, syf:0.46, alpha:0.34, speed:0.00035, phase:1.40, drift:0.030, cb:26, hb:116 },
      // Lower lobe
      { rx:0.78, ry:0.72, sxf:0.20, syf:0.52, alpha:0.36, speed:0.00031, phase:2.80, drift:0.033, cb:28, hb:122 },
      // Far-right anchor (tall, soft)
      { rx:0.91, ry:0.50, sxf:0.24, syf:0.68, alpha:0.38, speed:0.00024, phase:0.60, drift:0.024, cb:34, hb:142 },
      // Mid-right filler
      { rx:0.65, ry:0.55, sxf:0.15, syf:0.38, alpha:0.24, speed:0.00042, phase:3.50, drift:0.042, cb:22, hb: 98 },
      // Top drift accent
      { rx:0.76, ry:0.16, sxf:0.14, syf:0.30, alpha:0.20, speed:0.00050, phase:1.80, drift:0.036, cb:20, hb: 86 },
    ]

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function draw(T) {
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      for (const pl of PLUMES) {
        const x  = W * (pl.rx + Math.sin(T * pl.speed + pl.phase)       * pl.drift)
        const y  = H * (pl.ry + Math.cos(T * pl.speed * 0.7 + pl.phase) * pl.drift * 0.5)
        const cW = W * pl.sxf
        const cH = H * pl.syf

        // Pass 1 — tight bright core
        ctx.filter = `blur(${pl.cb}px)`
        const cg = ctx.createRadialGradient(x, y, 0, x, y, cW * 0.55)
        cg.addColorStop(0,    `rgba(255,255,255,${pl.alpha * 0.90})`)
        cg.addColorStop(0.45, `rgba(255,255,255,${pl.alpha * 0.30})`)
        cg.addColorStop(1,    'rgba(255,255,255,0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.ellipse(x, y, cW * 0.55, cH * 0.50, 0, 0, Math.PI * 2)
        ctx.fill()

        // Pass 2 — wide atmospheric halo
        ctx.filter = `blur(${pl.hb}px)`
        const hg = ctx.createRadialGradient(x, y, 0, x, y, cW * 2.0)
        hg.addColorStop(0,    `rgba(255,255,255,${pl.alpha * 0.13})`)
        hg.addColorStop(0.55, `rgba(255,255,255,${pl.alpha * 0.04})`)
        hg.addColorStop(1,    'rgba(255,255,255,0)')
        ctx.fillStyle = hg
        ctx.beginPath()
        ctx.ellipse(x, y, cW * 2.4, cH * 2.0, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.filter = 'none'
      ctx.globalCompositeOperation = 'source-over'
    }

    let t0 = null
    function loop(ts) {
      if (t0 === null) t0 = ts
      draw(ts - t0)
      rafId = requestAnimationFrame(loop)
    }

    let visible = false
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !rafId) rafId = requestAnimationFrame(loop)
      else if (!visible && rafId) { cancelAnimationFrame(rafId); rafId = null }
    }, { threshold: 0.01 })
    observer.observe(canvas)

    const onResize = () => resize()
    window.addEventListener('resize', onResize, { passive: true })
    resize()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:0 }}
    />
  )
}

// ─── Hero ─────────────────────────────────────────────
function Hero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])

  return (
    <section ref={heroRef} id="main-content" className="hero" style={{ background:'#000000' }}>

      {/* Background image — parallax + gentle breathing zoom */}
      <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
        <motion.img
          src="/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width:'100%', height:'112%',
            objectFit:'cover', objectPosition:'50% 40%',
            filter:'contrast(1.22) brightness(0.78) saturate(1.08)',
            y: parallaxY,
            top: '-6%',
            position: 'absolute',
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Dark overlay */}
      <div aria-hidden="true" style={{ position:'absolute', inset:0, zIndex:1, background:'rgba(0,0,0,0.30)', pointerEvents:'none' }} />

      {/* Edge fades — all 4 sides bleed into site BG #000000 */}
      <div aria-hidden="true" style={{
        position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
        background: [
          'linear-gradient(to bottom, #000000 0%, transparent 20%)',
          'linear-gradient(to top,    #000000 0%, transparent 32%)',
          'linear-gradient(to right,  #000000 0%, transparent 24%)',
          'linear-gradient(to left,   #000000 0%, transparent 24%)',
        ].join(', '),
      }} />

      {/* Film grain */}

      {/* Content — centred column */}
      <div style={{
        position:'relative', zIndex:4,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        textAlign:'center',
        padding:'0 clamp(2rem, 8vw, 8rem)',
        width:'100%',
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity:0, y:14 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55, delay:0.20, ease:EASE }}
          style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            borderRadius:'100px',
            border:'1px solid rgba(255,255,255,0.13)',
            background:'rgba(6,6,6,0.60)',
            backdropFilter:'blur(16px)',
            WebkitBackdropFilter:'blur(16px)',
            padding:'5px 14px',
            marginBottom:'clamp(1.25rem, 3vw, 2.25rem)',
          }}
        >
          <span className="availability-dot" style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e', flexShrink:0 }} />
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'9.5px', letterSpacing:'0.20em', textTransform:'uppercase', color:'rgba(255,255,255,0.58)' }}>
            BLR, India
          </span>
        </motion.div>

        {/* Headline — Syne 300 body, EB Garamond for "structure, sensation & more" */}
        <motion.h1
          initial={{ opacity:0, y:22 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.80, delay:0.40, ease:EASE }}
          style={{
            fontFamily:    "'Syne', sans-serif",
            fontWeight:    300,
            fontSize:      'clamp(30px, 4.0vw, 62px)',
            color:         '#ffffff',
            lineHeight:    1.08,
            letterSpacing: '-0.03em',
            textAlign:     'center',
            margin:        0,
            maxWidth:      'min(90vw, 900px)',
            textShadow:    '0 0 60px rgba(255,255,255,0.22), 0 0 22px rgba(255,255,255,0.14), 0 0 8px rgba(255,255,255,0.08)',
          }}
        >
          I'm an Indian designer,<br />
          global in practice, focused on<br />
          <span style={{ fontFamily:"'EB Garamond', Georgia, serif", fontWeight:400 }}>
            structure, sensation{' '}
            <em style={{ fontStyle:'italic' }}>&amp;</em>
            {' '}more
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity:0, y:14 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.60, delay:0.65, ease:EASE }}
          style={{
            fontFamily:    "'Syne', sans-serif",
            fontWeight:    300,
            fontSize:      'clamp(0.75rem, 1vw, 0.875rem)',
            color:         'rgba(255,255,255,0.36)',
            lineHeight:    1.6,
            margin:        'clamp(1rem, 2.2vw, 1.75rem) 0 0',
            letterSpacing: '0.01em',
          }}
        >
          Interaction Designer
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity:0, y:12 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55, delay:0.85, ease:EASE }}
          style={{ marginTop:'clamp(5rem, 9vw, 8rem)' }}
        >
          <HeroButton href="mailto:zeusbatkhar.2000@gmail.com">
            Get in touch
          </HeroButton>
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

// ─── Work Canvas (Delaunay — dark ink on cream) ───────
function WorkCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const N = 55
    const HOVER_RADIUS = 90
    const BASE_OPACITY = 0.032
    let W, H, points, restPoints, triangles, retriFrame
    const smoothGlow = new Float32Array(N)
    const triGlow    = new Float32Array(500)
    const mouse = { x: -9999, y: -9999, active: false }
    let mouseTimer

    function getGlowColor(x, y) {
      const nx = x / W, ny = y / H
      return [
        Math.round(120*(1-nx)*(1-ny) + 160*nx*(1-ny) + 80*(1-nx)*ny  + 140*nx*ny),
        Math.round( 55*(1-nx)*(1-ny) +  90*nx*(1-ny) + 35*(1-nx)*ny  +  70*nx*ny),
        Math.round(  5*(1-nx)*(1-ny) +  18*nx*(1-ny) +  2*(1-nx)*ny  +  10*nx*ny),
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

      let totalMov = 0
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

      const len = triangles.length
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

      // Pass 1 — base hairline triangles
      ctx.globalAlpha = BASE_OPACITY
      ctx.strokeStyle = 'rgba(26,14,4,0.80)'
      ctx.lineWidth   = 0.4
      ctx.beginPath()
      for (let k=0;k<len;k++) {
        if (triGlow[k]<0.04) {
          const t=triangles[k],a=points[t.a],b=points[t.b],c=points[t.c]
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath()
        }
      }
      ctx.stroke()

      // Pass 2 — glowing triangles (warm amber)
      for (let k=0;k<len;k++) {
        const g=triGlow[k]
        if (g<0.04) continue
        const t=triangles[k],a=points[t.a],b=points[t.b],c=points[t.c]
        const mx=(a.x+b.x+c.x)/3,my=(a.y+b.y+c.y)/3
        const [cr,cg,cb]=getGlowColor(mx,my)
        const inv=1-g
        ctx.globalAlpha=Math.min(1, BASE_OPACITY+g*1.1)
        ctx.lineWidth=0.4+g*0.7
        ctx.strokeStyle=`rgb(${Math.round(26*inv+cr*g)},${Math.round(14*inv+cg*g)},${Math.round(4*inv+cb*g)})`
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath(); ctx.stroke()
      }

      // Vertices
      for (let i=0;i<N;i++) {
        const p=points[i], g=smoothGlow[i]
        ctx.shadowBlur  = g>0.05 ? 4+g*8 : 0
        ctx.shadowColor = `rgba(140,70,10,${0.4+g*0.6})`
        ctx.globalAlpha = 0.22+g*0.55
        ctx.fillStyle   = g>0.05 ? `rgb(${Math.round(100+g*60)},${Math.round(50+g*30)},${Math.round(5+g*10)})` : 'rgba(26,14,4,0.9)'
        ctx.beginPath(); ctx.arc(p.x,p.y,0.7+g*1.0,0,Math.PI*2); ctx.fill()
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

// ─── Work ─────────────────────────────────────────────
function Work() {
  const [activeFilter, setActiveFilter] = useState('all')
  const filtered = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.filterKeys.includes(activeFilter))

  return (
    <section id="work" style={{ background:'#F2EDE4', boxShadow:'inset 0 0 160px rgba(6,6,6,0.22), inset 0 60px 80px -20px rgba(6,6,6,0.14), inset 0 -60px 80px -20px rgba(6,6,6,0.14)' }} className="relative overflow-hidden py-[clamp(4rem,6.5vw,6rem)]">
      <div className="relative z-[1] max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="flex items-end justify-between mb-[clamp(2rem,4vw,3rem)] gap-6 flex-wrap">
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

          {/* Filter pills */}
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', alignItems:'center', paddingBottom:'4px' }}>
            {FILTER_TABS.map(tab => {
              const active = activeFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  style={{
                    fontFamily:    "'Space Mono', monospace",
                    fontSize:      '0.575rem',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    padding:       '0.45rem 1rem',
                    borderRadius:  '100px',
                    border:        active ? '1px solid transparent' : '1px solid rgba(0,0,0,0.13)',
                    background:    active ? '#111111' : 'transparent',
                    color:         active ? '#F2EDE4' : 'rgba(0,0,0,0.42)',
                    cursor:        'pointer',
                    transition:    'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
                    whiteSpace:    'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(0.625rem,1vw,0.875rem)] items-stretch">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28, ease: EASE, delay: i * 0.04 }}
                className="h-full"
              >
                <ProjectCard project={p} delay={0} />
              </motion.div>
            ))}
          </AnimatePresence>
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
    <section style={{ background:'#000000' }} className="py-[clamp(3.5rem,5.5vw,5rem)] border-t border-white/[0.04] relative overflow-hidden">
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
    <section id="about" style={{ background:'#000000' }} className="py-[clamp(4rem,6.5vw,6rem)] border-t border-white/[0.04] relative overflow-hidden">
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
              className="flex flex-col items-center justify-center gap-4 bg-[#000000] p-[clamp(2rem,4vw,3rem)] cursor-default"
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
      style={{ background:'#000000', overflowX:'clip' }}
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
        style={{ width:'22vw', background:'linear-gradient(to right,#000000 15%,transparent 100%)' }} />
      <div className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{ width:'22vw', background:'linear-gradient(to left,#000000 15%,transparent 100%)' }} />
      {/* Top / bottom fades */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{ height:'clamp(100px,14vw,180px)', background:'linear-gradient(to bottom,#000000 0%,transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{ height:'clamp(100px,14vw,180px)', background:'linear-gradient(to top,#000000 0%,transparent 100%)' }} />

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
            <MaskReveal delay={0.1}><em className="font-display not-italic" style={{ fontStyle:'italic', fontFamily:'"EB Garamond", Georgia, serif', fontSize:'1.08em' }}>Let's talk.</em></MaskReveal>
          </h2>
          <Reveal delay={0.12} className="flex items-center justify-center gap-3 flex-wrap">
            <HeroButton href="mailto:zeusbatkhar.2000@gmail.com">Get in touch ↗</HeroButton>
            <HeroButton href="https://www.linkedin.com/in/zeusbatkhar" target="_blank" rel="noopener noreferrer">LinkedIn ↗</HeroButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// Module-level flag: resets on every page refresh, survives SPA navigation
let introPlayedThisLoad = false

// ─── Home ─────────────────────────────────────────────
// Flow: VideoIntro (once per page load) → Hero → WhatIDo → Work → VitalSigns → Professional Exposure → MarqueeGallery (+ CTA merged) → Footer
function Home() {
  const [introComplete, setIntroComplete] = useState(introPlayedThisLoad)

  const handleIntroComplete = () => {
    introPlayedThisLoad = true
    setIntroComplete(true)
  }

  return (
    <div style={{ background:'#000000' }} className="text-ink overflow-x-hidden">
      {!introComplete && <VideoIntro onComplete={handleIntroComplete} />}
      {introComplete && (
        <>
          <ProgressBar />
          <Nav />
          <SectionExit><Hero /></SectionExit>
          <PersonalGallery />
          <WhatIDo />
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
    <>
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
            <Route path="/work/study-buddy" element={<StudyBuddy />} />
            <Route path="/work/finance" element={<Finance />} />
            <Route path="/work/aadhaar" element={<Suspense fallback={null}><Aadhaar /></Suspense>} />
            <Route path="/work/cloutcart" element={<Suspense fallback={null}><CloutCart /></Suspense>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </>
  )
}
