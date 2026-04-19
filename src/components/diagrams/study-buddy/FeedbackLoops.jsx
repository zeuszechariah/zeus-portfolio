import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DIAG = {
  pink: '#FE60AC', blue: '#4A5DE2', green: '#A6CA00',
  surface: '#EAECF2', white: '#FFFFFF',
  ink: '#0B1A2E', mid: '#3E5270', muted: '#7A8A9E',
  border: 'rgba(0,0,0,0.10)',
}
const FM = "'Space Mono', monospace"
const EASE = [0.22, 1, 0.36, 1]

// Rounded rect nodes — cx/cy = centre, w/h = dimensions
const NODES = [
  { id: 1, cx: 400, cy: 90,  w: 180, h: 60, lines: ['Motivation &', 'Self Confidence'] },
  { id: 2, cx: 652, cy: 235, w: 180, h: 60, lines: ['More Risk-Taking &', 'Skill Development'] },
  { id: 3, cx: 578, cy: 405, w: 175, h: 60, lines: ['Bigger Successes', '& Recognition'] },
  { id: 4, cx: 222, cy: 405, w: 175, h: 60, lines: ['Higher Motivation', '& Learning'] },
  { id: 5, cx: 96,  cy: 235, w: 155, h: 60, lines: ['Early Small', 'Successes'] },
]

// Neat curved arrows flowing around the outside of the pentagon
// Control points are placed OUTSIDE the pentagon for clean arcs
const ARROWS = [
  {
    // 1 → 2: top to top-right, arc curving up-right
    path: 'M 490,90 Q 625,22 652,205',
    label: 'ENCOURAGES', lx: 614, ly: 34,
  },
  {
    // 2 → 3: top-right to bottom-right, arc curving right
    path: 'M 652,265 Q 764,338 653,405',
    label: 'LEADS TO', lx: 756, ly: 322,
  },
  {
    // 3 → 4: bottom-right to bottom-left, arc curving below
    path: 'M 490,405 Q 400,480 309,405',
    label: 'REINFORCES', lx: 400, ly: 485,
  },
  {
    // 4 → 5: bottom-left to left, arc curving left
    path: 'M 145,405 Q 16,334 96,265',
    label: 'EFFECT', lx: 18, ly: 322,
  },
  {
    // 5 → 1: left to top, arc curving up-left
    path: 'M 96,205 Q 152,18 310,90',
    label: 'INCREASE', lx: 160, ly: 22,
  },
]

const TAG_ROWS = [
  ['Motivation', 'Interest in learning', 'Time management', 'Risk taking', 'Industry exposure', 'Problem solving'],
  ['Perception of success', 'Fear of failure', 'Career Planning', 'Creativity', 'Connected learning', 'Social isolation'],
  ['Aptitude Test', 'Better career options', 'Recognition', 'Social isolation', 'Skill Development', 'Risk Mitigation'],
  ['Reskilling and upskilling', 'FOMO', 'Career readiness', 'Circumstances', 'Lifelong learning', 'competency-based assessments'],
  ['Parental pressure', 'Competition', 'Soft skills', 'community learning centers', 'Attendance'],
]
const HIGHLIGHTED = new Set(['Interest in learning', 'Lifelong learning'])

export default function FeedbackLoops() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12,
      padding: 32, boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      {/* Causal loop SVG */}
      <svg viewBox="-20 -30 820 560" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="arrFb" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={DIAG.mid} />
          </marker>
        </defs>

        {/* Arrows */}
        {ARROWS.map((a, i) => (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: 0.8 + i * 0.12 }}>
            <path d={a.path} fill="none" stroke={DIAG.mid} strokeWidth={2.2}
              markerEnd="url(#arrFb)" />
            <text x={a.lx} y={a.ly} textAnchor="middle" fontSize={9} fill={DIAG.muted}
              fontFamily={FM} letterSpacing="1.2">{a.label}</text>
          </motion.g>
        ))}

        {/* Nodes */}
        {NODES.map((n, i) => {
          const x = n.cx - n.w / 2
          const y = n.cy - n.h / 2
          const lh = 16
          const totalH = (n.lines.length - 1) * lh
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: EASE }}>
              <rect x={x} y={y} width={n.w} height={n.h} rx={10}
                fill={DIAG.surface} stroke={DIAG.border} strokeWidth={1.2} />
              {n.lines.map((line, li) => (
                <text key={li} x={n.cx} y={n.cy - totalH / 2 + li * lh}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fill={DIAG.ink} fontFamily={FM} fontWeight="500">
                  {line}
                </text>
              ))}
            </motion.g>
          )
        })}

        {/* Centre loop label */}
        <text x={380} y={252} textAnchor="middle" fontSize={9} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="2">MOTIVATION REINFORCING LOOP</text>
      </svg>

      {/* Concept tags grid */}
      <div style={{ marginTop: '2rem', borderTop: `1px solid ${DIAG.border}`, paddingTop: '1.5rem' }}>
        <p style={{
          fontFamily: FM, fontSize: '0.58rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: DIAG.muted, marginBottom: '1rem',
        }}>Related Concepts</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {TAG_ROWS.flat().map((tag, i) => {
            const hl = HIGHLIGHTED.has(tag)
            return (
              <span key={`${tag}-${i}`} style={{
                display: 'inline-block',
                padding: '5px 13px',
                borderRadius: '99px',
                fontFamily: FM,
                fontSize: '0.6rem',
                letterSpacing: '0.04em',
                background: hl ? DIAG.pink : DIAG.surface,
                color: hl ? '#fff' : DIAG.ink,
                border: hl ? 'none' : `1px solid ${DIAG.border}`,
                fontWeight: hl ? '600' : '400',
              }}>
                {tag}
              </span>
            )
          })}
        </div>
      </div>

      <p style={{
        fontFamily: FM, fontSize: '0.55rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: DIAG.muted,
        textAlign: 'center', marginTop: '1.5rem', marginBottom: 0,
      }}>
        Feedback Loops — Reinforcing motivation cycle and related systemic concepts
      </p>
    </div>
  )
}
