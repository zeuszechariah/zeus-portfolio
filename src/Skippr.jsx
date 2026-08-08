import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Nav, Footer, ProgressBar, MaskReveal, Reveal, BackToTop } from './shared.jsx'

// ─── Design Tokens ──────────────────────────────────────
const C = {
  page:         '#F9F7F2',
  surface:      '#F0EDE5',
  card:         '#FDFBF7',
  neu:          '6px 6px 18px rgba(0,0,0,0.07), -4px -4px 12px rgba(255,255,255,0.9)',
  neuSm:        '4px 4px 10px rgba(0,0,0,0.06), -3px -3px 7px rgba(255,255,255,0.92)',
  accent:       '#C49A1A',
  accentMid:    '#D4B044',
  accentDim:    'rgba(196,154,26,0.10)',
  accentBorder: 'rgba(196,154,26,0.28)',
  dark:         '#0A0900',
  heroGrad:     'linear-gradient(145deg, #0A0900 0%, #141200 60%, #2A2000 100%)',
  darkInk:      '#F9F7F2',
  darkMid:      'rgba(249,247,242,0.65)',
  darkMuted:    'rgba(249,247,242,0.38)',
  ink:          '#1A1600',
  mid:          '#5A4E20',
  muted:        '#9A8E58',
  border:       'rgba(0,0,0,0.08)',
  green:        '#1B7A3A',
  red:          '#C93B30',
}

const EASE = [0.22, 1, 0.36, 1]

const NAV_SECTIONS = [
  { id: 'overview',    label: 'Overview' },
  { id: 'research',    label: 'Research' },
  { id: 'design',      label: 'Design'   },
  { id: 'product',     label: 'Product'  },
  { id: 'reflections', label: 'Reflect'  },
]

// ─── Helpers ─────────────────────────────────────────────
function Icon({ name, size = 22, style = {} }) {
  return (
    <span className="material-symbols-outlined"
      style={{ fontSize: size, lineHeight: 1, display: 'block', ...style }}>
      {name}
    </span>
  )
}

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
      display: 'inline-block', fontFamily: "'Space Mono', monospace",
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
      fontFamily: "'Space Mono', monospace", fontSize: '0.6rem',
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,0.3)' : C.muted,
      display: 'block', marginBottom: '1.5rem',
    }}>{children}</span>
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
    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', boxShadow: '6px 6px 18px rgba(0,0,0,0.4), -3px -3px 10px rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', ...style }}>{children}</div>
  )
  return (
    <div style={{ background: C.card, borderRadius: '14px', boxShadow: C.neu, ...style }}>{children}</div>
  )
}

function ImgBox({ label, aspect = '16/9' }) {
  return (
    <div style={{ width: '100%', aspectRatio: aspect, borderRadius: '14px', border: `2px dashed ${C.accentBorder}`, background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, opacity: 0.6 }}>{label}</span>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────
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
      obs.observe(el); observers.push(obs)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      observers.forEach(o => o.disconnect())
    }
  }, [])
  return active
}

