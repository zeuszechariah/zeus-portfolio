import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal, BackToTop } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
const C = {
  page:    '#F3F0F9',
  surface: '#EAE5F5',
  card:    '#F7F4FC',
  neu:     '6px 6px 18px rgba(0,0,0,0.08), -4px -4px 12px rgba(255,255,255,0.88)',
  neuSm:   '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 7px rgba(255,255,255,0.9)',
  accent:  '#7C3AED',
  accentMid: '#8B5CF6',
  accentDim: 'rgba(124,58,237,0.08)',
  accentBorder: 'rgba(124,58,237,0.20)',
  pink:    '#EC4899',
  pinkDim: 'rgba(236,72,153,0.08)',
  dark:    '#1A0A2E',
  heroGrad: 'linear-gradient(145deg, #1A0A2E 0%, #3B0764 55%, #6D28D9 100%)',
  darkInk: '#F2EDE4',
  darkMid: 'rgba(242,237,228,0.65)',
  darkMuted: 'rgba(242,237,228,0.38)',
  white:   '#FFFFFF',
  bg:      '#F3F0F9',
  ink:     '#1A0A2E',
  mid:     '#4C3580',
  muted:   '#8B7AAE',
  border:  'rgba(0,0,0,0.08)',
  borderDark: 'rgba(255,255,255,0.07)',
  green:   '#10B981',
  greenDim:'rgba(16,185,129,0.08)',
  amber:   '#F59E0B',
}

const EASE = [0.22, 1, 0.36, 1]

// ─── Sidebar Sections ────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'problem',     label: 'Discovery' },
  { id: 'solution',    label: 'Strategy' },
  { id: 'ux',          label: 'Experience' },
  { id: 'reflections', label: 'Reflect' },
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
      fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,0.3)' : C.muted,
      display: 'block', marginBottom: '1.5rem',
    }}>{children}</span>
  )
}

function Sticker({ src, style = {} }) {
  return (
    <img src={src} alt="" aria-hidden="true" draggable={false} className="cc-sticker"
      loading="lazy" decoding="async" style={{ position: 'absolute', pointerEvents: 'none', userSelect: 'none', zIndex: 20, ...style }}
    />
  )
}

function CCStyles() {
  return (
    <style>{`
      @media (max-width: 767px) {
        .cc-sidebar  { display: none !important; /* replaced by inline mobile bar */ }
        .cc-sticker  { display: none !important; }
        .cc-people-svg { display: none !important; }
        .cc-g2, .cc-g3 { grid-template-columns: 1fr !important; }
        .cc-g5       { grid-template-columns: repeat(2, 1fr) !important; }
        .cc-arch-lbl { width: 72px !important; padding: 0.5rem 0.5rem !important; font-size: 0.5rem !important; }
        .cc-hero-meta { gap: 1.5rem !important; }
      }
      @media (min-width: 768px) and (max-width: 1023px) {
        .cc-g3 { grid-template-columns: repeat(2, 1fr) !important; }
        .cc-g5 { grid-template-columns: repeat(3, 1fr) !important; }
      }
    `}</style>
  )
}

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

function NeuCard({ children, style = {}, dark = false }) {
  if (dark) return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', boxShadow: '6px 6px 18px rgba(0,0,0,0.4), -3px -3px 10px rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', ...style }}>{children}</div>
  )
  return (
    <div style={{ background: C.card, borderRadius: '14px', boxShadow: C.neu, border: 'none', ...style }}>{children}</div>
  )
}

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
        <AnimatePresence>
          {open && (
            <motion.div key="pill-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }} onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 598, background: 'rgba(0,0,0,0.06)' }} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {open && (
            <div style={{ position: 'fixed', bottom: 'calc(2rem + 54px)', left: '50%', transform: 'translateX(-50%)', zIndex: 599 }}>
              <motion.div key="pill-menu" initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.24, ease: EASE }}
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.38)', padding: '8px 6px', minWidth: '220px' }}>
                {NAV_SECTIONS.map((sec, i) => {
                  const isActive = sec.id === active
                  const num = String(i + 1).padStart(2, '0')
                  return (
                    <button key={sec.id} onClick={() => { scrollTo(sec.id); setOpen(false) }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', background: isActive ? 'rgba(255,255,255,0.28)' : 'transparent', border: 'none', borderRadius: '12px', padding: '11px 16px', cursor: 'pointer' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: isActive ? C.ink : 'rgba(0,0,0,0.4)', letterSpacing: '0.12em' }}>{num}</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', color: isActive ? C.ink : 'rgba(0,0,0,0.55)', fontWeight: isActive ? 500 : 400 }}>{sec.label}</span>
                    </button>
                  )
                })}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 600 }}>
          <button onClick={() => setOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(175deg, rgba(36,36,36,0.96) 0%, rgba(8,8,8,0.99) 100%)', border: 'none', borderRadius: '99px', padding: '11px 18px 11px 15px', cursor: 'pointer', boxShadow: '0 8px 28px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.55)', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>{activeNum}</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: '#ffffff', fontWeight: 500 }}>{activeSection.label}</span>
            <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginLeft: '2px' }}>
              <path d="M2 4L6 8L10 4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="cc-sidebar" style={{ position: 'fixed', left: 'clamp(10px,1.5vw,22px)', top: '50%', transform: 'translateY(-50%)', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(id) }, { rootMargin: '-10% 0px -35% 0px', threshold: 0 })
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

