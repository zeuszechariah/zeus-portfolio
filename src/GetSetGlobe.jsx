import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProgressBar, Nav, Footer, MaskReveal, Reveal } from './shared.jsx'

// ─── Palette ───────────────────────────────────────────
const L = '#f5f4f0'
const D = '#0f0f0f'

// ─── Sections ─────────────────────────────────────────
const SECTIONS = [
  { id:'overview',     label:'Overview' },
  { id:'problem',      label:'The Problem' },
  { id:'research',     label:'Research' },
  { id:'question',     label:'How Might We' },
  { id:'audience',     label:'Target Audience' },
  { id:'concept',      label:'Concept Exploration' },
  { id:'aim',          label:'Project Aim' },
  { id:'initial',      label:'Initial Direction' },
  { id:'technology',   label:'How It Works' },
  { id:'flow',         label:'Prototype Flow' },
  { id:'ia',           label:'Information Architecture' },
  { id:'interactions', label:'Interactions' },
  { id:'core',         label:'Core Interactions' },
  { id:'trials',       label:'Trials & Process' },
  { id:'ui',           label:'UI Design' },
  { id:'reflections',  label:'Reflections' },
]

const interactions = [
  { n:'01', activity:'Choose subject — tectonics',  pattern:'Hover to select',    input:'Air Gesture',  output:'Visual · GUI' },
  { n:'02', activity:'View Pangea',                 pattern:'Step back in time',  input:'Proxemics',    output:'Visual · Audio' },
  { n:'03', activity:'Return to present',           pattern:'Step forward',       input:'Proxemics',    output:'Visual · Audio' },
  { n:'04', activity:'Overlay tectonic map',        pattern:'Automatic reveal',   input:'—',            output:'Visual' },
  { n:'05', activity:"Deconstruct Earth's layers",  pattern:'Hand peel outward',  input:'Hand motion',  output:'Visual · Audio' },
  { n:'06', activity:"Reconstruct Earth's layers",  pattern:'Reverse peel',       input:'Hand motion',  output:'Visual · Audio' },
  { n:'07', activity:'View movement map',           pattern:'Show movement type', input:'—',            output:'Visual' },
  { n:'08', activity:'Formation of the Himalayas',  pattern:'Converging gesture', input:'Air Gesture',  output:'Visual · Audio · Haptics' },
]

const concepts = [
  { label:"Earth's Tilt & Seasons",        chosen:false },
  { label:'Water Distribution on Earth',   chosen:false },
  { label:'Geological Time Scales',         chosen:true  },
  { label:'Weathering vs. Erosion',         chosen:false },
  { label:'Latitude & Longitude',           chosen:false },
  { label:'Weather vs. Climate',            chosen:false },
  { label:'Sustainability & Human Impact',  chosen:false },
  { label:'Ocean Currents',                 chosen:false },
]

// ─── Helpers ───────────────────────────────────────────
function Wrap({ children, className = '' }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)] ${className}`}>
      {children}
    </div>
  )
}

const LABEL_STYLE = (dark) => ({
  fontFamily: '"Space Mono", monospace',
  fontSize: '0.625rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: dark ? 'rgba(255,255,255,0.2)' : 'rgba(18,18,18,0.28)',
  marginBottom: '2rem',
  display: 'block',
})

const PAD = { paddingTop:'clamp(4rem,7vw,6.5rem)', paddingBottom:'clamp(3.5rem,6vw,5.5rem)' }

function cardStyle(dark) {
  return {
    background:   dark ? '#161616' : '#ffffff',
    border:       `1px solid ${dark ? '#2a2a2a' : '#e0e0e0'}`,
    boxShadow:    dark ? 'none' : '0 1px 6px rgba(0,0,0,0.05)',
    borderRadius: '12px',
    padding:      '28px',
  }
}

// ─── Active section ─────────────────────────────────────
function useActiveSection() {
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const update = () => {
      const trigger = window.scrollY + window.innerHeight * 0.25
      let best = SECTIONS[0].id
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top + window.scrollY <= trigger) best = id
      }
      setActive(best)
    }
    window.addEventListener('scroll', update, { passive:true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
  return active
}

// ─── Sidebar ───────────────────────────────────────────
function SectionPanel({ active }) {
  const [scrollVisible, setScrollVisible] = useState(false)
  const [sentinelHit,   setSentinelHit]   = useState(false)
  useEffect(() => {
    const onScroll = () => setScrollVisible(window.scrollY > 320)
    window.addEventListener('scroll', onScroll, { passive:true })
    onScroll()
    const sentinel = document.getElementById('footer-sentinel')
    let obs
    if (sentinel) {
      obs = new IntersectionObserver(([e]) => setSentinelHit(e.isIntersecting), { threshold:0 })
      obs.observe(sentinel)
    }
    return () => { window.removeEventListener('scroll', onScroll); obs?.disconnect() }
  }, [])
  const shown = scrollVisible && !sentinelHit
  return (
    <motion.aside className="hidden lg:block fixed z-[100]"
      style={{ top:'50%', left:'20px', translateY:'-50%' }}
      animate={{ opacity: shown ? 1 : 0, pointerEvents: shown ? 'auto' : 'none' }}
      transition={{ duration:0.3, ease:'easeOut' }}>
      <div style={{ background:'rgba(245,244,240,0.92)', backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', borderRadius:'10px', padding:'10px 12px', border:'1px solid rgba(18,18,18,0.07)' }}>
        <p style={{ ...LABEL_STYLE(false), marginBottom:'8px', fontSize:'0.48rem' }}>Sections</p>
        {SECTIONS.map(s => (
          <button key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior:'smooth', block:'start' })}
            style={{ display:'block', textAlign:'left', fontFamily:'Syne, sans-serif', fontSize:'0.68rem', lineHeight:'1.5', maxWidth:'88px', padding:'2px 0', background:'none', border:'none', cursor:'pointer', transition:'color 0.2s', color: active === s.id ? 'rgba(18,18,18,0.9)' : 'rgba(18,18,18,0.28)', fontWeight: active === s.id ? 600 : 400 }}>
            {s.label}
          </button>
        ))}
      </div>
    </motion.aside>
  )
}

// ─── Process Strip ─────────────────────────────────────
function ProcessStrip() {
  const phases = ['Research', 'Concept', 'Prototype', 'Interaction Design', 'UI Design', 'Showcase']
  const items  = [...phases, ...phases, ...phases, ...phases]
  return (
    <div style={{ background:D, overflow:'hidden', padding:'13px 0', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
      <style>{`@keyframes gsg-ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div style={{ display:'flex', width:'max-content', animation:'gsg-ticker 24s linear infinite' }}>
        {items.map((p, i) => (
          <span key={i} style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'#FAFF38', paddingRight:'2.5rem', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:'1rem' }}>
            {p} <span style={{ color:'rgba(250,255,56,0.3)' }}>→</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Pull Quote ────────────────────────────────────────
function PullQuote({ text }) {
  return (
    <div style={{ background:D, padding:'clamp(4rem,8vw,7rem) 0' }}>
      <Wrap>
        <Reveal>
          <p style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontStyle:'italic', fontSize:'clamp(2rem,4vw,4rem)', color:'rgba(255,255,255,0.9)', lineHeight:'1.25', maxWidth:'900px' }}>
            "{text}"
          </p>
        </Reveal>
      </Wrap>
    </div>
  )
}

