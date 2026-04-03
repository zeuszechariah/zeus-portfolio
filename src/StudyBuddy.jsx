import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal } from './shared.jsx'

// ─── Design Tokens ────────────────────────────────────
const C = {
  bg:       '#F9F8F6',
  white:    '#FFFFFF',
  cream:    '#F3F1EA',
  dark:     '#0D0D0D',
  ink:      '#1A1A1A',
  mid:      '#454545',
  muted:    '#888888',
  border:   '#E4E3DC',
  blue:     '#2561E8',
  bluePale: '#ECF1FD',
  purple:   '#7C3AED',
  pink:     '#FF4B8F',
  green:    '#00CC70',
  amber:    '#F59E0B',
}

const EASE = [0.22, 1, 0.36, 1]

// ─── Sidebar Sections ─────────────────────────────────
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

// ─── Shared Helpers ───────────────────────────────────
function Wrap({ children, className = '' }) {
  return (
    <div className={`max-w-[1120px] mx-auto px-[clamp(1.5rem,5vw,3rem)] ${className}`}>
      {children}
    </div>
  )
}

const PAD = { paddingTop: 'clamp(5rem,8vw,7rem)', paddingBottom: 'clamp(4rem,6vw,6rem)' }

function Label({ children, light = false, style = {} }) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem',
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: light ? 'rgba(255,255,255,0.3)' : 'rgba(26,26,26,0.35)',
      display: 'block',
      marginBottom: '1.5rem',
      ...style,
    }}>{children}</span>
  )
}

function SectionTag({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.58rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: C.blue,
      background: C.bluePale,
      padding: '4px 10px',
      borderRadius: '99px',
      marginBottom: '1.25rem',
    }}>{children}</span>
  )
}

// ─── Placeholder Image Box ─────────────────────────────
function ImgBox({ label, aspect = '56.25%', style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      paddingBottom: aspect,
      background: '#EEECEA',
      border: `1.5px dashed ${C.border}`,
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
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke={C.muted} strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke={C.muted} strokeWidth="1.5" />
          <path d="M3 15l5-5 4 4 3-3 6 6" stroke={C.muted} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          color: C.muted,
          textAlign: 'center',
          maxWidth: '220px',
          lineHeight: 1.5,
        }}>{label}</span>
      </div>
    </div>
  )
}

// ─── Stagger Wrapper ──────────────────────────────────
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

