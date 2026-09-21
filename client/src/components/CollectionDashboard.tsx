import type { MediaItem } from '../data/sampleMedia'

interface CollectionDashboardProps {
  recentlyAdded: MediaItem[]
  movies: MediaItem[]
  games: MediaItem[]
  favorites: MediaItem[]
  onSelect: (media: MediaItem) => void
  onViewChange: (
    view: 'movies' | 'games' | 'favorites',
  ) => void
}

const formatLabels: Record<string, string> = {
  vhs: 'VHS',
  dvd: 'DVD',
  bluray: 'Blu-ray',
  laserdisc: 'LaserDisc',
  nes: 'NES',
  ps1: 'PlayStation',
  xbox360: 'Xbox 360',
}

function getArtwork(media: MediaItem) {
  return media.coverImage ?? media.spineImage
}

function CollectionDashboard({
  recentlyAdded,
  movies,
  games,
  favorites,
  onSelect,
  onViewChange,
}: CollectionDashboardProps) {
  const formatCounts = new Map<
    string,
    number
  >()

  ;[
    ...movies,
    ...games,
  ].forEach((item) => {
    formatCounts.set(
      item.format,
      (formatCounts.get(item.format) ?? 0) + 1,
    )
  })

  const favoritePreview = favorites.slice(0, 6)

  return (
    <div className="collection-dashboard">
      {/* =================================================
          INTRO
          ================================================= */}

      <section className="dashboard-intro">
        <div>
          <span className="dashboard-kicker">
            PERSONAL MEDIA COLLECTION
          </span>

          <h1>Your Collection</h1>

          <p>
            Your movies, games, and physical media,
            all in one place.
          </p>
        </div>

        <div className="dashboard-total">
          <span>Total Library</span>

          <strong>
            {movies.length + games.length}
          </strong>

          <small>titles</small>
        </div>
      </section>

      {/* =================================================
          RECENTLY ADDED
          ================================================= */}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span>THE LATEST ADDITIONS</span>
            <h2>Recently Added</h2>
          </div>

          <small>
            {recentlyAdded.length} titles
          </small>
        </div>

        <div className="recent-media-track">
          {recentlyAdded.map((item) => {
            const artwork =
              getArtwork(item)

            return (
              <button
                key={item.id}
                type="button"
                className="recent-media-card"
                onClick={() =>
                  onSelect(item)
                }
              >
                <div
                  className="recent-media-art"
                  style={
                    artwork
                      ? {
                          backgroundImage: `
                            linear-gradient(
                              180deg,
                              rgba(15, 6, 3, 0.02),
                              rgba(15, 6, 3, 0.46)
                            ),
                            url("${artwork}")
                          `,
                        }
                      : undefined
                  }
                >
                  {!artwork && (
                    <>
                      <span className="recent-art-type">
                        {item.type ===
                        'movie'
                          ? 'FILM'
                          : 'GAME'}
                      </span>

                      <strong>
                        {item.title}
                      </strong>
                    </>
                  )}

                  <div className="recent-art-bottom">
                    <span>
                      {formatLabels[
                        item.format
                      ] ??
                        item.format}
                    </span>

                    <span>
                      {item.year}
                    </span>
                  </div>
                </div>

                <div className="recent-media-info">
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.type === 'movie'
                      ? 'Movie'
                      : 'Game'}{' '}
                    · {item.genre}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* =================================================
          MOVIES / GAMES
          ================================================= */}

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <span>YOUR LIBRARY</span>
            <h2>Browse Collection</h2>
          </div>
        </div>

        <div className="dashboard-category-grid">
          <button
            type="button"
            className="dashboard-category-card dashboard-category-movies"
            onClick={() =>
              onViewChange('movies')
            }
          >
            <div className="category-art">
              {movies
                .slice(0, 4)
                .map((item) => {
                  const artwork =
                    getArtwork(item)

                  return (
                    <div
                      key={item.id}
                      className="category-art-item"
                      style={
                        artwork
                          ? {
                              backgroundImage:
                                `url("${artwork}")`,
                            }
                          : undefined
                      }
                    >
                      {!artwork && (
                        <span>
                          {item.title}
                        </span>
                      )}
                    </div>
                  )
                })}
            </div>

            <div className="category-overlay" />

            <div className="category-content">
              <span>FILM COLLECTION</span>

              <strong>Movies</strong>

              <small>
                {movies.length} titles
              </small>

              <em>
                Browse shelf →
              </em>
            </div>
          </button>

          <button
            type="button"
            className="dashboard-category-card dashboard-category-games"
            onClick={() =>
              onViewChange('games')
            }
          >
            <div className="category-art">
              {games
                .slice(0, 4)
                .map((item) => {
                  const artwork =
                    getArtwork(item)

                  return (
                    <div
                      key={item.id}
                      className="category-art-item"
                      style={
                        artwork
                          ? {
                              backgroundImage:
                                `url("${artwork}")`,
                            }
                          : undefined
                      }
                    >
                      {!artwork && (
                        <span>
                          {item.title}
                        </span>
                      )}
                    </div>
                  )
                })}
            </div>

            <div className="category-overlay" />

            <div className="category-content">
              <span>GAME COLLECTION</span>

              <strong>Games</strong>

              <small>
                {games.length} titles
              </small>

              <em>
                Browse shelf →
              </em>
            </div>
          </button>
        </div>
      </section>

      {/* =================================================
          FAVORITES
          ================================================= */}

      {favoritePreview.length > 0 && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <span>PERSONAL PICKS</span>
              <h2>Favorites</h2>
            </div>

            <button
              type="button"
              className="dashboard-text-button"
              onClick={() =>
                onViewChange('favorites')
              }
            >
              View all →
            </button>
          </div>

          <div className="favorite-grid">
            {favoritePreview.map(
              (item) => {
                const artwork =
                  getArtwork(item)

                return (
                  <button
                    key={item.id}
                    type="button"
                    className="favorite-card"
                    onClick={() =>
                      onSelect(item)
                    }
                  >
                    <div
                      className="favorite-art"
                      style={
                        artwork
                          ? {
                              backgroundImage:
                                `url("${artwork}")`,
                            }
                          : undefined
                      }
                    >
                      {!artwork && (
                        <span>
                          {item.title}
                        </span>
                      )}
                    </div>

                    <div>
                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {item.year} ·{' '}
                        {formatLabels[
                          item.format
                        ] ??
                          item.format}
                      </small>
                    </div>
                  </button>
                )
              },
            )}
          </div>
        </section>
      )}

      {/* =================================================
          COLLECTION OVERVIEW
          ================================================= */}

      <section className="dashboard-overview">
        <div className="overview-heading">
          <span>THE COLLECTION</span>
          <h2>Overview</h2>
        </div>

        <div className="overview-stats">
          <div>
            <span>Movies</span>
            <strong>
              {movies.length}
            </strong>
          </div>

          <div>
            <span>Games</span>
            <strong>
              {games.length}
            </strong>
          </div>

          <div>
            <span>Favorites</span>
            <strong>
              {favorites.length}
            </strong>
          </div>

          <div>
            <span>Formats</span>
            <strong>
              {formatCounts.size}
            </strong>
          </div>
        </div>

        <div className="overview-formats">
          {Array.from(
            formatCounts.entries(),
          ).map(
            ([format, count]) => (
              <div key={format}>
                <span>
                  {formatLabels[format] ??
                    format}
                </span>

                <strong>
                  {count}
                </strong>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  )
}

export default CollectionDashboard