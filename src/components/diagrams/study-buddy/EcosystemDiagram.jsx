import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

const CSS = `
  .eco-wrap svg { display: block; width: 100%; height: auto; }

  /* Hide all groups initially — CSS beats SVG presentation attributes */
  .eco-wrap #eco-dashed { opacity: 0; }
  .eco-wrap #eco-solid  { opacity: 0; }
  .eco-wrap #eco-nodes  { opacity: 0; }
  .eco-wrap #eco-labels { opacity: 0; }

  /* Staggered entrance: connectors → nodes → labels */
  .eco-wrap.eco-in #eco-dashed {
    animation: ecoDashed 1.0s 0.10s cubic-bezier(0.22,1,0.36,1) both;
  }
  .eco-wrap.eco-in #eco-solid {
    animation: ecoSolid  1.0s 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  .eco-wrap.eco-in #eco-nodes {
    animation: ecoNodes  1.1s 0.95s cubic-bezier(0.22,1,0.36,1) both;
  }
  .eco-wrap.eco-in #eco-labels {
    animation: ecoLabels 0.8s 1.55s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes ecoDashed {
    from { opacity: 0; }
    to   { opacity: 0.55; }
  }
  @keyframes ecoSolid {
    from { opacity: 0; }
    to   { opacity: 0.65; }
  }
  @keyframes ecoNodes {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ecoLabels {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`

export default function EcosystemDiagram() {
  const wrapRef = useRef(null)
  const inView  = useInView(wrapRef, { once: true, amount: 0.1 })
  const [html, setHtml] = useState('')

  useEffect(() => {
    fetch('/sb-ecosystem.svg').then(r => r.text()).then(setHtml)
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <div
        ref={wrapRef}
        className={`eco-wrap${inView && html ? ' eco-in' : ''}`}
        style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