function StaggerItem({ children, style = {}, className = '' }) {
  return (
    <motion.div className={className} style={style}
      variants={{
        hidden:  { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
    >{children}</motion.div>
  )
}

// ─── Sidebar Nav ──────────────────────────────────────
function SidebarNav({ active }) {
  function scrollTo(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div style={{
      position: 'fixed',
      left: 'clamp(12px, 2vw, 28px)',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {NAV_SECTIONS.map(s => {
        const isActive = active === s.id
        return (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            title={s.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            <motion.div
              animate={{ width: isActive ? 24 : 10, background: isActive ? C.blue : '#BBBAB6' }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ height: 2, borderRadius: 99 }}
            />
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.52rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.blue,
                    whiteSpace: 'nowrap',
                  }}
                >{s.label}</motion.span>
              )}
            </AnimatePresence>
          </button>
        )
      })}
    </div>
  )
}

// ─── useActiveSection ─────────────────────────────────
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

// ─── 1. Actor Map ─────────────────────────────────────
function ActorMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const primaryActors = [
    { label: 'Students', angle: -90 },
    { label: 'Teachers', angle: 0 },
    { label: 'Parents', angle: 90 },
    { label: 'Education\nBoards', angle: 180 },
  ]
  const secondaryActors = [
    { label: 'EdTech', angle: -60 },
    { label: 'Coaching\nCenters', angle: -10 },
    { label: 'Employers', angle: 50 },
    { label: 'Tutors', angle: 110 },
    { label: 'Curriculum\nDesigners', angle: 160 },
    { label: 'Libraries', angle: 210 },
  ]
  const tertiaryActors = [
    { label: 'NGOs', angle: -75 },
    { label: 'Media', angle: -30 },
    { label: 'Activists', angle: 15 },
    { label: 'Entrepreneurs', angle: 60 },
    { label: 'Government', angle: 110 },
    { label: 'Researchers', angle: 155 },
    { label: 'Communities', angle: 200 },
    { label: 'Employers', angle: 245 },
  ]

  function toXY(angleDeg, r) {
    const a = (angleDeg * Math.PI) / 180
    return { x: 300 + r * Math.cos(a), y: 300 + r * Math.sin(a) }
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 600 600" style={{ width: '100%', maxWidth: 520, overflow: 'visible' }}>
        <defs>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A8BFF" />
            <stop offset="100%" stopColor={C.blue} />
          </radialGradient>
        </defs>

        {/* Guide rings */}
        {[110, 190, 258].map((r, i) => (
          <circle key={r} cx={300} cy={300} r={r}
            fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="4 6" opacity={0.6} />
        ))}

        {/* Lines to primary */}
        {primaryActors.map((a, i) => {
          const p = toXY(a.angle, 110)
          return (
            <motion.line key={i} x1={300} y1={300} x2={p.x} y2={p.y}
              stroke={C.blue} strokeWidth={1.2} opacity={0.35}
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
              stroke={C.purple} strokeWidth={1} opacity={0.22}
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
              stroke={C.muted} strokeWidth={0.8} opacity={0.18}
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.03, ease: EASE }}
            />
          )
        })}

        {/* Tertiary nodes */}
        {tertiaryActors.map((a, i) => {
          const p = toXY(a.angle, 258)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.5 + i * 0.04, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={22} fill="#F3F2EE" stroke={C.border} strokeWidth={1} />
              {a.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y + (li - (a.label.split('\n').length - 1) / 2) * 10}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={7.5} fill={C.mid} fontFamily="'Space Mono', monospace"
                >{line}</text>
              ))}
            </motion.g>
          )
        })}

        {/* Secondary nodes */}
        {secondaryActors.map((a, i) => {
          const p = toXY(a.angle, 190)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.05, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={26} fill="#F0EAF8" stroke="#D4C3F5" strokeWidth={1} />
              {a.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y + (li - (a.label.split('\n').length - 1) / 2) * 10}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={7.5} fill={C.purple} fontFamily="'Space Mono', monospace"
                >{line}</text>
              ))}
            </motion.g>
          )
        })}

        {/* Primary nodes */}
        {primaryActors.map((a, i) => {
          const p = toXY(a.angle, 110)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={32} fill={C.blue} />
              {a.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y + (li - (a.label.split('\n').length - 1) / 2) * 11}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={8} fill="white" fontFamily="'Space Mono', monospace" fontWeight="700"
                >{line}</text>
              ))}
            </motion.g>
          )
        })}

        {/* Center node */}
        <motion.g initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <circle cx={300} cy={300} r={52} fill="url(#centerGrad)" />
          <text x={300} y={295} textAnchor="middle" dominantBaseline="middle"
            fontSize={7.5} fill="white" fontFamily="'Space Mono', monospace" fontWeight="700"
          >EDUCATION</text>
          <text x={300} y={308} textAnchor="middle" dominantBaseline="middle"
            fontSize={7.5} fill="white" fontFamily="'Space Mono', monospace" fontWeight="700"
          >SYSTEM</text>
        </motion.g>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
        {[
          { color: C.blue, label: 'Primary' },
          { color: C.purple, label: 'Secondary' },
          { color: C.muted, label: 'Tertiary' },
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

// ─── 2. Subsystems Map ────────────────────────────────
function SubsystemsMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const systems = [
    { label: 'Financial\n& Economic',       sub: 'Funding · Fees',     angle: -90 },
    { label: 'Cultural\n& Social',           sub: 'Norms · Values',     angle: -45 },
    { label: 'Alternative\n& Informal',      sub: 'Non-formal · NGOs',  angle: 0 },
    { label: 'Research\n& Innovation',       sub: 'Academia · R&D',     angle: 45 },
    { label: 'Assessment\n& Examination',    sub: 'Tests · Boards',     angle: 90 },
    { label: 'Infrastructure\n& Resources',  sub: 'Schools · Tech',     angle: 135 },
    { label: 'Regulatory\n& Governance',     sub: 'Policy · Law',       angle: 180 },
    { label: 'Employment',                   sub: 'Jobs · Industry',    angle: 225 },
  ]

  function toXY(angleDeg, r) {
    const a = (angleDeg * Math.PI) / 180
    return { x: 300 + r * Math.cos(a), y: 300 + r * Math.sin(a) }
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 600 600" style={{ width: '100%', maxWidth: 520, overflow: 'visible' }}>
        {/* Guide ring */}
        <circle cx={300} cy={300} r={215}
          fill="none" stroke={C.border} strokeWidth={1.2} strokeDasharray="6 8" opacity={0.5} />

        {/* Lines */}
        {systems.map((s, i) => {
          const p = toXY(s.angle, 215)
          return (
            <motion.line key={i} x1={300} y1={300} x2={p.x} y2={p.y}
              stroke={C.blue} strokeWidth={1} opacity={0.25}
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
            />
          )
        })}

        {/* Satellite nodes */}
        {systems.map((s, i) => {
          const p = toXY(s.angle, 215)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.07, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={44} fill={C.bluePale} stroke={C.blue} strokeWidth={1} opacity={0.85} />
              {s.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y - 6 + (li - (s.label.split('\n').length - 1) / 2) * 11}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={7.5} fill={C.blue} fontFamily="'Space Mono', monospace" fontWeight="700"
                >{line}</text>
              ))}
              <text x={p.x} y={p.y + 16} textAnchor="middle" dominantBaseline="middle"
                fontSize={6.5} fill={C.muted} fontFamily="'Space Mono', monospace"
              >{s.sub}</text>
            </motion.g>
          )
        })}

        {/* Center */}
        <motion.g initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <circle cx={300} cy={300} r={60} fill={C.blue} />
          <text x={300} y={293} textAnchor="middle" fontSize={7.5} fill="white"
            fontFamily="'Space Mono', monospace" fontWeight="700">FORMAL</text>
          <text x={300} y={305} textAnchor="middle" fontSize={7.5} fill="white"
            fontFamily="'Space Mono', monospace" fontWeight="700">EDUCATION</text>
          <text x={300} y={317} textAnchor="middle" fontSize={7.5} fill="rgba(255,255,255,0.6)"
            fontFamily="'Space Mono', monospace">SYSTEM</text>
        </motion.g>
      </svg>
    </div>
  )
}

