import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal, BackToTop } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
// Accent colours derived from Finance project card gradient:
// from-[#040409] via-[#0e0e30] to-[#1a1060]
const C = {
  // Light page backgrounds
  page:    '#F5F5FA',              // main page bg (cool-tinted white)
  surface: '#EBEBF2',              // alternate section bg
  card:    '#F9F9FD',              // card bg (lighter for neumorphic)

  // Neumorphic shadow
  neu:     '6px 6px 18px rgba(0,0,0,0.08), -4px -4px 12px rgba(255,255,255,0.88)',
  neuSm:   '4px 4px 12px rgba(0,0,0,0.07), -3px -3px 8px rgba(255,255,255,0.9)',

  // Accent — from Finance gradient
  accent:  '#1E1880',              // deep indigo
  accentMid: '#2D2FA0',            // slightly lighter for hover/interactive
  accentDim: 'rgba(30,24,128,0.07)',
  accentBorder: 'rgba(30,24,128,0.14)',

  // Dark sections (hero, reflections)
  dark:    '#040409',              // from gradient start
  heroGrad: 'linear-gradient(145deg,#040409 0%,#0e0e30 55%,#1a1060 100%)',
  darkInk: '#F2EDE4',              // cream text on dark
  darkMid: 'rgba(242,237,228,0.65)',
  darkMuted: 'rgba(242,237,228,0.38)',

  // Light-section typography
  ink:     '#12122E',              // near-black, indigo-tinted
  mid:     '#4A4A72',              // body text
  muted:   '#9090AA',              // labels / placeholders

  // Dividers
  border:  'rgba(0,0,0,0.08)',
  borderAccent: 'rgba(30,24,128,0.12)',
}

const EASE = [0.22, 1, 0.36, 1]

// ─── Sidebar Sections ────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'why',         label: 'Why?' },
  { id: 'overview',    label: 'Overview' },
  { id: 'fieldwork',   label: 'Fieldwork' },
  { id: 'workshop',    label: 'Workshop' },
  { id: 'reflections', label: 'Reflect' },
]

// ─── Layout ─────────────────────────────────────────────
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
        background: 'rgba(255,255,255,0.04)',
        borderRadius: '14px',
        boxShadow: '6px 6px 18px rgba(0,0,0,0.35), -3px -3px 10px rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        ...style,
      }}>{children}</div>
    )
  }
  return (
    <div style={{
      background: C.card,
      borderRadius: '14px',
      boxShadow: C.neu,
      border: 'none',
      ...style,
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

function ScreenLabel({ children, dark = false }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: '0.58rem',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: dark ? C.darkMuted : C.muted, textAlign: 'center', marginTop: '0.75rem',
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
            <motion.div animate={{ width: isActive ? 3 : 1.5, height: isActive ? 32 : 24, background: isActive ? C.accent : C.border, borderRadius: 2 }} transition={{ duration: 0.3 }} style={{ flexShrink: 0 }} />
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

// ═══════════════════════════════════════════════════════
// DIAGRAMS
// ═══════════════════════════════════════════════════════

// ─── Research Phases ─────────────────────────────────────
function ResearchPhaseDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const phases = [
    { num: '01', label: 'Brainstorming',       sub: 'Problem space & opportunity mapping' },
    { num: '02', label: 'Roadmap',             sub: 'Research strategy & method selection' },
    { num: '03', label: 'On-Ground\nResearch', sub: 'Direct interviews with 12 participants' },
    { num: '04', label: 'Literature\nReview',  sub: 'Secondary research & validation' },
    { num: '05', label: 'Research\nQuestion',  sub: 'Refined focus on scam literacy' },
  ]

  return (
    <div ref={ref} style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', minWidth: 600, marginBottom: '0.5rem' }}>
        {phases.map((phase, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, ease: EASE, delay: i * 0.1 }}
                style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: C.card, boxShadow: C.neu,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, padding: '0.5rem',
                }}
              >
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.muted, marginBottom: '0.25rem' }}>{phase.num}</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.58rem', color: C.ink, margin: 0, lineHeight: 1.25, whiteSpace: 'pre-line', textAlign: 'center' }}>{phase.label}</p>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', color: C.mid, margin: '0.75rem 0 0', lineHeight: 1.45, textAlign: 'center', maxWidth: '11ch' }}
              >{phase.sub}</motion.p>
            </div>
            {i < phases.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
                style={{ height: 1, background: C.accentBorder, marginTop: 48, width: 20, flexShrink: 0, transformOrigin: 'left' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── POEMS Diagram ────────────────────────────────────────
function POEMSDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const items = [
    { letter: 'P', word: 'People',      desc: 'Semi-literate users and their financial habits — security guards, cleaning staff, small business owners' },
    { letter: 'O', word: 'Objects',     desc: 'Expense-tracking tools, smartphones, passbooks, physical notebooks' },
    { letter: 'E', word: 'Environment', desc: 'Urban Bangalore — bank branches, digital platforms, local financial services' },
    { letter: 'M', word: 'Messages',    desc: 'Communication barriers: language gaps, financial jargon, how literacy is conveyed' },
    { letter: 'S', word: 'Services',    desc: 'The role of banks, fintech, and organisations in financial inclusion' },
  ]

  const CX = 200, CY = 200, R = 128

  return (
    <div ref={ref} style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 600, flexShrink: 0 }}>
        <motion.circle cx={CX} cy={CY} r={R + 18}
          fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="4 6"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}
        />
        {items.map((item, i) => {
          const angle = (i * 72 - 90) * Math.PI / 180
          const x = CX + R * Math.cos(angle), y = CY + R * Math.sin(angle)
          const na = ((i + 1) * 72 - 90) * Math.PI / 180
          const nx = CX + R * Math.cos(na), ny = CY + R * Math.sin(na)
          return (
            <g key={i}>
              <motion.line x1={CX} y1={CY} x2={x} y2={y}
                stroke={C.accentBorder} strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
              <motion.line x1={x} y1={y} x2={nx} y2={ny}
                stroke={C.border} strokeWidth={1}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              />
            </g>
          )
        })}
        <motion.circle cx={CX} cy={CY} r={22}
          fill={C.accent}
          initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
        <text x={CX} y={CY + 4} textAnchor="middle"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', fill: '#fff', letterSpacing: '0.08em' }}>
          POEMS
        </text>
        {items.map((item, i) => {
          const angle = (i * 72 - 90) * Math.PI / 180
          const x = CX + R * Math.cos(angle), y = CY + R * Math.sin(angle)
          const opacity = 0.15 + i * 0.17
          return (
            <motion.g key={i}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={24} fill={C.card}
                style={{ filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.1)) drop-shadow(-2px -2px 4px rgba(255,255,255,0.9))' }}
              />
              <text x={x} y={y - 3} textAnchor="middle"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', fill: C.accent }}>
                {item.letter}
              </text>
              <text x={x} y={y + 9} textAnchor="middle"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', fill: C.muted, letterSpacing: '0.08em' }}>
                {item.word.toUpperCase()}
              </text>
            </motion.g>
          )
        })}
      </svg>
      <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.3 + i * 0.08, ease: EASE }}
          >
            <NeuCard style={{ padding: '1rem 1.1rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '8px', flexShrink: 0,
                background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.accent }}>{item.letter}</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: '0 0 0.2rem' }}>{item.word}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            </NeuCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Participant Profiles ─────────────────────────────────
