import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const C = {
  salmon: '#F28B82', green: '#6CC97F', blue: '#74B9FF',
  teal:   '#45C6B3', purple: '#9B84D4', lime: '#BDDA57',
  yellow: '#F5D547', ink: '#1A1A2E', muted: '#7A8A9E',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]

function curvePath(a, b) {
  const mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2
  const dx = b.cx - a.cx, dy = b.cy - a.cy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const bend = Math.min(len * 0.15, 32)
  return `M ${a.cx} ${a.cy} Q ${mx - dy / len * bend} ${my + dx / len * bend} ${b.cx} ${b.cy}`
}

function NL({ lines, x, y, fill, fs }) {
  const lh = fs * 1.28
  const totalH = (lines.length - 1) * lh
  return (
    <text textAnchor="middle" fontSize={fs} fill={fill} fontFamily={FM} fontWeight="400">
      {lines.map((l, i) => (
        <tspan key={i} x={x} y={y - totalH / 2 + i * lh} dominantBaseline="middle">{l}</tspan>
      ))}
    </text>
  )
}

const NODES = [
  // ── Top row — policy / structure ──────────────────────────────────
  { id: 'interdisciplinary',   label: 'Interdisciplinary\nLearning',               cx: 110,  cy: 75,   r: 22, fill: C.teal   },
  { id: 'voc-learning',        label: 'Introduced\nVocational Learning',            cx: 310,  cy: 82,   r: 22, fill: C.green  },
  { id: 'biases',              label: 'Biases in\ntextbooks',                       cx: 490,  cy: 98,   r: 26, fill: C.salmon },
  { id: 'updated-curr',        label: 'Updated\nCurriculum',                        cx: 690,  cy: 88,   r: 32, fill: C.green  },
  { id: 'multi-entry',         label: 'Multiple entry &\nexit options',             cx: 900,  cy: 112,  r: 20, fill: C.green  },
  { id: 'open-branch',         label: 'Open branch\ncampuses in India',             cx: 1075, cy: 78,   r: 20, fill: C.green  },
  { id: 'universities-abroad', label: 'Universities\nAbroad',                       cx: 1240, cy: 78,   r: 20, fill: C.green  },

  // ── Upper cluster — rights, pressure, quality ─────────────────────
  { id: 'rural-urban',         label: 'Rural/Urban\nDivide',                        cx: 110,  cy: 228,  r: 24, fill: C.salmon },
  { id: 'acad-pressure',       label: 'Academic\nPressure',                         cx: 285,  cy: 200,  r: 32, fill: C.salmon },
  { id: 'upholding-rights',    label: 'Upholding\nStudent Rights',                  cx: 460,  cy: 248,  r: 36, fill: C.salmon },
  { id: 'teachers-online',     label: 'Teachers supporting\nonline learning',       cx: 795,  cy: 205,  r: 22, fill: C.green  },
  { id: 'tailored-learn',      label: 'Tailored &\npersonalised learning',          cx: 935,  cy: 290,  r: 22, fill: C.salmon },
  { id: 'know-access',         label: 'Knowledge\nAccessibility',                   cx: 1085, cy: 315,  r: 32, fill: C.salmon },

  // ── Center-top ────────────────────────────────────────────────────
  { id: 'higher-tech',         label: 'Higher usage\nof technology',                cx: 200,  cy: 318,  r: 24, fill: C.blue   },
  { id: 'anxiety',             label: 'Anxiety &\nburnout',                         cx: 368,  cy: 335,  r: 24, fill: C.purple },
  { id: 'online-notes',        label: 'Online\nnote taking',                        cx: 513,  cy: 285,  r: 26, fill: C.blue   },
  { id: 'note-taking',         label: 'Note taking',                                cx: 660,  cy: 332,  r: 22, fill: C.green  },
  { id: 'online-peer',         label: 'Online peer\nlearning',                      cx: 805,  cy: 298,  r: 24, fill: C.teal   },

  // ── Center ────────────────────────────────────────────────────────
  { id: 'interest-learn',      label: 'Interest in\nlearning',                      cx: 130,  cy: 458,  r: 22, fill: C.blue   },
  { id: 'achievable-goals',    label: 'Achievable &\nrealistic goals',              cx: 298,  cy: 492,  r: 22, fill: C.lime   },
  { id: 'student-sat',         label: 'Student\nSatisfaction',                      cx: 532,  cy: 445,  r: 34, fill: C.salmon },
  { id: 'distraction',         label: 'Distraction\nfrom learning',                 cx: 488,  cy: 568,  r: 34, fill: C.lime   },
  { id: 'lower-attn',          label: 'Lower\nattention spans',                     cx: 682,  cy: 535,  r: 20, fill: C.lime   },
  { id: 'good-exam',           label: 'Good Exam\nscores',                          cx: 882,  cy: 448,  r: 22, fill: C.salmon },
  { id: 'understand',          label: 'Understanding\nof concept',                  cx: 1015, cy: 508,  r: 22, fill: C.teal   },
  { id: 'screen-time',         label: 'Screen Time',                                cx: 1125, cy: 492,  r: 22, fill: C.salmon },
  { id: 'creativity',          label: 'Creativity',                                 cx: 1218, cy: 442,  r: 20, fill: C.green  },

  // ── Center-low ────────────────────────────────────────────────────
  { id: 'priority-feedback',   label: 'Prioritizing\nstudent feedback',             cx: 165,  cy: 558,  r: 18, fill: C.lime   },
  { id: 'eff-self-study',      label: 'Effective\nself study',                      cx: 155,  cy: 650,  r: 22, fill: C.green  },
  { id: 'interest-acad',       label: 'Interest in\nAcademics',                     cx: 452,  cy: 668,  r: 20, fill: C.yellow },
  { id: 'awareness-curr',      label: 'Awareness of\noutdated curriculum',          cx: 592,  cy: 682,  r: 22, fill: C.purple },
  { id: 'info-overload',       label: 'Information\noverload',                      cx: 742,  cy: 702,  r: 22, fill: C.purple },
  { id: 'social-media',        label: 'Social media\nusage',                        cx: 878,  cy: 708,  r: 22, fill: C.blue   },
  { id: 'sat-demands',         label: 'Satisfies personal\n& societal\ndemands',    cx: 1012, cy: 672,  r: 32, fill: C.teal   },
  { id: 'lecture-based',       label: 'Lecture based\nlearning',                    cx: 948,  cy: 605,  r: 22, fill: C.green  },
  { id: 'better-labs',         label: 'Better\nLabs',                               cx: 1098, cy: 605,  r: 30, fill: C.green  },
  { id: 'practical-learn',     label: 'Practical\nlearning',                        cx: 1235, cy: 618,  r: 22, fill: C.green  },

  // ── Left side ─────────────────────────────────────────────────────
  { id: 'lack-collab',         label: 'Lack of\nCollaborative mindset',             cx: 118,  cy: 718,  r: 20, fill: C.purple },
  { id: 'eff-learning',        label: 'Effective\nlearning',                        cx: 128,  cy: 808,  r: 22, fill: C.green  },
  { id: 'studygram',           label: 'Studygram\nculture',                          cx: 338,  cy: 728,  r: 22, fill: C.blue   },
  { id: 'adopt-regional',      label: 'Adoption of\nregional languages',            cx: 218,  cy: 775,  r: 22, fill: C.salmon },
  { id: 'english-univ',        label: 'Universality of\nEnglish language',          cx: 408,  cy: 792,  r: 22, fill: C.salmon },
  { id: 'dual-degrees',        label: 'Dual Degrees\nSimultaneously',               cx: 212,  cy: 875,  r: 20, fill: C.salmon },

  // ── Center-low-right ──────────────────────────────────────────────
  { id: 'pm-internship',       label: 'PM Internship\nScheme',                      cx: 602,  cy: 802,  r: 20, fill: C.purple },
  { id: 'innovation',          label: 'Innovation',                                 cx: 792,  cy: 812,  r: 22, fill: C.teal   },
  { id: 'startup',             label: 'Startup\nculture',                            cx: 902,  cy: 842,  r: 22, fill: C.purple },
  { id: 'policy',              label: 'Policy\nMaking',                              cx: 682,  cy: 862,  r: 22, fill: C.purple },
  { id: 'indian-market',       label: 'Indian\nStudent Market',                      cx: 492,  cy: 898,  r: 18, fill: C.green  },

  // ── Right — outcomes ──────────────────────────────────────────────
  { id: 'internships',         label: 'Internships',                                cx: 1068, cy: 732,  r: 30, fill: C.green  },
  { id: 'knowledge',           label: 'Knowledge',                                  cx: 1235, cy: 795,  r: 30, fill: C.yellow },
  { id: 'problem-solving',     label: 'Problem\nsolving',                            cx: 952,  cy: 858,  r: 22, fill: C.green  },
  { id: 'workforce',           label: 'Workforce',                                  cx: 1102, cy: 872,  r: 22, fill: C.salmon },
  { id: 'industry-invest',     label: 'Industry investment\nin education',          cx: 1215, cy: 958,  r: 22, fill: C.salmon },
  { id: 'identifying-talent',  label: 'Identifying\ntalent',                        cx: 1098, cy: 962,  r: 22, fill: C.yellow },
  { id: 'soft-skills',         label: 'Soft skills',                                cx: 942,  cy: 978,  r: 22, fill: C.yellow },

  // ── Lower — tech / employment ─────────────────────────────────────
  { id: 'disrupted-edu',       label: 'Disrupted educational\nservices',            cx: 235,  cy: 852,  r: 22, fill: C.salmon },
  { id: 'whatsapp',            label: 'WhatsApp\nlearning',                          cx: 155,  cy: 932,  r: 20, fill: C.blue   },
  { id: 'youtube',             label: 'Youtube\nlearning',                           cx: 342,  cy: 912,  r: 22, fill: C.blue   },
  { id: 'generative-ai',       label: 'Generative\nAI',                             cx: 195,  cy: 1015, r: 32, fill: C.blue   },
  { id: 'robot-teachers',      label: 'Introducing\nRobot Teachers',                cx: 652,  cy: 968,  r: 22, fill: C.green  },
  { id: 'ai-education',        label: 'AI in Indian\nEducation',                    cx: 762,  cy: 1058, r: 20, fill: C.green  },
  { id: 'edtech',              label: 'EdTech\nplatforms',                           cx: 408,  cy: 1018, r: 22, fill: C.blue   },
  { id: 'updating-teachers',   label: 'Updating\nteacher\'s training',              cx: 252,  cy: 1098, r: 18, fill: C.green  },
  { id: 'employment',          label: 'Employment\nrate',                            cx: 442,  cy: 1112, r: 22, fill: C.salmon },
  { id: 'unemployment',        label: 'Unemployment',                               cx: 642,  cy: 1118, r: 22, fill: C.purple },
  { id: 'nation-gdp',          label: "Nation's GDP",                                cx: 828,  cy: 972,  r: 22, fill: C.salmon },
  { id: 'job-cuts',            label: 'Job Cuts',                                    cx: 828,  cy: 1062, r: 22, fill: C.salmon },
  { id: 'employable-skills',   label: 'Employable\nskills',                          cx: 558,  cy: 1188, r: 22, fill: C.green  },
  { id: 'skill-dev',           label: 'Skill\ndevelopment',                          cx: 288,  cy: 1188, r: 22, fill: C.lime   },
  { id: 'skill-india',         label: 'Skill India\nMission',                        cx: 162,  cy: 1162, r: 18, fill: C.purple },
  { id: 'domestic-fin',        label: 'Domestic financial\nchallenges',              cx: 118,  cy: 1092, r: 20, fill: C.purple },
]

