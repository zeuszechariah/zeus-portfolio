import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useScroll, useInView } from 'framer-motion'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EASE, SPRING_STIFF, Bolt, ProgressBar, Nav, Footer, MaskReveal, Reveal } from './shared.jsx'
import About from './About.jsx'

const PROJECTS = [
  { id:1, name:'Study Buddy',     tags:'UX Research · Mobile',   desc:'A peer learning platform designed to reduce cognitive overload for undergraduates through contextual nudges and adaptive scheduling.', color:'from-[#061528] via-[#0f2d52] to-[#1b4a8a]' },
  { id:2, name:'Get Set Globe',   tags:'EdTech · Product Design', desc:'An end-to-end travel-education experience helping young learners explore world cultures through gamified, story-driven modules.',      color:'from-[#050f08] via-[#0b2e16] to-[#135728]' },
  { id:3, name:'Malt & Machines', tags:'Data Viz · Experience',   desc:'A data-driven tasting experience blending whisky flavour profiling with interactive visualisations for connoisseurs and beginners.',   color:'from-[#0d0702] via-[#2e1606] to-[#7a430e]' },
  { id:4, name:'Infinity',        tags:'Space Tech · App Design', desc:'An app interface concept for low-orbit satellite operators — designed around mission-critical clarity and dark-environment legibility.', color:'from-[#040409] via-[#0e0e30] to-[#1a1060]' },
]

const SERVICES = [
  { n:'01', title:'UX Research & Strategy', desc:'Contextual inquiry, user interviews, journey mapping — synthesised into clear, actionable design direction.' },
  { n:'02', title:'Product Design',         desc:'End-to-end product thinking, from early concepts and flows through to polished, shippable interfaces.' },
  { n:'03', title:'Interaction Design',     desc:'Purposeful motion and micro-interactions that make products feel responsive and alive.' },
  { n:'04', title:'Design Systems',         desc:'Scalable component libraries and token-based systems built for teams that need to move fast without breaking things.' },
  { n:'05', title:'Prototyping & Testing',  desc:'High-fidelity prototypes for stakeholder alignment and validated usability testing with real users.' },
  { n:'06', title:'Visual / UI Design',     desc:'Crafted visual language — typography, colour, layout — that is both distinctive and functional.' },
]

const VITALS = [
  { stat:'06+',  label:'Years in Design',         desc:'Academic + Professional' },
  { stat:'80%',  label:'Time in Design Thinking', desc:'Discussions, sticky notes, mind-maps and more' },
  { stat:'20%',  label:'Time in Making',          desc:'Headphones and shifting pixels' },
  { stat:'100%', label:'Zeal',                    desc:'Trying my best (guaranteed)' },
]

// Placeholder until real logo files are provided
const LOGO_SLOTS = [
  { id:1, name:'Placeholder Co.', type:'Tech · Product' },
  { id:2, name:'Placeholder Co.', type:'EdTech · Startup' },
  { id:3, name:'Placeholder Co.', type:'FMCG · Brand' },
  { id:4, name:'Placeholder Co.', type:'Healthcare' },
  { id:5, name:'Placeholder Co.', type:'Finance · SaaS' },
  { id:6, name:'Placeholder Co.', type:'Retail · E-comm' },
  { id:7, name:'Placeholder Co.', type:'Media · Content' },
  { id:8, name:'Placeholder Co.', type:'Mobility · Travel' },
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
        hidden:  { opacity:0, y:20 },
        visible: { opacity:1, y:0, transition:{ duration:0.8, ease:EASE } },
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
    >{children}</motion.div>
  )
}


