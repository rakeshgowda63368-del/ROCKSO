import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

export default function OurStoryPage({ onBack, onExploreShop }) {
  const founderPhoto = `${import.meta.env.BASE_URL}founder.jpg`

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="story-page-container">
      {/* ── Breadcrumb & Back Bar ── */}
      <nav className="story-breadcrumb-bar" aria-label="Breadcrumb">
        <button className="story-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> BACK TO STORE
        </button>
        <div className="story-breadcrumb">
          <span onClick={onBack} className="crumb-link">HOME</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">OUR STORY & FOUNDER</span>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <header className="story-hero-header">
        <span className="story-eyebrow">
          <Sparkles size={13} /> ROCKSO™ ORIGIN & VISION
        </span>
        <h1 className="story-main-title">
          DEFINE YOUR OWN.
        </h1>
        <p className="story-hero-sub">
          The story behind the brand, the ethos of raw street culture, and the vision of founder <strong>Rakesh Gowda H N</strong>.
        </p>
      </header>

      {/* ── Founder Profile & Story Grid ── */}
      <div className="story-content-grid">
        {/* LEFT COLUMN: Founder Portrait Card */}
        <div className="founder-card-col">
          <div className="founder-portrait-card">
            <div className="founder-image-wrap">
              <img
                src={founderPhoto}
                alt="Rakesh Gowda H N — Founder of ROCKSO™"
                className="founder-portrait-img"
              />
              <span className="founder-pill-badge">FOUNDER & VISIONARY</span>
            </div>

            <div className="founder-meta-box">
              <h2 className="founder-name">Rakesh Gowda H N</h2>
              <p className="founder-role">Founder & Creative Director, ROCKSO™</p>
              <div className="founder-tags">
                <span>HASSAN · KARNATAKA</span>
                <span>EST. 2026</span>
              </div>
            </div>
          </div>

          <div className="founder-quote-banner">
            <p>
              "I created this brand mainly for those who design their own path, reject ordinary rules, and wear their individuality with pride."
            </p>
            <strong>— Rakesh Gowda H N</strong>
          </div>
        </div>

        {/* RIGHT COLUMN: The Story & Manifesto */}
        <div className="story-details-col">
          <div className="story-article">
            <span className="article-tag">FROM THE FOUNDER</span>
            <h2 className="article-heading">
              BUILT FOR THOSE WHO DESIGN THEIR OWN.
            </h2>

            <div className="story-paragraphs">
              <p className="story-lead">
                Streetwear isn't just about what you put on in the morning — it's about the conviction and attitude you carry into every room.
              </p>

              <p>
                When I founded <strong>ROCKSO™</strong>, I saw an entire market saturated with copy-paste graphics, uninspired silhouettes, and fast-fashion brands that tell you who to be. Nobody was designing for the originals — the thinkers, the creators, and the restless spirits who make their own rules.
              </p>

              <p>
                I created ROCKSO with a clear mission: <em>to build an uncompromising streetwear label mainly for those who design their own identity.</em> For the individuals who would rather stand out on their own terms than comfortably blend in with the crowd.
              </p>
            </div>

            {/* Signature & CTA */}
            <div className="story-signature-block">
              <div className="signature-content">
                <span className="signature-handwritten">Rakesh Gowda H N</span>
                <span className="signature-sub">Founder, ROCKSO™ Streetwear</span>
              </div>

              <div className="story-actions">
                <button
                  type="button"
                  className="btn btn-black"
                  onClick={onExploreShop || onBack}
                >
                  EXPLORE THE COLLECTION <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost-dark"
                  onClick={onBack}
                >
                  BACK TO HOME
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