const EDGES = [
  // Structure / curriculum
  { a: 'updated-curr',       b: 'student-sat' },
  { a: 'updated-curr',       b: 'know-access' },
  { a: 'updated-curr',       b: 'good-exam' },
  { a: 'biases',             b: 'acad-pressure' },
  { a: 'biases',             b: 'upholding-rights', d: true },
  { a: 'policy',             b: 'updated-curr' },
  { a: 'awareness-curr',     b: 'policy' },
  { a: 'multi-entry',        b: 'updated-curr' },
  { a: 'voc-learning',       b: 'employable-skills' },
  { a: 'voc-learning',       b: 'employment' },
  { a: 'interdisciplinary',  b: 'updated-curr', d: true },

  // Rights / pressure
  { a: 'upholding-rights',   b: 'policy' },
  { a: 'rural-urban',        b: 'acad-pressure' },
  { a: 'acad-pressure',      b: 'anxiety' },
  { a: 'acad-pressure',      b: 'student-sat', d: true },
  { a: 'anxiety',            b: 'distraction' },
  { a: 'screen-time',        b: 'distraction' },
  { a: 'screen-time',        b: 'lower-attn' },

  // Online learning cluster
  { a: 'higher-tech',        b: 'online-notes' },
  { a: 'higher-tech',        b: 'distraction' },
  { a: 'online-notes',       b: 'online-peer' },
  { a: 'online-notes',       b: 'student-sat' },
  { a: 'online-peer',        b: 'know-access' },
  { a: 'online-peer',        b: 'student-sat' },
  { a: 'note-taking',        b: 'student-sat' },
  { a: 'teachers-online',    b: 'online-peer' },
  { a: 'teachers-online',    b: 'tailored-learn' },
  { a: 'tailored-learn',     b: 'student-sat' },
  { a: 'updating-teachers',  b: 'teachers-online' },

  // Student satisfaction hub
  { a: 'know-access',        b: 'student-sat' },
  { a: 'know-access',        b: 'eff-learning' },
  { a: 'student-sat',        b: 'good-exam' },
  { a: 'student-sat',        b: 'understand' },
  { a: 'student-sat',        b: 'eff-learning' },
  { a: 'sat-demands',        b: 'student-sat' },
  { a: 'interest-learn',     b: 'student-sat' },
  { a: 'achievable-goals',   b: 'student-sat' },
  { a: 'interest-acad',      b: 'student-sat' },
  { a: 'eff-self-study',     b: 'student-sat' },
  { a: 'eff-self-study',     b: 'eff-learning' },
  { a: 'priority-feedback',  b: 'student-sat', d: true },

  // Distraction cluster
  { a: 'distraction',        b: 'social-media' },
  { a: 'distraction',        b: 'studygram' },
  { a: 'distraction',        b: 'lower-attn' },
  { a: 'info-overload',      b: 'distraction' },
  { a: 'info-overload',      b: 'lower-attn' },
  { a: 'social-media',       b: 'info-overload' },
  { a: 'lack-collab',        b: 'distraction', d: true },

  // Practical / outcome cluster
  { a: 'better-labs',        b: 'practical-learn' },
  { a: 'better-labs',        b: 'good-exam' },
  { a: 'practical-learn',    b: 'knowledge' },
  { a: 'lecture-based',      b: 'know-access' },
  { a: 'internships',        b: 'employable-skills' },
  { a: 'internships',        b: 'employment' },
  { a: 'pm-internship',      b: 'internships' },
  { a: 'knowledge',          b: 'problem-solving' },
  { a: 'knowledge',          b: 'workforce' },
  { a: 'problem-solving',    b: 'identifying-talent' },
  { a: 'soft-skills',        b: 'workforce' },
  { a: 'soft-skills',        b: 'employment' },
  { a: 'creativity',         b: 'innovation' },
  { a: 'creativity',         b: 'problem-solving' },

  // Employment / economy
  { a: 'industry-invest',    b: 'better-labs' },
  { a: 'industry-invest',    b: 'internships' },
  { a: 'innovation',         b: 'startup' },
  { a: 'innovation',         b: 'policy', d: true },
  { a: 'startup',            b: 'employment' },
  { a: 'employment',         b: 'nation-gdp' },
  { a: 'unemployment',       b: 'nation-gdp' },
  { a: 'nation-gdp',         b: 'job-cuts' },
  { a: 'job-cuts',           b: 'domestic-fin' },
  { a: 'employable-skills',  b: 'workforce' },
  { a: 'skill-dev',          b: 'employable-skills' },
  { a: 'skill-india',        b: 'skill-dev' },

  // Tech / AI cluster
  { a: 'generative-ai',      b: 'edtech' },
  { a: 'generative-ai',      b: 'robot-teachers' },
  { a: 'generative-ai',      b: 'ai-education' },
  { a: 'generative-ai',      b: 'youtube' },
  { a: 'edtech',             b: 'online-peer' },
  { a: 'youtube',            b: 'online-peer' },
  { a: 'whatsapp',           b: 'online-peer' },
  { a: 'robot-teachers',     b: 'edtech' },
  { a: 'ai-education',       b: 'edtech', d: true },
  { a: 'disrupted-edu',      b: 'edtech', d: true },

  // International
  { a: 'universities-abroad',b: 'english-univ', d: true },
  { a: 'open-branch',        b: 'english-univ', d: true },
  { a: 'english-univ',       b: 'student-sat', d: true },
  { a: 'dual-degrees',       b: 'indian-market', d: true },
  { a: 'adopt-regional',     b: 'policy', d: true },
]