// ─── Hero ────────────────────────────────────────────────
function HeroSection() {
  return (
    <div id="overview" style={{ position: 'relative', backgroundImage: 'url(/skippr-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 40%', paddingTop: 'clamp(7rem,12vw,11rem)', paddingBottom: 'clamp(5rem,8vw,8rem)', overflow: 'hidden' }}>
      {/* Dark overlay — amber-tinted gradient left to right */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,9,0,0.95) 0%, rgba(20,18,0,0.85) 45%, rgba(10,9,0,0.55) 100%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', top: '-15%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,154,26,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
        <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.20)', padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem' }}>
          Phygital Interaction Design · Ergonomics · Retail
        </span>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(2.8rem,6vw,5rem)', lineHeight: 1.0, color: '#FFFFFF', margin: '0 0 0.5rem', letterSpacing: '-0.03em', textWrap: 'balance' }}>
          Skippr
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.9rem,1.8vw,1.05rem)', lineHeight: 1.78, color: 'rgba(255,255,255,0.72)', maxWidth: '48ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
          <strong>A clip-on self-checkout device</strong> for shopping carts. Tap-to-scan sensor, joystick confirmation, real-time billing on the go. The fastest way to shop without ever waiting in a queue.
        </p>

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[
            { l: 'Duration',        v: '4 Weeks' },
            { l: 'Collaborators',   v: 'Harsh V · Parag G' },
            { l: 'Tools',           v: 'Fusion 360 · Figma' },
            { l: 'Output',          v: 'Prototype · Interaction Flow' },
          ].map(m => (
            <div key={m.l}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#FFFFFF', margin: 0 }}>{m.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Why This Project ────────────────────────────────────
function WhySection() {
  return (
    <section style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Reveal><SectionTag>Why This Project</SectionTag></Reveal>
          <MaskReveal delay={0.1}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', letterSpacing: '-0.02em', lineHeight: 1.05, color: C.ink, marginBottom: '1.5rem', textWrap: 'balance' }}>
              Why must shopping always<br /><em style={{ fontStyle: 'italic', color: C.accent }}>end in waiting?</em>
            </h2>
          </MaskReveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.9rem', color: C.mid, lineHeight: 1.85, maxWidth: '60ch', margin: '0 auto 2rem', textAlign: 'left', textWrap: 'pretty', hyphens: 'auto' }}>
              I hate waiting. You hate waiting. Everyone shuffling forward in a checkout line (phone in one hand, cart in the other, list long forgotten) is the problem I designed Skippr to fix. The queue isn't a logistical hiccup. It's a <em>flow</em> killer. <strong>Skippr was my attempt to turn that dead time into something that actually moves.</strong> (Because my patience is officially sub-zero.)
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <blockquote style={{ padding: '1.25rem 1.75rem', background: C.accentDim, borderLeft: `3px solid ${C.accent}`, borderRadius: '0 10px 10px 0', textAlign: 'left', margin: '0 auto', maxWidth: '56ch' }}>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1rem,1.8vw,1.2rem)', color: C.ink, margin: 0, lineHeight: 1.65, textWrap: 'pretty' }}>
                "When time becomes a queue, opportunity lies in restoring flow."
              </p>
            </blockquote>
          </Reveal>
        </div>
      </Wrap>
    </section>
  )
}

// ─── Research ────────────────────────────────────────────
function ResearchSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const observations = [
    { n: '01', jsx: <span>The three-handed juggle is real. Cart, list, phone: shoppers split attention across all three simultaneously, with <span style={{ background: 'linear-gradient(to bottom, transparent 55%, #FFE566 55%)', paddingBottom: '1px', display: 'inline' }}>no tool designed to bridge them.</span></span> },
    { n: '02', jsx: <span><span style={{ background: 'linear-gradient(to bottom, transparent 55%, #FFE566 55%)', paddingBottom: '1px', display: 'inline' }}>Pivoting, pushing, tapping:</span> a kinetic language the product had to speak.</span> },
    { n: '03', jsx: <span><span style={{ background: 'linear-gradient(to bottom, transparent 55%, #FFE566 55%)', paddingBottom: '1px', display: 'inline' }}>The sweet spot for interaction:</span> 900–1100mm from the floor. Every control on Skippr lives exactly there.</span> },
  ]

  const frictionPoints = [
    { icon: 'hourglass_empty', title: 'Long Queues',             body: 'The ultimate flow killer. I timed the silence in a checkout line. It is not neutral. It drains.' },
    { icon: 'touch_app',       title: 'Shared Kiosks',           body: 'Interfaces built for everyone end up working for no one. Skippr is yours the moment it clips on.' },
    { icon: 'notifications_off', title: 'Lack of Feedback',      body: 'No beep. No light. No idea if it worked. Every Skippr action needed to feel confirmed.' },
    { icon: 'developer_board', title: 'Bulky Handheld Scanners', body: 'A brick you have to carry. Skippr clips and disappears, until you need it.' },
  ]

  return (
    <section id="research" ref={ref} style={{ background: C.page, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Ethnographic Research</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            The Everyday Ballet
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.78, maxWidth: '52ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            Three visits. Three stores. One recurring truth: shoppers are perpetually <em>three-handed</em>. <strong>Phone for the list, hand for the cart, eyes for the shelves.</strong> And somehow, no product had been built to respect that juggling act. I traced the choreography until the pattern was impossible to ignore.
          </p>
        </Reveal>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mid }}>Field visits:</span>
          {['IKEA', 'DMart', 'FnF'].map(site => (
            <span key={site} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: C.accentDim, color: C.accent, border: `1px solid ${C.accentBorder}`, borderRadius: '99px', padding: '4px 12px' }}>{site}</span>
          ))}
        </motion.div>

        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3.5rem' }}>
          {observations.map(o => (
            <StaggerItem key={o.n}>
              <NeuCard style={{ padding: '1.5rem', height: '100%' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.accent, margin: '0 0 0.75rem' }}>{o.n}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', color: C.ink, lineHeight: 1.68, margin: 0, textWrap: 'pretty' }}>{o.jsx || o.text}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal delay={0.1}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', color: C.ink, letterSpacing: '-0.02em', margin: '0 0 2rem', textWrap: 'balance' }}>
            The friction points we mapped
          </h3>
        </Reveal>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', marginBottom: '3.5rem', minHeight: 360 }}>
          {/* Dotted cross */}
          <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: `1.5px dotted ${C.border}`, transform: 'translateX(-50%)', pointerEvents: 'none' }} />
          <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: `1.5px dotted ${C.border}`, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          {frictionPoints.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Icon name={f.icon} size={24} style={{ color: C.accent }} />
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: C.ink, margin: 0 }}>{f.title}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.mid, lineHeight: 1.65, margin: 0, textWrap: 'pretty' }}>{f.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.3, ease: EASE }}
          style={{ padding: '2rem 2.5rem', background: `linear-gradient(135deg, ${C.accentDim}, rgba(196,154,26,0.04))`, borderRadius: '16px', border: `1px solid ${C.accentBorder}`, textAlign: 'center' }}>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.4rem)', color: C.ink, margin: 0, lineHeight: 1.65, textWrap: 'balance' }}>
            "The queue is the silent friction in modern retail, and friction is where design begins."
          </p>
        </motion.div>
      </Wrap>
    </section>
  )
}

