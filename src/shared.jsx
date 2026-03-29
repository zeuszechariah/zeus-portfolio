import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useSpring, useScroll, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'

// ─── Constants ────────────────────────────────────────
export const EASE = [0.16, 1, 0.3, 1]
export const SPRING_STIFF = { stiffness: 280, damping: 30 }

// ─── Thunderbolt SVG (flipped horizontally = Z shape) ─
export function Bolt({ size = 14, nudge = 0 }) {
  return (
    <svg width={size * 0.62} height={size} viewBox="0 0 10 16" fill="none"
      style={{ display:'inline-block', transform:'scaleX(-1)', verticalAlign:'middle', position:'relative', top: nudge }}>
      <path d="M7.5 0L0.5 9H5L2 16L9.5 7H5L7.5 0Z" fill="currentColor" />
    </svg>
  )
}

// ─── Progress Bar (vertical, RHS) ─────────────────────
export function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness:100, damping:30 })
  return <motion.div className="fixed left-0 top-0 bottom-0 w-[2px] z-[600] origin-top" style={{ scaleY, background:'linear-gradient(180deg,#7C3AED,#FF4B8F)' }} />
}

// ─── MaskReveal — translateY clip reveal for headings ─
export function MaskReveal({ children, delay = 0, className = '' }) {
  const ref          = useRef(null)
  const inView       = useInView(ref, { once: true, amount: 0.15 })
  const reducedMotion = useReducedMotion()
  return (
    <div ref={ref} style={{ overflow:'hidden', display:'block', paddingBottom:'0.18em', marginBottom:'-0.18em' }} className={className}>
      <motion.span
        style={{ display:'inline-block', willChange:'transform' }}
        initial={{ y: reducedMotion ? '0%' : '110%' }}
        animate={inView ? { y:'0%' } : {}}
        transition={{ duration: reducedMotion ? 0 : 0.75, ease:EASE, delay: reducedMotion ? 0 : delay }}
      >
        {children}
      </motion.span>
    </div>
  )
}

// ─── Reveal (opacity + y, for non-heading elements) ───
export function Reveal({ children, delay = 0, className = '' }) {
  const ref          = useRef(null)
  const inView       = useInView(ref, { once:true, amount:0.1 })
  const reducedMotion = useReducedMotion()
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 28 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration: reducedMotion ? 0 : 0.65, ease:EASE, delay: reducedMotion ? 0 : delay }}
    >{children}</motion.div>
  )
}

const MotionLink = motion(Link)

// ─── Nav ──────────────────────────────────────────────
// Both light and default share the same white-pill style.
// light=true  → dark text (#0f0f0f)  for light-bg pages (e.g. GetSetGlobe)
// light=false → cream text (#F2EDE4) for dark-bg pages (e.g. Home)
export function Nav({ light = false, scrollThreshold = 60 }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > scrollThreshold)
    window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [scrollThreshold])

  const lt = { duration:0.6, ease:EASE }

  // Spread (pre-scroll) text colour
  const spreadCol = light ? '#0f0f0f' : '#F2EDE4'

  // Pill style + text colour — dark frosted on dark pages, white frosted on light pages
  const pillCol   = light ? '#0f0f0f' : '#F2EDE4'
  const pillStyle = light
    ? { background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 2px 20px rgba(0,0,0,0.07)' }
    : { background:'rgba(10,10,10,0.72)', backdropFilter:'blur(28px) saturate(160%)', WebkitBackdropFilter:'blur(28px) saturate(160%)', border:'1px solid rgba(255,255,255,0.10)', boxShadow:'0 8px 32px rgba(0,0,0,0.35)' }

  return (
    <AnimatePresence>
      {!scrolled ? (
        <motion.div key="spread" role="banner"
          className="fixed top-0 left-0 right-0 z-[502] flex items-center justify-between pointer-events-none"
          style={{ padding:'1.5rem clamp(1.5rem,5vw,3.5rem)' }}
        >
          <MotionLink layoutId="nav-zeus" to="/" aria-label="Zeus — Home" transition={lt}
            className="pointer-events-auto font-sans font-semibold text-[0.8125rem] tracking-[0.1em] uppercase" style={{ color: spreadCol }}>
            <Bolt size={13} nudge={-2} />EUS
          </MotionLink>
          <MotionLink layoutId="nav-work" to="/#work" transition={lt}
            className="pointer-events-auto font-mono text-[0.7rem] tracking-[0.1em] uppercase" style={{ color: spreadCol }}
            onClick={e => { const el = document.getElementById('work'); if (el) { e.preventDefault(); el.scrollIntoView({ behavior:'smooth' }) } }}>Work</MotionLink>
          <MotionLink layoutId="nav-about" to="/about" transition={lt}
            className="pointer-events-auto font-mono text-[0.7rem] tracking-[0.1em] uppercase" style={{ color: spreadCol }}>About</MotionLink>
        </motion.div>
      ) : (
        <motion.div key="pill"
          className="fixed top-[1.125rem] left-0 right-0 z-[500] flex justify-center pointer-events-none"
          exit={{ opacity:0, transition:{ duration:0.15, ease:'easeOut' } }}
        >
          <motion.nav aria-label="Main navigation"
            className="pointer-events-auto flex items-center gap-8 px-6 py-[0.6rem] rounded-full"
            style={pillStyle}
          >
            <MotionLink layoutId="nav-zeus" to="/" aria-label="Zeus — Home" transition={lt}
              className="font-sans font-semibold text-[1rem] tracking-[0.05em]" style={{ color: pillCol }}>
              <Bolt size={16} />
            </MotionLink>
            <div className="flex items-center gap-7">
              {[['Work','/#work'],['About','/about']].map(([label, to]) => (
                <MotionLink key={label} layoutId={`nav-${label.toLowerCase()}`} to={to} transition={lt}
                  className="font-mono text-[0.7rem] tracking-[0.1em] uppercase relative group/link" style={{ color: pillCol }}
                  onClick={label === 'Work' ? (e => { const el = document.getElementById('work'); if (el) { e.preventDefault(); el.scrollIntoView({ behavior:'smooth' }) } }) : undefined}>
                  {label}
                  <span className="absolute -bottom-[2px] left-0 h-[1px] w-0 transition-[width] duration-300 group-hover/link:w-full"
                    style={{ background: pillCol, transitionTimingFunction:'cubic-bezier(0.16,1,0.3,1)' }} />
                </MotionLink>
              ))}
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Footer ───────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ background:'#060606' }} className="border-t border-white/[0.04] relative overflow-hidden">
      <div className="absolute pointer-events-none" style={{ width:'clamp(300px,38vw,520px)',height:'clamp(300px,38vw,520px)',borderRadius:'50%',top:'-30%',right:'10%',background:'radial-gradient(circle,rgba(124,58,237,0.075) 0%,transparent 65%)' }} />
      <div className="absolute pointer-events-none" style={{ width:'clamp(220px,28vw,380px)',height:'clamp(220px,28vw,380px)',borderRadius:'50%',bottom:'-20%',left:'-5%',background:'radial-gradient(circle,rgba(255,75,143,0.052) 0%,transparent 65%)' }} />
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)] pt-[clamp(3rem,6vw,5rem)] pb-[clamp(2rem,4vw,3rem)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          <div className="flex flex-col gap-4">
            <a href="/imprint" className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200">Imprint</a>
            <a href="/privacy-policy" className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200">Privacy Policy</a>
            <a href="/press" className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200">Press</a>
          </div>
          <div className="flex flex-col gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
              className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200">LinkedIn</a>
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer"
              className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200">Behance</a>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-sans font-semibold text-[0.8125rem] text-ink/65 mb-2">National Institute of Design</p>
            <p className="font-sans text-[0.8125rem] text-ink/35 leading-[1.65]">Peenya, Bangalore<br />Karnataka IN 560022<br />India</p>
          </div>
          <div className="flex flex-col gap-4">
            <a href="mailto:zeusbatkhar.2000@gmail.com"
              className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200 leading-[1.7]">
              zeusbatkhar.2000<br />@gmail.com
            </a>
            <a href="tel:+918729986319"
              className="font-sans text-[0.8125rem] text-ink/38 hover:text-ink/70 transition-colors duration-200">
              +91 87299 86319
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.04]">
          <span className="text-ink/14 select-none"><Bolt size={11} /></span>
          <p className="font-mono text-[0.68rem] text-ink/22 tracking-[0.02em]">©2026 Zeus Z B. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Cookie consent helpers ───────────────────────────
