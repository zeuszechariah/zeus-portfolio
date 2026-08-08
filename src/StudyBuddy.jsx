import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import { Nav, Footer, ProgressBar, MaskReveal, Reveal, BackToTop } from './shared.jsx'

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
  { id: 'design-system', label: 'Design' },
  { id: 'reflections',   label: 'Reflect' },
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
      fontSize: '0.58rem',
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
      fontSize: '0.58rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: light ? 'rgba(255,255,255,0.3)' : C.muted,
      display: 'block',
      marginBottom: '1.5rem',
    }}>
      <span style={{ color: light ? 'rgba(255,100,172,0.5)' : C.pink, marginRight: '0.5em', letterSpacing: 0 }}>|</span>
      {children}
    </span>
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
          fontSize: '0.58rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
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
      fontSize: '0.58rem',
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
        fontSize: '0.58rem',
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
        <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, margin: 0, fontFamily: "'Syne', sans-serif" }}>{text}</p>
      </div>
    </div>
  )
}

// ─── Pinch Hint ──────────────────────────────────────────
function PinchHint() {
  return (
    <p className="sb-pinch-hint" style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: '0.75rem',
      color: C.muted,
      textAlign: 'right',
      marginTop: '0.5rem',
      opacity: 0.5,
    }}>(pinch to zoom)</p>
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

function StaggerItem({ children, style = {}, className = '' }) {
  return (
    <motion.div className={className} style={{ display: 'flex', flexDirection: 'column', ...style }}
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
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h, { passive: true })
    return () => window.removeEventListener('resize', h)
  }, [])

  function scrollTo(id) {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.pageYOffset - 68
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }

  if (isMobile) {
    const activeIndex = NAV_SECTIONS.findIndex(s => s.id === active)
    const activeSection = NAV_SECTIONS[activeIndex] || NAV_SECTIONS[0]
    const activeNum = String(activeIndex + 1).padStart(2, '0')

    return (
      <>
        {/* Backdrop */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="pill-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 598, background: 'rgba(0,0,0,0.06)' }}
            />
          )}
        </AnimatePresence>

        {/* Section list — glassmorphism overlay, centred */}
        <AnimatePresence>
          {open && (
            <div style={{ position: 'fixed', bottom: `calc(2rem + 54px)`, left: '50%', transform: 'translateX(-50%)', zIndex: 599 }}>
            <motion.div
              key="pill-menu"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.24, ease: EASE }}
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                borderRadius: '20px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.38)',
                padding: '8px 6px',
                minWidth: '220px',
              }}
            >
              {NAV_SECTIONS.map((sec, i) => {
                const isActive = sec.id === active
                const num = String(i + 1).padStart(2, '0')
                return (
                  <button key={sec.id}
                    onClick={() => { scrollTo(sec.id); setOpen(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      width: '100%', background: isActive ? 'rgba(255,255,255,0.28)' : 'transparent',
                      border: 'none', borderRadius: '12px', padding: '11px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: isActive ? C.ink : 'rgba(0,0,0,0.4)', letterSpacing: '0.12em' }}>{num}</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', color: isActive ? C.ink : 'rgba(0,0,0,0.55)', fontWeight: isActive ? 500 : 400 }}>{sec.label}</span>
                  </button>
                )
              })}
            </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating pill with inset edge */}
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 600 }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(175deg, rgba(36,36,36,0.96) 0%, rgba(8,8,8,0.99) 100%)',
              border: 'none', borderRadius: '99px',
              padding: '11px 18px 11px 15px', cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.55)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>{activeNum}</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: '#ffffff', fontWeight: 500 }}>{activeSection.label}</span>
            <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
              width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginLeft: '2px' }}>
              <path d="M2 4L6 8L10 4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </button>
        </div>
      </>
    )
  }

  return (
    <div style={{ position: 'fixed', left: 'clamp(10px, 1.5vw, 22px)', top: '50%', transform: 'translateY(-50%)', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
        setActive(ids[ids.length - 1])
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const observers = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-10% 0px -35% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      observers.forEach(o => o.disconnect())
    }
  }, [])
  return active
}

import ActorMap        from './components/diagrams/study-buddy/ActorMap.jsx'
import SubSystems      from './components/diagrams/study-buddy/SubSystems.jsx'
import FeedbackLoops   from './components/diagrams/study-buddy/FeedbackLoops.jsx'
import SystemMap       from './components/diagrams/study-buddy/SystemMap.jsx'
import SystemMapII     from './components/diagrams/study-buddy/SystemMapII.jsx'
import EcosystemDiagram from './components/diagrams/study-buddy/EcosystemDiagram.jsx'