// ─── Hero Canvas (Delaunay, lightweight) ─────────────
function useDelaunayCanvas(canvasRef, heroRef) {
  useEffect(() => {
    const canvas = canvasRef.current, hero = heroRef.current
    if (!canvas || !hero) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = hero.offsetWidth, H = canvas.height = hero.offsetHeight
    const N = 40, HR = 90, BO = 0.035
    const col = (x, y) => {
      const nx=x/W, ny=y/H
      const TL=[255,128,8], TR=[255,200,55], BL=[255,100,8], BR=[255,180,20]
      return [
        TL[0]*(1-nx)*(1-ny)+TR[0]*nx*(1-ny)+BL[0]*(1-nx)*ny+BR[0]*nx*ny,
        TL[1]*(1-nx)*(1-ny)+TR[1]*nx*(1-ny)+BL[1]*(1-nx)*ny+BR[1]*nx*ny,
        TL[2]*(1-nx)*(1-ny)+TR[2]*nx*(1-ny)+BL[2]*(1-nx)*ny+BR[2]*nx*ny,
      ].map(Math.round)
    }
    const sg = new Float32Array(N)
    const m = { x: -9999, y: -9999, a: false }
    let pts = [], rest = [], tris = [], raf, mt

    const cc = (a,b,c) => {
      const D = 2*(a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y))
      if (Math.abs(D) < 1e-10) return null
      const ux = ((a.x*a.x+a.y*a.y)*(b.y-c.y)+(b.x*b.x+b.y*b.y)*(c.y-a.y)+(c.x*c.x+c.y*c.y)*(a.y-b.y))/D
      const uy = ((a.x*a.x+a.y*a.y)*(c.x-b.x)+(b.x*b.x+b.y*b.y)*(a.x-c.x)+(c.x*c.x+c.y*c.y)*(b.x-a.x))/D
      return { x:ux, y:uy, r:Math.hypot(a.x-ux, a.y-uy) }
    }

    const triangulate = () => {
      const n = pts.length, s1=n-3, s2=n-2, s3=n-1
      let ts = [{ a:s1, b:s2, c:s3 }]
      for (let i = 0; i < N; i++) {
        const p = pts[i]; let edges = []
        ts = ts.filter(t => {
          const c = cc(pts[t.a], pts[t.b], pts[t.c])
          if (c && Math.hypot(p.x-c.x, p.y-c.y) < c.r) {
            edges.push([t.a,t.b],[t.b,t.c],[t.c,t.a]); return false
          }
          return true
        })
        edges.filter((e,i) => !edges.some((f,j) => j!==i && ((f[0]===e[0]&&f[1]===e[1])||(f[0]===e[1]&&f[1]===e[0]))))
              .forEach(e => ts.push({ a:e[0], b:e[1], c:i }))
      }
      tris = ts.filter(t => t.a < N && t.b < N && t.c < N)
    }

    const init = () => {
      pts = []; rest = []
      const cols = Math.ceil(Math.sqrt(N*W/H)), rows = Math.ceil(N/cols)
      let idx = 0
      for (let r = 0; r < rows && idx < N; r++)
        for (let c = 0; c < cols && idx < N; c++, idx++) {
          const x = (c+.5+(Math.random()-.5)*.8)/cols*W
          const y = (r+.5+(Math.random()-.5)*.8)/rows*H
          pts.push({ x, y, vx:0, vy:0 }); rest.push({ x, y })
        }
      pts.push({ x:-W*2, y:-H }, { x:W*3, y:-H }, { x:W/2, y:H*3 })
      triangulate()
    }

    hero.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect()
      m.x = e.clientX - r.left; m.y = e.clientY - r.top; m.a = true
      clearTimeout(mt); mt = setTimeout(() => { m.a = false }, 200)
    })
    window.addEventListener('resize', () => {
      W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; init()
    }, { passive: true })

    let lastT = 0, frameCount = 0
    const INTERVAL = 1000 / 24  // 24fps cap

    const loop = (ts) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden || ts - lastT < INTERVAL) return
      lastT = ts; frameCount++
      ctx.clearRect(0, 0, W, H)

      // Update point physics
      let moved = 0
      for (let i = 0; i < N; i++) {
        const p = pts[i], rx = rest[i].x, ry = rest[i].y
        if (m.a) {
          const dx = m.x-p.x, dy = m.y-p.y, d = Math.hypot(dx, dy)
          if (d < HR*2 && d > 1) { const f = 1-d/(HR*2); p.vx += (dx/d)*f*3; p.vy += (dy/d)*f*3 }
        }
        p.vx += (rx-p.x)*.1; p.vy += (ry-p.y)*.1; p.vx *= .8; p.vy *= .8
        p.x += p.vx; p.y += p.vy
        moved += Math.abs(p.vx) + Math.abs(p.vy)
        const pd = m.a ? Math.hypot(p.x-m.x, p.y-m.y) : 9999
        const tg = Math.max(0, 1-pd/HR)
        sg[i] += (tg - sg[i]) * (tg > sg[i] ? .22 : .05)
      }

      // Re-triangulate only when moving significantly, max every 20 frames
      if (moved > 2 && frameCount % 20 === 0) triangulate()

      // Draw triangles
      for (const t of tris) {
        const a=pts[t.a], b=pts[t.b], c=pts[t.c]
        const cx=(a.x+b.x+c.x)/3, cy=(a.y+b.y+c.y)/3
        const d = Math.hypot(cx-m.x, cy-m.y)
        const hs = m.a ? Math.max(0, 1-d/HR) : 0
        const sf = m.a ? Math.max(0, 1-d/(HR*3.5))*.2 : 0
        const g = Math.max(hs, sf, (sg[t.a]+sg[t.b]+sg[t.c])/3*.5)
        const [cr,cg,cb] = col(cx, cy)
        ctx.globalAlpha = BO + g*.7
        ctx.lineWidth = .5 + g*1.5
        ctx.strokeStyle = `rgb(${Math.round(255*(1-g)+cr*g)},${Math.round(255*(1-g)+cg*g)},${Math.round(255*(1-g)+cb*g)})`
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath(); ctx.stroke()
      }

      // Draw dots
      for (let i = 0; i < N; i++) {
        ctx.globalAlpha = .25 + sg[i]*.5
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1, 0, Math.PI*2); ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    init(); raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [canvasRef, heroRef])
}

