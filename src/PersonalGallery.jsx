import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Add src + caption when photos are ready — swap null for '/your-photo.jpg'
const POLAROIDS = [
  { id: 0, src: null, caption: '', w: 300, rot: -12, x: '2%',  y: 50,  zIdx: 3, floatDur: 3.4, floatAmp: 8,  delay: 0    },
  { id: 1, src: null, caption: '', w: 255, rot:   7, x: '24%', y: 10,  zIdx: 2, floatDur: 4.2, floatAmp: 10, delay: 0.10 },
  { id: 2, src: null, caption: '', w: 225, rot:  -6, x: '45%', y: 65,  zIdx: 1, floatDur: 3.8, floatAmp: 7,  delay: 0.18 },
  { id: 3, src: null, caption: '', w: 300, rot:  14, x: '61%', y: 20,  zIdx: 3, floatDur: 4.6, floatAmp: 9,  delay: 0.07 },
  { id: 4, src: null, caption: '', w: 255, rot: -10, x: '78%', y: 45,  zIdx: 2, floatDur: 3.6, floatAmp: 8,  delay: 0.14 },
]

function Polaroid({ p, inView, containerRef }) {
  const [dragging, setDragging] = useState(false)

  const imgH   = p.w - 16        // square image area
  const totalH = imgH + 46       // 8px top + image + 38px caption strip

  return (
    // Outer: entrance animation + absolute position + rotation
    <motion.div
      initial={{ opacity: 0, scale: 0.78 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: p.delay, ease: EASE }}
      style={{
        position:        'absolute',
        left:            p.x,
        top:             p.y,
        zIndex:          p.zIdx,
        rotate:          p.rot,
        transformOrigin: 'center bottom',
        width:           p.w,
      }}
    >
      {/* Float wrapper — pauses smoothly when picked up */}
      <motion.div
        animate={dragging ? { y: 0 } : { y: [0, -p.floatAmp, 0] }}
        transition={dragging
          ? { duration: 0.2, ease: 'easeOut' }
          : { duration: p.floatDur, repeat: Infinity, ease: 'easeInOut', delay: p.id * 0.55 }
        }
      >
        {/* Drag + hover target */}
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.06}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => setDragging(false)}
          whileHover={!dragging ? { scale: 1.05, y: -10, transition: { duration: 0.28, ease: EASE } } : {}}
          whileDrag={{ scale: 1.07, zIndex: 50, transition: { duration: 0.15 } }}
          style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        >
          {/* Polaroid card */}
          <div style={{
            width:        p.w,
            height:       totalH,
            background:   '#FFFFFF',
            padding:      '8px 8px 0',
            borderRadius: '3px',
            boxShadow:    dragging
              ? '0 20px 60px rgba(0,0,0,0.7), 0 6px 20px rgba(0,0,0,0.5)'
              : '0 8px 40px rgba(0,0,0,0.55), 0 2px 10px rgba(0,0,0,0.35)',
            transition:   'box-shadow 0.2s ease',
          }}>
            {/* Image area */}
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }}
                />
              ) : (
                <div style={{
                  width:          '100%',
                  height:         '100%',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  background:     'linear-gradient(145deg, #1c1c1c 0%, #111111 100%)',
                  userSelect:     'none',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity="0.2">
                    <rect x="2" y="5" width="20" height="15" rx="2" stroke="#fff" strokeWidth="1.5"/>
                    <circle cx="12" cy="12" r="3.5" stroke="#fff" strokeWidth="1.5"/>
                    <path d="M8 5V4a1 1 0 011-1h6a1 1 0 011 1v1" stroke="#fff" strokeWidth="1.5"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Caption strip */}
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
                  userSelect:    'none',
                }}>
                  {p.caption}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function PersonalGallery() {
  const sectionRef   = useRef(null)
  const containerRef = useRef(null)
  const inView       = useInView(sectionRef, { once: true, amount: 0.15 })

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
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '20%',
        background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Bottom fade */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '20%',
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

      {/* Polaroid scatter — full width, draggable within this container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width:    '100%',
          height:   '580px',
          zIndex:   2,
        }}
      >
        {POLAROIDS.map(p => (
          <Polaroid key={p.id} p={p} inView={inView} containerRef={containerRef} />
        ))}
      </div>
    </section>
  )
}
