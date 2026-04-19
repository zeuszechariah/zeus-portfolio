import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

const POLAROIDS = [
  // Row 1
  { id: 0,  src: '/folio/goa-bar.jpg',          caption: 'Gokarna',           objPos: '50% 62%', w: 195, rot: -12, x: '0%',  y: 60  },
  { id: 1,  src: '/folio/eiffel.jpg',            caption: 'Paris',             objPos: '50% 15%', w: 180, rot:   7, x: '13%', y: 15  },
  { id: 2,  src: '/folio/berlin-graffiti.jpg',   caption: 'Berlin',            objPos: '50% 50%', w: 175, rot:  -5, x: '25%', y: 65  },
  { id: 3,  src: '/folio/child-zeus.jpg',        caption: 'age 6',             objPos: '50% 20%', w: 188, rot:  12, x: '38%', y: 22  },
  { id: 4,  src: '/folio/hoian.jpg',             caption: 'Hội An',            objPos: '50% 40%', w: 178, rot:  -8, x: '51%', y: 58  },
  { id: 5,  src: '/folio/dubai-waterpark.jpg',   caption: 'Dubai, 2019',       objPos: '50% 45%', w: 182, rot:   6, x: '64%', y: 18  },
  { id: 6,  src: '/folio/nid-campus.jpg',        caption: 'NID Ahmedabad',     objPos: '50% 55%', w: 172, rot: -10, x: '77%', y: 50  },
  // Row 2
  { id: 7,  src: '/folio/berlin-cathedral.jpg',  caption: 'Berlin Dom',        objPos: '50% 32%', w: 185, rot:   9, x: '3%',  y: 245 },
  { id: 8,  src: '/folio/mohabbat.jpg',          caption: 'Love lives here',   objPos: '50% 22%', w: 172, rot:  -6, x: '16%', y: 275 },
  { id: 9,  src: '/folio/snowy-street.jpg',      caption: 'first snow',        objPos: '50% 22%', w: 178, rot:  11, x: '29%', y: 240 },
  { id: 10, src: '/folio/snowman.jpg',           caption: 'built him myself',  objPos: '50% 30%', w: 172, rot:  -9, x: '42%', y: 278 },
  { id: 11, src: '/folio/football-sunset.jpg',   caption: 'golden hour',       objPos: '50% 18%', w: 178, rot:   7, x: '55%', y: 248 },
  { id: 12, src: '/folio/leather-jacket.jpg',    caption: 'the jacket era',    objPos: '50% 20%', w: 182, rot: -11, x: '68%', y: 272, imgFilter: 'grayscale(1)' },
  // Row 3
  { id: 14, src: '/folio/hcmc-skyline.jpg',      caption: 'Ho Chi Minh City',  objPos: '50% 58%', w: 182, rot:  -7, x: '10%', y: 480 },
  { id: 15, src: '/folio/shimla.jpg',            caption: 'Shimla',            objPos: '50% 58%', w: 192, rot:  13, x: '37%', y: 458 },
  { id: 16, src: '/folio/brandenburg.jpg',       caption: 'Brandenburger Tor', objPos: '50% 22%', w: 182, rot:  -8, x: '63%', y: 478 },
]

