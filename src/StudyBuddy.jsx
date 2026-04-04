import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
// Accent colours derived from Study Buddy project card gradient:
// from-[#061528] via-[#0f2d52] to-[#1b4a8a]
const C = {
  // Light page backgrounds
  page:    '#F4F6FA',
  surface: '#EAECF2',
  card:    '#F7F9FD',

  // Neumorphic shadows
  neu:     '6px 6px 18px rgba(0,0,0,0.08), -4px -4px 12px rgba(255,255,255,0.88)',
  neuSm:   '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 7px rgba(255,255,255,0.9)',

  // Documentation accent — black
  accent:  '#1A1A1A',
  accentMid: '#333',
  accentDim: 'rgba(0,0,0,0.05)',
  accentBorder: 'rgba(0,0,0,0.1)',

  // Documentation accent — black
  blue:    '#1A1A1A',
  pink:    '#1A1A1A',

  // FigJam / App diagram colours
  diagramBlue:   '#90CAF9',
  diagramPink:   '#F48FB1',
  diagramGreen:  '#A5D6A7',
  diagramYellow: '#FFF176',
  diagramPurple: '#CE93D8',

  // Aliases for diagram code that still references C.green / C.yellow
  green:   '#A5D6A7',
  yellow:  '#FFF176',

  // Dark sections (hero, reflections)
  dark:    '#061528',
  heroGrad: 'linear-gradient(145deg,#061528 0%,#0f2d52 55%,#1b4a8a 100%)',
  darkInk: '#F2EDE4',
  darkMid: 'rgba(242,237,228,0.65)',
  darkMuted: 'rgba(242,237,228,0.38)',
  white:   '#FFFFFF',

  // Light-section typography
  bg:      '#F4F6FA',
  ink:     '#0B1A2E',
  mid:     '#3E5270',
  muted:   '#7A8A9E',

  // Borders
  border:  'rgba(0,0,0,0.08)',
  borderDark: 'rgba(255,255,255,0.07)',
}

const EASE = [0.22, 1, 0.36, 1]

// ─── Sidebar Sections ────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'systems',       label: 'Systems' },
  { id: 'research',      label: 'Research' },
  { id: 'define',        label: 'Define' },
  { id: 'personas',      label: 'Personas' },
  { id: 'design-system', label: 'Design' },
  { id: 'features',      label: 'Features' },
  { id: 'accessibility', label: 'Access.' },
  { id: 'reflections',   label: 'Reflect.' },
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
  const col = color || C.blue
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
      position: 'relative',
      width: '100%',
      paddingBottom: aspect,
      background: bg,
      border,
      borderRadius: '12px',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={dark ? 'rgba(255,255,255,0.3)' : C.muted} strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke={dark ? 'rgba(255,255,255,0.3)' : C.muted} strokeWidth="1.5" />
          <path d="M3 15l5-5 4 4 3-3 6 6" stroke={dark ? 'rgba(255,255,255,0.3)' : C.muted} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          color: dark ? 'rgba(255,255,255,0.35)' : C.muted,
          textAlign: 'center',
          maxWidth: '220px',
          lineHeight: 1.5,
        }}>{label}</span>
      </div>
    </div>
  )
}

// ─── Screen Annotation Label ─────────────────────────────
function ScreenLabel({ children, dark = false }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.55rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,0.45)' : C.muted,
      textAlign: 'center',
      marginTop: '0.75rem',
    }}>{children}</div>
  )
}

// ─── HowHelpful annotation ────────────────────────────────
function HowHelpful({ text }) {
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.62rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: C.blue,
        textDecoration: 'underline',
        marginBottom: '0.5rem',
      }}>
        How was this helpful?
      </p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ color: C.blue, fontSize: '0.9rem', flexShrink: 0 }}>→</span>
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
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
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

