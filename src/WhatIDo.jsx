import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Ignore URL-bar show/hide on mobile — prevents pin glitch when browser chrome appears
ScrollTrigger.config({ ignoreMobileResize: true })

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h, { passive: true })
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

// ─── Mobile landscape constants ───────────────────────
// Cards are landscape (wide+short), stacked vertically
const CW_LAND = 300   // landscape card width
const CH_LAND = 190   // landscape card height (300 * 470/300 ≈ 190, maintaining aspect ratio)
const STACK_H_LAND = 720

const INIT_BR_LAND = ['20px 20px 0 0', '0', '0 0 20px 20px']

const FAN_LAND = [
  { x: 0, y: -28, rot: -5 },
  { x: 0, y:   0, rot:  0 },
  { x: 0, y:  28, rot:  5 },
]

function WhatIDoMobile() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pre-promote all animated elements onto GPU layers. c0/c2 are deliberately
      // NOT included here — baking a z:0/matrix3d baseline before the scaleY reveal
      // below runs is what caused it to render as a hinge/perspective distortion
      // instead of a flat stretch (same class of bug as the card-flip fix earlier).
      // They still get force3D later, from the individual tweens in phase 1/2,
      // by which point the scaleY reveal is long finished.
      gsap.set('.wid-m-strip', { scale: 1.05, force3D: true })
      gsap.set('.wid-m-c1', { force3D: true, z: 0 })
      // Cards 0 and 2 start collapsed to nothing, anchored at the edge touching
      // card 1, so they grow outward from it like it's splitting apart.
      gsap.set('.wid-m-c0', { scaleY: 0, transformOrigin: '50% 100%', force3D: false })
      gsap.set('.wid-m-c2', { scaleY: 0, transformOrigin: '50% 0%', force3D: false })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:             sectionRef.current,
          start:               'top top',
          end:                 '+=2600',
          scrub:               0.9,
          pin:                 true,
          anticipatePin:       1,
          invalidateOnRefresh: true,
        },
      })

      // Pre-phase: card 1 stays put while cards 0 and 2 grow outward from its
      // top/bottom edges — no separate cover elements, just a transform scale.
      // force3D:false keeps this a flat 2D scale (see note above). sine.inOut for
      // a gentler, more gradual feel than power2.inOut, which felt abrupt on scroll.
      tl.to('.wid-m-c0', { scaleY: 1, duration: 0.32, ease: 'sine.inOut', force3D: false }, 0)
      tl.to('.wid-m-c2', { scaleY: 1, duration: 0.32, ease: 'sine.inOut', force3D: false }, 0.03)
      // Snap the rounded corners + 3D context in once each card is fully scaled —
      // no more squish to distort them, and rotation isn't needed until phase 2.
      tl.set('.wid-m-c0 .wid-m-front', { borderRadius: INIT_BR_LAND[0] }, 0.32)
      tl.set('.wid-m-c0 .wid-m-inner', { perspective: '1100px', transformStyle: 'preserve-3d', webkitTransformStyle: 'preserve-3d' }, 0.32)
      tl.set('.wid-m-c2 .wid-m-front', { borderRadius: INIT_BR_LAND[2] }, 0.35)
      tl.set('.wid-m-c2 .wid-m-inner', { perspective: '1100px', transformStyle: 'preserve-3d', webkitTransformStyle: 'preserve-3d' }, 0.35)

      // Phase 0: breath
      tl.to('.wid-m-strip', { scale: 1.00, duration: 0.20, ease: 'power2.inOut', force3D: true }, 0.36)

      // Phase 1: cards separate
      tl.to('.wid-m-c0', { y: -15, duration: 0.36, ease: 'power1.inOut', force3D: true }, 0.56)
      tl.to('.wid-m-c2', { y:  15, duration: 0.36, ease: 'power1.inOut', force3D: true }, 0.56)
      tl.to(['.wid-m-c0 .wid-m-front', '.wid-m-c1 .wid-m-front', '.wid-m-c2 .wid-m-front'], {
        borderRadius: '20px', duration: 0.36, ease: 'power1.inOut',
      }, 0.56)

      // Phase 2: fan + flip, outermost first
      const FLIP_DUR = 0.46
      const STAGGER  = 0.14
      ;[2, 1, 0].forEach((i, order) => {
        const start = 0.82 + order * STAGGER
        tl.to(`.wid-m-c${i}`, {
          x: FAN_LAND[i].x, y: FAN_LAND[i].y, rotation: FAN_LAND[i].rot,
          duration: FLIP_DUR, ease: 'power2.inOut', force3D: true,
        }, start)
        tl.to(`.wid-m-c${i} .wid-m-inner`, {
          rotationY: 180, duration: FLIP_DUR, ease: 'power2.inOut', force3D: false,
        }, start + 0.06)
        // Explicit opacity crossfade around the midpoint — don't rely on Safari
        // correctly hiding the backface via backface-visibility, which it doesn't
        // always honour here. This hides "depth" by alpha regardless.
        const flipMid = start + 0.06 + FLIP_DUR * 0.42
        tl.to(`.wid-m-c${i} .wid-m-front`, {
          opacity: 0, duration: FLIP_DUR * 0.22, ease: 'power1.in',
        }, flipMid)
        tl.to(`.wid-m-c${i} .wid-m-back`, {
          opacity: 1, duration: FLIP_DUR * 0.22, ease: 'power1.out',
        }, flipMid)
      })

      // Refresh pin offset after fonts/images settle
      const t1 = setTimeout(() => ScrollTrigger.refresh(), 600)
      const t2 = setTimeout(() => ScrollTrigger.refresh(), 1800)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const topY = Math.round((STACK_H_LAND - CH_LAND * 3) / 2) - 20

  return (
    <section
      ref={sectionRef}
      style={{
        background:     '#000000',
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        overflow:       'hidden',
        position:       'relative',
      }}
    >
      {/* Grid bg */}
      <div aria-hidden="true" style={{
        position:        'absolute', inset: 0,
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize:  '44px 44px',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        maskImage:       'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        pointerEvents:   'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '0 clamp(1.25rem,5vw,2rem)' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.20em', textTransform: 'uppercase', color: '#5AAFB8', margin: '0 0 16px' }}>
          What I Do
        </p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.9rem,7vw,2.6rem)', fontWeight: 600, color: '#edf1df', lineHeight: 1.08, margin: '0 0 0', letterSpacing: '-0.025em' }}>
          What I bring to<br />
          <em style={{ fontFamily: '"Lora", Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}>the table</em>
        </h2>

        {/* Landscape cards stacked vertically */}
        <div style={{ position: 'relative', height: STACK_H_LAND }}>
          <div
            className="wid-m-strip"
            style={{
              position:        'absolute',
              top:             topY,
              left:            `calc(50% - ${CW_LAND / 2}px)`,
              width:           CW_LAND,
              height:          CH_LAND * 3,
              transformOrigin: '50% 50%',
              willChange:      'transform',
            }}
          >
            {CARDS.map((card, i) => (
              <div
                key={i}
                className={`wid-m-c${i}`}
                style={{
                  position:   'absolute',
                  top:        i * CH_LAND,
                  left:       0,
                  width:      CW_LAND,
                  height:     CH_LAND,
                  zIndex:     [3, 2, 1][i],
                  willChange: 'transform',
                }}
              >
                {/* perspective/preserve-3d only actually needed once the flip phase starts
                    rotating this — establishing that 3D context during the scaleY reveal
                    on cards 0/2 was contributing to the hinge-looking distortion. */}
                <div className="wid-m-inner" style={{
                  width: '100%', height: '100%', position: 'relative', willChange: 'transform',
                  ...(i === 1 ? { perspective: '1100px', transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' } : {}),
                }}>

                  {/* FRONT */}
                  {/* borderRadius starts flat (0) for cards 0/2 — a fixed-px radius on
                      an element inside a scaleY-animated parent squishes non-uniformly
                      at low scale values, reading as a hinge/perspective distortion.
                      GSAP snaps in the real INIT_BR_LAND shape once the reveal finishes. */}
                  <div className="wid-m-front" style={{
                    position:                 'absolute', inset: 0,
                    borderRadius:             i === 1 ? INIT_BR_LAND[i] : '0',
                    backfaceVisibility:       'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    overflow:                 'hidden',
                    display:                  'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor:          '#000',
                  }}>
                    <div style={{
                      position:           'absolute',
                      inset:              0,
                      backgroundColor:    '#000',
                      backgroundImage:    'url(/card-front-waves.png)',
                      backgroundSize:     `${CW_LAND}px ${CH_LAND * 3}px`,
                      backgroundPosition: `50% ${-i * CH_LAND}px`,
                      backgroundRepeat:   'no-repeat',
                    }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: '160px 160px', opacity: 0.12, pointerEvents: 'none' }} />
                    {i === 1 && (
                      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <svg width="32" height="32" viewBox="0 0 20 20" fill="none" style={{ marginBottom: '6px' }}>
                          <path d="M10 2V18M2 10H18" stroke="rgba(255,255,255,0.75)" strokeWidth="2.2" strokeLinecap="round"/>
                          <path d="M4 4L16 16M16 4L4 16" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(5rem,20vw,7.5rem)', color: '#e4eef0', letterSpacing: '-0.03em', userSelect: 'none', textShadow: '0 4px 24px rgba(0,0,0,0.50)', lineHeight: 1 }}>
                          depth
                        </span>
                      </div>
                    )}
                  </div>

                  {/* BACK */}
                  <div className="wid-m-back" style={{
                    position:                 'absolute', inset: 0,
                    background:               card.backBg,
                    backdropFilter:           'blur(8px) saturate(130%)',
                    WebkitBackdropFilter:     'blur(8px) saturate(130%)',
                    borderRadius:             '20px',
                    transform:                'rotateY(180deg)',
                    backfaceVisibility:       'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    opacity:                  0,
                    willChange:               'transform, opacity',
                    display:                  'flex',
                    flexDirection:            'row',
                    alignItems:               'center',
                    gap:                      '16px',
                    padding:                  '18px 22px',
                    overflow:                 'hidden',
                    boxShadow: [
                      `inset 0 1.5px 0 ${card.rimColor}`,
                      'inset 0 0 0 1px rgba(255,255,255,0.10)',
                      '0 24px 64px rgba(0,0,0,0.55)',
                    ].join(', '),
                  }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: 'linear-gradient(148deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 32%, transparent 56%)', pointerEvents: 'none', zIndex: 3 }} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', flexShrink: 0 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 700, color: '#edf1df', lineHeight: 1.12, margin: '0 0 8px', letterSpacing: '-0.025em', whiteSpace: 'pre-line', textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}>
                        {card.title}
                      </h3>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '13.5px', fontWeight: 400, color: 'rgba(242,237,228,0.58)', lineHeight: 1.65, margin: 0 }}>
                        {card.desc}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const CW = 300
const CH = 470
const STACK_H = 600
const STRIP_LEFT = 106

// Fan targets — reached simultaneously with the flip
const FAN = [
  { x:  40, rot: -8, y:   0 },
  { x:   0, rot:  0, y: -30 },
  { x: -40, rot:  8, y:   0 },
]

const CARDS = [
  {
    backBg: [
      'radial-gradient(ellipse at 28% 82%, rgba(7,80,86,0.48) 0%, transparent 52%)',
      'radial-gradient(ellipse at 78% 22%, rgba(7,80,86,0.22) 0%, transparent 48%)',
      'linear-gradient(145deg, rgba(4,40,46,0.70) 0%, rgba(3,28,32,0.78) 100%)',
    ].join(', '),
    rimColor:   'rgba(7,200,230,0.38)',
    glowShadow: '0 0 48px rgba(7,80,86,0.32), 0 0 96px rgba(7,80,86,0.14)',
    title:      'UX & Product Design',
    desc:       'Systems before screens. Every interaction decision is grounded in research, tested against real constraints.',
    initBR:     '20px 0 0 20px',
  },
  {
    backBg: [
      'radial-gradient(ellipse at 65% 78%, rgba(255,91,4,0.40) 0%, transparent 52%)',
      'radial-gradient(ellipse at 25% 25%, rgba(255,91,4,0.18) 0%, transparent 48%)',
      'linear-gradient(145deg, rgba(60,20,4,0.70) 0%, rgba(40,12,2,0.78) 100%)',
    ].join(', '),
    rimColor:   'rgba(255,140,60,0.42)',
    glowShadow: '0 0 48px rgba(255,91,4,0.30), 0 0 96px rgba(255,91,4,0.12)',
    title:      'Visual Design\n& Branding',
    desc:       'Craft-first, concept-driven. Visual languages built to hold across every touchpoint.',
    initBR:     '0',
  },
  {
    backBg: [
      'radial-gradient(ellipse at 55% 72%, rgba(237,241,223,0.22) 0%, transparent 52%)',
      'radial-gradient(ellipse at 20% 22%, rgba(228,238,240,0.14) 0%, transparent 48%)',
      'linear-gradient(145deg, rgba(22,35,42,0.78) 0%, rgba(16,26,30,0.85) 100%)',
    ].join(', '),
    rimColor:   'rgba(237,241,223,0.52)',
    glowShadow: '0 0 48px rgba(237,241,223,0.18), 0 0 96px rgba(228,238,240,0.09)',
    title:      'Creative Strategy',
    desc:       'Research translated into sharp creative direction. The why before the what.',
    initBR:     '0 20px 20px 0',
  },
]

function Icon({ i }) {
  const s  = 'rgba(255,255,255,0.45)'
  const sd = 'rgba(255,255,255,0.28)'
  if (i === 0) return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2V18M2 10H18" stroke={s}  strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M4 4L16 16M16 4L4 16" stroke={sd} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
  if (i === 1) return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="6.5"  cy="6.5"  r="2" fill={s}/>
      <circle cx="13.5" cy="6.5"  r="2" fill={s}/>
      <circle cx="6.5"  cy="13.5" r="2" fill={s}/>
      <circle cx="13.5" cy="13.5" r="2" fill={s}/>
    </svg>
  )
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 16L16 4M16 4H7M16 4V13"
        stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function WhatIDo() {
  const sectionRef = useRef(null)
  const isMobile   = useIsMobile()

  useEffect(() => {
    if (isMobile) return
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start:   'top top',
          end:     '+=4200',
          scrub:   1.8,
          pin:     true,
          anticipatePin: 1,
        },
      })

      // ── Phase 0 (0 → 0.22): Strip breath ────────────────────────────────────
      gsap.set('.wid-strip, .wid-hand', { scale: 1.05 })
      tl.to('.wid-strip, .wid-hand', { scale: 1.00, duration: 0.22, ease: 'power2.inOut' }, 0)

      // ── Phase 1 (0.32 → 0.68): Cards break from image — upright, no tilt ────
      tl.to('.wid-hand', { opacity: 0, duration: 0.36, ease: 'power2.inOut' }, 0.32)
      tl.to('.wid-c0', { x: -34, duration: 0.36, ease: 'power1.inOut' }, 0.32)
      tl.to('.wid-c2', { x:  34, duration: 0.36, ease: 'power1.inOut' }, 0.32)
      tl.to(['.wid-c0 .wid-front', '.wid-c1 .wid-front', '.wid-c2 .wid-front'], {
        borderRadius: '20px', duration: 0.36, ease: 'power1.inOut',
      }, 0.32)

      // ── Phase 2 (0.82 → 1.70): Flip drives the fan ──────────────────────────
      // Each card fans to its final position and rotation simultaneously with its flip.
      // Stagger by 0.14 so cards feel like distinct physical objects being dealt.
      const FLIP_DUR = 0.44
      const STAGGER  = 0.14

      ;[2, 1, 0].forEach((i, order) => {
        const start = 0.82 + order * STAGGER
        // Positional fan — happens in sync with the flip
        tl.to(`.wid-c${i}`, {
          x:        FAN[i].x,
          y:        FAN[i].y,
          rotation: FAN[i].rot,
          duration: FLIP_DUR,
          ease:     'power2.inOut',
        }, start)
        // Flip
        tl.to(`.wid-c${i} .wid-inner`, {
          rotationY: 180,
          duration:  FLIP_DUR,
          ease:      'power2.inOut',
        }, start)
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  if (isMobile) return <WhatIDoMobile />

  const topY = Math.round((STACK_H - CH) / 2) - 62

  return (
    <section
      ref={sectionRef}
      style={{
        background:     '#000000',
        borderTop:      'none',
        minHeight:      '100vh',
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        overflow:       'hidden',
        position:       'relative',
      }}
    >
      {/* Hand holding the card — RHS (hidden for now, keep asset) */}
      {/* <img
        src="/hand.png"
        aria-hidden="true"
        className="wid-hand"
        style={{
          position:      'absolute',
          right:         '-4%',
          bottom:        '-38%',
          height:        '170%',
          width:         'auto',
          zIndex:        2,
          pointerEvents: 'none',
          userSelect:    'none',
        }}
      /> */}

      {/* Grid background — fades at top and bottom via mask */}
      <div aria-hidden="true" style={{
        position:   'absolute', inset: 0,
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '44px 44px',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        maskImage:       'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 44px', width: '100%', position: 'relative', zIndex: 1 }}>

        <p style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:      '11px',
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color:         '#5AAFB8',
          margin:        '0 0 16px',
        }}>
          What I Do
        </p>

        <h2 style={{
          fontFamily:    "'Syne', sans-serif",
          fontSize:      'clamp(1.9rem, 3.8vw, 3rem)',
          fontWeight:    600,
          color:         '#edf1df',
          lineHeight:    1.08,
          margin:        '0 0 80px',
          letterSpacing: '-0.025em',
        }}>
          What I bring to<br /><em style={{ fontFamily:'"Lora", Georgia, serif', fontStyle:'italic', fontWeight:400 }}>the table</em>
        </h2>

        <div style={{
          position: 'relative',
          height:   STACK_H,
        }}>
          <div className="wid-strip" style={{
            position:        'absolute',
            top:             topY,
            left:            STRIP_LEFT,
            width:           CW * 3,
            height:          CH,
            transformOrigin: '50% 50%',
          }}>

          {CARDS.map((card, i) => (
            <div
              key={i}
              className={`wid-c${i}`}
              style={{
                position: 'absolute',
                top:      0,
                left:     i * CW,
                width:    CW,
                height:   CH,
                zIndex:   [3, 2, 1][i],
              }}
            >
              <div
                className="wid-inner"
                style={{
                  width:          '100%',
                  height:         '100%',
                  position:       'relative',
                  perspective:    '1100px',
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                }}
              >
                {/* FRONT */}
                <div
                  className="wid-front"
                  style={{
                    position:           'absolute',
                    inset:              0,
                    borderRadius:       card.initBR,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    overflow:           'hidden',
                    display:            'flex',
                    alignItems:         'center',
                    justifyContent:     'center',
                  }}
                >
                  {/* Panoramic image — each card shows its slice of the same image */}
                  <div style={{
                    position:           'absolute',
                    inset:              0,
                    backgroundColor:    '#000',
                    backgroundImage:    'url(/card-front-waves.png)',
                    backgroundSize:     `${CW * 3}px auto`,
                    backgroundPosition: `${-i * CW}px 50%`,
                    backgroundRepeat:   'no-repeat',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: '160px 160px', opacity: 0.12, pointerEvents: 'none' }} />
                  {i === 1 && (
                    <span style={{
                      position:      'relative',
                      zIndex:        2,
                      fontFamily:    "'Lora', Georgia, serif",
                      fontStyle:     'italic',
                      fontWeight:    400,
                      fontSize:      'clamp(5rem, 9vw, 7.5rem)',
                      color:         '#e4eef0',
                      letterSpacing: '-0.03em',
                      userSelect:    'none',
                    }}>
                      depth
                    </span>
                  )}
                </div>

                {/* BACK */}
                <div
                  style={{
                    position:   'absolute',
                    inset:      0,
                    background: card.backBg,
                    backdropFilter: 'blur(24px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                    borderRadius: '20px',
                    transform:  'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    display:        'flex',
                    flexDirection:  'column',
                    justifyContent: 'space-between',
                    padding:        '28px 28px 38px',
                    overflow:       'hidden',
                    boxShadow: [
                      `inset 0 1.5px 0 ${card.rimColor}`,
                      'inset 0 0 0 1px rgba(255,255,255,0.10)',
                      '0 24px 64px rgba(0,0,0,0.55)',
                      '0 8px 24px rgba(0,0,0,0.35)',
                    ].join(', '),
                  }}
                >
                  {/* Glassy specular reflection — top-left diagonal highlight */}
                  <div style={{
                    position:      'absolute',
                    inset:         0,
                    borderRadius:  'inherit',
                    background:    'linear-gradient(148deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 32%, transparent 56%)',
                    pointerEvents: 'none',
                    zIndex:        3,
                  }} />
                  <div>
                    <h3 style={{
                      fontFamily:    "'Syne', sans-serif",
                      fontSize:      '28px',
                      fontWeight:    700,
                      color:         '#edf1df',
                      lineHeight:    1.12,
                      margin:        '0 0 18px',
                      letterSpacing: '-0.025em',
                      whiteSpace:    'pre-line',
                      textShadow:    '0 2px 12px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.35)',
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      fontFamily:  "'Syne', sans-serif",
                      fontSize:    '12.5px',
                      fontWeight:  400,
                      color:       'rgba(242,237,228,0.58)',
                      lineHeight:  1.65,
                      margin:      0,
                    }}>
                      {card.desc}
                    </p>
                  </div>
                  <Icon i={i} />
                </div>

              </div>
            </div>
          ))}
          </div>
        </div>

      </div>
    </section>
  )
}