// ─── 3. Empathy Map ───────────────────────────────────
const EMPATHY_DATA = [
  {
    key: 'says', label: 'Says', color: C.blue, pale: C.bluePale, textColor: C.blue,
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
    key: 'does', label: 'Does', color: C.purple, pale: '#F3EFFE', textColor: C.purple,
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
    key: 'thinks', label: 'Thinks', color: C.green, pale: '#E6F9F2', textColor: '#007A43',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
    key: 'feels', label: 'Feels', color: C.pink, pale: '#FFF0F6', textColor: '#C4005A',
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
              fontWeight: 700,
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

// ─── 4. IA Diagram ────────────────────────────────────
const IA_TREE = [
  {
    label: 'Home\nDashboard', color: C.blue,
    children: ['Today\'s Plan', 'Quick Start', 'Streak Status'],
  },
  {
    label: 'Focus\nSessions', color: C.purple,
    children: ['Pomodoro Timer', 'Focus Settings', 'Break Mode', 'Session Log'],
  },
  {
    label: 'Memorization', color: C.pink,
    children: ['Scan Notes', 'AI Video', 'Mnemonics', 'Review Queue'],
  },
  {
    label: 'Plan\nMy Day', color: C.green,
    children: ['Activity Log', 'Daily Routine', 'Rate Activities', 'Calendar'],
  },
  {
    label: 'Profile\n& Stats', color: C.amber,
    children: ['Achievements', 'Streaks', 'Analytics', 'History'],
  },
]

function IADiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
      <div style={{ minWidth: 640 }}>
        {/* Root */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              background: C.blue, color: 'white',
              padding: '12px 28px', borderRadius: '10px',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem',
              letterSpacing: '0.02em',
            }}
          >Study Buddy</motion.div>
        </div>

        {/* Horizontal connector */}
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
          {/* Vertical drop lines above branches */}
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

        {/* Branch nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px', alignItems: 'flex-start' }}>
          {IA_TREE.map((branch, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.07, ease: EASE }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              {/* Branch label */}
              <div style={{
                background: branch.color + '18',
                border: `1.5px solid ${branch.color}40`,
                borderRadius: '8px',
                padding: '10px 8px',
                textAlign: 'center',
                width: '100%',
              }}>
                {branch.label.split('\n').map((l, li) => (
                  <div key={li} style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: branch.color,
                    lineHeight: 1.3,
                  }}>{l}</div>
                ))}
              </div>

              {/* Vertical line */}
              <div style={{ width: '2px', height: '12px', background: branch.color + '40' }} />

              {/* Sub-items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                {branch.children.map((child, j) => (
                  <motion.div key={j}
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.07 + j * 0.04 }}
                    style={{
                      background: C.cream,
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

// ─── 5. Behavioural Cycle ─────────────────────────────
function BehaviouralCycle() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const nodes = [
    { label: 'Demotivated\nFeeling',         color: '#EF4444', pale: '#FEF2F2', angle: -90, r: 140 },
    { label: 'Procrastination\n& Low Energy', color: C.amber,   pale: '#FFFBEB', angle: 0,   r: 140 },
    { label: 'Decreased\nActivity',           color: C.purple,  pale: '#F3EFFE', angle: 90,  r: 140 },
    { label: 'Increased\nGuilt',              color: '#374151', pale: '#F9FAFB', angle: 180, r: 140 },
  ]

  function toXY(angleDeg, r) {
    const a = (angleDeg * Math.PI) / 180
    return { x: 220 + r * Math.cos(a), y: 220 + r * Math.sin(a) }
  }

  // Arc paths between nodes (quadratic bezier curving outward)
  function arcPath(from, to, curveOut = 40) {
    const f = toXY(from, 140)
    const t = toXY(to, 140)
    const mx = (f.x + t.x) / 2
    const my = (f.y + t.y) / 2
    const cx = mx + (mx - 220) * 0.3 + curveOut * ((t.y - f.y) / 200)
    const cy = my + (my - 220) * 0.3 - curveOut * ((t.x - f.x) / 200)
    return `M ${f.x} ${f.y} Q ${cx} ${cy} ${t.x} ${t.y}`
  }

  const arcs = [
    { from: -90, to: 0 },
    { from: 0, to: 90 },
    { from: 90, to: 180 },
    { from: 180, to: -90 + 360 },
  ]

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 440 440" style={{ width: '100%', maxWidth: 440, overflow: 'visible' }}>
        <defs>
          <marker id="arrowRed"    markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#EF4444" />
          </marker>
          <marker id="arrowAmber"  markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={C.amber} />
          </marker>
          <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill={C.purple} />
          </marker>
          <marker id="arrowDark"   markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#374151" />
          </marker>
        </defs>

        {/* Arc arrows */}
        {[
          { from: -90, to: 0,   marker: 'url(#arrowAmber)',  color: C.amber  },
          { from: 0,   to: 90,  marker: 'url(#arrowPurple)', color: C.purple },
          { from: 90,  to: 180, marker: 'url(#arrowDark)',   color: '#374151' },
          { from: 180, to: 270, marker: 'url(#arrowRed)',    color: '#EF4444' },
        ].map((arc, i) => (
          <motion.path key={i}
            d={arcPath(arc.from, arc.to)}
            fill="none" stroke={arc.color} strokeWidth={2} opacity={0.7}
            markerEnd={arc.marker}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
            transition={{ duration: 0.7, delay: 0.4 + i * 0.15, ease: EASE }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const p = toXY(n.angle, n.r)
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE }}
            >
              <circle cx={p.x} cy={p.y} r={42} fill={n.pale} stroke={n.color} strokeWidth={1.5} />
              {n.label.split('\n').map((line, li) => (
                <text key={li} x={p.x} y={p.y + (li - (n.label.split('\n').length - 1) / 2) * 12}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={8} fill={n.color} fontFamily="'Space Mono', monospace" fontWeight="700"
                >{line}</text>
              ))}
            </motion.g>
          )
        })}

        {/* Center label */}
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}>
          <text x={220} y={213} textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill={C.mid} fontFamily="'Space Mono', monospace" fontWeight="700"
            letterSpacing="1">VICIOUS</text>
          <text x={220} y={227} textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill={C.mid} fontFamily="'Space Mono', monospace" fontWeight="700"
            letterSpacing="1">CYCLE</text>
        </motion.g>
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// SECTIONS
// ═══════════════════════════════════════════════════════