// ─── Neumorphic Card ─────────────────────────────────────
function NeuCard({ children, style = {}, dark = false }) {
  if (dark) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
        boxShadow: '6px 6px 18px rgba(0,0,0,0.4), -3px -3px 10px rgba(255,255,255,0.04)',
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

// ─── Sidebar Nav ─────────────────────────────────────────
function SidebarNav({ active }) {
  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div style={{
      position: 'fixed',
      left: 'clamp(10px, 1.5vw, 22px)',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {NAV_SECTIONS.map(sec => {
        const isActive = active === sec.id
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            <motion.div
              animate={{
                width: isActive ? 3 : 1.5,
                height: isActive ? 32 : 24,
                background: isActive ? C.accent : C.border,
                borderRadius: 2,
              }}
              transition={{ duration: 0.3 }}
              style={{ flexShrink: 0 }}
            />
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.58rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isActive ? C.accent : C.muted,
              transition: 'color 0.25s',
              whiteSpace: 'nowrap',
            }}>
              {sec.label}
            </span>
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

// ─── 1. Actor Map ─────────────────────────────────────────
function ActorMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const primaryActors = [
    { label: 'Students',         angle: -90 },
    { label: 'Teachers',         angle: 0 },
    { label: 'Parents',          angle: 90 },
    { label: 'Education\nBoards', angle: 180 },
  ]
  const secondaryActors = [
    { label: 'EdTech',            angle: -60 },
    { label: 'Coaching\nCenters', angle: -10 },
    { label: 'Employers',         angle: 50 },
    { label: 'Tutors',            angle: 110 },
    { label: 'Curriculum\nDesigners', angle: 160 },
    { label: 'Libraries',         angle: 210 },
  ]
  const tertiaryActors = [
    { label: 'NGOs',           angle: -75 },
    { label: 'Media',          angle: -30 },
    { label: 'Activists',      angle: 15 },
    { label: 'Entrepreneurs',  angle: 60 },
    { label: 'Government',     angle: 110 },
    { label: 'Researchers',    angle: 155 },
    { label: 'Communities',    angle: 200 },
    { label: 'Employers',      angle: 245 },
  ]

  function toXY(angleDeg, r) {
    const a = (angleDeg * Math.PI) / 180
    return { x: 300 + r * Math.cos(a), y: 300 + r * Math.sin(a) }
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 600 600" style={{ width: '100%', overflow: 'visible' }}>
        {/* Guide rings */}
        {[110, 190, 258].map(r => (
          <circle key={r} cx={300} cy={300} r={r}
            fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="4 6" opacity={0.5} />
        ))}

        {/* Lines to primary */}
        {primaryActors.map((a, i) => {
          const p = toXY(a.angle, 110)
          return (
            <motion.line key={i} x1={300} y1={300} x2={p.x} y2={p.y}
              stroke={C.diagramYellow} strokeWidth={1.5} opacity={0.5}
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: EASE }}
            />
          )
        })}

        {/* Lines to secondary */}
        {secondaryActors.map((a, i) => {
          const p = toXY(a.angle, 190)
          return (
            <motion.line key={i} x1={300} y1={300} x2={p.x} y2={p.y}
              stroke={C.diagramPink} strokeWidth={1} opacity={0.35}
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.04, ease: EASE }}
            />
          )
        })}

        {/* Lines to tertiary */}
        {tertiaryActors.map((a, i) => {
          const p = toXY(a.angle, 258)
          return (
            <motion.line key={i} x1={300} y1={300} x2={p.x} y2={p.y}
              stroke={C.diagramGreen} strokeWidth={0.8} opacity={0.3}
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.03, ease: EASE }}
            />
          )
        })}

        {/* Tertiary nodes — FigJam green */}
        {tertiaryActors.map((a, i) => {
          const p = toXY(a.angle, 258)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.04, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={26} fill={C.diagramGreen} />
              {a.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y + (li - (a.label.split('\n').length - 1) / 2) * 10}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={8} fill={C.ink} fontFamily="'Space Mono', monospace"
                >{line}</text>
              ))}
            </motion.g>
          )
        })}

        {/* Secondary nodes — FigJam pink */}
        {secondaryActors.map((a, i) => {
          const p = toXY(a.angle, 190)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.05, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={30} fill={C.diagramPink} />
              {a.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y + (li - (a.label.split('\n').length - 1) / 2) * 10}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={8} fill={C.ink} fontFamily="'Space Mono', monospace"
                >{line}</text>
              ))}
            </motion.g>
          )
        })}

        {/* Primary nodes — FigJam yellow */}
        {primaryActors.map((a, i) => {
          const p = toXY(a.angle, 110)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={38} fill={C.diagramYellow} />
              {a.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y + (li - (a.label.split('\n').length - 1) / 2) * 11}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fill={C.ink} fontFamily="'Space Mono', monospace" fontWeight="500"
                >{line}</text>
              ))}
            </motion.g>
          )
        })}

        {/* Center node — FigJam blue */}
        <motion.g initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <circle cx={300} cy={300} r={56} fill={C.diagramBlue} />
          <text x={300} y={295} textAnchor="middle" dominantBaseline="middle"
            fontSize={8.5} fill={C.ink} fontFamily="'Space Mono', monospace" fontWeight="500"
          >EDUCATION</text>
          <text x={300} y={309} textAnchor="middle" dominantBaseline="middle"
            fontSize={8.5} fill={C.ink} fontFamily="'Space Mono', monospace" fontWeight="500"
          >SYSTEM</text>
        </motion.g>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
        {[
          { color: C.diagramYellow, label: 'Primary' },
          { color: C.diagramPink,   label: 'Secondary' },
          { color: C.diagramGreen,  label: 'Tertiary' },
          { color: C.diagramBlue,   label: 'Center' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', color: C.mid }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. Subsystems Map ────────────────────────────────────
function SubsystemsMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const systems = [
    { label: 'Financial\n& Economic',      sub: 'Funding · Fees',     angle: -90 },
    { label: 'Cultural\n& Social',          sub: 'Norms · Values',     angle: -45 },
    { label: 'Alternative\n& Informal',     sub: 'Non-formal · NGOs',  angle: 0 },
    { label: 'Research\n& Innovation',      sub: 'Academia · R&D',     angle: 45 },
    { label: 'Assessment\n& Examination',   sub: 'Tests · Boards',     angle: 90 },
    { label: 'Infrastructure\n& Resources', sub: 'Schools · Tech',     angle: 135 },
    { label: 'Regulatory\n& Governance',    sub: 'Policy · Law',       angle: 180 },
    { label: 'Employment',                  sub: 'Jobs · Industry',    angle: 225 },
  ]

  function toXY(angleDeg, r) {
    const a = (angleDeg * Math.PI) / 180
    return { x: 300 + r * Math.cos(a), y: 300 + r * Math.sin(a) }
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 600 600" style={{ width: '100%', overflow: 'visible' }}>
        <circle cx={300} cy={300} r={215}
          fill="none" stroke={C.border} strokeWidth={1.2} strokeDasharray="6 8" opacity={0.5} />

        {systems.map((s, i) => {
          const p = toXY(s.angle, 215)
          return (
            <motion.line key={i} x1={300} y1={300} x2={p.x} y2={p.y}
              stroke={C.diagramBlue} strokeWidth={1} opacity={0.4}
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
            />
          )
        })}

        {systems.map((s, i) => {
          const p = toXY(s.angle, 215)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.07, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={46} fill={C.diagramBlue} />
              {s.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y - 7 + (li - (s.label.split('\n').length - 1) / 2) * 12}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={8.5} fill={C.ink} fontFamily="'Space Mono', monospace" fontWeight="500"
                >{line}</text>
              ))}
              <text x={p.x} y={p.y + 18} textAnchor="middle" dominantBaseline="middle"
                fontSize={7} fill={C.mid} fontFamily="'Space Mono', monospace"
              >{s.sub}</text>
            </motion.g>
          )
        })}

        <motion.g initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <circle cx={300} cy={300} r={62} fill={C.ink} />
          <text x={300} y={293} textAnchor="middle" fontSize={8} fill="white"
            fontFamily="'Space Mono', monospace" fontWeight="500">FORMAL</text>
          <text x={300} y={306} textAnchor="middle" fontSize={8} fill="white"
            fontFamily="'Space Mono', monospace" fontWeight="500">EDUCATION</text>
          <text x={300} y={319} textAnchor="middle" fontSize={7.5} fill="rgba(255,255,255,0.65)"
            fontFamily="'Space Mono', monospace">SYSTEM</text>
        </motion.g>
      </svg>
    </div>
  )
}

