import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
  white: '#FFFFFF',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]

const CX = 450, CY = 320

function polar(angleDeg, r) {
  const a = (angleDeg * Math.PI) / 180
  return { cx: Math.round(CX + r * Math.cos(a)), cy: Math.round(CY + r * Math.sin(a)) }
}

function NL({ lines, x, y, fill, fs = 9 }) {
  const lh = fs * 1.3
  const totalH = (lines.length - 1) * lh
  return (
    <text textAnchor="middle" fontSize={fs} fill={fill} fontFamily={FM} fontWeight="400">
      {lines.map((l, i) => (
        <tspan key={i} x={x} y={y - totalH / 2 + i * lh} dominantBaseline="middle">{l}</tspan>
      ))}
    </text>
  )
}

// 6 primary nodes — r=88, evenly spaced at 60° intervals
const PRIMARY = [
  { ...polar(-90, 88), r: 30, lines: ['Students'] },
  { ...polar(-30, 88), r: 27, lines: ['Ministry', 'of Edu.'] },
  { ...polar(30, 88),  r: 26, lines: ['Teachers'] },
  { ...polar(90, 88),  r: 26, lines: ['Parents /','Guardians'] },
  { ...polar(150, 88), r: 25, lines: ['Exam', 'Boards'] },
  { ...polar(210, 88), r: 25, lines: ['NCERT'] },
]

// 10 secondary nodes — r=182, evenly at 36°
const SECONDARY = [
  { ...polar(-90, 182), r: 24, lines: ['UGC'] },
  { ...polar(-54, 182), r: 24, lines: ['EdTech', 'Companies'] },
  { ...polar(-18, 182), r: 24, lines: ['Coaching', 'Centres'] },
  { ...polar(18,  182), r: 24, lines: ['IT', 'Providers'] },
  { ...polar(54,  182), r: 24, lines: ['Online', 'Learning'] },
  { ...polar(90,  182), r: 24, lines: ['Private', 'Employers'] },
  { ...polar(126, 182), r: 24, lines: ['Vocational', 'Institutes'] },
  { ...polar(162, 182), r: 24, lines: ['Public Sector', 'Enterprises'] },
  { ...polar(198, 182), r: 24, lines: ['Social', 'Media'] },
  { ...polar(234, 182), r: 24, lines: ['Startup', 'Ecosystem'] },
]

// 12 tertiary nodes — r=278, evenly at 30°
const TERTIARY = [
  { ...polar(-90,  278), r: 20, lines: ['NGOs'] },
  { ...polar(-60,  278), r: 20, lines: ['High', 'Schools'] },
  { ...polar(-30,  278), r: 20, lines: ['Banks &', 'Financial'] },
  { ...polar(0,    278), r: 20, lines: ['Activists'] },
  { ...polar(30,   278), r: 20, lines: ['Social Impact', 'Orgs'] },
  { ...polar(60,   278), r: 20, lines: ['Community', 'Centers'] },
  { ...polar(90,   278), r: 20, lines: ['Skill', 'Councils'] },
  { ...polar(120,  278), r: 20, lines: ['Student', 'Unions'] },
  { ...polar(150,  278), r: 20, lines: ['CSR &', 'Philanthropic'] },
  { ...polar(180,  278), r: 20, lines: ['Political', 'Representatives'] },
  { ...polar(210,  278), r: 20, lines: ['Journalists'] },
  { ...polar(240,  278), r: 20, lines: ['Distance', 'Learning'] },
]

export default function ActorMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12,
      padding: '32px 24px 24px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="110 -10 680 690" width="100%" style={{ overflow: 'visible' }}>
        {/* Three concentric guide rings */}
        <circle cx={CX} cy={CY} r={88}  fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth={2} />
        <circle cx={CX} cy={CY} r={182} fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth={1.5} />
        <circle cx={CX} cy={CY} r={278} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={1.5} strokeDasharray="6 5" />

        {/* Ring labels */}
        <text x={CX} y={CY - 88 - 10} textAnchor="middle" fontSize={7.5} fill={DIAG.muted} fontFamily={FM} letterSpacing="2">PRIMARY</text>
        <text x={CX} y={CY - 182 - 10} textAnchor="middle" fontSize={7.5} fill={DIAG.muted} fontFamily={FM} letterSpacing="2">SECONDARY</text>
        <text x={CX} y={CY - 278 - 10} textAnchor="middle" fontSize={7.5} fill={DIAG.muted} fontFamily={FM} letterSpacing="2">TERTIARY</text>

        {/* Tertiary — green */}
        {TERTIARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: 0.55 + i * 0.035, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.green} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.ink} fs={6.5} />
          </motion.g>
        ))}

        {/* Secondary — blue */}
        {SECONDARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.38, delay: 0.3 + i * 0.045, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.blue} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} fs={7} />
          </motion.g>
        ))}

        {/* Primary — pink */}
        {PRIMARY.map((n, i) => (
          <motion.g key={i} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.12 + i * 0.07, ease: EASE }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.pink} />
            <NL lines={n.lines} x={n.cx} y={n.cy} fill={DIAG.white} fs={9} />
          </motion.g>
        ))}
      </svg>

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
        Stakeholder Map — Three concentric layers of actors in India's education ecosystem
      </p>
    </div>
  )
}