// ─── Hero / Overview ─────────────────────────────────
function HeroSection() {
  return (
    <section id="overview" style={{ background: C.dark, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${C.blue}10 1px, transparent 1px), linear-gradient(90deg, ${C.blue}10 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        opacity: 0.4,
      }} />

      {/* Blue accent blob */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.18, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '10%', right: '-8%',
          width: 520, height: 520, borderRadius: '50%',
          background: `radial-gradient(circle, ${C.blue}60, transparent 70%)`,
        }}
      />

      <Wrap>
        <div style={{ paddingTop: 'clamp(7rem,14vw,10rem)', paddingBottom: 'clamp(4rem,6vw,6rem)' }}>
          <MaskReveal delay={0.1}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.62rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: C.blue,
            }}>NID · Mobile App · 2 Weeks</span>
          </MaskReveal>

          <MaskReveal delay={0.2}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(3rem,8vw,6.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: C.white,
              margin: '1.25rem 0 0',
            }}>Study<br />Buddy</h1>
          </MaskReveal>

          <Reveal delay={0.35}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.1rem,2.5vw,1.5rem)',
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 560,
              lineHeight: 1.6,
              marginTop: '1.5rem',
            }}>
              An AI-powered learning companion that helps students study smarter — transforming notes into videos, optimising focus with Pomodoro, and boosting memory through science-backed mnemonics.
            </p>
          </Reveal>

          {/* Tag row */}
          <Reveal delay={0.5}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2rem' }}>
              {['Systems Thinking', 'UX Research', 'UI Design', 'Education in India'].map(t => (
                <span key={t} style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '5px 12px',
                  borderRadius: '99px',
                }}>{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </Wrap>

      {/* Metadata strip */}
      <div style={{ background: C.white, borderTop: `1px solid ${C.border}` }}>
        <Wrap>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1px',
            paddingTop: '2rem', paddingBottom: '2rem',
          }}>
            {[
              { label: 'Timeline', value: '2 Weeks' },
              { label: 'Institution', value: 'NID — National Institute of Design' },
              { label: 'Collaborators', value: 'Manali Boudh · Sravan P' },
              { label: 'Mentors', value: 'Jagriti Galphade · Athul Dinesh' },
              { label: 'Tools', value: 'Figma · Miro' },
              { label: 'Output', value: 'Mobile App Prototype' },
            ].map((m, i) => (
              <Reveal key={m.label} delay={0.1 + i * 0.05}>
                <div style={{ paddingRight: '1.5rem' }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.55rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.muted,
                    display: 'block',
                    marginBottom: '4px',
                  }}>{m.label}</span>
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: C.ink,
                    lineHeight: 1.4,
                  }}>{m.value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      </div>
    </section>
  )
}