// ─── Hero ─────────────────────────────────────────────
function Hero() {
  const containerRef=useRef(null), heroRef=useRef(null), canvasRef=useRef(null), h1Ref=useRef(null)
  useDelaunayCanvas(canvasRef, heroRef)
  const headingInView = useInView(h1Ref, { once: false, amount: 0.4 })
  const { scrollYProgress } = useScroll({ target:containerRef, offset:['start start','end end'] })
  const scale        = useTransform(scrollYProgress, [0, 1],    [1, 0.84])
  const opacity      = useTransform(scrollYProgress, [0.5, 1.0],[1, 0])
  const borderRadius = useTransform(scrollYProgress, [0, 0.8],  ['0px','22px'])

  // Hero headline: dim → bright (flipped gradient)
  // Line 1 most muted, line 3 (italic) full white — reads bottom-up
  const lines = [
    { text:"I'm an Indian designer,",         cls:'font-sans font-semibold tracking-[-0.04em]', color:'rgba(242,237,228,1)' },
    { text:'global in practice, focused',     cls:'font-sans font-semibold tracking-[-0.04em]', color:'rgba(242,237,228,1)' },
    { text:'on structure, sensation, & more.',cls:'font-sans font-semibold tracking-[-0.04em]', color:'rgba(242,237,228,1)' },
  ]

  return (
    <div ref={containerRef} style={{ height:'160svh' }}>
      <motion.section ref={heroRef} id="hero"
        className="sticky top-0 flex flex-col justify-end overflow-hidden"
        style={{ height:'100svh', padding:'0 clamp(1.5rem,5vw,3.5rem) clamp(4rem,8vw,6rem)', scale, opacity, borderRadius, transformOrigin:'center center' }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex:0 }} />
        <div className="absolute pointer-events-none" style={{ width:'clamp(500px,60vw,820px)',height:'clamp(500px,60vw,820px)',borderRadius:'50%',top:'-25%',left:'-18%',zIndex:0,background:'radial-gradient(circle,rgba(124,58,237,0.085) 0%,transparent 65%)' }} />
        <div className="absolute pointer-events-none" style={{ width:'clamp(350px,42vw,600px)',height:'clamp(350px,42vw,600px)',borderRadius:'50%',bottom:'-12%',right:'-10%',zIndex:0,background:'radial-gradient(circle,rgba(255,75,143,0.055) 0%,transparent 65%)' }} />
        <div className="relative z-[2] w-full flex items-end justify-between gap-6">
          <h1 ref={h1Ref}>
            {lines.map(({ text, cls, color }, i) => (
              <div key={text} style={{ overflow:'hidden' }}>
                <motion.span
                  className={`block ${cls} hero-glow`}
                  style={{ fontSize:'clamp(1.575rem,3.85vw,3.675rem)', lineHeight:1.05, color, willChange:'clip-path', animationDelay: `${i * 0.4}s` }}
                  initial={{ clipPath:'inset(0 100% 0 0)' }}
                  animate={headingInView
                    ? { clipPath:'inset(0 0% 0 0)', transition:{ duration:1.5, ease:[0.4,0,0.8,1], delay: i * 0.2 } }
                    : { clipPath:'inset(0 100% 0 0)', transition:{ duration:0 } }
                  }
                >
                  {text}
                </motion.span>
              </div>
            ))}
          </h1>
          <motion.span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/40 flex-shrink-0 pb-[0.18em]"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, delay:1.4 }}>
            <span className="w-[7px] h-[7px] rounded-full bg-[#00FF87] availability-dot flex-shrink-0" />BLR, India
          </motion.span>
        </div>
      </motion.section>
    </div>
  )
}

