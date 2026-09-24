import { useState } from 'react'
import type { MediaItem } from '../data/sampleMedia'

interface MediaDetailProps {
  media: MediaItem
  onClose: () => void
  onRemove: (media: MediaItem) => void
  onEdit: (media: MediaItem) => void
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

const mediaTypeLabels: Record<string, string> = {
  movie: 'MOVIE',
  game: 'VIDEO GAME',
}

function MediaDetail({
  media,
  onClose,
  onRemove,
  onEdit,
}: MediaDetailProps) {
  const [showMoreDetails, setShowMoreDetails] =
    useState(false)

  const formatLabel =
    formatLabels[media.format] ??
    media.format

  const mediaTypeLabel =
    mediaTypeLabels[media.type] ??
    media.type

  const isMovie =
    media.type === 'movie'

  const rating =
    typeof media.rating === 'number'
      ? media.rating
      : null

  const formattedRating =
    rating !== null
      ? isMovie
        ? rating.toFixed(1)
        : rating.toFixed(1)
      : null

  const primaryVideo =
    media.videos?.[0]

  const additionalVideos =
    media.videos?.slice(1) ?? []

  return (
    <div
      className="detail-backdrop"
      onClick={onClose}
    >
      <div
        className="media-detail"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="detail-close"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>

        {/* =====================================================
            COVER / ARTWORK
            ===================================================== */}

        <div
          className="detail-cover"
          style={
            media.coverImage
              ? {
                  backgroundImage:
                    `linear-gradient(
                      rgba(10, 13, 12, 0.12),
                      rgba(10, 13, 12, 0.28)
                    ),
                    url("${media.coverImage}")`,
                  backgroundSize: 'cover',
                  backgroundPosition:
                    'center',
                }
              : undefined
          }
        >
          <span className="cover-type">
            {mediaTypeLabel} · {formatLabel}
          </span>

          {!media.coverImage && (
            <span className="cover-title">
              {media.title}
            </span>
          )}

          <span className="cover-year">
            {media.year}
          </span>
        </div>

        {/* =====================================================
            INFORMATION
            ===================================================== */}

        <div className="detail-info">
          <div className="detail-eyebrow">
            {mediaTypeLabel}
          </div>

          <h2>{media.title}</h2>

          <div className="detail-meta">
            <span>
              {media.year}
            </span>

            <span>
              {formatLabel}
            </span>

            <span>
              {media.genre}
            </span>

            {media.runtime && (
              <span>
                {media.runtime} min
              </span>
            )}
          </div>

          {/* ===================================================
              PRIMARY METADATA
              =================================================== */}

          <div className="detail-primary-info">
            {rating !== null && (
              <div className="detail-rating">
                <span>
                  {isMovie
                    ? 'TMDB RATING'
                    : 'IGDB RATING'}
                </span>

                <strong>
                  {formattedRating}
                </strong>

                <small>
                  {isMovie
                    ? '/ 10'
                    : '/ 100'}
                </small>
              </div>
            )}

            {isMovie ? (
              <>
                {media.director && (
                  <div className="detail-primary-item">
                    <span>
                      DIRECTED BY
                    </span>

                    <strong>
                      {media.director}
                    </strong>
                  </div>
                )}
              </>
            ) : (
              <>
                {media.developers &&
                  media.developers.length > 0 && (
                    <div className="detail-primary-item">
                      <span>
                        DEVELOPED BY
                      </span>

                      <strong>
                        {media.developers.join(
                          ', ',
                        )}
                      </strong>
                    </div>
                  )}

                {media.publishers &&
                  media.publishers.length > 0 && (
                    <div className="detail-primary-item">
                      <span>
                        PUBLISHED BY
                      </span>

                      <strong>
                        {media.publishers.join(
                          ', ',
                        )}
                      </strong>
                    </div>
                  )}
              </>
            )}
          </div>

          <div className="detail-divider" />

          {/* ===================================================
              DESCRIPTION
              =================================================== */}

          <div className="detail-description">
            <p>
              {media.description}
            </p>
          </div>

          {/* ===================================================
              TRAILER / VIDEO
              =================================================== */}

          {primaryVideo?.url && (
            <div className="detail-video-section">
              <a
                href={primaryVideo.url}
                target="_blank"
                rel="noreferrer"
                className="detail-video-button"
              >
                <span className="detail-video-icon">
                  ▶
                </span>

                <span>
                  {primaryVideo.name ||
                    (isMovie
                      ? 'Watch Trailer'
                      : 'Watch Video')}
                </span>
              </a>

              {additionalVideos.length >
                0 && (
                <span className="detail-video-count">
                  +{additionalVideos.length}{' '}
                  more
                </span>
              )}
            </div>
          )}

          {/* ===================================================
              YOUR COPY
              =================================================== */}

          <div className="detail-copy-section">
            <div className="detail-section-label">
              YOUR COPY
            </div>

            <div className="detail-facts">
              <div>
                <span>Format</span>

                <strong>
                  {formatLabel}
                </strong>
              </div>

              <div>
                <span>Release</span>

                <strong>
                  {media.year}
                </strong>
              </div>

              <div>
                <span>Genre</span>

                <strong>
                  {media.genre}
                </strong>
              </div>
            </div>
          </div>

          {/* ===================================================
              SCREENSHOTS
              =================================================== */}

          {media.screenshots &&
            media.screenshots.length > 0 && (
              <div className="detail-screenshots">
                <div className="detail-section-header">
                  <span>
                    {isMovie
                      ? 'ARTWORK'
                      : 'SCREENSHOTS'}
                  </span>

                  <small>
                    {media.screenshots.length}
                  </small>
                </div>

                <div className="detail-screenshot-grid">
                  {media.screenshots
                    .slice(0, 4)
                    .map(
                      (screenshot) => (
                        <a
                          key={screenshot}
                          href={
                            screenshot
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="detail-screenshot"
                        >
                          <img
                            src={screenshot}
                            alt=""
                          />
                        </a>
                      ),
                    )}
                </div>
              </div>
            )}

          {/* ===================================================
              MORE DETAILS
              =================================================== */}

          <div className="detail-more">
            <button
              type="button"
              className="detail-more-toggle"
              onClick={() =>
                setShowMoreDetails(
                  (current) =>
                    !current,
                )
              }
              aria-expanded={
                showMoreDetails
              }
            >
              <span>
                More Details
              </span>

              <span
                className={
                  showMoreDetails
                    ? 'detail-more-arrow open'
                    : 'detail-more-arrow'
                }
              >
                ›
              </span>
            </button>

            {showMoreDetails && (
              <div className="detail-more-content">
                {isMovie ? (
                  <>
                    {media.cast &&
                      media.cast.length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            CAST
                          </span>

                          <strong>
                            {media.cast.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}

                    {media.releaseDate && (
                      <div className="detail-more-group">
                        <span>
                          RELEASE DATE
                        </span>

                        <strong>
                          {media.releaseDate}
                        </strong>
                      </div>
                    )}

                    {media.productionCompanies &&
                      media.productionCompanies
                        .length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            PRODUCTION
                          </span>

                          <strong>
                            {media.productionCompanies.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}

                    {media.countries &&
                      media.countries.length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            COUNTRIES
                          </span>

                          <strong>
                            {media.countries.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}

                    {media.languages &&
                      media.languages.length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            LANGUAGES
                          </span>

                          <strong>
                            {media.languages.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}
                  </>
                ) : (
                  <>
                    {media.platforms &&
                      media.platforms.length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            PLATFORMS
                          </span>

                          <strong>
                            {media.platforms.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}

                    {media.gameModes &&
                      media.gameModes.length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            GAME MODES
                          </span>

                          <strong>
                            {media.gameModes.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}

                    {media.playerPerspectives &&
                      media.playerPerspectives
                        .length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            PERSPECTIVE
                          </span>

                          <strong>
                            {media.playerPerspectives.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}

                    {media.themes &&
                      media.themes.length >
                        0 && (
                        <div className="detail-more-group">
                          <span>
                            THEMES
                          </span>

                          <strong>
                            {media.themes.join(
                              ', ',
                            )}
                          </strong>
                        </div>
                      )}
                  </>
                )}

                {media.videos &&
                  media.videos.length >
                    1 && (
                    <div className="detail-more-group">
                      <span>
                        VIDEOS
                      </span>

                      <div className="detail-video-list">
                        {media.videos
                          .slice(1, 2)
                          .map(
                            (
                              video,
                            ) => (
                              <a
                                key={
                                  video.videoId ??
                                  video.url ??
                                  video.name
                                }
                                href={
                                  video.url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="detail-more-video"
                              >
                                <span>
                                  ▶
                                </span>

                                <strong>
                                  {video.name ||
                                    'Video'}
                                </strong>
                              </a>
                            ),
                          )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* ===================================================
              ACTIONS
              =================================================== */}

          <div className="detail-actions">
            <button
              type="button"
              className="detail-edit-button"
              onClick={() =>
                onEdit(media)
              }
            >
              Edit Media
            </button>

            <button
              type="button"
              className="detail-remove-button"
              onClick={() =>
                onRemove(media)
              }
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaDetail