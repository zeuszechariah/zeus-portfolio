import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  figPink: '#F48FB1', figPurple: '#CE93D8', figBlue: '#90CAF9', figYellow: '#FFF176',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
  border: 'rgba(0,0,0,0.10)',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]

const CAT = {
  context:     { fill: DIAG.pink,      text: '#fff' },
  technology:  { fill: DIAG.blue,      text: '#fff' },
  methodology: { fill: DIAG.green,     text: DIAG.ink },
  behaviour:   { fill: DIAG.figPink,   text: DIAG.ink },
  research:    { fill: DIAG.figPurple, text: DIAG.ink },
  outcome:     { fill: DIAG.figBlue,   text: DIAG.ink },
  impact:      { fill: DIAG.figYellow, text: DIAG.ink },
}

// Helper: quadratic bezier curve between two nodes (fluid, organic look)
function curvePath(a, b) {
  const mx = (a.cx + b.cx) / 2
  const my = (a.cy + b.cy) / 2
  const dx = b.cx - a.cx
  const dy = b.cy - a.cy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const bend = Math.min(len * 0.22, 55)
  const qx = Math.round(mx - (dy / len) * bend)
  const qy = Math.round(my + (dx / len) * bend)
  return `M ${a.cx} ${a.cy} Q ${qx} ${qy} ${b.cx} ${b.cy}`
}

// Denser layout — left cluster shifted right, right cluster shifted left
const NODES = [
  // Core cluster — centre of the map
  { id: 'students',     label: 'Students',              cx: 700, cy: 355, r: 23, cat: 'context' },
  { id: 'teachers',     label: 'Teachers /\neducators', cx: 792, cy: 298, r: 23, cat: 'context' },
  { id: 'institutions', label: 'Institutions',          cx: 844, cy: 395, r: 22, cat: 'context' },
  { id: 'parents',      label: 'Parents /\nGuardians',  cx: 762, cy: 462, r: 22, cat: 'context' },
  { id: 'ncert',        label: 'NCERT',                 cx: 645, cy: 425, r: 22, cat: 'context' },
  { id: 'moe',          label: 'Ministry of\nEducation',cx: 598, cy: 352, r: 22, cat: 'context' },
  { id: 'ugc',          label: 'UGC',                   cx: 660, cy: 276, r: 22, cat: 'context' },
  { id: 'boards',       label: 'Exams /\nBoards',       cx: 756, cy: 508, r: 20, cat: 'context' },
  { id: 'nta',          label: 'National Testing\nAgency', cx: 874, cy: 466, r: 18, cat: 'context' },
  // Left cluster — tightened closer to core
  { id: 'ngos',         label: 'NGOs',                  cx: 260, cy: 178, r: 20, cat: 'research' },
  { id: 'journalists',  label: 'Journalists',           cx: 168, cy: 324, r: 20, cat: 'behaviour' },
  { id: 'banks',        label: 'Banks &\nFinancial Inst.', cx: 298, cy: 470, r: 20, cat: 'outcome' },
  { id: 'privateEmp',   label: 'Private Sector\nEmployers', cx: 452, cy: 550, r: 20, cat: 'outcome' },
  { id: 'pses',         label: 'Public Sector\nEnterprises', cx: 258, cy: 578, r: 20, cat: 'outcome' },
  { id: 'socialMedia',  label: 'Social\nMedia',         cx: 372, cy: 192, r: 22, cat: 'technology' },
  { id: 'startups',     label: 'Startup\nEcosystem',    cx: 480, cy: 272, r: 18, cat: 'impact' },
  { id: 'coaching',     label: 'Coaching\nCentres',     cx: 536, cy: 424, r: 22, cat: 'methodology' },
  { id: 'itProviders',  label: 'IT\nProviders',         cx: 358, cy: 372, r: 20, cat: 'technology' },
  { id: 'nightSchool',  label: 'Night\nSchools',        cx: 256, cy: 672, r: 20, cat: 'methodology' },
  { id: 'activists',    label: 'Activists',             cx: 188, cy: 196, r: 20, cat: 'behaviour' },
  // Right cluster — tightened closer to core
  { id: 'edtech',        label: 'EdTech\nCompanies',    cx: 952, cy: 232, r: 22, cat: 'technology' },
  { id: 'csr',           label: 'CSR &\nPhilanthropic', cx: 1132, cy: 196, r: 20, cat: 'research' },
  { id: 'olf',           label: 'Online Learning\nForums', cx: 1238, cy: 332, r: 20, cat: 'technology' },
  { id: 'vocational',    label: 'Vocational & Skill\nTraining — NSDC', cx: 1032, cy: 378, r: 20, cat: 'methodology' },
  { id: 'nios',          label: 'NIOS &\nDistance Learning', cx: 1172, cy: 462, r: 20, cat: 'methodology' },
  { id: 'studentUnions', label: 'Student\nUnions',      cx: 926, cy: 498, r: 20, cat: 'behaviour' },
  { id: 'socialImpact',  label: 'Social Impact\nOrgs',  cx: 1082, cy: 562, r: 18, cat: 'research' },
  { id: 'dlp',           label: 'Distance Learning\nPlatforms', cx: 1268, cy: 534, r: 20, cat: 'technology' },
  { id: 'internship',    label: 'Internship\nProviders', cx: 1032, cy: 642, r: 20, cat: 'outcome' },
]

