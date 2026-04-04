import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  ink: '#0B1A2E', muted: '#7A8A9E', border: 'rgba(0,0,0,0.08)',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]

const NODES = [
  // Row 1 (y=180)
  { cx: 200, cy: 180, fill: DIAG.pink,  lines: ['Financial', '& Economic'] },
  { cx: 450, cy: 180, fill: DIAG.blue,  lines: ['Cultural', '& Social'] },
  { cx: 700, cy: 180, fill: DIAG.green, lines: ['Alternative &', 'Informal', 'Education'] },
  // Row 2 (y=350)
  { cx: 200, cy: 350, fill: DIAG.blue,  lines: ['Assessment', '& Examination'] },
  { cx: 450, cy: 350, fill: DIAG.pink,  lines: ['Infrastructure', '& Resource'] },
  { cx: 700, cy: 350, fill: DIAG.blue,  lines: ['Formal', 'Education', 'System'] },
  // Row 3 (y=520)
  { cx: 200, cy: 520, fill: DIAG.green, lines: ['Research', '& Innovation'] },
  { cx: 450, cy: 520, fill: DIAG.blue,  lines: ['Regulatory', '& Governance'] },
  { cx: 700, cy: 520, fill: DIAG.pink,  lines: ['Employment'] },
]

// Horizontal connector lines (edge of circle to edge of next circle in row)
const H_LINES = [180, 350, 520].flatMap(y => [
  { x1: 255, y1: y, x2: 395, y2: y },
  { x1: 505, y1: y, x2: 645, y2: y },
])
// Vertical connector lines (edge of circle to edge of next circle in column)
const V_LINES = [200, 450, 700].flatMap(cx => [
  { x1: cx, y1: 235, x2: cx, y2: 295 },
  { x1: cx, y1: 405, x2: cx, y2: 465 },
])

export default function SubSystems() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      padding: 32, boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="0 0 900 700" width="100%">
        {/* Connecting lines */}
        {[...H_LINES, ...V_LINES].map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={DIAG.border} strokeWidth={1} strokeDasharray="4 4" />
        ))}

        {/* Circles with labels */}
        {NODES.map((n, i) => {
          const lh = 13
          const totalH = (n.lines.length - 1) * lh
          return (
            <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: EASE }}>
              <circle cx={n.cx} cy={n.cy} r={55} fill={n.fill} />
              {n.lines.map((line, li) => (
                <text key={li} x={n.cx} y={n.cy - totalH / 2 + li * lh}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fill="white" fontFamily={FM} fontWeight="500">
                  {line}
                </text>
              ))}
            </motion.g>
          )
        })}
      </svg>

      <p style={{
        fontFamily: FM, fontSize: '0.55rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: DIAG.muted,
        textAlign: 'center', marginTop: '1rem', marginBottom: 0,
      }}>
        Sub-Systems of Formal Education — 9 surrounding systems that shape and constrain India's formal education
      </p>
    </div>
  )
}
