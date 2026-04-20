import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
      'radial-gradient(ellipse at 28% 82%, rgba(70,110,255,0.14) 0%, transparent 52%)',
      'radial-gradient(ellipse at 78% 22%, rgba(120,60,255,0.08) 0%, transparent 48%)',
      'linear-gradient(145deg, rgba(10,14,38,0.38) 0%, rgba(8,12,32,0.42) 100%)',
    ].join(', '),
    rimColor:   'rgba(255,255,255,0.55)',
    glowShadow: '0 0 48px rgba(70,110,255,0.22), 0 0 96px rgba(70,110,255,0.10)',
    title:      'UX & Product Design',
    desc:       'I map systems before screens — flows, mental models, and edge cases first. Every interaction decision is grounded in research and stress-tested against real constraints.',
    initBR:     '20px 0 0 20px',
  },
  {
    backBg: [
      'radial-gradient(ellipse at 65% 78%, rgba(0,210,140,0.12) 0%, transparent 52%)',
      'radial-gradient(ellipse at 25% 25%, rgba(0,160,255,0.07) 0%, transparent 48%)',
      'linear-gradient(145deg, rgba(6,18,14,0.38) 0%, rgba(4,14,10,0.42) 100%)',
    ].join(', '),
    rimColor:   'rgba(255,255,255,0.50)',
    glowShadow: '0 0 48px rgba(0,210,140,0.18), 0 0 96px rgba(0,210,140,0.08)',
    title:      'Visual Design\n& Branding',
    desc:       'Craft-first, concept-driven. I build cohesive visual languages that hold across touchpoints — from type hierarchies to motion, every detail earns its place.',
    initBR:     '0',
  },
  {
    backBg: [
      'radial-gradient(ellipse at 55% 72%, rgba(160,70,255,0.14) 0%, transparent 52%)',
      'radial-gradient(ellipse at 20% 22%, rgba(255,60,160,0.08) 0%, transparent 48%)',
      'linear-gradient(145deg, rgba(12,8,30,0.38) 0%, rgba(8,6,28,0.42) 100%)',
    ].join(', '),
    rimColor:   'rgba(255,255,255,0.52)',
    glowShadow: '0 0 48px rgba(160,70,255,0.22), 0 0 96px rgba(160,70,255,0.10)',
    title:      'Creative Strategy',
    desc:       'I bridge research and output — translating cultural signals and user insight into sharp creative direction. The why always precedes the what.',
    initBR:     '0 20px 20px 0',
  },
]

function Icon({ i }) {
  const s  = 'rgba(255,255,255,0.45)'
  const sd = 'rgba(255,255,255,0.28)'
  if (i === 0) return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 16L16 4M16 4H7M16 4V13"
        stroke={s} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
      <path d="M10 2V18M2 10H18" stroke={s}  strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M4 4L16 16M16 4L4 16" stroke={sd} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}

export default function WhatIDo() {
  const sectionRef = useRef(null)

  useEffect(() => {
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
      gsap.set('.wid-strip', { scale: 1.18 })
      tl.to('.wid-strip', { scale: 1.00, duration: 0.22, ease: 'power2.inOut' }, 0)

      // ── Phase 1 (0.32 → 0.68): Cards break from image — upright, no tilt ────
      // Fade vignette out as cards separate
      tl.to('.wid-vignette', { opacity: 0, duration: 0.36, ease: 'power1.inOut' }, 0.32)
      // x separation only; fan rotation is deferred to the flip phase
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
  }, [])

  const topY = Math.round((STACK_H - CH) / 2) - 36

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
      {/* Dot grid texture */}
      <div aria-hidden="true" style={{
        position:        'absolute',
        inset:           0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)',
        backgroundSize:  '22px 22px',
        pointerEvents:   'none',
        zIndex:          0,
      }} />
      {/* Top fade */}
      <div aria-hidden="true" style={{
        position:   'absolute', top: 0, left: 0, right: 0,
        height:     '22%',
        background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Bottom fade */}
      <div aria-hidden="true" style={{
        position:   'absolute', bottom: 0, left: 0, right: 0,
        height:     '22%',
        background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 44px', width: '100%', position: 'relative', zIndex: 1 }}>

        <p style={{
          fontFamily:    "'Space Mono', monospace",
          fontSize:      '11px',
          letterSpacing: '0.20em',
          textTransform: 'uppercase',
          color:         'rgba(242,237,228,0.34)',
          margin:        '0 0 16px',
        }}>
          What I Do
        </p>

        <h2 style={{
          fontFamily:    "'Syne', sans-serif",
          fontSize:      'clamp(1.9rem, 3.8vw, 3rem)',
          fontWeight:    600,
          color:         '#F2EDE4',
          lineHeight:    1.08,
          margin:        '0 0 80px',
          letterSpacing: '-0.025em',
        }}>
          What I bring to the table
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

          {/* Strip-level vignette — only on the unified rect, fades on separation */}
          <div className="wid-vignette" style={{
            position:      'absolute',
            inset:         0,
            background:    'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
            zIndex:        5,
          }} />

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
                  {/* Blurred bg — inset covers blur edge, position compensated */}
                  <div style={{
                    position:           'absolute',
                    inset:              '-12px',
                    backgroundColor:    '#000',
                    backgroundImage:    'url(/card-front.jpg)',
                    backgroundSize:     `${CW * 3}px auto`,
                    backgroundPosition: `${-i * CW + 12}px 50%`,
                    backgroundRepeat:   'no-repeat',
                    filter:             'contrast(1.1) brightness(0.88) blur(2px)',
                  }} />
                  {/* Grain */}
                  <div style={{
                    position:        'absolute',
                    inset:           0,
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    backgroundSize:  '160px 160px',
                    opacity:         0.12,
                    pointerEvents:   'none',
                  }} />
                  {/* "depth" on centre card only */}
                  {i === 1 && (
                    <span style={{
                      position:      'relative',
                      zIndex:        2,
                      fontFamily:    "'EB Garamond', Georgia, serif",
                      fontStyle:     'italic',
                      fontWeight:    400,
                      fontSize:      'clamp(5rem, 9vw, 7.5rem)',
                      color:         'rgba(255,255,255,0.92)',
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
                      color:         '#F2EDE4',
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
