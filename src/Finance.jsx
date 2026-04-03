import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
const C = {
  dark:       '#060606',
  surface:    '#0d0d0d',
  pink:       '#FF4B8F',
  purple:     '#7C3AED',
  green:      '#00FF87',
  white:      '#FFFFFF',
  bg:         '#F8F8F6',
  ink:        '#060606',
  inkLight:   '#F2EDE4',
  mid:        '#3A3A3A',
  muted:      '#777777',
  border:     'rgba(0,0,0,0.09)',
  borderDark: 'rgba(255,255,255,0.07)',
}

const EASE = [0.22, 1, 0.36, 1]

// ─── Sidebar Nav Sections ────────────────────────────────
const NAV_SECTIONS = [
  { id: 'overview',         label: 'Overview' },
  { id: 'context',          label: 'Context' },
  { id: 'methods',          label: 'Methods' },
  { id: 'fieldwork',        label: 'Fieldwork' },
  { id: 'insights',         label: 'Insights' },
  { id: 'workshop',         label: 'Workshop' },
  { id: 'analysis',         label: 'Analysis' },
  { id: 'recommendations',  label: 'Recommend.' },
  { id: 'reflections',      label: 'Reflect.' },
]

// ─── Layout Helpers ──────────────────────────────────────
function Wrap({ children, className = '' }) {
  return (
    <div className={`max-w-[1120px] mx-auto px-[clamp(1.5rem,5vw,3rem)] ${className}`}>
      {children}
    </div>
  )
}

const PAD = { paddingTop: 'clamp(5rem,8vw,7rem)', paddingBottom: 'clamp(4rem,6vw,6rem)' }

// ─── Typography Components ───────────────────────────────
function SectionTag({ children, color }) {
  const col = color || C.purple
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: col,
      border: `1px solid ${col}40`,
      padding: '4px 10px',
      borderRadius: '99px',
      marginBottom: '1.25rem',
    }}>{children}</span>
  )
}

function Label({ children, light = false }) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: light ? 'rgba(255,255,255,0.3)' : C.muted,
      display: 'block',
      marginBottom: '1.5rem',
    }}>{children}</span>
  )
}

// ─── Placeholder Image Box ────────────────────────────────
function ImgBox({ label, aspect = '56.25%', style = {}, dark = false }) {
  const bg = dark ? C.surface : C.bg
  const border = dark ? `1.5px dashed ${C.borderDark}` : `1.5px dashed ${C.border}`
  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: aspect,
      background: bg, border, borderRadius: '12px', overflow: 'hidden', ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '10px',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={dark ? 'rgba(255,255,255,0.3)' : C.muted} strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke={dark ? 'rgba(255,255,255,0.3)' : C.muted} strokeWidth="1.5" />
          <path d="M3 15l5-5 4 4 3-3 6 6" stroke={dark ? 'rgba(255,255,255,0.3)' : C.muted} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.1em',
          color: dark ? 'rgba(255,255,255,0.35)' : C.muted,
          textAlign: 'center', maxWidth: '220px', lineHeight: 1.5,
        }}>{label}</span>
      </div>
    </div>
  )
}

// ─── Screen Label ─────────────────────────────────────────
function ScreenLabel({ children, dark = false }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: '0.55rem',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,0.45)' : C.muted,
      textAlign: 'center', marginTop: '0.75rem',
    }}>{children}</div>
  )
}

// ─── Insight annotation ───────────────────────────────────
function KeyInsight({ text }) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{
        fontFamily: "'Space Mono', monospace", fontSize: '0.62rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: C.purple, textDecoration: 'underline', marginBottom: '0.5rem',
      }}>Key Takeaway</p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ color: C.purple, fontSize: '0.9rem', flexShrink: 0 }}>→</span>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.65, color: C.mid, margin: 0, fontFamily: "'Syne', sans-serif" }}>{text}</p>
      </div>
    </div>
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
        hidden:  { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
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
      position: 'fixed', left: 'clamp(10px, 1.5vw, 22px)', top: '50%',
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
                background: isActive ? C.pink : C.border, borderRadius: 2,
                boxShadow: isActive ? '0 0 10px 2px rgba(255,75,143,0.5)' : 'none',
              }}
              transition={{ duration: 0.3 }} style={{ flexShrink: 0 }}
            />
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: '0.58rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: isActive ? C.pink : C.muted, transition: 'color 0.25s',
              whiteSpace: 'nowrap',
              textShadow: isActive ? '0 0 10px rgba(255,75,143,0.45)' : 'none',
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

// ═══════════════════════════════════════════════════════════
// DIAGRAMS
// ═══════════════════════════════════════════════════════════

