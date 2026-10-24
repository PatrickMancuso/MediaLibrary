
import WelcomeSlideshow from './WelcomeSlideshow'

interface WelcomePageProps {
  onSignIn: () => void
  onGetStarted: () => void
}

function WelcomePage({
  onGetStarted,
}: WelcomePageProps) {
  return (
    <div className="welcome-page welcome-page-compact">
      <main className="welcome-main">

        {/* HERO */}

        <section className="welcome-hero">

          <div className="welcome-hero-content">

            <div className="welcome-brand welcome-hero-brand">
              <span className="welcome-brand-light" />

              <strong>
                MEDIA<span>VAULT</span>
              </strong>
            </div>

            <span className="welcome-eyebrow">
              YOUR PERSONAL MEDIA ARCHIVE
            </span>

            <h1>
              Your collection.
              <br />
              Your way.
            </h1>

            <p>
              Give your movies and games a home.
              Organize your collection, explore
              your favorites, and keep track of
              the media that matters to you.
            </p>

            <div className="welcome-hero-actions">
              <button
                type="button"
                className="welcome-primary-button"
                onClick={onGetStarted}
              >
                Get Started
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="welcome-hero-preview">
            <WelcomeSlideshow />
          </div>

        </section>

        {/* FEATURES */}

        <section className="welcome-features">
          <div>
            <span>01</span>
            <h3>Build Your Archive</h3>
            <p>
              Add movies and games with automatic
              metadata or enter your own details.
            </p>
          </div>

          <div>
            <span>02</span>
            <h3>Explore Your Collection</h3>
            <p>
              Browse your media using artwork,
              categories, search, and filters.
            </p>
          </div>

          <div>
            <span>03</span>
            <h3>Make It Personal</h3>
            <p>
              Save favorites, write reviews, and
              rate the titles you own.
            </p>
          </div>
        </section>

        {/* COMPACT FINAL CTA */}

        <section className="welcome-bottom-cta">
          <h2>Ready to build your vault?</h2>

          <button
            type="button"
            className="welcome-primary-button"
            onClick={onGetStarted}
          >
            Create Your Account →
          </button>
        </section>

      </main>
    </div>
  )
}

export default WelcomePage
