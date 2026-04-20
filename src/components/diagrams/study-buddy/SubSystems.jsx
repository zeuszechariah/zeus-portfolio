import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  ink: '#0B1A2E', white: '#FFFFFF',
  border: 'rgba(0,0,0,0.12)',
}
const FM = "'Syne', sans-serif"
const EASE = [0.22, 1, 0.36, 1]
const R = 20

const COLS = [168, 222, 276]
const ROWS = [136, 188, 240]

const NODES = [
  { cx: COLS[0], cy: ROWS[0], fill: DIAG.pink,  lines: ['Financial', '& Econ.'] },
  { cx: COLS[1], cy: ROWS[0], fill: DIAG.blue,  lines: ['Cultural', '& Social'] },
  { cx: COLS[2], cy: ROWS[0], fill: DIAG.green, lines: ['Alt.', 'Education'] },
  { cx: COLS[0], cy: ROWS[1], fill: DIAG.blue,  lines: ['Assessment', '& Exam'] },
  { cx: COLS[1], cy: ROWS[1], fill: DIAG.pink,  lines: ['Infra. &', 'Resource'] },
  { cx: COLS[2], cy: ROWS[1], fill: DIAG.blue,  lines: ['Formal', 'Education'] },
  { cx: COLS[0], cy: ROWS[2], fill: DIAG.green, lines: ['Research', '& Innov.'] },
  { cx: COLS[1], cy: ROWS[2], fill: DIAG.blue,  lines: ['Regulatory', '& Govern.'] },
  { cx: COLS[2], cy: ROWS[2], fill: DIAG.pink,  lines: ['Employment'] },
]

const H_LINES = ROWS.flatMap(y => [
  { x1: COLS[0] + R, y1: y, x2: COLS[1] - R, y2: y },
  { x1: COLS[1] + R, y1: y, x2: COLS[2] - R, y2: y },
])
const V_LINES = COLS.flatMap(cx => [
  { x1: cx, y1: ROWS[0] + R, x2: cx, y2: ROWS[1] - R },
  { x1: cx, y1: ROWS[1] + R, x2: cx, y2: ROWS[2] - R },
])

export default function SubSystems() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <div ref={ref}>
      <svg viewBox="140 110 152 148" width="100%">
        {[...H_LINES, ...V_LINES].map((l, i) => (
          <motion.line key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={DIAG.border} strokeWidth={0.7} strokeDasharray="4 3"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
          />
        ))}

        {NODES.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={R} fill={n.fill} />
            <text textAnchor="middle" fontSize={6} fill="white" fontFamily={FM} fontWeight="400">
              <tspan x={n.cx} y={n.lines.length > 1 ? n.cy - 3.5 : n.cy} dominantBaseline="central">
                {n.lines[0]}
              </tspan>
              {n.lines[1] && (
                <tspan x={n.cx} y={n.cy + 3.5} dominantBaseline="central">
                  {n.lines[1]}
                </tspan>
              )}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