// ─── 1. Research Phases Diagram ───────────────────────────
function ResearchPhaseDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const phases = [
    { num: '01', label: 'Brainstorming', sub: 'Identifying the problem space & opportunities', color: C.purple },
    { num: '02', label: 'Roadmap',       sub: 'Planning research strategy & methods', color: C.pink },
    { num: '03', label: 'On-Ground\nResearch', sub: 'Direct interviews with 12 participants', color: C.green },
    { num: '04', label: 'Literature\nReview', sub: 'Secondary research & validation', color: C.purple },
    { num: '05', label: 'Research\nQuestion', sub: 'Refined focus on scam literacy', color: C.pink },
  ]

  return (
    <div ref={ref} style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
      <div style={{
        display: 'flex', alignItems: 'stretch', gap: 0,
        minWidth: 640, position: 'relative',
      }}>
        {phases.map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: EASE, delay: i * 0.1 }}
            style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}
          >
            {/* Arrow connector */}
            {i < phases.length - 1 && (
              <div style={{
                position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)',
                width: 2, height: '60%', background: C.border, zIndex: 2,
              }} />
            )}

            <div style={{
              flex: 1, margin: '0 6px',
              border: `1.5px solid ${phase.color}30`,
              borderRadius: '10px',
              padding: '1.25rem 1rem',
              background: `${phase.color}08`,
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
              position: 'relative',
            }}>
              {/* Phase number */}
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: '0.55rem',
                letterSpacing: '0.2em', color: phase.color, opacity: 0.7,
              }}>{phase.num}</span>

              {/* Connector dot */}
              {i < phases.length - 1 && (
                <div style={{
                  position: 'absolute', right: -13, top: '50%',
                  transform: 'translateY(-50%)',
                  width: 20, height: 20, borderRadius: '50%',
                  border: `2px solid ${phase.color}`,
                  background: C.bg, zIndex: 3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '0.55rem', color: phase.color }}>›</span>
                </div>
              )}

              <p style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 'clamp(0.7rem,1.5vw,0.85rem)', color: C.ink,
                margin: 0, lineHeight: 1.3, whiteSpace: 'pre-line',
              }}>{phase.label}</p>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: '0.72rem',
                color: C.muted, margin: 0, lineHeight: 1.5,
              }}>{phase.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. POEMS Diagram ─────────────────────────────────────
function POEMSDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const items = [
    { letter: 'P', word: 'People',       color: C.pink,   desc: 'Semi-literate users and their financial habits — security guards, cleaning staff, small business owners' },
    { letter: 'O', word: 'Objects',      color: C.purple, desc: 'Expense-tracking tools, smartphones, physical tools like passbooks or notebooks' },
    { letter: 'E', word: 'Environment',  color: C.green,  desc: 'Urban context — bank branches, digital platforms, local financial services in Bangalore' },
    { letter: 'M', word: 'Messages',     color: C.pink,   desc: 'Communication barriers: language gaps, financial jargon, and how literacy is conveyed' },
    { letter: 'S', word: 'Services',     color: C.purple, desc: 'The role of banks, fintech, and organizations in driving financial inclusion' },
  ]

  const CX = 200, CY = 200, R = 130

  return (
    <div ref={ref} style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
      {/* SVG Pentagon */}
      <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 340, flexShrink: 0 }}>
        {/* Ring */}
        <motion.circle cx={CX} cy={CY} r={R + 20}
          fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="4 6"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }}
        />

        {/* Pentagon lines */}
        {items.map((item, i) => {
          const angle = (i * 72 - 90) * Math.PI / 180
          const x = CX + R * Math.cos(angle)
          const y = CY + R * Math.sin(angle)
          const nextAngle = ((i + 1) * 72 - 90) * Math.PI / 180
          const nx = CX + R * Math.cos(nextAngle)
          const ny = CY + R * Math.sin(nextAngle)
          return (
            <g key={i}>
              <motion.line x1={CX} y1={CY} x2={x} y2={y}
                stroke={item.color} strokeWidth={1} strokeOpacity={0.3}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              />
              <motion.line x1={x} y1={y} x2={nx} y2={ny}
                stroke={C.border} strokeWidth={1}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              />
            </g>
          )
        })}

        {/* Center */}
        <motion.circle cx={CX} cy={CY} r={22}
          fill={C.ink} stroke={C.border} strokeWidth={1}
          initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
        <text x={CX} y={CY + 5} textAnchor="middle"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', fill: C.inkLight, letterSpacing: '0.1em' }}>
          POEMS
        </text>

        {/* Nodes */}
        {items.map((item, i) => {
          const angle = (i * 72 - 90) * Math.PI / 180
          const x = CX + R * Math.cos(angle)
          const y = CY + R * Math.sin(angle)
          return (
            <motion.g key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: EASE }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={24} fill={item.color} fillOpacity={0.12} stroke={item.color} strokeWidth={1.5} />
              <text x={x} y={y - 4} textAnchor="middle"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.9rem', fill: item.color }}>
                {item.letter}
              </text>
              <text x={x} y={y + 10} textAnchor="middle"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.4rem', fill: item.color, letterSpacing: '0.1em' }}>
                {item.word.toUpperCase()}
              </text>
            </motion.g>
          )
        })}
      </svg>

      {/* List */}
      <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.3 + i * 0.08, ease: EASE }}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: `${item.color}15`, border: `1.5px solid ${item.color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.75rem', color: item.color }}>
                {item.letter}
              </span>
            </div>
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.ink, margin: '0 0 0.25rem' }}>
                {item.word}
              </p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.muted, margin: 0, lineHeight: 1.55 }}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. Participant Profile Cards ─────────────────────────
const PARTICIPANTS = [
  { name: 'Parvati',     age: 31, role: 'Vegetable Seller',    literacy: 'No formal education', key: 'Dependent on husband for all financial decisions. Trusts no one other than family due to fear of scams and fraud.', color: C.pink },
  { name: 'Mandachalam', age: 36, role: 'Craftsperson',        literacy: 'Mid-level educated',  key: 'From Kerala; uses GPay and PhonePe. Understands basic financial terms and is comfortable with digital transactions.', color: C.purple },
  { name: 'Chandan MS',  age: 18, role: 'Small Business Owner',literacy: 'Diploma',              key: 'Uses only PhonePe — "the only app I trust." Cannot understand basic financial jargon despite being a business owner.', color: C.green },
  { name: 'Sanjay Kumar',age: 55, role: 'Security Guard',      literacy: 'Mid-level educated',  key: 'From Bihar. Delegates all financial decisions to his daughter — trusts her education over his own judgement.', color: C.pink },
  { name: 'Deepam',      age: 36, role: 'Auto Driver',         literacy: 'Mid-level educated',  key: 'From Bangalore. Comfortable with digital tools — developed confidence through regular, long-term use of apps.', color: C.purple },
  { name: 'Prakash',     age: 40, role: 'Small Tea Shop Owner',literacy: 'Mid-level educated',  key: 'Trusts banks over apps for large transfers. Maintains a physical diary for daily expense tracking.', color: C.green },
]

function ParticipantCard({ p, delay }) {
  return (
    <StaggerItem style={{ flex: 1 }}>
      <div style={{
        flex: 1, border: `1.5px solid ${p.color}25`,
        borderRadius: '12px', padding: '1.5rem',
        background: `${p.color}06`,
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}>
        {/* Avatar placeholder */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: `${p.color}20`, border: `2px solid ${p.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1rem', color: p.color }}>
            {p.name[0]}
          </span>
        </div>

        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: '0 0 0.15rem' }}>
            {p.name}
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: p.color, margin: 0 }}>
            {p.age} · {p.role}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.55rem',
            letterSpacing: '0.1em', padding: '2px 8px',
            border: `1px solid ${C.border}`, borderRadius: '99px',
            color: C.muted, background: 'transparent',
          }}>{p.literacy}</span>
        </div>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.6, color: C.mid, margin: 0, flex: 1 }}>
          "{p.key}"
        </p>
      </div>
    </StaggerItem>
  )
}

