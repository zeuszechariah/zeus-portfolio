import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  surface: '#EAECF2',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
}
const FM = "'Syne', sans-serif"
const EASE = [0.22, 1, 0.36, 1]
const R = 44

// 5 nodes evenly placed on inner ellipse (cx=380, cy=250, rx=260, ry=178)
// Angles: -90°, -18°, 54°, 126°, 198°
const NODES = [
  { id: 1, cx: 380, cy: 72,  lines: ['Motivation &', 'Self Confidence'] },
  { id: 2, cx: 627, cy: 195, lines: ['Risk-Taking &', 'Skill Dev.'] },
  { id: 3, cx: 533, cy: 394, lines: ['Bigger Successes', '& Recognition'] },
  { id: 4, cx: 227, cy: 394, lines: ['Higher Motivation', '& Learning'] },
  { id: 5, cx: 133, cy: 195, lines: ['Early Small', 'Successes'] },
]

// Arrows follow a single outer ellipse (cx=380, cy=250, rx=306, ry=228).
// Both start and end of every arc sit at R+10px from their respective source/target
// circle centers, so there is a ~10px gap at both the tail and the arrowhead.
const ARROWS = [
  { path: 'M 416,31 A 306,228 0 0 1 656,149',  label: 'ENCOURAGES', lx: 574, ly: 36  },
  { path: 'M 679,210 A 306,228 0 0 1 584,411', label: 'LEADS TO',   lx: 698, ly: 326 },
  { path: 'M 524,447 A 306,228 0 0 1 236,447', label: 'REINFORCES', lx: 380, ly: 494 },
  { path: 'M 176,411 A 306,228 0 0 1 81,210',  label: 'EFFECT',     lx: 62,  ly: 326 },
  { path: 'M 105,149 A 306,228 0 0 1 344,31',  label: 'INCREASE',   lx: 186, ly: 36  },
]

export default function FeedbackLoops() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <div ref={ref}>
      <svg viewBox="30 5 710 510" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="arrFb" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={DIAG.mid} />
          </marker>
        </defs>

        {ARROWS.map((a, i) => (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: 0.8 + i * 0.12 }}>
            <path d={a.path} fill="none" stroke={DIAG.mid} strokeWidth={1.5}
              markerEnd="url(#arrFb)" />
            <text x={a.lx} y={a.ly} textAnchor="middle" fontSize={7} fill={DIAG.muted}
              fontFamily={FM} letterSpacing="1">{a.label}</text>
          </motion.g>
        ))}

        {NODES.map((n, i) => {
          const lh = 13
          const totalH = (n.lines.length - 1) * lh
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={R} fill={DIAG.surface} stroke="rgba(0,0,0,0.10)" strokeWidth={1} />
              {n.lines.map((line, li) => (
                <text key={li} x={n.cx} y={n.cy - totalH / 2 + li * lh}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fill={DIAG.ink} fontFamily={FM} fontWeight="400">
                  {line}
                </text>
              ))}
            </motion.g>
          )
        })}

        <text x={380} y={250} textAnchor="middle" fontSize={7} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2" dominantBaseline="middle">MOTIVATION REINFORCING LOOP</text>
      </svg>
    </div>
  )
}
