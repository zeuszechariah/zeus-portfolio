import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
  border: 'rgba(0,0,0,0.08)', white: '#FFFFFF',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]

function NL({ lines, x, y, fill, fs = 9 }) {
  const lh = fs * 1.35
  const totalH = (lines.length - 1) * lh
  if (lines.length === 1) {
    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
        fontSize={fs} fill={fill} fontFamily={FM} fontWeight="500">
        {lines[0]}
      </text>
    )
  }
  return (
    <text textAnchor="middle" fontSize={fs} fill={fill} fontFamily={FM} fontWeight="500">
      {lines.map((l, i) => (
        <tspan key={i} x={x} y={y - totalH / 2 + i * lh} dominantBaseline="middle">{l}</tspan>
      ))}
    </text>
  )
}

const PRIMARY = [
  { cx: 450, cy: 248, r: 22, lines: ['Students'] },
  { cx: 505, cy: 295, r: 20, lines: ['Teachers'] },
  { cx: 490, cy: 355, r: 20, lines: ['Parents'] },
  { cx: 410, cy: 358, r: 18, lines: ['Boards'] },
  { cx: 395, cy: 295, r: 18, lines: ['NCERT'] },
]
const SECONDARY = [
  { cx: 450, cy: 152, r: 22, lines: ['EdTech', 'Co.'] },
  { cx: 570, cy: 200, r: 20, lines: ['Coaching', 'Centres'] },
  { cx: 603, cy: 320, r: 20, lines: ['Private', 'Employers'] },
  { cx: 540, cy: 430, r: 20, lines: ['Vocational', 'Institutes'] },
  { cx: 360, cy: 430, r: 20, lines: ['Online', 'Learning'] },
  { cx: 297, cy: 320, r: 20, lines: ['Public', 'Sector'] },
  { cx: 330, cy: 200, r: 20, lines: ['Ministry', 'of Edu.'] },
]
const TERTIARY = [
  { cx: 450, cy: 65,  r: 18, lines: ['NGOs'] },
  { cx: 620, cy: 105, r: 18, lines: ['Activists'] },
  { cx: 720, cy: 220, r: 18, lines: ['Media'] },
  { cx: 700, cy: 380, r: 18, lines: ['Startup', 'Ecosystem'] },
  { cx: 580, cy: 490, r: 18, lines: ['Social', 'Impact'] },
  { cx: 320, cy: 490, r: 18, lines: ['Entrepreneurs'] },
  { cx: 200, cy: 380, r: 18, lines: ['Journalists'] },
  { cx: 180, cy: 220, r: 18, lines: ['Student', 'Unions'] },
  { cx: 280, cy: 105, r: 18, lines: ['Distance', 'Learning'] },
]

export default function ActorMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      padding: 32, boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="0 0 900 600" width="100%" style={{ overflow: 'visible' }}>
        {/* Three concentric rings */}
        <circle cx={450} cy={305} r={75}  fill="none" stroke="#e0e0e0" strokeWidth={1.5} />
        <circle cx={450} cy={305} r={155} fill="none" stroke={DIAG.border} strokeWidth={1} />
        <circle cx={450} cy={305} r={240} fill="none" stroke={DIAG.border} strokeWidth={1} strokeDasharray="4 4" />

        {/* Ring labels */}
        <text x={450} y={235} textAnchor="middle" fontSize={7} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2">PRIMARY</text>
        <text x={450} y={157} textAnchor="middle" fontSize={7} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2">SECONDARY</text>
        <text x={450} y={72}  textAnchor="middle" fontSize={7} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2">TERTIARY</text>

        {/* Tertiary nodes — green */}
        {TERTIARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.04, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.green} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.ink} fs={8.5} />
          </motion.g>
        ))}

        {/* Secondary nodes — blue */}
        {SECONDARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.05, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.blue} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} fs={9} />
          </motion.g>
        ))}

        {/* Primary nodes — pink */}
        {PRIMARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.06, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.pink} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} fs={10} />
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.25rem' }}>
        {[
          { c: DIAG.pink,  l: 'Primary stakeholders' },
          { c: DIAG.blue,  l: 'Secondary stakeholders' },
          { c: DIAG.green, l: 'Tertiary stakeholders' },
        ].map(({ c, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
            <span style={{ fontFamily: FM, fontSize: '0.58rem', letterSpacing: '0.1em', color: DIAG.muted }}>{l}</span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: FM, fontSize: '0.55rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: DIAG.muted,
        textAlign: 'center', marginTop: '1rem', marginBottom: 0,
      }}>
        Actor Map — Three concentric layers of stakeholders in India's education ecosystem
      </p>
    </div>
  )
}