// ─── Why This Topic ───────────────────────────────────
function WhySection() {
  return (
    <section style={{ background: C.white, ...PAD }}>
      <Wrap>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><SectionTag>Why This Topic</SectionTag></Reveal>
          <MaskReveal delay={0.1}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.8rem,4vw,2.8rem)',
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
              Education in India is a complex, deeply layered system that offers rich opportunities for applying systems thinking and design. It's an interconnected system with visible gaps that can foster real impact. Evolving technological integration, along with our personal relevance and familiarity, pushed us to pursue this topic.
            </p>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Systems Section ──────────────────────────────────
function SystemsSection() {
  return (
    <section id="systems" style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Reveal><Label>Systems Thinking Process</Label></Reveal>

        {/* Two-stage process */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1px',
          background: C.border,
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: 'clamp(3rem,5vw,5rem)',
        }}>
          {[
            {
              num: '01', title: 'Discovery & Define',
              steps: ['Systems Actor Map', 'Knowledge Graph', 'Identification of Subsystems', 'Initial System Mapping', 'Feedback Loops', 'Gap Identification', 'Research & Insight Analysis'],
            },
            {
              num: '02', title: 'Applied',
              steps: ['Built on research insights to redesign products', 'Focused on user experience & screen-based interfaces', 'Applied systems approach to understand ecosystems', 'Defined focused design briefs'],
            },
          ].map((stage, i) => (
            <Reveal key={stage.num} delay={i * 0.1}>
              <div style={{ background: C.white, padding: 'clamp(1.5rem,3vw,2.5rem)' }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  color: C.blue,
                  marginBottom: '0.75rem',
                }}>STAGE {stage.num}</div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: C.ink,
                  marginBottom: '1.25rem',
                }}>{stage.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {stage.steps.map((step, j) => (
                    <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, marginTop: '0.45em', flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', color: C.mid, lineHeight: 1.5 }}>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Actor Map */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '0.5rem' }}>
            Actor Map
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.mid, marginBottom: '2rem', maxWidth: 600 }}>
            Three concentric layers of stakeholders — primary actors at the core, supported by secondary bodies and influenced by tertiary forces in the outer ring.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ background: C.white, borderRadius: '16px', padding: 'clamp(1.5rem,3vw,3rem)', border: `1px solid ${C.border}`, marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <ActorMap />
          </div>
        </Reveal>

        {/* Knowledge Graph */}
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <Label>Figma Artefact</Label>
            <ImgBox label="Knowledge Graph — Stakeholder Relationship Network" aspect="50%" />
          </div>
        </Reveal>

        {/* Sub-systems */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '0.5rem' }}>
            8 Sub-Systems of Formal Education
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.mid, marginBottom: '2rem', maxWidth: 600 }}>
            Mapping the surrounding systems that shape, constrain, and enable formal education in India.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ background: C.white, borderRadius: '16px', padding: 'clamp(1.5rem,3vw,3rem)', border: `1px solid ${C.border}`, marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <SubsystemsMap />
          </div>
        </Reveal>

        {/* System Map I */}
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <Label>Figma Artefact</Label>
            <ImgBox label="System Map I — Initial System Mapping" aspect="50%" />
          </div>
        </Reveal>

        {/* Feedback Loops */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '0.5rem' }}>
            Feedback Loops
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.mid, marginBottom: '2rem', maxWidth: 640 }}>
            Highlights dynamic interdependencies — influence of technology, career pressure, policy reforms, and awareness on student motivation and outcomes. Identifying reinforcing and balancing loops helps uncover leverage points for systemic change.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <ImgBox label="Feedback Loops — Reinforcing & Balancing Dynamics" aspect="45%" />
          </div>
        </Reveal>

        {/* HMW 1 */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.dark, borderRadius: '16px',
            padding: 'clamp(2rem,4vw,3.5rem)',
            marginTop: 'clamp(2rem,4vw,3.5rem)',
          }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.blue, display: 'block', marginBottom: '1.25rem' }}>HOW MIGHT WE</span>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.3rem,3vw,2rem)',
              color: C.white,
              lineHeight: 1.55,
              maxWidth: 680,
            }}>
              "How might we design systems that provide real-time motivation and track small achievements to boost confidence for students?"
            </p>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Research Section ─────────────────────────────────
