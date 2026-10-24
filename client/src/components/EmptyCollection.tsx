
interface EmptyCollectionProps {
  onAddMedia: () => void
}

function EmptyCollection({
  onAddMedia,
}: EmptyCollectionProps) {
  return (
    <section className="empty-collection">

      <div className="empty-collection-header">
        <div>
          <h1>The Collection</h1>
          <p>Your Movies, Games, and Entertainment</p>
        </div>

        <div className="empty-collection-count">
          <strong>0</strong>
          <span>TOTAL TITLES</span>
        </div>
      </div>

      <div className="empty-collection-welcome">

        <div className="empty-collection-icon">
          <span aria-hidden="true">✦</span>
        </div>

        <span className="empty-collection-eyebrow">
          WELCOME TO MEDIAVAULT
        </span>

        <h2>Your archive starts here.</h2>

        <p>
          Your collection is currently empty.
          Add your first movie or game to start
          building your personal media archive.
        </p>

        <button
          type="button"
          className="empty-collection-add"
          onClick={onAddMedia}
        >
          <span aria-hidden="true">+</span>
          Add Your First Title
        </button>
      </div>

      <div className="empty-collection-guide">
        <div className="empty-collection-guide-heading">
          <h3>Getting Started</h3>
          <p>Build your collection in three simple steps.</p>
        </div>

        <div className="empty-collection-steps">

          <div className="empty-collection-step">
            <span>01</span>
            <h4>Find Your Media</h4>
            <p>
              Search for a movie or game to
              automatically retrieve its details.
            </p>
          </div>

          <div className="empty-collection-step">
            <span>02</span>
            <h4>Make It Yours</h4>
            <p>
              Choose your formats, customize
              artwork, and mark your favorites.
            </p>
          </div>

          <div className="empty-collection-step">
            <span>03</span>
            <h4>Build Your Archive</h4>
            <p>
              Save your title and start exploring
              your personal collection.
            </p>
          </div>

        </div>
      </div>

    </section>
  )
}

export default EmptyCollection