function Polaroid({ p, inView, sectionRef, zOverride, bringToFront }) {
  const [dragging, setDragging] = useState(false)

  const imgH   = p.w - 16
  const totalH = imgH + 46

  return (
    <motion.div
      drag
      dragConstraints={sectionRef}
      dragElastic={0.05}
      dragMomentum={false}
      onPointerDown={() => bringToFront(p.id)}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      initial={{ opacity: 0, scale: 0.78 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: p.id * 0.02, ease: EASE }}
      whileHover={!dragging ? { scale: 1.04, transition: { duration: 0.25, ease: EASE } } : {}}
      style={{
        position:        'absolute',
        left:            p.x,
        top:             p.y,
        width:           p.w,
        rotate:          p.rot,
        zIndex:          dragging ? 100 : (zOverride ?? 3),
        cursor:          dragging ? 'grabbing' : 'grab',
        transformOrigin: 'center bottom',
      }}
    >
      <div style={{
        width:        p.w,
        height:       totalH,
        background:   '#FFFFFF',
        padding:      '8px 8px 0',
        borderRadius: '3px',
        boxShadow:    dragging
          ? '0 22px 64px rgba(0,0,0,0.72), 0 6px 20px rgba(0,0,0,0.5)'
          : '0 8px 40px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.35)',
        transition:   'box-shadow 0.2s ease',
        userSelect:   'none',
      }}>
        <div style={{
          width:    '100%',
          height:   imgH,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {p.src ? (
            <img
              src={p.src}
              alt={p.caption || ''}
              draggable={false}
              style={{
                width:          '100%',
                height:         '100%',
                objectFit:      'cover',
                objectPosition: p.objPos || '50% 50%',
                filter:         p.imgFilter || undefined,
                display:        'block',
              }}
            />
          ) : (
            <div style={{
              width:          '100%',
              height:         '100%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              background:     'linear-gradient(145deg, #1c1c1c 0%, #111 100%)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity="0.2">
                <rect x="2" y="5" width="20" height="15" rx="2" stroke="#fff" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3.5" stroke="#fff" strokeWidth="1.5"/>
                <path d="M8 5V4a1 1 0 011-1h6a1 1 0 011 1v1" stroke="#fff" strokeWidth="1.5"/>
              </svg>
            </div>
          )}
        </div>

        <div style={{
          height:         '38px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
        }}>
          {p.caption && (
            <span style={{
              fontFamily:    "'Space Mono', monospace",
              fontSize:      '0.52rem',
              letterSpacing: '0.08em',
              color:         '#888',
              textAlign:     'center',
              lineHeight:    1.4,
            }}>
              {p.caption}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function PersonalGallery() {
  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once: true, amount: 0.10 })

  const zCounter = useRef(10)
  const [zMap, setZMap] = useState({})

  const bringToFront = (id) => {
    zCounter.current += 1
    setZMap(prev => ({ ...prev, [id]: zCounter.current }))
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background:    '#000000',
        position:      'relative',
        overflow:      'hidden',
        paddingTop:    'clamp(5rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 6vw, 5rem)',
      }}
    >
      {/* Dot grid */}
      <div aria-hidden="true" style={{
        position:        'absolute',
        inset:           0,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)',
        backgroundSize:  '22px 22px',
        pointerEvents:   'none',
        zIndex:          0,
      }} />
      {/* Top fade */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
        background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Bottom fade */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
        background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Text block */}
      <div style={{
        maxWidth:     '1200px',
        margin:       '0 auto',
        padding:      '0 44px',
        width:        '100%',
        position:     'relative',
        zIndex:       2,
        marginBottom: 'clamp(3rem, 5vw, 4.5rem)',
      }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            fontFamily:    "'Space Mono', monospace",
            fontSize:      '11px',
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color:         'rgba(242,237,228,0.34)',
            margin:        '0 0 16px',
          }}
        >
          Beyond the work
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          style={{
            fontFamily:    "'Syne', sans-serif",
            fontSize:      'clamp(1.9rem, 3.8vw, 3rem)',
            fontWeight:    600,
            color:         '#F2EDE4',
            lineHeight:    1.08,
            margin:        '0 0 20px',
            letterSpacing: '-0.025em',
            maxWidth:      '20ch',
          }}
        >
          Experience designer.<br />Experience collector.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.14, ease: EASE }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize:   'clamp(0.9rem, 1.4vw, 1rem)',
            color:      'rgba(242,237,228,0.52)',
            lineHeight: 1.75,
            maxWidth:   '52ch',
            margin:     0,
          }}
        >
          The two aren't separate for me. I design experiences by living them — every detour, conversation, and place I've found myself in feeds directly into how I think and what I make.
        </motion.p>
      </div>

      {/* Polaroid scatter — drag is constrained to sectionRef so the full section is reachable */}
      <div style={{
        position: 'relative',
        width:    '100%',
        height:   '740px',
        zIndex:   2,
      }}>
        {POLAROIDS.map(p => (
          <Polaroid
            key={p.id}
            p={p}
            inView={inView}
            sectionRef={sectionRef}
            zOverride={zMap[p.id]}
            bringToFront={bringToFront}
          />
        ))}
      </div>
    </section>
  )
}
