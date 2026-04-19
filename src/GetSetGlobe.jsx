import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
// Accent colours derived from Get Set Globe project card gradient:
// from-[#050f08] via-[#0b2e16] to-[#135728]
const C = {
  // Light page backgrounds
  page:    '#F3F6F2',
  surface: '#E8EDE6',
  card:    '#F6FAF5',

  // Neumorphic shadows
  neu:     '6px 6px 18px rgba(0,0,0,0.08), -4px -4px 12px rgba(255,255,255,0.88)',
  neuSm:   '4px 4px 12px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)',

  // Accent — from GSG gradient
  accent:       '#0F5132',
  accentMid:    '#1a7a4a',
  accentDim:    'rgba(15,81,50,0.07)',
  accentBorder: 'rgba(15,81,50,0.14)',

  // Dark sections (hero, reflections)
  dark:     '#050f08',
  heroGrad: 'linear-gradient(145deg,#050f08 0%,#0b2e16 55%,#135728 100%)',
  darkInk:  '#F0F4EE',
  darkMid:  'rgba(240,244,238,0.65)',
  darkMuted:'rgba(240,244,238,0.38)',

  // Light-section typography
  ink:    '#0E200F',
  mid:    '#3A5840',
  muted:  '#78917E',

  // Borders
  border:       'rgba(0,0,0,0.08)',
  borderAccent: 'rgba(15,81,50,0.12)',
}

const EASE = [0.22, 1, 0.36, 1]

// ─── Sidebar Sections ────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'overview',    label: 'Why?' },
  { id: 'problem',     label: 'Problem' },
  { id: 'research',    label: 'Research' },
  { id: 'audience',    label: 'Audience' },
  { id: 'concept',     label: 'Concept' },
  { id: 'technology',  label: 'Technology' },
  { id: 'design',      label: 'Design' },
  { id: 'trials',      label: 'Process' },
  { id: 'reflections', label: 'Reflect.' },
]

// ─── Layout ──────────────────────────────────────────────
function Wrap({ children, className = '' }) {
  return (
    <div className={`max-w-[1120px] mx-auto px-[clamp(1.5rem,5vw,3rem)] ${className}`}>
      {children}
    </div>
  )
}
const PAD = { paddingTop: 'clamp(5rem,8vw,7rem)', paddingBottom: 'clamp(4rem,6vw,6rem)' }

