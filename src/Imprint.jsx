import { ProgressBar, Nav, Footer, MaskReveal, Reveal } from './shared.jsx'

const rows = [
  {
    label: 'Imprint / Legal Disclosure',
    content: (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-[0.3rem]">
          <p className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-ink/30 mb-1">Website Owner</p>
          <p className="font-sans text-ink/70 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
            Zeus Zechariah Batkhar<br />
            Designer &amp; Creative Technologist
          </p>
        </div>
        <div className="flex flex-col gap-[0.3rem]">
          <p className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-ink/30 mb-1">Address</p>
          <p className="font-sans text-ink/70 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
            Peenya, Bangalore<br />
            Karnataka – 560022 India
          </p>
        </div>
        <div className="flex flex-col gap-[0.3rem]">
          <p className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-ink/30 mb-1">Contact</p>
          <p className="font-sans text-ink/70 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
            Email: zeusbatkhar.2000@gmail.com<br />
            Phone: +91 87299 86319<br />
            Portfolio Website
          </p>
        </div>
        <p className="font-sans text-ink/45 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
          This website is a personal portfolio showcasing selected academic and professional work.<br />
          All projects displayed are for informational and demonstrative purposes only.
        </p>
      </div>
    ),
  },
  {
    label: 'Disclaimer',
    content: (
      <p className="font-sans text-ink/55 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
        The content of this website has been created with utmost care. However, I do not guarantee
        the accuracy, completeness, or timeliness of the information provided.<br /><br />
        I am not responsible for the content of external links. Responsibility for linked pages
        lies solely with their respective operators.
      </p>
    ),
  },
  {
    label: 'Copyright Notice',
    content: (
      <div className="flex flex-col gap-4">
        <p className="font-sans text-ink/55 leading-[1.85]" style={{ fontSize:'0.875rem' }}>
          All content on this website, including but not limited to text, images, graphics, and
          projects, is protected by copyright unless otherwise stated. Unauthorized use,
          reproduction, or distribution of any material from this website without explicit
          permission is prohibited.
        </p>
        <p className="font-mono text-[0.7rem] tracking-[0.06em] text-ink/30">
          © 2026 Zeus Batkhar. All rights reserved.
        </p>
      </div>
    ),
  },
]

export default function Imprint() {
  return (
    <div style={{ background:'#000000' }} className="text-ink overflow-x-hidden">
      <ProgressBar />
      <Nav />

      <main className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">

        {/* Page title */}
        <div className="pt-[clamp(10rem,18vw,14rem)] pb-[clamp(4rem,8vw,7rem)]">
          <h1 className="font-sans font-semibold text-ink tracking-[0.22em] uppercase leading-[0.92]"
              style={{ fontSize:'clamp(2.25rem,5vw,4rem)' }}>
            <MaskReveal>Imprint</MaskReveal>
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
