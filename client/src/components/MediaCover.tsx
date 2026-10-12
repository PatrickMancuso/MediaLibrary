import type { MediaItem } from '../data/sampleMedia'

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
          {media.format}
        </small>
      </div>
    </button>
  )
}

export default MediaCover