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
  const bend = Math.min(len * 0.16, 38)
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

// Yellow annotation rectangles (like FigJam sticky notes)
const RECTS = [
  {
    id: 'rect-recognition',
    lines: ['Recognition', 'improves', 'motivation'],
    cx: 1085, cy: 328, w: 148, h: 78, fill: C.yellow,
  },
  {
    id: 'rect-digital',
    lines: ['Digital tools provide', 'accessibility &', 'flexibility but causes', 'info overload & fatigue'],
    cx: 688, cy: 858, w: 164, h: 88, fill: C.yellow,
  },
]

const NODES = [
  // ── Left — learning quality ───────────────────────────────────────
  { id: 'peer-support',       label: 'Peer Support &\nGroup Learning',            cx: 100,  cy: 185, r: 24, fill: C.green  },
  { id: 'accountability',     label: 'Accountability\nand motivation',             cx: 248,  cy: 98,  r: 22, fill: C.green  },
  { id: 'journaling',         label: 'Journaling',                                 cx: 100,  cy: 292, r: 22, fill: C.green  },
  { id: 'learning-mistakes',  label: 'Learning\nfrom Mistakes',                   cx: 245,  cy: 312, r: 22, fill: C.green  },
  { id: 'creativity-orig',    label: 'Creativity\nand originality',               cx: 248,  cy: 422, r: 22, fill: C.green  },
  { id: 'experimental',       label: 'Experimental\nlearning',                    cx: 188,  cy: 528, r: 22, fill: C.green  },
  { id: 'interest-learning',  label: 'Interest\nin learning',                     cx: 332,  cy: 515, r: 28, fill: C.green  },

  // ── Centre-left — motivation bridge ──────────────────────────────
  { id: 'mot-specific-skills',label: 'Motivation for\nspecific skills',           cx: 438,  cy: 295, r: 28, fill: C.green  },
  { id: 'cultural-values',    label: 'Cultural &\nSocietal Values',               cx: 438,  cy: 448, r: 26, fill: C.salmon },
  { id: 'financial-incentives',label:'Financial\nIncentives',                     cx: 608,  cy: 102, r: 24, fill: C.green  },
  { id: 'career-aspirations', label: 'Career Aspirations\n& Job Market Trends',  cx: 758,  cy: 172, r: 22, fill: C.purple },
  { id: 'effective-learning', label: 'Effective\nlearning',                       cx: 592,  cy: 475, r: 24, fill: C.green  },
  { id: 'practical-learning', label: 'Practical\nlearning',                       cx: 735,  cy: 508, r: 24, fill: C.green  },
  { id: 'motivation-learn',   label: 'Motivation\nto Learn',                      cx: 585,  cy: 248, r: 28, fill: C.green  },
  { id: 'identify-aptitude',  label: 'Identifying\nAptitude / Interests',        cx: 695,  cy: 62,  r: 22, fill: C.teal   },

  // ── Right — structural / teacher ─────────────────────────────────
  { id: 'teacher-attitude',   label: "Teacher's Attitude\n& Support",             cx: 928,  cy: 208, r: 32, fill: C.green  },
  { id: 'confidence',         label: 'Confidence',                                cx: 842,  cy: 355, r: 24, fill: C.green  },
  { id: 'early-successes',    label: 'Early small\nsuccesses',                    cx: 965,  cy: 360, r: 22, fill: C.green  },
  { id: 'better-infra',       label: 'Better\nInfrastructure',                    cx: 842,  cy: 492, r: 22, fill: C.green  },
  { id: 'bigger-successes',   label: 'Bigger Successes\n& Recognition',          cx: 1048, cy: 492, r: 22, fill: C.salmon },
  { id: 'parental-expect',    label: 'Parental\nExpectations',                    cx: 1168, cy: 388, r: 22, fill: C.green  },
  { id: 'overemphasis-grades',label: 'Overemphasis\non Grades',                  cx: 1215, cy: 205, r: 22, fill: C.purple },
  { id: 'mindful-practices',  label: 'Introduce Mindful\nPractices in school',   cx: 1068, cy: 585, r: 22, fill: C.green  },
  { id: 'student-sat',        label: 'Student\nsatisfaction',                     cx: 992,  cy: 638, r: 22, fill: C.salmon },
  { id: 'career-readiness',   label: 'Career Aspiration\n& Job Readiness',       cx: 858,  cy: 605, r: 28, fill: C.green  },

  // ── Bottom — digital / distraction ───────────────────────────────
  { id: 'generative-ai',      label: 'Generative\nAI',                            cx: 118,  cy: 742, r: 28, fill: C.blue   },
  { id: 'studygram',          label: 'Studygram\nculture',                         cx: 290,  cy: 742, r: 24, fill: C.blue   },
  { id: 'distraction-learn',  label: 'Distraction\nfrom learning',                cx: 110,  cy: 862, r: 22, fill: C.green  },
  { id: 'digital-fatigue',    label: 'Digital Learning\nFatigue',                 cx: 278,  cy: 862, r: 24, fill: C.green  },
  { id: 'access-info',        label: 'Access to\ninformation',                    cx: 432,  cy: 818, r: 24, fill: C.purple },
  { id: 'info-overload',      label: 'Information\noverload',                     cx: 592,  cy: 818, r: 24, fill: C.blue   },
  { id: 'social-media',       label: 'Social media\nusage',                       cx: 762,  cy: 778, r: 28, fill: C.blue   },
  { id: 'phone-addiction',    label: 'Phone\naddiction',                          cx: 432,  cy: 942, r: 22, fill: C.purple },
  { id: 'unhealthy-comp',     label: 'Unhealthy\ncompetition',                    cx: 592,  cy: 942, r: 22, fill: C.purple },
  { id: 'social-isolation',   label: 'Social\nisolation',                         cx: 738,  cy: 902, r: 24, fill: C.purple },
  { id: 'lower-attn',         label: 'Lower\nattention spans',                    cx: 878,  cy: 882, r: 20, fill: C.green  },
  { id: 'false-perception',   label: 'False Perception\nof success',              cx: 968,  cy: 792, r: 20, fill: C.green  },
]

