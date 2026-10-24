
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

        <section className="welcome-hero">

          {/* BRANDING AND INTRODUCTION */}

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

            <p className="welcome-introduction">
              Give your movies and games a home.
              Organize your collection, explore your
              favorites, and keep track of the media
              that matters to you.
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

          {/* SCREENSHOT SLIDESHOW */}

          <div className="welcome-hero-preview">
            <WelcomeSlideshow />
          </div>

        </section>

      </main>
    </div>
  )
}

export default WelcomePage
