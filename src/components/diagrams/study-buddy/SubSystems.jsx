import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  ink: '#0B1A2E', muted: '#7A8A9E', border: 'rgba(0,0,0,0.12)',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]
const R = 44

// Horizontal spacing 260px, vertical 240px
// Row cy: 160, 400, 640 — Col cx: 200, 460, 720
const NODES = [
  { cx: 200, cy: 160, fill: DIAG.pink,  lines: ['Financial', '& Economic'] },
  { cx: 460, cy: 160, fill: DIAG.blue,  lines: ['Cultural', '& Social'] },
  { cx: 720, cy: 160, fill: DIAG.green, lines: ['Alternative', 'Education'] },
  { cx: 200, cy: 400, fill: DIAG.blue,  lines: ['Assessment', '& Exam'] },
  { cx: 460, cy: 400, fill: DIAG.pink,  lines: ['Infra. &', 'Resource'] },
  { cx: 720, cy: 400, fill: DIAG.blue,  lines: ['Formal', 'Education'] },
  { cx: 200, cy: 640, fill: DIAG.green, lines: ['Research', '& Innovation'] },
  { cx: 460, cy: 640, fill: DIAG.blue,  lines: ['Regulatory', '& Governance'] },
  { cx: 720, cy: 640, fill: DIAG.pink,  lines: ['Employment'] },
]

const H_LINES = [160, 400, 640].flatMap(y => [
  { x1: 200 + R, y1: y, x2: 460 - R, y2: y },
  { x1: 460 + R, y1: y, x2: 720 - R, y2: y },
])
const V_LINES = [200, 460, 720].flatMap(cx => [
  { x1: cx, y1: 160 + R, x2: cx, y2: 400 - R },
  { x1: cx, y1: 400 + R, x2: cx, y2: 640 - R },
])

export default function SubSystems() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12,
      padding: '32px 16px 24px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="80 60 760 680" width="100%">
        {[...H_LINES, ...V_LINES].map((l, i) => (
          <motion.line key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={DIAG.border} strokeWidth={1} strokeDasharray="8 6"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.04 }}
          />
        ))}

        {NODES.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={R} fill={n.fill} />
            <text textAnchor="middle" fontSize={11} fill="white" fontFamily={FM} fontWeight="400">
              <tspan x={n.cx} y={n.lines.length > 1 ? n.cy - 7 : n.cy} dominantBaseline="central">
                {n.lines[0]}
              </tspan>
              {n.lines[1] && (
                <tspan x={n.cx} y={n.cy + 7} dominantBaseline="central">
                  {n.lines[1]}
                </tspan>
              )}
            </text>
          </motion.g>
        ))}
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
