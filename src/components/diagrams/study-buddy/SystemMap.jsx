import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const C = {
  salmon: '#F28B82', green: '#6CC97F', blue: '#74B9FF',
  teal:   '#45C6B3', purple: '#C2B5ED', lime: '#BDDA57',
  yellow: '#F5D547', ink: '#1A1A2E',
}
const FM = "'Syne', sans-serif"
const EASE = [0.22, 1, 0.36, 1]
const R = 24

function curvePath(a, b) {
  const mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2
  const dx = b.cx - a.cx, dy = b.cy - a.cy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const bend = Math.min(len * 0.15, 28)
  return `M ${a.cx} ${a.cy} Q ${mx - dy / len * bend} ${my + dx / len * bend} ${b.cx} ${b.cy}`
}

function NL({ lines, x, y, fill, fs }) {
  const lh = fs * 1.25
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
  // ── Top row ───────────────────────────────────────────────────────
  { id: 'interdisciplinary',   label: 'Interdisci-\nplinary\nLearning',              cx: 73,  cy: 49,  fill: C.teal   },
  { id: 'voc-learning',        label: 'Vocational\nLearning',                         cx: 206, cy: 54,  fill: C.green  },
  { id: 'biases',              label: 'Biases in\ntextbooks',                         cx: 325, cy: 65,  fill: C.salmon },
  { id: 'updated-curr',        label: 'Updated\nCurriculum',                          cx: 457, cy: 58,  fill: C.green  },
  { id: 'multi-entry',         label: 'Multi\nentry/exit',                            cx: 597, cy: 74,  fill: C.green  },
  { id: 'open-branch',         label: 'Open Branch\nCampuses',                        cx: 713, cy: 52,  fill: C.green  },
  { id: 'universities-abroad', label: 'Universities\nAbroad',                         cx: 822, cy: 52,  fill: C.green  },

  // ── Upper cluster ──────────────────────────────────────────────────
  { id: 'rural-urban',         label: 'Rural/Urban\nDivide',                          cx: 73,  cy: 151, fill: C.salmon },
  { id: 'acad-pressure',       label: 'Academic\nPressure',                           cx: 189, cy: 133, fill: C.salmon },
  { id: 'upholding-rights',    label: 'Upholding\nStudent Rights',                    cx: 305, cy: 164, fill: C.salmon },
  { id: 'teachers-online',     label: 'Teachers &\nonline learning',                  cx: 527, cy: 136, fill: C.green  },
  { id: 'tailored-learn',      label: 'Tailored\nlearning',                           cx: 620, cy: 192, fill: C.salmon },
  { id: 'know-access',         label: 'Knowledge\nAccessibility',                     cx: 720, cy: 209, fill: C.salmon },

  // ── Center-top ────────────────────────────────────────────────────
  { id: 'higher-tech',         label: 'Higher tech\nusage',                           cx: 133, cy: 211, fill: C.blue   },
  { id: 'anxiety',             label: 'Anxiety &\nburnout',                           cx: 244, cy: 222, fill: C.purple },
  { id: 'online-notes',        label: 'Online\nnote taking',                          cx: 340, cy: 189, fill: C.blue   },
  { id: 'note-taking',         label: 'Note taking',                                  cx: 438, cy: 220, fill: C.green  },
  { id: 'online-peer',         label: 'Online peer\nlearning',                        cx: 534, cy: 197, fill: C.teal   },

  // ── Center ────────────────────────────────────────────────────────
  { id: 'interest-learn',      label: 'Interest in\nlearning',                        cx: 86,  cy: 303, fill: C.blue   },
  { id: 'achievable-goals',    label: 'Achievable\ngoals',                            cx: 197, cy: 326, fill: C.lime   },
  { id: 'student-sat',         label: 'Student\nSatisfaction',                        cx: 353, cy: 295, fill: C.salmon },
  { id: 'distraction',         label: 'Distraction\nfrom learning',                   cx: 323, cy: 377, fill: C.lime   },
  { id: 'lower-attn',          label: 'Lower\nattention',                             cx: 452, cy: 354, fill: C.lime   },
  { id: 'good-exam',           label: 'Good Exam\nscores',                            cx: 585, cy: 297, fill: C.salmon },
  { id: 'understand',          label: 'Understanding\nconcept',                       cx: 673, cy: 337, fill: C.teal   },
  { id: 'screen-time',         label: 'Screen Time',                                  cx: 747, cy: 326, fill: C.salmon },
  { id: 'creativity',          label: 'Creativity',                                   cx: 808, cy: 293, fill: C.green  },

  // ── Center-low ────────────────────────────────────────────────────
  { id: 'priority-feedback',   label: 'Prioritising\nfeedback',                       cx: 110, cy: 370, fill: C.lime   },
  { id: 'eff-self-study',      label: 'Effective\nself study',                        cx: 103, cy: 431, fill: C.green  },
  { id: 'interest-acad',       label: 'Interest in\nAcademics',                       cx: 299, cy: 443, fill: C.yellow },
  { id: 'awareness-curr',      label: 'Awareness:\nold curriculum',                   cx: 393, cy: 452, fill: C.purple },
  { id: 'info-overload',       label: 'Information\noverload',                        cx: 492, cy: 465, fill: C.purple },
  { id: 'social-media',        label: 'Social media\nusage',                          cx: 582, cy: 470, fill: C.blue   },
  { id: 'sat-demands',         label: 'Satisfies\ndemands',                           cx: 671, cy: 445, fill: C.teal   },
  { id: 'lecture-based',       label: 'Lecture\nlearning',                            cx: 628, cy: 401, fill: C.green  },
  { id: 'better-labs',         label: 'Better\nLabs',                                 cx: 728, cy: 401, fill: C.green  },
  { id: 'practical-learn',     label: 'Practical\nlearning',                          cx: 820, cy: 410, fill: C.green  },

  // ── Left side ─────────────────────────────────────────────────────
  { id: 'lack-collab',         label: 'Lack of\nCollaboration',                       cx: 78,  cy: 476, fill: C.purple },
  { id: 'eff-learning',        label: 'Effective\nlearning',                          cx: 85,  cy: 536, fill: C.green  },
  { id: 'studygram',           label: 'Studygram\nculture',                           cx: 224, cy: 483, fill: C.blue   },
  { id: 'adopt-regional',      label: 'Adopt regional\nlanguages',                    cx: 145, cy: 514, fill: C.salmon },
  { id: 'english-univ',        label: 'Universality\nof English',                     cx: 270, cy: 524, fill: C.salmon },
  { id: 'dual-degrees',        label: 'Dual Degrees',                                 cx: 140, cy: 580, fill: C.salmon },

  // ── Center-low-right ──────────────────────────────────────────────
  { id: 'pm-internship',       label: 'PM Internship\nScheme',                        cx: 400, cy: 532, fill: C.purple },
  { id: 'innovation',          label: 'Innovation',                                   cx: 525, cy: 538, fill: C.teal   },
  { id: 'startup',             label: 'Startup\nculture',                             cx: 598, cy: 558, fill: C.purple },
  { id: 'policy',              label: 'Policy\nMaking',                               cx: 452, cy: 571, fill: C.purple },
  { id: 'indian-market',       label: 'Indian\nStudent Market',                       cx: 326, cy: 595, fill: C.green  },

  // ── Right outcomes ────────────────────────────────────────────────
  { id: 'internships',         label: 'Internships',                                  cx: 708, cy: 485, fill: C.green  },
  { id: 'knowledge',           label: 'Knowledge',                                    cx: 820, cy: 527, fill: C.yellow },
  { id: 'problem-solving',     label: 'Problem\nsolving',                             cx: 631, cy: 568, fill: C.green  },
  { id: 'workforce',           label: 'Workforce',                                    cx: 731, cy: 577, fill: C.salmon },
  { id: 'industry-invest',     label: 'Industry\ninvestment',                         cx: 806, cy: 636, fill: C.salmon },
  { id: 'identifying-talent',  label: 'Identifying\ntalent',                          cx: 728, cy: 638, fill: C.yellow },
  { id: 'soft-skills',         label: 'Soft skills',                                  cx: 625, cy: 649, fill: C.yellow },

  // ── Lower — tech / employment ─────────────────────────────────────
  { id: 'disrupted-edu',       label: 'Disrupted\nedu. services',                     cx: 156, cy: 565, fill: C.salmon },
  { id: 'whatsapp',            label: 'WhatsApp\nlearning',                           cx: 103, cy: 618, fill: C.blue   },
  { id: 'youtube',             label: 'YouTube\nlearning',                            cx: 227, cy: 604, fill: C.blue   },
  { id: 'generative-ai',       label: 'Generative\nAI',                              cx: 129, cy: 672, fill: C.blue   },
  { id: 'robot-teachers',      label: 'Robot\nTeachers',                              cx: 432, cy: 643, fill: C.green  },
  { id: 'ai-education',        label: 'AI in Indian\nEducation',                      cx: 505, cy: 702, fill: C.green  },
  { id: 'edtech',              label: 'EdTech\nplatforms',                            cx: 270, cy: 674, fill: C.blue   },
  { id: 'updating-teachers',   label: 'Updating\nteachers',                           cx: 167, cy: 728, fill: C.green  },
  { id: 'employment',          label: 'Employment\nrate',                             cx: 293, cy: 737, fill: C.salmon },
  { id: 'unemployment',        label: 'Unemployment',                                 cx: 426, cy: 741, fill: C.purple },
  { id: 'nation-gdp',          label: "Nation's\nGDP",                                cx: 549, cy: 644, fill: C.salmon },
  { id: 'job-cuts',            label: 'Job Cuts',                                     cx: 549, cy: 703, fill: C.salmon },
  { id: 'employable-skills',   label: 'Employable\nskills',                           cx: 370, cy: 788, fill: C.green  },
  { id: 'skill-dev',           label: 'Skill\ndevelopment',                           cx: 191, cy: 788, fill: C.lime   },
  { id: 'skill-india',         label: 'Skill India\nMission',                         cx: 107, cy: 771, fill: C.purple },
  { id: 'domestic-fin',        label: 'Domestic\nfin. challenges',                    cx: 78,  cy: 723, fill: C.purple },
]

