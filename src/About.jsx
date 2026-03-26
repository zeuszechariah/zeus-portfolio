import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE, ProgressBar, Nav, Footer, MaskReveal, Reveal } from './shared.jsx'

// ─── DNA Canvas ───────────────────────────────────────
function DNACanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const S1 = 'ZEUSZECHARIAHBATKHAR'
    const S2 = 'INTERACTIONDESIGNER'

    let W, H, raf

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    let rotAngle       = 0
    let scrollOffs     = 0
    let highlightTimer = 0

    const HIGHLIGHT_FRAMES = 30  // ~0.5 s per letter at 60 fps

    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (document.hidden) return

      ctx.clearRect(0, 0, W, H)

      rotAngle       += 0.003
      scrollOffs     += 0.35
      highlightTimer += 1

      const CX     = W / 2
      const RADIUS = Math.min(W * 0.17, 155)  // wider horizontal spread
      const ROW_H  = 28
      const TURNS  = 0.5
      const STEP   = (Math.PI * 2 * TURNS) / (H / ROW_H)

      const topRung  = -Math.floor(scrollOffs / ROW_H)
      const subPixel = scrollOffs % ROW_H
      const toDraw   = Math.ceil(H / ROW_H) + 2

      // ── pass 1: collect nodes + draw rungs ──
      const leftNodes  = []
      const rightNodes = []

      for (let i = -1; i < toDraw; i++) {
        const rung = topRung + i
        const y    = i * ROW_H + subPixel

        if (y < -ROW_H || y > H + ROW_H) continue

        const phase = rotAngle + rung * STEP
        const fade  = Math.max(0, Math.min(1, y / 200, (H - y) / 200))
        if (fade === 0) continue

        const lx = CX + Math.sin(phase) * RADIUS
        const lz = Math.cos(phase)
        const lD = (lz + 1) / 2

        const rx = CX + Math.sin(phase + Math.PI) * RADIUS
        const rz = Math.cos(phase + Math.PI)
        const rD = (rz + 1) / 2

        // Store charIdx so highlight lookup is stable regardless of visible count
        const s1i = ((rung % S1.length) + S1.length) % S1.length
        const s2i = ((rung % S2.length) + S2.length) % S2.length

        leftNodes.push({  x: lx, y, z: lz, d: lD, ch: S1[s1i], ci: s1i, fade })
        rightNodes.push({ x: rx, y, z: rz, d: rD, ch: S2[s2i], ci: s2i, fade })

        const rungA = ((lD + rD) / 2 * 0.28 + 0.1) * fade
        if (rungA > 0.004) {
          ctx.strokeStyle = `rgba(242,237,228,${rungA})`
          ctx.lineWidth   = 1.2
          ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(rx, y); ctx.stroke()
        }
      }

      // ── stable highlight: cycle through char indices, not array positions ──
      // This never jumps when a row enters/exits the canvas.
      const step    = Math.floor(highlightTimer / HIGHLIGHT_FRAMES)
      const lTarget = step % S1.length                          // left:  0→19 top→bottom
      const rTarget = (S2.length - 1) - (step % S2.length)     // right: 18→0  bottom→top

      // Among all visible matches, pick topmost for left, bottommost for right
      let lHi = null
      for (const n of leftNodes)  if (n.ci === lTarget  && (!lHi || n.y < lHi.y)) lHi = n
      let rHi = null
      for (const n of rightNodes) if (n.ci === rTarget  && (!rHi || n.y > rHi.y)) rHi = n

      if (lHi) lHi.hi = true
      if (rHi) rHi.hi = true

      // ── pass 2: z-sort back→front, draw ──
      const allNodes = [...leftNodes, ...rightNodes]
      allNodes.sort((a, b) => a.z - b.z)

      for (const n of allNodes) {
        const sz = 9 + n.d * 10
        ctx.font         = `600 ${sz.toFixed(1)}px "Syne", sans-serif`
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'middle'

        if (n.hi) {
          ctx.shadowColor = 'rgba(242,237,228,0.9)'
          ctx.shadowBlur  = 12
          ctx.fillStyle   = 'rgba(255,255,255,1)'
          ctx.fillText(n.ch, n.x, n.y)
          ctx.shadowBlur  = 0
        } else {
          const opacity = (0.25 + n.d * 0.75) * n.fade * 0.5
          if (opacity < 0.015) continue
          ctx.fillStyle = `rgba(242,237,228,${Math.min(1, opacity)})`
          ctx.fillText(n.ch, n.x, n.y)
        }
      }
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