function getNode(id) { return NODES.find(n => n.id === id) }

export default function SystemMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.04 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12,
      padding: '20px 6px 16px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="-10 48 1380 1180" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="smArr" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
            <polygon points="0 0, 5 2.5, 0 5" fill="rgba(0,0,0,0.28)" />
          </marker>
        </defs>

        {/* Edges */}
        {EDGES.map((e, i) => {
          const a = getNode(e.a), b = getNode(e.b)
          if (!a || !b) return null
          return (
            <motion.path key={i}
              d={curvePath(a, b)} fill="none"
              stroke="rgba(0,0,0,0.22)" strokeWidth={0.9}
              strokeDasharray={e.d ? '3 3' : undefined}
              markerEnd="url(#smArr)"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.005 }}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map((n, i) => {
          const lines = n.label.split('\n')
          const fs = n.r >= 30 ? 8.5 : n.r >= 22 ? 7.5 : 6.5
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.28, delay: 0.18 + i * 0.006, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} />
              <NL lines={lines} x={n.cx} y={n.cy} fill={C.ink} fs={fs} />
            </motion.g>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px 20px',
        justifyContent: 'center', marginTop: '1.25rem',
        paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.07)',
      }}>
        {[
          { c: C.salmon, l: 'Structural pressures' },
          { c: C.green,  l: 'Positive outcomes' },
          { c: C.blue,   l: 'Digital / technology' },
          { c: C.teal,   l: 'Learning quality' },
          { c: C.purple, l: 'Systemic barriers' },
          { c: C.lime,   l: 'Leverage points' },
          { c: C.yellow, l: 'Key outcomes' },
        ].map(({ c, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0 }} />
            <span style={{ fontFamily: FM, fontSize: '0.6rem', letterSpacing: '0.04em', color: C.muted }}>{l}</span>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: FM, fontSize: '0.52rem', letterSpacing: '0.15em', textTransform: 'uppercase',
        color: C.muted, textAlign: 'center', marginTop: '0.75rem', marginBottom: 0,
      }}>
        System Map I — Connecting the dots across India's formal education ecosystem
      </p>
    </div>
  )
}
