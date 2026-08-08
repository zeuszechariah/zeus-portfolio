import { useEffect } from 'react'
import { Nav, Footer, ProgressBar, Reveal, BackToTop } from './shared.jsx'

const PAGE    = '#F5F0E8'
const SURFACE = '#EDE7DA'
const INK     = '#3A1628'
const MID     = '#8C5462'
const MUTED   = '#A08878'
const BORDER  = 'rgba(58,22,40,0.09)'

// Full-width docs bookend the gallery.
// All other images: side-by-side pairs, same height via aspect-ratio + object-fit cover.
const ROWS = [
  { full: true,  items: [{ src: '/staple-doc-social.jpg', alt: 'Social media documentation grid' }] },
  { full: false, items: [
    { src: '/staple-poster.jpg', alt: 'Staple — Comfort Need brand poster' },
    { src: '/staple-logo.jpg',   alt: 'Staple logo lockup with brand mark' },
  ]},
  { full: false, items: [
    { src: '/staple-spice.jpg',        alt: 'Spice illustration and STAPLE. wordmark' },
    { src: '/staple-menu-context.jpg', alt: 'Large Plates menu in context' },
  ]},
  { full: false, items: [
    { src: '/staple-social.jpg',  alt: 'Staple social media content suite' },
    { src: '/staple-special.jpg', alt: "Today's Special — digital post design" },
  ]},
  { full: false, items: [
    { src: '/staple-containers.jpg', alt: 'Staple branded takeaway containers' },
    { src: '/staple-chef.jpg',       alt: 'Chef in Staple branded uniform with sliders' },
  ]},
  { full: false, items: [
    { src: '/staple-food.jpg',     alt: 'Staple table setting with branded coasters' },
    { src: '/staple-signage.jpg',  alt: 'Staple brand signage in the restaurant' },
  ]},
  { full: true,  items: [{ src: '/staple-doc-menu.jpg', alt: 'Menu documentation spread' }] },
]

function Wrap({ children }) {
  return (
    <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
      {children}
    </div>
  )
}

function SectionTag({ children }) {
  return (
    <span style={{
      display: 'inline-block', fontFamily: "'Space Mono', monospace",
      fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
      color: MUTED, border: `1px solid ${BORDER}`,
      padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem',
    }}>{children}</span>
  )
}

export default function Staple() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Staple — Zeus Z B'
  }, [])

  return (
    <div style={{ background: PAGE, color: INK, minHeight: '100vh' }}>
      <ProgressBar />
      <Nav light photoHero />

      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        backgroundImage: 'url(/staple-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 50%',
        paddingTop: 'clamp(7rem,12vw,11rem)',
        paddingBottom: 'clamp(5rem,8vw,8rem)',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(12,4,8,0.94) 0%, rgba(25,8,16,0.84) 50%, rgba(12,4,8,0.56) 100%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
          <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem' }}>
            Brand Identity · Menu Design · Typesetting · Visual Development
          </span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(2.8rem,6vw,5rem)', lineHeight: 1.0, color: '#FFFFFF', margin: '0 0 1.5rem', letterSpacing: '-0.03em' }}>
            Staple
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.9rem,1.8vw,1.05rem)', lineHeight: 1.78, color: 'rgba(255,255,255,0.68)', maxWidth: '46ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            A full brand identity for a neighbourhood Indian fusion cafe — from logo and typesetting to menus, uniforms, and social media collateral.
          </p>

          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { l: 'Timeline',      v: '4 Weeks' },
              { l: 'Collaborators', v: 'Charmaine S. · Vimarsh B.' },
              { l: 'My Role',       v: 'Menu Design · Typesetting · Visual Dev' },
              { l: 'Output',        v: 'Brand Identity + Collateral' },
            ].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.36)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#FFFFFF', margin: 0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Glancethrough label ── */}
      <div style={{ background: PAGE, borderBottom: `1px solid ${BORDER}` }}>
        <Wrap>
          <p style={{ margin: 0, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', padding: '0.7rem 0' }}>
            approx. 2 min glancethrough
          </p>
        </Wrap>
      </div>

      {/* ── Brief ── */}
      <section style={{ background: SURFACE, padding: 'clamp(4rem,6vw,6rem) 0' }}>
        <Wrap>
          <Reveal>
            <div style={{ maxWidth: 640 }}>
              <SectionTag>The Brief</SectionTag>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: INK, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 1.25rem', textWrap: 'balance' }}>
                Where comfort meets culinary delight.
              </h2>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: MID, lineHeight: 1.78, margin: 0, textWrap: 'pretty' }}>
                Staple is a neighbourhood Indian fusion cafe built on a simple idea: elevate traditional ingredients with a unique twist. The brand needed a visual identity that felt as warm and familiar as the food — so we built one from scratch, covering the logo, menu design, typographic system, staff uniforms, packaging, and social media collateral.
              </p>
            </div>
          </Reveal>
        </Wrap>
      </section>

      {/* ── Gallery ── */}
      <section style={{ background: PAGE, padding: 'clamp(4rem,6vw,6rem) 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 clamp(1.5rem,5vw,3rem)', maxWidth: '1120px', margin: '0 auto' }}>
          {ROWS.map((row, ri) =>
            row.full ? (
              <Reveal key={row.items[0].src} delay={ri * 0.04}>
                <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(58,22,40,0.07)' }}>
                  <img src={row.items[0].src} alt={row.items[0].alt} style={{ width: '100%', display: 'block' }} loading="lazy" />
                </div>
              </Reveal>
            ) : (
              <div key={row.items[0].src} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {row.items.map((img, ii) => (
                  <Reveal key={img.src} delay={ri * 0.04 + ii * 0.06}>
                    <div style={{ borderRadius: '18px', overflow: 'hidden', aspectRatio: '4/5', boxShadow: '0 4px 24px rgba(58,22,40,0.07)' }}>
                      <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} loading="lazy" />
                    </div>
                  </Reveal>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      <BackToTop />
      <Footer />
    </div>
  )
}
