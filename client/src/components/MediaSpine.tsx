import type { CSSProperties } from 'react'
import type { MediaItem } from '../data/sampleMedia'

interface MediaSpineProps {
  media: MediaItem
  onClick: (media: MediaItem) => void
  displayMode?: 'cover' | 'spine'
}

const formatClasses: Record<string, string> = {
  vhs: 'format-VHS',
  dvd: 'format-DVD',
  bluray: 'format-Blu-Ray',
  laserdisc: 'format-Laserdisc',
  nes: 'format-NES',
  ps1: 'format-PS1',
  xbox360: 'format-Xbox 360',
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
function MediaSpine({
  media,
  onClick,
  displayMode,
}: MediaSpineProps) {
  const isCover =
    (displayMode ?? media.orientation) === 'cover'

  const formatClass =
    formatClasses[media.format] ??
    'format-custom'

  const formatLabel =
    formatLabels[media.format] ??
    media.format

  const artwork =
    isCover
      ? media.coverImage
      : media.spineImage

 const artworkStyle: CSSProperties =
  artwork
    ? {
        backgroundImage: `
          linear-gradient(
            rgba(18, 7, 3, 0.16),
            rgba(18, 7, 3, 0.28)
          ),
          url("${artwork}")
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : !isCover
      ? {
          backgroundColor:
            media.spineColor ?? '#955536',
        }
      : {}

  return (
    <button
      type="button"
      className={[
        'media-object',
        formatClass,
        isCover
          ? 'orientation-cover'
          : 'orientation-spine',
      ].join(' ')}
      onClick={() => onClick(media)}
      aria-label={`Open ${media.title}`}
    >
      <span
        className="media-surface"
        style={artworkStyle}
      >
        {!artwork && (
          <>
            <span className="media-logo">
              {media.type === 'movie'
                ? 'FILM'
                : 'GAME'}
            </span>

            <span className="media-title">
              {media.title}
            </span>

            <span className="media-bottom">
              <span>
                {formatLabel}
              </span>

              <span>
                {media.year}
              </span>
            </span>
          </>
        )}

        {artwork && (
          <span className="media-artwork-overlay">
            <span className="media-title">
              {media.title}
            </span>
          </span>
        )}
      </span>

      {isCover && (
        <span
          className="cover-glare"
          aria-hidden="true"
        />
      )}
    </button>
  )
}

export default MediaSpine