// ─── Services ─────────────────────────────────────────
function Services() {
  return (
    <section style={{ background:'#060606' }} className="py-[clamp(7rem,13vw,11rem)] border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="mb-[clamp(3.5rem,6vw,5rem)]">
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

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/[0.06]">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}
              className={['flex items-baseline gap-5 py-[clamp(1.5rem,2.8vw,2.25rem)] border-b border-white/[0.06] group cursor-default',
                i % 2 === 0 ? 'md:pr-12 md:border-r' : 'md:pl-12'].join(' ')}>
              <span className="font-mono text-[0.55rem] tracking-[0.12em] text-ink/22 tabular-nums flex-shrink-0 pt-[0.2em]">{s.n}</span>
              <h3 className="font-sans font-semibold text-ink/60 tracking-[-0.022em] group-hover:text-ink transition-colors duration-500"
                  style={{ fontSize:'clamp(1.125rem,2vw,1.5rem)' }}>
                <MaskReveal>{s.title}</MaskReveal>
              </h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Project Card ─────────────────────────────────────
function ProjectCard({ project, delay = 0 }) {
  const ref=useRef(null), inView=useInView(ref,{ once:true, amount:0.06 })
  const mockupY=useMotionValue(0), sMockupY=useSpring(mockupY, SPRING_STIFF)
  return (
    <motion.div ref={ref} className="group relative h-full"
      initial={{ opacity:0, y:36 }} animate={inView?{ opacity:1, y:0 }:{}} transition={{ duration:0.85, ease:EASE, delay }}>
      <TiltCard className="h-full flex flex-col rounded-[18px] overflow-hidden cursor-pointer border border-black/[0.07]" style={{ background:'#EAEAEA' }}>
        <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio:'2/3' }}>
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
        </div>
        <div className="flex-1 p-[clamp(1rem,2vw,1.375rem)]">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div>
              <p className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-black/38 mb-[0.35rem]">{project.tags}</p>
              <h3 className="font-sans font-semibold text-black tracking-[-0.022em]" style={{ fontSize:'clamp(1rem,1.6vw,1.2rem)', lineHeight:1.2 }}>
                <MaskReveal>{project.name}</MaskReveal>
              </h3>
            </div>
            <span className="w-[28px] h-[28px] rounded-full border border-black/15 flex items-center justify-center text-[0.65rem] text-black/40 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-hover:border-black/30 flex-shrink-0">↗</span>
          </div>
          <p className="font-sans text-black/42 leading-[1.7]" style={{ fontSize:'clamp(0.72rem,0.9vw,0.8rem)' }}>{project.desc}</p>
        </div>
      </TiltCard>
    </motion.div>
  )
}

