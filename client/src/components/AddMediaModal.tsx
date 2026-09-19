import { useMemo, useState } from 'react'
import type {
  MediaFormat,
  MediaItem,
  MediaOrientation,
  MediaType,
} from '../data/sampleMedia'
import { media as sampleMedia } from '../data/sampleMedia'

interface AddMediaModalProps {
  onClose: () => void
  onAdd: (media: MediaItem) => void
}

type AddMode = 'automatic' | 'manual'

const movieFormats: {
  value: MediaFormat
  label: string
}[] = [
  { value: 'vhs', label: 'VHS' },
  { value: 'dvd', label: 'DVD' },
  { value: 'bluray', label: 'Blu-ray' },
  { value: 'laserdisc', label: 'LaserDisc' },
]

const gameFormats: {
  value: MediaFormat
  label: string
}[] = [
  { value: 'nes', label: 'NES' },
  { value: 'ps1', label: 'PlayStation' },
  { value: 'xbox360', label: 'Xbox 360' },
]

const movieGenres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Horror',
  'Sci-Fi',
]

const gameGenres = [
  'Action',
  'Adventure',
  'Indie',
  'Open World',
  'Puzzle',
  'RPG',
  'Strategy',
]

function AddMediaModal({
  onClose,
  onAdd,
}: AddMediaModalProps) {
  const [mode, setMode] =
    useState<AddMode>('automatic')

  const [mediaType, setMediaType] =
    useState<MediaType>('movie')

  const [search, setSearch] = useState('')

  const [selectedAutomaticMedia, setSelectedAutomaticMedia] =
    useState<MediaItem | null>(null)

  const [manualTitle, setManualTitle] =
    useState('')

  const [manualYear, setManualYear] =
    useState('')

  const [manualGenre, setManualGenre] =
    useState('')

  const [manualFormat, setManualFormat] =
    useState<MediaFormat>(
      movieFormats[0].value,
    )

  const [manualDescription, setManualDescription] =
    useState('')

  const [manualFavorite, setManualFavorite] =
    useState(false)

  const [manualOrientation, setManualOrientation] =
    useState<MediaOrientation>('spine')

  const formatOptions =
    mediaType === 'movie'
      ? movieFormats
      : gameFormats

  const genreOptions =
    mediaType === 'movie'
      ? movieGenres
      : gameGenres

  const searchResults = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    return sampleMedia
      .filter(
        (item) =>
          item.type === mediaType,
      )
      .filter((item) => {
        if (!normalizedSearch) {
          return true
        }

        return (
          item.title
            .toLowerCase()
            .includes(normalizedSearch) ||
          item.genre
            .toLowerCase()
            .includes(normalizedSearch)
        )
      })
      .slice(0, 6)
  }, [mediaType, search])

  const switchMediaType = (
    type: MediaType,
  ) => {
    setMediaType(type)
    setSelectedAutomaticMedia(null)

    const newFormats =
      type === 'movie'
        ? movieFormats
        : gameFormats

    setManualFormat(
      newFormats[0].value,
    )

    setManualGenre('')
  }

  const handleAutomaticSelect = (
    item: MediaItem,
  ) => {
    setSelectedAutomaticMedia(item)
  }

  const handleAutomaticAdd = () => {
    if (!selectedAutomaticMedia) {
      return
    }

    onAdd({
      ...selectedAutomaticMedia,
      id: crypto.randomUUID(),
      favorite: false,
      orientation: 'spine',
    })

    onClose()
  }

  const handleManualAdd = () => {
    const trimmedTitle =
      manualTitle.trim()

    if (!trimmedTitle) {
      return
    }

    const year =
      Number(manualYear) ||
      new Date().getFullYear()

    const newMedia: MediaItem = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      type: mediaType,
      format: manualFormat,
      year,
      genre:
        manualGenre ||
        genreOptions[0],
      description:
        manualDescription.trim() ||
        'No description has been added yet.',
      favorite: manualFavorite,
      orientation: manualOrientation,
    }

    onAdd(newMedia)
    onClose()
  }

  return (
    <div
      className="add-media-backdrop"
      onClick={onClose}
    >
      <section
        className="add-media-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <header className="add-media-header">
          <div>
            <p className="add-media-eyebrow">
              MEDIA LIBRARY
            </p>

            <h2>Add Media</h2>

            <p>
              Add something to your physical
              collection.
            </p>
          </div>

          <button
            type="button"
            className="add-media-close"
            onClick={onClose}
            aria-label="Close add media"
          >
            ×
          </button>
        </header>

        <div className="add-media-body">

          {/* =================================================
              MEDIA TYPE
              ================================================= */}

          <section className="add-media-section">
            <div className="add-media-section-heading">
              <span>01</span>
              <strong>Media Type</strong>
            </div>

            <div className="media-type-switch">
              <button
                type="button"
                className={
                  mediaType === 'movie'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  switchMediaType('movie')
                }
              >
                <span className="type-icon">
                  FILM
                </span>
                Movie
              </button>

              <button
                type="button"
                className={
                  mediaType === 'game'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  switchMediaType('game')
                }
              >
                <span className="type-icon">
                  GAME
                </span>
                Video Game
              </button>
            </div>
          </section>

          {/* =================================================
              ADD MODE
              ================================================= */}

          <section className="add-media-section">
            <div className="add-media-section-heading">
              <span>02</span>
              <strong>How would you like to add it?</strong>
            </div>

            <div className="add-mode-switch">
              <button
                type="button"
                className={
                  mode === 'automatic'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setMode('automatic')
                }
              >
                <strong>Automatic</strong>
                <span>
                  Find a title and populate
                  the basics.
                </span>
              </button>

              <button
                type="button"
                className={
                  mode === 'manual'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setMode('manual')
                }
              >
                <strong>Manual</strong>
                <span>
                  Enter the details yourself.
                </span>
              </button>
            </div>
          </section>

          {/* =================================================
              AUTOMATIC
              ================================================= */}

          {mode === 'automatic' && (
            <section className="add-media-section">
              <div className="add-media-section-heading">
                <span>03</span>
                <strong>
                  Find {mediaType === 'movie'
                    ? 'a Movie'
                    : 'a Game'}
                </strong>
              </div>

              <div className="automatic-search">
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder={
                    mediaType === 'movie'
                      ? 'Search for a movie...'
                      : 'Search for a game...'
                  }
                />

                <span className="search-label">
                  LOCAL TEST DATA
                </span>
              </div>

              <div className="automatic-results">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`automatic-result ${
                      selectedAutomaticMedia?.id ===
                      item.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      handleAutomaticSelect(item)
                    }
                  >
                    <span className="result-cover">
                      {item.type === 'movie'
                        ? 'FILM'
                        : 'GAME'}
                    </span>

                    <span className="result-info">
                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.year}
                        {' · '}
                        {item.genre}
                        {' · '}
                        {item.format}
                      </span>
                    </span>

                    <span className="result-check">
                      {selectedAutomaticMedia?.id ===
                      item.id
                        ? '✓'
                        : '＋'}
                    </span>
                  </button>
                ))}

                {searchResults.length === 0 && (
                  <div className="empty-search">
                    No matching sample data found.
                  </div>
                )}
              </div>

              {selectedAutomaticMedia && (
                <div className="automatic-preview">
                  <div>
                    <span>SELECTED</span>
                    <strong>
                      {selectedAutomaticMedia.title}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleAutomaticAdd
                    }
                  >
                    Add to Collection
                  </button>
                </div>
              )}
            </section>
          )}

          {/* =================================================
              MANUAL
              ================================================= */}

          {mode === 'manual' && (
            <section className="add-media-section">
              <div className="add-media-section-heading">
                <span>03</span>
                <strong>
                  Enter Media Details
                </strong>
              </div>

              <div className="manual-form">

                <label>
                  <span>Title</span>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(event) =>
                      setManualTitle(
                        event.target.value,
                      )
                    }
                    placeholder={
                      mediaType === 'movie'
                        ? 'Movie title'
                        : 'Game title'
                    }
                  />
                </label>

                <div className="form-grid">

                  <label>
                    <span>Release Year</span>
                    <input
                      type="number"
                      value={manualYear}
                      onChange={(event) =>
                        setManualYear(
                          event.target.value,
                        )
                      }
                      placeholder="1999"
                    />
                  </label>

                  <label>
                    <span>Genre</span>

                    <select
                      value={manualGenre}
                      onChange={(event) =>
                        setManualGenre(
                          event.target.value,
                        )
                      }
                    >
                      <option value="">
                        Select genre
                      </option>

                      {genreOptions.map(
                        (genre) => (
                          <option
                            key={genre}
                            value={genre}
                          >
                            {genre}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                </div>

                <label>
                  <span>Physical Format</span>

                  <select
                    value={manualFormat}
                    onChange={(event) =>
                      setManualFormat(
                        event.target
                          .value as MediaFormat,
                      )
                    }
                  >
                    {formatOptions.map(
                      (format) => (
                        <option
                          key={format.value}
                          value={
                            format.value
                          }
                        >
                          {format.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span>Description</span>

                  <textarea
                    value={
                      manualDescription
                    }
                    onChange={(event) =>
                      setManualDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Add a short description..."
                    rows={4}
                  />
                </label>

                <div className="manual-options">

                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={
                        manualFavorite
                      }
                      onChange={(event) =>
                        setManualFavorite(
                          event.target
                            .checked,
                        )
                      }
                    />

                    <span>
                      Add to favorites
                    </span>
                  </label>

                  <div className="orientation-field">
                    <span>
                      Shelf Display
                    </span>

                    <div>
                      <button
                        type="button"
                        className={
                          manualOrientation ===
                          'spine'
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setManualOrientation(
                            'spine',
                          )
                        }
                      >
                        Spine
                      </button>

                      <button
                        type="button"
                        className={
                          manualOrientation ===
                          'cover'
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setManualOrientation(
                            'cover',
                          )
                        }
                      >
                        Cover
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="manual-submit"
                  onClick={handleManualAdd}
                  disabled={
                    !manualTitle.trim()
                  }
                >
                  Add to Collection
                </button>
              </div>
            </section>
          )}

        </div>
      </section>
    </div>
  )
}

export default AddMediaModal