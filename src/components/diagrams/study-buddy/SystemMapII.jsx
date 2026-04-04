import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00', yellow: '#FAFF38',
  figPink: '#F48FB1', figPurple: '#CE93D8', figBlue: '#90CAF9',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
  border: 'rgba(0,0,0,0.08)',
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
  highlight:   { fill: DIAG.yellow,    text: DIAG.ink },
}

const NODES = [
  // TOP CLUSTER
  { id: 'rep-culture',      label: 'Reputation &\nRising Culture',    cx: 700,  cy: 80,  r: 14, cat: 'context' },
  { id: 'disengaged-top',   label: 'Disengagement',                   cx: 900,  cy: 100, r: 14, cat: 'behaviour' },
  { id: 'motivation-learn', label: 'Motivation\nto Learn',            cx: 1050, cy: 80,  r: 16, cat: 'context' },
  { id: 'disseminated',     label: 'Disseminated\nto Friends',        cx: 1200, cy: 100, r: 12, cat: 'outcome' },
  { id: 'rigid-curriculum', label: 'Rigid\nCurriculum',               cx: 1100, cy: 180, r: 14, cat: 'context' },
  { id: 'high-curriculum',  label: 'High\nCurriculum',                cx: 1260, cy: 80,  r: 14, cat: 'context' },
  // LEFT CLUSTER
  { id: 'learning-quality', label: 'Learning\nQuality',               cx: 120,  cy: 200, r: 14, cat: 'outcome' },
  { id: 'passion',          label: 'Passion',                         cx: 100,  cy: 300, r: 14, cat: 'behaviour' },
  { id: 'optimal-learning', label: 'Optimal\nLearning',               cx: 120,  cy: 400, r: 14, cat: 'outcome' },
  { id: 'flow-state',       label: 'Flow State &\nEngagement',        cx: 80,   cy: 500, r: 14, cat: 'behaviour' },
  { id: 'time-mgmt',        label: 'Time\nManagement',                cx: 200,  cy: 550, r: 14, cat: 'methodology' },
  { id: 'self-discipline',  label: 'Self-discipline',                 cx: 150,  cy: 650, r: 14, cat: 'behaviour' },
  { id: 'consistency',      label: 'Consistency',                     cx: 100,  cy: 750, r: 14, cat: 'behaviour' },
  { id: 'acct-partners',    label: 'Accountability\nPartners',        cx: 80,   cy: 850, r: 14, cat: 'research' },
  // CENTRE-LEFT
  { id: 'engagement',       label: 'Engagement',                      cx: 350,  cy: 220, r: 16, cat: 'behaviour' },
  { id: 'autonomy',         label: 'Autonomy &\nConfidence',          cx: 320,  cy: 340, r: 14, cat: 'behaviour' },
  { id: 'track-progress',   label: 'Track Progress\n& Focus',         cx: 310,  cy: 440, r: 14, cat: 'methodology' },
  { id: 'personal-chal',    label: 'Personal\nChallenges',            cx: 290,  cy: 540, r: 14, cat: 'behaviour' },
  { id: 'sense-achieve',    label: 'Sense of\nAchievement',           cx: 300,  cy: 640, r: 14, cat: 'outcome' },
  // CENTRE — core nodes
  { id: 'motivation',       label: 'Motivation',                      cx: 600,  cy: 280, r: 20, cat: 'context' },
  { id: 'confidence',       label: 'Confidence',                      cx: 800,  cy: 280, r: 20, cat: 'context' },
  { id: 'peer-support',     label: 'Peer Support &\nGroup Learning',  cx: 550,  cy: 380, r: 16, cat: 'research' },
  { id: 'self-reflection',  label: 'Self\nReflection',                cx: 500,  cy: 460, r: 14, cat: 'methodology' },
  { id: 'journaling',       label: 'Journaling',                      cx: 480,  cy: 560, r: 14, cat: 'methodology' },
  { id: 'learning-mistakes',label: 'Learning from\nMistakes',         cx: 520,  cy: 640, r: 14, cat: 'methodology' },
  { id: 'passive-learning', label: 'Passive\nLearning',               cx: 560,  cy: 740, r: 14, cat: 'behaviour' },
  { id: 'curiosity',        label: 'Curiosity &\nPassion',            cx: 480,  cy: 820, r: 14, cat: 'behaviour' },
  // CENTRE-RIGHT
  { id: 'interest-learning',label: 'Interest in\nLearning',           cx: 900,  cy: 200, r: 16, cat: 'context' },
  { id: 'acct-motivation',  label: 'Accountability\n& Motivation',    cx: 950,  cy: 300, r: 14, cat: 'research' },
  { id: 'motivation-skills',label: 'Motivation for\nSkills',          cx: 1000, cy: 400, r: 14, cat: 'context' },
  { id: 'cultural-social',  label: 'Cultural &\nSocial Values',       cx: 900,  cy: 400, r: 14, cat: 'context' },
  { id: 'creativity',       label: 'Creativity &\nOriginality',       cx: 950,  cy: 500, r: 14, cat: 'behaviour' },
  { id: 'practical-learning',label: 'Practical\nLearning',            cx: 1050, cy: 500, r: 14, cat: 'methodology' },
  { id: 'effective-learning',label: 'Effective\nLearning',            cx: 1100, cy: 400, r: 14, cat: 'outcome' },
  { id: 'student-sat',      label: 'Student\nSatisfaction',           cx: 1150, cy: 500, r: 14, cat: 'outcome' },
  { id: 'experimental',     label: 'Experimental\nLearning',          cx: 900,  cy: 580, r: 14, cat: 'methodology' },
  // RIGHT CLUSTER
  { id: 'recognition',      label: 'Recognition\nimproves Motivation',cx: 1200, cy: 300, r: 14, cat: 'outcome' },
  { id: 'financial-inc',    label: 'Financial\nIncentives',           cx: 1300, cy: 380, r: 14, cat: 'outcome' },
  { id: 'better-infra',     label: 'Better\nInfrastructure',          cx: 1250, cy: 460, r: 14, cat: 'outcome' },
  { id: 'personal-expect',  label: 'Personal\nExpectations',          cx: 1350, cy: 300, r: 12, cat: 'behaviour' },
  { id: 'mental-health-emp',label: 'Emphasis on\nMental Health',      cx: 1300, cy: 550, r: 14, cat: 'research' },
  { id: 'teacher-practices',label: 'Advanced Teacher\nPractices',     cx: 1200, cy: 480, r: 14, cat: 'research' },
  { id: 'career-exploration',label: 'Career\nExploration',            cx: 1150, cy: 600, r: 14, cat: 'outcome' },
  { id: 'fear-failure',     label: 'Fear of\nFailure',                cx: 1300, cy: 700, r: 14, cat: 'behaviour' },
  { id: 'disengaged-right', label: 'Disengagement',                   cx: 1350, cy: 780, r: 14, cat: 'behaviour' },
  { id: 'lack-collab',      label: 'Lack of\nCollaboration',          cx: 1250, cy: 800, r: 12, cat: 'behaviour' },
  { id: 'false-perception', label: 'False Perception\nof Success',    cx: 1150, cy: 780, r: 12, cat: 'behaviour' },
  { id: 'social-isolation', label: 'Social\nIsolation',               cx: 1100, cy: 700, r: 12, cat: 'behaviour' },
  { id: 'societal-demands', label: 'Personal &\nSocietal Demands',    cx: 1300, cy: 650, r: 12, cat: 'behaviour' },
  { id: 'lecture-based',    label: 'Lecture-based\nLearning',         cx: 1050, cy: 800, r: 12, cat: 'behaviour' },
  { id: 'lack-socialising', label: 'Lack of\nSocialising',            cx: 950,  cy: 870, r: 12, cat: 'behaviour' },
  // BOTTOM CLUSTER
  { id: 'digital-learning', label: 'Digital\nLearning',               cx: 350,  cy: 580, r: 16, cat: 'technology' },
  { id: 'digital-notes',    label: 'Digital\nNote Taking',            cx: 300,  cy: 680, r: 14, cat: 'technology' },
  { id: 'distraction',      label: 'Distraction\nfrom Learning',      cx: 200,  cy: 750, r: 14, cat: 'behaviour' },
  { id: 'digital-fatigue',  label: 'Digital Learning\nFatigue',       cx: 250,  cy: 840, r: 14, cat: 'behaviour' },
  { id: 'social-relation',  label: 'Social\nRelation',                cx: 380,  cy: 780, r: 14, cat: 'research' },
  { id: 'phone-addiction',  label: 'Phone\nAddiction',                cx: 420,  cy: 870, r: 14, cat: 'behaviour' },
  { id: 'unhealthy-comp',   label: 'Unhealthy\nCompetition',          cx: 520,  cy: 860, r: 12, cat: 'behaviour' },
  { id: 'access-info',      label: 'Access to\nInformation',          cx: 600,  cy: 800, r: 14, cat: 'technology' },
  { id: 'info-overload',    label: 'Information\nOverload',           cx: 700,  cy: 820, r: 14, cat: 'behaviour' },
  { id: 'tools-fatigue',    label: 'Digital Tools\nFatigue',          cx: 780,  cy: 870, r: 12, cat: 'technology' },
  { id: 'social-media',     label: 'Social Media\nUsage',             cx: 850,  cy: 780, r: 14, cat: 'technology' },
  { id: 'lower-attention',  label: 'Lower\nAttention Spans',          cx: 750,  cy: 750, r: 12, cat: 'behaviour' },
  // HIGHLIGHTED
  { id: 'mental-wellbeing', label: 'Mental\nWell Being',              cx: 1100, cy: 580, r: 28, cat: 'highlight' },
]