// ─── People Map SVG ──────────────────────────────────────
function PeopleMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  const CX = 390, CY = 280, R = 200

  const roles = [
    { lines: ['Chief of', 'Staff'],    angle: 270, color: C.accentMid, cadence: 'Weekly',      focus: 'Ops & Execution' },
    { lines: ['Branding &', 'Mktg'],   angle: 342, color: C.pink,      cadence: 'Daily',        focus: 'Growth & Brand' },
    { lines: ['Tech', 'Lead'],          angle: 54,  color: '#0EA5E9',   cadence: 'Sprint-based', focus: 'Build & Feasibility' },
    { lines: ['Data', 'Analyst'],       angle: 126, color: C.green,     cadence: 'Bi-weekly',    focus: 'Match Intelligence' },
    { lines: ['UX', 'Lead'],            angle: 198, color: C.amber,     cadence: 'Continuous',   focus: 'Design & Flows' },
  ]

  const toXY = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180
    return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) }
  }

  return (
    <div ref={ref} className="cc-people-svg">
      <svg viewBox="0 0 780 560" width="100%" style={{ display: 'block', margin: '0 auto' }}>
        {/* Outer dashed ring */}
        <motion.circle cx={CX} cy={CY} r={R + 24}
          fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="5 9"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}
        />

        {/* Connection lines center to nodes */}
        {roles.map((role, i) => {
          const pos = toXY(role.angle, R)
          return (
            <motion.line key={`line-${i}`} x1={CX} y1={CY} x2={pos.x} y2={pos.y}
              stroke={`${role.color}55`} strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.75, delay: i * 0.1, ease: EASE }}
            />
          )
        })}

        {/* Pentagon ring between adjacent nodes */}
        {roles.map((role, i) => {
          const pos  = toXY(role.angle, R)
          const next = toXY(roles[(i + 1) % roles.length].angle, R)
          return (
            <motion.line key={`ring-${i}`} x1={pos.x} y1={pos.y} x2={next.x} y2={next.y}
              stroke={C.border} strokeWidth={1}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.65 + i * 0.08 }}
            />
          )
        })}

        {/* Cadence labels at midpoint of each spoke */}
        {roles.map((role, i) => {
          const mid = toXY(role.angle, R * 0.53)
          return (
            <motion.text key={`cadence-${i}`} x={mid.x} y={mid.y}
              textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 9.5, fill: C.muted, pointerEvents: 'none', letterSpacing: '0.08em' }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.75 + i * 0.07 }}
            >{role.cadence.toUpperCase()}</motion.text>
          )
        })}

        {/* CEO center node */}
        <motion.circle cx={CX} cy={CY} r={56}
          fill={C.accent}
          initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ transformOrigin: `${CX}px ${CY}px`, filter: 'drop-shadow(0 4px 16px rgba(124,58,237,0.3))' }}
        />
        <text x={CX} y={CY - 9} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, fill: '#fff' }}>CEO</text>
        <text x={CX} y={CY + 12} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, fill: 'rgba(255,255,255,0.65)', letterSpacing: '0.12em' }}>CLOUTCART</text>

        {/* Role nodes */}
        {roles.map((role, i) => {
          const pos = toXY(role.angle, R)
          return (
            <motion.g key={`role-${i}`}
              initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: EASE }}
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            >
              <circle cx={pos.x} cy={pos.y} r={46}
                fill={`${role.color}15`} stroke={role.color} strokeWidth={2}
                style={{ filter: 'drop-shadow(3px 3px 8px rgba(0,0,0,0.08)) drop-shadow(-2px -2px 5px rgba(255,255,255,0.85))' }}
              />
              {role.lines.map((line, li) => (
                <text key={li} x={pos.x} y={pos.y + (li - (role.lines.length - 1) / 2) * 15}
                  textAnchor="middle" dominantBaseline="middle"
                  style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fill: C.ink, fontWeight: 700, pointerEvents: 'none' }}
                >{line}</text>
              ))}
              <text x={pos.x} y={pos.y + 62} textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: 8.5, fill: C.muted, letterSpacing: '0.07em' }}
              >{role.focus.toUpperCase()}</text>
            </motion.g>
          )
        })}
      </svg>

      {/* Colour legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center', marginTop: '1.75rem' }}>
        {[['CEO', C.accent], ['Chief of Staff', C.accentMid], ['Branding & Marketing', C.pink], ['Tech Lead', '#0EA5E9'], ['Data Analyst', C.green], ['UX Lead', C.amber]].map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tech Architecture Diagram ───────────────────────────
function TechArchDiagram() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const layers = [
    { label: 'Users', color: C.accent, items: ['Brands (Web / Mobile)', 'Influencers (Mobile)'] },
    { label: 'Frontend', color: C.accentMid, items: ['React.js / Next.js (Web)', 'React Native (Mobile)', 'Onboarding · Profiles · Swipe · Dashboard · Subscriptions'] },
    { label: 'API Gateway', color: '#0EA5E9', items: ['REST / GraphQL · JWT Auth · Data validation · Request routing'] },
    { label: 'Backend Services', color: '#06B6D4', items: ['Auth · User Profile · Matchmaking · Swipe Mgmt · Subscriptions · Notifications · Admin APIs'] },
    { label: 'Match Engine', color: C.green, items: ['Phase 1: Rule-based filters & scoring', 'Phase 2: ML model with feedback loops and recommendations'] },
    { label: 'Database Layer', color: C.amber, items: ['PostgreSQL / Firestore · User & profile data · Swipe records · Subscriptions', 'Firebase Storage / S3 · Redis cache'] },
    { label: 'External Integrations', color: C.pink, items: ['Firebase Auth · Stripe / Razorpay · Cloudinary · SendGrid · Mixpanel · Sentry'] },
    { label: 'Admin & Analytics', color: C.muted, items: ['Internal monitoring · Mixpanel / Firebase Analytics · Sentry / LogRocket'] },
  ]

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {layers.map((layer, i) => (
        <motion.div key={layer.label}
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
          style={{ display: 'flex', alignItems: 'stretch', borderRadius: '10px', overflow: 'hidden', boxShadow: C.neuSm }}
        >
          <div className="cc-arch-lbl" style={{ background: layer.color, padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 140, flexShrink: 0, textAlign: 'center' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', fontWeight: 700, lineHeight: 1.4 }}>{layer.label}</span>
          </div>
          <div style={{ background: C.card, padding: '0.65rem 1.25rem', flex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
            {layer.items.map((item, j) => (
              <span key={j} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.mid, lineHeight: 1.5 }}>
                {item}{j < layer.items.length - 1 ? <span style={{ color: C.border, margin: '0 0.3rem' }}>·</span> : ''}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Hero Section ────────────────────────────────────────
function HeroSection() {
  return (
    <div id="overview" style={{ position: 'relative', backgroundImage: 'url(/cc-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 20%', paddingTop: 'clamp(7rem,12vw,11rem)', paddingBottom: 'clamp(5rem,8vw,8rem)', overflow: 'hidden' }}>
      {/* Dark overlay — keeps text readable over photo */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(26,10,46,0.94) 0%, rgba(59,7,100,0.78) 45%, rgba(109,40,217,0.38) 80%, rgba(26,10,46,0.15) 100%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
        <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.22)', padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem' }}>Product Strategy · Creator Economy</span>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', lineHeight: 1.08, color: '#FFFFFF', margin: '0 0 1.75rem', maxWidth: '16ch' }}>
          CloutCart
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.75, color: 'rgba(255,255,255,0.78)', maxWidth: '52ch', margin: '0 0 3rem' }}>
          Where brands cart their next collab. A vibe-led matchmaking platform for creators and brands. Think Bumble meets LinkedIn, with way more clout.
        </p>
        <div className="cc-hero-meta" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { l: 'Timeline',      v: '1 Week' },
            { l: 'Collaborators', v: 'Cross-Functional Team' },
            { l: 'Tools',         v: 'Figma · Notion' },
            { l: 'Output',        v: 'Product Strategy Proposal, Service Blueprint' },
          ].map(m => (
            <div key={m.l}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: '#FFFFFF', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#FFFFFF', margin: 0 }}>{m.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── What CloutCart Is ───────────────────────────────────
function WhatSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const features = [
    { icon: '⚡', title: 'Smart, swipeable matching', body: 'For brands to discover, and for influencers to get discovered. Nike is viewing you.' },
    { icon: '🤝', title: 'Curate meaningful collabs', body: 'Not transactional gigs. Real creative partnerships between aligned brands and creators.' },
    { icon: '🎯', title: 'Find your people', body: 'Brands find their tribe. Creators find their kind of brand. Fit over follower count.' },
    { icon: '💳', title: 'Subscription-based access', body: 'Transparent tiered pricing for businesses: free entry, growth plans, enterprise.' },
    { icon: '🔮', title: 'Curated by mutual fit', body: 'Vibe quizzes, aesthetic tags, and content values guide every match recommendation.' },
    { icon: '🌱', title: 'Partnerships, not profiles', body: 'People-first platform. Not a directory, but a place to grow together.' },
  ]
  return (
    <section style={{ background: C.bg, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-box.png" style={{ top: '-50px', left: '9%', width: '218px', transform: 'rotate(8deg)' }} />
      <Sticker src="/stickers/s-lemon.png" style={{ bottom: '-36px', left: '3%', width: '112px', transform: 'rotate(16deg)' }} />
      <Wrap>
        <Reveal>
          <Label>What it is</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            A vibe-led matchmaking platform
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.9rem,1.4vw,1rem)', color: C.mid, lineHeight: 1.8, maxWidth: '56ch', margin: '0 0 3rem' }}>
            The creator economy has exploded. Brands spend billions on influencer marketing. And yet the actual connection between the two sides still happens in DMs, spreadsheets, and WhatsApp threads. CloutCart is the fix.
          </p>
        </Reveal>
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {features.map(f => (
            <StaggerItem key={f.title}>
              <NeuCard style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{f.icon}</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: C.ink, margin: 0 }}>{f.title}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Why This Topic ──────────────────────────────────────
function WhySection() {
  return (
    <section style={{ background: C.surface, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-wallet.png" style={{ bottom: '28px', right: '4%', width: '172px', transform: 'rotate(-14deg)' }} />
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
            }}>We started with something<br /><em style={{ fontFamily: "'Syne', sans-serif", fontStyle: 'italic', color: C.accent }}>broken</em></h2>
          </MaskReveal>
          <Reveal delay={0.2}>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.9rem',
              color: C.mid,
              lineHeight: 1.8,
              maxWidth: '68ch',
              margin: '0 auto',
              textAlign: 'left',
            }}>
              The creator economy is a billion-dollar space with a surprisingly unsolved coordination problem. Brands spend huge budgets on influencer marketing, and creators hustle for brand deals that actually fit them. Yet the matching still happens through Instagram DMs, WhatsApp threads, and shared spreadsheets. No structure. No signal. We chose this space because the <strong style={{ color: C.ink, fontWeight: 600 }}>gap between the problem and the solution felt unusually wide</strong>, and wide gaps are where design has the most to contribute.<br /><br />CloutCart was our attempt to close it.
            </p>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Problem Section ─────────────────────────────────────
function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const problems = [
    { n: '01', title: 'Discovery is broken', body: 'Brands struggle to find relevant influencers beyond celebrity lists. Real fit gets lost in noise.' },
    { n: '02', title: 'Cost walls out small brands', body: 'SMEs and D2C startups can\'t afford influencer agencies or dedicated marketing teams.' },
    { n: '03', title: 'No compatibility tracking', body: 'There\'s no easy way to measure aesthetic alignment, audience match, or past performance quality.' },
    { n: '04', title: 'Chaos at every step', body: 'Instagram DMs, spreadsheets, fake engagement, no accountability: all noise, no signal.' },
  ]
  return (
    <section id="problem" ref={ref} style={{ background: C.surface, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-megaphone.png" style={{ top: '40%', right: '2%', width: '168px', transform: 'rotate(-18deg) scaleX(-1)' }} />
      <Wrap>
        <Reveal>
          <Label>The Opportunity Space</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            The space is buzzing. But not matching.
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem' }}>
            Here's why existing solutions keep falling short.
          </p>
        </Reveal>
        <StaggerGrid className="cc-g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {problems.map(p => (
            <StaggerItem key={p.n}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', color: C.accent, margin: '0 0 0.75rem', textTransform: 'uppercase' }}>{p.n}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: C.ink, margin: '0 0 0.6rem' }}>{p.title}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{p.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Two-sided market */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
          className="cc-g2" style={{ marginTop: '3.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {[
            { side: 'Brands & Companies', color: C.accent, icon: '🏢', desc: 'Startups, D2C brands, lifestyle, fashion, wellness, beauty, tech. Looking to grow reach, build community, and boost engagement, without the agency markup.', tags: ['D2C Startups', 'SMEs', 'Lifestyle Brands', 'Boutique Agencies'] },
            { side: 'Influencers & Creators', color: C.pink, icon: '🎨', desc: 'Nano to macro creators across Instagram, YouTube, LinkedIn, and every emerging platform. Looking for brand collabs that match their vibe and values, not just their follower count.', tags: ['Nano Creators', 'Micro Influencers', 'Content Strategists', 'Macro Talent'] },
          ].map(side => (
            <NeuCard key={side.side} style={{ padding: '2rem', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${side.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>{side.icon}</div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: side.color, margin: 0 }}>{side.side}</p>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.mid, lineHeight: 1.7, margin: '0 0 1rem' }}>{side.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {side.tags.map(tag => (
                  <span key={tag} style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: `${side.color}10`, color: side.color, border: `1px solid ${side.color}30`, borderRadius: '99px', padding: '4px 12px', height: 24, lineHeight: '16px', boxSizing: 'border-box' }}>{tag}</span>
                ))}
              </div>
            </NeuCard>
          ))}
        </motion.div>

        {/* Competitor gaps table */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.45, ease: EASE }} style={{ marginTop: '3.5rem' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: C.ink, margin: '0 0 1.25rem' }}>What's out there, and what's broken</h3>
          <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: C.neuSm }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ background: C.accent }}>
                  {['Current Option', 'What It Offers', 'What\'s Broken'].map(h => (
                    <th key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', padding: '0.85rem 1.1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Instagram DMs', 'Direct contact', 'Unscalable, spammy'],
                  ['Upfluence / AspireIQ', 'Databases, filters', 'Expensive, impersonal'],
                  ['Spreadsheets / outreach', 'DIY control', 'Time-consuming & chaotic'],
                  ['Grynow / OPA', 'Local network, influencer trust', 'Not self-serve, limited scalability'],
                  ['TagMango / HYPD', 'India-focused, product-led', 'Limited brand discovery features'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.card : C.bg }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: j === 2 ? '#DC2626' : C.ink, padding: '0.75rem 1.1rem', fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote style={{ margin: '1.5rem 0 0', padding: '1.25rem 1.5rem', borderLeft: `3px solid ${C.accent}`, background: C.accentDim, borderRadius: '0 10px 10px 0' }}>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,1.8vw,1.2rem)', color: C.ink, margin: 0, lineHeight: 1.6 }}>
              "Most existing tools treat people like profiles, not partnerships."
            </p>
          </blockquote>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Strategic Process Section ───────────────────────────
function ProcessSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const phases = [
    { n: '01', label: 'Envisioning', desc: 'Setting the vision and long-term direction' },
    { n: '02', label: 'Explore', desc: 'Business models, stakeholders, desk + analogous research' },
    { n: '03', label: 'Synthesize', desc: 'SWOT, personas, empathy maps, pricing model assessment' },
    { n: '04', label: 'Ideate', desc: 'Business models, IP, brand identity, service blueprint, pitch deck' },
    { n: '05', label: 'Prototype & Test', desc: 'Investor pitching, prototype iterations, product architecture' },
    { n: '06', label: 'Launch', desc: 'Investor/stakeholder engagement, refine financial model, update goals' },
  ]

  const roles = [
    { role: 'CEO', phases: [true, false, false, true, true, true] },
    { role: 'Chief of Staff', phases: [true, false, false, true, true, true] },
    { role: 'Branding & Marketing', phases: [false, true, true, true, true, true] },
    { role: 'UX Lead', phases: [false, true, true, true, true, false] },
    { role: 'Tech Lead', phases: [false, false, false, false, true, false] },
    { role: 'Data Analyst', phases: [false, true, true, false, false, false] },
  ]

  return (
    <section id="process" ref={ref} style={{ background: C.bg, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-ipod.png" style={{ bottom: '-30px', left: '5%', width: '142px', transform: 'rotate(-16deg)' }} />
      <Wrap>
        <Reveal>
          <Label>Strategic Design Process</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem' }}>
            Six phases. One team. One vision.
          </h2>
        </Reveal>

        {/* Phase cards */}
        <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
          <div className="cc-phase-row" style={{ display: 'flex', gap: '0.75rem', minWidth: 720 }}>
            {phases.map((ph, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.09, ease: EASE }}
                style={{ flex: 1, minWidth: 130 }}>
                <NeuCard style={{ padding: '1.25rem 1rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`, opacity: 0.7 }} />
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.16em', color: C.accent, margin: '0.5rem 0 0.5rem', textTransform: 'uppercase' }}>{ph.n}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.ink, margin: '0 0 0.5rem', lineHeight: 1.2 }}>{ph.label}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', color: C.mid, lineHeight: 1.55, margin: 0 }}>{ph.desc}</p>
                </NeuCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Role × Phase grid */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.55, ease: EASE }} style={{ marginTop: '2.5rem', overflowX: 'auto' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: C.ink, margin: '0 0 1.25rem' }}>Who does what, when</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 500 }}>Role</th>
                {phases.map(ph => (
                  <th key={ph.n} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, padding: '0.5rem 0.5rem', textAlign: 'center', fontWeight: 500 }}>{ph.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: C.ink, padding: '0.6rem 0.75rem', whiteSpace: 'nowrap' }}>{row.role}</td>
                  {row.phases.map((active, j) => (
                    <td key={j} style={{ textAlign: 'center', padding: '0.6rem 0.5rem' }}>
                      {active
                        ? <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.accent, margin: '0 auto', boxShadow: `0 0 0 3px ${C.accentDim}` }} />
                        : <div style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${C.border}`, margin: '0 auto' }} />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── People Map Section ───────────────────────────────────
function PeopleSection() {
  return (
    <section id="people" style={{ background: C.surface, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-headphones.png" style={{ top: '22px', right: '-6px', width: '310px', transform: 'rotate(-8deg)' }} />
      <Wrap>
        <Reveal>
          <Label>People Map</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            How the team connects
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem' }}>
            Every role orbits the CEO. The real value is in the connection lines. Each link has a cadence, a focus, and a reason to exist.
          </p>
        </Reveal>
        <PeopleMap />

        {/* Role responsibility blocks */}
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2.5rem' }}>
          {[
            { role: 'CEO', color: C.accent, resp: 'Drives vision and strategy. Pitches the idea. Ensures alignment across the team and makes key decisions.' },
            { role: 'Chief of Staff', color: C.accentMid, resp: 'Coordinates between roles. Tracks deadlines. Supports execution, logistics, and internal workflow.' },
            { role: 'Branding & Marketing', color: C.pink, resp: 'Attracts users. Builds campaigns, manages social presence, and positions the brand for growth.' },
            { role: 'UX Lead', color: C.amber, resp: 'Designs user flows and interfaces for brands and influencers. Makes the product usable and trustworthy.' },
            { role: 'Tech Lead', color: '#0EA5E9', resp: 'Builds core platform features: matchmaking logic, user accounts, APIs, database systems.' },
            { role: 'Data Analyst', color: C.green, resp: 'Analyses influencer and brand data to improve matchmaking, tracks campaign performance, informs product.' },
          ].map(item => (
            <StaggerItem key={item.role}>
              <NeuCard style={{ padding: '1.25rem', height: '100%' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, marginBottom: '0.75rem' }} />
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: C.ink, margin: '0 0 0.5rem' }}>{item.role}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{item.resp}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Service Roleplay photo */}
        <Reveal delay={0.15}>
          <div style={{ marginTop: '3rem', maxWidth: '680px', margin: '3rem auto 0' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, marginBottom: '1rem' }}>Service Roleplay</p>
            <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: C.neu }}>
              <img
                src="/cc-teamphoto.png"
                alt="The team at work — service roleplay session"
                loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Solution + GTM Section ───────────────────────────────
function SolutionSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const gtmPhases = [
    { phase: '🐣 Crawl', period: 'Month 1–3', color: C.accentDim, border: C.accent, items: ['Build MVP: web and app onboarding', 'Manual brand/influencer onboarding', 'Closed beta: 10 brands + 50 influencers', 'Basic vibe quiz + discovery engine'] },
    { phase: '🚶 Walk', period: 'Month 4–6', color: C.pinkDim, border: C.pink, items: ['Dashboards, analytics, swipe interface', 'Launch subscription model', 'Outreach to 100+ brands (SMBs, D2C)', 'Begin influencer-side content tools'] },
    { phase: '🚀 Fly', period: 'Month 6–12', color: C.greenDim, border: C.green, items: ['Matching refinement + tech systems', 'Brand-funded campaigns', 'Community collabs, product partnerships', 'Revenue scaling, team growth', 'Onboarding multi-national brands'] },
  ]

  return (
    <section id="solution" ref={ref} style={{ background: C.bg, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-apple.png" style={{ bottom: '-34px', left: '4.5%', width: '138px', transform: 'rotate(17deg)' }} />
      <Wrap>
        <Reveal>
          <Label>Solution Matrix</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem' }}>
            How CloutCart changes the collab game
          </h2>
        </Reveal>

        {/* Solution matrix table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }} style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: C.neuSm, marginBottom: '3.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr style={{ background: C.accent }}>
                {['Need', 'Our Feature', 'Value Created'].map(h => (
                  <th key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', padding: '0.85rem 1.1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Precise influencer fit', 'Vibe quizzes + match engine', 'Quality over quantity in collabs'],
                ['Easy brand discovery', 'Smart filters + dashboards', 'Faster, clearer brand access'],
                ['Scalable influencer reach', 'Tiered subscription', 'Fair, inclusive pricing'],
                ['Visibility for creators', '"Who\'s viewing you?" dashboards', 'Confidence + better content fit'],
                ['Campaign tracking & feedback', 'CRM-lite collab dashboard', 'Clear ROI for every campaign'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.card : C.bg }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: j === 1 ? C.accent : C.ink, padding: '0.75rem 1.1rem', fontWeight: j === 0 ? 600 : 400, lineHeight: 1.5 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Crawl / Walk / Fly */}
        <Reveal>
          <Label>Go-to-Market</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 2rem' }}>Crawl. Walk. Fly.</h3>
        </Reveal>
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {gtmPhases.map((ph, i) => (
            <StaggerItem key={ph.phase}>
              <div style={{ padding: '1.75rem', paddingBottom: '2rem', background: ph.color, border: `1.5px solid ${ph.border}40`, borderRadius: '14px', position: 'relative', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '10px', background: `${ph.border}18`, borderRadius: '0 0 14px 14px' }} />
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: C.ink, margin: '0 0 0.25rem' }}>{ph.phase}</p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.12em', color: ph.border, margin: '0 0 1rem', textTransform: 'uppercase' }}>{ph.period}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {ph.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: ph.border, fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.4, flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.55 }}>{item}</span>
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

// ─── Product Section ─────────────────────────────────────
function ProductSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <section id="product" ref={ref} style={{ background: C.surface, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-handycam.png" style={{ top: '58px', right: '1.5%', width: '178px', transform: 'rotate(11deg)' }} />
      <Wrap>
        {/* Match Engine */}
        <Reveal>
          <Label>Hero Product</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            The Match Engine
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 2.5rem' }}>
            Not just a filter. A vibe-based recommendation engine that matches on niche, tone, platform, and campaign type.
          </p>
        </Reveal>

        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3.5rem' }}>
          {[
            { label: 'Onboarding', icon: '🚀', color: C.accent, items: ['Single interface: "I\'m a brand" / "I\'m an influencer"', 'Vibe quiz: tone, goals, content values', 'Matches by niche, vibe, platform, and campaign type'] },
            { label: 'Influencer Dashboard', icon: '👁️', color: C.pink, items: ['Who\'s viewing your profile', 'Top 3 brand categories engaging with you', 'Visibility score + collab history'] },
            { label: 'Brand Dashboard', icon: '⚡', color: C.green, items: ['Swipe → Shortlist → Reach out or post a brief', 'Track campaign results inline', 'Creator scoring and compatibility view'] },
          ].map(card => (
            <StaggerItem key={card.label}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>{card.icon}</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: card.color, margin: 0 }}>{card.label}</p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {card.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: card.color, flexShrink: 0, fontSize: '0.75rem', marginTop: '0.1rem' }}>◦</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Pricing */}
        <Reveal>
          <Label>Subscription Model</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 2rem' }}>Built for both sides of the marketplace</h3>
        </Reveal>

        <div className="cc-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3.5rem' }}>
          {[
            {
              side: 'For Brands', color: C.accent,
              tiers: [
                { name: 'Free', who: 'Small local brands', price: '₹0', features: '10 swipes/week · 5 briefs · Non-premium creators', highlight: false },
                { name: 'Growth', who: 'Startups, small brands', price: '₹2,499/mo', features: '25 swipes/week · 15 briefs · Basic analytics · Filtering', highlight: true },
                { name: 'Enterprise', who: 'Agencies, big brands', price: 'Custom', features: 'Enterprise-ready scale · Pro analytics · Dedicated support', highlight: false },
              ]
            },
            {
              side: 'For Creators', color: C.pink,
              tiers: [
                { name: 'Free', who: 'Everyone', price: '₹0', features: 'Basic visibility dashboard', highlight: false },
                { name: 'Plus', who: 'Growth-stage creators', price: '₹299/mo', features: 'Enhanced insights · Priority listing', highlight: true },
                { name: 'Pro', who: 'Full-time influencers', price: '₹699/mo', features: 'Campaign alerts · Brand chatbox · Campaign history', highlight: false },
              ]
            }
          ].map(group => (
            <div key={group.side}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: group.color, marginBottom: '1rem' }}>{group.side}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {group.tiers.map(tier => (
                  <NeuCard key={tier.name} style={{ padding: '1.25rem 1.5rem', border: tier.highlight ? `2px solid ${group.color}` : 'none', position: 'relative', overflow: 'hidden' }}>
                    {tier.highlight && <div style={{ position: 'absolute', top: 0, right: 0, background: group.color, padding: '2px 10px', borderRadius: '0 0 0 8px' }}><span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: '#fff', letterSpacing: '0.1em' }}>POPULAR</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.ink, margin: 0 }}>{tier.name}</p>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: group.color, margin: 0 }}>{tier.price}</p>
                    </div>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.08em', color: C.muted, margin: '0 0 0.5rem', textTransform: 'uppercase' }}>{tier.who}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.mid, lineHeight: 1.55, margin: 0 }}>{tier.features}</p>
                  </NeuCard>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Moat */}
        <Reveal>
          <Label>Competitive Moat</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 2rem' }}>Four reasons CloutCart isn't easy to clone</h3>
        </Reveal>
        <StaggerGrid className="cc-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[
            { n: '1', title: 'Proprietary AI matchmaking', body: 'Tailored to vibe and business KPIs, not just keyword filters or follower thresholds.' },
            { n: '2', title: 'Network effect', body: 'Growing creator + brand density makes switching harder for every competitor.' },
            { n: '3', title: 'Adaptability', body: 'Expand beyond influencer collabs to any creator-driven channel as the ecosystem evolves.' },
            { n: '4', title: 'Data & insights layer', body: 'Campaign predictions and brand/creator performance data compounds over time.' },
          ].map(item => (
            <StaggerItem key={item.n}>
              <NeuCard style={{ padding: '1.5rem', height: '100%' }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: C.accent, textTransform: 'uppercase' }}>{item.n}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.ink, margin: '0 0 0.5rem' }}>{item.title}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{item.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <blockquote style={{ padding: '1.5rem 2rem', background: `linear-gradient(135deg, ${C.accentDim}, ${C.pinkDim})`, borderRadius: '14px', border: `1px solid ${C.accentBorder}` }}>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1.05rem,2vw,1.3rem)', color: C.ink, margin: '0 0 0.5rem', lineHeight: 1.6 }}>
            "A place to grow together. Not just a deal, but a creative journey."
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>THE CLOUTCART EDGE: Speed · Brand-fit assurance · Performance prediction · Creative control</p>
        </blockquote>
      </Wrap>
    </section>
  )
}

// ─── Roadmap Section ─────────────────────────────────────
function RoadmapSection() {
  const phases = [
    {
      n: '01', icon: '🚀', label: 'MVP & Beta Rollout', period: 'Now – Q4 2025', funding: 'Pre-Seed / Angel: $250K–$500K',
      color: C.accent, grad: `linear-gradient(135deg, #1A0A2E, #3B0764)`,
      goals: ['Develop polished MVP with core matchmaking algorithm', 'Establish CloutCart brand identity and early hype', 'Run closed beta for early-stage D2C brands and nano/micro influencers', 'Validate tech, onboarding, matching logic, and early traction'],
      activities: ['Brand vibe quiz + influencer profile builder with aesthetic tags', 'AI-driven matchmaking logic (early prototype)', 'Beta: ~250 influencers + ~50 small brands', 'Launch visual identity, messaging, landing page'],
      metrics: ['60%+ match satisfaction', '30 successful campaigns', '70% influencers active post-campaign', '2–3 repeat brand users'],
    },
    {
      n: '02', icon: '📈', label: 'Market Fit & Scaling', period: '2026', funding: 'Series A: $1.5M–$3M',
      color: C.pink, grad: `linear-gradient(135deg, #2D0A1E, #6D1240)`,
      goals: ['Strengthen brand position as the smartest collab platform', 'Optimize business model with Phase 1 learnings', 'Expand user base, onboard larger brands', 'Polish creator infrastructure SaaS offering'],
      activities: ['Refine AI matchmaking + creator scoring dashboard', 'A/B test revenue models: commission vs SaaS tier', 'Expand to ~500 brands with 20+ high-growth D2C companies', 'Hire for marketing, community, brand experience'],
      metrics: ['$50K–$100K monthly revenue by Q4 2026', '1,000+ active influencers', '70% retention across campaigns', '3–5 enterprise clients onboarded'],
    },
    {
      n: '03', icon: '🌍', label: 'Global Expansion', period: '2027 & Beyond', funding: 'Series B: $5M–$10M',
      color: C.green, grad: `linear-gradient(135deg, #0A1E0F, #065920)`,
      goals: ['Become the dominant platform for influencer marketing globally', 'Launch in SEA, MENA, Europe, and US markets', 'Expand beyond influencer marketing to all creator-driven channels'],
      activities: ['Regionalized onboarding, creator vetting, support for 100K+ creators', 'Enterprise services suite: concierge, co-strategy, payouts', 'Fully autonomous recommendation engine', 'Team to 50–100+ across sales, product, AI/ML, partnerships'],
      metrics: ['$1M+ MRR', '5,000+ brand accounts (10%+ enterprise)', '100K+ verified creators', 'Presence in 5+ global markets'],
    },
  ]

  return (
    <section id="roadmap" style={{ background: C.bg, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-giftbox.png" style={{ bottom: '-44px', right: '9%', width: '152px', transform: 'rotate(-14deg)' }} />
      <Wrap>
        <Reveal>
          <Label>Business Roadmap</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            Three phases. From MVP to market domination.
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem' }}>
            The deeper strategic layer beneath Crawl/Walk/Fly, with goals, activities, metrics, and funding at each stage.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {phases.map((ph, i) => (
            <Reveal key={ph.n} delay={i * 0.12}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: C.neu }}>
                {/* Header */}
                <div style={{ background: ph.grad, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem' }}>{ph.icon}</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Phase {ph.n}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', color: '#F2EDE4', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>{ph.label}</h3>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: `${ph.color}`, letterSpacing: '0.12em', margin: 0, textTransform: 'uppercase' }}>{ph.period}</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '0.75rem 1.25rem' }}>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '0 0 0.3rem' }}>Funding Target</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: '#fff', margin: 0 }}>{ph.funding}</p>
                  </div>
                </div>
                {/* Body */}
                <div className="cc-g3" style={{ background: C.card, padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  {[['Goals', ph.goals], ['Key Activities', ph.activities], ['Success Metrics', ph.metrics]].map(([title, items]) => (
                    <div key={title}>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: ph.color, margin: '0 0 0.75rem', fontWeight: 600 }}>{title}</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {items.map(item => (
                          <li key={item} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ color: ph.color, flexShrink: 0, fontSize: '0.8rem', marginTop: '0.08rem' }}>◦</span>
                            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, lineHeight: 1.55 }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

// ─── UX Section ───────────────────────────────────────────
function UXSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const principles = [
    { n: '1', title: 'Mobile-First Experience', body: 'Target audience: young entrepreneurs and SME marketing teams who multitask on mobile. Influencer discovery is visual and lightweight. Instant notifications make faster campaign decisions possible.' },
    { n: '2', title: 'Business Collaboration, Simplified', body: 'Briefing, negotiation, content review, approvals, payments: usually scattered across DMs, WhatsApp, and Sheets. CloutCart consolidates it all into one workflow.' },
    { n: '3', title: 'Built for Young Entrepreneurs', body: 'D2C founders and startup marketers value efficiency, clean interfaces, and modern tools. They care about brand alignment and vibe, and prefer tools that feel genuinely cool.' },
    { n: '4', title: 'Vibe Alignment Over Reach', body: 'When an influencer\'s vibe aligns with the brand, audiences feel it as genuine. Fewer back-and-forth negotiations, fewer rejections. Higher ROI with better-matched collabs.' },
  ]

  const priorityMatrix = [
    { feature: 'Onboarding & Account Setup', impact: 'High', effort: 'Low', priority: 'Must have' },
    { feature: 'Brand Profile Creation', impact: 'High', effort: 'Low', priority: 'Must have' },
    { feature: 'Create Campaign', impact: 'High', effort: 'Medium', priority: 'Must have' },
    { feature: 'Discover', impact: 'High', effort: 'Medium', priority: 'Must have' },
    { feature: 'In-app Chat', impact: 'High', effort: 'High', priority: 'Must have' },
    { feature: 'Send Collaboration Request', impact: 'High', effort: 'Medium', priority: 'Must have' },
    { feature: 'Payment & Contract (Basic)', impact: 'High', effort: 'High', priority: 'Must have' },
    { feature: 'Campaign Tracker', impact: 'Medium', effort: 'Medium', priority: 'Should have' },
    { feature: 'Post-Campaign Report', impact: 'Medium', effort: 'Low', priority: 'Should have' },
  ]

  const appScreens = [
    { n: '01', name: 'Welcome & Onboarding', steps: ['Sign up with Email / Google / LinkedIn', 'OTP or password verification', 'Set up brand profile (logo, tone, budget)', 'Land on Dashboard'] },
    { n: '02', name: 'Create Campaign', steps: ['Campaign name & objective', 'Deliverables selection (Reels, Posts, etc.)', 'Target audience, budget, timeline', 'Save as draft or publish'] },
    { n: '03', name: 'Influencer Discovery', steps: ['Access via Dashboard or Discover tab', 'Filters: followers, engagement, style', 'View influencer cards: swipe, list, or grid', 'Tap to view full profile'] },
    { n: '04', name: 'Influencer Profiles', steps: ['Bio, stats, audience, content gallery', 'Actions: Shortlist / Chat / Add Notes', 'Full profile visibility for decision-making'] },
    { n: '05', name: 'Shortlisting System', steps: ['Save influencers to campaign or favorites', '"Shortlist" view per campaign', 'Add internal notes, remove or update status'] },
    { n: '06', name: 'Chat & Collab Request', steps: ['In-app chat with file sharing', 'Send collaboration request', 'Influencer accepts/negotiates via chat'] },
    { n: '07', name: 'Contract & Payment', steps: ['Auto-generated contract (campaign + influencer details)', 'Deliverables and payment terms reviewed', 'Choose payment method: Escrow or wallet', 'Payment status in campaign tracker'] },
    { n: '08', name: 'Campaign Tracker', steps: ['Influencer status: content review, payment', 'Upload approval, change requests', 'Overall progress bar'] },
    { n: '09', name: 'Post-Campaign Report', steps: ['Engagement metrics, audience stats', 'Delivered content preview', 'Internal rating & notes', 'Downloadable PDF/CSV'] },
    { n: '10', name: 'Notifications', steps: ['New matches, chat replies, uploads, payments', 'Push notification system', 'Keeps brands informed & engaged'] },
  ]

  return (
    <section id="ux" ref={ref} style={{ background: C.surface, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-mylar.png" style={{ top: '42px', left: '2%', width: '130px', transform: 'rotate(7deg)' }} />
      <Wrap>
        {/* Design Principles */}
        <Reveal>
          <Label>UX Considerations</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem' }}>
            Four design principles
          </h2>
        </Reveal>
        <StaggerGrid className="cc-g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '3.5rem' }}>
          {principles.map(p => (
            <StaggerItem key={p.n}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: C.accent, textTransform: 'uppercase' }}>{p.n}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: '0 0 0.6rem' }}>{p.title}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.mid, lineHeight: 1.68, margin: 0 }}>{p.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* User Flow */}
        <Reveal delay={0.1}>
          <Label>High-Level User Flow</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>Brand vs Creator: two paths, one collab</h3>
        </Reveal>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="cc-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '3.5rem' }}>
          {[
            { side: 'Brand Flow', color: C.accent, steps: ['Brief: define campaign goals, audience, budget', 'Swipe: discover and shortlist matched creators', 'Collaborate: send brief, chat, contract, track'] },
            { side: 'Creator Flow', color: C.pink, steps: ['Brief: build profile, set vibe and niche tags', 'Match: get discovered and notified by brands', 'Collaborate: accept, create, deliver, get paid'] },
          ].map(flow => (
            <NeuCard key={flow.side} style={{ padding: '1.75rem' }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: flow.color, margin: '0 0 1rem', fontWeight: 600 }}>{flow.side}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {flow.steps.map((step, si) => (
                  <div key={si} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: flow.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', fontWeight: 700 }}>{si + 1}</div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.mid, lineHeight: 1.55, margin: 0, paddingTop: '0.2rem' }}>{step}</p>
                  </div>
                ))}
              </div>
            </NeuCard>
          ))}
        </motion.div>

        {/* Feature Priority Matrix */}
        <Reveal delay={0.15}>
          <Label>Feature Priority Matrix</Label>
        </Reveal>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: C.neuSm, marginBottom: '3.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr style={{ background: C.accent }}>
                {['Feature', 'Impact', 'Effort', 'Priority'].map(h => (
                  <th key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {priorityMatrix.map((row, i) => {
                const impactCol = row.impact === 'High' ? C.green : C.amber
                const effortCol = row.effort === 'High' ? '#DC2626' : row.effort === 'Medium' ? C.amber : C.green
                const priCol = row.priority === 'Must have' ? C.accent : C.accentMid
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.card : C.bg }}>
                    <td style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.ink, padding: '0.7rem 1rem', fontWeight: 500 }}>{row.feature}</td>
                    <td style={{ padding: '0.7rem 1rem' }}><span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: impactCol, background: `${impactCol}15`, border: `1px solid ${impactCol}30`, borderRadius: '99px', padding: '3px 10px', minWidth: 54, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.impact}</span></td>
                    <td style={{ padding: '0.7rem 1rem' }}><span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: effortCol, background: `${effortCol}15`, border: `1px solid ${effortCol}30`, borderRadius: '99px', padding: '3px 10px', minWidth: 54, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.effort}</span></td>
                    <td style={{ padding: '0.7rem 1rem' }}><span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: '#fff', background: priCol, borderRadius: '99px', padding: '3px 10px', minWidth: 80, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.priority}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>

        {/* App Flow — 10 screens */}
        <Reveal delay={0.2}>
          <Label>App Flow</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 2rem' }}>10 core screens</h3>
        </Reveal>
        <StaggerGrid className="cc-g5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          {appScreens.map(screen => (
            <StaggerItem key={screen.n}>
              <NeuCard style={{ padding: '1.25rem', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.accent, fontWeight: 700, textTransform: 'uppercase' }}>{screen.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.83rem', color: C.ink, margin: 0 }}>{screen.name}</p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {screen.steps.map((step, si) => (
                    <li key={si} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', color: C.mid, lineHeight: 1.5, paddingLeft: '0.75rem', borderLeft: `2px solid ${C.accentBorder}` }}>{step}</li>
                  ))}
                </ul>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Journey Maps Section ─────────────────────────────────
function JourneysSection() {
  const journeys = [
    {
      title: 'Influencer Journey', icon: '🎨', color: C.pink,
      rows: [
        { stage: 'Onboarding', touch: 'Signs up → vibe quiz → uploads content sample → AI assigns tags → sees profile preview', emotion: 'Excited, Curious' },
        { stage: 'Discoverability', touch: '"You are now discoverable by [Brand Name]" — this notification appears on the brand swipe list', emotion: 'Curious, Alerted' },
        { stage: 'Shortlisted', touch: 'Brand swipes right → receives notification with campaign preview + message', emotion: 'Hopeful' },
        { stage: 'Messaging', touch: 'Responds, accepts collab. Chat opens in-platform. Timeline + deliverables set.', emotion: 'Engaged, Reassured' },
        { stage: 'Agreement', touch: 'E-sign agreement generated by platform', emotion: 'Confident, Committed' },
        { stage: 'Execution', touch: 'Posts content → links reporting → gets paid → receives Trust Score update', emotion: 'Productive, Visible' },
      ]
    },
    {
      title: 'Brand: SME Journey', icon: '🚀', color: C.accent,
      rows: [
        { stage: 'Onboarding', touch: 'Fills basic brand details → 1st campaign brief → Starter Plan → guided campaign builder', emotion: 'Cautious, Newcomer' },
        { stage: 'Matching', touch: 'AI suggests top 10 matches with vibe tags. Simplified filters. Swipes and adds creators.', emotion: 'Curious, Learning' },
        { stage: 'Messaging', touch: 'Sends friendly proposal using pre-filled templates. Influencer chats back.', emotion: 'Hopeful, Connected' },
        { stage: 'Contract', touch: 'Agreement set with clear expectations and platform guidance', emotion: 'Guided, Reassured' },
        { stage: 'Reporting', touch: 'Views simplified dashboard → follower gain + engagement → future suggestions', emotion: 'Proud, Growing' },
      ]
    },
    {
      title: 'Brand: Enterprise Journey', icon: '🏢', color: C.green,
      rows: [
        { stage: 'Onboarding', touch: 'Enterprise login → campaign brief (goal, audience, vibe) → Enterprise plan selected', emotion: 'Strategic, Invested' },
        { stage: 'Matching', touch: 'AI pulls top matches. Swipe interface. Filters by region, language, engagement, vibe.', emotion: 'Curious, Intentional' },
        { stage: 'Messaging', touch: 'Sends proposal. Influencer chats back. Confident negotiation.', emotion: 'Confident, In control' },
        { stage: 'Contract', touch: 'Platform auto-generates agreement and timelines. Influencer reviews and accepts.', emotion: 'Optimistic, Ready' },
        { stage: 'Reporting', touch: 'Live engagement, CTR, sentiment analysis. PDF report for internal ROI pitch.', emotion: 'Informed, Strategic' },
      ]
    },
  ]

  return (
    <section id="journeys" style={{ background: C.bg, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-wallet.png" style={{ top: '42%', right: '3%', width: '150px', transform: 'rotate(22deg)' }} />
      <Wrap>
        <Reveal>
          <Label>User Journey Maps</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            Three personas. One platform.
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem' }}>
            How different users move through CloutCart, and what they feel at each step.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {journeys.map((jm, ji) => (
            <Reveal key={jm.title} delay={ji * 0.1}>
              <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: C.neu }}>
                <div style={{ background: jm.color, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{jm.icon}</span>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', margin: 0 }}>{jm.title}</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                    <thead>
                      <tr style={{ background: `${jm.color}12` }}>
                        {['Stage', 'Touchpoints', 'Emotions'].map(h => (
                          <th key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: jm.color, padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {jm.rows.map((row, ri) => (
                        <tr key={ri} style={{ borderBottom: `1px solid ${C.border}`, background: ri % 2 === 0 ? C.card : C.bg }}>
                          <td style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.08em', color: jm.color, padding: '0.8rem 1rem', fontWeight: 600, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{row.stage}</td>
                          <td style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, padding: '0.8rem 1rem', lineHeight: 1.6 }}>{row.touch}</td>
                          <td style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: '0.9rem', color: C.ink, padding: '0.8rem 1rem', whiteSpace: 'nowrap' }}>{row.emotion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

// ─── Tech Section ─────────────────────────────────────────
function TechSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <section id="tech" ref={ref} style={{ background: C.surface, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-megaphone.png" style={{ bottom: '-52px', left: '3%', width: '158px', transform: 'rotate(-22deg)' }} />
      <Wrap>
        <Reveal>
          <Label>Technical Architecture</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            Built to scale from day one
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem' }}>
            A scalable, modular platform covering brand onboarding, campaign creation, influencer discovery, AI matching, collaboration tools, and analytics.
          </p>
        </Reveal>

        <TechArchDiagram />

        {/* Tech stack */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} style={{ marginTop: '3rem', overflowX: 'auto', borderRadius: '12px', boxShadow: C.neuSm }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr style={{ background: C.accent }}>
                {['Layer', 'Technology', 'Why'].map(h => (
                  <th key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Frontend (Web/Mobile)', 'React.js / Next.js + React Native', 'Component-based, ideal for swipe UI'],
                ['Backend', 'Node.js + Express or FastAPI (Python)', 'Scalable, fast development'],
                ['Database', 'MongoDB (NoSQL) / PostgreSQL (SQL)', 'Flexible for diverse profile data'],
                ['Match Engine', 'V1: Rule-based logic → V2: TensorFlow Lite', 'Start lean, iterate with usage data'],
                ['Storage', 'Firebase Storage or AWS S3', 'Efficient media hosting'],
                ['Auth', 'Firebase Auth (Google, LinkedIn, Email)', 'Secure, easy to implement'],
                ['Hosting', 'Vercel (frontend) · Render/Heroku (backend)', 'Ideal for MVP speed'],
                ['Payments', 'Razorpay / Stripe', 'Proven, secure, India + global'],
                ['Analytics', 'Mixpanel · Firebase Analytics · Sentry', 'User activity + error tracking'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.card : C.bg }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: j === 0 ? C.accent : C.ink, padding: '0.7rem 1rem', fontWeight: j === 0 ? 600 : 400, lineHeight: 1.5 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Challenges + solutions */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4, ease: EASE }} style={{ marginTop: '3rem' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: C.ink, margin: '0 0 1.25rem' }}>Technical challenges & solutions</h3>
          <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { challenge: 'Swipe UI across web and mobile', solution: 'Shared React component (React Tinder Card or Framer Motion)' },
              { challenge: 'Matching accuracy in early stage', solution: 'Clear metadata tagging + brand feedback loops' },
              { challenge: 'Scaling matching engine', solution: 'Modular logic, shift to background jobs / microservices later' },
              { challenge: 'Data privacy for both users', solution: 'OAuth + encryption + clear privacy policies' },
              { challenge: 'Real-time notifications', solution: 'WebSockets or polling → upgrade to Firebase Cloud Messaging' },
              { challenge: 'Subscription control', solution: 'Stripe webhooks to manage plan change events' },
            ].map((item, i) => (
              <StaggerItem key={i}>
                <NeuCard style={{ padding: '1.25rem', height: '100%' }}>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#DC2626', margin: '0 0 0.5rem' }}>Challenge</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: C.ink, margin: '0 0 0.75rem' }}>{item.challenge}</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.green, margin: '0 0 0.4rem' }}>Solution</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.6, margin: 0 }}>{item.solution}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Impact Section ───────────────────────────────────────
function ImpactSection() {
  const stats = [
    { n: '60%', label: 'Faster Matching Time', body: 'AI + swipe UI accelerates brand-influencer discovery vs traditional outreach.' },
    { n: '3×', label: 'Higher Campaign Engagement', body: 'Better-fit matches lead to more relevant, high-performing content.' },
    { n: '2×', label: 'Visibility for Micro-Influencers', body: 'Emerging creators get noticed with smart discovery + brand interest insights.' },
    { n: '100%', label: 'In-App Workflow', body: 'Chat, contracts, briefs, payments: no scattered tools, no stray emails.' },
    { n: '+25%', label: 'Matching Accuracy Over Time', body: 'Lightweight AI improves with every interaction, adapting to preferences and outcomes.' },
  ]
  return (
    <section id="impact" style={{ background: C.bg, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-lemon.png" style={{ top: '-40px', right: '6%', width: '128px', transform: 'rotate(20deg)' }} />
      <Wrap>
        {/* Revenue model */}
        <Reveal>
          <Label>Revenue Model</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 2.5rem' }}>
            B2B2C SaaS Marketplace
          </h2>
        </Reveal>
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '3.5rem' }}>
          {[
            { label: 'Primary Revenue', color: C.accent, items: ['Brand subscriptions: ₹0 → ₹2,499 → Custom', 'Creator subscriptions: ₹0 → ₹299 → ₹699'] },
            { label: 'Secondary Revenue', color: C.pink, items: ['Enterprise services: managed campaigns and concierge support', 'Campaign commission / transaction fee at scale'] },
            { label: 'Future Add-ons', color: C.green, items: ['Boosted visibility, extra analytics, branded reports', 'Creator packs, white-label enterprise dashboards'] },
          ].map(tier => (
            <StaggerItem key={tier.label}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: tier.color, margin: '0 0 1rem', fontWeight: 600 }}>{tier.label}</p>
                {tier.items.map(item => (
                  <div key={item} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: tier.color, flexShrink: 0 }}>◦</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.mid, lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Impact stats */}
        <Reveal>
          <Label>Product Impact</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 2rem' }}>The numbers we're projecting</h3>
        </Reveal>
        <StaggerGrid className="cc-g5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
          {stats.map(s => (
            <StaggerItem key={s.n}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                {/* Neumorphic circle */}
                <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '50%', background: C.card, boxShadow: C.neu, flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '1.25rem' }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: C.accent, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.7rem', color: C.ink, margin: 0, lineHeight: 1.25, textAlign: 'center' }}>{s.label}</p>
                  </div>
                </div>
                {/* Body text below */}
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', color: C.mid, lineHeight: 1.6, margin: 0, textAlign: 'center' }}>{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Service Blueprint + Role Heatmap ────────────────────
function BlueprintSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const bpWrapRef = useRef(null)
  const [bpScale, setBpScale] = useState(1)

  useEffect(() => {
    const measure = () => {
      if (bpWrapRef.current) setBpScale(bpWrapRef.current.offsetWidth / 1140)
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])


  const heatmap = [
    { role: 'CEO',       phases: ['L', 'XL', 'L'] },
    { role: 'CoS',       phases: ['S', 'M', 'XL'] },
    { role: 'Marketing', phases: ['M', 'XL', 'L'] },
    { role: 'UX',        phases: ['L', 'M', 'M'] },
    { role: 'Tech',      phases: ['L', 'L', 'XL'] },
    { role: 'Data',      phases: ['S', 'M', 'M'] },
  ]

  const heatColor = (v) => ({ 'S': '#D1FAE5', 'M': '#A7F3D0', 'L': `${C.accentMid}50`, 'XL': C.accent }[v])
  const heatText = (v) => ({ 'S': C.mid, 'M': C.mid, 'L': '#fff', 'XL': '#fff' }[v])

  return (
    <section id="blueprint" ref={ref} style={{ background: C.surface, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-ipod.png" style={{ bottom: '15%', left: '20%', width: '134px', transform: 'rotate(23deg)' }} />
      <Wrap>
        {/* Service Blueprint */}
        <Reveal>
          <Label>Service Blueprint</Label>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem' }}>
            The full experience map
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem' }}>
            Four swim lanes. Everything visible and invisible, from the moment a user sees an ad to the moment they upgrade their subscription.
          </p>
        </Reveal>

        <motion.div
          ref={bpWrapRef}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ width: '100%', height: 820 * bpScale, marginBottom: '3.5rem', overflow: 'hidden' }}
        >
          <iframe
            src="/cc-service-blueprint.html"
            title="CloutCart Service Blueprint"
            width="1140"
            height="820"
            style={{ border: 'none', display: 'block', transformOrigin: 'top left', transform: `scale(${bpScale})` }}
            scrolling="no"
          />
        </motion.div>

        {/* Role Heatmap */}
        <Reveal delay={0.2}>
          <Label>Role Prioritisation</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.8vw,2rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 2rem' }}>Workload intensity across phases</h3>
        </Reveal>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.25, ease: EASE }} style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: C.neuSm }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
            <thead>
              <tr style={{ background: C.card }}>
                <th style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500 }}>Role</th>
                {['Phase 1: MVP & Beta', 'Phase 2: Market Fit', 'Phase 3: Global Scale'].map(ph => (
                  <th key={ph} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, padding: '0.75rem 0.75rem', textAlign: 'center', fontWeight: 500 }}>{ph}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmap.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', fontWeight: 600, color: C.ink, padding: '0.65rem 1rem' }}>{row.role}</td>
                  {row.phases.map((val, j) => (
                    <td key={j} style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', fontWeight: 700, color: heatText(val), background: heatColor(val), borderRadius: '6px', padding: '0.3rem 0.75rem', minWidth: 36, textAlign: 'center', textTransform: 'uppercase' }}>{val}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, margin: '0.75rem 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>S = Small · M = Medium · L = Large · XL = Extra Large workload</p>
      </Wrap>
    </section>
  )
}

// ─── Reflections Section ─────────────────────────────────
function ReflectionsSection() {
  return (
    <section id="reflections" style={{ background: C.heroGrad, ...PAD, position: 'relative' }}>
      <Sticker src="/stickers/s-apple.png" style={{ top: '-36px', right: '7%', width: '142px', transform: 'rotate(20deg)' }} />
      <Sticker src="/stickers/s-box.png" style={{ bottom: '-42px', left: '9%', width: '162px', transform: 'rotate(-17deg)' }} />
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
          }}>What we learned building CloutCart</h2>
        </Reveal>

        <StaggerGrid className="cc-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          {[
            { n: '01', text: '"Cross-functional teamwork taught us the value of clear role division and open communication — balancing creativity with feasibility across design, tech, marketing, and strategy."' },
            { n: '02', text: '"Staying grounded in user needs meant prioritising functionality that delivered real value to both brands and influencers, not just what looked good on a deck."' },
            { n: '03', text: '"Design management is not about control — it is about alignment. Getting four disciplines to move in the same direction, at the same speed, is the hard part."' },
            { n: '04', text: '"The creator economy has a matching problem. The real insight was that fit matters more than follower count — and building for fit changes everything about the product."' },
          ].map(r => (
            <StaggerItem key={r.n}>
              <div style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '2.25rem',
                height: '100%',
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.22em', color: C.darkMuted, marginBottom: '1.25rem', textTransform: 'uppercase' }}>{r.n}</div>
                <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: 'clamp(1.05rem,2vw,1.25rem)', color: C.darkInk, lineHeight: 1.65, margin: 0 }}>{r.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal delay={0.2}>
          <p style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(1rem,2vw,1.2rem)',
            color: C.darkMid,
            maxWidth: 560,
            lineHeight: 1.75,
            margin: '0 auto',
            textAlign: 'center',
          }}>
            CloutCart started as a design management exercise. It ended as something we genuinely believed in — a platform where creative fit replaces follower count as the currency of collaboration.
          </p>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Root Export ─────────────────────────────────────────
export default function CloutCart() {
  const active = useActiveSection(NAV_SECTIONS.map(s => s.id))

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'CloutCart — Zeus Z B'
  }, [])

  return (
    <div style={{ background: C.page, color: C.ink, minHeight: '100vh' }}>
      <CCStyles />
      <ProgressBar />
      <Nav />
      <SidebarNav active={active} />
      <main className="has-bottom-nav">
        <HeroSection />
        <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <Wrap>
            <p style={{ margin: 0, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase', padding: '0.7rem 0' }}>
              approx. 5 min quick read
            </p>
          </Wrap>
        </div>
        <WhySection />
        <WhatSection />
        <ProblemSection />
        <ProcessSection />
        <PeopleSection />
        <SolutionSection />
        <ProductSection />
        <RoadmapSection />
        <UXSection />
        <JourneysSection />
        <TechSection />
        <ImpactSection />
        <BlueprintSection />
        <ReflectionsSection />
      </main>
      <BackToTop />
      <Footer />
    </div>
  )
}