const PARTICIPANTS = [
  { name: 'Parvati',     age: 31, role: 'Vegetable Seller',     lit: 'No formal education', key: 'Dependent on husband for all financial decisions. Trusts no one else due to fear of fraud.' },
  { name: 'Mandachalam', age: 36, role: 'Craftsperson',         lit: 'Mid-level educated',  key: 'From Kerala. Uses GPay and PhonePe. Understands basic financial terms and digital transactions.' },
  { name: 'Chandan MS',  age: 18, role: 'Small Business Owner', lit: 'Diploma',              key: 'Only trusts PhonePe — "no chance of fraud." Cannot understand basic financial jargon despite running a business.' },
  { name: 'Sanjay Kumar',age: 55, role: 'Security Guard',       lit: 'Mid-level educated',  key: 'From Bihar. Delegates all financial decisions to his daughter — trusts her education over his own judgement.' },
  { name: 'Deepam',      age: 36, role: 'Auto Driver',          lit: 'Mid-level educated',  key: 'Comfortable with digital tools, developed through years of regular app use. No longer fears digital payments.' },
  { name: 'Prakash',     age: 40, role: 'Small Tea Shop Owner', lit: 'Mid-level educated',  key: 'Trusts banks over apps for large transfers. Keeps a physical diary for daily expense tracking.' },
]

// ─── Pre/Post Results Chart ───────────────────────────────
const RESULTS = [
  { param: 'Awareness of Financial Scams',  pre: 2.7,  post: 3.35, change: '+24.07%', positive: true },
  { param: 'Knowledge of Scam Indicators',  pre: 2.9,  post: 3.6,  change: '+24.14%', positive: true },
  { param: 'Confidence in Scam Avoidance',  pre: 3.0,  post: 2.85, change: '−5.00%',  positive: false },
  { param: 'Financial Habits & Practices',  pre: 3.64, post: 3.9,  change: '+7.14%',  positive: true },
]

function ResultsChart() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const MAX = 5

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {RESULTS.map((r, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{r.param}</p>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: r.positive ? '#2A7A5A' : '#B03030', letterSpacing: '0.06em' }}>{r.change}</span>
          </div>
          {[{ label: 'PRE', val: r.pre, col: `${C.accent}50` }, { label: 'POST', val: r.post, col: r.positive ? '#2A7A5A80' : '#B0303080' }].map(bar => (
            <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, width: 26 }}>{bar.label}</span>
              <div style={{ flex: 1, height: 7, background: C.accentDim, borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.07)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(bar.val / MAX) * 100}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: EASE }}
                  style={{ height: '100%', background: bar.col, borderRadius: 4 }}
                />
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.mid, minWidth: 24 }}>{bar.val}</span>
            </div>
          ))}
        </motion.div>
      ))}
      <NeuCard style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>Overall Improvement</p>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontWeight: 500, color: C.accent }}>+12.59%</span>
      </NeuCard>
    </div>
  )
}

// ─── Workshop Photo Carousel ──────────────────────────────
const WORKSHOP_IMGS = Array.from({ length: 18 }, (_, i) =>
  `/fin-workshop-${String(i + 1).padStart(2, '0')}.jpg`
)

