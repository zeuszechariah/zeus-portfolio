import { useEffect } from 'react'
import { Nav, Footer, ProgressBar, Reveal, BackToTop } from './shared.jsx'

const PAGE   = '#F9F7F2'
const SURFACE= '#F0EDE5'
const INK    = '#1A1600'
const MID    = '#5A4E20'
const MUTED  = '#9A8E58'
const BORDER = 'rgba(0,0,0,0.08)'

const IMAGES = [
  { src: '/dokitti-1.jpg', alt: 'Dokitti brand mascot and product collateral' },
  { src: '/dokitti-2.jpg', alt: 'Dokitti social media content' },
  { src: '/dokitti-4.jpg', alt: 'Dokitti billboard — Dashing Dokitti Martin' },
  { src: '/dokitti-5.jpg', alt: 'Dokitti mascot illustration and pet bowls campaign' },
  { src: '/dokitti-6.jpg', alt: 'Dokitti brand campaign — Drumroll dog' },
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

export default function Dokitti() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Dokitti — Zeus Z B'
  }, [])

  return (
    <div style={{ background: PAGE, color: INK, minHeight: '100vh' }}>
      <ProgressBar />
      <Nav light />

      {/* Hero */}
      <div style={{
        position: 'relative',
        backgroundImage: 'url(/dokitti-hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        paddingTop: 'clamp(7rem,12vw,11rem)',
        paddingBottom: 'clamp(5rem,8vw,8rem)',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,8,2,0.92) 0%, rgba(18,14,4,0.80) 50%, rgba(10,8,2,0.50) 100%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,3rem)' }}>
          <span style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: '99px', marginBottom: '1.25rem' }}>
            Brand Identity · Mascot Design · Collateral
          </span>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 'clamp(2.8rem,6vw,5rem)', lineHeight: 1.0, color: '#FFFFFF', margin: '0 0 1.5rem', letterSpacing: '-0.03em' }}>
            Dokitti
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(0.9rem,1.8vw,1.05rem)', lineHeight: 1.78, color: 'rgba(255,255,255,0.68)', maxWidth: '46ch', margin: '0 0 3rem', textWrap: 'pretty' }}>
            A personality-led brand identity for a pet care company, built around a mascot, a distinct visual language, and collateral that feels as warm as the animals it celebrates.
          </p>

          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[
              { l: 'Timeline',      v: '2 Months' },
              { l: 'Collaborators', v: 'Charmaine Sah' },
              { l: 'Tools',         v: 'Illustrator · Photoshop · Procreate' },
              { l: 'Output',        v: 'Brand Identity and Collateral' },
            ].map(m => (
              <div key={m.l}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.36)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{m.l}</p>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: '#FFFFFF', margin: 0 }}>{m.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glancethrough label */}
      <div style={{ background: PAGE, borderBottom: `1px solid ${BORDER}` }}>
        <Wrap>
          <p style={{ margin: 0, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', padding: '0.7rem 0' }}>
            approx. 2 min glancethrough
          </p>
        </Wrap>
      </div>

      {/* Intro */}
      <section style={{ background: SURFACE, padding: 'clamp(4rem,6vw,6rem) 0' }}>
        <Wrap>
          <Reveal>
            <div style={{ maxWidth: 640 }}>
              <SectionTag>The Brief</SectionTag>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: INK, letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 1.25rem', textWrap: 'balance' }}>
                A brand that speaks pet.
              </h2>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', color: MID, lineHeight: 1.78, margin: 0, textWrap: 'pretty' }}>
                Dokitti needed more than a logo. It needed a personality. We built a visual identity from the ground up: mascot, typography system, colour palette, and a suite of collateral that works across digital and print. The brand is playful without being childish, warm without being generic.
              </p>
            </div>
          </Reveal>
        </Wrap>
      </section>

      {/* Gallery */}
      <section style={{ background: PAGE, padding: 'clamp(4rem,6vw,6rem) 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 clamp(1.5rem,5vw,3rem)', maxWidth: '1120px', margin: '0 auto' }}>
          {IMAGES.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.06}>
              <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <img src={img.src} alt={img.alt} loading="lazy" decoding="async" style={{ width: '100%', display: 'block' }} />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <BackToTop />
      <Footer />
    </div>
  )
}