// ─── Brief ───────────────────────────────────────────────
function BriefSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <section style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Project Brief</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            Design the clip-on checkout
          </h2>
        </Reveal>
        <div ref={ref} className="cc-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }}>
            <div style={{ background: C.accentDim, border: `1.5px solid ${C.accentBorder}`, borderRadius: '14px', padding: '1.75rem', height: '100%', boxSizing: 'border-box' }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.accent, margin: '0 0 1rem' }}>Design Challenge</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.ink, lineHeight: 1.78, margin: 0, textWrap: 'pretty' }}>
                Design a phygital product that allows users to skip queues via self-checkout payment after purchasing products from a store.
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1, ease: EASE }}>
            <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.accent, margin: '0 0 1rem' }}>Product Context</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.88rem', color: C.mid, lineHeight: 1.78, margin: 0, textWrap: 'pretty' }}>
                A B2B product designed for a quicker retail experience. The sleek, compact device clips onto any shopping cart, allowing users to scan items. Each scan is added to the digital cart and generates an itemised bill in real-time.
              </p>
            </NeuCard>
          </motion.div>
        </div>

        <Reveal delay={0.1}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: C.ink, margin: '0 0 1.5rem' }}>Business case: <span style={{ background: 'linear-gradient(to bottom, transparent 55%, #FFE566 55%)', paddingBottom: '1px', display: 'inline' }}>why retailers need this</span></h3>
        </Reveal>
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {[
            { label: 'Increased Labour Costs',   body: 'Staffing pressures at checkout counters reduce floor coverage and raise operational overhead.' },
            { label: 'Operational Inefficiency', body: 'Staff attention diverted from the floor to queue management is a costly misallocation at scale.' },
            { label: 'Customer Frustration',     body: 'Drop-offs, loss of satisfaction, and reduced sales. Queues cost retailers more than time.' },
          ].map(p => (
            <StaggerItem key={p.label}>
              <NeuCard style={{ padding: '1.5rem', height: '100%' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.red, marginBottom: '0.75rem' }} />
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: C.ink, margin: '0 0 0.5rem' }}>{p.label}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.mid, lineHeight: 1.65, margin: 0, textWrap: 'pretty' }}>{p.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Concept ─────────────────────────────────────────────
function ConceptSection() {
  return (
    <section id="design" style={{ background: C.page, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Concept Development</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            Feasible, time-bound, and meaningful
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            From a wall of references (pulse monitors, clothespins, game controllers) I distilled one direction: small, grippable, and honest. The kind of tool that earns trust through <em>feel</em>, not features. We borrowed not forms, but intentions.
          </p>
        </Reveal>

        {/* Full-width manifesto card */}
        <Reveal delay={0.1}>
          <div style={{ padding: '2.5rem', background: C.heroGrad, borderRadius: '18px', color: C.darkInk }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: C.darkMuted, margin: '0 0 1.5rem' }}>Design Intent</p>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(1.2rem,2.2vw,1.6rem)', color: C.darkInk, lineHeight: 1.85, margin: 0 }}>
              A pinch. A clip. A checkout skipped. Sized for the hand, not the shelf. <strong style={{ fontStyle: 'normal' }}>Small, grippable and honest.</strong>
            </p>
          </div>
        </Reveal>

        {/* Selection criteria — 4 in one row */}
        <div style={{ marginTop: '1.5rem' }}>
          <Reveal delay={0.15}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: C.ink, margin: '0 0 1rem' }}>Selection criteria</p>
          </Reveal>
          <StaggerGrid className="sp-g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { n: '01', label: 'Human Scale',    body: 'Sized for the hand, not the shelf. Every dimension traced from grip and reach data.' },
              { n: '02', label: 'Non-Intrusive',  body: 'Clips without forcing. Attaches, detaches, and disappears when not in use.' },
              { n: '03', label: 'Feedback First', body: 'Every action confirmed through sound, light, and haptic. No guessing the system state.' },
              { n: '04', label: 'Manufacturable', body: 'Designed within a four-week academic constraint: modular, feasible, and real.' },
            ].map(c => (
              <StaggerItem key={c.n}>
                <NeuCard style={{ padding: '1.25rem', height: '100%' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: C.accent, display: 'block', marginBottom: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.n}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.ink, margin: '0 0 0.35rem' }}>{c.label}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, lineHeight: 1.65, margin: 0, textWrap: 'pretty' }}>{c.body}</p>
                </NeuCard>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        <Reveal delay={0.2}>
          <div style={{ marginTop: '3.5rem' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: C.ink, margin: '0 0 1.25rem' }}>Concept Sketches</h3>
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: C.neu }}>
              <img
                src="/skippr-sketches.png"
                alt="Skippr ideation sketches — initial concept explorations"
                loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: C.ink, margin: '0 0 1.25rem' }}>Product Line Drawings</h3>
            <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <img src="/skippr-bp-sheet.png" alt="Skippr product line drawings — all views" loading="eager" decoding="async" style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }} />
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Anatomy ─────────────────────────────────────────────
function AnatomySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Product Anatomy</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            Good things come clipped and clever
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            Only what's required. The rest can be cut out.
          </p>
        </Reveal>

        {/* Exploded view + right column */}
        <div ref={ref} className="cc-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.65, ease: EASE }}>
            <div>
              <img src="/skippr-exploded.svg" alt="Skippr exploded view" loading="lazy" decoding="async" style={{ width: '78%', display: 'block', margin: '0 auto', mixBlendMode: 'multiply' }} />
            </div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: '0.6rem 0 0' }}>Exploded View</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.65, delay: 0.08, ease: EASE }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div>
                <img src="/skippr-finalvis.svg" alt="Skippr final product visualisation" loading="lazy" decoding="async" style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }} />
              </div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: '0.6rem 0 0' }}>Final Visualisation</p>
            </div>
            <div style={{ padding: '1.25rem', background: C.accentDim, borderRadius: '12px', border: `1px solid ${C.accentBorder}` }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, margin: '0 0 0.5rem' }}>Dimensions</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.ink, margin: '0 0 0.25rem' }}>100 × 56.5 mm</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: C.mid, margin: 0 }}>22.5mm internal height · Compact and ergonomic</p>
            </div>
            <img src="/skippr-render.png" alt="Skippr initial render" loading="lazy" decoding="async" style={{ width: '70%', display: 'block', margin: '-8rem auto 0' }} />
          </motion.div>
        </div>
      </Wrap>

      <Reveal delay={0.2}>
        {/* Mockup photos */}
        <Wrap>
          <div className="sp-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="/skippr-mockup1.jpg" alt="Skippr on shopping basket" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '4/3' }}>
              <img src="/skippr-mockup2.jpg" alt="Skippr on shopping cart" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </Wrap>

        <div style={{ padding: '0 clamp(0.5rem,2vw,2rem)', marginTop: '2rem' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 1.5rem', textWrap: 'balance' }}>
              Affordances and Signifiers
            </h2>
          </div>
          <img src="/skippr-affordances.png" alt="Skippr affordances and signifiers diagram" loading="eager" decoding="async" style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }} />
        </div>
      </Reveal>
    </section>
  )
}