// ─── Tectonic Map ──────────────────────────────────────
function TectonicMap() {
  return (
    <div style={{ width:'100%', borderRadius:'16px', border:'1px solid rgba(18,18,18,0.08)', overflow:'hidden', background:'#eeeaf5', aspectRatio:'16/7' }}>
      <svg viewBox="0 0 800 350" style={{ width:'100%', height:'100%' }}>
        <defs>
          <radialGradient id="gsg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(124,58,237,0.13)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="800" height="350" fill="#eeeaf5" />
        <ellipse cx="400" cy="175" rx="320" ry="160" fill="url(#gsg-glow)" />
        <g stroke="rgba(124,58,237,0.4)" strokeWidth="1.1" fill="none" strokeDasharray="5 3">
          <path d="M222 15 Q232 75 218 138 Q202 198 212 278 Q217 318 222 350" />
          <path d="M575 15 Q598 58 618 98 Q638 158 628 218 Q614 278 598 350" />
          <path d="M0 148 Q58 138 118 158 Q158 173 198 163" />
          <path d="M618 158 Q678 138 738 153 Q768 163 800 158" />
          <path d="M362 118 Q400 108 440 113 Q478 118 508 128" />
          <path d="M242 198 Q280 188 318 203 Q348 213 368 238 Q378 268 368 308" />
          <path d="M508 128 Q540 145 558 175 Q565 205 552 235" />
        </g>
        <g>
          {[380,400,420,440,460].map(x => <polygon key={x} points={`${x},112 ${x+6},122 ${x-6},122`} fill="rgba(255,75,143,0.6)" />)}
          <text x="382" y="104" fill="rgba(255,75,143,0.7)" fontFamily="monospace" fontSize="6.5" letterSpacing="0.5">▲ CONVERGENT — HIMALAYAS</text>
        </g>
        <g fill="rgba(18,18,18,0.055)" stroke="rgba(18,18,18,0.13)" strokeWidth="0.75">
          <path d="M62 38 L128 33 L153 53 L158 88 L143 128 L128 158 L108 188 L93 208 L78 203 L63 178 L53 148 L48 108 L53 73 Z" />
          <path d="M108 218 L133 213 L148 233 L153 268 L143 308 L128 338 L108 338 L93 318 L88 288 L93 258 L103 238 Z" />
          <path d="M268 38 L318 33 L338 48 L333 73 L313 88 L288 83 L268 68 Z" />
          <path d="M268 108 L318 98 L343 118 L348 158 L338 198 L323 238 L303 268 L283 268 L268 243 L258 198 L253 158 L258 128 Z" />
          <path d="M348 28 L448 23 L508 33 L538 53 L548 78 L528 98 L488 108 L438 113 L398 103 L363 88 L343 63 Z" />
          <path d="M418 118 L453 116 L463 138 L453 173 L433 193 L413 183 L406 158 L408 133 Z" />
          <path d="M568 198 L638 193 L668 213 L666 253 L643 273 L598 276 L568 258 L556 233 L560 213 Z" />
        </g>
        <g fill="rgba(18,18,18,0.22)" fontFamily="monospace" fontSize="7.5" letterSpacing="0.8">
          <text x="72"  y="118">N. AMERICAN</text>
          <text x="88"  y="272">S. AMERICAN</text>
          <text x="153" y="195">AFRICAN</text>
          <text x="385" y="65">EURASIAN</text>
          <text x="443" y="165">INDO-AUS.</text>
          <text x="618" y="148">PACIFIC</text>
        </g>
        <g stroke="rgba(124,58,237,0.55)" strokeWidth="1.2" markerEnd="url(#arr)">
          <defs><marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><polygon points="0,0 5,2.5 0,5" fill="rgba(124,58,237,0.6)" /></marker></defs>
          <line x1="392" y1="106" x2="408" y2="111" />
          <line x1="488" y1="110" x2="470" y2="113" />
        </g>
      </svg>
    </div>
  )
}