const CONSENT_KEY = 'zb_cookie_consent'

function setConsentCookie(value) {
  // 1 year, SameSite=Lax works on http + https; add Secure for production HTTPS
  document.cookie = `${CONSENT_KEY}=${value}; max-age=31536000; path=/; SameSite=Lax`
}

function loadAnalytics() {
  // ── Paste your analytics snippet here ──────────────
  // Example (Google Analytics 4):
  //
  // if (document.getElementById('ga-script')) return   // already loaded
  // const s = document.createElement('script')
  // s.id = 'ga-script'
  // s.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'
  // s.async = true
  // document.head.appendChild(s)
  // window.dataLayer = window.dataLayer || []
  // function gtag(){ window.dataLayer.push(arguments) }
  // gtag('js', new Date())
  // gtag('config', 'G-XXXXXXXXXX')
  // ───────────────────────────────────────────────────
}

// ─── Cookie Banner ────────────────────────────────────
export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored) {
      // Re-fire analytics on every load if already granted
      if (stored === 'granted') loadAnalytics()
      return
    }
    // Show after 3 s — lets the video intro finish first
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  const respond = (granted) => {
    const val = granted ? 'granted' : 'denied'
    localStorage.setItem(CONSENT_KEY, val)
    setConsentCookie(val)
    if (granted) loadAnalytics()
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 left-1/2 z-[9999] pointer-events-auto"
          style={{ x: '-50%', willChange: 'transform, opacity', width: 'clamp(340px, 56vw, 680px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.18, ease: EASE } }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div
            className="flex items-center justify-between gap-8 px-7 py-4 rounded-2xl"
            style={{
              background: 'rgba(4,4,4,0.97)',
              backdropFilter: 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.13)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.65), 0 2px 0 rgba(255,255,255,0.04) inset',
            }}
          >
            <p className="font-sans text-[0.8rem] text-ink/75 leading-[1.7]">
              This site uses cookies to understand how visitors engage with the work.{' '}
              <a href="/privacy-policy"
                className="text-ink/45 underline underline-offset-[3px] hover:text-ink/70 transition-colors duration-200">
                Privacy policy
              </a>
            </p>

            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={() => respond(false)}
                className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-ink/40 hover:text-ink/65 transition-colors duration-200 cursor-pointer active:scale-[0.97] transition-transform"
              >
                Decline
              </button>
              <button
                onClick={() => respond(true)}
                className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[#060606] px-5 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.97]"
                style={{
                  background: '#F2EDE4',
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