function WorkshopCarousel() {
  const [idx, setIdx] = useState(0)
  const total = WORKSHOP_IMGS.length
  const prev = (idx - 1 + total) % total
  const next = (idx + 1) % total

  const go = (d) => setIdx(i => (i + d + total) % total)

  const sideStyle = {
    width: '22%', flexShrink: 0, borderRadius: '10px',
    overflow: 'hidden', alignSelf: 'center', position: 'relative',
  }
  const sideImgStyle = {
    width: '100%', aspectRatio: '3/4', objectFit: 'cover',
    display: 'block', filter: 'brightness(0.55)',
  }

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Three-image strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        {/* Left side image */}
        <div style={sideStyle}>
          <motion.img key={`l${prev}`} src={WORKSHOP_IMGS[prev]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={sideImgStyle} />
          {/* Fade on outer-left edge */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${C.dark} 0%, transparent 55%)`, pointerEvents: 'none' }} />
          {/* Click to go prev */}
          <button onClick={() => go(-1)} aria-label="Previous" style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: 'w-resize' }} />
        </div>

        {/* Centre image — bigger, with arrow buttons */}
        <div style={{ flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
          <motion.img key={`c${idx}`} src={WORKSHOP_IMGS[idx]} alt={`Workshop photo ${idx + 1}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
          {/* Left arrow */}
          <button onClick={() => go(-1)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {/* Right arrow */}
          <button onClick={() => go(1)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Right side image */}
        <div style={sideStyle}>
          <motion.img key={`r${next}`} src={WORKSHOP_IMGS[next]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={sideImgStyle} />
          {/* Fade on outer-right edge */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to left, ${C.dark} 0%, transparent 55%)`, pointerEvents: 'none' }} />
          {/* Click to go next */}
          <button onClick={() => go(1)} aria-label="Next" style={{ position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: 'e-resize' }} />
        </div>

      </div>

      {/* Counter + dots — centred below the main image */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', marginTop: '0.9rem' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)' }}>
          {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Array.from({ length: total }, (_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 18 : 5, height: 5, borderRadius: 3, background: i === idx ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.15)', border: 'none', padding: 0, cursor: 'pointer', transition: 'width 0.25s ease, background 0.25s ease' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Workshop Segments ────────────────────────────────────
const SEGMENTS = [
  { num: 1, title: 'Introduction',                desc: 'Outlined the agenda and set intent — ensuring participants understood the scope and purpose of the session.' },
  { num: 2, title: 'Ice-Breaking Activity',        desc: 'Pre-workshop Likert scale questionnaire with emoji cards to establish a baseline of financial literacy.' },
  { num: 3, title: 'Spot the Scam',               desc: 'Participants examined printed examples of fake websites, apps, SMS, and WhatsApp messages.' },
  { num: 4, title: 'Curated Educational Videos',  desc: 'Delivered through RBI\'s comic "Raju and the 40 Thieves" and curated video content on scam types.' },
  { num: 5, title: 'Spot the Scam (Follow-up)',   desc: 'Revisited scam identification after awareness — participants showed significantly improved detection.' },
  { num: 6, title: 'Closure & Feedback',          desc: 'Post-workshop questionnaire, key takeaways, and distribution of a brochure with scam prevention tips.' },
]

// ─── Stat Card ───────────────────────────────────────────
function StatCard({ stat, label, sub }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ height: '100%' }}
    >
      <NeuCard style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', height: '100%' }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: C.accent, margin: 0, lineHeight: 1 }}>{stat}</p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0, minHeight: '2.5rem' }}>{label}</p>
        {sub && <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, margin: 0, lineHeight: 1.5 }}>{sub}</p>}
      </NeuCard>
    </motion.div>
  )
}

// ─── Findings ────────────────────────────────────────────
const FINDINGS = [
  { title: 'Lack of Awareness', body: 'Most participants were unaware of basic financial concepts such as interest rates or the importance of savings.' },
  { title: 'Third-Party Reliance', body: 'Several interviewees depend on family, friends, or informal agents to make financial decisions or use digital tools.' },
  { title: 'Fear of Fraud', body: 'A persistent fear of being scammed discourages many from trying new financial technologies or platforms.' },
  { title: 'Distrust in Institutions', body: 'Banks and digital payment apps are often perceived as unreliable or complicated, leading to preference for cash.' },
  { title: 'Preference for Cash', body: 'Physical cash is seen as more secure and tangible compared to digital money, especially among older individuals.' },
  { title: 'Lack of Scam Awareness', body: 'Many participants were unaware of common scams such as phishing or OTP fraud, making them more vulnerable.' },
  { title: 'Overtrust in Intermediaries', body: 'Many blindly trust informal agents for financial advice, making them susceptible to fraud or misinformation.' },
  { title: 'Community Influence', body: 'Financial decisions are shaped by community practices with little independent exploration of safer options.' },
  { title: 'Language Barrier', body: 'Many struggle to understand financial instructions or app interfaces in non-local or technical languages.' },
  { title: 'Limited Adaptability', body: 'Despite interest in digital tools, most cited technical complexity as the key barrier to adoption.' },
  { title: 'Fear of Technology', body: 'Participants expressed concerns about losing money or making irreversible mistakes with digital platforms.' },
  { title: 'Financial Jargon Confusion', body: 'Terms like "EMI," "credit score," or "interest rates" were frequently cited as confusing and exclusionary.' },
]

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Finance() {
  const active = useActiveSection(NAV_SECTIONS.map(s => s.id))

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Finance Research — Zeus Batkhar'
    return () => { document.title = 'Zeus Zechariah Batkhar — UX Designer' }
  }, [])

  return (
    <div className="has-bottom-nav" style={{ background: C.page, minHeight: '100vh', color: C.ink }}>
      <ProgressBar />
      <Nav />
      <SidebarNav active={active} />

      {/* ── HERO (dark) ── */}
      <div style={{ position: 'relative', background: C.heroGrad, paddingTop: 'clamp(5rem,8vw,7rem)', paddingBottom: 'clamp(3rem,5vw,4.5rem)', overflow: 'hidden' }}>
        <img src="/fin-workshop-12.jpg" aria-hidden="true" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', filter: 'contrast(1.22) saturate(1.08) brightness(0.95)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,4,18,0.90) 0%, rgba(8,8,32,0.74) 45%, rgba(14,10,48,0.32) 70%, rgba(14,10,48,0.06) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
          <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.22)', padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem' }}>Research · Social Design</span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08, color: '#FFFFFF', margin: '0 0 1.75rem', maxWidth: '16ch' }}>
            Finance for<br /><span style={{ color: '#9B9EE8' }}>Semi-Literate</span> Populations
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.78)', maxWidth: '55ch', margin: '0 0 3rem' }}>
            In 2024, we spent some time with security guards, vegetable sellers, and auto drivers in our vicinity, asking a question that had been bothering us: why are the people most reliant on the financial system also the most exposed to its failures? This is what we found.
          </p>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { l: 'Timeline',      v: '2 Weeks' },
              { l: 'Collaborators', v: 'Hiral H, Raveena S' },
              { l: 'Tools',         v: 'Figma · Miro' },
              { l: 'Output',        v: 'Research Report' },
            ].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#FFFFFF', margin: 0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: C.page, borderBottom: `1px solid ${C.border}` }}>
        <Wrap>
          <p style={{ margin: 0, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase', padding: '0.7rem 0' }}>
            approx. 5 min quick read
          </p>
        </Wrap>
      </div>

      {/* ── WHY THIS TOPIC ── */}
      <section id="why" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>01 — Why This Topic</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              A system built for the already-included
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '70ch', margin: '0 0 1.5rem' }}>
              India's digital payment revolution has been celebrated as a leap toward financial inclusion. But early in our research process, a question kept surfacing: who gets left behind when design assumes literacy? Every fintech product we encountered was built for a smartphone user with a bank account and the confidence to navigate it.
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '70ch', margin: 0 }}>
              We chose this topic because the gap wasn't just academic — it was visible in our surroundings. Security guards at our campus, vendors outside the gates, domestic staff in our neighbourhood: people deeply embedded in the digital economy who had no safe foothold inside it. We wanted to understand why, and whether design had anything to offer.
            </p>
          </Reveal>
        </Wrap>
      </section>

      {/* ── OVERVIEW ── */}
      <section id="overview" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>02 — Overview</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              A gap that keeps getting wider
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '70ch', margin: '0 0 2.5rem' }}>
              When I started this project, I expected to find people who simply hadn't learned how to use digital tools. What I found was different: a financial system that had never been designed to include them at all. India's digital revolution is real, but only{' '}
              <strong style={{ color: C.ink }}>27% of Indians are financially literate</strong>. Among semi-literate populations, this isn't a knowledge gap. It's a design failure that keeps compounding into real financial harm.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
            <StatCard stat="27%" label="Financially Literate in India" sub="Only a quarter understand basic financial concepts" />
            <StatCard stat="16.7%" label="Students Understanding Finance" sub="Formal education failing to instill financial literacy" />
            <StatCard stat="₹21,367Cr" label="Total Bank Fraud in H1 FY25" sub="Cases rose 27% year-on-year — RBI data" />
            <StatCard stat="101%" label="Growth in Fraud Cases 2024" sub="Digital payment fraud at an alarming growth rate" />
          </div>

          <Reveal delay={0.15}><Label>Conceptual Framework — 5 Research Phases</Label></Reveal>
          <Reveal delay={0.2}><ResearchPhaseDiagram /></Reveal>
        </Wrap>
      </section>

      {/* ── CONTEXT ── */}
      <section id="context" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>03 — Problem Context</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              What we knew before going in
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '70ch', margin: '0 0 2.5rem' }}>
              Before going into the field, our team read everything we could find on financial vulnerability in India. The picture that emerged <strong style={{ fontWeight: 600, color: C.mid }}>wasn't a knowledge problem</strong>. It was a systems problem: structural, linguistic, and deeply gendered. Each barrier we found made the next one worse.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { title: 'Digital Payment Fraud',   body: <>Payment fraud costs India over <strong style={{ fontWeight: 600, color: C.ink }}>₹1,000 crore</strong> annually. <strong style={{ fontWeight: 600, color: C.ink }}>Card Not Present (CNP) fraud</strong> accounts for <strong style={{ fontWeight: 600, color: C.ink }}>70%+</strong> of global online fraud. <strong style={{ fontWeight: 600, color: C.ink }}>7 in 10</strong> Indian frauds involve OTP sharing.</> },
              { title: 'Digital Literacy Gap',     body: <>Low digital literacy leaves users unable to distinguish legitimate platforms from fraudulent ones. <strong style={{ fontWeight: 600, color: C.ink }}>Fake apps</strong> mimicking PhonePe and <strong style={{ fontWeight: 600, color: C.ink }}>fabricated QR codes</strong> are pervasive.</> },
              { title: 'Gender & Age Vulnerability', body: <>Women — especially in semi-urban contexts — are more likely to rely on <strong style={{ fontWeight: 600, color: C.ink }}>male intermediaries</strong> for financial decisions, increasing <strong style={{ fontWeight: 600, color: C.ink }}>exposure to fraud</strong>.</> },
              { title: 'Psychological Barriers',   body: <><strong style={{ fontWeight: 600, color: C.ink }}>Fear of irreversible mistakes</strong>, <strong style={{ fontWeight: 600, color: C.ink }}>institutional distrust</strong>, and technology anxiety create compounding barriers to digital financial adoption.</> },
              { title: 'Cultural & Linguistic Gaps', body: <>Financial content in <strong style={{ fontWeight: 600, color: C.ink }}>technical or non-vernacular language</strong> excludes large segments. Financial jargon itself becomes an <strong style={{ fontWeight: 600, color: C.ink }}>exclusion mechanism</strong>.</> },
              { title: 'Phishing & Social Engineering', body: <>Over <strong style={{ fontWeight: 600, color: C.ink }}>60% of fraud</strong> globally begins with phishing. In India, fraudsters leverage <strong style={{ fontWeight: 600, color: C.ink }}>fake bank calls and SMS</strong> designed to exploit trust in authority.</> },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ width: 28, height: 2.5, borderRadius: 2, background: C.accent, opacity: 0.5 + i * 0.08, marginBottom: '0.2rem' }} />
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{card.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.body}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal>
            <NeuCard style={{ padding: '1.5rem 2rem' }}>
              <Label>Opportunities Identified</Label>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {['Money Management Skills', 'Fraud & Scam Awareness', 'Decoding Financial Jargon', 'Accessible Expense Tracking'].map(opp => (
                  <div key={opp} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>{opp}</span>
                  </div>
                ))}
              </div>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── METHODS ── */}
      <section id="methods" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>04 — Research Methods</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              POEMS Framework
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              We needed a framework that would keep us observing rather than assuming. POEMS helped us look at the full context of someone's financial life: <strong style={{ fontWeight: 600, color: C.mid }}>not just the app or the transaction, but the environment around them</strong>, the objects they carry, the messages they receive and can't always read. It kept us grounded in their world rather than our own.
            </p>
          </Reveal>
          <Reveal delay={0.1}><POEMSDiagram /></Reveal>

          {/* Research Questions */}
          <div style={{ marginTop: '3.5rem' }}>
            <Reveal>
              <Label>Evolution of Research Questions</Label>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 1.75rem' }}>
                We started wide and got specific through immersion. Eight questions went into the field. One came back out, sharpened by what we actually heard.
              </p>
            </Reveal>
            <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                'How can financial management tools accommodate limited literacy & technological exposure?',
                'How do cultural and social norms influence the adoption of expense tracking tools?',
                'How can expense tracking tools integrate with financial literacy to enhance habits?',
                'How do gender dynamics influence susceptibility to financial scams?',
                'How does digital literacy impact susceptibility to financial fraud?',
                'How does misplaced trust in informal agents increase the risk of scams?',
                'How does lack of digital financial tool understanding contribute to fraud?',
                'How can expense tracking be designed for semi-literate urban individuals?',
              ].map((q, i) => (
                <StaggerItem key={i} style={{ flex: 1 }}>
                  <NeuCard style={{ flex: 1, padding: '1rem', display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, flexShrink: 0, paddingTop: '2px' }}>Q{i + 1}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{q}</p>
                  </NeuCard>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <Reveal>
              <NeuCard style={{ padding: '2rem 2.25rem', borderLeft: `3px solid ${C.accent}` }}>
                <Label>Final Research Question</Label>
                <blockquote style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(1.1rem,2vw,1.35rem)', fontStyle: 'italic',
                  lineHeight: 1.6, color: C.ink, margin: 0,
                }}>
                  "How can we effectively disseminate knowledge on avoiding financial scams to foster better financial
                  habits among semi-literate individuals in urban areas like Bangalore — considering their current
                  awareness and vulnerabilities?"
                </blockquote>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: C.muted, marginTop: '1rem', marginBottom: 0 }}>
                  Refined from 8 initial questions · Post on-ground interview analysis
                </p>
              </NeuCard>
            </Reveal>
          </div>
        </Wrap>
      </section>

      {/* ── FIELDWORK ── */}
      <section id="fieldwork" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>05 — On-Ground Research</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Field Interviews
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 0.75rem' }}>
              We didn't want to stay in the classroom with the data. We went out. <strong style={{ color: C.ink }}>12 conversations across Bangalore</strong>: security guards, vegetable sellers, auto drivers, craftspersons, small business owners. Each one taught us something we couldn't have read in a paper.
            </p>
            <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.mid, margin: '0 0 2rem' }}>
              "There's a moment when research stops feeling like coursework and starts feeling like responsibility. Sitting beside Parvati at her stall, watching her explain why she avoids digital payments because she's afraid of 'losing the money in the phone', that was it."
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <NeuCard style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {[['Target Group', 'Security guards · Cleaning staff · Small business owners'], ['Age Range', '18–50 years'], ['Education', 'Less or semi-literate']].map(([l, v]) => (
                <div key={l}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{l}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{v}</p>
                </div>
              ))}
            </NeuCard>
          </Reveal>

          <Label>Participant Profiles</Label>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {PARTICIPANTS.map((p, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '10px',
                      background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.accent }}>{p.name[0]}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{p.name}</p>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', color: C.muted, margin: 0 }}>{p.age} · {p.role}</p>
                    </div>
                  </div>
                  <div style={{ display: 'inline-block', background: C.accentDim, borderRadius: '99px', padding: '2px 10px' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.08em', color: C.accent }}>{p.lit}</span>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>"{p.key}"</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal><Label>Field Documentation</Label></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.6rem', padding: '0.5rem 0 1rem' }}>
            {[
              { src: '/fin-field-01.jpg', nudge:  6, shift:  4 },
              { src: '/fin-field-02.jpg', nudge: -3, shift: -6 },
              { src: '/fin-field-03.jpg', nudge:  2, shift:  8 },
              { src: '/fin-field-04.jpg', nudge: -5, shift: -3 },
              { src: '/fin-field-05.jpg', nudge:  4, shift:  5 },
              { src: '/fin-field-06.jpg', nudge: -2, shift:  7 },
              { src: '/fin-field-07.jpg', nudge:  5, shift: -5 },
              { src: '/fin-field-08.jpg', nudge: -4, shift:  3 },
              { src: '/fin-field-09.jpg', nudge:  3, shift: -7 },
              { src: '/fin-field-10.jpg', nudge: -6, shift:  4 },
            ].map(({ src, nudge, shift }) => (
              <div key={src} style={{ transform: `rotate(${nudge * 0.35}deg) translateY(${shift * 0.5}px)`, transition: 'transform 0.25s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) translateY(-3px) scale(1.03)'; e.currentTarget.style.zIndex = 2; e.currentTarget.style.position = 'relative' }}
                onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${nudge * 0.35}deg) translateY(${shift * 0.5}px)`; e.currentTarget.style.zIndex = 0 }}
              >
                <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '2px 4px 12px rgba(0,0,0,0.18)' }}>
                  <img src={src} alt="" loading="lazy" decoding="async" style={{ width: '100%', aspectRatio: '4/3', display: 'block', objectFit: 'cover' }} />
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── INSIGHTS ── */}
      <section id="insights" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>06 — Insights</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              What 12 conversations revealed
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              A consistent pattern across 12 interviews: barriers to financial safety are not cognitive but structural,
              rooted in language, trust, access, and design failure.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem', alignItems: 'start' }}>
            {FINDINGS.map((f, i) => {
              const colors = ['#FFB3C1', '#FFF07C', '#C9B1FF', '#AEECD8']
              const darken  = ['#F48099', '#E6D350', '#A98EE0', '#7DD4B8']
              const rots    = [-2, 1.5, -1, 2.2, -1.5, 1, -2.2, 0.8, -1.2, 1.8, -0.8, 2]
              const bg = colors[i % 4]
              const fold = darken[i % 4]
              const rot  = rots[i] || 0
              return (
                <StaggerItem key={i}>
                  <div style={{
                    background: bg,
                    borderRadius: '2px',
                    padding: '1.25rem 1.1rem 1.4rem',
                    position: 'relative',
                    transform: `rotate(${rot}deg)`,
                    boxShadow: '3px 5px 16px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) translateY(-4px)'; e.currentTarget.style.boxShadow = '4px 10px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${rot}deg)`; e.currentTarget.style.boxShadow = '3px 5px 16px rgba(0,0,0,0.13), 0 1px 3px rgba(0,0,0,0.08)' }}
                  >
                    {/* Folded corner */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 22px 22px 0', borderColor: `transparent ${fold} transparent transparent` }} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.35)', display: 'block', marginBottom: '0.6rem' }}>{String(i + 1).padStart(2, '0')}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: 'rgba(0,0,0,0.82)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>{f.title}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', lineHeight: 1.65, color: 'rgba(0,0,0,0.6)', margin: 0 }}>{f.body}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerGrid>

          {/* Inferences */}
          <Reveal><Label>Inferences — 6 Contexts</Label></Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1rem' }}>
            {[
              { ctx: 'Demographic Context',    points: ['Security guards, cleaning staff, small business owners', 'Age range: 18–50 years', 'Less or semi-literate with limited formal education'] },
              { ctx: 'Psychological Context',  points: ['Fear of technology: hesitation using digital financial tools', 'Fear of scams: constant worry about being cheated', 'Distrust of formal banking systems and institutions'] },
              { ctx: 'Behavioral Context',     points: ['Reliance on third parties (family, friends, intermediaries)', 'Language barrier: struggles with non-vernacular financial content', 'Resistance to change driven more by communication gaps than adaptability'] },
              { ctx: 'Educational Context',    points: ['Limited understanding of savings, investments, interest rates', 'Difficulty interpreting jargon makes systems feel inaccessible', 'Formal education fails to bridge the literacy–financial literacy gap'] },
              { ctx: 'Communication Context',  points: ['Difficulty understanding financial materials in technical language', 'Preference for visual aids, vernacular language, easy instructions', 'Simplified, contextually relevant content is critical'] },
              { ctx: 'Socio-Cultural Context', points: ['Financial behavior shaped by community norms and social networks', 'Sense of financial exclusion from mainstream systems', 'Community-endorsed intermediaries are trusted over formal institutions'] },
            ].map((ctx, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.accent, margin: 0 }}>{ctx.ctx}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {ctx.points.map((pt, j) => (
                      <div key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: '0.42em', opacity: 0.55 }} />
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{pt}</p>
                      </div>
                    ))}
                  </div>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Wrap>
      </section>

      {/* ── WORKSHOP (dark) ── */}
      <section id="workshop" style={{ ...PAD, background: C.dark }}>
        <Wrap>
          <Reveal>
            <SectionTag dark>07 — Participatory Workshop</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.darkInk, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Taking the research back to the people
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.darkMid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              The interviews gave us understanding. But I didn't want this research to end with us. We ran a participatory workshop with NID's cleaning and gardening staff, people with similar profiles to those we'd been speaking with. The question driving it: could a single session meaningfully shift someone's ability to recognise a financial scam?
            </p>
          </Reveal>

          {/* Mission/Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { label: 'Mission', body: 'To empower semi-literate individuals in urban Bangalore to protect themselves from financial scams through practical, accessible, and actionable knowledge tailored to their needs.', pts: ['Recognise common financial scams', 'Verify financial information', 'Build habits to avoid scams', 'Strengthen budgeting and saving'] },
              { label: 'Vision', body: 'A financially aware and resilient community where every individual, regardless of literacy level, has the skills and confidence to make informed financial choices and protect themselves from exploitation.', pts: [] },
            ].map(s => (
              <Reveal key={s.label}>
                <NeuCard dark style={{ padding: '1.75rem', height: '100%' }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: C.darkMuted, textTransform: 'uppercase', margin: '0 0 0.85rem' }}>{s.label}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.darkInk, margin: '0 0 0.75rem', lineHeight: 1.5 }}>{s.body}</p>
                  {s.pts.length > 0 && (
                    <ul style={{ margin: 0, padding: '0 0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {s.pts.map(pt => (
                        <li key={pt} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.6, color: C.darkMid }}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </NeuCard>
              </Reveal>
            ))}
          </div>

          {/* Participants */}
          <Reveal><Label dark>10 Participants — NID Staff</Label></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            <Reveal>
              <NeuCard dark style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[['Geeta',39,'F'],['Jamna',38,'F'],['Pushpa',28,'F'],['Shankar',32,'M'],['Rangaswami',20,'M'],['Pravin',45,'M'],['Lakshmi',38,'F'],['Haseena',39,'F'],['Venkat Charpata',33,'M'],['Shivraj',30,'M']].map(([name,age,g]) => (
                    <div key={name} style={{ display:'flex', gap:'0.75rem', alignItems:'center', padding:'0.35rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width:22,height:22,borderRadius:'6px',background:`rgba(155,158,232,${g==='F'?0.18:0.12})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.48rem', color:'#9B9EE8' }}>{g}</span>
                      </div>
                      <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:500, fontSize:'0.8rem', color:C.darkInk, flex:1 }}>{name}</span>
                      <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.52rem', color:C.darkMuted }}>{age}</span>
                    </div>
                  ))}
                </div>
              </NeuCard>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <NeuCard dark style={{ padding:'1.5rem' }}>
                  <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.55rem', letterSpacing:'0.18em', color:C.darkMuted, textTransform:'uppercase', margin:'0 0 0.75rem' }}>Gender Split</p>
                  <div style={{ display:'flex', gap:'2rem' }}>
                    {[['50%','Women','#C5A0FF'],['50%','Men','#9B9EE8']].map(([pct,label,col]) => (
                      <div key={label}>
                        <p style={{ fontFamily:"'Syne', sans-serif", fontWeight:500, fontSize:'1.8rem', color:col, margin:'0 0 0.2rem' }}>{pct}</p>
                        <p style={{ fontFamily:"'Syne', sans-serif", fontSize:'0.78rem', color:C.darkMid, margin:0 }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </NeuCard>
                <NeuCard dark style={{ padding:'1.5rem' }}>
                  <p style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.55rem', letterSpacing:'0.18em', color:C.darkMuted, textTransform:'uppercase', margin:'0 0 0.75rem' }}>Age Distribution</p>
                  {[['20–30','20%',20],['31–40','70%',70],['41–45','10%',10]].map(([range,pct,n]) => (
                    <div key={range} style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.45rem' }}>
                      <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.56rem', color:C.darkMuted, minWidth:38 }}>{range}</span>
                      <div style={{ flex:1, height:5, background:'rgba(255,255,255,0.07)', borderRadius:3, overflow:'hidden' }}>
                        <div style={{ width:`${n}%`, height:'100%', background:'#9B9EE8', borderRadius:3 }} />
                      </div>
                      <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.56rem', color:C.darkMuted, minWidth:28 }}>{pct}</span>
                    </div>
                  ))}
                </NeuCard>
              </div>
            </Reveal>
          </div>

          {/* Segments */}
          <Reveal><Label dark>6 Workshop Segments</Label></Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {SEGMENTS.map((seg, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard dark style={{ flex: 1, padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '7px', background: 'rgba(155,158,232,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#9B9EE8' }}>{seg.num}</span>
                    </div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.darkInk, margin: 0 }}>{seg.title}</p>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.darkMid, margin: 0 }}>{seg.desc}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Docs */}
          <Reveal><Label dark>Workshop Documentation</Label></Reveal>
          <Reveal delay={0.08}><WorkshopCarousel /></Reveal>
        </Wrap>
      </section>

      {/* ── ANALYSIS ── */}
      <section id="analysis" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>08 — Analysis</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Pre & Post Workshop Results
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              We measured awareness across 4 parameters before and after the session. The results were honest: observable improvement in most areas, but not statistically significant with 10 participants. That null result was as informative as anything else in this project.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <Reveal><Label>Likert Score Comparison (1–5 Scale)</Label></Reveal>
              <ResultsChart />
            </div>
            <div>
              <Reveal delay={0.1}><Label>Statistical Analysis</Label></Reveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Shapiro-Wilk Normality Test', col: C.accent, body: 'Both pre and post-test scores had p-values >0.05, confirming data does not significantly deviate from normality, which validates parametric tests.', stats: [['Pre-Test','W = 0.887, p = 0.368'],['Post-Test','W = 0.983, p = 0.920']] },
                  { title: 'Paired T-Test Result', col: '#B03030', body: 'The p-value (0.162) exceeds the 0.05 threshold; the null hypothesis holds. The workshop did not produce statistically significant improvement. However, observed percentage changes are real at a descriptive level.', stat: 'p = 0.162' },
                  { title: 'Possible Reasons for Null Hypothesis', col: C.muted, pts: ['Sample size constraint: pilot with 10 participants','Workshop kept short to respect time constraints','External factors: peer influence during responses'] },
                ].map((card, i) => (
                  <Reveal key={i} delay={0.1 + i * 0.08}>
                    <NeuCard style={{ padding: '1.4rem' }}>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', color: card.col, textTransform: 'uppercase', margin: '0 0 0.7rem' }}>{card.title}</p>
                      {card.stat && <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.ink, margin: '0 0 0.5rem' }}>{card.stat}</p>}
                      {card.body && <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, margin: card.stats ? '0 0 0.75rem' : 0 }}>{card.body}</p>}
                      {card.stats && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          {card.stats.map(([l,v]) => (
                            <div key={l}>
                              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, margin: '0 0 0.2rem' }}>{l}</p>
                              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {card.pts && card.pts.map((pt, j) => (
                        <div key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.muted, flexShrink: 0, marginTop: '0.42em' }} />
                          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{pt}</p>
                        </div>
                      ))}
                    </NeuCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <Reveal>
            <NeuCard style={{ padding: '1.75rem 2rem', borderLeft: `3px solid ${C.accentBorder}` }}>
              <Label>Inferential vs. Descriptive Statistics</Label>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: '0 0 0.85rem', maxWidth: '70ch' }}>
                While participants showed an observed increase in scores, the changes may not be large or consistent enough
                to reach statistical significance. The data provides strong descriptive evidence, but insufficient inferential
                evidence to attribute changes solely to the workshop rather than chance.
              </p>
              <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.ink, margin: 0 }}>
                "This does not imply the workshop was ineffective; it implies we need a larger sample
                and more sessions to generate statistical confidence."
              </p>
            </NeuCard>
          </Reveal>
        </Wrap>
      </section>

      {/* ── RECOMMENDATIONS ── */}
      <section id="recommendations" style={{ ...PAD, background: C.surface }}>
        <Wrap>
          <Reveal>
            <SectionTag>09 — Recommendations</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              5 Design & Policy Recommendations
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              These didn't come from a brief or a benchmark. They came directly from those twelve conversations, and from what the workshop made visible.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { num: '01', title: 'Community Ambassadors & Peer Educators', body: 'Train community leaders and trusted figures to act as financial safety ambassadors. Peer-to-peer learning builds trust. Leverage short-format social media (Reels, YouTube Shorts) to reach audiences where they already are.' },
              { num: '02', title: 'Government & NGO Collaboration', body: 'Formation of NGOs that act as intermediaries between scam victims and enforcement bodies (police, RBI) can significantly lower the barrier to reporting. Fear is why people don\'t approach cyber cells.' },
              { num: '03', title: 'Stricter App Store Regulations', body: 'Stricter regulations must govern what financial data apps can request during onboarding. Transparency around data usage should be mandated, not optional, before any financial app reaches the market.' },
              { num: '04', title: 'More Accessible Content on Financial Scams', body: 'Content like RBI\'s "Raju and the 40 Thieves" must be localised and vernacularly inclusive. Financial literacy content should be designed for oral and visual consumption to reach semi-literate populations effectively.' },
              { num: '05', title: 'Centralised Scam Database & Reward-Based Reporting', body: 'A user-friendly database of known scams, fake apps, and phishing sites with real-time updates, paired with a reward-based reporting system offering monetary or community recognition. Anonymity must be guaranteed.' },
            ].map((rec, i) => (
              <StaggerItem key={i}>
                <NeuCard style={{ padding: '1.5rem 1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.accent }}>{rec.num}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.ink, margin: '0 0 0.45rem' }}>{rec.title}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: 0 }}>{rec.body}</p>
                  </div>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Wrap>
      </section>

      {/* ── REFLECTIONS (dark) ── */}
      <section id="reflections" style={{ background: 'linear-gradient(145deg,#0a0a0a 0%,#161616 55%,#0f0f0f 100%)', ...PAD }}>
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
            }}>What the research taught us</h2>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
            {[
              { n: '01', text: '"Our participants were intelligent, experienced, and resourceful. Their vulnerability is not a cognitive failing — it is the result of systems never designed for them."' },
              { n: '02', text: '"Mandachalam uses GPay because he trusts it. Trust, not features or UX patterns, is the primary driver of adoption in this population. Any intervention that ignores this will fail."' },
              { n: '03', text: '"Sitting beside Parvati at her stall produced empathy that no desk research could. Co-presence directly shaped our research question and recommendations."' },
              { n: '04', text: '"A 12.59% improvement across 4 parameters in a single session is meaningful, but not statistically significant. Longitudinal, community-embedded programs are needed."' },
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
                  <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.9rem', color: C.darkInk, lineHeight: 1.65, margin: 0 }}>{r.text}</p>
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
              Designing for the margins doesn't mean designing differently. It means designing more honestly — and sitting with people long enough to understand what honesty requires.
            </p>
          </Reveal>
        </Wrap>
      </section>

      <BackToTop />
      <Footer />
    </div>
  )
}
