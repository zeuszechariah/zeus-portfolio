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
  { id: 1, cx: 400, cy: 80,  w: 150, h: 50, lines: ['Motivation &', 'Self Confidence'] },
  { id: 2, cx: 650, cy: 220, w: 162, h: 50, lines: ['More Risk-Taking &', 'Skill Development'] },
  { id: 3, cx: 580, cy: 390, w: 150, h: 50, lines: ['Bigger Successes', '& Recognition'] },
  { id: 4, cx: 220, cy: 390, w: 150, h: 50, lines: ['Higher Motivation', '& Learning'] },
  { id: 5, cx: 95,  cy: 220, w: 132, h: 50, lines: ['Early Small', 'Successes'] },
]

// Curved arrows: M start Q control end, plus label text + position
const ARROWS = [
  {
    path: 'M 475,80 Q 565,95 569,220',
    label: 'ENCOURAGES', lx: 540, ly: 118,
  },
  {
    path: 'M 650,245 Q 668,322 580,365',
    label: 'LEADS TO', lx: 644, ly: 308,
  },
  {
    path: 'M 505,390 Q 400,445 295,390',
    label: 'REINFORCES', lx: 400, ly: 435,
  },
  {
    path: 'M 145,390 Q 82,348 95,245',
    label: 'EFFECT', lx: 58, ly: 338,
  },
  {
    path: 'M 95,195 Q 205,44 325,80',
    label: 'INCREASE', lx: 196, ly: 76,
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
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} style={{
      background: '#fff', borderRadius: 12, overflow: 'hidden',
      padding: 32, boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
    }}>
      {/* Causal loop SVG */}
      <svg viewBox="0 0 780 470" width="100%" style={{ overflow: 'visible' }}>
        <defs>
          <marker id="arrFb" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill={DIAG.mid} />
          </marker>
        </defs>

        {/* Arrows */}
        {ARROWS.map((a, i) => (
          <motion.g key={i}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}>
            <path d={a.path} fill="none" stroke={DIAG.mid} strokeWidth={1.4}
              markerEnd="url(#arrFb)" />
            <text x={a.lx} y={a.ly} textAnchor="middle" fontSize={8} fill={DIAG.muted}
              fontFamily={FM} letterSpacing="1">{a.label}</text>
          </motion.g>
        ))}

        {/* Nodes */}
        {NODES.map((n, i) => {
          const x = n.cx - n.w / 2
          const y = n.cy - n.h / 2
          const lh = 14
          const totalH = (n.lines.length - 1) * lh
          return (
            <motion.g key={n.id}
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: EASE }}>
              <rect x={x} y={y} width={n.w} height={n.h} rx={8}
                fill={DIAG.surface} stroke={DIAG.border} strokeWidth={1} />
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
        <text x={380} y={235} textAnchor="middle" fontSize={7.5} fill={DIAG.muted}
          fontFamily={FM} letterSpacing="1.5">MOTIVATION REINFORCING LOOP</text>
      </svg>

      {/* Concept tags grid */}
      <div style={{ marginTop: '2rem', borderTop: `1px solid ${DIAG.border}`, paddingTop: '1.5rem' }}>
        <p style={{
          fontFamily: FM, fontSize: '0.55rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: DIAG.muted, marginBottom: '1rem',
        }}>Related Concepts</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {TAG_ROWS.flat().map((tag, i) => {
            const hl = HIGHLIGHTED.has(tag)
            return (
              <span key={`${tag}-${i}`} style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '99px',
                fontFamily: FM,
                fontSize: '0.52rem',
                letterSpacing: '0.04em',
                background: hl ? DIAG.pink : DIAG.surface,
                color: hl ? '#fff' : DIAG.ink,
                border: hl ? 'none' : `1px solid ${DIAG.border}`,
                fontWeight: hl ? '500' : '400',
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