// ─── 3. Empathy Map ───────────────────────────────────────
const EMPATHY_DATA = [
  {
    key: 'says', label: 'Says', color: '#1A5276', pale: 'rgba(26,82,118,0.06)', textColor: '#1A5276',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    items: [
      '"I want to do well, but I lose focus so easily."',
      '"If studying felt like a game, I\'d be more consistent."',
      '"I\'ll start tomorrow… or maybe the day after."',
      '"I wish something reminded me and kept me on track."',
    ],
  },
  {
    key: 'does', label: 'Does', color: '#1A5276', pale: 'rgba(26,82,118,0.04)', textColor: '#1A5276',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    items: [
      'Starts sessions but gets distracted midway',
      'Uses productivity tools but forgets to stick to them',
      'Completes assignments last-minute under pressure',
      'Tries different study methods but struggles with consistency',
    ],
  },
  {
    key: 'thinks', label: 'Thinks', color: '#1A5276', pale: 'rgba(26,82,118,0.06)', textColor: '#1A5276',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9.5 2C7 2 5 4 5 6.5c0 .8.2 1.6.6 2.2C4.2 9.4 3 10.9 3 12.7c0 1.5.8 2.8 2 3.5v.3A2.5 2.5 0 007.5 19H9v1.5a1.5 1.5 0 003 0V19h2.5a2.5 2.5 0 002.5-2.5v-.3c1.2-.7 2-2 2-3.5 0-1.8-1.2-3.3-2.6-4C16.8 8.1 17 7.3 17 6.5 17 4 15 2 12.5 2c-.8 0-1.6.2-2.3.6A4.6 4.6 0 009.5 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 7v5M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    items: [
      '"I know I need to study, but everything else seems more interesting."',
      '"I always start strong, but then I lose motivation."',
      '"I enjoy learning, but only when it\'s fun or interactive."',
      '"If I stay consistent, I can improve and make my parents happy."',
    ],
  },
  {
    key: 'feels', label: 'Feels', color: '#1A5276', pale: 'rgba(26,82,118,0.04)', textColor: '#1A5276',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
    items: [
      'Frustrated when procrastinating and falling behind',
      'Excited when learning feels interactive and rewarding',
      'Proud when maintaining a streak and seeing progress',
      'Overwhelmed when large tasks feel unmanageable',
    ],
  },
]

function EmpathyMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '3px',
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {EMPATHY_DATA.map((q, i) => (
        <motion.div key={q.key}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease: EASE }}
          style={{
            background: q.pale,
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            minHeight: '240px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: q.textColor }}>
            {q.icon}
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1rem',
              fontWeight: 500,
              color: q.textColor,
            }}>{q.label}</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.items.map((item, j) => (
              <li key={j} style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                color: q.textColor,
                lineHeight: 1.5,
                paddingLeft: '14px',
                position: 'relative',
                opacity: 0.9,
              }}>
                <span style={{
                  position: 'absolute', left: 0, top: '0.5em',
                  width: 5, height: 5, borderRadius: '50%',
                  background: q.color, display: 'block',
                }} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  )
}

// ─── 4. IA Diagram ────────────────────────────────────────
const IA_TREE = [
  {
    label: 'Home\nDashboard', color: C.blue,
    children: ["Today's Plan", 'Quick Start', 'Streak Status'],
  },
  {
    label: 'Focus\nSessions', color: C.pink,
    children: ['Pomodoro Timer', 'Focus Settings', 'Break Mode', 'Session Log'],
  },
  {
    label: 'Scan and\nMemorise', color: C.ink,
    children: ['Scan Notes', 'AI Video', 'Mnemonics', 'Review Queue'],
  },
  {
    label: 'Plan\nMy Day', color: C.pink,
    children: ['Activity Log', 'Daily Routine', 'Rate Activities', 'Calendar'],
  },
  {
    label: 'Profile\n& Stats', color: C.dark,
    children: ['Achievements', 'Streaks', 'Analytics', 'History'],
  },
]

function IADiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
      <div style={{ minWidth: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              background: C.blue, color: 'white',
              padding: '12px 28px', borderRadius: '10px',
              fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.95rem',
              letterSpacing: '-0.01em',
            }}
          >Study Buddy</motion.div>
        </div>

        <div style={{ position: 'relative', height: '24px', marginBottom: 0 }}>
          <motion.div
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            style={{
              position: 'absolute',
              top: '50%', left: `${100 / (IA_TREE.length * 2)}%`, right: `${100 / (IA_TREE.length * 2)}%`,
              height: '2px', background: C.border,
              transformOrigin: 'left center',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {IA_TREE.map((_, i) => (
              <motion.div key={i}
                initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.05, ease: EASE }}
                style={{ width: '2px', height: '24px', background: C.border, transformOrigin: 'top center' }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px', alignItems: 'flex-start' }}>
          {IA_TREE.map((branch, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.07, ease: EASE }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{
                border: `1.5px solid ${branch.color}`,
                borderRadius: '8px',
                padding: '10px 8px',
                textAlign: 'center',
                width: '100%',
                background: 'transparent',
              }}>
                {branch.label.split('\n').map((l, li) => (
                  <div key={li} style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: branch.color,
                    lineHeight: 1.3,
                  }}>{l}</div>
                ))}
              </div>

              <div style={{ width: '2px', height: '12px', background: branch.color + '40' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                {branch.children.map((child, j) => (
                  <motion.div key={j}
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.07 + j * 0.04 }}
                    style={{
                      background: C.bg,
                      border: `1px solid ${C.border}`,
                      borderRadius: '6px',
                      padding: '6px 8px',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.55rem',
                      letterSpacing: '0.05em',
                      color: C.mid,
                      textAlign: 'center',
                    }}
                  >{child}</motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 5. Behavioural Cycle — Flower Shape ─────────────────
function BehaviouralCycle() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  // ViewBox: 0 0 420 480
  // Center: (210, 220)
  const cx = 210, cy = 220

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <svg viewBox="0 0 420 480" style={{ width: '100%', maxWidth: 360, overflow: 'visible' }}>
        <defs>
          <marker id="arrowPink" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={C.ink} />
          </marker>
        </defs>

        {/* Petals — pink ellipses at N/E/S/W */}
        {/* Top petal */}
        <motion.ellipse cx={cx} cy={cy - 74} rx={52} ry={72}
          fill={C.diagramPink} opacity={0.9}
          initial={{ opacity: 0, scaleY: 0 }} animate={inView ? { opacity: 0.85, scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
        />
        {/* Right petal */}
        <motion.ellipse cx={cx + 74} cy={cy} rx={72} ry={52}
          fill={C.diagramPink} opacity={0.9}
          initial={{ opacity: 0, scaleX: 0 }} animate={inView ? { opacity: 0.85, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
        />
        {/* Bottom petal */}
        <motion.ellipse cx={cx} cy={cy + 74} rx={52} ry={72}
          fill={C.diagramPink} opacity={0.9}
          initial={{ opacity: 0, scaleY: 0 }} animate={inView ? { opacity: 0.85, scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center top' }}
        />
        {/* Left petal */}
        <motion.ellipse cx={cx - 74} cy={cy} rx={72} ry={52}
          fill={C.diagramPink} opacity={0.9}
          initial={{ opacity: 0, scaleX: 0 }} animate={inView ? { opacity: 0.85, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'right center' }}
        />

        {/* Green stem */}
        <motion.line x1={cx} y1={cy + 148} x2={cx} y2={460}
          stroke={C.green} strokeWidth={8} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        />

        {/* Clockwise arc arrows between nodes */}
        {/* Top → Right */}
        <motion.path
          d={`M ${cx + 38} ${cy - 120} Q ${cx + 120} ${cy - 120} ${cx + 120} ${cy - 38}`}
          fill="none" stroke={C.dark} strokeWidth={1.5} opacity={0.5}
          markerEnd="url(#arrowPink)"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
        />
        {/* Right → Bottom */}
        <motion.path
          d={`M ${cx + 120} ${cy + 38} Q ${cx + 120} ${cy + 120} ${cx + 38} ${cy + 120}`}
          fill="none" stroke={C.dark} strokeWidth={1.5} opacity={0.5}
          markerEnd="url(#arrowPink)"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
        />
        {/* Bottom → Left */}
        <motion.path
          d={`M ${cx - 38} ${cy + 120} Q ${cx - 120} ${cy + 120} ${cx - 120} ${cy + 38}`}
          fill="none" stroke={C.dark} strokeWidth={1.5} opacity={0.5}
          markerEnd="url(#arrowPink)"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
        />
        {/* Left → Top */}
        <motion.path
          d={`M ${cx - 120} ${cy - 38} Q ${cx - 120} ${cy - 120} ${cx - 38} ${cy - 120}`}
          fill="none" stroke={C.dark} strokeWidth={1.5} opacity={0.5}
          markerEnd="url(#arrowPink)"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.0, ease: EASE }}
        />

        {/* Center yellow circle */}
        <motion.circle cx={cx} cy={cy} r={56}
          fill={C.yellow}
          initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        {/* Center face */}
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.7 }}>
          <circle cx={cx - 12} cy={cy - 8} r={3.5} fill={C.dark} />
          <circle cx={cx + 12} cy={cy - 8} r={3.5} fill={C.dark} />
          <path d={`M ${cx - 14} ${cy + 12} Q ${cx} ${cy + 4} ${cx + 14} ${cy + 12}`}
            fill="none" stroke={C.dark} strokeWidth={2.5} strokeLinecap="round" />
        </motion.g>

        {/* Dark node circles at N/E/S/W */}
        {[
          { lx: cx, ly: cy - 148, label: 'Demotivated\nFeeling' },
          { lx: cx + 148, ly: cy, label: 'Procrastination\n& Low Energy' },
          { lx: cx, ly: cy + 148, label: 'Decrease in Activity\n& Neglect' },
          { lx: cx - 148, ly: cy, label: 'Increased\nGuilt' },
        ].map((node, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: EASE }}
          >
            <circle cx={node.lx} cy={node.ly} r={34}
              fill={C.dark} opacity={0.9} />
            {node.label.split('\n').map((line, li) => (
              <text key={li}
                x={node.lx}
                y={node.ly + (li - (node.label.split('\n').length - 1) / 2) * 11}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={7} fill="white" fontFamily="'Space Mono', monospace"
              >{line}</text>
            ))}
          </motion.g>
        ))}
      </svg>

      {/* Right annotation */}
      <div style={{ maxWidth: 220 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          color: C.ink,
          lineHeight: 1.2,
          marginBottom: '1rem',
        }}>
          "One's academic life shouldn't feel grey"
        </p>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.82rem',
          lineHeight: 1.65,
          color: C.mid,
        }}>
          <strong style={{ color: C.ink }}>Behavioural Activation</strong> is a means by which one can{' '}
          <strong style={{ color: C.ink }}>prevent</strong> themselves from falling into this{' '}
          <em style={{ color: C.ink }}>vicious cycle</em>.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTIONS
// ═══════════════════════════════════════════════════════════

// ─── Hero / Overview ──────────────────────────────────────
function HeroSection() {
  return (
    <section id="overview" style={{ background: C.heroGrad, paddingTop: 'clamp(7rem,12vw,11rem)', paddingBottom: 'clamp(5rem,8vw,8rem)' }}>
      <Wrap>
        <MaskReveal delay={0}>
          <span style={{
            display: 'inline-block',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: C.darkMuted,
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem',
          }}>Mobile App · UX Design · Systems Thinking</span>
        </MaskReveal>
        <MaskReveal delay={0.1}>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 500,
            fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08,
            color: C.darkInk, margin: '0 0 1.75rem', maxWidth: '18ch',
          }}>
            Study Buddy
          </h1>
        </MaskReveal>
        <MaskReveal delay={0.2}>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1rem,2vw,1.15rem)',
            lineHeight: 1.75, color: C.darkMid, maxWidth: '55ch', margin: '0 0 3rem',
          }}>
            An AI-powered learning companion that helps students study smarter, transforming notes into engaging videos, optimising focus through personalised Pomodoro sessions, and enhancing memory through science-backed mnemonics.
          </p>
        </MaskReveal>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { l: 'Timeline',      v: '2 Weeks' },
            { l: 'Institution',   v: 'NID Bangalore' },
            { l: 'Team',          v: 'Manali Boudh · Sravan P' },
            { l: 'Mentors',       v: 'Jagriti Galphade · Athul Dinesh' },
            { l: 'Tools',         v: 'Figma · Miro' },
            { l: 'Output',        v: 'Mobile App Prototype' },
          ].map(m => (
            <div key={m.l}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: C.darkMuted, textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.darkInk, margin: 0 }}>{m.v}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

// ─── Why This Topic ───────────────────────────────────────
function WhySection() {
  return (
    <section style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><SectionTag>Why This Topic</SectionTag></Reveal>
          <MaskReveal delay={0.1}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              letterSpacing: '-0.02em',
              color: C.ink,
              marginBottom: '1.5rem',
            }}>Education in India is a system worth designing for</h2>
          </MaskReveal>
          <Reveal delay={0.2}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.05rem,2vw,1.3rem)',
              color: C.mid,
              lineHeight: 1.75,
            }}>
              Education in India is a <strong style={{ color: C.ink, fontWeight: 600 }}>complex, deeply layered system</strong> that offers rich opportunities for applying systems thinking and design. It's an interconnected system with <strong style={{ color: C.ink, fontWeight: 600 }}>visible gaps that can foster real impact</strong>. Evolving technological integration, along with our personal relevance and familiarity, pushed us to pursue this topic.
            </p>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Systems Section ──────────────────────────────────────