// ─── 4. Findings Grid ─────────────────────────────────────
const FINDINGS = [
  { title: 'Lack of Awareness', body: 'Most participants were unaware of basic financial concepts such as interest rates or the importance of savings.', icon: '○' },
  { title: 'Third-Party Reliance', body: 'Several interviewees depend on family, friends, or informal agents to make financial decisions or use digital tools.', icon: '◎' },
  { title: 'Fear of Fraud', body: 'A persistent fear of being scammed discourages many from trying new financial technologies or platforms.', icon: '△' },
  { title: 'Distrust in Institutions', body: 'Banks and digital payment apps are often perceived as unreliable or complicated, leading to a preference for cash.', icon: '□' },
  { title: 'Preference for Cash', body: 'Physical cash is seen as more secure and tangible compared to digital money, especially among older individuals.', icon: '◇' },
  { title: 'Lack of Scam Awareness', body: 'Many participants were unaware of common scams such as phishing or OTP fraud, making them more vulnerable.', icon: '○' },
  { title: 'Overtrust in Intermediaries', body: 'Many blindly trust informal agents for financial advice, making them susceptible to fraud or misinformation.', icon: '◎' },
  { title: 'Community Influence', body: 'Financial decisions are often shaped by community practices, with little independent exploration of safer options.', icon: '△' },
  { title: 'Language Barrier', body: 'Many participants struggle to understand financial instructions or app interfaces presented in non-local languages.', icon: '□' },
  { title: 'Limited Adaptability', body: 'Despite interest in digital tools, most interviewees cited technical complexity as the key barrier to adoption.', icon: '◇' },
  { title: 'Fear of Technology', body: 'Participants expressed concerns about losing money or making irreversible mistakes while using digital platforms.', icon: '○' },
  { title: 'Financial Jargon Confusion', body: 'Terms like "EMI," "credit score," or "interest rates" were frequently cited as confusing, leading to avoidance.', icon: '◎' },
]

