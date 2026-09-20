import type { MediaItem } from '../data/sampleMedia'

interface MediaDetailProps {
  media: MediaItem
  onClose: () => void
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

        <div className="detail-cover">
          <span className="cover-type">
            {mediaTypeLabel} · {formatLabel}
          </span>

          <span className="cover-title">
            {media.title}
          </span>

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
            <span>{media.year}</span>

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
        </div>
      </div>
    </div>
  )
}

export default MediaDetail