function SystemsSection() {
  return (
    <section id="systems" style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Reveal><Label>Systems Thinking Process</Label></Reveal>

        {/* Two-stage process */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: 'clamp(3rem,5vw,5rem)',
          alignItems: 'stretch',
        }}>
          {[
            {
              num: '01', title: 'Discover & Define',
              steps: ['Systems Actor Map', 'Knowledge Graph', 'Identification of Subsystems', 'Initial System Mapping', 'Feedback Loops', 'Gap Identification', 'Research & Insight Analysis'],
            },
            {
              num: '02', title: 'Design & Deliver',
              steps: ['Built on research insights to redesign products', 'Focused on user experience & screen-based interfaces', 'Applied systems approach to understand ecosystems', 'Defined focused design briefs'],
            },
          ].map((stage, i) => (
            <Reveal key={stage.num} delay={i * 0.1} style={{ height: '100%' }}>
              <div style={{ background: C.card, padding: 'clamp(1.5rem,3vw,2.5rem)', boxShadow: C.neuSm, borderRadius: '14px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  color: C.blue,
                  marginBottom: '0.75rem',
                }}>STAGE {stage.num}</div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 500,
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  color: C.ink,
                  marginBottom: '1.25rem',
                  letterSpacing: '-0.02em',
                }}>{stage.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stage.steps.map((step, j) => (
                    <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.pink, marginTop: '0.45em', flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: C.mid, lineHeight: 1.5 }}>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Actor Map — split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4rem', alignItems: 'center', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div>
            <Reveal><SectionTag color={C.pink}>Actor Map</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.ink,
                marginBottom: '1rem',
              }}>Stakeholder Ecosystem</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                Three concentric layers of stakeholders: primary actors at the core, supported by secondary bodies and influenced by tertiary forces in the outer ring.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <HowHelpful text="This layered view helps identify relationships and power dynamics between all stakeholders in the education ecosystem." />
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div style={{ background: C.card, borderRadius: '14px', padding: 'clamp(1rem,1.5vw,1.5rem)', boxShadow: C.neu }}>
              <ActorMap />
            </div>
          </Reveal>
        </div>

        {/* Knowledge Graph */}
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4rem', alignItems: 'center', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div>
            <Reveal><SectionTag color={C.blue}>Knowledge Graph</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.ink,
                marginBottom: '1rem',
              }}>Connecting the Dots</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                A network map of relationships between concepts, actors, and systemic forces shaping education in India.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <HowHelpful text="This helped identify leverage points where design intervention could create maximum impact." />
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div>
              <ImgBox label="Knowledge Graph — Stakeholder Relationship Network" aspect="60%" />
            </div>
          </Reveal>
        </div>

        {/* Sub-systems — split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4rem', alignItems: 'center', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div>
            <Reveal><SectionTag>Sub-systems</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.ink,
                marginBottom: '1rem',
              }}>8 Sub-Systems of Formal Education</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                Mapping the surrounding systems that shape, constrain, and enable formal education in India.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <HowHelpful text="Mapping these helps in understanding systemic complexity and focusing deeper in our system map." />
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div style={{ background: C.card, borderRadius: '14px', padding: 'clamp(1rem,1.5vw,1.5rem)', boxShadow: C.neu }}>
              <SubsystemsMap />
            </div>
          </Reveal>
        </div>

        {/* System Map I */}
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <Label>Figma Artefact</Label>
            <ImgBox label="System Map I — Initial System Mapping" aspect="50%" />
          </div>
        </Reveal>

        {/* Feedback Loops — split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: '4rem', alignItems: 'center', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div>
            <Reveal><SectionTag color={C.pink}>Feedback Loops</SectionTag></Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.ink,
                marginBottom: '1rem',
              }}>Reinforcing & Balancing Loops</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                Highlights dynamic interdependencies: influence of technology, career pressure, policy reforms, and awareness on student motivation and outcomes.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <HowHelpful text="Identifying reinforcing and balancing loops helps uncover leverage points for systemic change, where a small intervention creates large ripple effects." />
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ImgBox label="Feedback Loops — Reinforcing & Balancing Dynamics" aspect="75%" />
          </Reveal>
        </div>

        {/* HMW 1 */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.dark, borderRadius: '16px',
            padding: 'clamp(2rem,4vw,3.5rem)',
            marginTop: 'clamp(2rem,4vw,3.5rem)',
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: C.darkMuted,
              display: 'block',
              marginBottom: '0.5rem',
            }}>HOW MIGHT WE</span>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1rem,1.8vw,1.2rem)',
              color: C.darkInk,
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}>Motivation & Real-Time Achievement</h3>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.3rem,3vw,2rem)',
              color: 'rgba(242,237,228,0.75)',
              lineHeight: 1.55,
              maxWidth: 680,
              margin: 0,
            }}>
              "How might we design systems that provide real-time motivation and track small achievements to boost confidence for students?"
            </p>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Research Section ─────────────────────────────────────
function ResearchSection() {
  const insights = [
    { text: 'More than demotivation, it\'s procrastination that holds students back.', keyword: 'procrastination', color: C.ink },
    { text: 'Distraction and procrastination are the leading barriers to consistent study.', keyword: 'Distraction', color: C.mid },
    { text: 'Studying without meaning is just memorising without understanding.', keyword: 'memorising without understanding', color: C.ink },
    { text: 'Fear of bad grades motivates many students more than genuine interest.', keyword: 'Fear of bad grades', color: C.mid },
    { text: 'If I had managed to put every effort, I would have definitely scored more.', keyword: 'put every effort', color: C.ink },
    { text: 'Students need something to keep them going, not just remind them.', keyword: 'keep them going', color: C.mid },
  ]

  function HighlightText({ text, keyword, color }) {
    if (!keyword || !text.includes(keyword)) {
      return <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', lineHeight: 1.7, color: C.ink }}>{text}</span>
    }
    const parts = text.split(keyword)
    return (
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '1rem', lineHeight: 1.7, color: C.ink }}>
        {parts[0]}
        <span style={{ color, fontWeight: 500 }}>{keyword}</span>
        {parts[1]}
      </span>
    )
  }

  return (
    <section id="research" style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal><Label>Primary Research</Label></Reveal>

        {/* System Map II */}
        <Reveal delay={0.05}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: C.ink,
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>
              System Map II — Student Motivation Focus
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 560 }}>
              Diverging on more factors with the emerging idea of student motivation as a central leverage point.
            </p>
            <ImgBox label="System Map II — Student Motivation Focus" aspect="48%" />
          </div>
        </Reveal>

        {/* Research Insights — outlined cards, 3×2 grid */}
        <Reveal>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: C.ink,
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
          }}>
            6 Research Insights
          </h3>
        </Reveal>
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch',
          marginBottom: 'clamp(2.5rem,4vw,4rem)',
        }}>
          {insights.map((ins, i) => (
            <StaggerItem key={i} style={{ flex: 1 }}>
              <div style={{
                border: `2px solid ${ins.color}`,
                borderRadius: 18,
                padding: '1.5rem 1.75rem',
                background: 'transparent',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, color: C.ink, margin: 0, fontFamily: "'Syne', sans-serif", flex: 1 }}>
                  <span style={{ color: ins.color, fontWeight: 500 }}>{ins.keyword}</span>
                  {ins.text.replace(ins.keyword, '')}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Target Audience */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.dark,
            borderRadius: '16px',
            padding: 'clamp(1.75rem,3vw,2.75rem)',
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.darkMuted,
              marginBottom: '0.75rem',
            }}>Target Audience</div>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1rem,2vw,1.35rem)',
              color: C.darkInk,
              margin: 0,
            }}>
              Students 13+ years of age, primarily from upper-middle class income groups
            </p>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Define Section ───────────────────────────────────────