// ─── Work ─────────────────────────────────────────────
function Work() {
  return (
    <section id="work" style={{ background:'#ffffff' }} className="py-[clamp(7rem,13vw,11rem)]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="flex items-end justify-between mb-[clamp(3rem,5.5vw,4.5rem)] gap-6 flex-wrap">
          <div>
            <Reveal>
              <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-black/30 mb-5">
                <span className="inline-block w-4 h-[1px] bg-black/18" />Selected Work — 2021–2025
              </span>
            </Reveal>
            <h2 className="font-sans font-semibold text-black tracking-[-0.04em] leading-[0.93]" style={{ fontSize:'clamp(2.5rem,6vw,5rem)' }}>
              <MaskReveal>Work</MaskReveal>
            </h2>
          </div>
          <a href="#" className="font-mono text-[0.7rem] tracking-[0.08em] uppercase text-black/35 relative group/link pb-[2px] hover:text-black transition-colors">
            All projects ↗
            <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-black/35 transition-all duration-300 group-hover/link:w-full" style={{ transitionTimingFunction:'cubic-bezier(0.16,1,0.3,1)' }} />
          </a>
        </div>
        <div className="grid grid-cols-4 gap-[clamp(0.625rem,1vw,0.875rem)] items-stretch">
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
    <div ref={ref} className={['flex flex-col p-[clamp(1.75rem,3vw,2.5rem)]',index<3?'lg:border-r border-white/[0.06]':'',index<2?'border-b lg:border-b-0 border-white/[0.06]':'',index===1?'border-r border-white/[0.06] lg:border-r':''].join(' ')}>
      <div style={{ minHeight:'5.5rem',display:'flex',alignItems:'flex-end',paddingBottom:'0.625rem' }}>
        <p className="font-sans font-semibold text-ink leading-none tracking-[-0.03em]" style={{ fontSize:'clamp(2.75rem,5vw,4.5rem)' }}>{display}</p>
      </div>
      <p className="font-display italic text-ink leading-snug mb-2" style={{ fontSize:'clamp(1rem,1.4vw,1.1875rem)' }}>{v.label}</p>
      <p className="font-sans text-ink/38 leading-[1.65]" style={{ fontSize:'clamp(0.75rem,1vw,0.875rem)' }}>{v.desc}</p>
    </div>
  )
}

