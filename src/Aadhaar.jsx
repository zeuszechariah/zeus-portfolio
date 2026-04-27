import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal, BackToTop } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
const C = {
  page:    '#F5F3EE',
  surface: '#EDEBE5',
  card:    '#F8F7F3',
  neu:     '6px 6px 18px rgba(0,0,0,0.08), -4px -4px 12px rgba(255,255,255,0.88)',
  neuSm:   '4px 4px 10px rgba(0,0,0,0.07), -3px -3px 7px rgba(255,255,255,0.9)',
  accent:  '#075959',
  accentMid: '#0D7878',
  accentDim: 'rgba(7,89,89,0.07)',
  accentBorder: 'rgba(7,89,89,0.16)',
  amber:   '#D4860A',
  terra:   '#A65D33',
  dark:    '#1A0505',
  heroGrad: 'linear-gradient(145deg, #1A0505 0%, #400A0F 50%, #5A1C0A 100%)',
  darkInk: '#F2EDE4',
  darkMid: 'rgba(242,237,228,0.65)',
  darkMuted: 'rgba(242,237,228,0.38)',
  white:   '#FFFFFF',
  bg:      '#F5F3EE',
  ink:     '#1A0E08',
  mid:     '#5A4035',
  muted:   '#9A8070',
  border:  'rgba(0,0,0,0.08)',
  borderDark: 'rgba(255,255,255,0.07)',
}

const EASE = [0.22, 1, 0.36, 1]