function DefineSection() {
  const quotes = [
    '"She didn\'t just teach from textbooks. She told stories, connected events to real life, and encouraged discussions that made us think critically."',
    '"More than demotivation, it\'s procrastination."',
    '"If I had managed to put every effort I would have definitely scored more."',
    '"The fear of getting bad grades made me highly motivated, so that my parents would let my passion come over."',
    '"Distraction and procrastination issue."',
    '"Studying without meaning is just memorising without understanding."',
  ]

  return (
    <section id="define" style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Reveal><Label>Define</Label></Reveal>

        {/* Product Definition */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <Reveal>
            <SectionTag>Product Definition</SectionTag>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.15rem,2.5vw,1.55rem)',
              color: C.ink,
              lineHeight: 1.7,
              maxWidth: 780,
              marginTop: '0.5rem',
            }}>
              Study Buddy is an <strong style={{ color: C.ink }}>AI-powered learning companion</strong> that helps students study smarter by transforming notes into engaging video explanations, optimising focus through personalised Pomodoro sessions, and enhancing memory retention using <strong style={{ color: C.ink }}>science-backed mnemonics</strong>, all while tracking progress to show real learning gains. This all-in-one app combines <em>cognitive psychology with smart technology</em> to make studying more effective, efficient, and enjoyable.
            </p>
          </Reveal>
        </div>

        {/* Research Voices */}
        <Reveal>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: C.ink,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}>
            Research Voices
          </h3>
        </Reveal>
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: 'clamp(3rem,5vw,5rem)',
        }}>
          {quotes.map((q, i) => (
            <StaggerItem key={i}>
              <div style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '1.5rem',
                height: '100%',
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem',
                  color: C.pink,
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>"</div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: '1.05rem',
                  color: C.mid,
                  lineHeight: 1.65,
                  margin: 0,
                }}>{q.replace(/^"|"$/g, '')}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* IA Diagram */}
        <Reveal>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: C.ink,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Information Architecture
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560 }}>
            App structure across five primary sections, each with 3–4 focused sub-screens.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{
            background: C.surface, borderRadius: '16px',
            padding: 'clamp(1.5rem,3vw,2.5rem)',
            border: `1px solid ${C.border}`,
            marginBottom: 'clamp(2.5rem,4vw,4rem)',
            overflowX: 'auto',
          }}>
            <IADiagram />
          </div>
        </Reveal>

        {/* HMW 2 */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.dark, borderRadius: '16px',
            padding: 'clamp(2rem,4vw,3.5rem)',
            marginBottom: 'clamp(2.5rem,4vw,4rem)',
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              color: C.darkMuted,
              display: 'block',
              marginBottom: '0.5rem',
            }}>HOW MIGHT WE</span>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1rem,1.8vw,1.2rem)',
              color: C.darkInk,
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}>Interface Design & Study Experience</h3>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem,2.8vw,1.85rem)',
              color: 'rgba(242,237,228,0.75)',
              lineHeight: 1.55,
              maxWidth: 700,
              margin: 0,
            }}>
              "How might we create an interface that keeps students motivated by combining structured focus techniques with an engaging means to solve the approach of rote memorisation, giving them more time for their goals and interests?"
            </p>
          </div>
        </Reveal>

        {/* User Story */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '16px', padding: 'clamp(1.5rem,3vw,2.5rem)',
          }}>
            <Label>User Story</Label>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.05rem,2vw,1.3rem)',
              color: C.ink,
              lineHeight: 1.7,
              margin: 0,
            }}>
              "As a motivated but easily distracted student, I want to stay motivated to learn, progress in academics and earn rewards (for staying consistent), so that I can stay focused, build better study habits, improve in subjects I struggle with while also spending time on my interests."
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1.25rem' }}>
              {['Pomodoro Flow', 'Scan to Video', 'Memorise'].map(f => (
                <span key={f} style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: C.pink,
                  border: `1px solid ${C.pink}40`,
                  padding: '4px 10px', borderRadius: '99px',
                }}>{f}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Personas Section ─────────────────────────────────────
function PersonasSection() {
  const personas = [
    {
      name: 'Aarav Mehta', age: '14 years',
      context: 'Upper-middle-class · Private CBSE · Bangalore',
      quote: '"I know I can do well if I just stay consistent… I just need something to keep me going."',
      personality: 'Ambitious, tech-savvy, struggles with consistency',
      learningStyle: 'Enjoys interactive and gamified learning; gets bored with repetitive tasks',
      needs: ['Structured Study Plan', 'External Motivation', 'Engaging & Fun Learning', 'Short & Effective Study Sessions', 'Social Connection'],
      challenges: ['Procrastination', 'Easily Distracted', 'Lack of Study Consistency', 'Overwhelmed by Large Tasks'],
      opportunities: ['Streak-Based Motivation', 'Pomodoro-Style Focus Mode', 'Accountability Buddy System', 'Personalised Study Challenges'],
      color: C.blue,
      initials: 'AM',
    },
    {
      name: 'Riya Sharma', age: '15 years',
      context: 'Upper-middle-class · Private CBSE · Delhi',
      quote: '"I\'ll study hard for one day, then forget everything by week\'s end. There\'s got to be a better way to remember."',
      personality: 'Social, artistic, impatient with slow progress',
      learningStyle: 'Retains best through videos and interactive content',
      needs: ['Bite-sized study sessions', 'Visual explanations', 'Progress tracking', 'Fun breaks', 'Friendly competition'],
      challenges: ['Loses focus after 20 minutes', 'Forgets concepts quickly', 'Procrastinates on revision', 'Overwhelmed by syllabus'],
      opportunities: ['AI Video Notes', 'Focus Timer with motivational alerts', 'Memory Games (spaced repetition)', 'Study Squad', 'Progress Mascot'],
      color: C.pink,
      initials: 'RS',
    },
  ]

  return (
    <section id="personas" style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal><Label>User Personas & Empathy Map</Label></Reveal>

        {/* Empathy Map */}
        <Reveal>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            color: C.ink,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Empathy Map
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560 }}>
            What our primary user says, does, thinks, and feels, capturing the emotional landscape of a student who wants to do better.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
            <EmpathyMap />
          </div>
        </Reveal>

        {/* Persona cards */}
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {personas.map((p) => (
            <StaggerItem key={p.name}>
              <div style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                <div style={{ background: p.color, padding: '2rem', position: 'relative' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.1rem', color: 'white' }}>{p.initials}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.3rem', color: 'white', margin: '0 0 4px' }}>{p.name}</h4>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em' }}>{p.age} · {p.context}</span>
                </div>

                <div style={{ padding: '1.75rem' }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    color: C.mid,
                    lineHeight: 1.65,
                    borderLeft: `3px solid ${p.color}`,
                    paddingLeft: '1rem',
                    marginBottom: '1.5rem',
                  }}>{p.quote}</p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Personality</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.ink }}>{p.personality}</span>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Learning Style</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.ink }}>{p.learningStyle}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {[
                      { title: 'Needs',        items: p.needs,        dot: p.color },
                      { title: 'Challenges',   items: p.challenges,   dot: C.pink },
                      { title: 'Opportunities', items: p.opportunities, dot: C.green },
                    ].map(col => (
                      <div key={col.title}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{col.title}</span>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {col.items.map((item, ii) => (
                            <li key={ii} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                              <div style={{ width: 4, height: 4, borderRadius: '50%', background: col.dot, marginTop: '0.45em', flexShrink: 0 }} />
                              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.mid, lineHeight: 1.45 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Design System Section ────────────────────────────────
function DesignSystemSection() {
  const colors = [
    { name: 'Yellow',  hex: '#FFF176', role: 'Highlights · Achievements' },
    { name: 'Pink',    hex: '#F48FB1', role: 'Primary CTA · Streaks' },
    { name: 'Green',   hex: '#A5D6A7', role: 'Success · Progress' },
    { name: 'Blue',    hex: '#90CAF9', role: 'Focus Timer · Sessions' },
    { name: 'Purple',  hex: '#CE93D8', role: 'Mnemonics · Memory' },
  ]

  return (
    <section id="design-system" style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Reveal><Label>Design System</Label></Reveal>

        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: 'clamp(2.5rem,4vw,4rem)',
        }}>
          <StaggerItem>
            <div style={{ background: C.card, borderRadius: '14px', padding: '1.75rem', height: '100%', boxShadow: C.neu }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.blue, marginBottom: '0.75rem' }}>GRID SYSTEM</div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.1rem', color: C.ink, marginBottom: '1rem' }}>16px Baseline Grid</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['16px margin & gutter space', '8pt baseline grid', 'Perfect Fifth scale (×1.5) for headers', 'Golden Ratio (×1.618) for incremental type'].map(item => (
                  <li key={item} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.mid, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.blue, marginTop: '0.45em', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div style={{ background: C.card, borderRadius: '14px', padding: '1.75rem', height: '100%', boxShadow: C.neu }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.pink, marginBottom: '0.75rem' }}>TYPOGRAPHY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '2rem', color: C.ink, lineHeight: 1 }}>Absans</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, marginTop: '4px' }}>H1 · H2 · Content headings</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 400, fontSize: '1rem', color: C.mid }}>Urbanist</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, marginTop: '4px' }}>Body text · UI elements</div>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div style={{ background: C.card, borderRadius: '14px', padding: '1.75rem', height: '100%', boxShadow: C.neu }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.muted, marginBottom: '0.75rem' }}>TARGET ENERGY</div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.1rem', color: C.ink, marginBottom: '0.75rem' }}>Fresh · Youthful · Focused</h4>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>
                Palette chosen to resonate with 13+ age group: vibrant enough to feel energetic, restrained enough to aid focus during long study sessions.
              </p>
            </div>
          </StaggerItem>
        </StaggerGrid>

        {/* Colour Palette */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.2rem', color: C.ink, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Colour Palette</h3>
        </Reveal>
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '10px',
        }}>
          {colors.map(col => (
            <StaggerItem key={col.name}>
              <div>
                <div style={{
                  background: col.hex,
                  borderRadius: '10px',
                  height: '72px',
                  marginBottom: '8px',
                  border: col.hex === C.bg ? `1px solid ${C.border}` : 'none',
                }} />
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.72rem', color: C.ink, marginBottom: '2px' }}>{col.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, marginBottom: '2px' }}>{col.hex}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: C.muted, lineHeight: 1.4 }}>{col.role}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Features Section ─────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal><Label>App Features</Label></Reveal>

        {/* Home Dashboard */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <Reveal>
            <SectionTag>01</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              letterSpacing: '-0.02em',
              color: C.ink,
              marginBottom: '1rem',
            }}>Home Dashboard</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>
              Centralised overview: today's plan, quick-start shortcuts, and streak status at a glance.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ImgBox label="Home Dashboard — Daily Overview UI" aspect="56%" />
          </Reveal>
        </div>

        {/* Focus Sessions — dark bg */}
        <div style={{ background: C.dark, borderRadius: '24px', padding: 'clamp(2rem,4vw,3.5rem)', marginBottom: 'clamp(3rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          {/* Blob decoration */}
          <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: C.pink, top: -80, right: -80, opacity: 0.1, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Reveal>
              <SectionTag color={C.pink}>02</SectionTag>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.white,
                marginBottom: '1rem',
              }}>Focus Sessions</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>
                Pomodoro timer with quirky localisation, micro-interactions, dynamic motivating stickers, and contextually relevant illustrations. 25 min work, 5 min break, 4 cycles, then a longer break.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  'Timer Interface — Active Focus Mode',
                  'Break Screen — Motivational Stickers',
                  'Control Panel — Settings, Pause/Play, Next',
                ].map((lbl, i) => (
                  <div key={i}>
                    <ImgBox label={lbl} aspect="177%" dark />
                    <ScreenLabel dark>{lbl}</ScreenLabel>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Mnemonics — dark bg */}
        <div style={{ background: C.dark, borderRadius: '24px', padding: 'clamp(2rem,4vw,3.5rem)', marginBottom: 'clamp(3rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: C.blue, bottom: -60, left: -60, opacity: 0.12, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Reveal>
              <SectionTag color={C.green}>03</SectionTag>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.white,
                marginBottom: '1rem',
              }}>Mnemonics & Memorisation</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>
                Assisted memorisation through imagery and organisation. Acronyms, vivid mental images, structured formats. Flow: Intro → Upload → Analyse → Generate.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {['Intro Screen', 'Upload Notes', 'Analysing', 'Generated Mnemonic'].map((lbl, i) => (
                  <div key={i}>
                    <ImgBox label={lbl} aspect="177%" dark />
                    <ScreenLabel dark>{lbl}</ScreenLabel>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Behavioural Activation */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <Reveal>
            <SectionTag>04</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              letterSpacing: '-0.02em',
              color: C.ink,
              marginBottom: '0.75rem',
            }}>Behavioural Activation</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>
              Effective planning through draggable routine tags, customisable logs, and activity ratings. Breaks the vicious cycle of demotivation, procrastination, decreased activity, and guilt.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: C.card, borderRadius: '14px', padding: 'clamp(1.25rem,2.5vw,2rem)', boxShadow: C.neu }}>
              <BehaviouralCycle />
            </div>
          </Reveal>
        </div>

        {/* Stats & Profile — dark bg */}
        <div style={{ background: C.dark, borderRadius: '24px', padding: 'clamp(2rem,4vw,3.5rem)', marginBottom: 'clamp(3rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: C.yellow, top: -60, right: -60, opacity: 0.12, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Reveal>
              <SectionTag color={C.yellow}>05</SectionTag>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.white,
                marginBottom: '1rem',
              }}>Stats & Profile</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>
                Check-in dashboard with editable avatar, progress sorted across different time periods, streaks, and achievement history.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {['Profile Overview', 'Streak History', 'Achievement Badges'].map((lbl, i) => (
                  <div key={i}>
                    <ImgBox label={lbl} aspect="177%" dark />
                    <ScreenLabel dark>{lbl}</ScreenLabel>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Video Playback — dark bg */}
        <div style={{ background: C.dark, borderRadius: '24px', padding: 'clamp(2rem,4vw,3.5rem)', marginBottom: 'clamp(3rem,5vw,5rem)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: C.green, bottom: -80, right: 60, opacity: 0.12, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Reveal>
              <SectionTag color={C.green}>06</SectionTag>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.02em',
                color: C.white,
                marginBottom: '1rem',
              }}>Video Playback</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>
                AI-generated video player with brightness adjustment, 10-second skip controls, captions, speed adjustment, and lock screen support.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ImgBox label="Video Player — AI-Generated Explanation UI" aspect="50%" dark />
            </Reveal>
          </div>
        </div>

        {/* Scan to Video Flow — white bg, lime blob */}
        <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          {/* Lime green blob at bottom right */}
          <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: C.green, bottom: -60, right: -60, opacity: 0.15, zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Reveal>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                color: C.ink,
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em',
              }}>
                Scan to Video: 3-Step Flow
              </h3>
            </Reveal>
            <StaggerGrid style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
            }}>
              {[
                { num: '01', label: 'Begin Scanning Notes',                   color: C.blue },
                { num: '02', label: 'Play Video',                             color: C.dark },
                { num: '03', label: 'Video Automatically Saved in Profile',   color: C.mid },
              ].map(s => (
                <StaggerItem key={s.num}>
                  <div>
                    <ImgBox label={`Step ${s.num} — ${s.label}`} aspect="177%" style={{ borderRadius: '12px' }} />
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.55rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: s.color,
                      textAlign: 'center',
                      marginTop: '0.75rem',
                    }}>{s.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Accessibility Section ────────────────────────────────
function AccessibilitySection() {
  const pour = [
    {
      letter: 'P', title: 'Perceivable',
      items: ['High-contrast, youthful colour palette with clear hierarchy', 'Typography system (Perfect Fifth / 8pt grid) ensures legibility', 'Visual cues (stickers, avatars, streak icons) provide multi-sensory feedback'],
    },
    {
      letter: 'O', title: 'Operable',
      items: ['Simple, tap-based interaction model with minimal scroll depth', 'Micro-interactions add meaningful haptic and visual feedback', 'Consistent navigation structure across all sections'],
    },
    {
      letter: 'U', title: 'Understandable',
      items: ['Gamified flow and mascot feedback simplify complex functions', 'Onboarding uses familiar metaphors: streaks, tasks, achievements', 'Progress visualisation reinforces sense of control and ownership'],
    },
    {
      letter: 'R', title: 'Robust',
      items: ['Built on standard mobile design frameworks (Figma prototype)', 'Structure supports integration with LMS and AI-based assistant', 'Scalable architecture for future platform expansion'],
    },
  ]

  return (
    <section id="accessibility" style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Reveal><Label>Accessibility: POUR Framework</Label></Reveal>
        <Reveal>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            color: C.ink,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Designed for every learner
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 560 }}>
            Study Buddy is evaluated against the POUR principles, ensuring the app works for students with diverse abilities and contexts.
          </p>
        </Reveal>
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}>
          {pour.map(p => (
            <StaggerItem key={p.letter}>
              <div style={{
                background: C.card,
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: C.neu,
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '2.5rem',
                    fontWeight: 500,
                    color: C.ink,
                    lineHeight: 1,
                  }}>{p.letter}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '1.05rem', color: C.ink }}>{p.title}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.border, marginTop: '0.45em', flexShrink: 0, border: `1px solid ${C.muted}` }} />
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: C.mid, lineHeight: 1.55 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Reflections Section ──────────────────────────────────
function ReflectionsSection() {
  const reflections = [
    { n: '01', text: '"Motivation is systemic. It grows when systems reinforce small wins, not just grades."' },
    { n: '02', text: '"Progress is not about pace, but about presence, for us and students alike."' },
    { n: '03', text: '"Productivity follows when learning feels rewarding."' },
    { n: '04', text: '"We can leverage technology as a mirror, reflecting back progress and building belief."' },
  ]

  return (
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
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            color: C.darkInk,
            letterSpacing: '-0.02em',
            marginBottom: 'clamp(2rem,4vw,3.5rem)',
          }}>What we took away</h2>
        </Reveal>

        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: 'clamp(3rem,5vw,5rem)',
        }}>
          {reflections.map((r) => (
            <StaggerItem key={r.n}>
              <div style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '2.25rem',
                height: '100%',
              }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.58rem',
                  letterSpacing: '0.22em',
                  color: C.darkMuted,
                  marginBottom: '1.25rem',
                }}>{r.n}</div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.05rem,2vw,1.25rem)',
                  color: C.darkInk,
                  lineHeight: 1.65,
                  margin: 0,
                }}>{r.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal delay={0.2}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem,2vw,1.2rem)',
            color: C.darkMid,
            maxWidth: 560,
            lineHeight: 1.75,
            margin: 0,
          }}>
            Study Buddy began as a systems exercise and evolved into a genuine attempt to make learning feel worth showing up for.
          </p>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════
export default function StudyBuddy() {
  const active = useActiveSection(NAV_SECTIONS.map(s => s.id))

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: '100vh' }}>
      <ProgressBar />
      <Nav light />
      <SidebarNav active={active} />

      <main>
        <HeroSection />
        <WhySection />
        <SystemsSection />
        <ResearchSection />
        <DefineSection />
        <PersonasSection />
        <DesignSystemSection />
        <FeaturesSection />
        <AccessibilitySection />
        <ReflectionsSection />
      </main>

      <Footer />
    </div>
  )
}