// ─── About Intro ──────────────────────────────────────
function AboutIntro() {
  return (
    <section className="relative flex flex-col overflow-hidden"
      style={{ minHeight:'100svh', background:'#060606' }}>

      {/* DNA — full-bleed background, desktop only */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
        <DNACanvas />
      </div>

      {/* Content — same max-width container as Resume / Contact */}
      <div className="relative z-[1] flex-1 flex flex-col w-full max-w-[1200px] mx-auto
                      px-[clamp(1.5rem,5vw,3.5rem)]">

        {/* ── main grid: 3 text | 5 DNA space | 4 photo+edu ── */}
        <div className="grid grid-cols-12 flex-1">

          {/* Left — label + quote at top, body at bottom */}
          <div className="col-span-12 md:col-span-3 flex flex-col justify-between pr-6
                          pt-[clamp(8rem,14vw,11rem)] pb-[clamp(3rem,5vw,4.5rem)]">

            <div>
              <Reveal>
                <span className="font-mono text-[0.58rem] tracking-[0.16em]
                                 uppercase text-ink/28 mb-8 block">
                  Synopsis
                </span>
              </Reveal>
              <Reveal delay={0.06}>
                <blockquote className="font-display italic text-ink leading-[1.4]"
                  style={{ fontSize:'clamp(1.1rem,1.6vw,1.45rem)' }}>
                  "The world is full of creative challenges, both big &amp; small, and
                  every individual is an invitation to imagine something better."
                </blockquote>
              </Reveal>
            </div>

            <div className="flex flex-col gap-4">
              <Reveal delay={0.12}>
                <p className="font-sans text-ink/48 leading-[1.85]"
                  style={{ fontSize:'clamp(0.75rem,0.88vw,0.825rem)' }}>
                  For me, vision, craft, systems, instinct and art are the forces behind
                  everything I make.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="font-sans text-ink/48 leading-[1.85]"
                  style={{ fontSize:'clamp(0.75rem,0.88vw,0.825rem)' }}>
                  My focus, hunger and desire for wisdom are what drive me forward and
                  keep me fulfilled.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Centre — wide open space, DNA breathes freely */}
          <div className="hidden md:block md:col-span-5" />

          {/* Right — photo at top, education at bottom */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-between items-end
                          pt-[clamp(8rem,14vw,11rem)] pb-[clamp(3rem,5vw,4.5rem)]">

            {/* Pill photo */}
            <div className="relative overflow-hidden border border-white/[0.06] flex-shrink-0"
              style={{ width:'160px', height:'272px', borderRadius:'9999px', background:'#0d0d0d' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="rgba(242,237,228,0.18)" strokeWidth="1.5"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(242,237,228,0.18)"
                    strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="font-mono text-[0.42rem] tracking-[0.16em] uppercase text-ink/15
                                 text-center leading-[1.9]">
                  Photo<br />coming<br />soon
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
                style={{ background:'linear-gradient(to top,rgba(6,6,6,0.4),transparent)' }} />
            </div>

            {/* Education — sits at the same level as the body text on the left */}
            <div className="flex flex-col gap-[1.1rem] items-end text-right">
              {[
                ['M.Des Interaction Design', 'NID Bangalore'],
                ['International Exchange',   'HTW Berlin'],
                ['B.Des Visual Comm. & Brand Strategy', 'Srishti Bangalore'],
              ].map(([program, school]) => (
                <div key={school} className="flex flex-col gap-[0.2rem]">
                  <p className="font-mono uppercase text-ink/32 tracking-[0.08em] leading-none"
                    style={{ fontSize:'clamp(0.5rem,0.62vw,0.6rem)' }}>
                    {program}
                  </p>
                  <p className="font-mono uppercase tracking-[0.08em] leading-none font-bold text-ink/55"
                    style={{ fontSize:'clamp(0.5rem,0.62vw,0.6rem)' }}>
                    {school}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── bottom bar: About Zeus. flush right ── */}
        <div className="flex justify-end pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(2rem,4vw,3.5rem)]">
          <h1 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]"
              style={{ fontSize:'clamp(2.25rem,5vw,4rem)' }}>
            <MaskReveal>About</MaskReveal>
          </h1>
        </div>

      </div>
    </section>
  )
}

// ─── Resume ───────────────────────────────────────────
function Resume() {
  return (
    <section className="py-[clamp(6rem,11vw,9rem)]"
      style={{ background:'#060606' }}>
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(3rem,6vw,6rem)] items-center">

          <div>
            <Reveal>
              <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-5 block">
                Experience
              </span>
            </Reveal>
            <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92] mb-6"
                style={{ fontSize:'clamp(2.25rem,5vw,4rem)' }}>
              <MaskReveal>My Resumè.</MaskReveal>
            </h2>
            <Reveal delay={0.1}>
              <p className="font-sans text-ink/45 leading-[1.8] max-w-[36ch]"
                style={{ fontSize:'clamp(0.875rem,1.1vw,0.9375rem)' }}>
                Click to view or download my Resumè below. It covers my experience,
                education, and areas of focus.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="flex flex-col items-start md:items-end gap-6">
            <a href="https://drive.google.com/file/d/13STNlMETpbArR6O8Bz5tatm9hxZgkjbT/view"
               target="_blank" rel="noopener noreferrer"
               className="relative group/link inline-flex items-center gap-3 font-sans font-semibold text-bg bg-ink
                          rounded-full tracking-[0.01em] transition-[opacity,transform] duration-300
                          hover:opacity-88 hover:-translate-y-[1px]"
               style={{ fontSize:'0.875rem', padding:'0.9375rem 2rem' }}>
              <span className="relative">
                View / Download Resumè ↗
                <span className="absolute -bottom-[2px] left-0 h-[1px] w-0 transition-all duration-300 group-hover/link:w-full"
                  style={{ background:'#ffffff', mixBlendMode:'difference', transitionTimingFunction:'cubic-bezier(0.16,1,0.3,1)' }} />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Contact Form ─────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ first:'', last:'', email:'', phone:'', message:'' })
  const [sent, setSent]   = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, amount:0.1 })

  const inputCls = `w-full font-sans text-[0.875rem] text-ink/80 placeholder:text-ink/22
    bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5
    focus:outline-none focus:border-white/[0.22] transition-colors duration-200`

  const handleSubmit = e => { e.preventDefault(); setSent(true) }

  return (
    <section className="py-[clamp(6rem,11vw,9rem)] border-t border-white/[0.04] relative overflow-hidden"
      style={{ background:'#060606' }}>
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width:600, height:400,
                 background:'radial-gradient(ellipse,rgba(124,58,237,0.06) 0%,transparent 65%)' }} />

      <div className="relative max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="mb-[clamp(3rem,6vw,5rem)]" ref={ref}>
          <Reveal>
            <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase text-ink/32 mb-5 block">
              Get in touch
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]"
              style={{ fontSize:'clamp(2.25rem,5vw,4rem)' }}>
            <MaskReveal>Got an idea?</MaskReveal>
            <MaskReveal delay={0.1}>Let's connect.</MaskReveal>
          </h2>
        </div>

        {sent ? (
          <motion.div className="flex flex-col items-center justify-center py-20 gap-5"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, ease:EASE }}>
            <div className="w-14 h-14 rounded-full border border-green/30 flex items-center justify-center mb-2"
              style={{ background:'rgba(0,255,135,0.06)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#00FF87" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-sans font-semibold text-ink/80 text-lg">
              Message sent. I'll be in touch soon.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <motion.div initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, ease:EASE, delay:0.05 }}>
              <label className="block font-mono text-[0.58rem] tracking-[0.12em] uppercase text-ink/30 mb-2">
                First name</label>
              <input className={inputCls} placeholder="First name" value={form.first}
                onChange={e => setForm(f => ({ ...f, first:e.target.value }))} />
            </motion.div>

            <motion.div initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, ease:EASE, delay:0.1 }}>
              <label className="block font-mono text-[0.58rem] tracking-[0.12em] uppercase text-ink/30 mb-2">
                Last name</label>
              <input className={inputCls} placeholder="Last name" value={form.last}
                onChange={e => setForm(f => ({ ...f, last:e.target.value }))} />
            </motion.div>

            <motion.div initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, ease:EASE, delay:0.15 }}>
              <label className="block font-mono text-[0.58rem] tracking-[0.12em] uppercase text-ink/30 mb-2">
                Email *</label>
              <input className={inputCls} type="email" placeholder="Email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email:e.target.value }))} />
            </motion.div>

            <motion.div initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, ease:EASE, delay:0.2 }}>
              <label className="block font-mono text-[0.58rem] tracking-[0.12em] uppercase text-ink/30 mb-2">
                Phone</label>
              <input className={inputCls} type="tel" placeholder="Phone" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone:e.target.value }))} />
            </motion.div>

            <motion.div className="md:col-span-2" initial={{ opacity:0, y:20 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, ease:EASE, delay:0.25 }}>
              <label className="block font-mono text-[0.58rem] tracking-[0.12em] uppercase text-ink/30 mb-2">
                Message *</label>
              <textarea className={`${inputCls} resize-none`} rows={5}
                placeholder="Tell me about your project…" required value={form.message}
                onChange={e => setForm(f => ({ ...f, message:e.target.value }))} />
            </motion.div>

            <motion.div className="md:col-span-2 flex justify-end" initial={{ opacity:0, y:20 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.7, ease:EASE, delay:0.3 }}>
              <button type="submit"
                className="relative group/link inline-flex items-center font-sans font-semibold text-bg bg-ink
                           rounded-full tracking-[0.01em] transition-[opacity,transform]
                           duration-300 hover:opacity-88 hover:-translate-y-[1px]"
                style={{ fontSize:'0.875rem', padding:'0.9375rem 2.5rem' }}>
                <span className="relative">
                  Submit
                  <span className="absolute -bottom-[2px] left-0 h-[1px] w-0 transition-all duration-300 group-hover/link:w-full"
                    style={{ background:'#ffffff', mixBlendMode:'difference', transitionTimingFunction:'cubic-bezier(0.16,1,0.3,1)' }} />
                </span>
              </button>
            </motion.div>
          </form>
        )}
      </div>
    </section>
  )
}

// ─── About Page ───────────────────────────────────────
export default function About() {
  return (
    <div style={{ background:'#060606' }} className="text-ink overflow-x-hidden">
      <ProgressBar />
      <Nav />
      <AboutIntro />
      <Resume />
      <ContactForm />
      <Footer />
    </div>
  )
}