// ─── Vital Signs ──────────────────────────────────────
function VitalSigns() {
  return (
    <section style={{ background:'#060606' }} className="py-[clamp(5rem,10vw,8.5rem)] border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <Reveal className="mb-10">
          <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32">
            <span className="inline-block w-4 h-[1px] bg-ink/18" />(Not so) Vital Signs
          </span>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-[18px] overflow-hidden border border-white/[0.06]"
             style={{ background:'#0d0d0d',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          {VITALS.map((v,i) => <VitalStatCell key={v.label} v={v} index={i} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Professional Exposure ────────────────────────────
function ProfessionalExposure() {
  return (
    <section id="about" style={{ background:'#060606' }} className="py-[clamp(7rem,13vw,11rem)] border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="mb-[clamp(3.5rem,6vw,5rem)]">
          <Reveal>
            <span className="flex items-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-5">
              <span className="inline-block w-4 h-[1px] bg-ink/18" />Brands & Studios
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]" style={{ fontSize:'clamp(2.5rem,6vw,5rem)' }}>
            <MaskReveal>Professional</MaskReveal>
            <MaskReveal delay={0.1}>Exposure.</MaskReveal>
          </h2>
          <Reveal delay={0.15}>
            <p className="font-sans text-ink/40 leading-[1.8] mt-5 max-w-[44ch]" style={{ fontSize:'clamp(0.875rem,1.1vw,0.9375rem)' }}>
              Brands, studios, and organisations I've had the privilege of designing for.
            </p>
          </Reveal>
        </div>

        {/* Logo grid — placeholders until real assets are provided */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] rounded-[18px] overflow-hidden border border-white/[0.06]"
             style={{ background:'rgba(255,255,255,0.04)' }}>
          {LOGO_SLOTS.map((slot, i) => (
            <Reveal key={slot.id} delay={i * 0.06}
              className="flex flex-col items-center justify-center gap-3 bg-[#060606] p-[clamp(2rem,4vw,3.5rem)] cursor-default group transition-colors duration-300 hover:bg-white/[0.02]"
            >
              {/* Placeholder logo box — swap with <img> when assets arrive */}
              <div className="w-full max-w-[140px] rounded-lg border border-dashed border-white/[0.12] flex items-center justify-center group-hover:border-white/20 transition-colors duration-300"
                   style={{ aspectRatio:'3/1.4', background:'rgba(255,255,255,0.025)' }}>
                <span className="font-mono text-[0.55rem] tracking-[0.12em] uppercase text-ink/22">Logo {slot.id}</span>
              </div>
              <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-ink/20">{slot.type}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────
function CTA() {
  const ref=useRef(null), inView=useInView(ref,{ once:true, amount:0.3 })
  return (
    <section id="contact" style={{ background:'#060606' }} className="py-[clamp(7rem,14vw,12rem)] border-t border-white/[0.04] text-center relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width:700,height:450,background:'radial-gradient(ellipse,rgba(124,58,237,0.07) 0%,transparent 65%)' }} />
      <div className="relative max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <Reveal>
          <span className="flex items-center justify-center gap-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-8">
            <span className="inline-block w-4 h-[1px] bg-ink/18" />Let's work together
          </span>
        </Reveal>
        <h2 ref={ref} className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.95] mb-14" style={{ fontSize:'clamp(2.75rem,7vw,6.5rem)' }}>
          <MaskReveal>Got a project?</MaskReveal>
          <MaskReveal delay={0.1}><em className="font-display" style={{ fontStyle:'italic' }}>Let's talk.</em></MaskReveal>
        </h2>
        <Reveal delay={0.12} className="flex items-center justify-center gap-3 flex-wrap">
          <a href="mailto:zeusbatkhar.2000@gmail.com"
             className="inline-flex items-center font-sans font-semibold text-bg bg-ink rounded-full tracking-[0.01em] transition-[opacity,transform] duration-300 hover:opacity-88 hover:-translate-y-[1px]"
             style={{ fontSize:'0.8125rem',padding:'0.8125rem 1.625rem' }}>zeusbatkhar.2000@gmail.com</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center font-sans font-medium text-ink rounded-full tracking-[0.01em] border border-white/[0.14] transition-[background,border-color,transform] duration-300 hover:bg-white/[0.05] hover:border-white/[0.22] hover:-translate-y-[1px]"
             style={{ fontSize:'0.8125rem',padding:'0.8125rem 1.625rem' }}>LinkedIn ↗</a>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Home ─────────────────────────────────────────────
// Flow: Hero → Services → Work → VitalSigns → Professional Exposure → CTA → Footer
function Home() {
  return (
    <div style={{ background:'#060606' }} className="text-ink overflow-x-hidden">
      <ProgressBar />
      <Nav />
      <Hero />
      <Services />
      <Work />
      <VitalSigns />
      <ProfessionalExposure />
      <CTA />
      <Footer />
    </div>
  )
}

// ─── App (Router) ──────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