function ResearchSection() {
  const insights = [
    { n: '01', text: 'Motivation fluctuates with exam stress; autonomy boosts recovery' },
    { n: '02', text: 'Students prefer flexible, self-paced, and interactive learning' },
    { n: '03', text: 'Teacher appreciation motivates more than grades alone' },
    { n: '04', text: 'Burnout and pressure are common across age groups' },
    { n: '05', text: 'Learning lacks personalisation, relevance & real-world connection' },
    { n: '06', text: 'Support systems are uneven; reliance on textbooks & external help persists' },
  ]

  return (
    <section id="research" style={{ background: C.white, ...PAD }}>
      <Wrap>
        <Reveal><Label>Primary Research</Label></Reveal>

        {/* System Map II */}
        <Reveal delay={0.05}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '0.5rem' }}>
              System Map II — Student Motivation Focus
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.mid, marginBottom: '1.5rem', maxWidth: 560 }}>
              Diverging on more factors with the emerging idea of student motivation as a central leverage point.
            </p>
            <ImgBox label="System Map II — Student Motivation Focus" aspect="48%" />
          </div>
        </Reveal>

        {/* Research Insights */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '2rem' }}>
            6 Research Insights
          </h3>
        </Reveal>
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1px',
          background: C.border,
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: 'clamp(2.5rem,4vw,4rem)',
        }}>
          {insights.map((ins) => (
            <StaggerItem key={ins.n}>
              <div style={{
                background: C.white,
                padding: '1.75rem',
                height: '100%',
              }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: C.blue,
                  marginBottom: '0.75rem',
                }}>{ins.n}</div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.1rem',
                  color: C.ink,
                  lineHeight: 1.6,
                  margin: 0,
                }}>{ins.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Target Audience pull quote */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.bluePale,
            border: `1.5px solid ${C.blue}30`,
            borderRadius: '16px',
            padding: 'clamp(1.75rem,3vw,2.75rem)',
            display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
          }}>
            <div style={{
              background: C.blue,
              borderRadius: '10px',
              padding: '10px',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.blue, marginBottom: '0.5rem' }}>Target Audience</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem,2vw,1.35rem)', color: C.ink, margin: 0 }}>
                Students 13+ years of age, primarily from upper-middle class income groups
              </p>
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Define Section ───────────────────────────────────
function DefineSection() {
  const quotes = [
    '"She didn\'t just teach from textbooks — she told stories, connected events to real life, and encouraged discussions that made us think critically."',
    '"More than demotivation, it\'s procrastination."',
    '"If I had managed to put every effort I would have definitely scored more."',
    '"The fear of getting bad grades made me highly motivated — so that my parents would let my passion come over."',
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
              Study Buddy is an AI-powered learning companion that helps students study smarter by transforming notes into engaging video explanations, optimising focus through personalised Pomodoro sessions, and enhancing memory retention using science-backed mnemonics — all while tracking progress to show real learning gains. This all-in-one app combines cognitive psychology with smart technology to make studying more effective, efficient, and enjoyable.
            </p>
          </Reveal>
        </div>

        {/* Research Voices */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: C.ink, marginBottom: '1.5rem' }}>
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
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: '12px',
                padding: '1.5rem',
                height: '100%',
              }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem',
                  color: C.blue,
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
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '0.5rem' }}>
            Information Architecture
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.mid, marginBottom: '2rem', maxWidth: 560 }}>
            App structure across five primary sections, each with 3–4 focused sub-screens.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{
            background: C.white, borderRadius: '16px',
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
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.blue, display: 'block', marginBottom: '1.25rem' }}>HOW MIGHT WE</span>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem,2.8vw,1.85rem)',
              color: C.white,
              lineHeight: 1.55,
              maxWidth: 700,
            }}>
              "How might we create an interface that keeps students motivated by combining structured focus techniques with an engaging means to solve the approach of rote memorisation, giving them more time for their goals and interests?"
            </p>
          </div>
        </Reveal>

        {/* User Story */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.white, border: `1px solid ${C.border}`,
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
                  color: C.blue,
                  background: C.bluePale,
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

// ─── Personas Section ─────────────────────────────────
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
    <section id="personas" style={{ background: C.white, ...PAD }}>
      <Wrap>
        <Reveal><Label>User Personas & Empathy Map</Label></Reveal>

        {/* Empathy Map */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '0.5rem' }}>
            Empathy Map
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.mid, marginBottom: '2rem', maxWidth: 560 }}>
            What our primary user says, does, thinks, and feels — capturing the emotional landscape of a student who wants to do better.
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
                {/* Header */}
                <div style={{ background: p.color, padding: '2rem', position: 'relative' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem',
                  }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>{p.initials}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: 'white', margin: '0 0 4px' }}>{p.name}</h4>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em' }}>{p.age} · {p.context}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '1.75rem' }}>
                  {/* Quote */}
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

                  {/* Personality */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Personality</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.ink }}>{p.personality}</span>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Learning Style</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.ink }}>{p.learningStyle}</span>
                  </div>

                  {/* 3-col grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {[
                      { title: 'Needs', items: p.needs, dot: p.color },
                      { title: 'Challenges', items: p.challenges, dot: '#EF4444' },
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

// ─── Design System Section ────────────────────────────
function DesignSystemSection() {
  const colors = [
    { name: 'Primary Blue', hex: '#2561E8', role: 'CTA · Nav · Highlights' },
    { name: 'Pale Blue', hex: '#ECF1FD', role: 'Backgrounds · Chips' },
    { name: 'Violet', hex: '#7C3AED', role: 'Focus Sessions' },
    { name: 'Pink', hex: '#FF4B8F', role: 'Memorisation · Alerts' },
    { name: 'Green', hex: '#00CC70', role: 'Success · Streaks' },
    { name: 'Amber', hex: '#F59E0B', role: 'Warnings · Motivation' },
    { name: 'Ink', hex: '#1A1A1A', role: 'Primary Text' },
    { name: 'Muted', hex: '#888888', role: 'Captions · Labels' },
  ]

  return (
    <section id="design-system" style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Reveal><Label>Design System</Label></Reveal>

        {/* Grid + Type */}
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: 'clamp(2.5rem,4vw,4rem)',
        }}>
          <StaggerItem>
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '1.75rem', height: '100%' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.blue, marginBottom: '0.75rem' }}>GRID SYSTEM</div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.ink, marginBottom: '1rem' }}>16px Baseline Grid</h4>
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
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '1.75rem', height: '100%' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.purple, marginBottom: '0.75rem' }}>TYPOGRAPHY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: C.ink, lineHeight: 1 }}>Absans</div>
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
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '1.75rem', height: '100%' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.pink, marginBottom: '0.75rem' }}>TARGET ENERGY</div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.ink, marginBottom: '0.75rem' }}>Fresh · Youthful · Focused</h4>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>
                Palette chosen to resonate with 13+ age group — vibrant enough to feel energetic, restrained enough to aid focus during long study sessions.
              </p>
            </div>
          </StaggerItem>
        </StaggerGrid>

        {/* Colour Palette */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: C.ink, marginBottom: '1.25rem' }}>Colour Palette</h3>
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
                  border: col.hex === '#F9F8F6' ? `1px solid ${C.border}` : 'none',
                }} />
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.72rem', color: C.ink, marginBottom: '2px' }}>{col.name}</div>
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