// ─── Components ──────────────────────────────────────────
function ComponentsSection() {
  const components = [
    {
      n: '01', icon: 'crop_free', title: 'Scan Module', color: C.accent,
      how: 'Point-and-tap. Aim at the barcode, tap once. The rhythm is the interface.',
      feedback: 'Auditory chime and LED pulse confirm every successful scan.',
      body: 'I designed the scanner around one rhythm: point-and-tap. No menus, no second-guessing. Aim, tap, hear the chime. Auto-alignment handles proximity and angle so the hand barely has to think.',
    },
    {
      n: '02', icon: 'tune', title: 'Add, Subtract, Confirm', color: C.accentMid,
      how: 'Press with slight resistance. LED shifts from amber to green.',
      feedback: 'Light haptic and subtle sound on each quantity change.',
      body: 'The confirm button needed to feel definitive. A slight resistance. A shift from amber to green. The kind of click that says "done" before your brain fully catches up.',
    },
    {
      n: '03', icon: 'speaker', title: 'OLED Display, Mic, Speaker', color: C.mid,
      how: 'High-contrast display answers one question at a time. Voice handles the rest.',
      feedback: 'LED shifts from amber to red when voice recording is activated.',
      body: 'High-contrast, low-noise. I designed the screen to surface one thing at a time: what did I scan, what do I owe. The speaker and mic handle aisle guidance so eyes can stay on the shelves.',
    },
    {
      n: '04', icon: 'sports_esports', title: "Thumb's Best Friend", color: C.green,
      how: 'Tactile directional movement, dead-centre in the thumb\'s natural arc.',
      feedback: 'Slight resistance confirms directional input without looking down.',
      body: 'Positioned exactly where the thumb rests when gripping a cart handle, the joystick lets you scroll your cart without breaking your grip or your flow. (It took three iterations to find that exact spot.)',
    },
  ]

  return (
    <section id="product" style={{ background: C.dark, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag dark>Core Components</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.darkInk, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 3rem', textWrap: 'balance' }}>
            Skippr speaks through surfaces
          </h2>
        </Reveal>
        <div className="sp-comp" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', minHeight: 480 }}>
          {/* Dotted cross */}
          <div aria-hidden style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: `1.5px dotted rgba(255,255,255,0.15)`, transform: 'translateX(-50%)', pointerEvents: 'none' }} />
          <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: `1.5px dotted rgba(255,255,255,0.15)`, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          {components.map((c, i) => (
            <motion.div key={c.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={c.icon} size={20} style={{ color: c.color }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: c.color, margin: '0 0 2px' }}>{c.n}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.darkInk, margin: 0 }}>{c.title}</p>
                </div>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', color: C.darkMid, lineHeight: 1.65, margin: 0, textWrap: 'pretty' }}>{c.body}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: 'auto' }}>
                {[['Interaction', c.how], ['Feedback', c.feedback]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: c.color, flexShrink: 0, paddingTop: '2px', minWidth: 60 }}>{k}</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.76rem', color: C.darkMid, lineHeight: 1.55, textWrap: 'pretty' }}>{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

// ─── Videos ──────────────────────────────────────────────
function VideosSection() {
  return (
    <section style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Project Videos</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            Skippr in motion
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '48ch', margin: '0 0 2.5rem', textWrap: 'pretty' }}>
            A product walkthrough and a live demo. See how Skippr moves from grip to checkout.
          </p>
        </Reveal>
        <div className="cc-g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {[
            { id: 'gyNJm6LO75w', label: 'Introduction' },
            { id: '9dONgYY_dnQ', label: 'Live Demo'    },
          ].map(v => (
            <Reveal key={v.id} delay={0.05}>
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, margin: '0 0 0.75rem' }}>{v.label}</p>
                <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: C.neu, aspectRatio: '16/9' }}>
                  <iframe width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={`Skippr ${v.label}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: 'block' }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  )
}

// ─── Interaction Flow ─────────────────────────────────────
function FlowSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const flow = [
    { node: 'Skippr Loader',  sub: null, color: C.accent },
    { node: 'Welcome Page',   sub: null, color: C.accentMid },
    { node: 'Scanner Option', sub: null, color: C.accentMid },
    { node: 'Product Details', sub: 'Name · Quantity · Price · Net Weight · Shelf Life', color: C.green },
    { node: 'Itemised Cart',  sub: 'Editable quantities · Store info · Suggested items · Detailed bill', color: C.mid },
    { node: 'Checkout',       sub: 'Payment gateway · UPI / Card / Wallet', color: C.accent, highlight: true },
  ]

  return (
    <section style={{ background: C.dark, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag dark>Interaction Flow</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.darkInk, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            Mapping the motion
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.darkMid, lineHeight: 1.75, maxWidth: '50ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            From grip to glide. Every touch in Skippr carries direction, a rhythm that flows from hand to screen, where movement becomes method.
          </p>
        </Reveal>

        <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3.5rem', maxWidth: 560, margin: '0 auto 3.5rem' }}>
          {flow.map((step, i) => (
            <motion.div key={step.node} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', borderRadius: '12px', overflow: 'hidden', border: step.highlight ? `2px solid ${C.accent}` : '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ background: step.color, width: 6, flexShrink: 0 }} />
                <div style={{ background: step.highlight ? 'rgba(196,154,26,0.12)' : 'rgba(255,255,255,0.05)', padding: '0.85rem 1.25rem', flex: 1 }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: step.highlight ? C.accent : C.darkInk, margin: step.sub ? '0 0 0.3rem' : 0 }}>{step.node}</p>
                  {step.sub && <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', color: C.darkMuted, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{step.sub}</p>}
                </div>
              </div>
              {i < flow.length - 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2px 0' }}>
                  <div style={{ width: 2, height: 10, background: `${flow[i + 1].color}70` }} />
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `6px solid ${flow[i + 1].color}` }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1rem', color: C.darkInk, margin: '0 0 1.25rem' }}>Branching actions from the scanner</h3>
        </Reveal>
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Item Addition', items: ['Product Details', 'Order Details', 'Bill Generation', 'QR Code and Invoice'], color: C.green },
            { label: 'Item Discard',  items: ['Item Selection', 'Confirmation prompt', 'Cart updated'],                     color: C.red   },
            { label: 'Item Search',   items: ['Voice input trigger', 'Aisle and Row data', 'Navigation cue'],               color: C.accent },
          ].map(b => (
            <StaggerItem key={b.label}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                <div style={{ width: 180, height: 180, borderRadius: '50%', border: `2px solid ${b.color}55`, background: `${b.color}0D`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box', marginBottom: '1rem' }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: b.color, margin: '0 0 0.6rem', textAlign: 'center' }}>{b.label}</p>
                  {b.items.map(item => (
                    <p key={item} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.72rem', color: C.darkMid, lineHeight: 1.4, margin: '0 0 0.2rem', textAlign: 'center' }}>{item}</p>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal delay={0.25}>
          <div style={{ marginTop: '3rem', maxWidth: 580, marginLeft: 'auto', marginRight: 'auto' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.darkMuted, margin: '0 0 0.75rem', textAlign: 'center' }}>UI Interaction</p>
            <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <video src="/skippr-ui.mov" controls playsInline style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Accessibility + Heuristics ───────────────────────────
function AccessibilitySection() {
  const pour = [
    { letter: 'P', word: 'Perceivable',    body: 'I applied high-contrast visuals and haptic cues at every state change, because knowing what\'s happening shouldn\'t require looking directly at the screen.' },
    { letter: 'O', word: 'Operable',       body: 'Every interaction from clip-to-confirm is achievable with one hand and minimal force. (Designed for one-handed use, because the other hand is usually busy holding snacks.)' },
    { letter: 'U', word: 'Understandable', body: 'Icon-led and linearly sequenced. I didn\'t want users to learn Skippr. I wanted them to just use it, first try, without a tutorial.' },
    { letter: 'R', word: 'Robust',         body: 'Readable under harsh retail lighting, durable through daily use. Built to outlast the awkward Bluetooth-pairing phase of every other device in this category.' },
  ]

  const heuristics = [
    { principle: 'Visibility of System Status',              note: 'Black panel against white/aluminium body achieves contrast ratio above 4.5:1, meeting AA compliance.' },
    { principle: 'Recognition over Recall',                  note: 'Interactive zones use active-state glow and micro-contrast highlights to clearly signal focus and readiness.' },
    { principle: 'Error Recovery',                           note: 'Red-orange alert tones paired with vibration indicate scan errors, chosen for universal salience without strain.' },
  ]

  return (
    <section style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Accessibility and Heuristics</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            <span style={{ background: 'linear-gradient(to bottom, transparent 55%, #FFE566 55%)', paddingBottom: '1px', display: 'inline' }}>Accessibility</span> is the form
          </h2>
          <blockquote style={{ padding: '1rem 1.5rem', borderLeft: `3px solid ${C.accent}`, background: C.accentDim, borderRadius: '0 10px 10px 0', margin: '0 0 3rem', maxWidth: '56ch' }}>
            <p style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontSize: 'clamp(0.95rem,1.6vw,1.1rem)', color: C.ink, margin: 0, textWrap: 'pretty' }}>
              "Accessibility is not about designing for the few. It is about ensuring everyone feels invited to use the design."
            </p>
          </blockquote>
        </Reveal>

        <StaggerGrid className="cc-g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '3.5rem' }}>
          {pour.map(p => (
            <StaggerItem key={p.letter}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '2.5rem', color: C.accent, lineHeight: 1, letterSpacing: '-0.04em' }}>{p.letter}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>{p.word}</span>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.85rem', color: C.mid, lineHeight: 1.68, margin: 0, textWrap: 'pretty' }}>{p.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal delay={0.1}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '1.1rem', color: C.ink, margin: '0 0 1.5rem' }}>Nielsen heuristics applied</h3>
        </Reveal>
        <div style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: C.neuSm }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: C.accent }}>
                {['Principle', 'Design Decision'].map(h => (
                  <th key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#fff', padding: '0.85rem 1.1rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heuristics.map((h, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.card : C.page }}>
                  <td style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.accent, padding: '0.75rem 1.1rem', fontWeight: 600, width: '35%' }}>{h.principle}</td>
                  <td style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.mid, padding: '0.75rem 1.1rem', lineHeight: 1.6, textWrap: 'pretty' }}>{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </Wrap>

      {/* Full-bleed heuristic images — wider than content column */}
      <Reveal delay={0.15}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '3.5rem', padding: '0 clamp(0.5rem,2vw,2rem)' }}>
          <div>
            <img src="/skippr-heuristic-physical.png" alt="Heuristic evaluation — physical product" loading="eager" decoding="async" style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: '0.6rem clamp(0.5rem,2vw,2rem) 0' }}>Phygital Evaluation</p>
          </div>
          <div>
            <img src="/skippr-heuristic-screens.png" alt="Heuristic evaluation — UI screens" loading="eager" decoding="async" style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, margin: '0.6rem clamp(0.5rem,2vw,2rem) 0' }}>Screen Evaluation</p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

// ─── Emotional Design ─────────────────────────────────────
function EmotionalSection() {
  const levels = [
    {
      level: 'Visceral', color: C.accent,
      points: [
        { bold: true,  text: 'The soft glow, metallic sheen, and tactile click' },
        { bold: false, text: 'Its compact form feels familiar, more companion than device.' },
        { bold: true,  text: 'Every edge, curve, and contrast invites touch before thought.' },
      ],
    },
    {
      level: 'Behavioural', color: C.accentMid,
      points: [
        { bold: true,  text: 'Scan, turn, confirm.' },
        { bold: false, text: 'Feedback loops build rhythm and trust with every use.' },
        { bold: true,  text: 'Actions unfold seamlessly, reinforcing a sense of flow and control.' },
      ],
    },
    {
      level: 'Reflective', color: C.green,
      points: [
        { bold: true,  text: 'Users feel capable, not guided, but genuinely understood.' },
        { bold: false, text: 'The product becomes a quiet symbol of efficiency and self-reliance.' },
        { bold: true,  text: 'Reflection comes not from technology\'s presence, but its graceful absence.' },
      ],
    },
  ]

  return (
    <section style={{ background: C.page, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Emotional Design</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            Emotion was not added. It was <span style={{ background: 'linear-gradient(to bottom, transparent 55%, #FFE566 55%)', paddingBottom: '1px', display: 'inline' }}>Designed In.</span>
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '50ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            Every gesture, feature, and form carries an emotional intent. Norman's three levels of design, applied to a product you clip on a cart.
          </p>
        </Reveal>
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {levels.map(l => (
            <StaggerItem key={l.level}>
              <div style={{ padding: '2rem', background: `linear-gradient(145deg, ${l.color}12, ${l.color}04)`, border: `1.5px solid ${l.color}30`, borderRadius: '16px', height: '100%', boxSizing: 'border-box' }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.1rem,1.8vw,1.4rem)', color: l.color, margin: '0 0 0.35rem', letterSpacing: '-0.01em' }}>{l.level}</p>
                <div style={{ width: 28, height: 3, borderRadius: 2, background: l.color, marginBottom: '1.25rem' }} />
                {l.points.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <span style={{ color: l.color, flexShrink: 0, fontSize: '0.8rem', marginTop: '0.08rem' }}>◦</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.82rem', fontWeight: pt.bold ? 600 : 400, color: C.ink, lineHeight: 1.65, textWrap: 'pretty' }}>{pt.text}</span>
                  </div>
                ))}
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Future Scope ─────────────────────────────────────────
function FutureSection() {
  return (
    <section style={{ background: C.surface, ...PAD }}>
      <Wrap>
        <Reveal>
          <SectionTag>Future Scope</SectionTag>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 0.75rem', textWrap: 'balance' }}>
            Design's future is in deepening relationships
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: C.mid, lineHeight: 1.75, maxWidth: '52ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            Each evolution aims to remove friction, nurture flow, and turn technology into something quietly intuitive, emotionally aware, and contextually alive.
          </p>
        </Reveal>
        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { icon: 'accessibility_new', color: C.accent,    title: 'Multimodal Accessibility', body: 'Gesture and haptic-based modes will make Skippr inclusive for users across age and ability, expanding beyond button-based interaction. Remove friction, nurture flow and turn tech into something intuitive.' },
            { icon: 'auto_awesome',      color: C.accentMid, title: 'Contextual Intelligence',  body: 'AI-driven awareness enabling personalised product suggestions and smarter aisle navigation while shopping.' },
            { icon: 'device_hub',        color: C.green,     title: 'System Scalability',        body: 'The modular clip design and wireless infrastructure can expand into warehouse logistics, airport carts, and rental systems.' },
          ].map(f => (
            <StaggerItem key={f.title}>
              <NeuCard style={{ padding: '1.75rem', height: '100%' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${f.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <Icon name={f.icon} size={22} style={{ color: f.color }} />
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.ink, margin: '0 0 0.6rem' }}>{f.title}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.83rem', color: C.mid, lineHeight: 1.65, margin: 0, textWrap: 'pretty' }}>{f.body}</p>
              </NeuCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </Wrap>
    </section>
  )
}

// ─── Reflections ─────────────────────────────────────────
function ReflectionsSection() {
  return (
    <section id="reflections" style={{ background: C.heroGrad, ...PAD }}>
      <Wrap>
        <Reveal>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.darkMuted, display: 'block', marginBottom: '1.25rem' }}>Reflections</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', color: C.darkInk, letterSpacing: '-0.02em', marginBottom: 'clamp(2rem,4vw,3.5rem)', textWrap: 'balance' }}>
            Post-Mortem: Building Skippr
          </h2>
        </Reveal>

        <StaggerGrid className="cc-g3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: 'clamp(3rem,5vw,5rem)' }}>
          {[
            { n: '01', label: 'Learning the Craft',    text: 'I had never opened Fusion 360 before this project. (Genuinely. Never.) What followed was four weeks of spinning, failing, and slowly, painfully, producing something that looked like a real product.' },
            { n: '02', label: "The Printer's Verdict", text: 'The 3D printer was a harsh but fair teacher. Every failed print came back with notes: wall too thin, tolerance off, ambition bigger than layer height. Eventually, we listened, and the form started talking back.' },
            { n: '03', label: 'Assembling Together',   text: 'The final prototype didn\'t click into place so much as insist on existing. Three people, one deadline, a product that surprised all of us by actually working. I wouldn\'t call it finished. I\'d call it begun.' },
          ].map(r => (
            <StaggerItem key={r.n}>
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '14px', padding: '2rem', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: C.darkMuted }}>{r.n}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '0.85rem', color: C.darkInk }}>{r.label}</span>
                </div>
                <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: 'clamp(0.95rem,1.6vw,1.1rem)', color: C.darkMid, lineHeight: 1.72, margin: 0, textWrap: 'pretty' }}>{r.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal delay={0.2}>
          <p style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(1rem,2vw,1.2rem)', color: C.darkMid, maxWidth: 600, lineHeight: 1.82, margin: '0 auto', textAlign: 'center', textWrap: 'pretty' }}>
            Skippr started as a brief and ended as a conviction: that the smallest moments of friction (a queue, a wait, a dead second) are exactly where design earns its keep. The 3D printer was merciless. The deadline was real. And the thing we built, imperfect and academic and entirely ours, proved that good ideas survive bad prototypes.
          </p>
        </Reveal>
      </Wrap>
    </section>
  )
}

// ─── Root ─────────────────────────────────────────────────
export default function Skippr() {
  const active = useActiveSection(NAV_SECTIONS.map(s => s.id))

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Skippr — Zeus Z B'
  }, [])

  return (
    <div className="has-bottom-nav" style={{ background: C.page, color: C.ink, minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 767px) {
          .cc-g2 { grid-template-columns: 1fr !important; }
          .cc-g3 { grid-template-columns: 1fr !important; }
          .sp-g4 { grid-template-columns: repeat(2, 1fr) !important; }
          .sp-g2 { grid-template-columns: 1fr !important; }
          .sp-comp { grid-template-columns: 1fr !important; grid-template-rows: unset !important; }
        }
      `}</style>
      <ProgressBar />
      <Nav />
      <SidebarNav active={active} />
      <main>
        <HeroSection />
        <div style={{ background: C.page, borderBottom: `1px solid ${C.border}` }}>
          <Wrap>
            <p style={{ margin: 0, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase', padding: '0.7rem 0' }}>
              approx. 8 min read
            </p>
          </Wrap>
        </div>
        <WhySection />
        <ResearchSection />
        <BriefSection />
        <ConceptSection />
        <AnatomySection />
        <ComponentsSection />
        <FlowSection />
        <VideosSection />
        <AccessibilitySection />
        <EmotionalSection />
        <FutureSection />
        <ReflectionsSection />
      </main>
      <BackToTop />
      <Footer />
    </div>
  )
}
