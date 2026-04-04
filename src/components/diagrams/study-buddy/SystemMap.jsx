import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  figPink: '#F48FB1', figPurple: '#CE93D8', figBlue: '#90CAF9', figYellow: '#FFF176',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
  border: 'rgba(0,0,0,0.08)', surface: '#EAECF2',
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

const NODES = [
  // Core cluster
  { id: 'students',     label: 'Students',              cx: 700, cy: 350, r: 16, cat: 'context' },
  { id: 'teachers',     label: 'Teachers /\neducators', cx: 790, cy: 295, r: 16, cat: 'context' },
  { id: 'institutions', label: 'Institutions',          cx: 840, cy: 390, r: 16, cat: 'context' },
  { id: 'parents',      label: 'Parents /\nGuardians',  cx: 760, cy: 455, r: 16, cat: 'context' },
  { id: 'ncert',        label: 'NCERT',                 cx: 645, cy: 420, r: 16, cat: 'context' },
  { id: 'moe',          label: 'Ministry of\nEducation',cx: 600, cy: 350, r: 16, cat: 'context' },
  { id: 'ugc',          label: 'UGC',                   cx: 660, cy: 275, r: 16, cat: 'context' },
  { id: 'boards',       label: 'Exams /\nBoards',       cx: 755, cy: 500, r: 14, cat: 'context' },
  { id: 'nta',          label: 'National\nTesting Agency', cx: 870, cy: 460, r: 12, cat: 'context' },
  // Left cluster
  { id: 'ngos',         label: 'NGOs',                  cx: 200, cy: 175, r: 14, cat: 'research' },
  { id: 'journalists',  label: 'Journalists',           cx: 110, cy: 320, r: 14, cat: 'behaviour' },
  { id: 'banks',        label: 'Banks &\nFinancial Inst.', cx: 240, cy: 465, r: 14, cat: 'outcome' },
  { id: 'privateEmp',   label: 'Private Sector\nEmployers', cx: 390, cy: 545, r: 14, cat: 'outcome' },
  { id: 'pses',         label: 'Public Sector\nEnterprises', cx: 200, cy: 575, r: 14, cat: 'outcome' },
  { id: 'socialMedia',  label: 'Social\nmedia',         cx: 310, cy: 190, r: 16, cat: 'technology' },
  { id: 'startups',     label: 'Startup\nEcosystem',    cx: 420, cy: 270, r: 12, cat: 'impact' },
  { id: 'coaching',     label: 'Coaching\nCentres',     cx: 475, cy: 420, r: 16, cat: 'methodology' },
  { id: 'itProviders',  label: 'IT\nProviders',         cx: 300, cy: 370, r: 14, cat: 'technology' },
  { id: 'nightSchool',  label: 'Night\nSchools',        cx: 200, cy: 670, r: 14, cat: 'methodology' },
  { id: 'activists',    label: 'Activists',             cx: 130, cy: 195, r: 14, cat: 'behaviour' },
  // Right cluster
  { id: 'edtech',        label: 'EdTech\nCompanies',    cx: 1010, cy: 230, r: 16, cat: 'technology' },
  { id: 'csr',           label: 'CSR &\nPhilanthropic', cx: 1190, cy: 195, r: 14, cat: 'research' },
  { id: 'olf',           label: 'Online Learning\nForums', cx: 1295, cy: 330, r: 14, cat: 'technology' },
  { id: 'vocational',    label: 'Vocational & Skill\nTraining — NSDC', cx: 1090, cy: 375, r: 14, cat: 'methodology' },
  { id: 'nios',          label: 'NIOS &\nDistance Learning', cx: 1230, cy: 460, r: 14, cat: 'methodology' },
  { id: 'studentUnions', label: 'Student\nUnions',      cx: 985, cy: 495, r: 14, cat: 'behaviour' },
  { id: 'socialImpact',  label: 'Social Impact\nOrgs',  cx: 1140, cy: 560, r: 12, cat: 'research' },
  { id: 'dlp',           label: 'Distance Learning\nPlatforms', cx: 1325, cy: 530, r: 14, cat: 'technology' },
  { id: 'internship',    label: 'Internship\nProviders', cx: 1090, cy: 640, r: 14, cat: 'outcome' },
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
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      padding: '24px 16px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="0 0 1400 900" width="100%" style={{ overflow: 'visible' }}>
        {/* Edges */}
        {EDGES.map((e, i) => {
          const a = getNode(e.a)
          const b = getNode(e.b)
          if (!a || !b) return null
          return (
            <motion.line key={i}
              x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
              stroke={DIAG.border} strokeWidth={e.strong ? 1.2 : 0.8}
              strokeDasharray={e.strong ? undefined : '3 3'} opacity={0.6}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 0.6 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.015 }}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map((n, i) => {
          const { fill, text } = CAT[n.cat]
          const lines = n.label.split('\n')
          const lh = 8.5
          const totalH = (lines.length - 1) * lh
          const labelY = n.cy + n.r + 8
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.02, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={fill} />
              {/* External label below */}
              {lines.map((l, li) => (
                <text key={li} x={n.cx} y={labelY + li * lh}
                  textAnchor="middle" dominantBaseline="hanging"
                  fontSize={7} fill={DIAG.ink} fontFamily={FM}>
                  {l}
                </text>
              ))}
            </motion.g>
          )
        })}

        {/* Legend panel — bottom right */}
        <g transform="translate(1120, 680)">
          <rect width={250} height={182} rx={8} fill="white"
            stroke={DIAG.border} strokeWidth={1} />
          <text x={12} y={18} fontSize={7} fontFamily={FM} fontWeight="500"
            fill={DIAG.ink} letterSpacing="1">LEGEND</text>
          {Object.entries(CAT).map(([cat, { fill }], i) => (
            <g key={cat} transform={`translate(12, ${30 + i * 20})`}>
              <circle r={5} cx={5} cy={4} fill={fill} />
              <text x={16} y={8} fontSize={7.5} fontFamily={FM} fill={DIAG.mid}>{cat}</text>
            </g>
          ))}
          {/* Line types */}
          <line x1={12} y1={172} x2={40} y2={172} stroke={DIAG.mid} strokeWidth={1.2} />
          <text x={46} y={176} fontSize={7} fontFamily={FM} fill={DIAG.muted}>strong connection</text>
          <line x1={130} y1={172} x2={158} y2={172} stroke={DIAG.mid} strokeWidth={0.8} strokeDasharray="3 3" />
          <text x={164} y={176} fontSize={7} fontFamily={FM} fill={DIAG.muted}>indirect</text>
        </g>
      </svg>

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