const EDGES = [
  // Learning quality chain
  { a: 'peer-support',        b: 'accountability' },
  { a: 'accountability',      b: 'mot-specific-skills' },
  { a: 'journaling',          b: 'learning-mistakes' },
  { a: 'learning-mistakes',   b: 'mot-specific-skills', d: true },
  { a: 'creativity-orig',     b: 'experimental' },
  { a: 'experimental',        b: 'interest-learning' },
  { a: 'interest-learning',   b: 'mot-specific-skills' },
  { a: 'peer-support',        b: 'journaling' },

  // Motivation bridge
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

  // Teacher / confidence / success chain
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

  // Digital / distraction cluster
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

  // Cross connections
  { a: 'overemphasis-grades', b: 'social-isolation', d: true },
  { a: 'false-perception',    b: 'student-sat', d: true },
  { a: 'career-readiness',    b: 'financial-incentives', d: true },
  { a: 'better-infra',        b: 'teacher-attitude', d: true },
]

function getNode(id) {
  const rect = RECTS.find(r => r.id === id)
  if (rect) return { cx: rect.cx, cy: rect.cy }
  return NODES.find(n => n.id === id)
}

export default function SystemMapII() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.04 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12,
      padding: '20px 6px 16px', boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      <svg viewBox="-10 28 1380 960" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="sm2Arr" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto">
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
              markerEnd="url(#sm2Arr)"
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.05 + i * 0.006 }}
            />
          )
        })}

        {/* Circle nodes */}
        {NODES.map((n, i) => {
          const lines = n.label.split('\n')
          const fs = n.r >= 28 ? 8 : n.r >= 22 ? 7.5 : 6.5
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.28, delay: 0.2 + i * 0.007, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} />
              <NL lines={lines} x={n.cx} y={n.cy} fill={C.ink} fs={fs} />
            </motion.g>
          )
        })}

        {/* Yellow annotation rectangles */}
        {RECTS.map((r, i) => {
          const lines = r.lines
          const lh = 8.5
          const totalH = (lines.length - 1) * lh
          return (
            <motion.g key={r.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.6 + i * 0.12, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <rect
                x={r.cx - r.w / 2} y={r.cy - r.h / 2}
                width={r.w} height={r.h} rx={6}
                fill={r.fill} stroke="rgba(0,0,0,0.12)" strokeWidth={1}
              />
              <text textAnchor="middle" fontSize={7} fontFamily={FM} fill={C.ink} fontWeight="500">
                {lines.map((l, li) => (
                  <tspan key={li} x={r.cx} y={r.cy - totalH / 2 + li * lh} dominantBaseline="middle">{l}</tspan>
                ))}
              </text>
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
          { c: C.green,  l: 'Positive / learning' },
          { c: C.salmon, l: 'Outcome / pressure' },
          { c: C.purple, l: 'Barriers' },
          { c: C.blue,   l: 'Digital / tech' },
          { c: C.teal,   l: 'Interest / aptitude' },
          { c: C.yellow, l: 'Key insight (annotation)' },
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
        System Map II — Diverging on student motivation to identify leverage points for design intervention
      </p>
    </div>
  )
}
