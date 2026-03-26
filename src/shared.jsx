import { useRef, useState, useEffect } from 'react'
import { motion, useSpring, useScroll, useInView, AnimatePresence } from 'framer-motion'

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
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  return (
    <div ref={ref} style={{ overflow:'hidden', display:'block' }} className={className}>
      <motion.span
        style={{ display:'inline-block', willChange:'transform' }}
        initial={{ y:'110%' }}
        animate={inView ? { y:'0%' } : {}}
        transition={{ duration:0.9, ease:EASE, delay }}
      >
        {children}
      </motion.span>
    </div>
  )
}

// ─── Reveal (opacity + y, for non-heading elements) ───
export function Reveal({ children, delay = 0, className = '' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, amount:0.1 })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity:0, y:28 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.85, ease:EASE, delay }}
    >{children}</motion.div>
  )
}

// ─── Nav ──────────────────────────────────────────────
export function Nav({ light = false }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive:true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const lt = { duration:1.1, ease:EASE }
  const bs = light ? { color:'#0f0f0f' } : { color:'#ffffff', mixBlendMode:'difference' }

  const pillStyle = light
    ? { background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 2px 20px rgba(0,0,0,0.07)' }
    : { background:'rgba(255,255,255,0.06)', backdropFilter:'blur(48px) saturate(180%) brightness(1.08)', WebkitBackdropFilter:'blur(48px) saturate(180%) brightness(1.08)', border:'1px solid rgba(255,255,255,0.12)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.03), 0 8px 40px rgba(0,0,0,0.18)' }

  return (
    <AnimatePresence>
      {!scrolled ? (
        <motion.div key="spread"
          className="fixed top-0 left-0 right-0 z-[502] flex items-center justify-between pointer-events-none"
          style={{ padding:'1.5rem clamp(1.5rem,5vw,3.5rem)' }}
        >
          <motion.a layoutId="nav-zeus" href="/" transition={lt}
            className="pointer-events-auto font-sans font-semibold text-[0.8125rem] tracking-[0.1em] uppercase" style={bs}>
            <Bolt size={13} nudge={-2} />EUS
          </motion.a>
          <motion.a layoutId="nav-work" href="/#work" transition={lt}
            className="pointer-events-auto font-mono text-[0.7rem] tracking-[0.1em] uppercase" style={bs}>Work</motion.a>
          <motion.a layoutId="nav-about" href="/about" transition={lt}
            className="pointer-events-auto font-mono text-[0.7rem] tracking-[0.1em] uppercase" style={bs}>About</motion.a>
        </motion.div>
      ) : (
        <motion.div key="pill"
          className="fixed top-[1.125rem] left-0 right-0 z-[500] flex justify-center pointer-events-none"
          exit={{ opacity:0, transition:{ duration:0.18, ease:'easeIn' } }}
        >
          <motion.nav
            className="pointer-events-auto relative flex items-center gap-8 px-6 py-[0.6rem] rounded-full overflow-hidden"
            style={pillStyle}
          >
            {!light && (
              <div className="absolute inset-x-0 top-0 h-[50%] rounded-t-full pointer-events-none"
                style={{ background:'linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 100%)' }} />
            )}
            <motion.a layoutId="nav-zeus" href="/" transition={lt}
              className="relative z-10 font-sans font-semibold text-[1rem] tracking-[0.05em]" style={bs}>
              <Bolt size={16} />
            </motion.a>
            <div className="relative z-10 flex items-center gap-7">
              {[['Work','/#work'],['About','/about']].map(([label, href]) => (
                <motion.a key={label} layoutId={`nav-${label.toLowerCase()}`} href={href} transition={lt}
                  className="font-mono text-[0.7rem] tracking-[0.1em] uppercase relative group/link" style={bs}>
                  {label}
                  <span className="absolute -bottom-[2px] left-0 h-[1px] w-0 transition-all duration-300 group-hover/link:w-full"
                    style={{ background: light ? '#0f0f0f' : '#ffffff', mixBlendMode: light ? undefined : 'difference', transitionTimingFunction:'cubic-bezier(0.16,1,0.3,1)' }} />
                </motion.a>
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
    <footer style={{ background:'#060606' }} className="border-t border-white/[0.04]">
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
            <p className="font-sans text-[0.8125rem] text-ink/35 leading-[1.9]">Peenya, Bangalore<br />Karnataka IN 560022<br />India</p>
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
        <div className="flex justify-end mt-10 pt-6 border-t border-white/[0.04]">
          <p className="font-mono text-[0.68rem] text-ink/22 tracking-[0.02em]">©2026 Zeus Z B. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
