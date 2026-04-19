import { ProgressBar, Nav, Footer, MaskReveal, Reveal } from './shared.jsx'

const rows = [
  {
    label: 'Disclaimer',
    content: (
      <p className="font-sans text-ink/55 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
        The information provided on this website is for general informational purposes only.
        While efforts are made to keep the content accurate and up to date, no guarantees are
        made regarding completeness or reliability.
      </p>
    ),
  },
  {
    label: 'External Links',
    content: (
      <p className="font-sans text-ink/55 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
        This website may contain links to external websites. I am not responsible for the
        content or reliability of any external sites linked from this website.
      </p>
    ),
  },
  {
    label: 'Intellectual Property',
    content: (
      <p className="font-sans text-ink/55 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
        All content on this website, including text, visuals, and design work, is the
        intellectual property of the site owner unless otherwise stated. Unauthorized use,
        reproduction, or distribution is not permitted.
      </p>
    ),
  },
]

export default function PrivacyPolicy() {
  return (
    <div style={{ background:'#000000' }} className="text-ink overflow-x-hidden">
      <ProgressBar />
      <Nav />

      <main className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">

        {/* Page title */}
        <div className="pt-[clamp(10rem,18vw,14rem)] pb-[clamp(4rem,8vw,7rem)]">
          <h1 className="font-sans font-semibold text-ink tracking-[0.22em] uppercase leading-[0.92]"
              style={{ fontSize:'clamp(2.25rem,5vw,4rem)' }}>
            <MaskReveal>Privacy Policy</MaskReveal>
          </h1>
        </div>

        {/* Rows */}
        {rows.map(({ label, content }) => (
          <div key={label} className="border-t border-white/[0.06] py-[clamp(3.5rem,7vw,6rem)]">
            <div className="grid grid-cols-12 gap-x-8 gap-y-8">
              <div className="col-span-12 md:col-span-4">
                <Reveal>
                  <p className="font-sans text-ink/40 leading-[1.6]"
                     style={{ fontSize:'clamp(0.75rem,0.9vw,0.8125rem)' }}>
                    {label}
                  </p>
                </Reveal>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-6">
                <Reveal delay={0.08}>{content}</Reveal>
              </div>
            </div>
          </div>
        ))}

        <div className="pb-[clamp(4rem,8vw,7rem)]" />
      </main>

      <Footer />
    </div>
  )
}
