import type { MediaItem } from '../data/sampleMedia'

const formatLabels: Record<string, string> = {
  vhs: 'VHS',
  dvd: 'DVD',
  bluray: 'Blu-ray',
  laserdisc: 'LaserDisc',
  nes: 'NES',
  ps1: 'PlayStation',
  xbox360: 'Xbox 360',
}

interface MediaCoverProps {
  media: MediaItem
  onClick: (media: MediaItem) => void
}

function MediaCover({
  media,
  onClick,
}: MediaCoverProps) {
  const artwork = media.coverImage

  return (
    <button
      type="button"
      className="library-cover-card"
      onClick={() => onClick(media)}
      aria-label={`Open ${media.title}`}
    >
      <div className="library-cover-art">
        {artwork ? (
          <img
            src={artwork}
            alt=""
            className="library-cover-image"
            loading="lazy"
          />
        ) : (
          <span className="library-cover-fallback">
            {media.title}
          </span>
        )}
      </div>

      <div className="library-cover-info">
  <strong>{media.title}</strong>

  <small>
    {media.year}
    {' · '}
    {formatLabels[media.format.toLowerCase()] ?? media.format}
  </small>
</div>
    </button>
  )
}

export default MediaCover