// ─── Features Section ─────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      num: '01', name: 'Home Dashboard', color: C.blue,
      desc: 'Centralised overview — today\'s plan, quick-start shortcuts, and streak status at a glance.',
      badge: 'Dashboard',
      imgLabel: 'Home Dashboard — Daily Overview UI',
    },
    {
      num: '02', name: 'Focus Sessions', color: C.purple,
      desc: 'Pomodoro timer with quirky localisation, micro-interactions, dynamic motivating stickers, and contextually relevant illustrations. 25 min work → 5 min break → 4 cycles → longer break.',
      badge: 'Productivity',
      imgLabel: 'Focus Sessions — Pomodoro Timer UI',
    },
    {
      num: '03', name: 'Mnemonics & Memorisation', color: C.pink,
      desc: 'Assisted memorisation through imagery and organisation. Acronyms, vivid mental images, structured formats. Flow: Intro → Upload → Analyse → Generate.',
      badge: 'Memory',
      imgLabel: 'Mnemonics Flow — Upload & Analyse UI',
    },
    {
      num: '04', name: 'Behavioural Activation', color: C.green,
      desc: 'Effective planning through draggable routine tags, customisable logs, and activity ratings. Breaks the vicious cycle of demotivation → procrastination → decreased activity → guilt.',
      badge: 'Habit',
      imgLabel: 'Plan My Day — Routine Builder UI',
    },
    {
      num: '05', name: 'Stats & Profile', color: C.amber,
      desc: 'Check-in dashboard with editable avatar, progress sorted across different time periods, streaks, and achievement history.',
      badge: 'Analytics',
      imgLabel: 'Profile & Stats — Analytics Dashboard UI',
    },
    {
      num: '06', name: 'Video Playback', color: C.ink,
      desc: 'AI-generated video player with brightness adjustment, 10-second skip controls, captions, speed adjustment, and lock screen support.',
      badge: 'Media',
      imgLabel: 'Video Player — AI-Generated Explanation UI',
    },
  ]

  return (
    <section id="features" style={{ background: C.white, ...PAD }}>
      <Wrap>
        <Reveal><Label>App Features</Label></Reveal>

        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: 'clamp(3rem,5vw,5rem)',
        }}>
          {features.map(f => (
            <StaggerItem key={f.num}>
              <div style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: '16px',
                overflow: 'hidden',
                height: '100%',
                display: 'flex', flexDirection: 'column',
              }}>
                <ImgBox label={f.imgLabel} aspect="62%" />
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', color: C.muted }}>{f.num}</span>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.55rem', letterSpacing: '0.1em',
                      color: f.color, background: f.color + '18',
                      padding: '3px 8px', borderRadius: '99px',
                    }}>{f.badge}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: C.ink, marginBottom: '0.5rem' }}>{f.name}</h4>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Behavioural Cycle diagram */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '0.5rem' }}>
            Behavioural Activation — Breaking the Vicious Cycle
          </h3>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.mid, marginBottom: '2rem', maxWidth: 600 }}>
            Consciously rating activities and building routines interrupts the self-reinforcing loop of demotivation.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '16px', padding: 'clamp(1.5rem,3vw,3rem)', marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <BehaviouralCycle />
          </div>
        </Reveal>

        {/* Scan to Video Flow */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.ink, marginBottom: '1.5rem' }}>
            Scan to Video — 3-Step Flow
          </h3>
        </Reveal>
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: 'clamp(2rem,4vw,3.5rem)',
        }}>
          {[
            { step: '01', title: 'Begin Scanning Notes', desc: 'Point camera at handwritten or printed notes to begin AI analysis.' },
            { step: '02', title: 'Play Video', desc: 'AI generates a personalised video explanation from the scanned content.' },
            { step: '03', title: 'Saved to Profile', desc: 'Video is automatically saved in your Profile section for later review.' },
          ].map(s => (
            <StaggerItem key={s.step}>
              <div style={{ background: C.bluePale, borderRadius: '12px', padding: '1.5rem', height: '100%' }}>
                <ImgBox label={`Step ${s.step} — ${s.title}`} aspect="80%" style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.5)' }} />
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', color: C.blue, marginBottom: '6px' }}>STEP {s.step}</div>
                <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.ink, marginBottom: '6px' }}>{s.title}</h4>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Accessibility Section ────────────────────────────
