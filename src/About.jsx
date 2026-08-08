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
    let lastTs         = null

    const HIGHLIGHT_DURATION = 750  // ms per letter

    const draw = (ts) => {
      raf = requestAnimationFrame(draw)
      if (document.hidden) return

      const dt = lastTs === null ? 16.67 : Math.min(ts - lastTs, 33) // cap at 33ms (~30fps floor) to prevent lurching
      lastTs = ts

      ctx.clearRect(0, 0, W, H)

      rotAngle       += 0.0045 * (dt / 16.67)
      scrollOffs     += 0.52   * (dt / 16.67)
      highlightTimer += dt

      const CX     = W / 2 + W * 0.1
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
          const a    = Math.min(1, rungA * 2.2)
          const grad = ctx.createLinearGradient(lx, y, rx, y)
          grad.addColorStop(0,   `rgba(50,50,50,${a})`)
          grad.addColorStop(0.5, `rgba(220,85,35,${a})`)
          grad.addColorStop(1,   `rgba(50,50,50,${a})`)
          ctx.strokeStyle = grad
          ctx.lineWidth   = 1.2
          ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(rx, y); ctx.stroke()
        }
      }

      // ── stable highlight: cycle through char indices, not array positions ──
      // This never jumps when a row enters/exits the canvas.
      const step    = Math.floor(highlightTimer / HIGHLIGHT_DURATION)
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
  const dnaRef   = useRef(null)
  const dnaInView = useInView(dnaRef, { once: false, amount: 0.2 })
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
              <span className="font-mono text-[0.58rem] tracking-[0.16em] uppercase mb-5 block" style={{ color:'#5AAFB8' }}>
                Synopsis
              </span>
            </Reveal>

            {/* About heading — left-aligned */}
            <h1 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92] mb-8"
                style={{ fontSize:'clamp(1.9rem,3.8vw,3rem)' }}>
              <MaskReveal>About <em style={{ fontFamily:"'Lora', Georgia, serif", fontStyle:'italic', fontWeight:400 }}>me</em></MaskReveal>
            </h1>

            {/* Quote — below About heading */}
            <Reveal delay={0.06}>
              <blockquote
                style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: 'clamp(0.875rem,1.05vw,1rem)',
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
                <em style={{ fontFamily:"'Lora', Georgia, serif", fontStyle:'italic', fontWeight:400 }}>Humbled</em> to receive:
              </p>
            </Reveal>

            {/* Exam ranks — single horizontal row */}
            <Reveal delay={0.18} className="mb-10">
              <div className="flex items-center gap-8">
                {[
                  ['NID DAT', 'All India Rank 8 · 2024', 'Interaction Design / Strategic Design Management'],
                  ['IIT Bombay CEED', 'All India Rank 8 · 2024', 'Visual Design'],
                ].map(([inst, rank, disc], i, arr) => (
                  <div key={inst} className="flex items-center gap-8">
                    <div className="flex flex-col gap-[0.28rem]">
                      <p className="font-mono uppercase tracking-[0.1em] leading-none font-bold text-ink/50"
                        style={{ fontSize:'clamp(0.52rem,0.6vw,0.6rem)' }}>{inst}</p>
                      <p className="font-mono uppercase tracking-[0.1em] leading-none font-normal text-ink/35"
                        style={{ fontSize:'clamp(0.52rem,0.6vw,0.6rem)' }}>{rank}</p>
                      <p className="font-mono uppercase tracking-[0.08em] leading-none text-ink/22 mt-[0.18rem]"
                        style={{ fontSize:'clamp(0.46rem,0.52vw,0.52rem)' }}>{disc}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width:'1px', height:'28px', background:'rgba(242,237,228,0.12)', flexShrink:0 }} />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Accolades + Education — unified grid so rows align across both cards */}
            <Reveal delay={0.26} className="mt-auto pt-[clamp(1rem,2vw,1.5rem)]">
              {(() => {
                const rimMask = 'linear-gradient(135deg, transparent 0%, black 10%, black 24%, transparent 58%)'
                const CARDS = [
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
                      ['International Exchange', 'Hochschule für Technik und Wirtschaft Berlin'],
                      ['B.Des Visual Comm. & Brand Strategy', 'Srishti Institute of Art, Design & Technology, Bangalore'],
                    ],
                  },
                ]
                const cardDecor = (
                  <>
                    <div style={{ position:'absolute', inset:0, borderRadius:'20px', border:'1px solid transparent', borderTop:'1px solid rgba(255,255,255,0.55)', borderLeft:'1px solid rgba(255,255,255,0.28)', WebkitMaskImage:rimMask, maskImage:rimMask, pointerEvents:'none', zIndex:5 }} />
                    <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'65%', height:'60%', background:'radial-gradient(ellipse at 60% 60%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.50) 45%, transparent 72%)', borderRadius:'50%', pointerEvents:'none', zIndex:3 }} />
                    <div style={{ position:'absolute', top:'-30%', left:'-15%', width:'55%', height:'50%', background:'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)', borderRadius:'50%', transform:'rotate(-10deg)', pointerEvents:'none', filter:'blur(2px)', zIndex:3 }} />
                  </>
                )
                return (
                  <div style={{ position:'relative', marginBottom:'32px' }}>
                    {/* Card backgrounds — absolutely fill each column */}
                    <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', pointerEvents:'none', zIndex:0 }}>
                      {[0,1].map(i => (
                        <div key={i} style={{ position:'relative', background:'#080808', borderRadius:'20px', border:'1px solid rgba(255,255,255,0.04)', boxShadow:'0 0 0 1px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.5)', overflow:'hidden' }}>
                          {cardDecor}
                        </div>
                      ))}
                    </div>

                    {/* Shared content grid — rows auto-size to tallest cell */}
                    <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>

                      {/* Labels */}
                      {CARDS.map(c => (
                        <div key={c.label} style={{ padding:'22px 20px 14px' }}>
                          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.68rem', letterSpacing:'0.16em', textTransform:'uppercase', color:'#5AAFB8' }}>{c.label}</span>
                        </div>
                      ))}

                      {/* Data rows — each rowIdx is one CSS grid row, height set by tallest cell */}
                      {[0,1,2].map(rowIdx =>
                        CARDS.map((c, colIdx) => (
                          <div key={`${colIdx}-${rowIdx}`} style={{
                            padding:     '12px 20px',
                            borderTop:   '1px solid rgba(242,237,228,0.10)',
                            display:     'flex',
                            flexDirection:'column',
                            justifyContent:'center',
                          }}>
                            <p style={{ fontFamily:"'Syne', sans-serif", fontSize:'clamp(0.62rem,0.72vw,0.68rem)', lineHeight:1.4, marginBottom:'4px', color:'rgba(242,237,228,0.32)' }}>{c.rows[rowIdx][0]}</p>
                            <p style={{ fontFamily:"'Syne', sans-serif", fontSize:'clamp(0.75rem,0.92vw,0.84rem)', lineHeight:1.2, fontWeight:700, color:'rgba(242,237,228,0.60)' }}>{c.rows[rowIdx][1]}</p>
                          </div>
                        ))
                      )}

                      {/* Bottom padding */}
                      {[0,1].map(i => <div key={i} style={{ height:'20px' }} />)}
                    </div>
                  </div>
                )
              })()}
            </Reveal>

            {/* Mobile DNA — after cards, centred, mobile only */}
            <div className="block md:hidden mt-4" style={{ position:'relative', height:'480px', width:'100%', overflow:'hidden' }}>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity:0, filter:'blur(32px)' }}
                animate={{ opacity:1, filter:'blur(0px)' }}
                transition={{ duration:2.8, ease:[0.16,1,0.3,1] }}
                style={{ transform:'translateX(-10%)' }}
              >
                <DNACanvas />
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height:'40%', background:'linear-gradient(to top, #000000 0%, transparent 100%)' }} />
              <div className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{ height:'8%', background:'linear-gradient(to bottom, #000000 0%, transparent 100%)' }} />
            </div>

          </div>

          {/* RIGHT — DNA canvas only, fades at bottom */}
          <div ref={dnaRef} className="hidden md:flex md:col-span-5 relative">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity:0, filter:'blur(32px)' }}
              animate={dnaInView ? { opacity:1, filter:'blur(0px)' } : { opacity:0, filter:'blur(32px)' }}
              transition={{ duration:2.8, ease:[0.16,1,0.3,1] }}
            >
              <DNACanvas />
            </motion.div>
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
    <section className="py-[clamp(4rem,7vw,6rem)] relative overflow-hidden"
      style={{ background:'#000000' }}>
      <div aria-hidden="true" style={{
        position:'absolute', inset:0,
        backgroundImage:['linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)','linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)'].join(', '),
        backgroundSize:'44px 44px',
        WebkitMaskImage:'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        maskImage:'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        pointerEvents:'none', zIndex:0,
      }} />
      <div className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)] relative z-[1]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(3rem,6vw,6rem)] items-center relative">

          <div>
            <Reveal>
              <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase mb-5 block" style={{ color:'#5AAFB8' }}>
                Experience
              </span>
            </Reveal>
            <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92] mb-6"
                style={{ fontSize:'clamp(1.9rem,3.8vw,3rem)' }}>
              <MaskReveal><em style={{ fontFamily:"'Lora', Georgia, serif", fontStyle:'italic', fontWeight:400 }}>My</em> Resumè.</MaskReveal>
            </h2>
            <Reveal delay={0.1}>
              <p className="font-sans text-ink/45 leading-[1.8] max-w-[36ch]"
                style={{ fontSize:'clamp(0.875rem,1.1vw,0.9375rem)' }}>
                Experience, education, and focus — view or download here.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="flex flex-col items-center gap-6">
            <HeroButton
              href="https://drive.google.com/file/d/1KhxDpLdW_BUqVGeiBflXHNzng0GcKWKd/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              View / Download Resumè ↗︎
            </HeroButton>
          </Reveal>

          {/* Trim-path stroke traveling across the gap */}
          <div className="hidden md:block absolute pointer-events-none"
            style={{ left:'50%', top:'50%', transform:'translateX(-50%) translateY(-50%)', width:'clamp(3rem,6vw,6rem)' }}>
            <svg width="100%" height="2" style={{ overflow:'visible' }}>
              <defs>
                <linearGradient id="resume-line-grad" x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.55" />
                </linearGradient>
              </defs>
              <motion.line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="url(#resume-line-grad)"
                strokeWidth="1.5"
                pathLength="1"
                strokeDasharray="0.82 0.18"
                strokeLinecap="round"
                animate={{ strokeDashoffset: [0.82, -0.18] }}
                transition={{ duration:1.5, repeat:Infinity, repeatType:'mirror', ease:[0.45,0,0.55,1] }}
              />
            </svg>
          </div>
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
    bg-transparent border border-white/[0.1] rounded-xl px-4 py-3.5
    focus:outline-none focus:border-white/[0.28] transition-colors duration-200`

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
            <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase mb-5 block" style={{ color:'#5AAFB8' }}>
              Contact Form
            </span>
          </Reveal>
          <h2 className="font-sans font-semibold text-ink tracking-[-0.04em] leading-[0.92]"
              style={{ fontSize:'clamp(1.9rem,3.8vw,3rem)' }}>
            <MaskReveal >Got an idea?</MaskReveal>
            <MaskReveal delay={0.1}><em style={{ fontFamily:"'Lora', Georgia, serif", fontStyle:'italic', fontWeight:400 }}>Let's connect.</em></MaskReveal>
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

            <motion.div className="md:col-span-2 flex justify-center" initial={{ opacity:0, y:20 }}
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
