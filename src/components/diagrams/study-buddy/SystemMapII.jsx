import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const C = {
  salmon: '#F28B82', green: '#6CC97F', blue: '#74B9FF',
  teal:   '#45C6B3', purple: '#9B84D4', lime: '#BDDA57',
  yellow: '#F5D547', ink: '#1A1A2E',
}
const FM = "'Syne', sans-serif"
const EASE = [0.22, 1, 0.36, 1]
const R = 24

function curvePath(a, b) {
  const mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2
  const dx = b.cx - a.cx, dy = b.cy - a.cy
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const bend = Math.min(len * 0.16, 32)
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
  // ── Left — learning quality ───────────────────────────────────────
  { id: 'peer-support',        label: 'Peer Support\n& Group Learning',              cx: 78,  cy: 144, fill: C.green  },
  { id: 'accountability',      label: 'Accountability\n& motivation',                cx: 193, cy: 76,  fill: C.green  },
  { id: 'journaling',          label: 'Journaling',                                   cx: 78,  cy: 228, fill: C.green  },
  { id: 'learning-mistakes',   label: 'Learning from\nMistakes',                     cx: 191, cy: 243, fill: C.green  },
  { id: 'creativity-orig',     label: 'Creativity\n& originality',                   cx: 193, cy: 329, fill: C.green  },
  { id: 'experimental',        label: 'Experimental\nlearning',                      cx: 147, cy: 412, fill: C.green  },
  { id: 'interest-learning',   label: 'Interest\nin learning',                       cx: 259, cy: 402, fill: C.green  },

  // ── Centre-left — motivation bridge ──────────────────────────────
  { id: 'mot-specific-skills', label: 'Motivation for\nspecific skills',             cx: 342, cy: 230, fill: C.green  },
  { id: 'cultural-values',     label: 'Cultural &\nSocietal Values',                 cx: 342, cy: 349, fill: C.salmon },
  { id: 'financial-incentives',label: 'Financial\nIncentives',                       cx: 474, cy: 80,  fill: C.green  },
  { id: 'career-aspirations',  label: 'Career\nAspirations',                         cx: 591, cy: 134, fill: C.purple },
  { id: 'effective-learning',  label: 'Effective\nlearning',                         cx: 462, cy: 371, fill: C.green  },
  { id: 'practical-learning',  label: 'Practical\nlearning',                         cx: 573, cy: 396, fill: C.green  },
  { id: 'motivation-learn',    label: 'Motivation\nto Learn',                        cx: 456, cy: 193, fill: C.green  },
  { id: 'identify-aptitude',   label: 'Identifying\nAptitude',                       cx: 542, cy: 48,  fill: C.teal   },

  // ── Right — structural / teacher ─────────────────────────────────
  { id: 'teacher-attitude',    label: "Teacher's\nAttitude & Support",               cx: 724, cy: 162, fill: C.green  },
  { id: 'confidence',          label: 'Confidence',                                   cx: 657, cy: 277, fill: C.green  },
  { id: 'early-successes',     label: 'Early small\nsuccesses',                      cx: 753, cy: 281, fill: C.green  },
  { id: 'better-infra',        label: 'Better\nInfrastructure',                      cx: 657, cy: 384, fill: C.green  },
  { id: 'bigger-successes',    label: 'Bigger Successes\n& Recognition',             cx: 817, cy: 384, fill: C.salmon },
  { id: 'parental-expect',     label: 'Parental\nExpectations',                      cx: 911, cy: 303, fill: C.green  },
  { id: 'overemphasis-grades', label: 'Overemphasis\non Grades',                     cx: 948, cy: 160, fill: C.purple },
  { id: 'mindful-practices',   label: 'Mindful\nPractices',                          cx: 833, cy: 456, fill: C.green  },
  { id: 'student-sat',         label: 'Student\nsatisfaction',                       cx: 774, cy: 498, fill: C.salmon },
  { id: 'career-readiness',    label: 'Career\nReadiness',                           cx: 669, cy: 472, fill: C.green  },

  // Recognition node (replaces rect-recognition)
  { id: 'rect-recognition',    label: 'Recognition\nimproves\nmotivation',           cx: 847, cy: 256, fill: C.yellow },

  // ── Bottom — digital / distraction ───────────────────────────────
  { id: 'generative-ai',       label: 'Generative\nAI',                              cx: 92,  cy: 578, fill: C.blue   },
  { id: 'studygram',           label: 'Studygram\nculture',                          cx: 226, cy: 578, fill: C.blue   },
  { id: 'distraction-learn',   label: 'Distraction\nfrom learning',                  cx: 86,  cy: 672, fill: C.green  },
  { id: 'digital-fatigue',     label: 'Digital\nFatigue',                            cx: 217, cy: 672, fill: C.green  },
  { id: 'access-info',         label: 'Access to\ninformation',                      cx: 337, cy: 638, fill: C.purple },
  { id: 'info-overload',       label: 'Information\noverload',                       cx: 462, cy: 638, fill: C.blue   },

  // Digital tools node (replaces rect-digital)
  { id: 'rect-digital',        label: 'Digital tools\naccessibility\n& flexibility', cx: 537, cy: 669, fill: C.yellow },

  { id: 'social-media',        label: 'Social media\nusage',                         cx: 594, cy: 607, fill: C.blue   },
  { id: 'phone-addiction',     label: 'Phone\naddiction',                            cx: 337, cy: 734, fill: C.purple },
  { id: 'unhealthy-comp',      label: 'Unhealthy\ncompetition',                      cx: 462, cy: 734, fill: C.purple },
  { id: 'social-isolation',    label: 'Social\nisolation',                           cx: 576, cy: 703, fill: C.purple },
  { id: 'lower-attn',          label: 'Lower\nattention',                            cx: 685, cy: 688, fill: C.green  },
  { id: 'false-perception',    label: 'False\nPerception',                           cx: 755, cy: 617, fill: C.green  },
]