// ─── 5. Pre/Post Results Chart ────────────────────────────
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
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.ink, margin: 0 }}>
              {r.param}
            </p>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: '0.62rem',
              color: r.positive ? C.green : C.pink,
              letterSpacing: '0.08em',
            }}>{r.change}</span>
          </div>

          {/* Pre bar */}
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: C.muted, width: 24 }}>PRE</span>
              <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(r.pre / MAX) * 100}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: EASE }}
                  style={{ height: '100%', background: `${C.purple}60`, borderRadius: 4 }}
                />
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: C.purple, minWidth: 28 }}>{r.pre}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: C.muted, width: 24 }}>POST</span>
              <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${(r.post / MAX) * 100}%` } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: EASE }}
                  style={{ height: '100%', background: r.positive ? `${C.green}80` : `${C.pink}80`, borderRadius: 4 }}
                />
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: r.positive ? C.green : C.pink, minWidth: 28 }}>{r.post}</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Overall */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          marginTop: '0.5rem', padding: '1rem 1.25rem',
          background: `${C.purple}08`, border: `1.5px solid ${C.purple}25`,
          borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.ink, margin: 0 }}>
          Overall Improvement
        </p>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: C.purple }}>
          +12.59%
        </span>
      </motion.div>
    </div>
  )
}

// ─── 6. Workshop Segments Visual ──────────────────────────
const SEGMENTS = [
  { num: 1, title: 'Introduction',           desc: 'Outlined the agenda and set intent — ensuring participants understood the scope and purpose of the session.', color: C.purple },
  { num: 2, title: 'Ice-Breaking Activity',  desc: 'Pre-workshop Likert scale questionnaire with emoji cards to establish a baseline of financial literacy.', color: C.pink },
  { num: 3, title: 'Spot the Scam',          desc: 'Participants examined printed examples of fake websites, apps, SMS, and WhatsApp messages to test scam awareness.', color: C.green },
  { num: 4, title: 'Curated Educational Videos', desc: 'Financial literacy takeaways delivered through RBI\'s comic "Raju and the 40 Thieves" and curated video content.', color: C.purple },
  { num: 5, title: 'Spot the Scam (Follow-up)', desc: 'Revisited scam identification after gaining awareness — participants demonstrated significantly improved scam detection.', color: C.pink },
  { num: 6, title: 'Closure & Feedback',     desc: 'Post-workshop questionnaire, key takeaways, and distribution of a brochure with scam prevention tips and RBI QR code.', color: C.green },
]

// ─── 7. Stat Card ─────────────────────────────────────────
function StatCard({ stat, label, sub, color }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        padding: '1.75rem 1.5rem', borderRadius: '12px',
        border: `1.5px solid ${color}25`,
        background: `${color}08`,
        display: 'flex', flexDirection: 'column', gap: '0.4rem',
      }}
    >
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color, margin: 0, lineHeight: 1 }}>
        {stat}
      </p>
      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.ink, margin: 0 }}>
        {label}
      </p>
      {sub && <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.muted, margin: 0, lineHeight: 1.5 }}>{sub}</p>}
    </motion.div>
  )
}

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
    <div style={{ background: C.bg, minHeight: '100vh', color: C.ink }}>
      <ProgressBar />
      <Nav />
      <SidebarNav active={active} />

      {/* ─── HERO ─── */}
      <section style={{
        background: C.dark, color: C.inkLight,
        paddingTop: 'clamp(7rem,12vw,11rem)',
        paddingBottom: 'clamp(5rem,8vw,8rem)',
      }}>
        <Wrap>
          <MaskReveal delay={0}>
            <SectionTag color={C.pink}>Research · Social Design</SectionTag>
          </MaskReveal>
          <MaskReveal delay={0.1}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08,
              color: C.inkLight, margin: '0 0 1.75rem',
              maxWidth: '16ch',
            }}>
              Finance for<br />
              <span style={{ color: C.pink }}>Semi-Literate</span>{' '}
              Populations
            </h1>
          </MaskReveal>
          <MaskReveal delay={0.2}>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1rem,2vw,1.2rem)',
              lineHeight: 1.7, color: 'rgba(242,237,228,0.72)',
              maxWidth: '55ch', margin: '0 0 3rem',
            }}>
              A design research project investigating how semi-literate individuals in urban Bangalore
              navigate financial systems — and how they can be better equipped to recognise and
              avoid financial scams.
            </p>
          </MaskReveal>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { l: 'Team', v: 'Hiral · Raveena · Zeus' },
              { l: 'Type', v: 'Design Research' },
              { l: 'Institution', v: 'NID Bangalore' },
              { l: 'Focus', v: 'Financial Literacy & Scam Prevention' },
            ].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>{m.l}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.9rem', color: C.inkLight, margin: 0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ─── OVERVIEW ─── */}
      <section id="overview" style={{ ...PAD, background: C.bg }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.purple}>01 — Overview</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              The Problem Space
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.1rem)', lineHeight: 1.75, color: C.mid, maxWidth: '70ch', margin: '0 0 3rem' }}>
              India is in the midst of a digital financial revolution — yet a significant portion of its population
              remains financially vulnerable. Despite rapid adoption of UPI and digital payments, only <strong style={{ color: C.ink }}>27% of Indians
              are financially literate</strong>. Among semi-literate populations, the gap between digital tool availability
              and the ability to use them safely creates acute vulnerability to scams and fraud.
            </p>
          </Reveal>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
            <StatCard stat="27%" label="Financially Literate in India" sub="Only a quarter of the population understands basic financial concepts" color={C.purple} />
            <StatCard stat="16.7%" label="Students Understanding Finance" sub="Formal education failing to instill basic financial literacy" color={C.pink} />
            <StatCard stat="₹21,367Cr" label="Total Bank Fraud in H1 FY25" sub="Cases rose 27% year-on-year according to RBI data" color={C.green} />
            <StatCard stat="101%" label="Growth in Fraud Cases (2024)" sub="Digital payment fraud growing at an alarming rate" color={C.purple} />
          </div>

          {/* Research Phases */}
          <Reveal delay={0.15}>
            <Label>Conceptual Framework — 5 Research Phases</Label>
          </Reveal>
          <Reveal delay={0.2}>
            <ResearchPhaseDiagram />
          </Reveal>
        </Wrap>
      </section>

      {/* ─── CONTEXT ─── */}
      <section id="context" style={{ ...PAD, background: '#EFEFED' }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.pink}>02 — Problem Context</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              Literature Review
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.05rem)', lineHeight: 1.75, color: C.mid, maxWidth: '70ch', margin: '0 0 2.5rem' }}>
              Secondary research surfaced several intersecting structural and behavioural barriers — each
              compounding the vulnerability of semi-literate populations in urban India.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { title: 'Digital Payment Fraud', body: 'Payment fraud costs India over ₹1,000 crore annually. Card Not Present (CNP) fraud accounts for over 70% of global online fraud. 7 in 10 Indian frauds involve OTP sharing.', color: C.pink },
              { title: 'Digital Literacy Gap', body: 'Low digital literacy leaves users unable to distinguish legitimate platforms from fraudulent ones. Fake apps mimicking PhonePe and fabricated QR codes are pervasive.', color: C.purple },
              { title: 'Gender & Age Vulnerability', body: 'Gender dynamics significantly influence susceptibility. Women — especially in rural or semi-urban contexts — are more likely to rely on male intermediaries for financial decisions.', color: C.green },
              { title: 'Psychological Barriers', body: 'Fear of making irreversible mistakes, distrust of institutions, and anxiety around technology create compounding barriers to digital financial adoption.', color: C.pink },
              { title: 'Cultural & Linguistic Gaps', body: 'Financial content presented in technical or non-vernacular language excludes large segments of the population. Financial jargon itself becomes an exclusion mechanism.', color: C.purple },
              { title: 'Phishing & Social Engineering', body: 'Over 60% of fraud globally begins with phishing emails or messages. In India, fraudsters leverage fake bank calls and SMS designed to exploit trust in authority.', color: C.green },
            ].map((card, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <div style={{
                  flex: 1, border: `1.5px solid ${card.color}25`,
                  borderRadius: '12px', padding: '1.5rem',
                  background: C.bg, display: 'flex', flexDirection: 'column', gap: '0.6rem',
                }}>
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: card.color, marginBottom: '0.25rem' }} />
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{card.title}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{card.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Opportunities */}
          <Reveal>
            <div style={{
              padding: '2rem', borderRadius: '14px',
              border: `1.5px solid ${C.purple}30`,
              background: `${C.purple}08`,
            }}>
              <Label>Opportunities Identified</Label>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {['Money Management Skills', 'Fraud / Scam Awareness', 'Decoding Financial Jargon', 'Accessible Expense Tracking'].map(opp => (
                  <div key={opp} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.purple, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: C.ink }}>{opp}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Wrap>
      </section>

      {/* ─── METHODS ─── */}
      <section id="methods" style={{ ...PAD, background: C.bg }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.green}>03 — Research Methods</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              POEMS Framework
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.05rem)', lineHeight: 1.75, color: C.mid, maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              The POEMS method — People, Objects, Environments, Messages, Services — provided an
              observational framework to understand the five elements of the research context both
              independently and as an interrelated system.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <POEMSDiagram />
          </Reveal>

          <KeyInsight text="Semi-literate individuals are excluded from formal financial systems not just by lack of education, but by a systemic failure of tools, language, and messaging to meet them where they are. Trust, ease of use, and familiarity are the real adoption drivers." />

          {/* Research Questions Evolution */}
          <div style={{ marginTop: '3.5rem' }}>
            <Reveal>
              <Label>Evolution of Research Questions</Label>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', lineHeight: 1.75, color: C.mid, maxWidth: '68ch', margin: '0 0 2rem' }}>
                The team began with eight exploratory questions spanning expense tracking, gender dynamics,
                digital literacy, and trust in intermediaries — before distilling them into a single focused inquiry
                post field interviews.
              </p>
            </Reveal>

            <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                'How can financial management tools accommodate limited literacy & technological exposure of semi-literate women?',
                'How do cultural and social norms influence the adoption of expense tracking tools?',
                'How can expense tracking tools integrate with financial literacy to enhance habits?',
                'How do gender dynamics influence susceptibility to financial scams?',
                'How does digital literacy impact susceptibility to financial fraud?',
                'How does misplaced trust in informal agents increase the risk of scams?',
                'How does lack of understanding of digital financial tools contribute to fraud?',
                'How can expense tracking be designed for semi-literate urban individuals?',
              ].map((q, i) => (
                <StaggerItem key={i} style={{ flex: 1 }}>
                  <div style={{
                    flex: 1, border: `1.5px solid ${C.border}`,
                    borderRadius: '10px', padding: '1.1rem',
                    background: 'transparent', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                  }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: C.muted, flexShrink: 0, paddingTop: '2px' }}>Q{i + 1}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{q}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* Final RQ */}
            <Reveal>
              <div style={{
                padding: '2rem 2.25rem', borderRadius: '14px',
                border: `2px solid ${C.pink}40`,
                background: `${C.pink}06`,
              }}>
                <Label>Final Research Question</Label>
                <blockquote style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(1.2rem,2.5vw,1.6rem)',
                  fontStyle: 'italic', lineHeight: 1.55,
                  color: C.ink, margin: 0,
                }}>
                  "How can we effectively disseminate knowledge on avoiding financial scams to foster
                  better financial habits among semi-literate individuals in urban areas like Bangalore —
                  considering their current awareness and vulnerabilities?"
                </blockquote>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', color: C.muted, marginTop: '1rem', marginBottom: 0 }}>
                  Refined from 8 initial questions · Post on-ground interview analysis
                </p>
              </div>
            </Reveal>
          </div>
        </Wrap>
      </section>

      {/* ─── FIELDWORK ─── */}
      <section id="fieldwork" style={{ ...PAD, background: '#EFEFED' }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.purple}>04 — On-Ground Research</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              Field Interviews
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.05rem)', lineHeight: 1.75, color: C.mid, maxWidth: '70ch', margin: '0 0 1rem' }}>
              On-ground research was conducted across the Bangalore urban context — engaging directly
              with security guards, vegetable sellers, auto drivers, craftspersons, and small business
              owners. The team interviewed <strong style={{ color: C.ink }}>12 individuals in total</strong>, with 6 detailed profiles documented.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.15rem', color: C.muted, margin: '0 0 2.5rem' }}>
              "On-ground research was very heartwarming — we got to interact with diverse people
              and gathered many important insights for our ongoing research."
            </p>
          </Reveal>

          {/* Target Group */}
          <Reveal delay={0.05}>
            <div style={{
              padding: '1.5rem', borderRadius: '12px',
              border: `1.5px solid ${C.purple}25`, background: C.bg,
              marginBottom: '2rem',
              display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Target Group</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: 0 }}>
                  Security guards · Cleaning staff · Small business owners
                </p>
              </div>
              <div style={{ borderLeft: `1.5px solid ${C.border}`, paddingLeft: '2rem' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Age Range</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: 0 }}>18–50 years</p>
              </div>
              <div style={{ borderLeft: `1.5px solid ${C.border}`, paddingLeft: '2rem' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.muted, textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Education</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: 0 }}>Less or semi-literate</p>
              </div>
            </div>
          </Reveal>

          {/* Participant Cards */}
          <Label>Participant Profiles</Label>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
            {PARTICIPANTS.map((p, i) => <ParticipantCard key={i} p={p} />)}
          </StaggerGrid>

          {/* Interview Photos placeholder */}
          <Reveal>
            <Label>Field Documentation</Label>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div><ImgBox label="On-ground interview — Parvati & Mandachalam" aspect="75%" /><ScreenLabel>Field Interview Session 1</ScreenLabel></div>
            <div><ImgBox label="Interview with Chandan & Sanjay — NID vicinity" aspect="75%" /><ScreenLabel>Field Interview Session 2</ScreenLabel></div>
            <div><ImgBox label="Deepam & Prakash interview documentation" aspect="75%" /><ScreenLabel>Field Interview Session 3</ScreenLabel></div>
          </div>
        </Wrap>
      </section>

      {/* ─── INSIGHTS ─── */}
      <section id="insights" style={{ ...PAD, background: C.bg }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.pink}>05 — Insights</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, margin: '0 0 1rem', lineHeight: 1.15 }}>
              12 Interesting Findings
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.05rem)', lineHeight: 1.75, color: C.mid, maxWidth: '70ch', margin: '0 0 2.5rem' }}>
              Across 12 interviews, a consistent pattern emerged: the barriers to financial safety are
              not primarily cognitive, but structural — rooted in language, trust, access, and design failure.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
            {FINDINGS.map((f, i) => {
              const colors = [C.pink, C.purple, C.green]
              const col = colors[i % 3]
              return (
                <StaggerItem key={i} style={{ flex: 1 }}>
                  <div style={{
                    flex: 1, border: `1.5px solid ${col}22`,
                    borderRadius: '12px', padding: '1.4rem',
                    display: 'flex', flexDirection: 'column', gap: '0.6rem',
                    background: 'transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.1rem' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: col }}>{String(i + 1).padStart(2, '0')}</span>
                      <div style={{ flex: 1, height: 1, background: `${col}25` }} />
                    </div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{f.title}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.65, color: C.mid, margin: 0, flex: 1 }}>{f.body}</p>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerGrid>

          {/* Inferences Summary */}
          <Reveal>
            <Label>Inferences — 6 Contexts</Label>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: C.ink, margin: '0 0 1.5rem' }}>
              Structural Analysis Across Contexts
            </h3>
          </Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              { ctx: 'Demographic Context', icon: '◎', color: C.purple, points: ['Security guards, cleaning staff, small business owners', 'Age range: 18–50 years', 'Less or semi-literate with limited formal education'] },
              { ctx: 'Psychological Context', icon: '△', color: C.pink, points: ['Fear of technology — hesitation using digital financial tools', 'Fear of scams — constant worry about being cheated', 'Distrust of formal banking systems and institutions'] },
              { ctx: 'Behavioral Context', icon: '□', color: C.green, points: ['Reliance on third parties (family, friends, intermediaries)', 'Language barrier — struggles with non-vernacular content', 'Resistance to change driven more by communication gaps than adaptability'] },
              { ctx: 'Educational Context', icon: '○', color: C.purple, points: ['Limited understanding of savings, investments, interest rates', 'Difficulty interpreting financial jargon makes systems feel inaccessible', 'Formal education fails to bridge literacy–financial literacy gap'] },
              { ctx: 'Communication Context', icon: '◇', color: C.pink, points: ['Difficulty understanding financial materials in technical language', 'Preference for visual aids, vernacular language, easy instructions', 'Simplified, contextually relevant content is critical'] },
              { ctx: 'Socio-Cultural Context', icon: '◎', color: C.green, points: ['Financial behavior shaped by community norms and social networks', 'Sense of financial exclusion from mainstream systems', 'Community-endorsed intermediaries are trusted over institutions'] },
            ].map((ctx, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <div style={{
                  flex: 1, border: `1.5px solid ${ctx.color}25`,
                  borderRadius: '12px', padding: '1.5rem',
                  background: `${ctx.color}06`,
                  display: 'flex', flexDirection: 'column', gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: ctx.color, fontSize: '1rem' }}>{ctx.icon}</span>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.ink, margin: 0 }}>{ctx.ctx}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {ctx.points.map((pt, j) => (
                      <div key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: ctx.color, flexShrink: 0, marginTop: '0.4em' }} />
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{pt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Wrap>
      </section>

      {/* ─── WORKSHOP ─── */}
      <section id="workshop" style={{ ...PAD, background: C.dark, color: C.inkLight }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.green}>06 — Participatory Workshop</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.inkLight, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              Workshop Design
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.05rem)', lineHeight: 1.75, color: 'rgba(242,237,228,0.72)', maxWidth: '68ch', margin: '0 0 2.5rem' }}>
              A participatory design research workshop was conducted with NID cleaning and gardening
              staff — individuals directly representative of the target group. The workshop combined
              Likert-scale assessments, experiential scam identification activities, and curated educational
              content to measure knowledge change and build lasting awareness.
            </p>
          </Reveal>

          {/* Mission & Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <Reveal>
              <div style={{ border: `1.5px solid ${C.green}30`, borderRadius: '12px', padding: '1.75rem', background: `${C.green}08`, height: '100%' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.green, textTransform: 'uppercase', margin: '0 0 1rem' }}>Mission</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.inkLight, margin: '0 0 0.75rem', lineHeight: 1.4 }}>
                  To empower semi-literate individuals in urban areas to protect themselves from financial scams.
                </p>
                <ul style={{ margin: 0, padding: '0 0 0 1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {['Recognise common financial scams', 'Understand how to verify financial information', 'Build habits to avoid scams', 'Strengthen general financial habits (budgeting, saving)'].map(item => (
                    <li key={item} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.6, color: 'rgba(242,237,228,0.7)' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ border: `1.5px solid ${C.purple}30`, borderRadius: '12px', padding: '1.75rem', background: `${C.purple}08`, height: '100%' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.purple, textTransform: 'uppercase', margin: '0 0 1rem' }}>Vision</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.inkLight, margin: '0 0 0.75rem', lineHeight: 1.4 }}>
                  A financially aware and resilient community in Bangalore.
                </p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(242,237,228,0.7)', margin: 0 }}>
                  Where every individual, regardless of literacy level, has the skills and confidence to
                  make informed financial choices and protect themselves from exploitation in an
                  increasingly digital economy.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Participants */}
          <Reveal>
            <Label light>Workshop Participants — Demographic</Label>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            <Reveal>
              <div style={{ border: `1.5px solid ${C.borderDark}`, borderRadius: '12px', padding: '1.5rem', background: 'rgba(255,255,255,0.04)' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 1rem' }}>10 Participants — NID Staff</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    ['Geeta', 39, 'F', 'Cleaning Staff'],
                    ['Jamna', 38, 'F', 'Cleaning Staff'],
                    ['Pushpa', 28, 'F', 'Cleaning Staff'],
                    ['Shankar', 32, 'M', 'Cleaning Staff'],
                    ['Rangaswami', 20, 'M', 'Cleaning Staff'],
                    ['Pravin', 45, 'M', 'Cleaning Staff'],
                    ['Lakshmi', 38, 'F', 'Cleaning Staff'],
                    ['Haseena', 39, 'F', 'Cleaning Staff'],
                    ['Venkat Charpata', 33, 'M', 'Gardening Staff'],
                    ['Shivraj', 30, 'M', 'Gardening Staff'],
                  ].map(([name, age, gender, role]) => (
                    <div key={name} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.35rem 0', borderBottom: `1px solid ${C.borderDark}` }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: gender === 'F' ? `${C.pink}25` : `${C.purple}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: gender === 'F' ? C.pink : C.purple }}>{gender}</span>
                      </div>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.8rem', color: C.inkLight, flex: 1 }}>{name}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)' }}>{age}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ border: `1.5px solid ${C.borderDark}`, borderRadius: '12px', padding: '1.5rem', background: 'rgba(255,255,255,0.04)' }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>Gender Split</p>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: C.pink, margin: '0 0 0.2rem' }}>50%</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Women</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: C.purple, margin: '0 0 0.2rem' }}>50%</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Men</p>
                    </div>
                  </div>
                </div>
                <div style={{ border: `1.5px solid ${C.borderDark}`, borderRadius: '12px', padding: '1.5rem', background: 'rgba(255,255,255,0.04)' }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 0.75rem' }}>Age Distribution</p>
                  {[['20–30', '20%', 2, C.green], ['31–40', '70%', 7, C.purple], ['41–45', '10%', 1, C.pink]].map(([range, pct, n, color]) => (
                    <div key={range} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)', minWidth: 42 }}>{range}</span>
                      <div style={{ flex: 1, height: 6, background: C.borderDark, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: pct, height: '100%', background: color, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)', minWidth: 28 }}>{pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Workshop Segments */}
          <Reveal>
            <Label light>6 Workshop Segments</Label>
          </Reveal>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {SEGMENTS.map((seg, i) => (
              <StaggerItem key={i} style={{ flex: 1 }}>
                <div style={{
                  flex: 1, border: `1.5px solid ${seg.color}30`,
                  borderRadius: '12px', padding: '1.5rem',
                  background: `${seg.color}08`,
                  display: 'flex', flexDirection: 'column', gap: '0.6rem',
                }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${seg.color}20`, border: `1.5px solid ${seg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: seg.color }}>{seg.num}</span>
                    </div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.inkLight, margin: 0 }}>{seg.title}</p>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.65, color: 'rgba(242,237,228,0.65)', margin: 0 }}>{seg.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Workshop Photos */}
          <Reveal>
            <Label light>Workshop Documentation</Label>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div><ImgBox dark label="Introduction segment — agenda overview with participants" aspect="70%" /><ScreenLabel dark>Segment 1 — Introduction</ScreenLabel></div>
            <div><ImgBox dark label="Spot the Scam activity — printed examples of fraud" aspect="70%" /><ScreenLabel dark>Segment 3 — Spot the Scam</ScreenLabel></div>
            <div><ImgBox dark label="RBI comic 'Raju and the 40 Thieves' — awareness session" aspect="70%" /><ScreenLabel dark>Segment 4 — Education Videos</ScreenLabel></div>
            <div><ImgBox dark label="Follow-up scam identification and brochure distribution" aspect="70%" /><ScreenLabel dark>Segments 5 & 6 — Follow-up & Closure</ScreenLabel></div>
          </div>
        </Wrap>
      </section>

      {/* ─── ANALYSIS ─── */}
      <section id="analysis" style={{ ...PAD, background: C.bg }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.purple}>07 — Analysis</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              Pre & Post Workshop Results
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.05rem)', lineHeight: 1.75, color: C.mid, maxWidth: '70ch', margin: '0 0 2.5rem' }}>
              A Likert-scale methodology (1–5) assessed 4 parameters before and after the workshop.
              Each parameter was measured independently, scores averaged across 10 participants.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
            <div>
              <Reveal>
                <Label>Likert Score Comparison (1–5 Scale)</Label>
              </Reveal>
              <ResultsChart />
            </div>
            <div>
              <Reveal delay={0.1}>
                <Label>Statistical Analysis</Label>
              </Reveal>
              <Reveal delay={0.15}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Normality Test */}
                  <div style={{ border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '1.5rem', background: `${C.purple}04` }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: C.purple, textTransform: 'uppercase', margin: '0 0 0.75rem' }}>Shapiro-Wilk Normality Test</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', lineHeight: 1.65, color: C.mid, margin: '0 0 0.75rem' }}>
                      Both pre and post-test scores had p-values greater than 0.05, confirming that the
                      data does not significantly deviate from normality — validating the use of parametric tests.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                      <div>
                        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.muted, margin: '0 0 0.2rem' }}>Pre-Test</p>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.ink, margin: 0 }}>W = 0.887, p = 0.368</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.muted, margin: '0 0 0.2rem' }}>Post-Test</p>
                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.ink, margin: 0 }}>W = 0.983, p = 0.920</p>
                      </div>
                    </div>
                  </div>

                  {/* Paired T-Test */}
                  <div style={{ border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '1.5rem', background: `${C.pink}04` }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: C.pink, textTransform: 'uppercase', margin: '0 0 0.75rem' }}>Paired T-Test Result</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: C.ink, margin: '0 0 0.5rem' }}>p = 0.162</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', lineHeight: 1.65, color: C.mid, margin: 0 }}>
                      The p-value (0.162) exceeds the 0.05 threshold, meaning the null hypothesis holds —
                      the workshop did not produce <em>statistically significant</em> improvement. However,
                      the observed positive percentage changes are real and meaningful at a descriptive level.
                    </p>
                  </div>

                  {/* Null hypothesis reasons */}
                  <div style={{ border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '1.5rem' }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', margin: '0 0 0.75rem' }}>Possible Reasons for Null Hypothesis</p>
                    {[
                      'Sample size constraint — pilot-scale with 10 participants',
                      'Workshop duration — kept short to respect participants\' time constraints',
                      'External factors — potential distraction or peer influence during responses',
                    ].map((reason, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.muted, flexShrink: 0, marginTop: '0.45em' }} />
                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', lineHeight: 1.6, color: C.mid, margin: 0 }}>{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Descriptive vs Inferential */}
          <Reveal>
            <div style={{
              padding: '2rem 2.25rem', borderRadius: '14px',
              border: `1.5px solid ${C.purple}30`,
              background: `${C.purple}06`,
            }}>
              <Label>Inferential vs. Descriptive Statistics</Label>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', lineHeight: 1.75, color: C.mid, margin: '0 0 1rem', maxWidth: '70ch' }}>
                While participants showed an observed increase in scores, the changes may not be large enough
                or consistent enough across participants to reach statistical significance. The data provides
                strong <em>descriptive</em> evidence of positive impact, but insufficient <em>inferential</em> evidence
                to attribute the changes solely to the workshop rather than chance.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.1rem', color: C.ink, margin: 0 }}>
                "This does not imply the workshop was ineffective — it implies we need a larger
                sample and more sessions to generate statistical confidence."
              </p>
            </div>
          </Reveal>
        </Wrap>
      </section>

      {/* ─── RECOMMENDATIONS ─── */}
      <section id="recommendations" style={{ ...PAD, background: '#EFEFED' }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.green}>08 — Recommendations</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              5 Design & Policy Recommendations
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.95rem,1.6vw,1.05rem)', lineHeight: 1.75, color: C.mid, maxWidth: '70ch', margin: '0 0 2.5rem' }}>
              Based on research findings and workshop outcomes, the team developed systemic recommendations
              spanning peer education, government collaboration, platform regulation, content accessibility,
              and infrastructure building.
            </p>
          </Reveal>

          <StaggerGrid style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                num: '01', title: 'Community Ambassadors & Peer Educators', color: C.purple,
                body: 'Train community leaders and trusted figures to act as financial safety ambassadors. Peer-to-peer learning builds trust and improves accessibility for semi-literate individuals. Leverage short-format social media (Reels, YouTube Shorts) to reach audiences where they already are.',
              },
              {
                num: '02', title: 'Government & NGO Collaboration', color: C.pink,
                body: 'Fear is one of the main reasons people don\'t approach cyber cells after being scammed. Formation of NGOs that act as intermediaries between scam victims and enforcement bodies (police, RBI) can significantly lower the barrier to reporting and seeking redress.',
              },
              {
                num: '03', title: 'Stricter App Store Regulations', color: C.green,
                body: 'With app stores flooded with applications, stricter regulations must govern what financial data apps can request from users at the onboarding stage. Transparency around data usage should be mandated, not optional.',
              },
              {
                num: '04', title: 'More Accessible Content on Financial Scams', color: C.purple,
                body: 'Content like the RBI\'s "Raju and the 40 Thieves" must be localised and made vernacularly inclusive. Financial literacy content should be designed for oral and visual consumption — not reading — to reach the semi-literate population effectively.',
              },
              {
                num: '05', title: 'Centralised Scam Database & Reward-Based Reporting', color: C.pink,
                body: 'A centralized, user-friendly database of known scams, fake apps, and phishing sites with real-time updates. Pair this with a reward-based reporting system that incentivises vigilance — monetary rewards, discounts, or community recognition — with guaranteed anonymity for whistleblowers.',
              },
            ].map((rec, i) => (
              <StaggerItem key={i}>
                <div style={{
                  border: `1.5px solid ${rec.color}25`,
                  borderRadius: '12px', padding: '1.75rem',
                  background: C.bg,
                  display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '10px',
                    background: `${rec.color}15`, border: `1.5px solid ${rec.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: rec.color }}>{rec.num}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: C.ink, margin: '0 0 0.5rem' }}>{rec.title}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', lineHeight: 1.7, color: C.mid, margin: 0 }}>{rec.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Wrap>
      </section>

      {/* ─── REFLECTIONS ─── */}
      <section id="reflections" style={{ ...PAD, background: C.dark, color: C.inkLight }}>
        <Wrap>
          <Reveal>
            <SectionTag color={C.pink}>09 — Reflections</SectionTag>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.inkLight, margin: '0 0 1.5rem', lineHeight: 1.15 }}>
              What the Research Taught Us
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <Reveal>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: C.inkLight, margin: '0 0 0.75rem' }}>
                  The gap is structural, not cognitive
                </p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(242,237,228,0.7)', margin: 0 }}>
                  Our participants were intelligent, experienced, and resourceful. Their vulnerability to financial
                  fraud is not a cognitive failing — it is the result of systems that were never designed for them.
                  Every interface, every financial term, every UPI error message assumes a level of literacy and
                  context that most users simply don't have.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: C.inkLight, margin: '0 0 0.75rem' }}>
                  Trust is the real design material
                </p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(242,237,228,0.7)', margin: 0 }}>
                  Mandachalam uses GPay because he trusts it. Parvati trusts only her husband. Prakash trusts
                  a physical notebook over an app. Chandan trusts only PhonePe. Trust — not features or UX
                  patterns — is the primary driver of adoption in this population. Any intervention that ignores
                  this will fail.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: C.inkLight, margin: '0 0 0.75rem' }}>
                  Participatory methods are non-negotiable
                </p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(242,237,228,0.7)', margin: 0 }}>
                  The POEMS framework, on-ground interviews, and the workshop itself revealed insights that
                  no desk research could. Co-presence — sitting beside Parvati at her vegetable stall, or
                  interviewing Sanjay during his shift — produced empathy that directly shaped our research
                  question and our recommendations.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: C.inkLight, margin: '0 0 0.75rem' }}>
                  Statistical limits are research lessons
                </p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(242,237,228,0.7)', margin: 0 }}>
                  The null hypothesis result from our Paired T-Test was humbling and informative. A 12.59%
                  overall improvement across 4 parameters in a single 90-minute session is meaningful — but
                  not statistically significant with 10 participants. This taught us the limits of pilot-scale
                  interventions and the need for longitudinal, community-embedded programs.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Closing Quote */}
          <Reveal>
            <div style={{ borderTop: `1.5px solid ${C.borderDark}`, paddingTop: '2.5rem' }}>
              <blockquote style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.4rem,2.8vw,2rem)', fontStyle: 'italic',
                lineHeight: 1.55, color: C.inkLight, margin: '0 0 1.5rem',
                maxWidth: '26ch',
              }}>
                "Designing for the margins doesn't mean designing differently — it means designing
                more honestly."
              </blockquote>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)' }}>
                Finance for Semi/Less Literate — Group 2 · NID Bangalore
              </p>
            </div>
          </Reveal>
        </Wrap>
      </section>

      {/* ─── NEXT PROJECT ─── */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem', background: C.bg }}>
        <Wrap>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, margin: '0 0 0.4rem' }}>Next Project</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: C.ink, margin: 0 }}>Spectra — Data Viz & Experience</p>
            </div>
            <a href="/work/study-buddy" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              fontFamily: "'Space Mono', monospace", fontSize: '0.7rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: C.ink, textDecoration: 'none',
              border: `1.5px solid ${C.border}`, borderRadius: '99px',
              padding: '0.65rem 1.25rem',
              transition: 'border-color 0.2s',
            }}>← Study Buddy</a>
          </div>
        </Wrap>
      </section>

      <Footer />
    </div>
  )
}
