import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal } from './shared.jsx'

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
  { id: 'overview',        label: 'Overview' },
  { id: 'context',         label: 'Context' },
  { id: 'methods',         label: 'Methods' },
  { id: 'fieldwork',       label: 'Fieldwork' },
  { id: 'insights',        label: 'Insights' },
  { id: 'workshop',        label: 'Workshop' },
  { id: 'analysis',        label: 'Analysis' },
  { id: 'recommendations', label: 'Recommend.' },
  { id: 'reflections',     label: 'Reflect.' },
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
          fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em',
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
      fontFamily: "'Space Mono', monospace", fontSize: '0.55rem',
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
                width: isActive ? 3 : 1.5, height: isActive ? 32 : 24,
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
    <div ref={ref} style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.75rem', minWidth: 640 }}>
        {phases.map((phase, i) => (
          <motion.div key={i} style={{ flex: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.09 }}
          >
            <div style={{
              padding: '1.25rem 1rem', background: C.card,
              borderRadius: '12px', boxShadow: C.neuSm,
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
              height: '100%', position: 'relative',
            }}>
              {/* Accent stripe at top */}
              <div style={{
                position: 'absolute', top: 0, left: '1rem', right: '1rem',
                height: '2px', borderRadius: '0 0 2px 2px',
                background: `${C.accent}${Math.round(30 + i * 14).toString(16)}`,
              }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.2em', color: C.muted }}>{phase.num}</span>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.85rem', color: C.ink, margin: 0, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{phase.label}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', color: C.mid, margin: 0, lineHeight: 1.5 }}>{phase.sub}</p>
            </div>
          </motion.div>
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
      <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 320, flexShrink: 0 }}>
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
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.45rem', fill: '#fff', letterSpacing: '0.08em' }}>
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
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.85rem', fill: C.accent }}>
                {item.letter}
              </text>
              <text x={x} y={y + 9} textAnchor="middle"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.38rem', fill: C.muted, letterSpacing: '0.08em' }}>
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
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.8rem', color: C.accent }}>{item.letter}</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.82rem', color: C.ink, margin: '0 0 0.2rem' }}>{item.word}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.76rem', color: C.mid, margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
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
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.85rem', color: C.ink, margin: 0 }}>{r.param}</p>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: r.positive ? '#2A7A5A' : '#B03030', letterSpacing: '0.06em' }}>{r.change}</span>
          </div>
          {[{ label: 'PRE', val: r.pre, col: `${C.accent}50` }, { label: 'POST', val: r.post, col: r.positive ? '#2A7A5A80' : '#B0303080' }].map(bar => (
            <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: C.muted, width: 26 }}>{bar.label}</span>
              <div style={{ flex: 1, height: 7, background: C.accentDim, borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.07)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(bar.val / MAX) * 100}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: EASE }}
                  style={{ height: '100%', background: bar.col, borderRadius: 4 }}
                />
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.mid, minWidth: 24 }}>{bar.val}</span>
            </div>
          ))}
        </motion.div>
      ))}
      <NeuCard style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.85rem', color: C.ink, margin: 0 }}>Overall Improvement</p>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.1rem', fontWeight: 500, color: C.accent }}>+12.59%</span>
      </NeuCard>
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
    >
      <NeuCard style={{ padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: C.accent, margin: 0, lineHeight: 1 }}>{stat}</p>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.85rem', color: C.ink, margin: 0 }}>{label}</p>
        {sub && <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.76rem', color: C.mid, margin: 0, lineHeight: 1.5 }}>{sub}</p>}
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
    <div style={{ background: C.page, minHeight: '100vh', color: C.ink }}>
      <ProgressBar />
      <Nav />
      <SidebarNav active={active} />

      {/* ── HERO (dark) ── */}
      <section style={{ background: C.heroGrad, paddingTop: 'clamp(7rem,12vw,11rem)', paddingBottom: 'clamp(5rem,8vw,8rem)' }}>
        <Wrap>
          <MaskReveal delay={0}>
            <SectionTag dark>Research · Social Design</SectionTag>
          </MaskReveal>
          <MaskReveal delay={0.1}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 500,
              fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08,
              color: C.darkInk, margin: '0 0 1.75rem', maxWidth: '16ch',
            }}>
              Finance for<br />
              <span style={{ color: '#9B9EE8' }}>Semi-Literate</span>{' '}
              Populations
            </h1>
          </MaskReveal>
          <MaskReveal delay={0.2}>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1rem,2vw,1.15rem)',
              lineHeight: 1.75, color: C.darkMid, maxWidth: '55ch', margin: '0 0 3rem',
            }}>
              In 2024, I spent weeks sitting with security guards, vegetable sellers, and auto drivers across Bangalore, asking a question that had been bothering me: why are the people most reliant on the financial system also the most exposed to its failures? This is what I found.
            </p>
          </MaskReveal>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { l: 'Team',        v: 'Hiral · Raveena · Zeus' },
              { l: 'Type',        v: 'Design Research' },
              { l: 'Institution', v: 'NID Bangalore' },
              { l: 'Focus',       v: 'Financial Literacy & Scam Prevention' },
            ].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.darkMuted, textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.darkInk, margin: 0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── OVERVIEW ── */}
      <section id="overview" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>01 — Overview</SectionTag>
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
            <SectionTag>02 — Problem Context</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              What we knew before going in
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '70ch', margin: '0 0 2.5rem' }}>
              Before going into the field, our team read everything we could find on financial vulnerability in India. The picture that emerged wasn't a knowledge problem. It was a systems problem: structural, linguistic, and deeply gendered. Each barrier we found made the next one worse.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { title: 'Digital Payment Fraud',   body: 'Payment fraud costs India over ₹1,000 crore annually. Card Not Present (CNP) fraud accounts for 70%+ of global online fraud. 7 in 10 Indian frauds involve OTP sharing.' },
              { title: 'Digital Literacy Gap',     body: 'Low digital literacy leaves users unable to distinguish legitimate platforms from fraudulent ones. Fake apps mimicking PhonePe and fabricated QR codes are pervasive.' },
              { title: 'Gender & Age Vulnerability', body: 'Women — especially in semi-urban contexts — are more likely to rely on male intermediaries for financial decisions, increasing exposure to fraud.' },
              { title: 'Psychological Barriers',   body: 'Fear of irreversible mistakes, institutional distrust, and technology anxiety create compounding barriers to digital financial adoption.' },
              { title: 'Cultural & Linguistic Gaps', body: 'Financial content in technical or non-vernacular language excludes large segments. Financial jargon itself becomes an exclusion mechanism.' },
              { title: 'Phishing & Social Engineering', body: 'Over 60% of fraud globally begins with phishing. In India, fraudsters leverage fake bank calls and SMS designed to exploit trust in authority.' },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ width: 28, height: 2.5, borderRadius: 2, background: C.accent, opacity: 0.5 + i * 0.08, marginBottom: '0.2rem' }} />
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{card.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.body}</p>
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
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.85rem', color: C.ink }}>{opp}</span>
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
            <SectionTag>03 — Research Methods</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              POEMS Framework
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              We needed a framework that would keep us observing rather than assuming. POEMS helped us look at the full context of someone's financial life: not just the app or the transaction, but the environment around them, the objects they carry, the messages they receive and can't always read. It kept us grounded in their world rather than our own.
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
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: C.muted, flexShrink: 0, paddingTop: '2px' }}>Q{i + 1}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{q}</p>
                  </NeuCard>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <Reveal>
              <NeuCard style={{ padding: '2rem 2.25rem', borderLeft: `3px solid ${C.accent}` }}>
                <Label>Final Research Question</Label>
                <blockquote style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.15rem,2.2vw,1.5rem)', fontStyle: 'italic',
                  lineHeight: 1.6, color: C.ink, margin: 0,
                }}>
                  "How can we effectively disseminate knowledge on avoiding financial scams to foster better financial
                  habits among semi-literate individuals in urban areas like Bangalore — considering their current
                  awareness and vulnerabilities?"
                </blockquote>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', color: C.muted, marginTop: '1rem', marginBottom: 0 }}>
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
            <SectionTag>04 — On-Ground Research</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              Field Interviews
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 0.75rem' }}>
              We didn't want to stay in the classroom with the data. We went out. <strong style={{ color: C.ink }}>12 conversations across Bangalore</strong>: security guards, vegetable sellers, auto drivers, craftspersons, small business owners. Each one taught us something we couldn't have read in a paper.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: C.mid, margin: '0 0 2rem' }}>
              "There's a moment when research stops feeling like coursework and starts feeling like responsibility. Sitting beside Parvati at her stall, watching her explain why she avoids digital payments because she's afraid of 'losing the money in the phone', that was it."
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <NeuCard style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {[['Target Group', 'Security guards · Cleaning staff · Small business owners'], ['Age Range', '18–50 years'], ['Education', 'Less or semi-literate']].map(([l, v]) => (
                <div key={l}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{l}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{v}</p>
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
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1rem', color: C.accent }}>{p.name[0]}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.92rem', color: C.ink, margin: 0 }}>{p.name}</p>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', color: C.muted, margin: 0 }}>{p.age} · {p.role}</p>
                    </div>
                  </div>
                  <div style={{ display: 'inline-block', background: C.accentDim, borderRadius: '99px', padding: '2px 10px' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', color: C.accent }}>{p.lit}</span>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>"{p.key}"</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal><Label>Field Documentation</Label></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            {[
              ['On-ground interview — Parvati & Mandachalam', 'Field Interview Session 1'],
              ['Interview with Chandan & Sanjay — NID vicinity', 'Field Interview Session 2'],
              ['Deepam & Prakash interview documentation', 'Field Interview Session 3'],
            ].map(([l, s]) => (
              <div key={s}><ImgBox label={l} aspect="72%" /><ScreenLabel>{s}</ScreenLabel></div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── INSIGHTS ── */}
      <section id="insights" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>05 — Insights</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.2 }}>
              What 12 conversations revealed
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              A consistent pattern across 12 interviews: barriers to financial safety are not cognitive but structural,
              rooted in language, trust, access, and design failure.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.85rem', marginBottom: '3.5rem' }}>
            {FINDINGS.map((f, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <NeuCard style={{ flex: 1, padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.1rem' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.accent, opacity: 0.6 + (i % 4) * 0.1 }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1, height: 1, background: C.border }} />
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.86rem', color: C.ink, margin: 0 }}>{f.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.77rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{f.body}</p>
                </NeuCard>
              </StaggerItem>
            ))}
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
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.86rem', color: C.accent, margin: 0 }}>{ctx.ctx}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {ctx.points.map((pt, j) => (
                      <div key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: '0.42em', opacity: 0.55 }} />
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.77rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{pt}</p>
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
            <SectionTag dark>06 — Participatory Workshop</SectionTag>
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
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.darkMuted, textTransform: 'uppercase', margin: '0 0 0.85rem' }}>{s.label}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.92rem', color: C.darkInk, margin: '0 0 0.75rem', lineHeight: 1.5 }}>{s.body}</p>
                  {s.pts.length > 0 && (
                    <ul style={{ margin: 0, padding: '0 0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {s.pts.map(pt => (
                        <li key={pt} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.79rem', lineHeight: 1.6, color: C.darkMid }}>{pt}</li>
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
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.86rem', color: C.darkInk, margin: 0 }}>{seg.title}</p>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.darkMid, margin: 0 }}>{seg.desc}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Docs */}
          <Reveal><Label dark>Workshop Documentation</Label></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            {[
              ['Introduction segment — agenda with participants','Segment 1'],
              ['Spot the Scam — printed fraud examples','Segment 3'],
              ['RBI comic "Raju and the 40 Thieves"','Segment 4'],
              ['Follow-up and brochure distribution','Segments 5 & 6'],
            ].map(([l,s]) => (
              <div key={s}><ImgBox dark label={l} aspect="68%" /><ScreenLabel dark>{s}</ScreenLabel></div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── ANALYSIS ── */}
      <section id="analysis" style={{ ...PAD, background: C.page }}>
        <Wrap>
          <Reveal>
            <SectionTag>07 — Analysis</SectionTag>
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
                      {card.stat && <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.4rem', color: C.ink, margin: '0 0 0.5rem' }}>{card.stat}</p>}
                      {card.body && <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.65, color: C.mid, margin: card.stats ? '0 0 0.75rem' : 0 }}>{card.body}</p>}
                      {card.stats && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          {card.stats.map(([l,v]) => (
                            <div key={l}>
                              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: C.muted, margin: '0 0 0.2rem' }}>{l}</p>
                              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.82rem', color: C.ink, margin: 0 }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {card.pts && card.pts.map((pt, j) => (
                        <div key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.muted, flexShrink: 0, marginTop: '0.42em' }} />
                          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.79rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{pt}</p>
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
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: C.ink, margin: 0 }}>
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
            <SectionTag>08 — Recommendations</SectionTag>
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
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.accent }}>{rec.num}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.95rem', color: C.ink, margin: '0 0 0.45rem' }}>{rec.title}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', lineHeight: 1.7, color: C.mid, margin: 0 }}>{rec.body}</p>
                  </div>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Wrap>
      </section>

      {/* ── REFLECTIONS (dark) ── */}
      <section id="reflections" style={{ ...PAD, background: C.heroGrad }}>
        <Wrap>
          <Reveal>
            <SectionTag dark>09 — Reflections</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.darkInk, margin: '0 0 1.5rem', lineHeight: 1.2 }}>
              What the Research Taught Us
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { title: 'The gap is structural, not cognitive', body: 'Our participants were intelligent, experienced, and resourceful. Their vulnerability to financial fraud is not a cognitive failing; it is the result of systems never designed for them. Every interface, financial term, and UPI error message assumes literacy they simply don\'t have.' },
              { title: 'Trust is the real design material', body: 'Mandachalam uses GPay because he trusts it. Parvati trusts only her husband. Prakash trusts a diary over an app. Trust, not features or UX patterns, is the primary driver of adoption in this population. Any intervention that ignores this will fail.' },
              { title: 'Participatory methods are non-negotiable', body: 'The POEMS framework, on-ground interviews, and the workshop revealed insights no desk research could. Co-presence, sitting beside Parvati at her stall, produced empathy that directly shaped our research question and recommendations.' },
              { title: 'Statistical limits are research lessons', body: 'The null hypothesis result was humbling and informative. A 12.59% overall improvement across 4 parameters in a single session is meaningful, but not statistically significant with 10 participants. Longitudinal, community-embedded programs are needed.' },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <NeuCard dark style={{ padding: '1.5rem' }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.92rem', color: C.darkInk, margin: '0 0 0.65rem' }}>{r.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', lineHeight: 1.75, color: C.darkMid, margin: 0 }}>{r.body}</p>
                </NeuCard>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem' }}>
              <blockquote style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.4rem,2.8vw,2rem)', fontStyle: 'italic',
                lineHeight: 1.55, color: C.darkInk, margin: '0 0 1.25rem', maxWidth: '28ch',
              }}>
                "Designing for the margins doesn't mean designing differently. It means designing more honestly."
              </blockquote>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: C.darkMuted }}>
                Finance for Semi/Less Literate — Group 2 · NID Bangalore
              </p>
            </div>
          </Reveal>
        </Wrap>
      </section>

      {/* ── NEXT PROJECT ── */}
      <section style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', background: C.page }}>
        <Wrap>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, margin: '0 0 0.35rem' }}>Next Project</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.2rem', color: C.ink, margin: 0 }}>Spectra — Data Viz & Experience</p>
            </div>
            <a href="/work/study-buddy" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: "'Space Mono', monospace", fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.ink, textDecoration: 'none',
              boxShadow: C.neuSm, borderRadius: '99px', padding: '0.65rem 1.4rem',
              background: C.card,
            }}>← Study Buddy</a>
          </div>
        </Wrap>
      </section>

      <Footer />
    </div>
  )
}
