import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
  white: '#FFFFFF',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]

function NL({ lines, x, y, fill, fs = 10 }) {
  const lh = fs * 1.3
  const totalH = (lines.length - 1) * lh
  if (lines.length === 1) {
    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
        fontSize={fs} fill={fill} fontFamily={FM} fontWeight="400">
        {lines[0]}
      </text>
    )
  }
  return (
    <text textAnchor="middle" fontSize={fs} fill={fill} fontFamily={FM} fontWeight="400">
      {lines.map((l, i) => (
        <tspan key={i} x={x} y={y - totalH / 2 + i * lh} dominantBaseline="middle">{l}</tspan>
      ))}
    </text>
  )
}

// Center of the diagram
const CX = 450, CY = 310

const PRIMARY = [
  { cx: 450, cy: 248, r: 30, lines: ['Students'] },
  { cx: 516, cy: 296, r: 27, lines: ['Teachers'] },
  { cx: 498, cy: 366, r: 27, lines: ['Parents'] },
  { cx: 406, cy: 368, r: 25, lines: ['Boards'] },
  { cx: 388, cy: 294, r: 25, lines: ['NCERT'] },
]
const SECONDARY = [
  { cx: 450, cy: 140, r: 28, lines: ['EdTech', 'Co.'] },
  { cx: 586, cy: 195, r: 26, lines: ['Coaching', 'Centres'] },
  { cx: 622, cy: 330, r: 26, lines: ['Private', 'Employers'] },
  { cx: 548, cy: 445, r: 26, lines: ['Vocational', 'Institutes'] },
  { cx: 352, cy: 445, r: 26, lines: ['Online', 'Learning'] },
  { cx: 278, cy: 330, r: 26, lines: ['Public', 'Sector'] },
  { cx: 314, cy: 195, r: 26, lines: ['Ministry', 'of Edu.'] },
]
const TERTIARY = [
  { cx: 450, cy:  46, r: 22, lines: ['NGOs'] },
  { cx: 634, cy:  92, r: 22, lines: ['Activists'] },
  { cx: 744, cy: 218, r: 22, lines: ['Media'] },
  { cx: 718, cy: 392, r: 22, lines: ['Startup', 'Eco.'] },
  { cx: 582, cy: 502, r: 22, lines: ['Social', 'Impact'] },
  { cx: 318, cy: 502, r: 22, lines: ['Entrepre', 'neurs'] },
  { cx: 182, cy: 392, r: 22, lines: ['Journal', 'ists'] },
  { cx: 156, cy: 218, r: 22, lines: ['Student', 'Unions'] },
  { cx: 266, cy:  92, r: 22, lines: ['Distance', 'Learning'] },
]

export default function ActorMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12,
      padding: '32px 24px 24px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      {/* viewBox expanded upward by 20px to give room for TERTIARY label */}
      <svg viewBox="0 -20 900 640" width="100%" style={{ overflow: 'visible' }}>
        {/* Three concentric rings */}
        <circle cx={CX} cy={CY} r={88}  fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={2.5} />
        <circle cx={CX} cy={CY} r={182} fill="none" stroke="rgba(0,0,0,0.11)" strokeWidth={2} />
        <circle cx={CX} cy={CY} r={276} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={1.8} strokeDasharray="6 5" />

        {/* Ring labels — positioned above each ring's top arc, clear of nodes */}
        <text x={CX} y={195} textAnchor="middle" fontSize={8} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2">PRIMARY</text>
        <text x={CX} y={86}  textAnchor="middle" fontSize={8} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2">SECONDARY</text>
        <text x={CX} y={-4}  textAnchor="middle" fontSize={8} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2">TERTIARY</text>

        {/* Tertiary nodes — green */}
        {TERTIARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.04, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.green} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.ink} fs={7} />
          </motion.g>
        ))}

        {/* Secondary nodes — blue */}
        {SECONDARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.blue} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} fs={8} />
          </motion.g>
        ))}

        {/* Primary nodes — pink */}
        {PRIMARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.07, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.pink} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} fs={10} />
          </motion.g>
        ))}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: '12px 28px', justifyContent: 'center', flexWrap: 'wrap',
        marginTop: '1.25rem', paddingTop: '1.25rem',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}>
        {[
          { c: DIAG.pink,  l: 'Primary stakeholders' },
          { c: DIAG.blue,  l: 'Secondary stakeholders' },
          { c: DIAG.green, l: 'Tertiary stakeholders' },
        ].map(({ c, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c, flexShrink: 0 }} />
            <span style={{ fontFamily: FM, fontSize: '0.65rem', letterSpacing: '0.08em', color: DIAG.mid }}>{l}</span>
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