// ─── Sidebar Sections ────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'overview',      label: 'Overview' },
  { id: 'process',       label: 'Process' },
  { id: 'problem-space', label: 'Problem' },
  { id: 'questions',     label: 'Questions' },
  { id: 'methodology',   label: 'Method' },
  { id: 'findings',      label: 'Findings' },
  { id: 'stories',       label: 'Stories' },
  { id: 'synthesis',     label: 'Synthesis' },
  { id: 'framework',     label: 'Framework' },
  { id: 'insights',      label: 'Insights' },
  { id: 'pivot',         label: 'Pivot' },
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
function SectionTag({ children, dark = false }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: dark ? C.darkMuted : C.muted,
      border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : C.border}`,
      padding: '4px 10px',
      borderRadius: '99px',
      marginBottom: '1.25rem',
    }}>{children}</span>
  )
}

function Label({ children, dark = false }) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,0.3)' : C.muted,
      display: 'block',
      marginBottom: '1.5rem',
    }}>{children}</span>
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

// ─── Donut Chart SVG ─────────────────────────────────────
function DonutChart({ pct, color, label, sublabel }) {
  const r = 48
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const gap = circ - dash
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx={60} cy={60} r={r} fill="none" stroke={C.border} strokeWidth={10} />
          <circle
            cx={60} cy={60} r={r} fill="none"
            stroke={color} strokeWidth={10}
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: C.ink, lineHeight: 1 }}>{pct}%</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.8rem', color: C.ink, margin: 0 }}>{label}</p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', color: C.muted, margin: '4px 0 0', letterSpacing: '0.06em' }}>{sublabel}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTIONS
// ═══════════════════════════════════════════════════════════

// ─── Hero Section ────────────────────────────────────────
function HeroSection() {
  return (
    <section id="overview" style={{
      background: C.heroGrad,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,134,10,0.12) 0%, transparent 70%)',
      }} />

      <Wrap>
        <div style={{ paddingTop: 'clamp(8rem,14vw,12rem)', paddingBottom: 'clamp(4rem,7vw,6rem)' }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <span style={{
              display: 'inline-block',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(212,134,10,0.85)',
              border: '1px solid rgba(212,134,10,0.28)',
              padding: '5px 14px',
              borderRadius: '99px',
              marginBottom: '2rem',
            }}>
              UX Research · Mixed Methods · Government Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              color: C.darkInk,
              lineHeight: 1.04,
              letterSpacing: '-0.03em',
              margin: '0 0 1.5rem',
              maxWidth: '14ch',
            }}
          >
            Aadhaar Access Challenges
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5, ease: EASE }}
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
              color: C.darkMid,
              lineHeight: 1.55,
              maxWidth: '52ch',
              margin: '0 0 3rem',
            }}
          >
            Understanding how senior citizens in India experience Aadhaar services when urgency hits.
          </motion.p>

          {/* Metadata row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {[
              ['Timeline', '6 Weeks'],
              ['Institution', 'NID Bangalore'],
              ['Team', 'Group 5 — The Eligibles'],
              ['Methods', 'Interviews · Surveys · Secondary Research'],
              ['Participants', '27 survey + 5 deep-dives'],
            ].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.darkMuted, margin: '0 0 4px' }}>{k}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.8rem', color: C.darkInk, margin: 0 }}>{v}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Why / Stakes Section ────────────────────────────────
function WhySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  return (
    <section ref={ref} style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, ease: EASE }}>
            <SectionTag>The Stakes</SectionTag>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              color: C.ink,
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              margin: '0 0 2rem',
            }}
          >
            When a fingerprint stops working, a pension stops too.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)',
              color: C.mid,
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Aadhaar is India's universal ID. For most it works. For elderly citizens 60+, moments of urgency reveal invisible friction. Where a fingerprint that no longer reads becomes a blocked pension. Where a torn card becomes a month of borrowed rice. Where dependence on a son, daughter-in-law, or nephew becomes the only path to a basic government service.
          </motion.p>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Process Section ─────────────────────────────────────
function ProcessSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const steps = [
    'Analysing UIDAI',
    'Studying existing problems',
    'Identifying a particular problem',
    'Brainstorming',
    'Unpacking pain points of updation',
    'Formulating & shortlisting problem statements',
    'Review',
    'Refining problem statement',
    'Pilot interviews',
    'Inferences',
  ]
  return (
    <section id="process" ref={ref} style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Label>Research Process</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem' }}
        >
          Ten steps from system to story
        </motion.h2>

        {/* Horizontal stepper — scrollable on mobile */}
        <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 'max-content', position: 'relative' }}>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
              >
                {/* Connector line */}
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {i > 0 && (
                    <div style={{ width: '40px', height: '2px', background: i <= 9 ? C.accentBorder : C.border, flexShrink: 0 }} />
                  )}
                  {i === 0 && <div style={{ width: '20px' }} />}
                  {/* Node */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: C.accent,
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    boxShadow: `0 0 0 4px ${C.accentDim}`,
                  }}>{i + 1}</div>
                  {i < steps.length - 1 && (
                    <div style={{ width: '40px', height: '2px', background: C.accentBorder, flexShrink: 0 }} />
                  )}
                  {i === steps.length - 1 && <div style={{ width: '20px' }} />}
                </div>
                {/* Label */}
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '0.68rem',
                  color: C.mid,
                  textAlign: 'center',
                  maxWidth: '80px',
                  marginTop: '0.75rem',
                  lineHeight: 1.4,
                }}>{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Problem Space Section ────────────────────────────────
function ProblemSpaceSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const cards = [
    {
      title: 'Process Problems',
      items: [
        'Easy manipulation / fraud',
        'Biometric verification discrepancy',
        'Complicated form',
        'Unnecessary official intervention',
        'Low-res photo',
        'System errors',
        'Appointment unavailability',
        'Non-responsive helpline',
        'e-KYC failure',
        'Inaccessible remote services',
        'Update portal not working',
        'Delay in services',
      ],
    },
    {
      title: 'User-Side Problems',
      items: [
        'Fear of losing original card',
        'Forgetting Aadhaar number',
        'Naive users misled by agents',
        'Language barrier',
        'Lack of awareness',
        'Fingerprint issues (elderly, manual labourers)',
        'Access gaps for people with disabilities',
      ],
    },
    {
      title: 'Updation-Specific',
      items: [
        'Unclear update cycle',
        'No online update for phone / photo',
        'Denied requests',
        'Delayed process',
        'Biometric issues',
        'Cascaded / connected failures',
      ],
    },
  ]
  return (
    <section id="problem-space" ref={ref} style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Label>Problem Space</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 1.25rem' }}
        >
          Everything that can go wrong
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.7, maxWidth: '68ch', margin: '0 0 2.5rem' }}
        >
          We started by mapping every context in which Aadhaar shows up in Indian life — banking, SIM cards, ration, KYC, age verification, health insurance, academic admissions, official documents.
        </motion.p>

        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {cards.map((card) => (
            <StaggerItem key={card.title}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.accent, margin: '0 0 1rem', letterSpacing: '-0.01em' }}>{card.title}</h3>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {card.items.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: C.accent, flexShrink: 0, marginTop: '2px', fontSize: '0.7rem' }}>→</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Dark callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          style={{
            background: C.heroGrad,
            borderRadius: '14px',
            padding: 'clamp(1.5rem,3vw,2rem)',
            borderLeft: `4px solid ${C.amber}`,
          }}
        >
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.15rem)', color: C.darkInk, margin: 0, lineHeight: 1.65 }}>
            "We anchored on updation — the category with the richest, most painful user stories."
          </p>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Questions Section ────────────────────────────────────
function QuestionsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })

  const initial10 = [
    'How do people manage without Aadhaar?',
    'What barriers exist for elderly during Aadhaar update?',
    'How does location affect accessibility of Aadhaar centres?',
    'What role does family support play in Aadhaar processes?',
    'How do biometric failures affect access to benefits?',
    'What information sources do seniors rely on for Aadhaar?',
    'How does digital literacy affect Aadhaar independence?',
    'What emotional responses arise during Aadhaar failures?',
    'How do urgent situations change user behaviour?',
    'What alternatives exist when Aadhaar fails?',
  ]

  const refined4 = [
    'What challenges do seniors 60+ face accessing Aadhaar during urgency?',
    'How does dependency on family shape the experience of Aadhaar-related urgency?',
    'What role do emotional and psychological factors play in urgent Aadhaar situations?',
    'How do systemic failures compound the urgency for elderly users?',
  ]

  const fiveW = [
    { w: 'When', val: 'During urgent government / financial service needs' },
    { w: 'Who', val: 'Individuals aged 60+ across urban and semi-urban India' },
    { w: 'Where', val: 'Aadhaar enrolment centres, banks, ration shops, hospitals' },
    { w: 'What', val: 'Authentication failures, update difficulties, access barriers' },
    { w: 'Fear Factor', val: 'Fear of losing benefits, dependency, social embarrassment' },
  ]

  return (
    <section id="questions" ref={ref} style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Label>Research Questions</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 2.5rem' }}
        >
          From ten questions to one sharp focus
        </motion.h2>

        {/* Part 1 — Initial 10 questions */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.1, ease: EASE }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: C.accent, margin: '0 0 1rem' }}>Initial research questions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem 2rem', marginBottom: '2.5rem' }}>
            {initial10.map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.6rem 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: C.accent, flexShrink: 0, marginTop: '2px', minWidth: '1.5rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.5, margin: 0 }}>{q}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Part 2 — Refined 4 */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.2, ease: EASE }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: C.accent, margin: '0 0 1rem' }}>Refined focus questions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {refined4.map((q, i) => (
              <div key={i} style={{
                padding: '1.25rem',
                border: `1.5px solid ${C.accentBorder}`,
                borderRadius: '10px',
                background: C.accentDim,
              }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.ink, lineHeight: 1.6, margin: 0 }}>{q}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Part 3 — 5W Table */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.28, ease: EASE }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: C.accent, margin: '0 0 1rem' }}>5W breakdown</h3>
          <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Syne', sans-serif" }}>
              <thead>
                <tr>
                  {['Dimension', 'Context'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, padding: '0.6rem 1rem 0.6rem 0', borderBottom: `1.5px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fiveW.map(({ w, val }) => (
                  <tr key={w} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '0.75rem 1rem 0.75rem 0', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: C.accent, fontWeight: 700, whiteSpace: 'nowrap' }}>{w}</td>
                    <td style={{ padding: '0.75rem 0', fontSize: '0.82rem', color: C.mid, lineHeight: 1.5 }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Part 4 — Final research question */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
          style={{
            background: C.heroGrad,
            borderRadius: '14px',
            padding: 'clamp(1.75rem,3.5vw,2.5rem)',
            marginBottom: '2rem',
            borderTop: `4px solid ${C.amber}`,
          }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.darkMuted, margin: '0 0 1rem' }}>Final Research Question</p>
          <p style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem,1.8vw,1.4rem)',
            color: C.darkInk,
            lineHeight: 1.6,
            margin: 0,
          }}>
            "What are the primary challenges faced by individuals aged 60+ in accessing Aadhaar services during urgent situations?"
          </p>
        </motion.div>

        {/* Part 5 — Hypothesis + Null Hypothesis */}
        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {[
            {
              label: 'Hypothesis',
              body: 'Elderly individuals aged 60+ face significant challenges due to complicated paperwork, difficult processes, and emotional factors such as fear and anxiety.',
            },
            {
              label: 'Null Hypothesis',
              body: 'No major urgencies exist among elderly Aadhaar users, and factors like paperwork and emotional stress do not significantly impact their experience.',
            },
          ].map(({ label, body }) => (
            <StaggerItem key={label}>
              <NeuCard dark style={{ padding: '1.5rem', background: 'rgba(26,5,5,0.85)', border: `1px solid rgba(212,134,10,0.2)` }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.amber, margin: '0 0 0.75rem' }}>{label}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.darkMid, lineHeight: 1.65, margin: 0 }}>{body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Methodology Section ──────────────────────────────────
function MethodologySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const methods = [
    { title: 'Secondary Research', body: 'Analysed UIDAI reports, policy documents, existing studies on Aadhaar challenges, news coverage, and academic literature on elderly digital exclusion in India.' },
    { title: 'Questionnaire', body: '27 respondents from various parts of India, aged 60+. Mixed gender. Primarily focused on update history, dependency, urgency experiences, and emotional responses.' },
    { title: 'Primary Research', body: '5 deep-dive semi-structured interviews. Selected for diversity in urgency level, geography, and dependency pattern. Each session lasted 45–90 minutes.' },
  ]

  const questions = [
    'Have you ever updated your Aadhaar card?',
    'If yes, when did you last update it, and what was the reason?',
    'Have you ever faced difficulties accessing Aadhaar services?',
    'Did you need any assistance during the update/access process?',
    'Have you ever experienced an urgent situation related to your Aadhaar?',
    'If yes, how did you handle it? Who helped you?',
    'How did the experience make you feel (comfortable, stressed, confused)?',
    'Are you aware of online/digital options for Aadhaar updates?',
    'Have you ever faced biometric (fingerprint/iris) issues at an Aadhaar centre?',
    'What improvements would you suggest to make Aadhaar services better for seniors?',
  ]

  return (
    <section id="methodology" ref={ref} style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Label>Methodology</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 1rem' }}
        >
          Three-pronged approach
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.7, maxWidth: '66ch', margin: '0 0 2.5rem' }}
        >
          We triangulated across three methods to ensure that quantitative patterns were always grounded in lived experience — and that emotional data had a statistical backbone.
        </motion.p>

        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {methods.map((m) => (
            <StaggerItem key={m.title}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.accent, margin: '0 0 0.75rem' }}>{m.title}</h3>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{m.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Questionnaire questions */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.3, ease: EASE }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: C.accent, margin: '0 0 1.25rem' }}>Questionnaire — 10 questions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {questions.map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.85rem 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: C.accent, flexShrink: 0, marginTop: '3px', minWidth: '1.8rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.mid, lineHeight: 1.55, margin: 0 }}>{q}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Findings Section ─────────────────────────────────────
function FindingsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  const charts = [
    { pct: 68, color: C.accent,  label: 'Updated Aadhaar',    sublabel: '68.2% vs 31.8% never updated' },
    { pct: 77, color: C.amber,   label: 'Needed Assistance',  sublabel: '77.3% required help' },
    { pct: 68, color: C.terra,   label: 'Female Respondents', sublabel: '68.2% female · 31.8% male' },
    { pct: 81, color: C.accent,  label: 'No Urgency',         sublabel: '81% reported no urgency' },
  ]

  return (
    <section id="findings" ref={ref} style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Label>Quantitative Findings</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem' }}
        >
          The numbers
        </motion.h2>

        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {charts.map((c) => (
            <StaggerItem key={c.label} style={{ alignItems: 'center' }}>
              <DonutChart pct={c.pct} color={c.color} label={c.label} sublabel={c.sublabel} />
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Headline stat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          style={{
            background: C.heroGrad,
            borderRadius: '14px',
            padding: 'clamp(1.75rem,3.5vw,2.5rem)',
            marginBottom: '1.5rem',
            borderLeft: `4px solid ${C.accent}`,
          }}
        >
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,1.8vw,1.35rem)', color: C.darkInk, margin: 0, lineHeight: 1.6 }}>
            "81% of users did not face an Aadhaar-related urgency. The absence of urgency was itself the story."
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.mid, lineHeight: 1.7, margin: 0 }}
        >
          Gender × Assistance: 12 of 19 women needed assistance vs 3 of 8 men — suggesting gender plays a meaningful role in digital confidence and access-seeking behaviour.
        </motion.p>
      </Wrap>
    </section>
  )
}

