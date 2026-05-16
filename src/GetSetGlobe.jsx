import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import { Nav, Footer, ProgressBar, MaskReveal, Reveal, BackToTop } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
// Accent colours derived from Get Set Globe project card gradient:
// from-[#050f08] via-[#0b2e16] to-[#135728]
const C = {
  // Light page backgrounds
  page:    '#FFFFFB',
  surface: '#FAFAF6',
  card:    '#FFFFFE',
  cardAlt: '#FAFAF8',

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
  { id: 'trials',      label: 'Process & Output' },
  { id: 'reflections', label: 'Reflect' },
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
      fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
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
          fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em',
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
      fontFamily: "'Space Mono', monospace", fontSize: '0.58rem',
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
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h, { passive: true })
    return () => window.removeEventListener('resize', h)
  }, [])
  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  if (isMobile) {
    return (
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: '1px solid rgba(0,0,0,0.09)', boxShadow: '0 -2px 20px rgba(0,0,0,0.07)', padding: '8px 4px', paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
        {NAV_SECTIONS.map(sec => {
          const isActive = active === sec.id
          return (
            <button key={sec.id} onClick={() => scrollTo(sec.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', minWidth: 52 }}>
              <div style={{ width: isActive ? 22 : 14, height: 2, borderRadius: 2, background: isActive ? C.accent : 'rgba(0,0,0,0.18)', transition: 'all 0.25s' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isActive ? C.accent : 'rgba(0,0,0,0.42)', transition: 'color 0.25s', whiteSpace: 'nowrap' }}>{sec.label}</span>
            </button>
          )
        })}
      </nav>
    )
  }
  return (
    <div style={{ position: 'fixed', left: 'clamp(10px,1.5vw,22px)', top: '50%', transform: 'translateY(-50%)', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {NAV_SECTIONS.map(sec => {
        const isActive = active === sec.id
        return (
          <button key={sec.id} onClick={() => scrollTo(sec.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}>
            <motion.div animate={{ width: isActive ? 3 : 1.5, height: isActive ? 32 : 22, background: isActive ? C.accent : C.border, borderRadius: 2 }} transition={{ duration: 0.3 }} style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: isActive ? C.accent : C.muted, transition: 'color 0.25s', whiteSpace: 'nowrap' }}>{sec.label}</span>
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
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.accent }}>{String(i+1).padStart(2,'0')}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, marginBottom: '2px', margin: 0 }}>{s.label}</p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.06em', color: C.muted, marginTop: '3px' }}>{s.sub}</p>
              </div>
              {i < steps.length-1 && <span style={{ color: C.muted, flexShrink: 0 }}>→</span>}
            </motion.div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          {[['INPUT','Body movements, hand gestures, proximity data'],['PROCESSING','Coordinate mapping onto visual elements in real time'],['OUTPUT','Dynamic visuals responding to every movement']].map(([k,v]) => (
            <div key={k} style={{ padding: '0.875rem 1rem', borderRadius: '10px', background: C.surface, border: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', color: C.muted, marginBottom: '4px', margin: '0 0 4px' }}>{k}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.55, margin: 0 }}>{v}</p>
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
    <NeuCard style={{ padding: '2rem 2.5rem', overflowX: 'auto' }}>
      <div ref={ref} style={{ minWidth: 560 }}>
        {/* Row 1: circles centred in equal columns, connectors between */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {steps.flatMap((s, i) => {
            const circle = (
              <motion.div key={`c${i}`} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 }}
              >
                <div style={{ width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: (i===0||i===6) ? C.accentDim : 'rgba(0,0,0,0.04)', border: `1px solid ${(i===0||i===6) ? C.accentBorder : C.border}` }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: (i===0||i===6) ? C.accent : C.mid, letterSpacing: '0.06em' }}>{s.n}</span>
                </div>
              </motion.div>
            )
            return i < steps.length - 1
              ? [circle, <div key={`l${i}`} style={{ display: 'flex', alignItems: 'center', flexShrink: 0, width: 20 }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <svg width="5" height="7" viewBox="0 0 5 7" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M0 0L5 3.5L0 7" stroke={C.border} strokeWidth="1" fill="none"/>
                  </svg>
                </div>]
              : [circle]
          })}
        </div>
        {/* Row 2: labels in matching equal columns */}
        <div style={{ display: 'flex' }}>
          {steps.map((s, i) => (
            <motion.div key={i} style={{ flex: 1, textAlign: 'center' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 + 0.18 }}
            >
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.35, whiteSpace: 'pre-line', margin: 0 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </NeuCard>
  )
}

// ─── IA Diagram ───────────────────────────────────────────
function IADiagram() {
  return (
    <iframe
      src="/gsg-ia-flowchart.html"
      title="Information Architecture — Tectonic Plates"
      allowTransparency
      style={{
        width: '100%',
        aspectRatio: '1680 / 770',
        border: 'none',
        background: 'transparent',
        display: 'block',
      }}
    />
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

// ─── Sticky Notes Exploration ─────────────────────────
const STICKIES = [
  { id: 'earth-tilt',  label: "Earth's Tilt &\nSeasons",         color: '#68CBE8', dark: false, size: 148, left: 0,   top: 0,   rot: 0  },
  { id: 'geo-time',    label: "Geological\nTime Scales",          color: '#B5CC30', dark: false, size: 154, left: 118, top: 54,  rot: 0,  keep: true },
  { id: 'water-dist',  label: "Water\nDistribution\non Earth",    color: '#2A6B82', dark: true,  size: 156, left: 320, top: 0,   rot: 0  },
  { id: 'weathering',  label: "Weathering vs.\nErosion",          color: '#B5CC30', dark: false, size: 138, left: 482, top: 44,  rot: -5 },
  { id: 'lat-long',    label: "Latitude &\nLongitude",            color: '#68CBE8', dark: false, size: 148, left: 0,   top: 212, rot: -8 },
  { id: 'ocean',       label: "Ocean Currents",                   color: '#E8D87A', dark: false, size: 134, left: 122, top: 246, rot: 7  },
  { id: 'weather',     label: "Weather vs.\nClimate",             color: '#E8D87A', dark: false, size: 148, left: 320, top: 214, rot: 0  },
  { id: 'sustain',     label: "Sustainability &\nHuman Impact",   color: '#2A6B82', dark: true,  size: 156, left: 480, top: 212, rot: 0  },
]

function StickyNotesExploration() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     '+=700',
          scrub:   1.4,
          pin:     true,
          anticipatePin: 1,
        },
      }).to('.sticky-fade', {
        scale:    0,
        opacity:  0,
        duration: 1,
        stagger:  0.08,
        ease:    'back.in(1.4)',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{
      minHeight: '100vh',
      background: C.page,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="max-w-[1120px] mx-auto px-[clamp(1.5rem,5vw,3rem)]"
        style={{ display: 'flex', gap: '4rem', alignItems: 'center', width: '100%' }}>

        <div style={{ flexShrink: 0, maxWidth: '270px' }}>
          <SectionTag>05 — Concept</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0.5rem 0 1.25rem', lineHeight: 1.2 }}>
            <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Concept</span> exploration & what we set out to build
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.75, color: C.mid, margin: 0 }}>
            We mapped concepts of Earth &amp; Geography that children find difficult to understand due to{' '}
            <span style={{ color: C.accent, fontWeight: 500 }}>limited depth</span>{' '}
            in traditional teaching methods and the absence of multimodal engagement.
          </p>
        </div>

        <div style={{ flex: 1, position: 'relative', height: '420px' }}>
          {STICKIES.map(s => (
            <div
              key={s.id}
              className={s.keep ? undefined : 'sticky-fade'}
              style={{
                position:       'absolute',
                left:           s.left,
                top:            s.top,
                width:          s.size,
                height:         s.size,
                transform:      `rotate(${s.rot}deg)`,
                transformOrigin: 'center center',
                background:     s.color,
                borderRadius:   '3px',
                boxShadow:      '3px 5px 18px rgba(0,0,0,0.16)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                padding:        '14px',
              }}
            >
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize:   '0.9rem',
                fontWeight: 500,
                color:      s.dark ? 'rgba(255,255,255,0.92)' : '#1a3040',
                lineHeight: 1.35,
                textAlign:  'center',
                margin:     0,
                whiteSpace: 'pre-line',
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

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
    <div className="has-bottom-nav" style={{ background: C.page, minHeight: '100vh', color: C.ink }}>
      <ProgressBar />
      <Nav />
      <SidebarNav active={active} />

      {/* ── HERO ── */}
      <div style={{ position: 'relative', paddingTop: 'clamp(7rem,12vw,11rem)', paddingBottom: 'clamp(5rem,8vw,8rem)', overflow: 'hidden' }}>
        <img src="/gsg-banner.jpg" aria-hidden="true" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 22%', filter: 'contrast(1.18) saturate(1.1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,15,8,0.92) 0%, rgba(5,15,8,0.82) 40%, rgba(5,15,8,0.55) 68%, rgba(5,15,8,0.25) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
          <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.22)', padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem' }}>EdTech · Interaction Design</span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08, color: '#FFFFFF', margin: '0 0 1.75rem', maxWidth: '16ch' }}>
            Get, Set, <span style={{ color: '#6FCF97' }}>Globe!</span>
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.78)', maxWidth: '55ch', margin: '0 0 3rem' }}>
            We kept coming back to one memory: a geography class where the teacher drew a flat diagram of tectonic plates on a board, and we could barely comprehend. Get Set Globe is our attempt at the opposite: an experience where children don't just see Earth's forces, they feel them.
          </p>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { l: 'Timeline',      v: '3 Weeks' },
              { l: 'Collaborators', v: 'Sangeeta V, Hiral H' },
              { l: 'Tools',         v: 'Figma, Blender, TouchDesigner, Xbox Kinect' },
              { l: 'Output',        v: 'Interactive Installation' },
            ].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#FFFFFF', margin: 0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <Wrap>
          <p style={{ margin: 0, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase', padding: '0.7rem 0' }}>
            approx. 6 min quick read
          </p>
        </Wrap>
      </div>

      {/* ── WHY THIS PROJECT ── */}
      <section id="overview" style={{ background: C.surface, ...PAD, paddingBottom: 'clamp(2rem,3vw,2.5rem)' }}>
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
              }}>What <em style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: C.accent, fontWeight: 400 }}>Earth science</em> class<br />never gave us</h2>
            </MaskReveal>
            <Reveal delay={0.2}>
              <p style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(1.1rem,2vw,1.35rem)',
                color: C.mid,
                lineHeight: 1.75,
              }}>
                There's a geography class we can still picture clearly: a teacher drawing flat plates on a board, arrows pointing sideways, and none of it landing. The map said the world moved, but nothing in that room moved with it. Earth science has <strong style={{ color: C.ink, fontWeight: 700 }}>always been taught this way, as a diagram, a label, a list of terms to memorise.</strong> But the Earth isn't a diagram. It has{' '}
                <strong style={{ color: C.ink, fontWeight: 600 }}>mass, heat, and violence</strong>, and children can feel the difference between being told that and experiencing it. That's what Get Set Globe was built around.
              </p>
            </Reveal>
          </div>
        </Wrap>
      </section>

      {/* ── Diamond divider ── */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', background: C.surface, paddingTop: '0.75rem', paddingBottom: '1.5rem', marginTop: '-0.5rem' }}>
        {['#E8D87A', '#B5CC30', '#68CBE8'].map((color, i) => (
          <div key={i} style={{ width: 9, height: 9, background: color, transform: 'rotate(45deg)', borderRadius: '1px', flexShrink: 0 }} />
        ))}
      </div>

      {/* ── THE PROBLEM (surface) ── */}
      <section id="problem" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>02 — The Problem</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              <span style={{ color: C.ink }}>Seeing is believing</span>, and that's the issue.
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: '0 0 0.75rem' }}>
              For centuries, <strong style={{ color: C.ink, fontWeight: 600 }}>maps and globes</strong> have helped us hold the vastness of Earth in our hands. But <strong style={{ color: C.ink, fontWeight: 600 }}>they're not the world itself, only windows into it.</strong><br />They shrink oceans into blue patches and mountains into lines.
            </p>
            <p style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.mid, margin: '3rem 0 2.5rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '60ch', marginLeft: 'auto', marginRight: 'auto' }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 400, color: C.ink, background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Children take visuals at face value.</span>
              <br /><br />
              <span style={{ fontStyle: 'italic' }}>Traditional teaching shows Earth as static, reducing dynamic phenomena to diagrams. But to truly understand Earth, children must go beyond vision, through experience.</span>
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[
              { title: 'Static teaching',     body: 'Diagrams flatten living, moving systems into flat images with no sense of scale or time.',  stroke: '#E8D87A' },
              { title: 'Passive observation', body: 'Students watch but never interact, with no ownership over the experience or its meaning.', stroke: '#B5CC30' },
              { title: 'Abstract concepts',   body: "Tectonic forces, geological time, and Earth's interior remain intangible and forgettable.", stroke: '#68CBE8' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 270, height: 270 }}>
                <div style={{
                  width: 190, height: 190,
                  transform: 'rotate(45deg)',
                  borderRadius: '24px',
                  background: 'transparent',
                  border: `1.5px solid ${card.stroke}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 190, height: 190,
                    transform: 'rotate(-45deg)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center',
                    padding: '0 0.75rem',
                  }}>
                    <div style={{ width: 20, height: 2, borderRadius: 2, background: C.accent, margin: '0 auto 0.6rem', opacity: 0.5 + i * 0.15 }} />
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: C.ink, margin: '0 0 0.45rem', lineHeight: 1.25 }}>{card.title}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', lineHeight: 1.5, color: C.mid, margin: 0 }}>{card.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Wrap>
      </section>

      {/* ── RESEARCH (page) ── */}
      <section id="research" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>03 — Research</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Our <em style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>instinct</em>, backed by <em style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>research</em>
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: '0 0 2.5rem' }}>
              Our instinct was that learning through the body works better than learning through the page. It turns out there's solid research backing that. Meaning is made multimodally: through gesture, movement, gaze, posture, and speech working together, not just words on a board.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <NeuCard style={{ padding: '1.75rem 2rem', marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0', background: C.card }}>
              {[
                { v: '90%',  l: 'Recall for gesture-based learning', s: 'vs. speech only' },
                { v: '33%',  l: 'Recall for speech-only learning',   s: 'Baseline retention' },
                { v: '2.5×', l: 'Sensorimotor-enriched modes',       s: 'Retention multiplier' },
              ].map(({ v, l, s }, i) => (
                <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0 1.5rem', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', color: C.accent, margin: 0, lineHeight: 1 }}>{v}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{l}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, margin: 0 }}>{s}</p>
                </div>
              ))}
            </NeuCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', border: `1px solid ${C.border}`, padding: '0.45rem 1.1rem' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid }}>visual proxemics</span>
                </div>
                <span style={{ color: C.muted, fontSize: '0.9rem' }}>+</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', border: `1px solid ${C.border}`, padding: '0.45rem 1.1rem' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid }}>speech audio</span>
                </div>
                <span style={{ color: C.muted, fontSize: '0.9rem' }}>=</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', border: `1px solid ${C.accentBorder}`, padding: '0.45rem 1.1rem', gap: '0.4rem' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.accent }}>engaging learning experience</span>
                  <span style={{ color: '#6FCF97', fontSize: '0.9rem' }}>✦</span>
                </div>
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', color: C.muted, margin: 0, textAlign: 'right', textTransform: 'uppercase' }}>
                SOURCE: COOK, WAGNER, MITCHELL &amp; GOLDIN-MEADOW (2008). "GESTURING MAKES LEARNING LAST." PSYCHOLOGICAL SCIENCE 19(11): 1047–53.
              </p>
            </div>
          </Reveal>

          <div style={{ marginTop: '3.5rem' }}>
            <Reveal>
              <Label>The question that drove everything</Label>
              <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(135deg, #071a0e 0%, #0a2e18 55%, #0f3d22 100%)', padding: '2.25rem 2.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(40,170,80,0.18) 0%, transparent 70%)' }} />
                <blockquote style={{
                  position: 'relative', zIndex: 1,
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontStyle: 'italic',
                  lineHeight: 1.6, color: '#FFFFFF', margin: 0,
                }}>
                  "How can multimodal methods of learning nurture curiosity and help children explore Earth's depths in their early development?"
                </blockquote>
              </div>
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
              <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Who</span> we were designing for
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              Old enough to understand cause and effect, young enough to still find Earth genuinely astonishing. <strong style={{ color: C.ink, fontWeight: 600 }}>Children aged 10 to 12</strong> sit right at the edge of abstract thinking, which makes them the ideal test case for whether embodied interaction can bridge the gap that diagrams leave behind.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {[
              { n: '01', t: 'Cognitive\nreadiness', b: 'Can grasp cause-effect, sequence, and physical transformation.' },
              { n: '02', t: 'Learning\nstyle',      b: 'Learn best through hands-on interaction and guided discovery.' },
              { n: '03', t: 'Core\nchallenge',      b: 'Struggle with visualising deep time and internal processes.' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {/* Circle */}
                <div style={{ position: 'relative', width: 260, height: 260, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <video
                    src="/gsg-ta-bg.mp4"
                    autoPlay loop muted playsInline
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Green overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,120,55,0.72)' }} />
                  {/* Vignette */}
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
                  {/* Text — fixed-height block so number is always at the same position */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.55rem' }}>{card.n}</span>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: '#fff', lineHeight: 1.25, whiteSpace: 'pre-line', margin: '0 0 0.65rem', minHeight: '2.6em' }}>{card.t}</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0, minHeight: '3.15em' }}>{card.b}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <NeuCard style={{ padding: '1.75rem 2rem', marginTop: '1rem' }}>
              <Label>Current learning barriers</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                {[
                  'Traditional teaching limits sensory engagement.',
                  'Short attention spans (7–10 mins) lead to low retention.',
                  'Earth processes remain abstract and intangible concepts.',
                ].map((b, i) => (
                  <div key={i} style={{ position: 'relative', padding: '6rem 1rem 1rem', borderLeft: i > 0 ? `1px solid ${C.border}` : 'none', paddingLeft: i > 0 ? '1rem' : 0 }}>
                    <span style={{ position: 'absolute', top: '0.5rem', left: i > 0 ? '1rem' : '0', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '4.5rem', color: '#6FCF97', opacity: 0.25, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>{String(i+1).padStart(2,'0')}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.65, margin: 0, position: 'relative', zIndex: 1 }}>{b}</p>
                  </div>
                ))}
              </div>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── CONCEPT (page) ── */}
      <section id="concept" style={{ background: C.page }}>
        <StickyNotesExploration />

        {/* Concept chips — shown after animation completes */}
        <Wrap style={{ marginTop: '-20rem' }}>
          <div style={{ paddingBottom: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {CONCEPTS.map(({ label, chosen }) => (
              <span key={label} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', padding: '6px 14px', borderRadius: '8px', border: `1px solid ${chosen ? C.accentBorder : C.border}`, background: chosen ? C.accentDim : 'transparent', color: chosen ? C.accent : C.mid, fontWeight: chosen ? 500 : 400 }}>
                {chosen && <span style={{ marginRight: '4px', fontSize: '0.58rem' }}>✓</span>}
                {label}
              </span>
            ))}
          </div>
        </Wrap>

        <div style={{ paddingTop: PAD.paddingTop, paddingBottom: PAD.paddingBottom }}>
        <Wrap>
          <Reveal>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '2rem 0 1.5rem' }}>
              The research told us children struggle most with concepts that require imagining scale, time, and invisible forces. We mapped candidate topics and asked: which one would feel most different if you could experience it rather than be told about it?
            </p>
          </Reveal>

          <Reveal delay={0.08}><Label>Three initial directions explored</Label></Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { n: 'Direction 01', t: 'Pangea narrative', b: "Earth's shape imagined as anything but spherical; the story sparks curiosity and leads to why Earth has its present form, emphasising the role of tectonic plates.", img: '/gsg-idea-1.png' },
              { n: 'Direction 02', t: 'Time travel',      b: "Travelling back in time to trace Earth's evolution helps learners grasp the dynamic tectonic forces that have sculpted the planet's current shape.",        img: '/gsg-idea-2.png' },
              { n: 'Direction 03', t: 'Scale first',      b: "Tectonic plates introduced by first helping children comprehend Earth's vast scale, then showing how its surface is split into constantly shifting sections.", img: '/gsg-idea-3.png' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: i % 2 === 1 ? C.cardAlt : C.card }}>
                  <div style={{ overflow: 'hidden' }}>
                    <img src={`${card.img}?v=2`} alt={`Initial direction ${i + 1}`} loading="lazy" decoding="async" style={{ width: '100%', display: 'block', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: C.muted }}>{card.n}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.accent, margin: 0 }}>{card.t}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.b}</p>
                  </div>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.12}>
            <NeuCard style={{ padding: '2rem 2.25rem', borderLeft: `3px solid ${C.accent}` }}>
              <Label>What we set out to build</Label>
              <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.35rem)', lineHeight: 1.6, color: C.ink, margin: 0 }}>
                We wanted to build something that worked on a child's terms, not the curriculum's. An experience where learning Earth means acting on it: stepping back to watch Pangea drift, peeling back layers with your hands, colliding plates to feel the Himalayas form. <em style={{ fontWeight: 600, fontStyle: 'italic' }}>Not passive. Not abstract. Something that earns its place in a classroom</em> by making understanding feel inevitable.
              </p>
            </NeuCard>
          </Reveal>
        </Wrap>
        </div>
      </section>

      {/* ── TECHNOLOGY (surface) ── */}
      <section id="technology" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>06 — Technology</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>How</span> it works: the Kinect
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              The Kinect One was built for gaming, but its skeletal tracking was exactly what we needed. It reads <strong style={{ color: C.ink }}>body-node coordinates in 3D space across depth</strong>, and those readings feed directly into TouchDesigner to drive real-time visual output. <strong style={{ color: C.ink }}>Your body becomes the controller.</strong>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <img
              src="/gsg-how-it-works.png"
              alt="How it works — Kinect to TouchDesigner pipeline"
              loading="lazy" decoding="async" style={{ width: '100%', display: 'block', borderRadius: '8px' }}
            />
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginTop: '1rem', marginBottom: '3rem' }}>
            {[['IR Sensor','Infrared object detection'],['IR Depth','Z-axis depth reading'],['Colour Camera','Visual context capture'],['LED Mic Array','Audio input cues']].map(([s, d], i) => (
              <Reveal key={s}>
                <NeuCard style={{ padding: '1rem 1.1rem', background: i % 2 === 1 ? C.cardAlt : C.card }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: '0 0 4px' }}>{s}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, margin: 0 }}>{d}</p>
                </NeuCard>
              </Reveal>
            ))}
          </div>

          {/* Initial direction */}
          <Reveal>
            <Label>Initial direction: physical globe</Label>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
              <strong style={{ color: C.mid, fontWeight: 600 }}>Our first instinct was to make the globe literal.</strong> A sensor-enabled physical object that children could interact with directly, through three gestures:
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { n: 'Step 01', t: <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Step back</span>,       b: <>See <strong>Pangea</strong> form as you move away from the globe.</> },
              { n: 'Step 02', t: <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Peel off layers</span>, b: <>Explore <strong>Earth's interior</strong> layer by layer.</> },
              { n: 'Step 03', t: <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Pinch plates</span>,    b: <>Create converging <strong>tectonic movement</strong> with a pinch gesture.</> },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: i % 2 === 1 ? C.cardAlt : C.card }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: C.muted }}>{card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{card.t}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.b}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.1}>
            <div style={{ borderRadius: '14px', overflow: 'hidden', display: 'flex', alignItems: 'stretch', background: '#0a0a0a', boxShadow: C.neu }}>
              {/* Image with overlay + vignette */}
              <div style={{ width: '38%', flexShrink: 0, position: 'relative' }}>
                <img src="/gsg-globe-physical.jpg" alt="Child touching a physical globe" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.42) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.72) 100%)' }} />
              </div>
              {/* Text */}
              <div style={{ padding: '2rem 2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.75rem' }}>Why we moved on</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: '#fff', lineHeight: 1.3, margin: '0 0 1.25rem' }}>Not using a physical globe</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, margin: 0 }}>
                    We tested it and the engagement was real. Children responded immediately to motion-based interaction. But the globe as <strong style={{ color: 'rgba(255,255,255,0.88)' }}>a fixed object felt like a constraint</strong>, and the gestures were too lesson-specific to carry meaning outside of one activity.
                  </p>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: 'rgba(255,255,255,0.88)', lineHeight: 1.5, margin: '1.75rem 0 0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
                  Gestures should feel universal and reusable — not one-off actions bound to a single lesson.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Prototype flow */}
          <div style={{ marginTop: '3.5rem' }}>
            <Reveal>
              <Label>7-step experience loop</Label>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
                We mapped the full experience as a loop, from the moment the device connects to the moment a child finishes and wants to go again.<br /><br /><strong style={{ color: C.ink }}>Every transition had to feel earned, not just navigated.</strong>
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
            <iframe
              src="/gsg-ia-flowchart.html"
              title="Information Architecture — Tectonic Plates"
              scrolling="no"
              style={{
                width: '100%',
                aspectRatio: '1680 / 770',
                border: 'none',
                background: 'transparent',
                display: 'block',
                marginBottom: '2rem',
              }}
            />
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
                  <span key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>{h}</span>
                ))}
              </div>
              {INTERACTIONS.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr 1fr 1fr', padding: '12px 1.5rem', borderBottom: i < INTERACTIONS.length-1 ? `1px solid ${C.border}` : 'none', background: i%2===0 ? C.card : C.accentDim }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted }}>{row.n}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.ink, paddingRight: '1rem' }}>{row.activity}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, paddingRight: '1rem' }}>{row.pattern}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.mid, lineHeight: 1.5 }}>
                    <span style={{ color: C.ink }}>{row.input}</span>
                    {row.input !== 'System' && <span style={{ color: C.muted }}> → </span>}
                    {row.input !== 'System' && row.output}
                  </span>
                </div>
              ))}
            </NeuCard>
          </Reveal>

          <Reveal delay={0.08}>
            <NeuCard style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', gap: '1.5rem', alignItems: 'center', boxSizing: 'border-box' }}>
              <img src="/gsg-storyboard-sketch.png" alt="Get Set Globe storyboard" loading="lazy" decoding="async" style={{ flex: 1, minWidth: 0, width: '50%', borderRadius: '4px', display: 'block', objectFit: 'contain' }} />
              <img src="/gsg-gesture-sketch.png" alt="Core multimodal gesture interactions" loading="lazy" decoding="async" style={{ flex: 1, minWidth: 0, width: '50%', borderRadius: '4px', display: 'block', objectFit: 'contain' }} />
            </NeuCard>
          </Reveal>

          {/* Core 4 interactions */}
          <Reveal><Label>The four that defined the experience</Label></Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { n: '01', title: 'Proxemics → Continental Drift & Pangea',  detail: "Using proxemics and frontal arm movements to cause the continental drift and formation of Pangea, depending on the user's movement direction and speed.", sensor: 'Proximity · Body position', gesture: 'Step backward / forward', effect: 'Time reversal / continental drift', accent: true },
              { n: '02', title: "Sagittal Arm Movement → Earth's Interior", detail: "Sagittal arm movement reveals the inner layers of the Earth, exposing the crust, mantle and core, each layer's role in tectonic forces explained as you go.", sensor: 'Hand motion · Depth tracking', gesture: 'Arm sweep forward/back', effect: "Peels and rebuilds Earth's layers", accent: false },
              { n: '03', title: 'Air Gesture → Himalayan Collision',         detail: 'Bringing both hands together in a converging gesture triggers the simulation of colliding lithospheric plates, showing the formation of the Himalayas with visual, audio, and haptic feedback.', sensor: 'Air gesture · Hand tracking', gesture: 'Both hands converge', effect: 'Mountain formation + haptic', accent: true },
              { n: '04', title: 'Hover + Hold → Menu Selection',             detail: 'Simple UI inspired by Xbox Kinect games. Intuitive hand hover for navigation, with a steady hold to confirm a selection. Visual cue: completion of a circle stroke around the option.', sensor: 'Air gesture · Hand position', gesture: 'Hover + hold still', effect: 'Selection confirmed via circle', accent: false },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', borderLeft: card.accent ? `2px solid ${C.accent}` : 'none', background: i % 2 === 1 ? C.cardAlt : C.card }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: C.muted }}>Interaction {card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0, lineHeight: 1.3 }}>{card.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.detail}</p>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '0.25rem' }}>
                    {[['Gesture', card.gesture], ['Effect', card.effect]].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, width: 44, flexShrink: 0 }}>{k}</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

        </Wrap>
      </section>

      {/* ── TRIALS + PROTOTYPING (surface) ── */}
      <section id="trials" style={{ ...PAD, background: '#000000' }}>
        <Wrap>
          <Reveal>
            <SectionTag dark>08 — Process & Prototyping</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.darkInk, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Trials & process
            </h2>
            <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.darkMid, margin: '0 0 2.5rem', lineHeight: 1.7 }}>
              "This is where the system fought back. The idea was clear; getting it to work was a different problem entirely."
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { n: '01', t: 'Proxemics calibration',     b: 'Getting the depth readings from the Kinect to correctly map to timeline progression required careful calibration of depth thresholds in TouchDesigner.' },
              { n: '02', t: 'Gesture disambiguation',    b: 'Distinguishing intentional gestures from ambient body movement, preventing false triggers while keeping interaction feel instant and natural.' },
              { n: '03', t: 'Layer peel timing',         b: "Tuning the sagittal sweep sensitivity so that Earth's layers reveal at a pace children can follow, not so fast it loses meaning." },
              { n: '04', t: 'Haptic integration',        b: 'The Himalaya converging gesture needed haptic output to complete the sensory loop; sourcing and syncing this with the visual was a key challenge.' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: C.darkMuted }}>Challenge {card.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.darkInk, margin: 0 }}>{card.t}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.darkMid, margin: 0, flex: 1 }}>{card.b}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.08}>
            <Label dark>Testing the prototypes</Label>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {[
              {
                src:     '/gsg-proto-1.mp4',
                caption: 'Using PROXEMICS & frontal arm movements to cause the continental drift and formation of Pangea, depending on user\'s movement',
              },
              {
                src:     '/gsg-proto-2.mp4',
                caption: 'Sagittal arm movement of user to reveal inner layers of the Earth impacting tectonic forces',
              },
            ].map((v, i) => (
              <div key={i} style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <video src={v.src} autoPlay loop muted playsInline style={{ width: '100%', display: 'block' }} />
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.darkMid, margin: 0, padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                  {v.caption}
                </p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── FINAL UI DESIGN (page) ── */}
      <section id="design-ui" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <Label>UI Design: Xbox Kinect-inspired, no touch required</Label>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.5rem' }}>
              The UI is inspired by Xbox Kinect games: simple, legible, and designed for full-body interaction from a distance.
            </p>
          </Reveal>

          {/* Screen 01 — landing / hero */}
          <Reveal delay={0.05}>
            <NeuCard style={{ padding: 0, overflow: 'hidden', marginBottom: '1.25rem' }}>
              <img src="/gsg-ui-01.jpg" alt="Get Set Globe landing screen"
                loading="lazy" decoding="async" style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'top' }} />
              <div style={{ padding: '1.1rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: 0, flexShrink: 0 }}>Onboarding Screen 01 · Navigation Pattern</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.6, margin: 0 }}>Intuitive hand movements for on-screen navigation, followed by a steady hold to confirm the selected choice. Visual cue: a circle stroke that fills to 100% on confirmation.</p>
              </div>
            </NeuCard>
          </Reveal>

          {/* Screen 02 — topic browser with animated selection ring */}
          <Reveal delay={0.1}>
            <NeuCard style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', background: '#0a0a0a' }}>
                <img src="/gsg-ui-02.jpg" alt="Get Set Globe topic selection screen"
                  loading="lazy" decoding="async" style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'top' }} />
                <svg
                  style={{ position: 'absolute', left: '53.5%', top: '60.5%', transform: 'translate(-50%,-50%)', width: 'clamp(44px,4.5vw,68px)', height: 'clamp(44px,4.5vw,68px)', overflow: 'visible', pointerEvents: 'none' }}
                  viewBox="0 0 60 60"
                >
                  <motion.circle
                    cx="30" cy="30" r="27"
                    fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 3, times: [0, 0.55, 0.82, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
                  />
                </svg>
              </div>
              <div style={{ padding: '1.1rem 1.5rem', display: 'flex', gap: '2rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: 0, flexShrink: 0 }}>Onboarding Screen 02 · Topic Selection</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.6, margin: 0 }}>Selections expand on hand hover. A steady hold confirms — the animated circle stroke filling to 100% is the visual confirmation cue.</p>
              </div>
            </NeuCard>
          </Reveal>

          <Reveal delay={0.1}>
            <NeuCard style={{ padding: '1.5rem 2rem' }}>
              <Label>Core interaction pattern: hover + hold</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  ['01', 'Hand hovers over option', <span className="material-symbols-outlined" style={{ fontSize: '15px', lineHeight: 1 }}>back_hand</span>],
                  ['02', 'Hold still 1.5 seconds', '⏱'],
                  ['03', 'Circle stroke fills 100%', '◎'],
                  ['04', 'Selection confirmed', '✓'],
                ].map(([step, action, icon]) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '130px' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.accentDim, border: `1px solid ${C.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: C.ink }}>{icon}</div>
                    <div>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, letterSpacing: '0.1em', margin: 0 }}>STEP {step}</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, margin: 0 }}>{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </NeuCard>
          </Reveal>

          <Reveal><div style={{ marginTop: '3rem' }}><Label>Final Output</Label></div></Reveal>
          <Reveal delay={0.1}>
            <div style={{ marginTop: '1.5rem', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
              <iframe
                src="https://www.youtube.com/embed/AiC5kRMcveA"
                title="Get Set Globe — Simulation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <NeuCard style={{ padding: 0, overflow: 'hidden', marginTop: '2.5rem' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
                <Label>Showcase</Label>
              </div>
              <img src="/gsg-showcase.png" alt="Get Set Globe — Showcase" loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── REFLECTIONS ── */}
      <section id="reflections" style={{ background: 'linear-gradient(145deg, #020d06 0%, #041a0c 40%, #071f0f 70%, #0a2714 100%)', ...PAD }}>
        <Wrap>
          <Reveal>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: C.darkMuted, display: 'block', marginBottom: '1.25rem',
            }}>My Takeaway</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 500,
              fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', color: C.darkInk,
              letterSpacing: '-0.02em', marginBottom: 'clamp(2rem,4vw,3.5rem)',
            }}>What stayed with me</h2>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
            {[
              { n: '01', text: '"The moment a child is genuinely curious, everything else becomes easier. No amount of explanation replaces the feeling of encountering something surprising."' },
              { n: '02', text: '"The gestures that worked were the ones nobody had to teach. When an interaction matches how the body already wants to move, it disappears into the experience."' },
              { n: '03', text: '"The most memorable moments were physical: the peel, the collision, stepping back to watch Pangea form. The body remembers what the eye alone forgets."' },
              { n: '04', text: '"The question that changed our design decisions wasn\'t will they understand this? — but will they feel it? Those are different goals, and the second one is harder."' },
            ].map(r => (
              <StaggerItem key={r.n}>
                <div style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '2.25rem',
                  height: '100%',
                }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.22em', color: C.darkMuted, marginBottom: '1.25rem' }}>{r.n}</div>
                  <p style={{ fontFamily: "'Lora', serif", fontSize: '0.9rem', color: C.darkInk, lineHeight: 1.65, margin: 0 }}>{r.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.2}>
            <p style={{
              fontFamily: "'Lora', serif",
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
              color: C.darkMid,
              maxWidth: 560,
              lineHeight: 1.75,
              margin: '0 auto',
              textAlign: 'center',
            }}>
              The goal was never to explain tectonic plates. It was to make children feel the Earth move. That distinction, between understanding and feeling, shaped every design decision we made.
            </p>
          </Reveal>
        </Wrap>
      </section>

      <div id="footer-sentinel" style={{ height: '1px' }} />
      <BackToTop />
      <Footer />
    </div>
  )
}