const EDGES = [
  { a: 'peer-support',        b: 'accountability' },
  { a: 'accountability',      b: 'mot-specific-skills' },
  { a: 'journaling',          b: 'learning-mistakes' },
  { a: 'learning-mistakes',   b: 'mot-specific-skills', d: true },
  { a: 'creativity-orig',     b: 'experimental' },
  { a: 'experimental',        b: 'interest-learning' },
  { a: 'interest-learning',   b: 'mot-specific-skills' },
  { a: 'peer-support',        b: 'journaling' },
  { a: 'mot-specific-skills', b: 'motivation-learn' },
  { a: 'mot-specific-skills', b: 'career-aspirations' },
  { a: 'cultural-values',     b: 'mot-specific-skills' },
  { a: 'financial-incentives',b: 'career-aspirations' },
  { a: 'motivation-learn',    b: 'career-aspirations' },
  { a: 'identify-aptitude',   b: 'career-aspirations' },
  { a: 'identify-aptitude',   b: 'motivation-learn' },
  { a: 'career-aspirations',  b: 'effective-learning' },
  { a: 'practical-learning',  b: 'effective-learning' },
  { a: 'mot-specific-skills', b: 'practical-learning' },
  { a: 'effective-learning',  b: 'student-sat' },
  { a: 'practical-learning',  b: 'career-readiness' },
  { a: 'career-readiness',    b: 'effective-learning' },
  { a: 'teacher-attitude',    b: 'confidence' },
  { a: 'teacher-attitude',    b: 'early-successes' },
  { a: 'confidence',          b: 'early-successes' },
  { a: 'early-successes',     b: 'bigger-successes' },
  { a: 'bigger-successes',    b: 'rect-recognition', d: true },
  { a: 'rect-recognition',    b: 'confidence' },
  { a: 'rect-recognition',    b: 'motivation-learn' },
  { a: 'better-infra',        b: 'effective-learning' },
  { a: 'parental-expect',     b: 'overemphasis-grades' },
  { a: 'overemphasis-grades', b: 'teacher-attitude', d: true },
  { a: 'mindful-practices',   b: 'student-sat' },
  { a: 'student-sat',         b: 'early-successes', d: true },
  { a: 'motivation-learn',    b: 'teacher-attitude', d: true },
  { a: 'generative-ai',       b: 'info-overload' },
  { a: 'generative-ai',       b: 'studygram' },
  { a: 'studygram',           b: 'distraction-learn' },
  { a: 'studygram',           b: 'digital-fatigue' },
  { a: 'social-media',        b: 'info-overload' },
  { a: 'social-media',        b: 'rect-digital', d: true },
  { a: 'access-info',         b: 'info-overload' },
  { a: 'access-info',         b: 'rect-digital', d: true },
  { a: 'info-overload',       b: 'digital-fatigue' },
  { a: 'info-overload',       b: 'lower-attn' },
  { a: 'digital-fatigue',     b: 'distraction-learn' },
  { a: 'phone-addiction',     b: 'social-isolation' },
  { a: 'unhealthy-comp',      b: 'social-isolation' },
  { a: 'social-isolation',    b: 'false-perception' },
  { a: 'social-isolation',    b: 'lower-attn' },
  { a: 'lower-attn',          b: 'distraction-learn', d: true },
  { a: 'distraction-learn',   b: 'digital-fatigue', d: true },
  { a: 'overemphasis-grades', b: 'social-isolation', d: true },
  { a: 'false-perception',    b: 'student-sat', d: true },
  { a: 'career-readiness',    b: 'financial-incentives', d: true },
  { a: 'better-infra',        b: 'teacher-attitude', d: true },
]

function getNode(id) { return NODES.find(n => n.id === id) }

export default function SystemMapII() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.04 })

  return (
    <div ref={ref}>
      <svg viewBox="-5 28 1010 760" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="sm2Arr" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
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
              markerEnd="url(#sm2Arr)"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.006 }}
            />
          )
        })}

        {NODES.map((n, i) => {
          const lines = n.label.split('\n')
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.28, delay: 0.2 + i * 0.007, ease: EASE }}
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