// ─── IA Diagram ────────────────────────────────────────
function IANode({ label, sub, accent, small }) {
  return (
    <div style={{ minWidth:small?'120px':'160px', maxWidth:small?'160px':'200px', background:accent?'rgba(124,58,237,0.06)':'rgba(0,0,0,0.025)', border:`1px solid ${accent?'rgba(124,58,237,0.3)':'rgba(18,18,18,0.09)'}`, borderRadius:'8px', padding:'10px 12px', textAlign:'center' }}>
      <p style={{ fontFamily:'Syne,sans-serif', fontSize:small?'0.7rem':'0.775rem', fontWeight:accent?600:400, color:accent?'rgba(18,18,18,0.85)':'rgba(18,18,18,0.55)', lineHeight:'1.3' }}>{label}</p>
      {sub && <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.48rem', letterSpacing:'0.06em', color:'rgba(18,18,18,0.28)', marginTop:'3px' }}>{sub}</p>}
    </div>
  )
}
function IAConnector() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ width:'1px', height:'16px', background:'rgba(18,18,18,0.1)' }} />
      <svg width="7" height="5" viewBox="0 0 7 5" fill="rgba(18,18,18,0.15)"><polygon points="0,0 7,0 3.5,5" /></svg>
    </div>
  )
}
function IADiagram() {
  return (
    <div style={{ overflowX:'auto' }}>
      <div style={{ minWidth:'720px', padding:'16px 0' }}>
        <div style={{ display:'flex', justifyContent:'center' }}><IANode label="Intro Video" sub="Entry point" /></div>
        <IAConnector />
        <div style={{ display:'flex', justifyContent:'center' }}><IANode label="Menu" sub="Topic Gallery" /></div>
        <IAConnector />
        <div style={{ display:'flex', justifyContent:'center' }}><IANode label="Tectonic Plates" sub="Selected topic" accent /></div>
        <IAConnector />
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', gap:'8px' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, maxWidth:'320px' }}>
            <IANode label="Current globe" sub="2024 tectonic config" small />
            <IAConnector />
            <IANode label="Step back → Continental drift" sub="Proxemics: body steps back" small accent />
            <IAConnector />
            <IANode label="Step further back → Pangaea" sub="Time reversal" small />
            <IAConnector />
            <IANode label="Return to present" sub="Body steps forward" small accent />
            <IAConnector />
            <IANode label="Peel Earth's layers" sub="Sagittal arm gesture" small accent />
            <IAConnector />
            <IANode label="Tectonic map overlay" sub="Automatic reveal" small />
          </div>
          <div style={{ width:'1px', background:'rgba(18,18,18,0.06)', alignSelf:'stretch', marginTop:'24px', marginLeft:'16px', marginRight:'16px' }} />
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1, maxWidth:'320px' }}>
            <IANode label="Plate movement types" sub="Explore further" small />
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'center', gap:'8px', marginTop:0, width:'100%' }}>
              {[{l:'Convergent',s:'Hands converge',hi:true},{l:'Divergent',s:'Hands separate',hi:false},{l:'Transformative',s:'Lateral slide',hi:false}].map(({l,s,hi})=>(
                <div key={l} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
                  <IAConnector />
                  <IANode label={l} sub={s} small accent={hi} />
                  {hi&&<><IAConnector /><IANode label="Himalayas formation" sub="Lithospheric collision" small /><IAConnector /><IANode label="Altitude changes" sub="Aftereffects visualised" small /></>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Kinect Diagram ────────────────────────────────────
function KinectDiagram() {
  const steps = [
    { label:'Microsoft Kinect One', sub:'IR · Depth · Camera · Mic Array' },
    { label:'Skeletal tracking',    sub:'X · Y · Z node coordinates' },
    { label:'TouchDesigner',        sub:'CPU mapping & processing' },
    { label:'Visual output',        sub:'Real-time dynamic response' },
  ]
  return (
    <div style={{ borderRadius:'12px', border:'1px solid #e0e0e0', background:'#ffffff', padding:'28px', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:'0', marginBottom:'24px' }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display:'flex', alignItems:'center', flex:1, minWidth:'120px' }}>
            <div style={{ textAlign:'center', flex:1, padding:'12px 8px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(18,18,18,0.04)', border:'1px solid rgba(18,18,18,0.1)', margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.48rem', color:'rgba(18,18,18,0.4)' }}>{String(i+1).padStart(2,'0')}</span>
              </div>
              <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.78rem', fontWeight:600, color:'rgba(18,18,18,0.75)', marginBottom:'2px' }}>{s.label}</p>
              <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.5rem', letterSpacing:'0.06em', color:'rgba(18,18,18,0.32)' }}>{s.sub}</p>
            </div>
            {i < steps.length-1 && <span style={{ color:'rgba(18,18,18,0.2)', flexShrink:0, padding:'0 4px' }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid #e8e8e8', paddingTop:'20px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' }}>
        {[['INPUT','Body movements, hand gestures, proximity data'],['PROCESSING','Coordinate mapping onto visual elements in real time'],['OUTPUT','Dynamic visuals responding to every movement']].map(([k,v])=>(
          <div key={k} style={{ padding:'12px', borderRadius:'8px', background:'#f5f4f0', border:'1px solid #e0e0e0' }}>
            <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.5rem', letterSpacing:'0.14em', color:'rgba(18,18,18,0.3)', marginBottom:'4px' }}>{k}</p>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.78rem', color:'rgba(18,18,18,0.55)', lineHeight:'1.5' }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Prototype Flow ────────────────────────────────────
function PrototypeFlow() {
  const steps = [
    {n:'01',label:'Device\nConnection'},{n:'02',label:'Menu'},{n:'03',label:'Topic\nGallery'},
    {n:'04',label:'Topic of\nInterest'},{n:'05',label:'Learn'},{n:'06',label:'Complete'},{n:'07',label:'Menu'},
  ]
  return (
    <div style={{ borderRadius:'12px', border:'1px solid #2a2a2a', background:'#161616', padding:'28px', overflowX:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', minWidth:'500px' }}>
        {steps.map((s,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', flex:1 }}>
            <div style={{ textAlign:'center', flex:1 }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', margin:'0 auto 8px', display:'flex', alignItems:'center', justifyContent:'center', background:(i===0||i===6)?'rgba(124,58,237,0.12)':'rgba(255,255,255,0.04)', border:`1px solid ${(i===0||i===6)?'rgba(124,58,237,0.3)':'rgba(255,255,255,0.1)'}` }}>
                <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.5rem', color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em' }}>{s.n}</span>
              </div>
              <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.65rem', color:'rgba(255,255,255,0.55)', lineHeight:'1.3', whiteSpace:'pre-line' }}>{s.label}</p>
            </div>
            {i<steps.length-1 && <div style={{ width:'16px', height:'1px', flexShrink:0, background:'rgba(255,255,255,0.12)' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────
export default function GetSetGlobe() {
  const active = useActiveSection()

  return (
    <div style={{ background:L }} className="overflow-x-hidden">
      <ProgressBar />
      <Nav light />
      <SectionPanel active={active} />

      {/* ── HERO ── */}
      <div style={{ background:L }}>
        <Wrap>
          <div style={{ paddingTop:'clamp(10rem,18vw,14rem)', paddingBottom:'clamp(3rem,5vw,4.5rem)' }}>
            <Reveal>
              <span style={{ ...LABEL_STYLE(false), marginBottom:'1.5rem' }}>
                Project 03 · EdTech · Interaction Design · 2024
              </span>
            </Reveal>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(3rem,9vw,7.5rem)', letterSpacing:'-0.04em', lineHeight:'0.88', color:'#1a1a1a', marginBottom:'1.5rem' }}>
              <MaskReveal>Get, Set,</MaskReveal>
              <MaskReveal delay={0.1}>Globe!</MaskReveal>
            </h1>
            <Reveal delay={0.2}>
              <p style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(0.875rem,1.15vw,1rem)', color:'rgba(18,18,18,0.5)', lineHeight:'1.85', maxWidth:'52ch' }}>
                An interactive, multisensory learning experience that helps children see, feel,
                and move through Earth's tectonic forces — turning abstract science into
                curiosity-driven exploration.
              </p>
            </Reveal>
          </div>
        </Wrap>
        <Wrap>
          <Reveal>
            <TectonicMap />
            <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(18,18,18,0.22)', marginTop:'10px', textAlign:'center' }}>
              Major tectonic plates · convergent boundaries (Himalayas) highlighted in pink
            </p>
          </Reveal>
        </Wrap>
        <div style={{ height:'clamp(4rem,6vw,5.5rem)' }} />
      </div>

      {/* ── PROCESS STRIP ── */}
      <ProcessStrip />

      {/* ── OVERVIEW ── */}
      <div id="overview" style={{ background:L, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Overview</span>
          <Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem 3rem', marginBottom:'2.5rem' }} className="md:grid-cols-4">
              {[['Timeline','3 Weeks'],['Institution','NID Bangalore'],['Output','Experiential in-classroom interface'],['Showcase','SAP Impulse Showcase 2025']].map(([k,v])=>(
                <div key={k}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(18,18,18,0.28)', display:'block', marginBottom:'4px' }}>{k}</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.8rem', color:'rgba(18,18,18,0.65)', lineHeight:'1.5' }}>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem 3rem', marginBottom:'2.5rem' }}>
              {[['Collaborators','Saneeta Veeramani · Hiral'],['Mentors','Mamata Rao · Jagriti Galphade · Athul Dinesh']].map(([k,v])=>(
                <div key={k}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(18,18,18,0.28)', display:'block', marginBottom:'4px' }}>{k}</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.8rem', color:'rgba(18,18,18,0.65)' }}>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(18,18,18,0.28)', display:'block', marginBottom:'10px' }}>Tools</span>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'20px' }}>
              {['TouchDesigner','Microsoft Kinect One','Figma','After Effects'].map(t=>(
                <span key={t} style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.6rem', letterSpacing:'0.07em', padding:'6px 14px', borderRadius:'100px', border:'1px solid rgba(18,18,18,0.12)', color:'rgba(18,18,18,0.5)' }}>{t}</span>
              ))}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {['Multi-modal interaction','Experiential','Engagement-based learning','Delightful learning experience'].map(k=>(
                <span key={k} style={{ fontFamily:'Syne,sans-serif', fontSize:'0.78rem', padding:'6px 14px', borderRadius:'8px', border:'1px solid rgba(124,58,237,0.2)', background:'rgba(124,58,237,0.04)', color:'rgba(18,18,18,0.55)' }}>{k}</span>
              ))}
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── THE PROBLEM — dark ── */}
      <div id="problem" style={{ background:D, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(true)}>The Problem</span>
          <Reveal>
            <h2 style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontStyle:'italic', fontWeight:400, fontSize:'clamp(2.5rem,6vw,6rem)', color:'rgba(255,255,255,0.9)', lineHeight:'1.1', marginBottom:'clamp(2.5rem,5vw,4rem)', maxWidth:'18ch' }}>
              "For centuries, maps and globes have helped us hold the vastness of Earth in our hands."
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(255,255,255,0.45)', lineHeight:'1.85', maxWidth:'58ch', marginBottom:'clamp(2.5rem,5vw,4rem)', borderLeft:'2px solid rgba(255,255,255,0.12)', paddingLeft:'1.25rem' }}>
              But they're not the world itself — only windows into it. They shrink oceans into blue patches and mountains into lines.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontStyle:'italic', fontSize:'clamp(1.5rem,2.5vw,2.5rem)', color:'rgba(255,255,255,0.75)', marginBottom:'clamp(2rem,4vw,3rem)', lineHeight:'1.25' }}>
              "Seeing is believing — and that's the problem."
            </p>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(255,255,255,0.45)', lineHeight:'1.8', maxWidth:'58ch', marginBottom:'clamp(2.5rem,5vw,4rem)' }}>
              Children take visuals at face value. Traditional teaching shows Earth as static, reducing dynamic phenomena to diagrams. But to truly understand Earth, children must go beyond vision — through experience.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px' }}>
              {[
                ['Static teaching',     'Diagrams flatten living, moving systems into flat images with no sense of scale or time.'],
                ['Passive observation', 'Students watch but never interact — no ownership over the experience or its meaning.'],
                ['Abstract concepts',   "Tectonic forces, geological time, and Earth\u2019s interior remain intangible and forgettable."],
              ].map(([t,d])=>(
                <div key={t} style={cardStyle(true)}>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:600, color:'rgba(255,255,255,0.85)', marginBottom:'10px' }}>{t}</p>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'#999', lineHeight:'1.7' }}>{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── RESEARCH — dark ── */}
      <div id="research" style={{ background:D, borderTop:'1px solid rgba(255,255,255,0.05)', ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(true)}>Research</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(2rem,5vw,5rem)', color:'rgba(255,255,255,0.9)', lineHeight:'1.05', letterSpacing:'-0.03em', marginBottom:'clamp(2rem,4vw,3.5rem)', maxWidth:'20ch' }}>
              The starting point: multimodal learning
            </h2>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(255,255,255,0.45)', lineHeight:'1.85', maxWidth:'60ch', marginBottom:'clamp(2.5rem,5vw,4rem)' }}>
              Learning happens through more than words — it's multimodal. Meaning is made through gesture, movement, gaze, posture, and speech working together.
            </p>
          </Reveal>
          {/* Giant stats */}
          <Reveal delay={0.1}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px', marginBottom:'clamp(2rem,4vw,3rem)', borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'clamp(2rem,4vw,3.5rem)' }}>
              {[
                { v:'90%',  l:'Recall for gesture-based learning', s:'vs. speech only' },
                { v:'33%',  l:'Recall for speech-only learning',   s:'Baseline retention' },
                { v:'2.5×', l:'Sensorimotor-enriched modes',       s:'Retention multiplier' },
              ].map(({ v,l,s })=>(
                <div key={v} style={{ paddingRight:'2rem' }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(4rem,10vw,10rem)', color:'rgba(255,255,255,0.9)', lineHeight:'0.9', marginBottom:'1rem', letterSpacing:'-0.04em' }}>{v}</div>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(255,255,255,0.5)', lineHeight:'1.5', marginBottom:'4px' }}>{l}</p>
                  <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.55rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)' }}>{s}</p>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'1.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(255,255,255,0.4)' }}>visual proxemics</span>
                <span style={{ color:'rgba(255,255,255,0.18)', fontSize:'1.2rem' }}>+</span>
                <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(255,255,255,0.4)' }}>speech audio</span>
                <span style={{ color:'rgba(255,255,255,0.18)', fontSize:'1.2rem' }}>=</span>
                <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', fontWeight:600, color:'rgba(124,58,237,0.9)' }}>engaging learning experience</span>
              </div>
              <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.56rem', letterSpacing:'0.06em', color:'rgba(255,255,255,0.2)' }}>
                Source: Cook, Wagner, Mitchell & Goldin-Meadow (2008). "Gesturing Makes Learning Last." Psychological Science 19(11): 1047–53.
              </p>
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── HOW MIGHT WE — dark ── */}
      <div id="question" style={{ background:D, borderTop:'1px solid rgba(255,255,255,0.05)', ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(true)}>How Might We</span>
          <Reveal>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'35vh' }}>
              <p style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontStyle:'italic', fontSize:'clamp(2rem,4vw,3.5rem)', color:'rgba(255,255,255,0.9)', lineHeight:'1.25', maxWidth:'800px', textAlign:'center' }}>
                How can multimodal methods of learning nurture curiosity and help children explore Earth's depths in their early development?
              </p>
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── TARGET AUDIENCE — light ── */}
      <div id="audience" style={{ background:L, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Target Audience &amp; Learning Characteristics</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(2rem,5vw,4.5rem)', color:'#1a1a1a', lineHeight:'1.05', letterSpacing:'-0.03em', marginBottom:'clamp(2rem,4vw,3rem)' }}>
              Children aged<br />10 – 12 years
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px', marginBottom:'24px' }}>
              {[
                { n:'01', t:'Cognitive readiness', b:'Can grasp cause-effect, sequence, and physical transformation.' },
                { n:'02', t:'Learning style',      b:'Learn best through hands-on interaction and guided discovery.' },
                { n:'03', t:'Core challenge',      b:'Struggle with visualising deep time and internal processes.' },
              ].map(({ n,t,b })=>(
                <div key={n} style={cardStyle(false)}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.12em', color:'rgba(18,18,18,0.22)', display:'block', marginBottom:'12px' }}>{n}</span>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:600, color:'rgba(18,18,18,0.82)', marginBottom:'8px' }}>{t}</p>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'#666', lineHeight:'1.7' }}>{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ ...cardStyle(false), background:'#f8f7f5', boxShadow:'none' }}>
              <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.54rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(18,18,18,0.3)', marginBottom:'16px' }}>Current learning barriers</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {['Traditional teaching limits sensory engagement.','Short attention spans (7–10 mins) lead to low retention.','Earth processes remain abstract and intangible concepts.'].map((b,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px' }}>
                    <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.58rem', color:'rgba(18,18,18,0.28)', marginTop:'2px', flexShrink:0 }}>{String(i+1).padStart(2,'0')}</span>
                    <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.6)', lineHeight:'1.6' }}>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── CONCEPT EXPLORATION — light ── */}
      <div id="concept" style={{ background:'#edeae3', ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Concept Exploration</span>
          <Reveal>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.5)', lineHeight:'1.85', maxWidth:'60ch', marginBottom:'1.5rem' }}>
              We looked into which Earth/Geography concepts children find most difficult due to limited depth in traditional teaching and the absence of multimodal engagement.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'clamp(2rem,4vw,3.5rem)' }}>
              {concepts.map(({ label, chosen })=>(
                <span key={label} style={{ fontFamily:'Syne,sans-serif', fontSize:'0.78rem', padding:'6px 14px', borderRadius:'8px', border:`1px solid ${chosen?'rgba(124,58,237,0.4)':'rgba(18,18,18,0.1)'}`, background:chosen?'rgba(124,58,237,0.07)':'rgba(18,18,18,0.03)', color:chosen?'rgba(124,58,237,0.9)':'rgba(18,18,18,0.4)', fontWeight:chosen?600:400 }}>
                  {chosen && <span style={{ marginRight:'4px', fontSize:'0.6rem' }}>✓</span>}
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.54rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(18,18,18,0.28)', marginBottom:'16px' }}>Three initial directions explored</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px' }}>
              {[
                { n:'Direction 01', t:'Pangea narrative', b:"Earth's shape imagined as anything but spherical — the story sparks curiosity and leads to why Earth has its present form, emphasising the crucial role of tectonic plates." },
                { n:'Direction 02', t:'Time travel',      b:"Travelling back in time to trace Earth's evolution helps learners grasp the dynamic tectonic forces that have sculpted the planet's current shape." },
                { n:'Direction 03', t:'Scale first',      b:"Tectonic plates introduced by first helping children comprehend Earth's vast scale, then showing how its surface is split into constantly shifting sections." },
              ].map(({ n,t,b })=>(
                <div key={n} style={{ ...cardStyle(false), background:'#f5f4f0' }}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.12em', color:'rgba(18,18,18,0.25)', display:'block', marginBottom:'10px' }}>{n}</span>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:600, color:'rgba(18,18,18,0.8)', marginBottom:'8px' }}>{t}</p>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'#666', lineHeight:'1.7' }}>{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── PROJECT AIM — light ── */}
      <div id="aim" style={{ background:L, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Project Aim</span>
          <Reveal>
            <p style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontStyle:'italic', fontSize:'clamp(1.5rem,3vw,3rem)', color:'rgba(18,18,18,0.82)', lineHeight:'1.4', maxWidth:'900px' }}>
              The project aims to create an interactive, curiosity-driven learning experience that transforms the way children understand Earth's tectonic processes. By engaging multiple senses through gesture, movement, sound, and visual feedback, the experience encourages learners to move beyond passive observation into active exploration. It is designed to sustain curiosity and emotional connection by allowing children to feel and interact with the forces shaping the planet — turning abstract geological concepts into intuitive, memorable experiences.
            </p>
          </Reveal>
        </Wrap>
      </div>

      {/* ── PULL QUOTE ── */}
      <PullQuote text="Wonder is the door; information is what's inside." />

      {/* ── INITIAL DIRECTION — light ── */}
      <div id="initial" style={{ background:L, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Initial Direction — Physical Globe</span>
          <Reveal>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.5)', lineHeight:'1.85', maxWidth:'58ch', marginBottom:'2rem' }}>
              Our first idea imagined a sensor-enabled globe as the main touchpoint. Children could interact with it directly through three gestures:
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'16px', marginBottom:'2rem' }}>
              {[
                { n:'Step 01', t:'Step back',       b:'See Pangea form as you move away from the globe.' },
                { n:'Step 02', t:'Peel off layers', b:"Explore Earth's interior layer by layer." },
                { n:'Step 03', t:'Pinch plates',    b:'Create converging tectonic movement with a pinch gesture.' },
              ].map(({ n,t,b })=>(
                <div key={n} style={cardStyle(false)}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.12em', color:'rgba(18,18,18,0.25)', display:'block', marginBottom:'10px' }}>{n}</span>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:600, color:'rgba(18,18,18,0.8)', marginBottom:'8px' }}>{t}</p>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'#666', lineHeight:'1.7' }}>{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ ...cardStyle(false), background:'#fff5f8', borderColor:'rgba(255,75,143,0.2)', boxShadow:'none' }}>
              <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.54rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,75,143,0.6)', marginBottom:'10px' }}>Why we moved on — not using a physical globe</p>
              <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.55)', lineHeight:'1.8', marginBottom:'12px' }}>
                A deeper dive revealed strong engagement — participants responded instantly to motion-based interactions. However, the globe as a fixed object felt restrictive, and the gestures were too specific to recall easily.
              </p>
              <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', fontWeight:600, color:'rgba(18,18,18,0.75)', lineHeight:'1.6' }}>
                The takeaway: gestures should feel universal and reusable, not one-off actions bound to a single lesson.
              </p>
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── PULL QUOTE ── */}
      <PullQuote text="Gestures should feel universal and reusable, not one-off actions bound to a single lesson." />

      {/* ── HOW IT WORKS — light ── */}
      <div id="technology" style={{ background:L, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>How It Works — The Kinect</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(1.5rem,3.5vw,3.5rem)', color:'#1a1a1a', lineHeight:'1.1', letterSpacing:'-0.03em', marginBottom:'1.5rem', maxWidth:'24ch' }}>
              Microsoft Kinect One + TouchDesigner
            </h2>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.5)', lineHeight:'1.85', maxWidth:'58ch', marginBottom:'2rem' }}>
              We used the Microsoft Kinect One — part of the Xbox system — with built-in sensors. It senses various nodes of the skeletal system based on coordinates in space along with depth for accurate readings. Those readings are mapped onto TouchDesigner and processed into real-time output.
            </p>
          </Reveal>
          <Reveal delay={0.08}><KinectDiagram /></Reveal>
          <Reveal delay={0.12}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'12px', marginTop:'20px' }}>
              {[['IR Sensor','Infrared object detection'],['IR Depth','Z-axis depth reading'],['Colour Camera','Visual context capture'],['LED Mic Array','Audio input cues']].map(([s,d])=>(
                <div key={s} style={{ padding:'16px', borderRadius:'10px', border:'1px solid #e0e0e0', background:'#fff' }}>
                  <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.56rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(18,18,18,0.3)', marginBottom:'4px' }}>{s}</p>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.78rem', color:'rgba(18,18,18,0.55)' }}>{d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── PROTOTYPE FLOW — dark ── */}
      <div id="flow" style={{ background:D, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(true)}>Prototype Flow</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(1.5rem,3.5vw,3.5rem)', color:'rgba(255,255,255,0.9)', lineHeight:'1.1', letterSpacing:'-0.03em', marginBottom:'1rem' }}>
              7-step experience flow
            </h2>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(255,255,255,0.4)', lineHeight:'1.85', maxWidth:'52ch', marginBottom:'2rem' }}>
              From device connection through topic selection, active learning, and looping back to the menu.
            </p>
          </Reveal>
          <Reveal delay={0.08}><PrototypeFlow /></Reveal>
        </Wrap>
      </div>

      {/* ── INFORMATION ARCHITECTURE — light ── */}
      <div id="ia" style={{ background:L, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Information Architecture</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(1.5rem,3.5vw,3.5rem)', color:'#1a1a1a', lineHeight:'1.1', letterSpacing:'-0.03em', marginBottom:'1.5rem' }}>
              The full learning journey
            </h2>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.5)', lineHeight:'1.85', maxWidth:'62ch', marginBottom:'2rem' }}>
              The IA illustrates an interactive educational experience focused on tectonic plate movements. The journey begins with an introductory video, followed by topic selection. The experience then moves backward in time through continental drift to Pangaea, returns to the present, peels back the globe's layers, and explores different types of tectonic movement — concluding with altitude changes and aftereffects of the Himalayan collision.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ borderRadius:'12px', border:'1px solid #e0e0e0', background:'#fff', padding:'clamp(1.5rem,3vw,2.5rem)', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
              <IADiagram />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginTop:'16px' }}>
              {[
                { accent:true,  label:'Purple nodes = user-triggered interactions' },
                { accent:false, label:'White nodes = system-driven transitions' },
              ].map(({ accent, label })=>(
                <div key={label} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', borderRadius:'8px', background:accent?'rgba(124,58,237,0.04)':'rgba(0,0,0,0.02)', border:`1px solid ${accent?'rgba(124,58,237,0.2)':'rgba(18,18,18,0.07)'}` }}>
                  <div style={{ width:'10px', height:'10px', borderRadius:'3px', flexShrink:0, background:accent?'rgba(124,58,237,0.15)':'rgba(0,0,0,0.06)', border:`1px solid ${accent?'rgba(124,58,237,0.4)':'rgba(18,18,18,0.18)'}` }} />
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.75rem', color:'rgba(18,18,18,0.55)' }}>{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── INTERACTIONS — light ── */}
      <div id="interactions" style={{ background:'#edeae3', ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Multimodal Interaction Roundup</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(1.5rem,3.5vw,3.5rem)', color:'#1a1a1a', lineHeight:'1.1', letterSpacing:'-0.03em', marginBottom:'1rem' }}>
              8 body-to-geology mappings
            </h2>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.5)', lineHeight:'1.85', maxWidth:'58ch', marginBottom:'2rem' }}>
              Each interaction maps a natural body movement to a geological concept. The goal: gestures that feel universal and reusable across lessons.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ borderRadius:'12px', border:'1px solid #d8d5cc', overflow:'hidden', background:'#fff', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
              {/* Sticky header */}
              <div style={{ display:'grid', gridTemplateColumns:'2.5rem 1fr 1fr 1fr', padding:'12px 20px', background:'#f5f4f0', borderBottom:'1px solid #e0e0e0', position:'sticky', top:0, zIndex:10 }}>
                {['No.','Activity','Mode / Pattern','Input → Output'].map(h=>(
                  <span key={h} style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(18,18,18,0.35)' }}>{h}</span>
                ))}
              </div>
              {interactions.map((row, i)=>(
                <div key={i} style={{ display:'grid', gridTemplateColumns:'2.5rem 1fr 1fr 1fr', padding:'14px 20px', borderBottom: i<interactions.length-1?'1px solid #f0ece3':'none', background: row.n==='08' ? 'rgba(124,58,237,0.03)' : i%2===0 ? '#fff' : '#faf9f7' }}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.58rem', color:'rgba(18,18,18,0.28)' }}>{row.n}</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.8rem', color:'rgba(18,18,18,0.7)', paddingRight:'12px' }}>{row.activity}</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.8rem', color:'rgba(18,18,18,0.45)', paddingRight:'12px' }}>{row.pattern}</span>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.65rem', color:'rgba(18,18,18,0.45)', lineHeight:'1.5' }}>
                    <span style={{ color:'rgba(18,18,18,0.6)' }}>{row.input}</span>
                    {row.input!=='—' && <span style={{ color:'rgba(18,18,18,0.2)' }}> → </span>}
                    {row.output}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.08em', color:'rgba(18,18,18,0.3)', marginTop:'10px' }}>
              Row 08 (Himalayas) is the only interaction with haptic output — the most physically immersive moment.
            </p>
          </Reveal>
        </Wrap>
      </div>

      {/* ── CORE INTERACTIONS — dark ── */}
      <div id="core" style={{ background:D, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(true)}>Core Multimodal Interactions</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(1.5rem,3.5vw,3.5rem)', color:'rgba(255,255,255,0.9)', lineHeight:'1.1', letterSpacing:'-0.03em', marginBottom:'clamp(2rem,4vw,3rem)' }}>
              Four defining gestures
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px' }}>
              {[
                { n:'Interaction 01', title:'Proxemics → Continental Drift & Pangea',  detail:"Using proxemics and frontal arm movements to cause the continental drift and formation of Pangea, depending on the user's movement direction and speed.", sensor:'Proximity · Body position', gesture:'Step backward / forward', effect:'Time reversal / progression of continental drift', accent:true },
                { n:'Interaction 02', title:"Sagittal Arm Movement → Earth's Interior", detail:"Sagittal arm movement (forward-backward sweep) reveals the inner layers of the Earth, exposing the crust, mantle and core — with each layer's role in tectonic forces explained.", sensor:'Hand motion · Depth tracking', gesture:'Arm sweep forward/back', effect:"Peels and reconstructs Earth's layers", accent:false },
                { n:'Interaction 03', title:'Air Gesture → Himalayan Collision',         detail:'Bringing both hands together in a converging gesture triggers the simulation of colliding lithospheric plates — showing the formation of the Himalayas with visual, audio, and haptic feedback.', sensor:'Air gesture · Hand tracking', gesture:'Both hands converge', effect:'Mountain formation + haptic feedback', accent:true },
                { n:'Interaction 04', title:'Hover + Hold → Menu Selection',             detail:'Simple UI inspired by Xbox Kinect games. Intuitive hand hover for navigation, with a steady hold to confirm a selection. Visual cue: the completion of a circle stroke around the option.', sensor:'Air gesture · Hand position', gesture:'Hover + hold still', effect:'Selection confirmed via filling circle', accent:false },
              ].map(({ n,title,detail,sensor,gesture,effect,accent })=>(
                <div key={n} style={{ ...cardStyle(true), border:`1px solid ${accent?'rgba(124,58,237,0.3)':'#2a2a2a'}`, background:accent?'#191424':'#161616' }}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.12em', color:'rgba(255,255,255,0.2)', display:'block', marginBottom:'10px' }}>{n}</span>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:600, color:'rgba(255,255,255,0.85)', marginBottom:'10px', lineHeight:'1.3' }}>{title}</p>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'#999', lineHeight:'1.7', marginBottom:'20px' }}>{detail}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                    {[['Sensor',sensor],['Gesture',gesture],['Effect',effect]].map(([k,v])=>(
                      <div key={k} style={{ display:'flex', gap:'12px' }}>
                        <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.5rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', width:'48px', flexShrink:0, marginTop:'2px' }}>{k}</span>
                        <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.78rem', color:'rgba(255,255,255,0.5)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── TRIALS — light ── */}
      <div id="trials" style={{ background:L, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>Trials &amp; Process</span>
          <Reveal>
            <blockquote style={{ fontFamily:'"Cormorant Garamond",Georgia,serif', fontStyle:'italic', fontSize:'clamp(1.25rem,2.5vw,2.25rem)', color:'rgba(18,18,18,0.55)', lineHeight:'1.5', marginBottom:'clamp(2rem,4vw,3.5rem)', borderLeft:'2px solid rgba(18,18,18,0.1)', paddingLeft:'1.25rem', maxWidth:'700px' }}>
              "Some trials, errors and occasional frustrations. Made using TouchDesigner."
            </blockquote>
          </Reveal>
          <Reveal delay={0.06}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px', marginBottom:'clamp(2.5rem,5vw,4rem)' }}>
              {[
                { n:'01', t:'Proxemics calibration', b:'Getting the depth readings from the Kinect to correctly map to timeline progression required careful calibration of the depth thresholds in TouchDesigner.' },
                { n:'02', t:'Gesture disambiguation', b:'Distinguishing intentional gestures from ambient body movement — preventing false triggers while keeping interaction feel instant and natural.' },
                { n:'03', t:'Layer peel timing', b:"Tuning the sagittal sweep sensitivity so that Earth's layers reveal at a pace children can follow and comprehend, not so fast it loses meaning." },
                { n:'04', t:'Haptic integration', b:'The Himalaya converging gesture needed haptic output to complete the sensory loop — sourcing and syncing this with the visual was a key challenge.' },
              ].map(({ n,t,b })=>(
                <div key={n} style={cardStyle(false)}>
                  <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.12em', color:'rgba(18,18,18,0.25)', display:'block', marginBottom:'10px' }}>Challenge {n}</span>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:600, color:'rgba(18,18,18,0.8)', marginBottom:'8px' }}>{t}</p>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'#666', lineHeight:'1.7' }}>{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
          {/* Storyboard — dark container */}
          <Reveal delay={0.1}>
            <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid #e0e0e0' }}>
              <div style={{ padding:'12px 20px', background:'#f5f4f0', borderBottom:'1px solid #e0e0e0' }}>
                <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.54rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(18,18,18,0.3)' }}>Storyboard</span>
              </div>
              <div style={{ padding:'32px', background:'#111111', display:'flex', justifyContent:'center' }}>
                <img src="/gsg-storyboard.png" alt="Get Set Globe storyboard" style={{ maxWidth:'400px', width:'100%', borderRadius:'8px', filter:'invert(1) brightness(0.82) contrast(0.88)' }} />
              </div>
              <div style={{ padding:'12px 20px', background:'#f5f4f0', borderTop:'1px solid #e0e0e0' }}>
                <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.52rem', letterSpacing:'0.08em', color:'rgba(18,18,18,0.3)' }}>
                  8-step storyboard: course selection → Pangea → Earth layers → convergent/divergent plates → Himalaya formation
                </p>
              </div>
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── UI DESIGN — light ── */}
      <div id="ui" style={{ background:'#edeae3', ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(false)}>UI Design</span>
          <Reveal>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(1.5rem,3.5vw,3.5rem)', color:'#1a1a1a', lineHeight:'1.1', letterSpacing:'-0.03em', marginBottom:'1rem' }}>
              Xbox Kinect-inspired.<br />No touch required.
            </h2>
            <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.5)', lineHeight:'1.85', maxWidth:'60ch', marginBottom:'2rem' }}>
              The UI is inspired by Xbox Kinect games — simple, legible, and designed for full-body interaction from a distance. No touch required.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'16px', marginBottom:'20px' }}>
              {[
                { screen:'Onboarding Screen 01', sub:'Navigation Pattern', desc:"Intuitive hand movements for on-screen navigation, followed by a steady hold of selection to confirm the selected choice. Visual cue: a circle stroke that fills to 100% on confirmation.", detail:'Simple UI inspired and based on Xbox Kinect games.' },
                { screen:'Onboarding Screen 02', sub:'Topic Selection',     desc:"Selections of topics expand based on hand movements hovering over them. A steady pause of the hand movement confirms the intended selection — the visual cue being the completion of the circle's stroke.", detail:'No physical touch required at any point.' },
              ].map(({ screen, sub, desc, detail })=>(
                <div key={screen} style={{ ...cardStyle(false), background:'#f5f4f0', boxShadow:'none' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px', marginBottom:'12px' }}>
                    <div>
                      <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.54rem', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(18,18,18,0.35)' }}>{screen}</p>
                      <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.5rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(18,18,18,0.22)', marginTop:'2px' }}>{sub}</p>
                    </div>
                    <svg viewBox="0 0 32 32" width="36" height="36" style={{ flexShrink:0 }}>
                      <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(18,18,18,0.1)" strokeWidth="1.5" />
                      <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(124,58,237,0.55)" strokeWidth="1.5" strokeDasharray="81.68" strokeDashoffset="20.42" strokeLinecap="round" transform="rotate(-90 16 16)" />
                    </svg>
                  </div>
                  <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'rgba(18,18,18,0.55)', lineHeight:'1.7', marginBottom:'10px' }}>{desc}</p>
                  <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.56rem', letterSpacing:'0.08em', fontStyle:'italic', color:'rgba(18,18,18,0.32)' }}>{detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ ...cardStyle(false), background:'#f0eeea' }}>
              <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.54rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(18,18,18,0.28)', marginBottom:'20px' }}>Core interaction pattern — hover + hold</p>
              <div style={{ display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
                {[['01','Hand hovers over option','✋'],['02','Hold still 1.5 seconds','⏱'],['03','Circle stroke fills 100%','◎'],['04','Selection confirmed','✓']].map(([step,action,icon])=>(
                  <div key={step} style={{ display:'flex', alignItems:'center', gap:'10px', flex:'1', minWidth:'140px' }}>
                    <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'rgba(124,58,237,0.07)', border:'1px solid rgba(124,58,237,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.875rem' }}>{icon}</div>
                    <div>
                      <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.48rem', color:'rgba(18,18,18,0.3)', letterSpacing:'0.1em' }}>STEP {step}</p>
                      <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.75rem', color:'rgba(18,18,18,0.65)' }}>{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Wrap>
      </div>

      {/* ── REFLECTIONS — dark ── */}
      <div id="reflections" style={{ background:D, ...PAD }}>
        <Wrap>
          <span style={LABEL_STYLE(true)}>Reflections &amp; Takeaways</span>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:'12px', padding:'10px 18px', border:'1px solid rgba(124,58,237,0.25)', borderRadius:'100px', background:'rgba(124,58,237,0.06)', marginBottom:'clamp(3rem,6vw,5rem)' }}>
              <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.54rem', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>Presented at</span>
              <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', fontWeight:600, color:'rgba(255,255,255,0.75)' }}>SAP Impulse Showcase 2025</span>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'clamp(2rem,5vw,4rem) clamp(2rem,4vw,3.5rem)' }}>
            {[
              { n:'01', t:'Curiosity > Information',      b:"Engagement sustains learning better than monotonous explanations. Wonder is the door; information is what's inside." },
              { n:'02', t:'Intuitive gestures feel human', b:'When interaction feels universal and relatable, it enhances the experience rather than adding cognitive load.' },
              { n:'03', t:'Learning is embodied',          b:'Minds remember what can be externalised. The body is not separate from the mind — it is part of how we understand.' },
              { n:'04', t:'Evoke wonder',                  b:'Not just understanding, but feeling. The goal was never to explain tectonic plates — it was to make children feel the Earth move.' },
            ].map(({ n,t,b }, i)=>(
              <Reveal key={n} delay={i * 0.08}>
                <div style={{ position:'relative' }}>
                  <div style={{ position:'absolute', top:0, left:'-8px', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'clamp(5rem,9vw,8rem)', color:'rgba(255,255,255,0.04)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>{n}</div>
                  <div style={{ position:'relative', paddingTop:'clamp(2.5rem,4vw,3.5rem)' }}>
                    <p style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'clamp(1.1rem,1.5vw,1.4rem)', color:'rgba(255,255,255,0.88)', marginBottom:'12px', lineHeight:'1.25' }}>{t}</p>
                    <p style={{ fontFamily:'Syne,sans-serif', fontSize:'0.875rem', color:'#999', lineHeight:'1.75' }}>{b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </div>

      {/* ── PULL QUOTE ── */}
      <PullQuote text="The goal was never to explain tectonic plates — it was to make children feel the Earth move." />

      <div id="footer-sentinel" style={{ height:'1px' }} />
      <Footer />
    </div>
  )
}
