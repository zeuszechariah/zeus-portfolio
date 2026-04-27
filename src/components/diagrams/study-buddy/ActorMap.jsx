import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  ink: '#0B1A2E', white: '#FFFFFF',
}
const FM = "'Syne', sans-serif"
const EASE = [0.22, 1, 0.36, 1]

const CX = 430, CY = 430
const R1 = 120, R2 = 240, R3 = 380
const R_PRIMARY = 48, R_SECONDARY = 44, R_TERTIARY = 40

function polar(angleDeg, r) {
  const a = (angleDeg * Math.PI) / 180
  return { cx: Math.round(CX + r * Math.cos(a)), cy: Math.round(CY + r * Math.sin(a)) }
}

// Arc endpoint at given radius and angle (degrees)
function ap(radius, deg) {
  const a = (deg * Math.PI) / 180
  return { x: Math.round(CX + radius * Math.cos(a)), y: Math.round(CY + radius * Math.sin(a)) }
}

function NodeText({ lines, x, y, fill }) {
  if (lines.length === 1) {
    return (
      <text textAnchor="middle" x={x} y={y} fontSize={11} fill={fill}
        fontFamily={FM} fontWeight="500" dominantBaseline="middle">
        {lines[0]}
      </text>
    )
  }
  return (
    <text textAnchor="middle" fontSize={11} fill={fill} fontFamily={FM} fontWeight="500">
      <tspan x={x} y={y} dy="-0.6em">{lines[0]}</tspan>
      <tspan x={x} dy="1.2em">{lines[1]}</tspan>
    </text>
  )
}

const PRIMARY = [
  { ...polar(-90, R1), lines: ['Students'] },
  { ...polar(-30, R1), lines: ['Ministry', 'of Edu.'] },
  { ...polar(30,  R1), lines: ['Teachers'] },
  { ...polar(90,  R1), lines: ['Parents /', 'Guardians'] },
  { ...polar(150, R1), lines: ['Exam', 'Boards'] },
  { ...polar(210, R1), lines: ['NCERT'] },
]

const SECONDARY = [
  { ...polar(-90, R2), lines: ['UGC'] },
  { ...polar(-54, R2), lines: ['EdTech', 'Cos.'] },
  { ...polar(-18, R2), lines: ['Coaching', 'Centres'] },
  { ...polar(18,  R2), lines: ['IT', 'Providers'] },
  { ...polar(54,  R2), lines: ['Online', 'Learning'] },
  { ...polar(90,  R2), lines: ['Private', 'Employers'] },
  { ...polar(126, R2), lines: ['Vocational', 'Institutes'] },
  { ...polar(162, R2), lines: ['Public', 'Enterprises'] },
  { ...polar(198, R2), lines: ['Social', 'Media'] },
  { ...polar(234, R2), lines: ['Startup', 'Ecosystem'] },
]

const TERTIARY = [
  { ...polar(-90,  R3), lines: ['NGOs'] },
  { ...polar(-60,  R3), lines: ['High', 'Schools'] },
  { ...polar(-30,  R3), lines: ['Banks &', 'Financial'] },
  { ...polar(0,    R3), lines: ['Activists'] },
  { ...polar(30,   R3), lines: ['Social', 'Impact'] },
  { ...polar(60,   R3), lines: ['Community', 'Centers'] },
  { ...polar(90,   R3), lines: ['Skill', 'Councils'] },
  { ...polar(120,  R3), lines: ['Student', 'Unions'] },
  { ...polar(150,  R3), lines: ['CSR &', 'Philanth.'] },
  { ...polar(180,  R3), lines: ['Political', 'Reps.'] },
  { ...polar(210,  R3), lines: ['Journalists'] },
  { ...polar(240,  R3), lines: ['Distance', 'Learning'] },
]

// textPath arcs at 11 o'clock for each ring
// PRIMARY: gap between 210° and 270° nodes → arc centered at 240°, radius 130 (just outside R1)
// SECONDARY: gap between 234° and 270° nodes → arc centered at 252°, radius 252 (just outside R2)
// TERTIARY: gap between 210° and 240° nodes → arc centered at 225°, radius 440 (clears R_TERTIARY=40 nodes)
const r1s = ap(130, 215), r1e = ap(130, 265)
const r2s = ap(252, 228), r2e = ap(252, 278)
const r3s = ap(440, 200), r3e = ap(440, 250)

export default function ActorMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <div ref={ref}>
      <svg viewBox="0 0 860 860" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <path id="r1arc" d={`M ${r1s.x},${r1s.y} A 130,130 0 0,1 ${r1e.x},${r1e.y}`} fill="none" />
          <path id="r2arc" d={`M ${r2s.x},${r2s.y} A 252,252 0 0,1 ${r2e.x},${r2e.y}`} fill="none" />
          <path id="r3arc" d={`M ${r3s.x},${r3s.y} A 440,440 0 0,1 ${r3e.x},${r3e.y}`} fill="none" />
        </defs>

        {/* Concentric guide rings */}
        <circle cx={CX} cy={CY} r={R1} fill="none" stroke="rgba(0,0,0,0.30)" strokeWidth={0.5} />
        <circle cx={CX} cy={CY} r={R2} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={0.5} />
        <circle cx={CX} cy={CY} r={R3} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={0.5} strokeDasharray="4 3" />

        {TERTIARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.55 + i * 0.035, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={R_TERTIARY} fill={DIAG.green} />
            <NodeText lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.ink} />
          </motion.g>
        ))}

        {SECONDARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.38, delay: 0.3 + i * 0.045, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={R_SECONDARY} fill={DIAG.blue} />
            <NodeText lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} />
          </motion.g>
        ))}

        {PRIMARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.12 + i * 0.07, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={R_PRIMARY} fill={DIAG.pink} />
            <NodeText lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} />
          </motion.g>
        ))}

        {/* Ring legend — top-left corner (x<180, y<180 is clear of all nodes) */}
        <circle cx={32} cy={46} r={8} fill={DIAG.pink} />
        <text x={48} y={50} fontSize={11} fill="#888" fontFamily={FM} letterSpacing="0.1em" dominantBaseline="middle">PRIMARY ACTORS</text>
        <circle cx={32} cy={74} r={8} fill={DIAG.blue} />
        <text x={48} y={78} fontSize={11} fill="#888" fontFamily={FM} letterSpacing="0.1em" dominantBaseline="middle">SECONDARY ACTORS</text>
        <circle cx={32} cy={102} r={8} fill={DIAG.green} />
        <text x={48} y={106} fontSize={11} fill="#888" fontFamily={FM} letterSpacing="0.1em" dominantBaseline="middle">TERTIARY ACTORS</text>
      </svg>
    </div>
  )
}