// ─── Typography ──────────────────────────────────────────
function SectionTag({ children, dark = false }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
      color: dark ? C.darkMuted : C.muted,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : C.border}`,
      padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem',
    }}>{children}</span>
  )
}

function Label({ children, dark = false }) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
      color: dark ? C.darkMuted : C.muted, display: 'block', marginBottom: '1.25rem',
    }}>{children}</span>
  )
}

// ─── Neumorphic Card ─────────────────────────────────────
function NeuCard({ children, style = {}, dark = false }) {
  if (dark) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
        boxShadow: '6px 6px 18px rgba(0,0,0,0.35), -3px -3px 10px rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)', ...style,
      }}>{children}</div>
    )
  }
  return (
    <div style={{
      background: C.card, borderRadius: '14px',
      boxShadow: C.neu, border: 'none', ...style,
    }}>{children}</div>
  )
}

// ─── Placeholder Image Box ────────────────────────────────
function ImgBox({ label, aspect = '56.25%', style = {}, dark = false }) {
  const bg = dark ? 'rgba(255,255,255,0.04)' : C.card
  const shadow = dark
    ? '6px 6px 18px rgba(0,0,0,0.35), -3px -3px 10px rgba(255,255,255,0.03)'
    : C.neu
  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: aspect,
      background: bg, borderRadius: '12px', boxShadow: shadow,
      border: dark ? '1px solid rgba(255,255,255,0.06)' : 'none',
      overflow: 'hidden', ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={dark ? 'rgba(255,255,255,0.2)' : C.muted} strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke={dark ? 'rgba(255,255,255,0.2)' : C.muted} strokeWidth="1.5" />
          <path d="M3 15l5-5 4 4 3-3 6 6" stroke={dark ? 'rgba(255,255,255,0.2)' : C.muted} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em',
          color: dark ? 'rgba(255,255,255,0.25)' : C.muted,
          textAlign: 'center', maxWidth: '220px', lineHeight: 1.5,
        }}>{label}</span>
      </div>
    </div>
  )
}

function ScreenLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: '0.55rem',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: C.muted, textAlign: 'center', marginTop: '0.75rem',
    }}>{children}</div>
  )
}

// ─── Stagger Helpers ─────────────────────────────────────
function StaggerGrid({ children, style = {}, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })
  return (
    <motion.div ref={ref} className={className} style={style}
      initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
    >{children}</motion.div>
  )
}

function StaggerItem({ children, style = {} }) {
  return (
    <motion.div style={{ display: 'flex', flexDirection: 'column', ...style }}
      variants={{
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
    >{children}</motion.div>
  )
}

// ─── Sidebar Nav ─────────────────────────────────────────
function SidebarNav({ active }) {
  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div style={{
      position: 'fixed', left: 'clamp(10px,1.5vw,22px)', top: '50%',
      transform: 'translateY(-50%)', zIndex: 200,
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {NAV_SECTIONS.map(sec => {
        const isActive = active === sec.id
        return (
          <button key={sec.id} onClick={() => scrollTo(sec.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
          >
            <motion.div
              animate={{
                width: isActive ? 3 : 1.5, height: isActive ? 32 : 22,
                background: isActive ? C.accent : C.border, borderRadius: 2,
              }}
              transition={{ duration: 0.3 }} style={{ flexShrink: 0 }}
            />
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: '0.58rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: isActive ? C.accent : C.muted,
              transition: 'color 0.25s', whiteSpace: 'nowrap',
            }}>{sec.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── useActiveSection ────────────────────────────────────
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observers = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])
  return active
}

// ─── Tectonic Map ─────────────────────────────────────────
function TectonicMap() {
  return (
    <div style={{ width: '100%', borderRadius: '14px', overflow: 'hidden', boxShadow: C.neu, background: C.card, aspectRatio: '16/7' }}>
      <svg viewBox="0 0 800 350" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="gsg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(15,81,50,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="800" height="350" fill={C.card} />
        <ellipse cx="400" cy="175" rx="320" ry="160" fill="url(#gsg-glow)" />
        <g stroke={C.accentBorder} strokeWidth="1.1" fill="none" strokeDasharray="5 3">
          <path d="M222 15 Q232 75 218 138 Q202 198 212 278 Q217 318 222 350" />
          <path d="M575 15 Q598 58 618 98 Q638 158 628 218 Q614 278 598 350" />
          <path d="M0 148 Q58 138 118 158 Q158 173 198 163" />
          <path d="M618 158 Q678 138 738 153 Q768 163 800 158" />
          <path d="M362 118 Q400 108 440 113 Q478 118 508 128" />
          <path d="M242 198 Q280 188 318 203 Q348 213 368 238 Q378 268 368 308" />
          <path d="M508 128 Q540 145 558 175 Q565 205 552 235" />
        </g>
        <g>
          {[380,400,420,440,460].map(x => <polygon key={x} points={`${x},112 ${x+6},122 ${x-6},122`} fill={`${C.accent}99`} />)}
          <text x="382" y="104" fill={`${C.accent}99`} fontFamily="monospace" fontSize="6.5" letterSpacing="0.5">▲ CONVERGENT — HIMALAYAS</text>
        </g>
        <g fill={`${C.accent}18`} stroke={`${C.accent}30`} strokeWidth="0.75">
          <path d="M62 38 L128 33 L153 53 L158 88 L143 128 L128 158 L108 188 L93 208 L78 203 L63 178 L53 148 L48 108 L53 73 Z" />
          <path d="M108 218 L133 213 L148 233 L153 268 L143 308 L128 338 L108 338 L93 318 L88 288 L93 258 L103 238 Z" />
          <path d="M268 38 L318 33 L338 48 L333 73 L313 88 L288 83 L268 68 Z" />
          <path d="M268 108 L318 98 L343 118 L348 158 L338 198 L323 238 L303 268 L283 268 L268 243 L258 198 L253 158 L258 128 Z" />
          <path d="M348 28 L448 23 L508 33 L538 53 L548 78 L528 98 L488 108 L438 113 L398 103 L363 88 L343 63 Z" />
          <path d="M418 118 L453 116 L463 138 L453 173 L433 193 L413 183 L406 158 L408 133 Z" />
          <path d="M568 198 L638 193 L668 213 L666 253 L643 273 L598 276 L568 258 L556 233 L560 213 Z" />
        </g>
        <g fill={C.mid} fontFamily="monospace" fontSize="7.5" letterSpacing="0.8" opacity="0.6">
          <text x="72"  y="118">N. AMERICAN</text>
          <text x="88"  y="272">S. AMERICAN</text>
          <text x="153" y="195">AFRICAN</text>
          <text x="385" y="65">EURASIAN</text>
          <text x="443" y="165">INDO-AUS.</text>
          <text x="618" y="148">PACIFIC</text>
        </g>
        <g stroke={`${C.accent}80`} strokeWidth="1.2">
          <defs><marker id="arr-g" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto"><polygon points="0,0 5,2.5 0,5" fill={`${C.accent}80`} /></marker></defs>
          <line x1="392" y1="106" x2="408" y2="111" markerEnd="url(#arr-g)" />
          <line x1="488" y1="110" x2="470" y2="113" markerEnd="url(#arr-g)" />
        </g>
      </svg>
    </div>
  )
}

// ─── Kinect Diagram ────────────────────────────────────────
function KinectDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const steps = [
    { label: 'Kinect One', sub: 'IR · Depth · Camera · Mic Array' },
    { label: 'Skeletal Tracking', sub: 'X · Y · Z node coordinates' },
    { label: 'TouchDesigner', sub: 'CPU mapping & processing' },
    { label: 'Visual Output', sub: 'Real-time dynamic response' },
  ]
  return (
    <div ref={ref}>
      <NeuCard style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, marginBottom: '1.5rem' }}>
          {steps.map((s, i) => (
            <motion.div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 120 }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.1 }}
            >
              <div style={{ textAlign: 'center', flex: 1, padding: '10px 8px' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accentDim, border: `1px solid ${C.accentBorder}`, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', color: C.accent }}>{String(i+1).padStart(2,'0')}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.82rem', color: C.ink, marginBottom: '2px', margin: 0 }}>{s.label}</p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.06em', color: C.muted, marginTop: '3px' }}>{s.sub}</p>
              </div>
              {i < steps.length-1 && <span style={{ color: C.muted, flexShrink: 0 }}>→</span>}
            </motion.div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          {[['INPUT','Body movements, hand gestures, proximity data'],['PROCESSING','Coordinate mapping onto visual elements in real time'],['OUTPUT','Dynamic visuals responding to every movement']].map(([k,v]) => (
            <div key={k} style={{ padding: '0.875rem 1rem', borderRadius: '10px', background: C.surface, border: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.14em', color: C.muted, marginBottom: '4px', margin: '0 0 4px' }}>{k}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.mid, lineHeight: 1.55, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
      </NeuCard>
    </div>
  )
}

// ─── Prototype Flow ────────────────────────────────────────
function PrototypeFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const steps = [
    {n:'01',label:'Device\nConnection'},{n:'02',label:'Menu'},{n:'03',label:'Topic\nGallery'},
    {n:'04',label:'Topic of\nInterest'},{n:'05',label:'Learn'},{n:'06',label:'Complete'},{n:'07',label:'Menu'},
  ]
  return (
    <NeuCard dark style={{ padding: '1.5rem 2rem', overflowX: 'auto' }}>
      <div ref={ref} style={{ display: 'flex', alignItems: 'center', minWidth: 500 }}>
        {steps.map((s, i) => (
          <motion.div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 }}
          >
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (i===0||i===6) ? C.accentDim : 'rgba(255,255,255,0.04)', border: `1px solid ${(i===0||i===6) ? C.accentBorder : 'rgba(255,255,255,0.1)'}` }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', color: (i===0||i===6) ? C.accent : 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>{s.n}</span>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.3, whiteSpace: 'pre-line', margin: 0 }}>{s.label}</p>
            </div>
            {i < steps.length-1 && <div style={{ width: 14, height: 1, flexShrink: 0, background: 'rgba(255,255,255,0.12)' }} />}
          </motion.div>
        ))}
      </div>
    </NeuCard>
  )
}

// ─── IA Nodes ─────────────────────────────────────────────
function IANode({ label, sub, accent, small }) {
  return (
    <div style={{ minWidth: small?'120px':'160px', maxWidth: small?'160px':'200px', background: accent ? C.accentDim : 'rgba(0,0,0,0.025)', border: `1px solid ${accent ? C.accentBorder : C.border}`, borderRadius: '8px', padding: '10px 12px', textAlign: 'center' }}>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: small?'0.7rem':'0.775rem', fontWeight: accent?500:400, color: accent?C.ink:C.mid, lineHeight: 1.3, margin: 0 }}>{label}</p>
      {sub && <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.06em', color: C.muted, marginTop: '3px', marginBottom: 0 }}>{sub}</p>}
    </div>
  )
}
function IAConnector() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '1px', height: '16px', background: C.border }} />
      <svg width="7" height="5" viewBox="0 0 7 5" fill={C.muted} opacity="0.5"><polygon points="0,0 7,0 3.5,5" /></svg>
    </div>
  )
}
function IADiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: '720px', padding: '16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><IANode label="Intro Video" sub="Entry point" /></div>
        <IAConnector />
        <div style={{ display: 'flex', justifyContent: 'center' }}><IANode label="Menu" sub="Topic Gallery" /></div>
        <IAConnector />
        <div style={{ display: 'flex', justifyContent: 'center' }}><IANode label="Tectonic Plates" sub="Selected topic" accent /></div>
        <IAConnector />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
            <IANode label="Current globe" sub="2024 tectonic config" small />
            <IAConnector /><IANode label="Step back → Continental drift" sub="Proxemics: body steps back" small accent />
            <IAConnector /><IANode label="Step further back → Pangaea" sub="Time reversal" small />
            <IAConnector /><IANode label="Return to present" sub="Body steps forward" small accent />
            <IAConnector /><IANode label="Peel Earth's layers" sub="Sagittal arm gesture" small accent />
            <IAConnector /><IANode label="Tectonic map overlay" sub="Automatic reveal" small />
          </div>
          <div style={{ width: '1px', background: C.border, alignSelf: 'stretch', marginTop: '24px', marginLeft: '16px', marginRight: '16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
            <IANode label="Plate movement types" sub="Explore further" small />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '8px', marginTop: 0, width: '100%' }}>
              {[{l:'Convergent',s:'Hands converge',hi:true},{l:'Divergent',s:'Hands separate'},{l:'Transformative',s:'Lateral slide'}].map(({l,s,hi}) => (
                <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <IAConnector /><IANode label={l} sub={s} small accent={hi} />
                  {hi && <><IAConnector /><IANode label="Himalayas formation" sub="Lithospheric collision" small /><IAConnector /><IANode label="Altitude changes" sub="Aftereffects visualised" small /></>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Interactions data ────────────────────────────────────
const INTERACTIONS = [
  { n:'01', activity:'Choose subject: tectonics',  pattern:'Hover to select',    input:'Air Gesture',  output:'Visual · GUI' },
  { n:'02', activity:'View Pangea',                pattern:'Step back in time',  input:'Proxemics',    output:'Visual · Audio' },
  { n:'03', activity:'Return to present',          pattern:'Step forward',       input:'Proxemics',    output:'Visual · Audio' },
  { n:'04', activity:'Overlay tectonic map',       pattern:'Automatic reveal',   input:'System',       output:'Visual' },
  { n:'05', activity:"Deconstruct Earth's layers", pattern:'Hand peel outward',  input:'Hand motion',  output:'Visual · Audio' },
  { n:'06', activity:"Reconstruct Earth's layers", pattern:'Reverse peel',       input:'Hand motion',  output:'Visual · Audio' },
  { n:'07', activity:'View movement map',          pattern:'Show movement type', input:'System',       output:'Visual' },
  { n:'08', activity:'Formation of the Himalayas', pattern:'Converging gesture', input:'Air Gesture',  output:'Visual · Audio · Haptics' },
]

// ─── Concepts data ────────────────────────────────────────
const CONCEPTS = [
  { label: "Earth's Tilt & Seasons",       chosen: false },
  { label: 'Water Distribution on Earth',  chosen: false },
  { label: 'Geological Time Scales',        chosen: true  },
  { label: 'Weathering vs. Erosion',        chosen: false },
  { label: 'Latitude & Longitude',          chosen: false },
  { label: 'Weather vs. Climate',           chosen: false },
  { label: 'Sustainability & Human Impact', chosen: false },
  { label: 'Ocean Currents',                chosen: false },
]

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
export default function GetSetGlobe() {
  const active = useActiveSection(NAV_SECTIONS.map(s => s.id))

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Get Set Globe — Zeus Batkhar'
    return () => { document.title = 'Zeus Zechariah Batkhar — UX Designer' }
  }, [])

  return (
    <div style={{ background: C.page, minHeight: '100vh', color: C.ink }}>
      <ProgressBar />
      <Nav />
      <SidebarNav active={active} />

      {/* ── HERO (dark) ── */}
      <section style={{ background: C.heroGrad, paddingTop: 'clamp(7rem,12vw,11rem)', paddingBottom: 'clamp(5rem,8vw,8rem)' }}>
        <Wrap>
          <MaskReveal delay={0}>
            <SectionTag dark>EdTech · Interaction Design · 2024</SectionTag>
          </MaskReveal>
          <MaskReveal delay={0.1}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 500,
              fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08,
              color: C.darkInk, margin: '0 0 1.75rem', maxWidth: '16ch',
            }}>
              Get, Set,{' '}<span style={{ color: '#6FCF97' }}>Globe!</span>
            </h1>
          </MaskReveal>
          <MaskReveal delay={0.2}>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1rem,2vw,1.15rem)',
              lineHeight: 1.75, color: C.darkMid, maxWidth: '55ch', margin: '0 0 3rem',
            }}>
              I kept coming back to one memory: a geography class where the teacher drew a flat diagram of tectonic plates on a board, and I understood nothing. Get Set Globe is my attempt at the opposite: an experience where children don't just see Earth's forces, they feel them.
            </p>
          </MaskReveal>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { l: 'Team',      v: 'Zeus · Saneeta · Hiral' },
              { l: 'Type',      v: 'Interaction Design' },
              { l: 'Duration',  v: '3 Weeks' },
              { l: 'Showcase',  v: 'SAP Impulse 2025' },
            ].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.darkMuted, textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.darkInk, margin: 0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── WHY THIS PROJECT ── */}
      <section id="overview" style={{ background: C.surface, ...PAD }}>
        <Wrap>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            <Reveal><SectionTag>Why This Project?</SectionTag></Reveal>
            <MaskReveal delay={0.1}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem,3.5vw,2.75rem)',
                letterSpacing: '-0.02em',
                color: C.ink,
                marginBottom: '1.5rem',
              }}>What Earth science class never gave us</h2>
            </MaskReveal>
            <Reveal delay={0.2}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.05rem,2vw,1.3rem)',
                color: C.mid,
                lineHeight: 1.75,
              }}>
                There's a geography class I can still picture clearly: a teacher drawing flat plates on a board, arrows pointing sideways, and me understanding none of it. The map said the world moved, but nothing in that room moved with it. Earth science has always been taught this way, as a diagram, a label, a list of terms to memorise. But the Earth isn't a diagram. It has{' '}
                <strong style={{ color: C.ink, fontWeight: 600 }}>mass, heat, and violence</strong>, and children can feel the difference between being told that and experiencing it. That's what Get Set Globe was built around.
              </p>
            </Reveal>
          </div>
        </Wrap>
      </section>

      {/* ── THE PROBLEM (surface) ── */}
      <section id="problem" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>02 — The Problem</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Seeing is believing, and that's the problem.
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 0.75rem' }}>
              For centuries, maps and globes have helped us hold the vastness of Earth in our hands. But they're not the world itself, only windows into it. They shrink oceans into blue patches and mountains into lines.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: C.mid, margin: '0 0 2.5rem', lineHeight: 1.7 }}>
              "Children take visuals at face value. Traditional teaching shows Earth as static, reducing dynamic phenomena to diagrams. But to truly understand Earth, children must go beyond vision, through experience."
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { title: 'Static teaching',     body: 'Diagrams flatten living, moving systems into flat images with no sense of scale or time.' },
              { title: 'Passive observation', body: 'Students watch but never interact, with no ownership over the experience or its meaning.' },
              { title: 'Abstract concepts',   body: "Tectonic forces, geological time, and Earth's interior remain intangible and forgettable." },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ width: 28, height: 2.5, borderRadius: 2, background: C.accent, opacity: 0.5 + i * 0.1, marginBottom: '0.2rem' }} />
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{card.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.body}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <NeuCard style={{ padding: '1.5rem 2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <TectonicMap />
                <ScreenLabel>Major tectonic plates · convergent boundaries highlighted</ScreenLabel>
              </div>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── RESEARCH (page) ── */}
      <section id="research" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>03 — Research</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              I needed research to back an instinct I already had
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              My instinct was that learning through the body works better than learning through the page. It turns out there's solid research backing that. Meaning is made multimodally: through gesture, movement, gaze, posture, and speech working together, not just words on a board.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { v: '90%',  l: 'Recall for gesture-based learning', s: 'vs. speech only' },
              { v: '33%',  l: 'Recall for speech-only learning',   s: 'Baseline retention' },
              { v: '2.5×', l: 'Sensorimotor-enriched modes',       s: 'Retention multiplier' },
            ].map(({ v, l, s }, i) => (
              <StaggerItem key={v} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.accent, margin: 0, lineHeight: 1 }}>{v}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.85rem', color: C.ink, margin: 0 }}>{l}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.76rem', color: C.mid, margin: 0 }}>{s}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <NeuCard style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid }}>visual proxemics</span>
                <span style={{ color: C.muted }}>+</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid }}>speech audio</span>
                <span style={{ color: C.muted }}>=</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.accent }}>engaging learning experience</span>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.06em', color: C.muted, margin: 0 }}>
                Source: Cook, Wagner, Mitchell & Goldin-Meadow (2008). "Gesturing Makes Learning Last." Psychological Science 19(11): 1047–53.
              </p>
            </NeuCard>
          </Reveal>

          <div style={{ marginTop: '3.5rem' }}>
            <Reveal>
              <Label>The question that drove everything</Label>
              <NeuCard style={{ padding: '2rem 2.25rem', borderLeft: `3px solid ${C.accent}` }}>
                <blockquote style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.15rem,2.2vw,1.5rem)', fontStyle: 'italic',
                  lineHeight: 1.6, color: C.ink, margin: 0,
                }}>
                  "How can multimodal methods of learning nurture curiosity and help children explore Earth's depths in their early development?"
                </blockquote>
              </NeuCard>
            </Reveal>
          </div>
        </Wrap>
      </section>

      {/* ── AUDIENCE (surface) ── */}
      <section id="audience" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>04 — Audience</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Who I was designing for
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              Old enough to understand cause and effect, young enough to still find Earth genuinely astonishing. Children aged 10 to 12 sit right at the edge of abstract thinking, which makes them the ideal test case for whether embodied interaction can bridge the gap that diagrams leave behind.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { n: '01', t: 'Cognitive readiness', b: 'Can grasp cause-effect, sequence, and physical transformation.' },
              { n: '02', t: 'Learning style',      b: 'Learn best through hands-on interaction and guided discovery.' },
              { n: '03', t: 'Core challenge',      b: 'Struggle with visualising deep time and internal processes.' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.muted }}>{card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{card.t}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.b}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <NeuCard style={{ padding: '1.5rem 2rem', marginTop: '1rem' }}>
              <Label>Current learning barriers</Label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Traditional teaching limits sensory engagement.',
                  'Short attention spans (7–10 mins) lead to low retention.',
                  'Earth processes remain abstract and intangible concepts.',
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, flexShrink: 0, paddingTop: '2px' }}>{String(i+1).padStart(2,'0')}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.875rem', color: C.mid, lineHeight: 1.6, margin: 0 }}>{b}</p>
                  </div>
                ))}
              </div>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── CONCEPT (page) ── */}
      <section id="concept" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>05 — Concept</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              What I set out to build
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
              The research told us children struggle most with concepts that require imagining scale, time, and invisible forces. We mapped candidate topics and asked: which one would feel most different if you could experience it rather than be told about it?
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2.5rem' }}>
              {CONCEPTS.map(({ label, chosen }) => (
                <span key={label} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', padding: '6px 14px', borderRadius: '8px', border: `1px solid ${chosen ? C.accentBorder : C.border}`, background: chosen ? C.accentDim : 'transparent', color: chosen ? C.accent : C.mid, fontWeight: chosen ? 500 : 400 }}>
                  {chosen && <span style={{ marginRight: '4px', fontSize: '0.6rem' }}>✓</span>}
                  {label}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}><Label>Three initial directions explored</Label></Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { n: 'Direction 01', t: 'Pangea narrative',  b: "Earth's shape imagined as anything but spherical; the story sparks curiosity and leads to why Earth has its present form, emphasising the role of tectonic plates." },
              { n: 'Direction 02', t: 'Time travel',       b: "Travelling back in time to trace Earth's evolution helps learners grasp the dynamic tectonic forces that have sculpted the planet's current shape." },
              { n: 'Direction 03', t: 'Scale first',       b: "Tectonic plates introduced by first helping children comprehend Earth's vast scale, then showing how its surface is split into constantly shifting sections." },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: C.muted }}>{card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{card.t}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.b}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.12}>
            <NeuCard style={{ padding: '2rem 2.25rem', borderLeft: `3px solid ${C.accent}` }}>
              <Label>What I set out to build</Label>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.4rem)', lineHeight: 1.6, color: C.ink, margin: 0 }}>
                I wanted to build something that worked on a child's terms, not the curriculum's. An experience where learning Earth means acting on it: stepping back to watch Pangea drift, peeling back layers with your hands, colliding plates to feel the Himalayas form. Not passive. Not abstract. Something that earns its place in a classroom by making understanding feel inevitable.
              </p>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── TECHNOLOGY (surface) ── */}
      <section id="technology" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>06 — Technology</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              How it works: the Kinect
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              The Kinect One was built for gaming, but its skeletal tracking was exactly what we needed. It reads body-node coordinates in 3D space across depth, and those readings feed directly into TouchDesigner to drive real-time visual output. Your body becomes the controller.
            </p>
          </Reveal>

          <Reveal delay={0.08}><KinectDiagram /></Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginTop: '1rem', marginBottom: '3rem' }}>
            {[['IR Sensor','Infrared object detection'],['IR Depth','Z-axis depth reading'],['Colour Camera','Visual context capture'],['LED Mic Array','Audio input cues']].map(([s, d]) => (
              <Reveal key={s}>
                <NeuCard style={{ padding: '1rem 1.1rem' }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: '0 0 4px' }}>{s}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, margin: 0 }}>{d}</p>
                </NeuCard>
              </Reveal>
            ))}
          </div>

          {/* Initial direction */}
          <Reveal>
            <Label>Initial direction: physical globe</Label>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
              Our first instinct was to make the globe literal. A sensor-enabled physical object that children could interact with directly, through three gestures:
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { n: 'Step 01', t: 'Step back',       b: 'See Pangea form as you move away from the globe.' },
              { n: 'Step 02', t: 'Peel off layers', b: "Explore Earth's interior layer by layer." },
              { n: 'Step 03', t: 'Pinch plates',    b: 'Create converging tectonic movement with a pinch gesture.' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: C.muted }}>{card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{card.t}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.b}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <NeuCard style={{ padding: '1.5rem 2rem', borderLeft: '3px solid rgba(200,80,80,0.4)', background: '#FFF7F7', boxShadow: 'none' }}>
              <Label>Why we moved on: not using a physical globe</Label>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.875rem', color: C.mid, lineHeight: 1.7, margin: '0 0 0.75rem' }}>
                We tested it and the engagement was real. Children responded immediately to motion-based interaction. But the globe as a fixed object felt like a constraint, and the gestures were too lesson-specific to carry meaning outside of one activity.
              </p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.875rem', color: C.ink, margin: 0 }}>
                The takeaway: gestures should feel universal and reusable, not one-off actions bound to a single lesson.
              </p>
            </NeuCard>
          </Reveal>

          {/* Prototype flow */}
          <div style={{ marginTop: '3.5rem' }}>
            <Reveal>
              <Label>7-step experience loop</Label>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
                I mapped the full experience as a loop, from the moment the device connects to the moment a child finishes and wants to go again. Every transition had to feel earned, not just navigated.
              </p>
            </Reveal>
            <Reveal delay={0.08}><PrototypeFlow /></Reveal>
          </div>
        </Wrap>
      </section>

      {/* ── DESIGN (page) ── */}
      <section id="design" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>07 — Design</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              How the experience unfolds
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              Every node had to justify its existence. The journey starts with a short intro to orient the child, then hands full control to the learner: travel back to Pangaea, return to the present, peel open the Earth, converge plates to form the Himalayas. The loop back to the menu makes the experience repeatable, not finite.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <NeuCard style={{ padding: '1.5rem 2rem', marginBottom: '1rem' }}>
              <IADiagram />
            </NeuCard>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '3rem' }}>
              {[
                { accent: true,  label: 'Green nodes: user-triggered interactions' },
                { accent: false, label: 'White nodes: system-driven transitions' },
              ].map(({ accent, label }) => (
                <NeuCard key={label} style={{ padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '3px', flexShrink: 0, background: accent ? C.accentDim : 'rgba(0,0,0,0.03)', border: `1px solid ${accent ? C.accentBorder : C.border}` }} />
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.mid }}>{label}</span>
                </NeuCard>
              ))}
            </div>
          </Reveal>

          {/* Interactions table */}
          <Reveal>
            <Label>All 8 interactions</Label>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
              Each interaction maps a natural body movement to a geological concept. The goal: gestures that feel universal and reusable across lessons.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <NeuCard style={{ overflow: 'hidden', marginBottom: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr 1fr 1fr', padding: '10px 1.5rem', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                {['No.','Activity','Mode / Pattern','Input → Output'].map(h => (
                  <span key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>{h}</span>
                ))}
              </div>
              {INTERACTIONS.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr 1fr 1fr', padding: '12px 1.5rem', borderBottom: i < INTERACTIONS.length-1 ? `1px solid ${C.border}` : 'none', background: row.n === '08' ? C.accentDim : i%2===0 ? C.card : 'transparent' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted }}>{row.n}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.ink, paddingRight: '1rem' }}>{row.activity}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, paddingRight: '1rem' }}>{row.pattern}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: C.mid, lineHeight: 1.5 }}>
                    <span style={{ color: C.ink }}>{row.input}</span>
                    {row.input !== 'System' && <span style={{ color: C.muted }}> → </span>}
                    {row.input !== 'System' && row.output}
                  </span>
                </div>
              ))}
            </NeuCard>
          </Reveal>

          {/* Core 4 interactions */}
          <Reveal><Label>The four that defined the experience</Label></Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { n: '01', title: 'Proxemics → Continental Drift & Pangea',  detail: "Using proxemics and frontal arm movements to cause the continental drift and formation of Pangea, depending on the user's movement direction and speed.", sensor: 'Proximity · Body position', gesture: 'Step backward / forward', effect: 'Time reversal / continental drift', accent: true },
              { n: '02', title: "Sagittal Arm Movement → Earth's Interior", detail: "Sagittal arm movement reveals the inner layers of the Earth, exposing the crust, mantle and core, each layer's role in tectonic forces explained as you go.", sensor: 'Hand motion · Depth tracking', gesture: 'Arm sweep forward/back', effect: "Peels and rebuilds Earth's layers", accent: false },
              { n: '03', title: 'Air Gesture → Himalayan Collision',         detail: 'Bringing both hands together in a converging gesture triggers the simulation of colliding lithospheric plates, showing the formation of the Himalayas with visual, audio, and haptic feedback.', sensor: 'Air gesture · Hand tracking', gesture: 'Both hands converge', effect: 'Mountain formation + haptic', accent: true },
              { n: '04', title: 'Hover + Hold → Menu Selection',             detail: 'Simple UI inspired by Xbox Kinect games. Intuitive hand hover for navigation, with a steady hold to confirm a selection. Visual cue: completion of a circle stroke around the option.', sensor: 'Air gesture · Hand position', gesture: 'Hover + hold still', effect: 'Selection confirmed via circle', accent: false },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderLeft: card.accent ? `2px solid ${C.accent}` : 'none' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: C.muted }}>Interaction {card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0, lineHeight: 1.3 }}>{card.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.detail}</p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '0.25rem' }}>
                    {[['Gesture', card.gesture], ['Effect', card.effect]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, width: 44, flexShrink: 0 }}>{k}</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.mid }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* UI Design */}
          <Reveal>
            <Label>UI Design: Xbox Kinect-inspired, no touch required</Label>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
              The UI is inspired by Xbox Kinect games: simple, legible, and designed for full-body interaction from a distance.
            </p>
          </Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { screen: 'Onboarding Screen 01', sub: 'Navigation Pattern', desc: "Intuitive hand movements for on-screen navigation, followed by a steady hold to confirm the selected choice. Visual cue: a circle stroke that fills to 100% on confirmation." },
              { screen: 'Onboarding Screen 02', sub: 'Topic Selection', desc: "Selections of topics expand based on hand movements hovering over them. A steady pause of the hand movement confirms the intended selection, the visual cue being the completion of the circle's stroke." },
            ].map(({ screen, sub, desc }) => (
              <StaggerItem key={screen} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.54rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>{screen}</p>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, opacity: 0.6, margin: '2px 0 0' }}>{sub}</p>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, lineHeight: 1.7, margin: 0, flex: 1 }}>{desc}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <NeuCard style={{ padding: '1.5rem 2rem' }}>
              <Label>Core interaction pattern: hover + hold</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {[['01','Hand hovers over option','✋'],['02','Hold still 1.5 seconds','⏱'],['03','Circle stroke fills 100%','◎'],['04','Selection confirmed','✓']].map(([step, action, icon]) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '130px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.accentDim, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>{icon}</div>
                    <div>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', color: C.muted, letterSpacing: '0.1em', margin: 0 }}>STEP {step}</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.76rem', color: C.mid, margin: 0 }}>{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── TRIALS (surface) ── */}
      <section id="trials" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>08 — Process</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Trials & process
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.15rem', color: C.mid, margin: '0 0 2.5rem', lineHeight: 1.7 }}>
              "This is where the system fought back. The idea was clear; getting it to work was a different problem entirely."
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { n: '01', t: 'Proxemics calibration',     b: 'Getting the depth readings from the Kinect to correctly map to timeline progression required careful calibration of depth thresholds in TouchDesigner.' },
              { n: '02', t: 'Gesture disambiguation',    b: 'Distinguishing intentional gestures from ambient body movement, preventing false triggers while keeping interaction feel instant and natural.' },
              { n: '03', t: 'Layer peel timing',         b: "Tuning the sagittal sweep sensitivity so that Earth's layers reveal at a pace children can follow, not so fast it loses meaning." },
              { n: '04', t: 'Haptic integration',        b: 'The Himalaya converging gesture needed haptic output to complete the sensory loop; sourcing and syncing this with the visual was a key challenge.' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: C.muted }}>Challenge {card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{card.t}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.b}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <Label>Storyboard</Label>
            <NeuCard>
              <ImgBox label="8-step storyboard: course selection → Pangea → Earth layers → convergent/divergent plates → Himalaya formation" aspect="40%" />
              <ScreenLabel>Get Set Globe interaction storyboard</ScreenLabel>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── REFLECTIONS (dark) ── */}
      <section id="reflections" style={{ background: C.heroGrad, ...PAD }}>
        <Wrap>
          <MaskReveal>
            <SectionTag dark>09 — Reflections</SectionTag>
          </MaskReveal>
          <MaskReveal delay={0.08}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.darkInk, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              What stayed with me
            </h2>
          </MaskReveal>
          <MaskReveal delay={0.12}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 18px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px', background: 'rgba(255,255,255,0.06)', marginBottom: 'clamp(3rem,6vw,5rem)' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.54rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.darkMuted }}>Presented at</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.875rem', color: C.darkInk }}>SAP Impulse Showcase 2025</span>
            </div>
          </MaskReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem,5vw,4rem) clamp(2rem,4vw,3.5rem)' }}>
            {[
              { n: '01', t: 'Curiosity > Information',       b: "This project confirmed something I suspected: the moment a child is genuinely curious, everything else becomes easier. No amount of explanation replaces the feeling of encountering something surprising." },
              { n: '02', t: 'Intuitive gestures feel human', b: "The gestures that worked were the ones nobody had to teach. When an interaction matches how the body already wants to move, it disappears into the experience." },
              { n: '03', t: 'Learning is embodied',          b: "The most memorable moments in the prototype were physical ones: the peel, the collision, stepping back to watch Pangea form. The body remembers what the eye alone forgets." },
              { n: '04', t: 'Evoke wonder',                  b: "The question that changed my design decisions wasn't \"will they understand this?\" but \"will they feel it?\" Those are different goals, and the second one is harder." },
            ].map(({ n, t, b }, i) => (
              <Reveal key={n} delay={i * 0.08}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: '-8px', fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(5rem,9vw,8rem)', color: 'rgba(255,255,255,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{n}</div>
                  <div style={{ position: 'relative', paddingTop: 'clamp(2.5rem,4vw,3.5rem)' }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1rem,1.5vw,1.25rem)', color: C.darkInk, marginBottom: '10px', lineHeight: 1.25, margin: '0 0 10px' }}>{t}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.875rem', color: C.darkMid, lineHeight: 1.75, margin: 0 }}>{b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Closing pull quote */}
          <Reveal delay={0.3}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'clamp(4rem,8vw,7rem)', paddingTop: 'clamp(3rem,6vw,5rem)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(1.8rem,3.5vw,3.2rem)', color: C.darkInk, lineHeight: 1.25, maxWidth: '800px', margin: 0 }}>
                "The goal was never to explain tectonic plates. It was to make children feel the Earth move."
              </p>
            </div>
          </Reveal>
        </Wrap>
      </section>

      <div id="footer-sentinel" style={{ height: '1px' }} />
      <Footer />
    </div>
  )
}
