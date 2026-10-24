
import WelcomeSlideshow from './WelcomeSlideshow'

interface WelcomePageProps {
  onSignIn: () => void
  onGetStarted: () => void
}

function WelcomePage({
  onSignIn,
  onGetStarted,
}: WelcomePageProps) {
  return (
    <div className="welcome-page">
      <header className="welcome-header">
        <div className="welcome-brand">
          <span className="welcome-brand-light" />

          <strong>
            MEDIA<span>VAULT</span>
          </strong>

          <small>PERSONAL MEDIA ARCHIVE</small>
        </div>

        <button
          type="button"
          className="welcome-header-signin"
          onClick={onSignIn}
        >
          Sign In
        </button>
      </header>

      <main className="welcome-main">
        <section className="welcome-hero">
          <div className="welcome-hero-content">
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

              <a href="#welcome-preview">
                Explore MediaVault
              </a>
            </div>
          </div>

          <div className="welcome-hero-decoration">
            <div className="welcome-hero-orbit" />
            <div className="welcome-hero-orbit inner" />
            <div className="welcome-hero-core">
              MV
            </div>
          </div>
        </section>

        <section
          className="welcome-preview-section"
          id="welcome-preview"
        >
          <div className="welcome-section-heading">
            <span>EXPLORE THE ARCHIVE</span>

            <h2>Take a look inside.</h2>

            <p>
              Discover how MediaVault helps you
              organize and explore your collection.
            </p>
          </div>

          <WelcomeSlideshow />
        </section>

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

        <section className="welcome-bottom-cta">
          <h2>Ready to build your vault?</h2>

          <p>
            Start organizing your personal
            collection today.
          </p>

          <button
            type="button"
            className="welcome-primary-button"
            onClick={onGetStarted}
          >
            Create Your Account →
          </button>
        </section>
      </main>

      <footer className="welcome-footer">
        <strong>MEDIAVAULT</strong>
        <span>Your personal media archive.</span>
      </footer>
    </div>
  )
}

export default WelcomePage
