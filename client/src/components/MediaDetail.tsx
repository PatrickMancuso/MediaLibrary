import type { MediaItem } from '../data/sampleMedia'

interface MediaDetailProps {
  media: MediaItem
  onClose: () => void
  onRemove: (media: MediaItem) => void
  onEdit: (media: MediaItem) => void
}

const formatLabels: Record<
  string,
  string
> = {
  vhs: 'VHS',
  dvd: 'DVD',
  bluray: 'Blu-ray',
  laserdisc: 'LaserDisc',
  nes: 'NES',
  ps1: 'PlayStation',
  xbox360: 'Xbox 360',
}

const mediaTypeLabels: Record<
  string,
  string
> = {
  movie: 'MOVIE',
  game: 'VIDEO GAME',
}

function MediaDetail({
  media,
  onClose,
  onRemove,
  onEdit,
}: MediaDetailProps) {
  const formatLabel =
    formatLabels[media.format] ??
    media.format

  const mediaTypeLabel =
    mediaTypeLabels[media.type] ??
    media.type

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

        <div
          className="detail-cover"
          style={
            media.coverImage
              ? {
                  backgroundImage:
                    `linear-gradient(
                      rgba(40, 15, 7, 0.2),
                      rgba(40, 15, 7, 0.3)
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
          </div>

          <div className="detail-divider" />

          <p>
            {media.description}
          </p>

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