// Edges: { a, b, strong?, highlight?, dashed? }
const EDGES = [
  // Motivation ↔ Confidence — bidirectional bold
  { a: 'motivation', b: 'confidence', strong: true },
  // Centre → Motivation
  { a: 'peer-support',      b: 'motivation' },
  { a: 'self-reflection',   b: 'motivation' },
  { a: 'engagement',        b: 'motivation' },
  { a: 'curiosity',         b: 'motivation' },
  { a: 'interest-learning', b: 'motivation' },
  { a: 'sense-achieve',     b: 'motivation' },
  { a: 'passion',           b: 'motivation' },
  // Centre → Confidence
  { a: 'acct-motivation',   b: 'confidence' },
  { a: 'recognition',       b: 'motivation' },
  // Engagement chain
  { a: 'engagement', b: 'autonomy',       strong: true },
  { a: 'autonomy',   b: 'track-progress', strong: true },
  { a: 'track-progress', b: 'sense-achieve', strong: true },
  // Self-reflection chain
  { a: 'self-reflection',   b: 'journaling' },
  { a: 'journaling',        b: 'learning-mistakes' },
  // Digital chain
  { a: 'digital-learning',  b: 'distraction', strong: true },
  { a: 'distraction',       b: 'phone-addiction', strong: true },
  // Fear of failure loop
  { a: 'fear-failure',      b: 'disengaged-right', dashed: true },
  { a: 'disengaged-right',  b: 'motivation-learn',  dashed: true },
  // Curiosity chain
  { a: 'curiosity',         b: 'interest-learning' },
  // Mental wellbeing — highlighted
  { a: 'mental-wellbeing',  b: 'motivation',    highlight: true },
  { a: 'motivation',        b: 'mental-wellbeing', highlight: true },
  // Info overload
  { a: 'social-media',      b: 'info-overload' },
  { a: 'info-overload',     b: 'lower-attention' },
  // Left cluster links
  { a: 'passion',           b: 'engagement' },
  { a: 'flow-state',        b: 'motivation', dashed: true },
  { a: 'time-mgmt',         b: 'track-progress' },
  // Interest in learning
  { a: 'motivation-learn',  b: 'interest-learning' },
  { a: 'interest-learning', b: 'acct-motivation' },
]

function getNode(id) { return NODES.find(n => n.id === id) }

export default function SystemMapII() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      padding: '24px 16px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="0 0 1400 950" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glowMW" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {EDGES.map((e, i) => {
          const a = getNode(e.a)
          const b = getNode(e.b)
          if (!a || !b) return null
          const stroke = e.highlight ? DIAG.pink : DIAG.border
          const sw = e.strong ? 1.8 : e.highlight ? 1.6 : 0.8
          const dash = e.dashed ? '3 3' : undefined
          const op = e.highlight ? 0.7 : 0.55
          return (
            <motion.line key={i}
              x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
              stroke={stroke} strokeWidth={sw}
              strokeDasharray={dash} opacity={op}
              initial={{ opacity: 0 }} animate={inView ? { opacity: op } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.01 }}
            />
          )
        })}

        {/* All nodes */}
        {NODES.map((n, i) => {
          if (n.id === 'mental-wellbeing') return null  // rendered separately
          const { fill } = CAT[n.cat]
          const lines = n.label.split('\n')
          const labelY = n.cy + n.r + 8
          const lh = 8
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.2 + i * 0.008, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={fill} />
              {lines.map((l, li) => (
                <text key={li} x={n.cx} y={labelY + li * lh}
                  textAnchor="middle" dominantBaseline="hanging"
                  fontSize={6.5} fill={DIAG.ink} fontFamily={FM}>
                  {l}
                </text>
              ))}
            </motion.g>
          )
        })}

        {/* Highlighted node — Mental Well Being */}
        {(() => {
          const n = getNode('mental-wellbeing')
          return (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={DIAG.yellow}
                filter="url(#glowMW)" />
              <text x={n.cx} y={n.cy - 7} textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill={DIAG.ink} fontFamily={FM} fontWeight="700">Mental</text>
              <text x={n.cx} y={n.cy + 7} textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill={DIAG.ink} fontFamily={FM} fontWeight="700">Well Being</text>
            </motion.g>
          )
        })()}

        {/* Legend panel */}
        <g transform="translate(1130, 680)">
          <rect width={240} height={220} rx={8} fill="white"
            stroke={DIAG.border} strokeWidth={1} />
          <text x={12} y={18} fontSize={7} fontFamily={FM} fontWeight="500"
            fill={DIAG.ink} letterSpacing="1">LEGEND</text>
          {Object.entries(CAT).map(([cat, { fill }], i) => (
            <g key={cat} transform={`translate(12, ${30 + i * 20})`}>
              <circle r={5} cx={5} cy={4} fill={fill} />
              <text x={16} y={8} fontSize={7.5} fontFamily={FM} fill={DIAG.mid}
                textTransform="capitalize">{cat}</text>
            </g>
          ))}
          {/* Line types */}
          <line x1={12} y1={210} x2={40} y2={210} stroke={DIAG.mid} strokeWidth={1.5} />
          <text x={46} y={214} fontSize={7} fontFamily={FM} fill={DIAG.muted}>strong</text>
          <line x1={100} y1={210} x2={128} y2={210} stroke={DIAG.mid} strokeWidth={0.8} strokeDasharray="3 3" />
          <text x={134} y={214} fontSize={7} fontFamily={FM} fill={DIAG.muted}>indirect</text>
          <line x1={170} y1={210} x2={198} y2={210} stroke={DIAG.pink} strokeWidth={1.6} />
          <text x={204} y={214} fontSize={7} fontFamily={FM} fill={DIAG.muted}>key</text>
        </g>
      </svg>

      <p style={{
        fontFamily: FM, fontSize: '0.55rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: DIAG.muted,
        textAlign: 'center', marginTop: '1rem', marginBottom: 0,
      }}>
        System Map II — Diverging on student motivation factors. Built to identify leverage points for design intervention.
      </p>
    </div>
  )
}