// ─── LEGACY (not rendered) ────────────────────────────────
function _ActorMapLegacy() {
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
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.mid }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── LEGACY inline SubsystemsMap (kept as reference, not rendered) ─
function _SubsystemsMapLegacy() {
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
        <path d="M12 3A3 3 0 006 6a3 3 0 00-3 4 3 3 0 002 5h14a3 3 0 002-5 3 3 0 00-3-4 3 3 0 00-6-3z"
          stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="10" cy="19" r="1.3" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="22.3" r="0.85" stroke="currentColor" strokeWidth="1.4" />
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

const EMPATHY_ICONS = [
  {
    // Says — pink circle, top-left: cx=63.12/820.38, cy=65.27/517.14
    left: '7.70%', top: '12.62%',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    // Does — yellow circle, top-right: cx=757.26/820.38, cy=63.12/517.14
    left: '92.31%', top: '12.20%',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#414042" strokeWidth="1.8" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" stroke="#414042" strokeWidth="1.8" strokeLinejoin="round" />
        <line x1="9" y1="13" x2="15" y2="13" stroke="#414042" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="9" y1="17" x2="12" y2="17" stroke="#414042" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    // Thinks — blue circle, bottom-left: cx=63.12/820.38, cy=322.22/517.14
    left: '7.70%', top: '62.30%',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 3A3 3 0 006 6a3 3 0 00-3 4 3 3 0 002 5h14a3 3 0 002-5 3 3 0 00-3-4 3 3 0 00-6-3z"
          stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="10" cy="19" r="1.3" stroke="#fff" strokeWidth="1.4" />
        <circle cx="8" cy="22.3" r="0.85" stroke="#fff" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    // Feels — green circle, bottom-right: cx=757.26/820.38, cy=322.22/517.14
    left: '92.31%', top: '62.30%',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#414042" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function EmpathyMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
      style={{ position: 'relative', width: '100%' }}
    >
      <img
        src="/sb-empathy-map.svg"
        alt="Empathy Map"
        loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', display: 'block' }}
      />
      {/* Centre person photo — overlaid on the SVG circle (cx=423/820.38, cy=192.95/517.14, r=102.27) */}
      <div style={{
        position: 'absolute',
        left: '51.57%',
        top: '37.32%',
        transform: 'translate(-50%, -50%)',
        width: '24.93%',
        aspectRatio: '1',
        borderRadius: '50%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        <img src="/sb-empathy-person.png" alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>
      {EMPATHY_ICONS.map((item, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: item.left,
            top: item.top,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {item.icon}
        </div>
      ))}
    </motion.div>
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
              fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem',
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
                    fontSize: '0.58rem',
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
                      fontSize: '0.58rem',
                      letterSpacing: '0.05em',
                      color: C.mid,
                      textAlign: 'center',
                      textTransform: 'uppercase',
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

// ─── helpers for BehaviouralCycle ─────────────────────────
const clampP = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const rangeP = (p, a, b) => clampP((p - a) / (b - a), 0, 1)
function lerpHex(c1, c2, t) {
  const h = s => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)]
  const [r1,g1,b1] = h(c1), [r2,g2,b2] = h(c2)
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`
}

// ─── 5. Behavioural Cycle — GSAP pinned scrub ─────────────
function BehaviouralCycle() {
  const sectionRef = useRef(null)
  const [p, setP] = useState(0)   // 0 → 1 scroll progress

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const isMob = window.innerWidth < 768
    if (isMob) {
      setP(1)
      return
    }
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=850',
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => setP(self.progress),
        },
      }).to({}, { duration: 1 })
    }, el)
    // Every time the document height changes (lazy images, Framer Motion reveals,
    // fonts) the pin offset becomes stale. ResizeObserver re-measures immediately.
    let roTimer = null
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer)
      roTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(document.body)

    // Belt-and-suspenders: timed refreshes for the first few seconds
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 900)
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 2000)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(roTimer)
      window.removeEventListener('load', onLoad)
      ro.disconnect()
      ctx.revert()
    }
  }, [])

  const cx = 260, cy = 265
  const GREY = '#9CA3AF'
  const nodeR = 78, nodeD = 200

  const loop    = 1 - rangeP(p, 0.05, 0.45)
  const flower  = rangeP(p, 0.35, 0.68)
  const stemPct = rangeP(p, 0.55, 0.82)
  const faceCol = lerpHex(GREY, C.yellow, rangeP(p, 0.28, 0.60))
  const sadOp   = 1 - rangeP(p, 0.28, 0.55)
  const smileOp = rangeP(p, 0.44, 0.68)
  const quoteOp = rangeP(p, 0.65, 0.85)
  const quoteY  = 20 - 20 * rangeP(p, 0.65, 0.85)

  const nodes = [
    { lx: cx,       ly: cy-nodeD, label: 'Demotivated\nFeeling' },
    { lx: cx+nodeD, ly: cy,       label: 'Procrastination\n& Low Energy' },
    { lx: cx,       ly: cy+nodeD, label: 'Decrease in\nActivity' },
    { lx: cx-nodeD, ly: cy,       label: 'Increased\nGuilt' },
  ]
  const arrows = [
    `M ${cx+nodeR} ${cy-nodeD} Q ${cx+nodeD} ${cy-nodeD} ${cx+nodeD} ${cy-nodeR}`,
    `M ${cx+nodeD} ${cy+nodeR} Q ${cx+nodeD} ${cy+nodeD} ${cx+nodeR} ${cy+nodeD}`,
    `M ${cx-nodeR} ${cy+nodeD} Q ${cx-nodeD} ${cy+nodeD} ${cx-nodeD} ${cy+nodeR}`,
    `M ${cx-nodeD} ${cy-nodeR} Q ${cx-nodeD} ${cy-nodeD} ${cx-nodeR} ${cy-nodeD}`,
  ]

  const stemY1 = cy + 148
  const stemLen = 580 - stemY1
  const stemDash = `${stemLen * stemPct} ${stemLen}`

  return (
    <div ref={sectionRef} style={{ position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: 'clamp(2rem,4vw,4rem) 0' }}>
        <svg viewBox="0 0 520 700" style={{ width: '100%', maxWidth: 620, overflow: 'visible' }}>
          <defs>
            <marker id="arrowLoop2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L7,3 L0,6 Z" fill={GREY} opacity="0.7" />
            </marker>
          </defs>

          {/* ── STEM drawn first so it sits behind everything ── */}
          <g style={{ opacity: flower }}>
            <line x1={cx} y1={stemY1} x2={cx} y2={580}
              stroke={C.green} strokeWidth={9} strokeLinecap="round"
              strokeDasharray={stemDash}
            />
          </g>

          {/* ── FLOWER petals — fades in ── */}
          <g style={{ opacity: flower }}>
            <ellipse cx={cx}    cy={cy-88} rx={60} ry={80} fill={C.diagramPink} />
            <ellipse cx={cx+88} cy={cy}    rx={80} ry={60} fill={C.diagramPink} />
            <ellipse cx={cx}    cy={cy+88} rx={60} ry={80} fill={C.diagramPink} />
            <ellipse cx={cx-88} cy={cy}    rx={80} ry={60} fill={C.diagramPink} />
          </g>

          {/* ── LOOP — fades out ── */}
          <g style={{ opacity: loop }}>
            {arrows.map((d, i) => (
              <path key={i} d={d} fill="none" stroke={GREY} strokeWidth={1.5} opacity={0.6} markerEnd="url(#arrowLoop2)" />
            ))}
            {nodes.map((node, i) => (
              <g key={i}>
                <circle cx={node.lx} cy={node.ly} r={nodeR} fill={GREY} opacity={0.9} />
                {node.label.split('\n').map((line, li) => (
                  <text key={li} x={node.lx}
                    y={node.ly + (li - (node.label.split('\n').length - 1) / 2) * 13}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={12} fill="white" fontFamily="'Syne', sans-serif"
                  >{line}</text>
                ))}
              </g>
            ))}
          </g>

          {/* ── CENTER FACE — rendered last (on top) ── */}
          <circle cx={cx} cy={cy} r={72} fill={faceCol} />
          <circle cx={cx-16} cy={cy-12} r={5} fill={C.dark} />
          <circle cx={cx+16} cy={cy-12} r={5} fill={C.dark} />
          <path d={`M ${cx-18} ${cy+20} Q ${cx} ${cy+8} ${cx+18} ${cy+20}`}
            fill="none" stroke={C.dark} strokeWidth={3.5} strokeLinecap="round" opacity={sadOp} />
          <path d={`M ${cx-18} ${cy+8} Q ${cx} ${cy+24} ${cx+18} ${cy+8}`}
            fill="none" stroke={C.dark} strokeWidth={3.5} strokeLinecap="round" opacity={smileOp} />
        </svg>

        <p style={{ opacity: quoteOp, transform: `translateY(${quoteY}px)`,
          fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic',
          fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: C.ink,
          lineHeight: 1.3, textAlign: 'center', maxWidth: 480, margin: 0, transition: 'none',
        }}>
          "One's academic life shouldn't feel grey"
        </p>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: C.mid, textAlign: 'center', maxWidth: 400, opacity: quoteOp }}>
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
    <div id="overview" style={{ position: 'relative', paddingTop: 'clamp(7rem,12vw,11rem)', paddingBottom: 'clamp(5rem,8vw,8rem)', overflow: 'hidden' }}>
      <img src="/hero-studybuddy.jpg" aria-hidden="true" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(6,21,40,0.92) 0%, rgba(6,21,40,0.82) 40%, rgba(6,21,40,0.55) 68%, rgba(6,21,40,0.25) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
        <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.22)', padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem' }}>UX Design · Systems Thinking</span>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08, color: '#FFFFFF', margin: '0 0 1.75rem', maxWidth: '18ch' }}>
          Study Buddy
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.78)', maxWidth: '52ch', margin: '0 0 3rem' }}>
          Millions of students know exactly what they want to achieve, but they just can't seem to get there consistently. Study Buddy is a mobile app I co-designed with a team at NID to give students a system that actually works.
        </p>
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { l: 'Timeline',      v: '6 Weeks' },
            { l: 'Collaborators', v: 'Manali Boudh, Sravan P' },
            { l: 'Tools',         v: 'Figma · Miro' },
            { l: 'Output',        v: 'Mobile App Prototype' },
          ].map(m => (
            <div key={m.l}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#FFFFFF', margin: 0 }}>{m.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
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
              fontSize: 'clamp(1.75rem,3.5vw,2.75rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: C.ink,
              marginBottom: '1.5rem',
            }}>I started with a question that felt <em style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', color: '#7C3AED' }}>personal</em></h2>
          </MaskReveal>
          <Reveal delay={0.2}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.9rem',
              color: C.mid,
              lineHeight: 1.75,
              maxWidth: '70ch',
              margin: '0 auto',
              textAlign: 'left',
            }}>
              I grew up watching students, myself included, grind through subjects they didn't understand, for exams that valued recall over meaning. That frustration brought our team to Indian education as a design space. It's a <strong style={{ color: C.ink, fontWeight: 600 }}>deeply layered system with visible failures</strong>, and those failures compound: students who disengage, lose confidence, and stop believing they can get better at learning. We chose to start where the problem felt most immediate: <strong style={{ color: C.ink, fontWeight: 600 }}>the student trying to get through tomorrow</strong>.
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
        <Reveal><SectionTag>Systems</SectionTag></Reveal>
        <MaskReveal delay={0.05}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.1 }}>
            Thinking before designing
          </h2>
        </MaskReveal>

        <Reveal delay={0.1}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.75, maxWidth: 640, marginBottom: 'clamp(2rem,3.5vw,3rem)' }}>
            Before designing anything, I needed to understand the system I was stepping into. We used systems thinking not as a formality, but as a way to test whether our instincts about the problem were correct, and to find where design could actually create change.
          </p>
        </Reveal>

        {/* Double Diamond */}
        <Reveal>
          <div style={{ marginBottom: 'clamp(2rem,3vw,2.5rem)' }}>
            <svg viewBox="0 0 840 220" style={{ width: '100%', display: 'block' }}>
              {/* Diamond 1 */}
              <polygon points="20,110 210,8 400,110 210,212"
                fill={C.card} stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
              {/* Vertical divider D1 — pink */}
              <line x1="210" y1="16" x2="210" y2="204"
                stroke={C.pink} strokeWidth="0.7" strokeDasharray="3 3" strokeOpacity="0.45" />
              {/* D1 number + title */}
              <text x="210" y="95" textAnchor="middle" dominantBaseline="middle"
                fontSize="6.5" fontFamily="'Space Mono', monospace" fill={C.muted} letterSpacing="0.2em">01</text>
              <text x="210" y="112" textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fontFamily="'Syne', sans-serif" fill={C.ink} fontWeight="500">Discover &amp; Define</text>
              {/* Diamond 2 — left vertex touches D1 right vertex at (400,110) */}
              <polygon points="400,110 610,8 820,110 610,212"
                fill={C.card} stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
              {/* Vertical divider D2 — blue */}
              <line x1="610" y1="16" x2="610" y2="204"
                stroke={C.blue} strokeWidth="0.7" strokeDasharray="3 3" strokeOpacity="0.45" />
              {/* D2 number + title */}
              <text x="610" y="95" textAnchor="middle" dominantBaseline="middle"
                fontSize="6.5" fontFamily="'Space Mono', monospace" fill={C.muted} letterSpacing="0.2em">02</text>
              <text x="610" y="112" textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fontFamily="'Syne', sans-serif" fill={C.ink} fontWeight="500">Design &amp; Deliver</text>
            </svg>
            {/* Step lists aligned to each diamond */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '0.75rem' }}>
              <div style={{ paddingLeft: '2%', paddingRight: '4%' }}>
                {['Actor Map', 'Knowledge Graph', 'Sub-systems', 'System Mapping', 'Feedback Loops', 'Gap Analysis', 'Research'].map((s, j, arr) => (
                  <div key={s} style={{
                    fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', color: C.mid,
                    padding: '4px 0', borderBottom: j < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}>{s}</div>
                ))}
              </div>
              <div style={{ paddingLeft: '4%', paddingRight: '2%' }}>
                {['Research-led Redesign', 'UX & Screen Design', 'Systems Approach', 'Design Briefs'].map((s, j, arr) => (
                  <div key={s} style={{
                    fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', color: C.mid,
                    padding: '4px 0', borderBottom: j < arr.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Actor Map — editorial layout */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div className="sb-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start', marginBottom: 'clamp(1.5rem,2.5vw,2.5rem)' }}>
            <div>
              <Reveal><p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.75rem' }}>Actor Map</p></Reveal>
              <Reveal delay={0.05}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, marginBottom: '1rem' }}><span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Stakeholder</span> Ecosystem</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                  We mapped everyone who touches a student's learning journey: <em>students and teachers at the core, parents and institutions in the middle, policy and technology at the edges.</em> What became clear: the students we were designing for sit at the centre of a system they have the least control over.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.05}>
              <div style={{ background: C.card, borderRadius: '14px', padding: 'clamp(1.25rem,2.5vw,1.75rem)', boxShadow: '6px 6px 18px rgba(0,0,0,0.07), -4px -4px 12px rgba(255,255,255,0.85)' }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.ink, margin: '0 0 0.9rem', lineHeight: 1.25 }}>
                  <em style={{ fontStyle: 'italic' }}>How</em> was this helpful?
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.ink, fontSize: '0.9rem', flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: 0 }}>
                    This layered view helps <strong style={{ color: C.ink }}>identify relationships and power dynamics between all stakeholders</strong> in the education ecosystem.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="sb-diagram">
              <ActorMap />
              <PinchHint />
            </div>
          </Reveal>
        </div>

        {/* Knowledge Graph — editorial layout */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div className="sb-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start', marginBottom: 'clamp(1.5rem,2.5vw,2.5rem)' }}>
            <div>
              <Reveal><p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.75rem' }}>Knowledge Graph</p></Reveal>
              <Reveal delay={0.05}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, marginBottom: '1rem' }}><span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Connecting</span> the Dots</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                  The actor map told us who was involved. <strong style={{ color: C.ink }}>This told us why.</strong> Mapping the relationships between forces revealed where tensions compound and where a small shift could create a real ripple.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.05}>
              <div style={{ background: C.card, borderRadius: '14px', padding: 'clamp(1.25rem,2.5vw,1.75rem)', boxShadow: '6px 6px 18px rgba(0,0,0,0.07), -4px -4px 12px rgba(255,255,255,0.85)' }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.ink, margin: '0 0 0.9rem', lineHeight: 1.25 }}>
                  <em style={{ fontStyle: 'italic' }}>How</em> was this helpful?
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.ink, fontSize: '0.9rem', flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: 0 }}>
                    This helped <strong style={{ color: C.ink }}>identify leverage points</strong> where <em>design intervention could create maximum impact.</em>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="sb-diagram">
            <EcosystemDiagram />
            <PinchHint />
          </div>
        </div>

        {/* Sub-systems — editorial layout */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div className="sb-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start', marginBottom: 'clamp(1.5rem,2.5vw,2.5rem)' }}>
            <div>
              <Reveal><p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.75rem' }}>Sub-systems</p></Reveal>
              <Reveal delay={0.05}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, marginBottom: '1rem' }}><span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Sub-Systems</span> of Formal Education</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: C.ink }}>Formal education doesn't exist in isolation.</strong> We identified eight surrounding systems: <em>family, infrastructure, exam culture, peers, technology, policy, economy, and aspiration.</em> Understanding what constrains and enables learning came before we ever touched the product brief.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.05}>
              <div style={{ background: C.card, borderRadius: '14px', padding: 'clamp(1.25rem,2.5vw,1.75rem)', boxShadow: '6px 6px 18px rgba(0,0,0,0.07), -4px -4px 12px rgba(255,255,255,0.85)' }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.ink, margin: '0 0 0.9rem', lineHeight: 1.25 }}>
                  <em style={{ fontStyle: 'italic' }}>How</em> was this helpful?
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.ink, fontSize: '0.9rem', flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: 0 }}>
                    Mapping these helps in <strong style={{ color: C.ink }}>understanding systemic complexity and focusing deeper into the system map</strong>.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="sb-diagram">
              <SubSystems />
              <PinchHint />
            </div>
          </Reveal>
        </div>

        {/* System Map I */}
        <Reveal delay={0.1}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <Label>System Map I</Label>
            <div className="sb-diagram">
              <SystemMap />
              <PinchHint />
            </div>
          </div>
        </Reveal>

        {/* Feedback Loops — editorial layout */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <div className="sb-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'start', marginBottom: 'clamp(1.5rem,2.5vw,2.5rem)' }}>
            <div>
              <Reveal><p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.75rem' }}>Feedback Loops</p></Reveal>
              <Reveal delay={0.05}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, marginBottom: '1rem' }}>Reinforcing & Balancing Loops</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, margin: 0 }}>
                  This is where the <strong style={{ color: C.ink }}>systems work crystallised.</strong> Mapping the reinforcing and balancing loops, examining how career pressure feeds exam anxiety, how small wins build habit, and how peer environment shapes consistency, <em>gave us the leverage points worth designing for.</em>
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.05}>
              <div style={{ background: C.card, borderRadius: '14px', padding: 'clamp(1.25rem,2.5vw,1.75rem)', boxShadow: '6px 6px 18px rgba(0,0,0,0.07), -4px -4px 12px rgba(255,255,255,0.85)' }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.ink, margin: '0 0 0.9rem', lineHeight: 1.25 }}>
                  <em style={{ fontStyle: 'italic' }}>How</em> was this helpful?
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.ink, fontSize: '0.9rem', flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.mid, margin: 0 }}>
                    Identifying reinforcing and balancing loops helps uncover leverage points for systemic change, where <strong style={{ color: C.ink }}>a small intervention creates large ripple effects.</strong>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="sb-diagram">
              <FeedbackLoops />
              <PinchHint />
            </div>
          </Reveal>
        </div>

        {/* HMW 1 */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.dark,
            borderRadius: '14px',
            padding: 'clamp(2rem,4vw,3.5rem)',
            marginTop: 'clamp(2rem,4vw,3.5rem)',
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.darkMuted,
              display: 'block',
              marginBottom: '0.5rem',
              textAlign: 'left',
            }}>HOW MIGHT WE</span>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
              textAlign: 'left',
            }}>Motivation & Real-Time Achievement</h3>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.3rem,3vw,2rem)',
              color: '#FFFFFF',
              lineHeight: 1.55,
              maxWidth: 680,
              margin: '0 auto',
              textAlign: 'left',
            }}>
              "How might we design systems that provide real-time motivation and track small achievements to boost confidence for students?"
            </p>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Survey Insights ─────────────────────────────────────
function SurveyInsights() {
  // Project palette
  const P = { pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00', yellow: '#FAFF38' }

  const challenges = [
    { label: 'Lack of focus / distractions', pct: 71.6 },
    { label: 'Stress & pressure from parents/exams', pct: 50.4 },
    { label: 'Not understanding concepts clearly', pct: 41.8 },
    { label: 'Lack of interest in subjects', pct: 22 },
    { label: 'No proper study environment', pct: 14.9 },
  ]
  const enjoyable = [
    { label: 'Real-world applications of concepts', pct: 68.1 },
    { label: 'Personalised learning at my own pace', pct: 49.6 },
    { label: 'Practical experiments', pct: 47.5 },
    { label: 'Interactive classes', pct: 46.1 },
    { label: 'Group activities & discussions', pct: 41.8 },
    { label: 'Technology (videos, apps, games)', pct: 35.5 },
  ]
  // colour-coded: green = intrinsic/positive, blue = extrinsic, pink = fear-based
  const motivators = [
    { label: 'Personal interest in the subject', pct: 63.8, color: P.green },
    { label: 'Good grades & academic recognition', pct: 46.8, color: P.blue },
    { label: 'Future career goals', pct: 34,   color: P.blue },
    { label: 'Competition with peers',          pct: 29.8, color: P.blue },
    { label: 'Fear of failure',                 pct: 28.4, color: P.pink },
    { label: "Teacher's encouragement",         pct: 6.4,  color: P.blue },
  ]
  const studyMethods = [
    { label: 'Reading textbooks & notes',        pct: 73.8 },
    { label: 'Attending in-person lectures',     pct: 62.4 },
    { label: 'Watching online lectures/videos',  pct: 58.2 },
    { label: 'Practising with problem sets',     pct: 43.9 },
    { label: 'Group study discussions',          pct: 36.2 },
    { label: 'Using AI tools for explanations',  pct: 20.6 },
  ]
  // bar colour signals motivation level: pink=low, blue=mid peak, green=high
  const motivationScale = [
    { n: '1', pct: 3.5,  color: P.pink },
    { n: '2', pct: 7.1,  color: P.pink },
    { n: '3', pct: 35.5, color: P.blue },
    { n: '4', pct: 41.1, color: P.blue },
    { n: '5', pct: 12.8, color: P.green },
  ]
  const scaleMax = 41.1

  const pressureSegments = [
    { label: 'Yes, a lot', pct: 40.4, color: P.pink },
    { label: 'Sometimes',  pct: 41.1, color: P.blue },
    { label: 'Not really', pct: 18.4, color: P.green },
  ]

  const DK = { bg: C.dark, border: '1px solid rgba(255,255,255,0.07)', ink: C.darkInk, mid: C.darkMid, muted: C.darkMuted, track: 'rgba(255,255,255,0.09)' }
  function DarkCard({ children, style = {} }) {
    return <div style={{ background: DK.bg, borderRadius: '14px', border: DK.border, padding: 'clamp(1.25rem,2.5vw,2rem)', ...style }}>{children}</div>
  }
  function HBar({ label, pct, accent }) {
    return (
      <div style={{ marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: DK.ink, lineHeight: 1.3 }}>{label}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: accent, letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0, marginLeft: '0.75rem', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: DK.track, borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: accent, borderRadius: 2 }} />
        </div>
      </div>
    )
  }

  function CardLabel({ children }) {
    return (
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: DK.muted, textTransform: 'uppercase', marginBottom: '1.25rem' }}>{children}</div>
    )
  }

  return (
    <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>

      {/* Stat strip */}
      <Reveal>
        <div className="sb-stat3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
          {[
            { n: '141',   label: 'students surveyed across school & college', sub: 'Sample size',   color: P.yellow },
            { n: '71.6%', label: 'cite lack of focus as their #1 challenge',  sub: 'Top challenge', color: P.pink },
            { n: '81.5%', label: 'feel pressured by grades and exams',        sub: '"Yes, a lot" + "Sometimes"', color: P.pink },
          ].map(s => (
            <DarkCard key={s.n}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 'clamp(1.9rem,4vw,2.8rem)', color: s.color, lineHeight: 1, marginBottom: '0.5rem' }}>{s.n}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: DK.mid, lineHeight: 1.45, marginBottom: '0.75rem' }}>{s.label}</div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', color: DK.muted, textTransform: 'uppercase' }}>{s.sub}</span>
            </DarkCard>
          ))}
        </div>
      </Reveal>

      {/* Challenges (pink) + What makes it enjoyable (green) */}
      <Reveal delay={0.08}>
        <div className="sb-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
          <DarkCard>
            <CardLabel>Biggest challenges (select up to 2) · 141 responses</CardLabel>
            {challenges.map(c => <HBar key={c.label} label={c.label} pct={c.pct} accent={P.pink} />)}
          </DarkCard>
          <DarkCard>
            <CardLabel>What makes learning enjoyable · 141 responses</CardLabel>
            {enjoyable.map(e => <HBar key={e.label} label={e.label} pct={e.pct} accent={P.green} />)}
          </DarkCard>
        </div>
      </Reveal>

      {/* Motivation scale */}
      <Reveal delay={0.08}>
        <DarkCard style={{ marginBottom: 'clamp(1.5rem,3vw,2.5rem)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <CardLabel>How motivated are/were you to study? · 141 responses</CardLabel>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: DK.mid }}>Rated 1–5 &nbsp;·&nbsp; 1 = Not at all &nbsp;·&nbsp; 5 = Highly motivated</div>
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontStyle: 'italic', fontSize: '0.9rem', color: DK.muted, maxWidth: 260, textAlign: 'right', lineHeight: 1.5 }}>
              <span style={{ color: P.yellow, fontStyle: 'normal', fontWeight: 600 }}>76.6%</span> rated themselves a 3 or 4 — willing but inconsistent.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.6rem', height: 88 }}>
            {motivationScale.map(m => (
              <div key={m.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: m.color, fontWeight: 700, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{m.pct}%</span>
                <div style={{ width: '100%', height: `${(m.pct / scaleMax) * 60}px`, background: m.color, borderRadius: '3px 3px 0 0', opacity: m.pct < 10 ? 0.55 : 1 }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: m.color, fontWeight: 700, textTransform: 'uppercase' }}>{m.n}</span>
              </div>
            ))}
          </div>
        </DarkCard>
      </Reveal>

      {/* Motivators + Study methods — equal-height 2-col */}
      <Reveal delay={0.08}>
        <div className="sb-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: 'clamp(1.5rem,3vw,2.5rem)', alignItems: 'stretch' }}>
          <DarkCard style={{ display: 'flex', flexDirection: 'column' }}>
            <CardLabel>What motivates them most (select up to 3) · 141 responses</CardLabel>
            {motivators.map(m => <HBar key={m.label} label={m.label} pct={m.pct} accent={m.color === P.blue ? P.yellow : m.color} />)}
          </DarkCard>
          <DarkCard style={{ display: 'flex', flexDirection: 'column' }}>
            <CardLabel>How they usually study · 141 responses</CardLabel>
            {studyMethods.map(s => <HBar key={s.label} label={s.label} pct={s.pct} accent={P.yellow} />)}
          </DarkCard>
        </div>
      </Reveal>

      {/* Grade pressure — full width */}
      <Reveal delay={0.08}>
        <DarkCard>
          <CardLabel>Do you feel pressured by grades & exams?</CardLabel>
          <div style={{ display: 'flex', gap: 2, marginBottom: '0.6rem', borderRadius: 4, overflow: 'hidden' }}>
            {pressureSegments.map(g => (
              <div key={g.label} style={{ flex: g.pct, height: 8, background: g.color }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {pressureSegments.map(g => (
              <div key={g.label} style={{ flex: g.pct, minWidth: 0 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: g.color, lineHeight: 1 }}>{g.pct}%</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', color: DK.muted, marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.label}</div>
              </div>
            ))}
          </div>
        </DarkCard>
      </Reveal>
    </div>
  )
}

// ─── Research Section ─────────────────────────────────────
function ResearchSection() {
  const insights = [
    { text: 'Procrastination more than demotivation, it\'s what holds students back.', keyword: 'Procrastination', color: C.ink },
    { text: 'Distraction and procrastination are the leading barriers to consistent study.', keyword: 'Distraction', color: C.mid },
    { text: 'Memorising without understanding — studying without meaning is just that.', keyword: 'Memorising without understanding', color: C.ink },
    { text: 'Fear of bad grades motivates many students more than genuine interest.', keyword: 'Fear of bad grades', color: C.mid },
    { text: 'Put every effort — I would have definitely scored more.', keyword: 'Put every effort', color: C.ink },
    { text: 'Keep them going — students need something to, not just reminders.', keyword: 'Keep them going', color: C.mid },
  ]

  function HighlightText({ text, keyword, color }) {
    if (!keyword || !text.includes(keyword)) {
      return <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.ink }}>{text}</span>
    }
    const parts = text.split(keyword)
    return (
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: C.ink }}>
        {parts[0]}
        <span style={{ color, fontWeight: 500 }}>{keyword}</span>
        {parts[1]}
      </span>
    )
  }

  return (
    <section id="research" style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal><SectionTag>Research</SectionTag></Reveal>
        <MaskReveal delay={0.05}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.1 }}>
            What students actually said
          </h2>
        </MaskReveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.75, maxWidth: 640, marginBottom: 'clamp(2rem,3.5vw,3rem)' }}>
            The systems maps pointed toward student motivation as a central leverage point. We went into <em>primary research to test whether that held, and to hear what students actually had to say about how they study.</em>
          </p>
        </Reveal>

        {/* System Map II */}
        <Reveal delay={0.05}>
          <div style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)' }}>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
              color: C.ink,
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>
              System Map II — Student Motivation Focus
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 560 }}>
              As interviews progressed, <strong style={{ color: C.ink }}>motivation kept surfacing, not as one issue among many, but as the thread connecting almost everything else.</strong> This map zoomed in: what is motivation actually connected to, and where does it consistently break down?
            </p>
            <div className="sb-diagram">
              <SystemMapII />
              <PinchHint />
            </div>
          </div>
        </Reveal>

        {/* Research Insights — outlined cards, 3×2 grid */}
        <Reveal>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.1rem,2vw,1.35rem)',
            color: C.ink,
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
          }}>
            What students actually told us
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
                background: C.card,
                borderRadius: '14px',
                padding: '1.5rem 1.75rem',
                boxShadow: C.neuSm,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: C.ink, margin: 0, fontFamily: "'Syne', sans-serif", flex: 1 }}>
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
            borderRadius: '14px',
            padding: 'clamp(1.75rem,3vw,2.75rem)',
            textAlign: 'left',
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
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
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
        <Reveal><SectionTag>Define</SectionTag></Reveal>
        <MaskReveal delay={0.05}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.25rem', lineHeight: 1.1 }}>
            <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Translating</span> research into direction
          </h2>
        </MaskReveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.75, maxWidth: 640, marginBottom: 'clamp(2rem,3.5vw,3rem)' }}>
            The research was clear about the problem. Now I had to define what we were actually building, making sure every feature had a reason rooted in what we heard, not what seemed like a good idea.
          </p>
        </Reveal>

        {/* Product Definition */}
        <div style={{ marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <Reveal>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.75rem' }}>Product Definition</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.9rem',
              color: C.mid,
              lineHeight: 1.75,
              maxWidth: '70ch',
              margin: '0.5rem 0 0',
            }}>
              Study Buddy is an <strong style={{ color: C.ink, fontWeight: 600 }}>AI-powered learning companion</strong> that helps students study smarter by transforming notes into engaging video explanations, optimising focus through personalised Pomodoro sessions, and enhancing memory retention using <strong style={{ color: C.ink, fontWeight: 600 }}>science-backed mnemonics</strong>, all while tracking progress to show real learning gains. This all-in-one app combines cognitive psychology with smart technology to make studying more effective, efficient, and enjoyable.
            </p>
          </Reveal>
        </div>

        {/* Research Voices */}
        <Reveal>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.1rem,2vw,1.35rem)',
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
          {quotes.map((q, i) => {
            const voiceColors = ['#FE60AC', '#4A5DE2', '#A6CA00', '#CE93D8', '#22C55E', '#FE60AC']
            return (
            <StaggerItem key={i}>
              <div style={{
                background: C.card,
                borderRadius: '14px',
                padding: '1.5rem',
                boxShadow: C.neuSm,
                height: '100%',
              }}>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.9rem',
                  color: C.mid,
                  lineHeight: 1.7,
                  margin: 0,
                  borderLeft: `2px solid ${C.border}`,
                  paddingLeft: '0.75rem',
                }}>{q.replace(/^"|"$/g, '')}</p>
              </div>
            </StaggerItem>
          )})}
        </StaggerGrid>

        {/* Survey Insights */}
        <div style={{ marginTop: 'clamp(2.5rem,4vw,4rem)' }}>
          <Reveal>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
              color: C.ink,
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>
              Survey Data — 141 Students
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '1.75rem' }}>
              A structured questionnaire across 12 questions revealed clear patterns in how students study, what motivates them, and where they consistently fall short.
            </p>
          </Reveal>
          <SurveyInsights />
        </div>

      </Wrap>
    </section>
  )
}

// ─── IA + HMW + User Story (after Personas) ───────────────
function PostPersonasSection() {
  return (
    <section style={{ background: C.bg, ...PAD }}>
      <Wrap>
        {/* IA Diagram */}
        <Reveal>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.1rem,2vw,1.35rem)',
            color: C.ink,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}>
            Information Architecture
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560 }}>
            Every feature had to earn its place. The IA reflects that: five core sections, each mapped directly to a problem we heard in research.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="sb-diagram" style={{
            background: C.surface, borderRadius: '16px',
            padding: 'clamp(1.5rem,3vw,2.5rem)',
            border: `1px solid ${C.border}`,
            marginBottom: 'clamp(2.5rem,4vw,4rem)',
            overflowX: 'auto',
          }}>
            <IADiagram />
            <PinchHint />
          </div>
        </Reveal>

        {/* HMW Interface Design & Study Experience */}
        <Reveal delay={0.1}>
          <div style={{
            background: C.dark,
            borderRadius: '14px',
            padding: 'clamp(2rem,4vw,3.5rem)',
            marginBottom: 'clamp(2.5rem,4vw,4rem)',
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.darkMuted,
              display: 'block',
              marginBottom: '0.5rem',
            }}>HOW MIGHT WE</span>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '1.5rem',
              letterSpacing: '-0.01em',
            }}>Interface Design & Study Experience</h3>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem,2.8vw,1.85rem)',
              color: '#FFFFFF',
              lineHeight: 1.55,
              maxWidth: 700,
              margin: '0 auto',
              textAlign: 'left',
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
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
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
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
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
      quote: <>"I know I can do well if I just stay consistent… I just need something to really…. keep<br />me going."</>,
      personality: 'Ambitious, tech-savvy, struggles with consistency',
      learningStyle: <><strong style={{ fontWeight: 600 }}>Enjoys interactive and gamified learning</strong>; gets bored with repetitive tasks</>,
      needs: ['Structured Study Plan', 'External Motivation', 'Engaging & Fun Learning', 'Short & Effective Study Sessions', 'Social Connection'],
      challenges: ['Procrastination', 'Easily Distracted', 'Lack of Study Consistency', 'Overwhelmed by Large Tasks'],
      opportunities: ['Streak-Based Motivation', 'Pomodoro-Style Focus Mode', 'Accountability Buddy System', 'Personalised Study Challenges'],
      color: C.blue,
      borderColor: '#CE93D8',
      initials: 'AM',
      photo: '/persona-aarav.jpg',
      photoStyle: { objectPosition: 'center 20%' },
    },
    {
      name: 'Riya Sharma', age: '15 years',
      context: 'Upper-middle-class · Private CBSE · Delhi',
      quote: '"I\'ll study hard for one day, then forget everything by week\'s end. There\'s got to be a better way to remember."',
      personality: 'Social, artistic, impatient with slow progress',
      learningStyle: <strong style={{ fontWeight: 600 }}>Retains best through videos and interactive content</strong>,
      needs: ['Bite-sized study sessions', 'Visual explanations', 'Progress tracking', 'Fun breaks', 'Friendly competition'],
      challenges: ['Loses focus after 20 minutes', 'Forgets concepts quickly', 'Procrastinates on revision', 'Overwhelmed by syllabus'],
      opportunities: ['AI Video Notes', 'Focus Timer with motivational alerts', 'Memory Games (spaced repetition)', 'Study Squad', 'Progress Mascot'],
      color: C.pink,
      borderColor: '#FE60AC',
      initials: 'RS',
      photo: '/persona-riya.jpg',
      photoStyle: { objectPosition: 'center 72%' },
    },
  ]

  return (
    <section id="personas" style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal><SectionTag>Personas</SectionTag></Reveal>
        <MaskReveal delay={0.05}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.ink, margin: '0 0 1.75rem', lineHeight: 1.1 }}>
            <span style={{ background: 'linear-gradient(to bottom, transparent 60%, #FFE566 60%)', paddingBottom: '1px', display: 'inline' }}>Who</span> we were designing for
          </h2>
        </MaskReveal>

        {/* Persona cards — CSS subgrid so sections align across both cards */}
        <StaggerGrid className="sb-persona-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto auto auto auto',
          gap: '0 1.5rem',
        }}>
          {personas.map((p) => (
            <StaggerItem key={p.name} className="sb-persona-item" style={{
              display: 'grid',
              gridTemplateRows: 'subgrid',
              gridRow: 'span 5',
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {/* Row 1: Photo / colour header */}
              <div>
                {p.photo ? (
                  <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                    <img src={p.photo} alt={p.name}
                      loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...p.photoStyle }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(6,21,40,0.85) 0%, rgba(6,21,40,0.18) 55%, transparent 100%)',
                    }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem 1.75rem' }}>
                      <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: 'white', margin: '0 0 4px' }}>{p.name}</h4>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.age} · {p.context}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: p.color, padding: '2rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: 'white' }}>{p.initials}</span>
                    </div>
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: 'white', margin: '0 0 4px' }}>{p.name}</h4>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em' }}>{p.age} · {p.context}</span>
                  </div>
                )}
              </div>

              {/* Row 2: Quote */}
              <div style={{ padding: '1.75rem 1.75rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
                <p style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: 'normal',
                  fontSize: 'clamp(1.2rem,2.2vw,1.5rem)',
                  color: C.mid,
                  lineHeight: 1.25,
                  borderLeft: `3px solid ${p.borderColor || p.color}`,
                  paddingLeft: '1rem',
                  margin: 0,
                }}>{p.quote}</p>
              </div>

              {/* Row 3: Personality */}
              <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Personality</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.ink }}>{p.personality}</span>
              </div>

              {/* Row 4: Learning Style */}
              <div style={{ padding: '1.25rem 1.75rem', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.15em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Learning Style</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.ink }}>{p.learningStyle}</span>
              </div>

              {/* Row 5: Needs / Challenges / Opportunities */}
              <div style={{ padding: '1.25rem 1.75rem 1.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  {[
                    { title: 'Needs',         items: p.needs,         dot: p.color },
                    { title: 'Challenges',    items: p.challenges,    dot: C.pink },
                    { title: 'Opportunities', items: p.opportunities, dot: C.green },
                  ].map(col => (
                    <div key={col.title}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.58rem', letterSpacing: '0.1em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{col.title}</span>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {col.items.map((item, ii) => (
                          <li key={ii} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: col.dot, marginTop: '0.45em', flexShrink: 0 }} />
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.mid, lineHeight: 1.45, textTransform: 'uppercase' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Empathy Map */}
        <Reveal delay={0.1}>
          <div style={{ marginTop: 'clamp(5rem,8vw,8rem)' }}>
            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(1.1rem,2vw,1.35rem)',
              color: C.ink,
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>
              Empathy Map
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 560 }}>
              What our primary user says, does, thinks, and feels, capturing the emotional landscape of a student who wants to do better.
            </p>
            <div style={{ maxWidth: 780, margin: '0 auto' }} className="sb-diagram">
              <EmpathyMap />
              <PinchHint />
            </div>
          </div>
        </Reveal>

      </Wrap>
    </section>
  )
}

// ─── Design System Section ────────────────────────────────
function DesignSystemSection() {
  const colors = [
    { name: 'Black',   hex: '#1A1919', role: 'Background · Dark UI' },
    { name: 'Pink',    hex: '#FE60AC', role: 'Primary CTA · Streaks · Badges' },
    { name: 'Blue',    hex: '#4A5DE2', role: 'Focus Timer · Sessions' },
    { name: 'Yellow',  hex: '#FAFF38', role: 'Highlights · Achievements' },
    { name: 'Green',   hex: '#A6CA00', role: 'Success · Progress' },
    { name: 'White',   hex: '#FFFFFF', role: 'Background · Light surfaces' },
  ]

  return (
    <section id="design-system" style={{ background: C.dark, ...PAD }}>
      <Wrap>
        <Reveal><SectionTag color="rgba(255,255,255,0.55)">Design System</SectionTag></Reveal>
        <MaskReveal delay={0.05}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', color: C.darkInk, margin: '0 0 1.75rem', lineHeight: 1.1 }}>
            The visual language
          </h2>
        </MaskReveal>

        <StaggerGrid style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: 'clamp(2.5rem,4vw,4rem)',
        }}>
          <StaggerItem>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.75rem', height: '100%' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.darkMuted, marginBottom: '0.75rem' }}>GRID SYSTEM</div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.darkInk, marginBottom: '1rem' }}>16px Baseline Grid</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['16px margin & gutter space', '8pt baseline grid', 'Perfect Fifth scale (×1.5) for headers', 'Golden Ratio (×1.618) for incremental type'].map(item => (
                  <li key={item} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', textTransform: 'uppercase', color: C.darkMid, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', marginTop: '0.45em', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.75rem', height: '100%' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.darkMuted, marginBottom: '0.75rem' }}>TYPOGRAPHY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: "'AbSans', sans-serif", fontWeight: 500, fontSize: '2rem', color: C.darkInk, lineHeight: 1 }}>Absans</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.darkMuted, marginTop: '4px', textTransform: 'uppercase' }}>H1 · H2 · Content headings</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 500, fontSize: '1.5rem', color: C.darkMid, lineHeight: 1 }}>Urbanist</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.darkMuted, marginTop: '4px', textTransform: 'uppercase' }}>Body text · UI elements</div>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '1.75rem', height: '100%' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.darkMuted, marginBottom: '0.75rem' }}>TARGET ENERGY</div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.darkInk, marginBottom: '0.75rem' }}>Fresh · Youthful · Focused</h4>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.darkMid, lineHeight: 1.65, margin: 0 }}>
                Palette chosen to resonate with 13+ age group: vibrant enough to feel energetic, restrained enough to aid focus during long study sessions.
              </p>
            </div>
          </StaggerItem>
        </StaggerGrid>

        {/* Colour Palette */}
        <Reveal>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.darkInk, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>Colour Palette</h3>
        </Reveal>
        <StaggerGrid className="sb-6col" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px',
        }}>
          {colors.map(col => (
            <StaggerItem key={col.name}>
              <div>
                <div style={{
                  background: col.hex,
                  borderRadius: '8px',
                  height: '120px',
                  marginBottom: '8px',
                  border: col.hex === '#FFFFFF' ? `1px solid ${C.border}` : 'none',
                }} />
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.58rem', color: C.darkInk, marginBottom: '2px' }}>{col.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.darkMuted, marginBottom: '2px', textTransform: 'uppercase' }}>{col.hex}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.darkMuted, lineHeight: 1.4, textTransform: 'uppercase' }}>{col.role}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Mockups Section ──────────────────────────────────────
function MockupsSection() {
  const SB_PAGES = [1,2,3,4,5,6,7,8,9]
  return (
    <section id="mockups" style={{ background: C.bg, paddingTop: PAD.paddingTop, paddingBottom: 0 }}>
      <Wrap>
        {/* Page images — Wrap-width, stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          <Reveal delay={0}>
            <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', background: '#ffffff', isolation: 'isolate' }}>
              <img
                src="/sb-mockup-icon.png"
                alt="Study Buddy app icon on iPhone home screen"
                loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }}
              />
            </div>
          </Reveal>
          {SB_PAGES.map((n, i) => (
            <Reveal key={n} delay={i * 0.04}>
              <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', background: '#ffffff', isolation: 'isolate' }}>
                <img
                  src={`/sb-page-${n}.png`}
                  alt={`Study Buddy design — page ${n}`}
                  loading="lazy" decoding="async" style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }}
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Walkthrough video */}
        <Reveal delay={0.05}>
          <div style={{ marginBottom: 'clamp(2rem,4vw,3.5rem)' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: '0 0 0.75rem' }}>App Walkthrough</p>
            <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: C.neu, aspectRatio: '16/9' }}>
              <iframe width="100%" height="100%"
                src="https://www.youtube.com/embed/wV1lMz2Ebb4"
                title="Study Buddy App Walkthrough"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
              />
            </div>
          </div>
        </Reveal>

        {/* Behavioural Activation */}
        <div style={{ marginBottom: 0 }}>
          <Reveal delay={0.05}>
            <h2 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontWeight: 500,
              fontStyle: 'italic',
              fontSize: 'clamp(1.75rem,3.5vw,2.75rem)',
              letterSpacing: '-0.02em',
              color: C.ink,
              marginBottom: '0.75rem',
            }}>Behavioural Activation</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>
              <strong style={{ fontWeight: 600, color: C.ink }}>Effective planning</strong> through draggable routine tags, customisable logs, and activity ratings.<br />
              <strong style={{ fontWeight: 600, color: C.ink }}>Breaks the vicious cycle of demotivation, procrastination, decreased activity, and guilt.</strong>
            </p>
          </Reveal>
          <BehaviouralCycle />
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
        <Reveal><SectionTag>Accessibility</SectionTag></Reveal>
        <Reveal>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.75rem,3.5vw,2.75rem)',
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
        <StaggerGrid className="sb-2col" style={{
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
                    textTransform: 'uppercase',
                    color: C.ink,
                    lineHeight: 1,
                  }}>{p.letter}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: C.ink }}>{p.title}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {p.items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.border, marginTop: '0.45em', flexShrink: 0, border: `1px solid ${C.muted}` }} />
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.55 }}>{item}</span>
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
    <section id="reflections" style={{ background: '#0d0d0d', ...PAD }}>
      <Wrap>
        <Reveal>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#FE60AC', display: 'block', marginBottom: '1.25rem',
          }}>My Takeaway</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.75rem,3.5vw,2.75rem)',
            color: C.darkInk,
            letterSpacing: '-0.02em',
            marginBottom: 'clamp(2rem,4vw,3.5rem)',
          }}>What stayed with me</h2>
        </Reveal>

        <StaggerGrid className="sb-2col" style={{
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
                  textTransform: 'uppercase',
                  color: C.darkMuted,
                  marginBottom: '1.25rem',
                }}>{r.n}</div>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontStyle: 'italic',
                  fontSize: '0.9rem',
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
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.1rem,2vw,1.35rem)',
            color: C.darkMid,
            maxWidth: 560,
            lineHeight: 1.75,
            margin: '0 auto',
            textAlign: 'center',
          }}>
            Study Buddy started as a systems exercise. It ended as something I actually wanted students to use. By the time we finished, I understood, in a way I hadn't before, how much the right tools can change whether learning feels possible at all.
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
      <style>{`
        .sb-pinch-hint { display: none; }
        .sb-diagram { touch-action: pan-y pinch-zoom; }
        @media (max-width: 767px) {
          .sb-2col { grid-template-columns: 1fr !important; }
          .sb-stat3 { grid-template-columns: 1fr !important; }
          .sb-6col { grid-template-columns: repeat(3, 1fr) !important; }
          .sb-persona-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: unset !important;
            gap: 1.5rem !important;
          }
          .sb-persona-item {
            grid-row: auto !important;
            grid-template-rows: unset !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .sb-pinch-hint { display: block !important; }
        }
      `}</style>
      <ProgressBar />
      <Nav light photoHero />
      <SidebarNav active={active} />

      <main className="has-bottom-nav">
        <HeroSection />
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <Wrap>
            <p style={{ margin: 0, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase', padding: '0.7rem 0' }}>
              approx. 8 min quick read
            </p>
          </Wrap>
        </div>
        <WhySection />
        <SystemsSection />
        <ResearchSection />
        <DefineSection />
        <PersonasSection />
        <PostPersonasSection />
        <DesignSystemSection />
        <MockupsSection />
        <AccessibilitySection />
        <ReflectionsSection />
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