const EDGES = [
  // Core — strong (solid)
  { a: 'students', b: 'teachers',     strong: true },
  { a: 'students', b: 'institutions', strong: true },
  { a: 'students', b: 'parents',      strong: true },
  { a: 'students', b: 'ncert',        strong: true },
  { a: 'students', b: 'moe',          strong: true },
  { a: 'students', b: 'ugc',          strong: true },
  { a: 'teachers', b: 'institutions', strong: true },
  { a: 'teachers', b: 'ncert',        strong: true },
  { a: 'ncert',    b: 'moe',          strong: true },
  { a: 'moe',      b: 'ugc',          strong: true },
  { a: 'ugc',      b: 'boards',       strong: true },
  { a: 'boards',   b: 'nta',          strong: true },
  { a: 'institutions', b: 'boards',   strong: true },
  // Left → Core — weak (dashed)
  { a: 'coaching',     b: 'students' },
  { a: 'socialMedia',  b: 'students' },
  { a: 'itProviders',  b: 'institutions' },
  { a: 'ngos',         b: 'moe' },
  { a: 'privateEmp',   b: 'institutions' },
  { a: 'startups',     b: 'students' },
  { a: 'activists',    b: 'moe' },
  { a: 'banks',        b: 'institutions' },
  // Right → Core — weak
  { a: 'edtech',        b: 'students' },
  { a: 'edtech',        b: 'teachers' },
  { a: 'olf',           b: 'students' },
  { a: 'vocational',    b: 'institutions' },
  { a: 'studentUnions', b: 'students' },
  { a: 'nios',          b: 'students' },
  // Cross
  { a: 'coaching',    b: 'edtech' },
  { a: 'socialMedia', b: 'edtech' },
  { a: 'internship',  b: 'privateEmp' },
  { a: 'csr',         b: 'ngos' },
  { a: 'dlp',         b: 'olf' },
]

function getNode(id) { return NODES.find(n => n.id === id) }

export default function SystemMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12,
      padding: '28px 12px 20px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="80 120 1260 620" width="100%" style={{ overflow: 'visible' }}>
        {/* Edges */}
        {EDGES.map((e, i) => {
          const a = getNode(e.a)
          const b = getNode(e.b)
          if (!a || !b) return null
          return (
            <motion.path key={i}
              d={curvePath(a, b)}
              fill="none"
              stroke={e.strong ? 'rgba(0,0,0,0.28)' : 'rgba(0,0,0,0.16)'}
              strokeWidth={e.strong ? 2.2 : 1.3}
              strokeDasharray={e.strong ? undefined : '4 3'}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.015 }}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map((n, i) => {
          const { fill } = CAT[n.cat]
          const lines = n.label.split('\n')
          const lh = 10.5
          const totalH = (lines.length - 1) * lh
          const labelY = n.cy + n.r + 10
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.02, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={fill} />
              {lines.map((l, li) => (
                <text key={li} x={n.cx} y={labelY + li * lh}
                  textAnchor="middle" dominantBaseline="hanging"
                  fontSize={9.5} fill={DIAG.ink} fontFamily={FM} fontWeight="500">
                  {l}
                </text>
              ))}
            </motion.g>
          )
        })}
      </svg>

      {/* Legend — outside SVG, no overlap */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px 22px',
        justifyContent: 'center', alignItems: 'center',
        marginTop: '1.5rem', paddingTop: '1.25rem',
        borderTop: '1px solid rgba(0,0,0,0.07)',
      }}>
        {Object.entries(CAT).map(([cat, { fill }]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: fill, flexShrink: 0 }} />
            <span style={{ fontFamily: FM, fontSize: '0.62rem', letterSpacing: '0.05em', color: DIAG.mid, textTransform: 'capitalize' }}>{cat}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="30" height="10" style={{ flexShrink: 0 }}>
            <line x1="0" y1="5" x2="30" y2="5" stroke="rgba(0,0,0,0.28)" strokeWidth="2.2" />
          </svg>
          <span style={{ fontFamily: FM, fontSize: '0.62rem', color: DIAG.mid }}>strong</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="30" height="10" style={{ flexShrink: 0 }}>
            <line x1="0" y1="5" x2="30" y2="5" stroke="rgba(0,0,0,0.16)" strokeWidth="1.3" strokeDasharray="4 3" />
          </svg>
          <span style={{ fontFamily: FM, fontSize: '0.62rem', color: DIAG.mid }}>indirect</span>
        </div>
      </div>

      <p style={{
        fontFamily: FM, fontSize: '0.55rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: DIAG.muted,
        textAlign: 'center', marginTop: '1rem', marginBottom: 0,
      }}>
        System Map I — Stakeholder knowledge graph mapping relationships in India's education ecosystem
      </p>
    </div>
  )
}
