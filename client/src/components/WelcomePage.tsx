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
      <h1>Welcome to MediaVault</h1>

      <p>
        Your personal media collection,
        all in one place.
      </p>

      <button
        type="button"
        onClick={onGetStarted}
      >
        Get Started
      </button>

      <button
        type="button"
        onClick={onSignIn}
      >
        Sign In
      </button>
    </div>
  )
}

export default WelcomePage