function AccessibilitySection() {
  const pour = [
    {
      letter: 'P', title: 'Perceivable', color: C.blue, pale: C.bluePale,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ),
      items: ['High-contrast, youthful colour palette with clear hierarchy', 'Typography system (Perfect Fifth / 8pt grid) ensures legibility', 'Visual cues (stickers, avatars, streak icons) provide multi-sensory feedback'],
    },
    {
      letter: 'O', title: 'Operable', color: C.purple, pale: '#F3EFFE',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      items: ['Simple, tap-based interaction model with minimal scroll depth', 'Micro-interactions add meaningful haptic + visual feedback', 'Consistent navigation structure across all sections'],
    },
    {
      letter: 'U', title: 'Understandable', color: C.green, pale: '#E6F9F2',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      ),
      items: ['Gamified flow and mascot feedback simplify complex functions', 'Onboarding uses familiar metaphors — streaks, tasks, achievements', 'Progress visualisation reinforces sense of control and ownership'],
    },
    {
      letter: 'R', title: 'Robust', color: C.amber, pale: '#FFFBEB',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      items: ['Built on standard mobile design frameworks (Figma prototype)', 'Structure supports integration with LMS & AI-based assistant', 'Scalable architecture for future platform expansion'],
    },
  ]

  return (
    <section id="accessibility" style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Reveal><Label>Accessibility — POUR Framework</Label></Reveal>
        <Reveal>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2.2rem)', color: C.ink, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Designed for every learner
          </h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: C.mid, marginBottom: '2.5rem', maxWidth: 560 }}>
            Study Buddy is evaluated against the POUR principles — ensuring the app works for students with diverse abilities and contexts.
          </p>
        </Reveal>
        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
        }}>
          {pour.map(p => (
            <StaggerItem key={p.letter}>
              <div style={{
                background: p.pale,
                border: `1px solid ${p.color}20`,
                borderRadius: '16px',
                padding: '1.75rem',
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', color: p.color }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '10px',
                    background: p.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', flexShrink: 0,
                  }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '1rem', fontWeight: 700, color: p.color, lineHeight: 1 }}>{p.letter}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.ink }}>{p.title}</div>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: p.color, marginTop: '0.45em', flexShrink: 0 }} />
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

// ─── Reflections Section ──────────────────────────────
function ReflectionsSection() {
  const reflections = [
    {
      n: '01',
      text: '"Motivation is systemic. It grows when systems reinforce small wins, not just grades."',
    },
    {
      n: '02',
      text: '"Progress isn\'t about pace, but about presence — for us and students alike."',
    },
    {
      n: '03',
      text: '"Productivity follows when learning feels rewarding."',
    },
    {
      n: '04',
      text: '"We can leverage technology as a mirror — reflecting back progress and building belief."',
    },
  ]

  return (
    <section id="reflections" style={{ background: C.dark, ...PAD }}>
      <Wrap>
        <Reveal>
          <Label light>Project Reflections</Label>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1.8rem,4vw,2.8rem)',
            color: C.white,
            letterSpacing: '-0.02em',
            marginBottom: 'clamp(2rem,4vw,3.5rem)',
          }}>What we took away</h2>
        </Reveal>

        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: 'clamp(3rem,5vw,5rem)',
        }}>
          {reflections.map((r, i) => (
            <StaggerItem key={r.n}>
              <div style={{ background: '#111111', padding: '2.25rem', height: '100%' }}>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.58rem',
                  letterSpacing: '0.22em',
                  color: C.blue,
                  marginBottom: '1.25rem',
                }}>{r.n}</div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.05rem,2vw,1.25rem)',
                  color: 'rgba(255,255,255,0.82)',
                  lineHeight: 1.65,
                  margin: 0,
                }}>{r.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Closing */}
        <Reveal delay={0.2}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', gap: '1.25rem',
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1rem,2vw,1.2rem)',
              color: 'rgba(255,255,255,0.45)',
              maxWidth: 560,
              lineHeight: 1.75,
              margin: 0,
            }}>
              Study Buddy began as a systems exercise and evolved into a genuine attempt to make learning feel worth showing up for.
            </p>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ═══════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════
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