// ─── Respondent Table Section ─────────────────────────────
function RespondentTableSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const respondents = [
    { n: 1,  name: 'Savitri',             age: 66,   gender: 'F', updated: 'Last year',        help: 'No',  urgency: 'No',  insight: 'Independent and aware' },
    { n: 2,  name: 'Arjuna',              age: 70,   gender: 'F', updated: 'Recently',          help: 'Yes', urgency: 'No',  insight: 'No recollection; recently unwell' },
    { n: 3,  name: 'Monish Chandra Roy',  age: '80+', gender: 'M', updated: '2022',             help: 'Yes', urgency: 'No',  insight: 'Smooth; home visit service' },
    { n: 4,  name: 'Sashiben',            age: 65,   gender: 'F', updated: 'Never',             help: 'Yes', urgency: 'No',  insight: 'Fully reliant on son' },
    { n: 5,  name: 'Hansaben',            age: 62,   gender: 'F', updated: 'Never',             help: 'Yes', urgency: 'No',  insight: 'Fully reliant on son' },
    { n: 6,  name: 'L.S. Kandhari',       age: 73,   gender: 'M', updated: 'Never',             help: 'No',  urgency: 'No',  insight: 'Confident; praised post-office home delivery' },
    { n: 7,  name: 'Mrs. Milda',          age: 75,   gender: 'F', updated: 'Never',             help: 'No',  urgency: 'No',  insight: 'Not tech-savvy; unaware of e-KYC' },
    { n: 8,  name: 'Sulochana',           age: '80+', gender: 'F', updated: 'Never',            help: 'Yes', urgency: 'No',  insight: 'No awareness; kids always handle' },
    { n: 9,  name: 'Shakuntala Gupta',    age: 80,   gender: 'F', updated: 'Last year',         help: 'Yes', urgency: 'No',  insight: 'Daughter helped' },
    { n: 10, name: 'Kala Gupta',          age: 80,   gender: 'F', updated: 'Never',             help: '—',   urgency: '—',   insight: 'Tremors; sons sign on her behalf' },
    { n: 11, name: 'Madhabi Sen',         age: 68,   gender: 'F', updated: 'No recollection',   help: 'Yes', urgency: 'Yes', insight: 'Felt helpless; pension inaccessible' },
    { n: 12, name: 'Mamta',               age: 65,   gender: 'F', updated: '2022',              help: 'Yes', urgency: 'No',  insight: 'Fear of Aadhaar misuse' },
    { n: 13, name: 'Kamla Devi',          age: 61,   gender: 'F', updated: 'Never',             help: 'Yes', urgency: 'No',  insight: 'Card torn by grandson; trusts centres' },
    { n: 14, name: 'Ram Kumar Singh',     age: 65,   gender: 'M', updated: '2023',              help: 'Yes', urgency: 'No',  insight: 'Sees govt task as tedious' },
    { n: 15, name: 'Vina Devi',           age: 62,   gender: 'F', updated: '2024',              help: 'Yes', urgency: 'Yes', insight: 'Would ask neighbourhood friends next time' },
    { n: 16, name: 'Varshini',            age: 61,   gender: 'F', updated: '2024',              help: 'Yes', urgency: 'No',  insight: 'Process smooth, just waiting' },
    { n: 17, name: 'Kamala Devi',         age: 64,   gender: 'F', updated: '2024',              help: 'Yes', urgency: 'Yes', insight: 'Delay meant missed ration' },
    { n: 18, name: 'Malayappan',          age: 62,   gender: 'M', updated: '2024',              help: 'No',  urgency: 'No',  insight: 'Card delivery could have been earlier' },
    { n: 19, name: 'Vetrivel',            age: 61,   gender: 'M', updated: '2024',              help: 'No',  urgency: 'No',  insight: 'System/server issue, had to repeat process' },
    { n: 20, name: 'Thenmozhi',           age: 70,   gender: 'F', updated: '2025',              help: 'Yes', urgency: 'No',  insight: "Didn't know what to do" },
    { n: 21, name: 'Kandhasamy',          age: 62,   gender: 'M', updated: '2024',              help: 'Yes', urgency: 'No',  insight: 'No hassle' },
    { n: 22, name: 'Ram Shankar Gupta',   age: 85,   gender: 'M', updated: '3 months ago',      help: 'Yes', urgency: 'Yes', insight: 'Went 2–3 times; system down; biometric failure; annoyed/stressed/scared' },
  ]

  const cols = ['#', 'Name', 'Age', 'Gender', 'Last Updated', 'Sought Help', 'Urgency', 'Key Insight']

  return (
    <section ref={ref} style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Label>Survey Respondents</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 2rem' }}
        >
          22 stories in numbers
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          style={{ overflowX: 'auto', borderRadius: '14px', boxShadow: C.neu }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', background: C.card, borderRadius: '14px', overflow: 'hidden', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: C.accent }}>
                {cols.map(c => (
                  <th key={c} style={{
                    textAlign: 'left',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.55rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.75)',
                    padding: '0.75rem 1rem',
                    whiteSpace: 'nowrap',
                  }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {respondents.map((r) => (
                <tr key={r.n} style={{
                  background: r.urgency === 'Yes' ? `rgba(212,134,10,0.08)` : 'transparent',
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.muted }}>{r.n}</td>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.ink, fontWeight: 600, whiteSpace: 'nowrap' }}>{r.name}</td>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.mid }}>{r.age}</td>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.mid }}>{r.gender}</td>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.mid, whiteSpace: 'nowrap' }}>{r.updated}</td>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: r.help === 'Yes' ? C.amber : C.mid }}>{r.help}</td>
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.58rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: r.urgency === 'Yes' ? C.amber : C.mid,
                      fontWeight: r.urgency === 'Yes' ? 700 : 400,
                    }}>{r.urgency}</span>
                  </td>
                  <td style={{ padding: '0.65rem 1rem', fontFamily: "'Syne', sans-serif", fontSize: '0.72rem', color: C.mid, lineHeight: 1.45 }}>{r.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Stories Section ──────────────────────────────────────
function StoriesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  const interviews = [
    {
      dark: true,
      urgencyLabel: 'HIGH',
      urgencyColor: '#C0392B',
      name: 'Madhabi Sen',
      age: 68,
      location: 'Bardhaman, West Bengal',
      quote: 'She didn\'t know where the nearest Aadhaar centre was or how long the process would take.',
      story: 'Went to withdraw pension. Fingerprint failed at the bank terminal. Bank staff gave no guidance on next steps. Felt completely helpless — pension was in the system, but she couldn\'t access it. Called her nephew (not her son — she felt intimidated asking him). Travelled by rickshaw to the nearest centre. Long queues, no seating available, and the prolonged standing caused leg pain. On arrival, was asked for an additional ID document she hadn\'t carried — forcing a second trip.',
      subheading: 'Her suggested improvements',
      subItems: [
        'Priority queue for elderly and disabled',
        'Proactive alerts about biometric fading over time',
        'Alternative verification methods (face recognition, OTP)',
      ],
    },
    {
      dark: false,
      urgencyLabel: 'LOW–MOD',
      urgencyColor: C.amber,
      name: 'Shakuntala Gupta',
      age: 80,
      location: 'Amravati, Maharashtra',
      quote: 'I will use a Xerox copy at home.',
      story: 'Uses Aadhaar primarily for ration collection. Depends fully on her daughter for any Aadhaar-related tasks. When asked what she would do if her card was lost and no one was around, she said: "I don\'t know what to do. I would feel scared and tense. Helpless. I can\'t walk properly; I need support for everything. But relieved that my daughter will get it done." Her daughter Reena (50) confirmed it\'s entirely her responsibility. The actual Aadhaar Kendra experience was smooth — chairs, helpful staff.',
      subheading: 'Notable exchange',
      subItems: [
        '"Would you want to be more independent with your Aadhaar?"',
        '"Yes, but I don\'t know how."',
      ],
    },
    {
      dark: false,
      urgencyLabel: 'MODERATE',
      urgencyColor: C.terra,
      name: 'R.K. Saraf',
      age: 70,
      location: 'Bengaluru, Karnataka',
      quote: 'I would definitely panic. I always carry the original and don\'t keep a copy.',
      story: 'Uses Aadhaar for travel, banking, and hotels. Has never lost it. Would ask his son if he did. His son manages all digital documentation. Presents himself as self-reliant and responsible — but has no soft copy, no e-Aadhaar, and a deep fear of technology that creates a hidden vulnerability. Knows contextually when to carry the original but relies entirely on his son for any digital or procedural layer.',
      subheading: 'Inferences',
      subItems: [
        'Reluctant to admit dependency; frames son\'s help as a choice',
        'Self-styled "responsible" person but digitally vulnerable',
        '"I would really appreciate independence, but I don\'t know how."',
      ],
    },
    {
      dark: false,
      urgencyLabel: 'MODERATE',
      urgencyColor: C.terra,
      name: 'Mamta',
      age: 62,
      location: 'Bengaluru, Karnataka',
      quote: 'I especially asked my bahu, because she takes care of everything in our house. She helps me find my glasses too — I forget things a lot.',
      story: 'Lost her plastic Aadhaar card in the metro. Realised two days later. Became tense immediately — started searching, asked her daughter-in-law for help. Her son reassured her. She was worried about money wasted if it couldn\'t be recovered. After two days of anxiety, checked the metro station (she had last been to the ISKCON temple). Metro staff were helpful — the card was found. She felt relief and a small sense of accomplishment. Has lost it twice. If no one was home: "I will talk to my neighbourhood friends of my same age." Prefers offline support with her son — "It\'s trustworthy there. I don\'t understand the phone as much."',
      subheading: 'Key notes',
      subItems: [
        'Community networks become the safety net when family isn\'t available',
        'Phone-based digital processes feel untrustworthy, not just unfamiliar',
        'Small autonomous resolutions (finding the card) carry emotional weight',
      ],
    },
    {
      dark: true,
      urgencyLabel: 'VERY HIGH',
      urgencyColor: '#8B1A1A',
      name: 'Kamala Devi',
      age: 72,
      location: 'Bardhaman, West Bengal',
      quote: 'Despite having a valid ration card and Aadhaar, she couldn\'t access her entitled food supply.',
      story: 'Went to collect her monthly ration allocation. Fingerprint verification failed at the ration shop. The shop refused to distribute without successful authentication. She was shocked and confused — had never faced this before. Being denied in front of others at the ration shop caused acute embarrassment and helplessness. Her son accompanied her to the Aadhaar centre, visibly frustrated about missing a day of work — she felt like a burden. The centre was far, requiring an auto-rickshaw ride. Long wait with no seating. Was then told she needed another ID she hadn\'t carried, forcing a second trip. She could not collect ration on time. Had to borrow rice from a neighbour. Felt deeply humiliated.',
      subheading: 'Hidden costs of the failure',
      subItems: [
        'Auto-rickshaw fare for multiple trips',
        'Cost of photocopies for documentation',
        'Lost work time for her son — and associated guilt',
        'Stress, humiliation, and borrowed rice',
      ],
    },
  ]

  const badgeStyle = (color, dark) => ({
    display: 'inline-block',
    fontFamily: "'Space Mono', monospace",
    fontSize: '0.58rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: dark ? '#fff' : color,
    background: dark ? `${color}33` : `${color}18`,
    border: `1px solid ${color}55`,
    padding: '3px 10px',
    borderRadius: '99px',
    marginBottom: '1.25rem',
  })

  return (
    <section id="stories" ref={ref} style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Label>Deep-Dive Interviews</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem' }}
        >
          Five stories of invisible friction
        </motion.h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {interviews.map((iv, i) => (
            <motion.div
              key={iv.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
              style={{
                background: iv.dark ? C.heroGrad : C.card,
                borderRadius: '16px',
                padding: 'clamp(1.75rem,3.5vw,2.5rem)',
                boxShadow: iv.dark
                  ? '6px 6px 20px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.03)'
                  : C.neu,
                border: iv.dark ? `1px solid rgba(255,255,255,0.06)` : 'none',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={badgeStyle(iv.urgencyColor, iv.dark)}>Urgency: {iv.urgencyLabel}</span>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.1rem,1.8vw,1.35rem)', color: iv.dark ? C.darkInk : C.ink, margin: '0 0 0.25rem', lineHeight: 1.2 }}>{iv.name}</h3>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: iv.dark ? C.darkMuted : C.muted, margin: 0, letterSpacing: '0.06em' }}>{iv.age} · {iv.location}</p>
                </div>
              </div>

              {/* Pull quote */}
              <blockquote style={{
                margin: '0 0 1.5rem',
                padding: '1rem 1.5rem',
                borderLeft: `3px solid ${iv.urgencyColor}`,
                background: iv.dark ? 'rgba(255,255,255,0.04)' : C.accentDim,
                borderRadius: '0 8px 8px 0',
              }}>
                <p style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1rem,1.5vw,1.15rem)',
                  color: iv.dark ? C.darkMid : C.mid,
                  margin: 0,
                  lineHeight: 1.6,
                }}>"{iv.quote}"</p>
              </blockquote>

              {/* Story body */}
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', color: iv.dark ? C.darkMid : C.mid, lineHeight: 1.75, margin: '0 0 1.5rem' }}>{iv.story}</p>

              {/* Sub-items */}
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: iv.dark ? C.darkMuted : C.muted, margin: '0 0 0.75rem' }}>{iv.subheading}</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {iv.subItems.map((s, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <span style={{ color: iv.urgencyColor, flexShrink: 0, fontSize: '0.75rem', marginTop: '2px' }}>·</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: iv.dark ? C.darkMid : C.mid, lineHeight: 1.5 }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

// ─── Emotional Intensity SVG Chart ────────────────────────
function EmotionalChart() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const phases = ['Problem\nEncountered', 'Seeking\nAssistance', 'Navigating\nthe Process', 'Resolution']
  const series = [
    { name: 'Mamta',             data: [6, 7, 10, 4], color: C.terra },
    { name: 'Madhabi Sen',       data: [5, 8, 10, 3], color: C.accent },
    { name: 'R.K. Saraf',        data: [6, 7,  4, 3], color: '#9A8070' },
    { name: 'Kamala Devi',       data: [9, 10, 10, 7], color: '#8B1A1A' },
    { name: 'Shakuntala Gupta',  data: [7,  5,  2, 2], color: C.amber },
  ]

  const W = 560, H = 240
  const padL = 36, padR = 20, padT = 16, padB = 48
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  function toX(i) { return padL + (i / 3) * chartW }
  function toY(v) { return padT + chartH - (v / 10) * chartH }

  function pathFor(data) {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ')
  }

  return (
    <div ref={ref}>
      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '320px', height: 'auto' }}>
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map(v => (
            <g key={v}>
              <line x1={padL} x2={W - padR} y1={toY(v)} y2={toY(v)} stroke={C.border} strokeWidth={1} strokeDasharray="3 4" />
              <text x={padL - 6} y={toY(v) + 4} textAnchor="end" fontFamily="'Space Mono', monospace" fontSize={9} fill={C.muted}>{v}</text>
            </g>
          ))}

          {/* Phase labels */}
          {phases.map((label, i) => {
            const x = toX(i)
            return label.split('\n').map((line, li) => (
              <text key={`${i}-${li}`} x={x} y={H - padB + 14 + li * 12} textAnchor="middle" fontFamily="'Space Mono', monospace" fontSize={8} fill={C.muted}>{line}</text>
            ))
          })}

          {/* Lines */}
          {series.map(s => (
            <motion.path
              key={s.name}
              d={pathFor(s.data)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.2 }}
            />
          ))}

          {/* Dots */}
          {series.map(s =>
            s.data.map((v, i) => (
              <motion.circle
                key={`${s.name}-${i}`}
                cx={toX(i)} cy={toY(v)} r={4}
                fill={s.color}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
              />
            ))
          )}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {series.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 12, height: 3, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.mid }}>{s.name}</span>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.75rem', color: C.muted, lineHeight: 1.55, marginTop: '0.75rem', fontStyle: 'italic' }}>
        The process phase spikes hardest for most. Resolution rarely brings full closure — especially where survival needs were at stake.
      </p>
    </div>
  )
}

