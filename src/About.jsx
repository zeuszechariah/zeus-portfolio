import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { EASE, ProgressBar, Nav, Footer, MaskReveal, Reveal, HeroButton } from './shared.jsx'

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

    const HIGHLIGHT_FRAMES = 45  // ~0.75 s per letter at 60 fps

    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (document.hidden) return

      ctx.clearRect(0, 0, W, H)

      rotAngle       += 0.003
      scrollOffs     += 0.35
      highlightTimer += 1

      const CX     = W / 2
      const RADIUS = Math.min(W * 0.32, 210)  // zoomed in for narrower column
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
      style={{ minHeight:'100svh', background:'#000000' }}>

      {/* Ambient glow — top-left */}
      <div className="absolute pointer-events-none" style={{ width:'clamp(260px,30vw,420px)', height:'clamp(260px,30vw,420px)', borderRadius:'50%', top:'6%', left:'-6%', background:'radial-gradient(circle,rgba(255,91,4,0.12) 0%,rgba(7,80,86,0.08) 50%,transparent 70%)', filter:'blur(48px)', zIndex:0 }} />

      <div className="relative z-[1] flex-1 flex flex-col w-full max-w-[1200px] mx-auto
                      px-[clamp(1.5rem,5vw,3.5rem)]">

        {/* ── main grid: 7 content | 5 DNA ── */}
        <div className="grid grid-cols-12 flex-1">

          {/* LEFT — all content */}
          <div className="col-span-12 md:col-span-7 flex flex-col
                          pt-[clamp(5rem,9vw,7rem)] pb-[clamp(2rem,3.5vw,3rem)] pr-0 md:pr-16">

            {/* Synopsis label */}
            <Reveal>
              <span className="font-mono text-[0.58rem] tracking-[0.16em] uppercase mb-5 block" style={{ color:'#C48A1A' }}>
                Synopsis
              </span>
            </Reveal>

            {/* About heading — left-aligned */}
            <h1 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92] mb-8"
                style={{ fontSize:'clamp(1.9rem,3.8vw,3rem)' }}>
              <MaskReveal>About</MaskReveal>
            </h1>

            {/* Quote — below About heading */}
            <Reveal delay={0.06}>
              <blockquote
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: 'clamp(0.75rem,0.88vw,0.825rem)',
                  color: 'rgba(242,237,228,0.88)',
                  lineHeight: 1.4,
                  margin: '0 0 2rem',
                }}>
                "The world is full of creative challenges, both big &amp; small, and
                every individual is an invitation to imagine something better."
              </blockquote>
            </Reveal>

            {/* Body */}
            <Reveal delay={0.12}>
              <p className="font-sans text-ink/55 leading-[1.85] mb-10"
                style={{ fontSize:'clamp(0.75rem,0.88vw,0.825rem)' }}>
                For me, vision, craft, systems, instinct and art are the forces behind
                everything I make. My focus, hunger and desire for wisdom are what drive
                me forward and keep me fulfilled.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="font-sans text-ink/55 leading-[1.85] mb-3"
                style={{ fontSize:'clamp(0.75rem,0.88vw,0.825rem)' }}>
                Humbled to receive:
              </p>
            </Reveal>

            {/* Exam ranks — single horizontal row */}
            <Reveal delay={0.18} className="mb-10">
              <div className="flex items-center gap-8">
                {[
                  ['NID DAT', 'AIR 8 · 2024', 'Interaction Design / Strategic Design Management'],
                  ['IIT Bombay CEED', 'AIR 8 · 2024', 'Visual Design'],
                ].map(([inst, rank, disc], i, arr) => (
                  <div key={inst} className="flex items-center gap-8">
                    <div className="flex flex-col gap-[0.18rem]">
                      <p className="font-mono uppercase tracking-[0.1em] leading-none font-bold text-ink/50"
                        style={{ fontSize:'clamp(0.52rem,0.6vw,0.6rem)' }}>
                        {inst}&nbsp;&nbsp;<span className="text-ink/35 font-normal">{rank}</span>
                      </p>
                      <p className="font-mono uppercase tracking-[0.08em] leading-none text-ink/22"
                        style={{ fontSize:'clamp(0.46rem,0.52vw,0.52rem)' }}>{disc}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width:'1px', height:'28px', background:'rgba(242,237,228,0.12)', flexShrink:0 }} />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Accolades + Education — side-by-side glass cards */}
            <Reveal delay={0.26} className="mt-auto pt-[clamp(1rem,2vw,1.5rem)]">
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  {
                    label: 'Accolades',
                    rows: [
                      ["India's Best Design Student Award", 'Winner · 2025'],
                      ['Srishti Graduation Project Commendation', 'Winner · 2023'],
                      ['Taiwan Intl. Student Design Competition', 'Finalist · 2022'],
                    ],
                  },
                  {
                    label: 'Education',
                    rows: [
                      ['M.Des Interaction Design', 'National Institute of Design Bangalore'],
                      ['International Exchange',   'Hochschule für Technik und Wirtschaft Berlin'],
                      ['B.Des Visual Comm. & Brand Strategy', 'Srishti Institute of Art, Design & Technology, Bangalore'],
                    ],
                  },
                ].map(({ label, rows }) => (
                  <div key={label} style={{
                    position:       'relative',
                    background:     '#080808',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderRadius:   '20px',
                    border:         '1px solid rgba(255,255,255,0.04)',
                    padding:        '26px 24px 22px',
                    overflow:       'hidden',
                    boxShadow:      '0 0 0 1px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)',
                  }}>
                    {/* Corner rim — follows the rounded arc, fades diagonally */}
                    <div style={{
                      position:      'absolute',
                      inset:         0,
                      borderRadius:  '20px',
                      border:        '1px solid transparent',
                      borderTop:     '1px solid rgba(255,255,255,0.55)',
                      borderLeft:    '1px solid rgba(255,255,255,0.28)',
                      WebkitMaskImage: 'linear-gradient(135deg, black 0%, black 18%, transparent 55%)',
                      maskImage:       'linear-gradient(135deg, black 0%, black 18%, transparent 55%)',
                      pointerEvents: 'none',
                      zIndex:        5,
                    }} />
                    {/* Bottom-right face shadow */}
                    <div style={{
                      position:      'absolute',
                      bottom:        '-10%',
                      right:         '-10%',
                      width:         '65%',
                      height:        '60%',
                      background:    'radial-gradient(ellipse at 60% 60%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 45%, transparent 72%)',
                      borderRadius:  '50%',
                      pointerEvents: 'none',
                      zIndex:        3,
                    }} />
                    {/* Specular highlight */}
                    <div style={{
                      position:      'absolute',
                      top:           '-30%',
                      left:          '-15%',
                      width:         '55%',
                      height:        '50%',
                      background:    'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)',
                      borderRadius:  '50%',
                      transform:     'rotate(-10deg)',
                      pointerEvents: 'none',
                      filter:        'blur(2px)',
                      zIndex:        3,
                    }} />
                    <span className="font-mono text-[0.58rem] tracking-[0.16em] uppercase block"
                      style={{ position: 'relative', zIndex: 4, marginBottom: '16px', color: '#C48A1A' }}>
                      {label}
                    </span>
                    <div style={{ position: 'relative', zIndex: 4 }}>
                      {rows.map(([a, b], i, arr) => (
                        <div key={a} style={{
                          minHeight:    '64px',
                          display:      'flex',
                          flexDirection:'column',
                          justifyContent:'center',
                          padding:      '12px 0',
                          borderBottom: i < arr.length - 1 ? '1px solid rgba(242,237,228,0.10)' : 'none',
                        }}>
                          <p className="text-ink/32"
                            style={{ fontFamily:"'Syne', sans-serif", fontSize:'clamp(0.5rem,0.62vw,0.6rem)', lineHeight: 1.45, marginBottom: '4px' }}>{a}</p>
                          <p className="font-bold text-ink/55"
                            style={{ fontFamily:"'Syne', sans-serif", fontSize:'clamp(0.5rem,0.62vw,0.6rem)', lineHeight: 1.2 }}>{b}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>


          </div>

          {/* RIGHT — DNA canvas only, fades at bottom */}
          <div className="hidden md:flex md:col-span-5 relative">
            <DNACanvas />
            {/* Bottom fade into page BG */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{ height:'35%', background:'linear-gradient(to top, #000000 0%, transparent 100%)' }} />
            {/* Left edge fade — blends into content col */}
            <div className="absolute top-0 bottom-0 left-0 pointer-events-none"
              style={{ width:'18%', background:'linear-gradient(to right, #000000 0%, transparent 100%)' }} />
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Resume ───────────────────────────────────────────
function Resume() {
  return (
    <section className="py-[clamp(4rem,7vw,6rem)]"
      style={{ background:'#000000' }}>
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(3rem,6vw,6rem)] items-center">

          <div>
            <Reveal>
              <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase mb-5 block" style={{ color:'#C48A1A' }}>
                Experience
              </span>
            </Reveal>
            <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92] mb-6"
                style={{ fontSize:'clamp(1.9rem,3.8vw,3rem)' }}>
              <MaskReveal >My Resumè.</MaskReveal>
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
            <HeroButton
              href="https://drive.google.com/file/d/1KhxDpLdW_BUqVGeiBflXHNzng0GcKWKd/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              View / Download Resumè ↗
            </HeroButton>
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
    <section className="py-[clamp(4rem,7vw,6rem)] border-t border-white/[0.04] relative overflow-hidden"
      style={{ background:'#000000' }}>
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width:600, height:400,
                 background:'radial-gradient(ellipse,rgba(7,80,86,0.18) 0%,transparent 65%)' }} />

      <div className="relative max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">
        <div className="mb-[clamp(3rem,6vw,5rem)]" ref={ref}>
          <Reveal>
            <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase mb-5 block" style={{ color:'#C48A1A' }}>
              Contact Form
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]"
              style={{ fontSize:'clamp(1.9rem,3.8vw,3rem)' }}>
            <MaskReveal >Got an idea?</MaskReveal>
            <MaskReveal  delay={0.1}>Let's connect.</MaskReveal>
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
              <HeroButton type="submit">Submit</HeroButton>
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
    <div style={{ background:'#000000' }} className="text-ink overflow-x-hidden">
      <ProgressBar />
      <Nav />
      <AboutIntro />
      <Resume />
      <ContactForm />
      <Footer />
    </div>
  )
}
