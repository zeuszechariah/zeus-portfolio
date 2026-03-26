import { ProgressBar, Nav, Footer, MaskReveal, Reveal } from './shared.jsx'

const ITEMS = [
  {
    href: 'https://www.business-standard.com/content/press-releases-ani/india-s-best-design-students-2025-recognising-the-next-generation-of-design-leaders-125081800820_1.html',
    image: '/bs-article.png',
    source: 'Business Standard',
    date: 'Aug 18, 2025',
    title: "India's Best Design Students 2025 — Recognising the Next Generation of Design Leaders",
  },
  {
    href: 'https://ibda.design-india.com/zeus-zechariah-batkhar/',
    image: 'https://ibda.design-india.com/wp-content/uploads/2025/01/IBDA_2025.png',
    source: 'IBDA',
    date: 'Aug 26, 2025',
    title: "India's Best Design Award 2025 — Zeus Zechariah Batkhar",
  },
  {
    href: 'https://www.youtube.com/shorts/67xBPZfg1-k',
    image: 'https://i.ytimg.com/vi/67xBPZfg1-k/hq2.jpg',
    overlayImage: '/ibda-thumbnail.jpeg',
    source: 'YouTube',
    date: '2025',
    title: "Meet Zeus Zechariah Batkhar | Winner of India's Best Design Student Awards 2025",
  },
]

function PressCard({ href, image, overlayImage, source, date, title }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="group/card flex flex-col gap-5">

      {/* Image */}
      <div className="w-full overflow-hidden rounded-xl border border-white/[0.07] relative"
           style={{ aspectRatio:'16/10', background:'#0f0f0f' }}>
        {image && overlayImage ? (
          <>
            <img src={image} alt={title}
                 className="absolute inset-0 w-full h-full object-cover scale-[1.05] blur-[2px] brightness-50 transition-transform duration-700 ease-out group-hover/card:scale-[1.08]" />
            <img src={overlayImage} alt={title}
                 className="absolute inset-0 h-full object-contain object-center mx-auto transition-transform duration-700 ease-out group-hover/card:scale-[1.03]" />
          </>
        ) : image ? (
          <img src={image} alt={title}
               className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.03]" />
        ) : null}
      </div>

      {/* Title */}
      <h2 className="font-sans font-semibold text-ink leading-[1.25] relative"
          style={{ fontSize:'clamp(1rem,1.4vw,1.2rem)' }}>
        <span className="relative inline">
          {title}
          <span className="absolute -bottom-[2px] left-0 h-[1px] w-0 transition-all duration-300 group-hover/card:w-full"
            style={{ background:'rgba(242,237,228,0.5)', transitionTimingFunction:'cubic-bezier(0.16,1,0.3,1)' }} />
        </span>
      </h2>

      {/* Source + date */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.06]">
        <span className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-ink/45 font-semibold">
          {source}
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.08em] text-ink/28">
          {date}
        </span>
      </div>
    </a>
  )
}

export default function Press() {
  return (
    <div style={{ background:'#060606' }} className="text-ink overflow-x-hidden">
      <ProgressBar />
      <Nav />

      <main className="max-w-[1200px] mx-auto px-[clamp(1.5rem,5vw,3.5rem)]">

        {/* Page title */}
        <div className="pt-[clamp(10rem,18vw,14rem)] pb-[clamp(4rem,8vw,7rem)]">
          <h1 className="font-sans font-semibold text-ink tracking-[0.22em] uppercase leading-[0.92]"
              style={{ fontSize:'clamp(2.25rem,5vw,4rem)' }}>
            <MaskReveal>Press</MaskReveal>
          </h1>
        </div>

        {/* Cards grid */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pb-[clamp(6rem,10vw,9rem)]">
            {ITEMS.map(item => (
              <PressCard key={item.href} {...item} />
            ))}
          </div>
        </Reveal>

      </main>

      <Footer />
    </div>
  )
}