// ─── Synthesis Section ────────────────────────────────────
function SynthesisSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const urgencyTable = [
    { name: 'Madhabi Sen',       level: 'HIGH',     why: 'Pension inaccessible; lack of guidance; felt like a burden' },
    { name: 'Shakuntala Gupta',  level: 'LOW–MOD',  why: 'Fully dependent; no independent action if lost' },
    { name: 'Mamta',             level: 'MODERATE', why: 'Lost twice; tension but no immediate crisis; community support' },
    { name: 'R.K. Saraf',        level: 'MODERATE', why: 'Never lost; reluctance to digital creates hidden vulnerability' },
    { name: 'Kamala Devi',       level: 'VERY HIGH',why: 'Denied ration; multiple costly trips; embarrassment + financial constraint' },
  ]

  const takeaways = [
    { n: 1, text: 'Highest urgency where verification failures affected survival needs (pension, ration)' },
    { n: 2, text: 'Moderate urgency where family was available but occasional disruptions occurred' },
    { n: 3, text: 'Implicit across all: "government work is tedious" shapes the entire Aadhaar relationship' },
  ]

  const bigFactors = [
    { title: 'Gender plays a role', body: 'Confidence levels, willingness to act independently, and capacity to find information all correlate with gender.' },
    { title: 'Emotions track reliability of support', body: 'Those with reliable caregivers experience less distress. The care network is the true safety system.' },
    { title: 'Awareness shapes intensity', body: 'Users who understand consequences feel panic when things fail. Unaware users stay passive — even at high risk.' },
    { title: 'Independence and accountability differ', body: 'For some, it\'s about getting Aadhaar back. For others, it\'s about whether they could do it themselves.' },
  ]

  return (
    <section id="synthesis" ref={ref} style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Label>Cross-Interview Analysis</Label>

        {/* Part 1 — Urgency table */}
        <motion.h3
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.2rem,2vw,1.6rem)', color: C.ink, margin: '0 0 1.25rem' }}
        >
          Urgency levels, compared
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          style={{ overflowX: 'auto', marginBottom: '2.5rem', borderRadius: '14px', boxShadow: C.neu }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', background: C.card, minWidth: '520px' }}>
            <thead>
              <tr style={{ background: C.accent }}>
                {['Interviewee', 'Urgency Level', 'Why'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', padding: '0.75rem 1rem' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {urgencyTable.map(r => (
                <tr key={r.name} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: C.ink, fontWeight: 600, whiteSpace: 'nowrap' }}>{r.name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: r.level === 'VERY HIGH' ? '#8B1A1A' : r.level === 'HIGH' ? '#C0392B' : r.level === 'MODERATE' ? C.terra : C.muted,
                      fontWeight: 700,
                    }}>{r.level}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', color: C.mid, lineHeight: 1.5 }}>{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Takeaways */}
        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {takeaways.map((t) => (
            <StaggerItem key={t.n}>
              <NeuCard dark style={{ padding: '1.5rem', background: 'rgba(26,5,5,0.88)', border: `1px solid rgba(90,28,10,0.35)` }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: C.amber, display: 'block', marginBottom: '0.5rem' }}>0{t.n}</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.darkMid, lineHeight: 1.65, margin: 0 }}>{t.text}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Part 2 — Definition of urgency */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          style={{
            background: C.heroGrad,
            borderRadius: '14px',
            padding: 'clamp(1.75rem,3.5vw,2.25rem)',
            marginBottom: '1rem',
            borderTop: `4px solid ${C.amber}`,
          }}
        >
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,1.5vw,1.15rem)', color: C.darkInk, margin: '0 0 1rem', lineHeight: 1.65 }}>
            "Urgency is a situation where you get something done in a short period of time — if not done, there will be certain consequences. It can be subjective."
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.darkMid, margin: 0, lineHeight: 1.65 }}>
            "If they know the consequences, they know the panic. If they don't know the consequences, they are very passive about it."
          </p>
        </motion.div>

        {/* Part 3 — Emotional chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
          style={{ marginTop: '3rem', marginBottom: '3rem' }}
        >
          <Label>Emotional Journey</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.2rem,2vw,1.6rem)', color: C.ink, margin: '0 0 2rem' }}>
            How intensity moves across phases
          </h3>
          <NeuCard style={{ padding: 'clamp(1.25rem,3vw,2rem)' }}>
            <EmotionalChart />
          </NeuCard>
        </motion.div>

        {/* Part 4 — Four big factors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
        >
          <Label>Key Factors</Label>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.2rem,2vw,1.6rem)', color: C.ink, margin: '0 0 1.5rem' }}>
            What the data kept surfacing
          </h3>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {bigFactors.map((f) => (
              <StaggerItem key={f.title}>
                <NeuCard style={{ padding: '1.5rem', height: '100%' }}>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.accent, margin: '0 0 0.6rem' }}>{f.title}</h4>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{f.body}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Framework Section ────────────────────────────────────
function FrameworkSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  const connections = [
    { label: 'Higher vulnerability → greater reliance' },
    { label: 'Dependence on caregivers → reduced personal awareness' },
    { label: 'Being aware → becoming more independent and accountable' },
    { label: 'Lack of self-sufficiency → makes individuals more vulnerable' },
  ]

  return (
    <section id="framework" ref={ref} style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Label>Conceptual Framework</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 1rem' }}
        >
          Eight concepts, one system
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.7, maxWidth: '66ch', margin: '0 0 3rem' }}
        >
          This is the conceptual payoff of the project. Four primary dynamics and four secondary forces — and the relationships that connect them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}
        >
          <svg viewBox="0 0 500 500" style={{ width: '100%', maxWidth: 480, height: 'auto' }}>
            <defs>
              <filter id="fw-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Outer dashed circle */}
            <circle cx={250} cy={250} r={180} fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="6 8" />
            {/* Inner solid circle */}
            <circle cx={250} cy={250} r={100} fill="none" stroke={C.accentBorder} strokeWidth={1} />

            {/* Connection lines — dashed */}
            {/* Reliability ↔ Vulnerability */}
            <path d="M250,70 Q360,160 432,250" fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="4 5" />
            {/* Awareness ↔ Independence */}
            <path d="M250,430 Q140,340 68,250" fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="4 5" />
            {/* Vulnerability ↔ Accountability */}
            <line x1={432} y1={250} x2={377} y2={123} stroke={C.border} strokeWidth={1} strokeDasharray="4 5" />
            {/* Awareness ↔ Consequences */}
            <line x1={250} y1={430} x2={377} y2={377} stroke={C.border} strokeWidth={1} strokeDasharray="4 5" />

            {/* PRIMARY nodes */}
            {[
              { label: 'Reliability',   x: 250, y:  70 },
              { label: 'Vulnerability', x: 432, y: 250 },
              { label: 'Awareness',     x: 250, y: 430 },
              { label: 'Independence',  x:  68, y: 250 },
            ].map(({ label, x, y }) => (
              <motion.g key={label}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                filter="url(#fw-glow)"
              >
                <circle cx={x} cy={y} r={42} fill={C.accent} />
                <text x={x} y={y - 6} textAnchor="middle" fill="#fff" fontFamily="'Syne', sans-serif" fontSize={10} fontWeight="700">{label.split(' ')[0]}</text>
                {label.split(' ')[1] && <text x={x} y={y + 8} textAnchor="middle" fill="#fff" fontFamily="'Syne', sans-serif" fontSize={10} fontWeight="700">{label.split(' ')[1]}</text>}
              </motion.g>
            ))}

            {/* SECONDARY nodes */}
            {[
              { label: 'Accountability', x: 377, y: 123 },
              { label: 'Consequences',   x: 377, y: 377 },
              { label: 'Mindset',        x: 123, y: 377 },
              { label: 'Process',        x: 123, y: 123 },
            ].map(({ label, x, y }) => (
              <motion.g key={label}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <circle cx={x} cy={y} r={30} fill={C.accentDim} stroke={C.accent} strokeWidth={1.5} />
                <text x={x} y={y + 4} textAnchor="middle" fill={C.ink} fontFamily="'Space Mono', monospace" fontSize={8}>{label}</text>
              </motion.g>
            ))}

            {/* Centre label */}
            <text x={250} y={244} textAnchor="middle" fill={C.accent} fontFamily="'Syne', sans-serif" fontSize={11} fontWeight="700">System</text>
            <text x={250} y={260} textAnchor="middle" fill={C.muted} fontFamily="'Space Mono', monospace" fontSize={8}>Framework</text>
          </svg>
        </motion.div>

        {/* Relationship descriptions */}
        <StaggerGrid style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {connections.map((c, i) => (
            <StaggerItem key={i}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.85rem 1.25rem', background: C.accentDim, borderRadius: '8px', border: `1px solid ${C.accentBorder}` }}>
                <span style={{ color: C.accent, fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', flexShrink: 0 }}>→</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.mid, margin: 0, lineHeight: 1.5 }}>{c.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Insights Section ─────────────────────────────────────
function InsightsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const insights = [
    { n: 1, title: 'Urgency = Survival Needs', body: 'Pension and ration failures cause the most acute distress. When Aadhaar fails a survival-linked service, the emotional and material consequences are immediate.' },
    { n: 2, title: 'Dependence ≠ Crisis', body: 'Losing independence is more critical than needing help. Most seniors have family support — but that dependency itself creates anxiety, guilt, and reduced autonomy.' },
    { n: 3, title: 'No Proactive Alerts', body: 'Biometric failures lead to last-minute denials. No system warns users their fingerprints are fading. Urgency is always reactive, never anticipated.' },
    { n: 4, title: 'Exhausting Process', body: 'Long waits, rude staff, repeat visits, and unclear documentation requirements compound stress. Each friction point multiplies the emotional cost.' },
    { n: 5, title: 'Digital Gap', body: 'Seniors want independence but lack awareness of online options. Fear of making mistakes — not just unfamiliarity — keeps them away from digital channels.' },
    { n: 6, title: 'Inflexible System', body: 'Fingerprint failures highlight the need for alternatives. Face recognition, OTP-based authentication, and assisted digital access are all viable and needed.' },
  ]

  const interviewFindings = [
    { title: 'Reliability on Family', body: 'Seniors rely heavily on caregivers for Aadhaar processes. When caregivers are unavailable or show frustration, seniors feel like burdens — compounding distress.' },
    { title: 'Limited Digital Access', body: 'Strong preference for in-person processes. Fear of making mistakes with technology is a bigger barrier than unfamiliarity with the technology itself.' },
    { title: 'Authentication Issues', body: 'Biometric failures are frequent and unpredictable. No backup authentication exists at most service points. ID documents required are inconsistent and unanticipated.' },
    { title: 'Urgency = Stress & Costs', body: 'Aadhaar failures blocking pensions or rations cause immediate financial anxiety. Multiple trips = transport costs, lost caregiver work time, and sustained emotional stress.' },
  ]

  return (
    <section id="insights" ref={ref} style={{ background: C.bg, ...PAD }}>
      <Wrap>
        <Label>Key Insights</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 2.5rem' }}
        >
          What the research confirmed
        </motion.h2>

        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {insights.map((ins) => (
            <StaggerItem key={ins.n}>
              <NeuCard style={{ padding: '1.5rem', height: '100%' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: C.accent, display: 'block', marginBottom: '0.5rem' }}>0{ins.n}</span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.ink, margin: '0 0 0.6rem' }}>{ins.title}</h3>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, lineHeight: 1.65, margin: 0 }}>{ins.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* 4 interview findings — dark cards */}
        <motion.h3
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: C.accent, margin: '0 0 1.25rem' }}
        >
          From the interviews
        </motion.h3>
        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {interviewFindings.map((f) => (
            <StaggerItem key={f.title}>
              <NeuCard dark style={{ padding: '1.5rem', height: '100%', background: 'rgba(26,5,5,0.85)', border: `1px solid rgba(90,28,10,0.3)` }}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.amber, margin: '0 0 0.6rem' }}>{f.title}</h3>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.darkMid, lineHeight: 1.65, margin: 0 }}>{f.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Pivot Section ────────────────────────────────────────
function PivotSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const reasons = [
    { n: 1, title: 'Lack of Immediate Need', body: 'Most elderly individuals do not face pressing consequences from an outdated Aadhaar in their day-to-day life. Urgency is episodic, not chronic.' },
    { n: 2, title: 'Dependency Reduces Urgency', body: 'With family support reliably available, they do not feel the need to act proactively. The family buffer absorbs the urgency before it reaches the elderly person.' },
    { n: 3, title: 'Minimal Reported Consequences', body: 'The data did not surface many cases of blocked pensions or banking failures directly — even among those who had never updated their Aadhaar.' },
    { n: 4, title: 'Reactive Approach', body: 'Seniors update only when externally triggered — by bank linking requirements, PAN linking deadlines, or government benefit disbursal changes.' },
  ]

  const solutions = [
    { title: 'Proactive Awareness Campaigns', body: 'Community-level outreach in local languages explaining Aadhaar validity, biometric degradation, and what it means for pension and ration access.' },
    { title: 'Preemptive SMS / Call Notifications', body: 'UIDAI system-triggered alerts when biometric data is flagged as potentially degraded, or when last update exceeds a threshold.' },
    { title: 'Senior-Friendly Update Services', body: 'Home visits for bedridden or mobility-impaired seniors. Priority counters at Aadhaar Kendras. Chairs and signage. Simplified document checklists.' },
    { title: 'Community-Based Assistance Models', body: 'Trained neighbourhood volunteers — trusted peer figures who can assist with Aadhaar processes without the power dynamics of relying on adult children.' },
  ]

  return (
    <section id="pivot" ref={ref} style={{ background: C.heroGrad, ...PAD }}>
      <Wrap>
        <Label dark>The Honest Pivot</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.darkInk, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 1rem' }}
        >
          Our hypothesis was wrong — and that was the finding.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.darkMid, lineHeight: 1.7, maxWidth: '66ch', margin: '0 0 2.5rem' }}
        >
          After completing primary research, the data suggested urgency wasn't as prevalent as assumed. We considered four reasons why our urgency-centric frame might be incomplete:
        </motion.p>

        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {reasons.map((r) => (
            <StaggerItem key={r.n}>
              <div style={{
                padding: '1.5rem',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                height: '100%',
              }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.62rem', color: C.amber, display: 'block', marginBottom: '0.5rem' }}>0{r.n}</span>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.darkInk, margin: '0 0 0.6rem' }}>{r.title}</h3>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.darkMid, lineHeight: 1.65, margin: 0 }}>{r.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* The Reframing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          style={{ marginBottom: '2rem', padding: 'clamp(1.5rem,3vw,2rem)', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.darkMuted, margin: '0 0 0.75rem' }}>Instead of asking:</p>
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(0.9rem,1.4vw,1.05rem)', color: C.darkMuted, margin: '0 0 1.5rem', lineHeight: 1.6, textDecoration: 'line-through', opacity: 0.7 }}>
            "What are the primary challenges faced by individuals 60+ in accessing Aadhaar services during urgent situations?"
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.amber, margin: '0 0 0.75rem' }}>We asked:</p>
          <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,1.6vw,1.2rem)', color: C.darkInk, margin: 0, lineHeight: 1.65 }}>
            "How can urgency be effectively communicated to elderly citizens to ensure proactive Aadhaar updates, reducing last-minute stress and dependency?"
          </p>
        </motion.div>

        {/* Revised problem statement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.38, ease: EASE }}
          style={{
            padding: 'clamp(1.5rem,3vw,2rem)',
            border: `2px solid ${C.amber}40`,
            borderRadius: '14px',
            background: 'rgba(212,134,10,0.06)',
            marginBottom: '3rem',
          }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.amber, margin: '0 0 1rem' }}>Revised Problem Statement</p>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1rem,1.6vw,1.2rem)', color: C.darkInk, margin: '0 0 1rem', lineHeight: 1.35 }}>
            Enhancing the Urgency and Accessibility of Aadhaar Updates for Elderly Citizens in India
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.darkMid, lineHeight: 1.7, margin: '0 0 1rem' }}>
            While urgency isn't explicit in most responses, a hidden urgency exists — delayed updates can disrupt pension services, cause loss of benefits, or block KYC processes when they matter most.
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.darkMuted, margin: '0 0 0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hidden urgency factors:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['Access to essential services', 'Health-related limitations', 'Dependency on family', 'Lack of awareness leading to crisis', 'Trust in physical but resistance to digital'].map(tag => (
              <span key={tag} style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.6rem',
                color: C.amber,
                border: `1px solid ${C.amber}40`,
                padding: '3px 10px',
                borderRadius: '99px',
                letterSpacing: '0.05em',
              }}>{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Solution directions */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.44, ease: EASE }}
        >
          <Label dark>Solution Directions</Label>
          <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {solutions.map((s) => (
              <StaggerItem key={s.title}>
                <NeuCard dark style={{ padding: '1.5rem', height: '100%' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.darkInk, margin: '0 0 0.6rem' }}>{s.title}</h3>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.darkMid, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Reflections Section ──────────────────────────────────
function ReflectionsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  const metaphors = [
    { icon: '⟋', word: 'Staircase', desc: 'The effortful climb of the process — each step visible, each step possible, none of them easy.' },
    { icon: '∿', word: 'Wrinkles', desc: 'Time, weathering, fading biometrics. The body carries history that the system cannot read.' },
    { icon: '⌇', word: 'Cliff', desc: 'The sudden drop when pension or ration fails. No warning. No railing.' },
  ]

  return (
    <section ref={ref} style={{ background: C.dark, ...PAD }}>
      <Wrap>
        <Label dark>Closing Reflection</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: EASE }}
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.darkInk, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem' }}
        >
          What stayed with us
        </motion.h2>

        <StaggerGrid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {metaphors.map((m) => (
            <StaggerItem key={m.word}>
              <div style={{
                padding: '2rem',
                border: `1px solid ${C.borderDark}`,
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                height: '100%',
              }}>
                <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '2.5rem', color: C.amber, margin: '0 0 0.5rem', lineHeight: 1 }}>{m.icon}</p>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.darkInk, margin: '0 0 0.75rem' }}>{m.word}</h3>
                <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.95rem', color: C.darkMid, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* Team credit */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3, ease: EASE }}
          style={{ textAlign: 'center', paddingTop: '2rem', borderTop: `1px solid ${C.borderDark}` }}
        >
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: C.darkInk, margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
            Group 5 — The Eligibles
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: C.darkMuted, letterSpacing: '0.12em', margin: '0 0 0.5rem', textTransform: 'uppercase' }}>
            NID Bangalore · UX Research Studio · 2024
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.darkMuted, margin: 0, lineHeight: 1.6 }}>
            A six-week inquiry into the lives of elderly Indians navigating a system built for the average.
          </p>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// PAGE — Default Export
// ═══════════════════════════════════════════════════════════
export default function Aadhaar() {
  const sectionIds = NAV_SECTIONS.map(s => s.id)
  const activeSection = useActiveSection(sectionIds)

  return (
    <div style={{ background: C.bg, color: C.ink, overflowX: 'hidden' }}>
      <ProgressBar />
      <Nav />
      <SidebarNav active={activeSection} />

      <main>
        <HeroSection />
        <WhySection />
        <ProcessSection />
        <ProblemSpaceSection />
        <QuestionsSection />
        <MethodologySection />
        <FindingsSection />
        <RespondentTableSection />
        <StoriesSection />
        <SynthesisSection />
        <FrameworkSection />
        <InsightsSection />
        <PivotSection />
        <ReflectionsSection />
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
