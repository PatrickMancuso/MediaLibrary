import type { CSSProperties } from 'react'
import type { MediaItem } from '../data/sampleMedia'

interface MediaSpineProps {
  media: MediaItem
  onClick: (media: MediaItem) => void
  displayMode?: 'cover' | 'spine'
}

const formatClasses: Record<string, string> = {
  vhs: 'format-vhs',
  dvd: 'format-dvd',
  bluray: 'format-bluray',
  laserdisc: 'format-laserdisc',
  nes: 'format-nes',
  ps1: 'format-ps1',
  xbox360: 'format-xbox360',
}


function MediaSpine({
  media,
  onClick,
  displayMode,
}: MediaSpineProps) {
  const isCover =
    (displayMode ?? media.orientation) === 'cover'


    const titleLength = media.title.length

const titleWidthClass =
  titleLength > 28
    ? 'spine-title-long'
    : titleLength > 18
      ? 'spine-title-medium'
      : 'spine-title-short'

  const formatClass =
    formatClasses[media.format] ??
    'format-custom'

 

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
    : !isCover && media.spineColor
      ? {
          backgroundColor: media.spineColor,
        }
      : {}

  return (
    <button
      type="button"
      className={[
  'media-object',
  formatClass,
  !isCover && titleWidthClass,
  isCover
    ? 'orientation-cover'
    : 'orientation-spine',
]
  .filter(Boolean)
  .join(' ')}
      onClick={() => onClick(media)}
      aria-label={`Open ${media.title}`}
    >
      <span
        className="media-surface"
        style={artworkStyle}
      >
        {!artwork && (
  <span className="media-title">
    {media.title}
  </span>
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