const EDGES = [
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
  { a: 'upholding-rights',   b: 'policy' },
  { a: 'rural-urban',        b: 'acad-pressure' },
  { a: 'acad-pressure',      b: 'anxiety' },
  { a: 'acad-pressure',      b: 'student-sat', d: true },
  { a: 'anxiety',            b: 'distraction' },
  { a: 'screen-time',        b: 'distraction' },
  { a: 'screen-time',        b: 'lower-attn' },
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
  { a: 'distraction',        b: 'social-media' },
  { a: 'distraction',        b: 'studygram' },
  { a: 'distraction',        b: 'lower-attn' },
  { a: 'info-overload',      b: 'distraction' },
  { a: 'info-overload',      b: 'lower-attn' },
  { a: 'social-media',       b: 'info-overload' },
  { a: 'lack-collab',        b: 'distraction', d: true },
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
    <div ref={ref}>
      <svg viewBox="-5 30 880 810" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="smArr" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
            <polygon points="0 0, 5 2.5, 0 5" fill="rgba(0,0,0,0.28)" />
          </marker>
        </defs>

        {EDGES.map((e, i) => {
          const a = getNode(e.a), b = getNode(e.b)
          if (!a || !b) return null
          return (
            <motion.path key={i}
              d={curvePath(a, b)} fill="none"
              stroke="rgba(0,0,0,0.20)" strokeWidth={0.9}
              strokeDasharray={e.d ? '3 3' : undefined}
              markerEnd="url(#smArr)"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.005 }}
            />
          )
        })}

        {NODES.map((n, i) => {
          const lines = n.label.split('\n')
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.28, delay: 0.18 + i * 0.006, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={R} fill={n.fill} />
              <NL lines={lines} x={n.cx} y={n.cy} fill={C.ink} fs={7} />
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
