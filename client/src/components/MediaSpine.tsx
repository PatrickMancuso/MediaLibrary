import type { MediaItem } from '../data/sampleMedia'

interface MediaSpineProps {
  media: MediaItem
  onClick: (media: MediaItem) => void
}

const formatLabels: Record<string, string> = {
  vhs: 'format-vhs',
  dvd: 'format-dvd',
  bluray: 'format-bluray',
  laserdisc: 'format-laserdisc',
  nes: 'format-nes',
  ps1: 'format-ps1',
  xbox360: 'format-xbox360',
}

function MediaSpine({ media, onClick }: MediaSpineProps) {
  const isCover = media.orientation === 'cover'

  return (
    <button
      type="button"
      className={[
        'media-object',
        `format-${media.format}`,
        isCover ? 'orientation-cover' : 'orientation-spine',
      ].join(' ')}
      onClick={() => onClick(media)}
      aria-label={`Open ${media.title}`}
    >
      <span className="media-surface">
        <span className="media-logo">
          {media.type === 'movie' ? 'FILM' : 'GAME'}
        </span>

        <span className="media-title">{media.title}</span>

        <span className="media-bottom">
          <span>{formatLabels[media.format]}</span>
          <span>{media.year}</span>
        </span>
      </span>

      {isCover && (
        <span className="cover-glare" aria-hidden="true" />
      )}
    </button>
  )
}

export default MediaSpine