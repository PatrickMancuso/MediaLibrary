import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'

import type {
  MediaFormat,
  MediaItem,
  MediaOrientation,
  MediaType,
} from '../data/sampleMedia'

import { media as sampleMedia } from '../data/sampleMedia'

interface CustomOption {
  id: string
  label: string
}

interface AddMediaModalProps {
  onClose: () => void
  onAdd: (media: MediaItem) => void

  customMovieGenres: CustomOption[]
  customGameGenres: CustomOption[]

  customMovieFormats: CustomOption[]
  customGameFormats: CustomOption[]

  onAddCustomGenre: (
    type: 'movie' | 'game',
    option: CustomOption,
  ) => void

  onAddCustomFormat: (
    type: 'movie' | 'game',
    option: CustomOption,
  ) => void
}

type AddMode =
  | 'automatic'
  | 'manual'

const BUILTIN_MOVIE_FORMATS: {
  value: MediaFormat
  label: string
}[] = [
  {
    value: 'vhs',
    label: 'VHS',
  },
  {
    value: 'dvd',
    label: 'DVD',
  },
  {
    value: 'bluray',
    label: 'Blu-ray',
  },
  {
    value: 'laserdisc',
    label: 'LaserDisc',
  },
]

const BUILTIN_GAME_FORMATS: {
  value: MediaFormat
  label: string
}[] = [
  {
    value: 'nes',
    label: 'NES',
  },
  {
    value: 'ps1',
    label: 'PlayStation',
  },
  {
    value: 'xbox360',
    label: 'Xbox 360',
  },
]

const BUILTIN_MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Horror',
  'Sci-Fi',
]

const BUILTIN_GAME_GENRES = [
  'Action',
  'Adventure',
  'Indie',
  'Open World',
  'Puzzle',
  'RPG',
  'Strategy',
]

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function AddMediaModal({
  onClose,
  onAdd,
  customMovieGenres,
  customGameGenres,
  customMovieFormats,
  customGameFormats,
  onAddCustomGenre,
  onAddCustomFormat,
}: AddMediaModalProps) {
  /* =========================================================
     GENERAL STATE
     ========================================================= */

  const [mode, setMode] =
    useState<AddMode>('automatic')

  const [mediaType, setMediaType] =
    useState<MediaType>('movie')

  /* =========================================================
     AUTOMATIC MODE
     ========================================================= */

  const [search, setSearch] =
    useState('')

  const [
    selectedAutomaticMedia,
    setSelectedAutomaticMedia,
  ] = useState<MediaItem | null>(null)

  /* =========================================================
     MANUAL MODE
     ========================================================= */

  const [manualTitle, setManualTitle] =
    useState('')

  const [manualYear, setManualYear] =
    useState('')

  const [manualGenre, setManualGenre] =
    useState('')

  const [manualFormat, setManualFormat] =
    useState<MediaFormat>(
      BUILTIN_MOVIE_FORMATS[0].value,
    )

  const [
    manualDescription,
    setManualDescription,
  ] = useState('')

  const [manualFavorite, setManualFavorite] =
    useState(false)

  const [
    manualOrientation,
    setManualOrientation,
  ] = useState<MediaOrientation>('spine')

  /* =========================================================
     IMAGES
     ========================================================= */

  const [spineImage, setSpineImage] =
    useState<string | undefined>()

  const [coverImage, setCoverImage] =
    useState<string | undefined>()

  const spineInputRef =
    useRef<HTMLInputElement>(null)

  const coverInputRef =
    useRef<HTMLInputElement>(null)

  /* =========================================================
     CUSTOM GENRE / FORMAT UI
     ========================================================= */

  const [showNewGenre, setShowNewGenre] =
    useState(false)

  const [showNewFormat, setShowNewFormat] =
    useState(false)

  const [newGenre, setNewGenre] =
    useState('')

  const [newFormat, setNewFormat] =
    useState('')

  /* =========================================================
     AVAILABLE FORMATS
     ========================================================= */

  const formatOptions = useMemo(() => {
    const builtins =
      mediaType === 'movie'
        ? BUILTIN_MOVIE_FORMATS
        : BUILTIN_GAME_FORMATS

    const custom =
      mediaType === 'movie'
        ? customMovieFormats
        : customGameFormats

    return [
      ...builtins,
      ...custom.map((item) => ({
        value: item.id,
        label: item.label,
      })),
    ]
  }, [
    mediaType,
    customMovieFormats,
    customGameFormats,
  ])

  /* =========================================================
     AVAILABLE GENRES
     ========================================================= */

  const genreOptions = useMemo(() => {
    const builtins =
      mediaType === 'movie'
        ? BUILTIN_MOVIE_GENRES
        : BUILTIN_GAME_GENRES

    const custom =
      mediaType === 'movie'
        ? customMovieGenres
        : customGameGenres

    return [
      ...builtins,
      ...custom.map(
        (item) => item.label,
      ),
    ]
  }, [
    mediaType,
    customMovieGenres,
    customGameGenres,
  ])

  /* =========================================================
     RESET TYPE-SPECIFIC VALUES
     ========================================================= */

  useEffect(() => {
    const firstFormat =
      formatOptions[0]?.value

    if (firstFormat) {
      setManualFormat(firstFormat)
    }

    setManualGenre('')
    setSelectedAutomaticMedia(null)
  }, [
    mediaType,
    formatOptions,
  ])

  /* =========================================================
     AUTOMATIC SEARCH
     ========================================================= */

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
            .includes(
              normalizedSearch,
            ) ||
          item.genre
            .toLowerCase()
            .includes(
              normalizedSearch,
            )
        )
      })
      .slice(0, 6)
  }, [
    mediaType,
    search,
  ])

  /* =========================================================
     MEDIA TYPE SWITCH
     ========================================================= */

  const switchMediaType = (
    type: MediaType,
  ) => {
    setMediaType(type)

    setSelectedAutomaticMedia(null)

    const formats =
      type === 'movie'
        ? BUILTIN_MOVIE_FORMATS
        : BUILTIN_GAME_FORMATS

    setManualFormat(
      formats[0].value,
    )

    setManualGenre('')

    setSearch('')
  }

  /* =========================================================
     IMAGE UPLOAD
     ========================================================= */

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setImage: (
      value: string | undefined,
    ) => void,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    if (
      !file.type.startsWith('image/')
    ) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (
        typeof reader.result ===
        'string'
      ) {
        setImage(reader.result)
      }
    }

    reader.readAsDataURL(file)

    /*
     * Allows selecting the same file again
     * after removing/changing it.
     */
    event.target.value = ''
  }

  /* =========================================================
     CUSTOM GENRE
     ========================================================= */

  const addCustomGenre = () => {
    const label =
      newGenre.trim()

    if (!label) {
      return
    }

    const newOption: CustomOption = {
      id:
        `${slugify(label)}-${Date.now()}`,
      label,
    }

    onAddCustomGenre(
      mediaType,
      newOption,
    )

    setManualGenre(label)

    setNewGenre('')

    setShowNewGenre(false)
  }

  /* =========================================================
     CUSTOM FORMAT
     ========================================================= */

  const addCustomFormat = () => {
    const label =
      newFormat.trim()

    if (!label) {
      return
    }

    const id =
      `custom-${slugify(label)}-${Date.now()}`

    const newOption: CustomOption = {
      id,
      label,
    }

    onAddCustomFormat(
      mediaType,
      newOption,
    )

    setManualFormat(id)

    setNewFormat('')

    setShowNewFormat(false)
  }

  /* =========================================================
     AUTOMATIC SELECTION
     ========================================================= */

  const handleAutomaticSelect = (
    item: MediaItem,
  ) => {
    setSelectedAutomaticMedia(
      item,
    )
  }

  /* =========================================================
     AUTOMATIC ADD
     ========================================================= */

  const handleAutomaticAdd = () => {
    if (
      !selectedAutomaticMedia
    ) {
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

  /* =========================================================
     MANUAL ADD
     ========================================================= */

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
        genreOptions[0] ||
        'Uncategorized',

      description:
        manualDescription.trim() ||
        'No description has been added yet.',

      favorite:
        manualFavorite,

      orientation:
        manualOrientation,

      spineImage,

      coverImage,
    }

    onAdd(newMedia)

    onClose()
  }

  /* =========================================================
     LIVE PREVIEW DATA
     ========================================================= */

  const previewItem: MediaItem = {
    id: 'preview',

    title:
      manualTitle.trim() ||
      'Your New Title',

    type: mediaType,

    format: manualFormat,

    year:
      Number(manualYear) ||
      new Date().getFullYear(),

    genre:
      manualGenre ||
      genreOptions[0] ||
      'Genre',

    description:
      manualDescription ||
      'Your media preview will update as you customize the item.',

    favorite:
      manualFavorite,

    orientation:
      manualOrientation,

    spineImage,

    coverImage,
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
        {/* =================================================
            HEADER
            ================================================= */}

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

              <strong>
                Media Type
              </strong>
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
                  switchMediaType(
                    'movie',
                  )
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
                  switchMediaType(
                    'game',
                  )
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

              <strong>
                How would you like to add it?
              </strong>
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
                  setMode(
                    'automatic',
                  )
                }
              >
                <strong>
                  Automatic
                </strong>

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
                <strong>
                  Manual
                </strong>

                <span>
                  Build the item yourself.
                </span>
              </button>
            </div>
          </section>

          {/* =================================================
              AUTOMATIC MODE
              ================================================= */}

          {mode === 'automatic' && (
            <section className="add-media-section">
              <div className="add-media-section-heading">
                <span>03</span>

                <strong>
                  Find{' '}
                  {mediaType ===
                  'movie'
                    ? 'a Movie'
                    : 'a Game'}
                </strong>
              </div>

              <div className="automatic-search">
                <input
                  type="search"
                  value={search}
                  onChange={(
                    event,
                  ) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder={
                    mediaType ===
                    'movie'
                      ? 'Search for a movie...'
                      : 'Search for a game...'
                  }
                />

                <span className="search-label">
                  LOCAL TEST DATA
                </span>
              </div>

              <div className="automatic-results">
                {searchResults.map(
                  (item) => (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      className={`automatic-result ${
                        selectedAutomaticMedia?.id ===
                        item.id
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        handleAutomaticSelect(
                          item,
                        )
                      }
                    >
                      <span className="result-cover">
                        {item.type ===
                        'movie'
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
                  ),
                )}

                {searchResults.length ===
                  0 && (
                  <div className="empty-search">
                    No matching sample data
                    found.
                  </div>
                )}
              </div>

              {selectedAutomaticMedia && (
                <div className="automatic-preview">
                  <div>
                    <span>
                      SELECTED
                    </span>

                    <strong>
                      {
                        selectedAutomaticMedia.title
                      }
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
              MANUAL MODE
              ================================================= */}

          {mode === 'manual' && (
            <>
              {/* ===============================================
                  BASIC DETAILS
                  =============================================== */}

              <section className="add-media-section">
                <div className="add-media-section-heading">
                  <span>03</span>

                  <strong>
                    Enter Media Details
                  </strong>
                </div>

                <div className="manual-form">

                  {/* TITLE */}

                  <label>
                    <span>
                      Title
                    </span>

                    <input
                      type="text"
                      value={
                        manualTitle
                      }
                      onChange={(
                        event,
                      ) =>
                        setManualTitle(
                          event.target
                            .value,
                        )
                      }
                      placeholder={
                        mediaType ===
                        'movie'
                          ? 'Movie title'
                          : 'Game title'
                      }
                    />
                  </label>

                  {/* YEAR + GENRE */}

                  <div className="form-grid">

                    <label>
                      <span>
                        Release Year
                      </span>

                      <input
                        type="number"
                        value={
                          manualYear
                        }
                        onChange={(
                          event,
                        ) =>
                          setManualYear(
                            event.target
                              .value,
                          )
                        }
                        placeholder="1999"
                      />
                    </label>

                    <label>
                      <span>
                        Genre
                      </span>

                      <div className="select-with-action">
                        <select
                          value={
                            manualGenre
                          }
                          onChange={(
                            event,
                          ) =>
                            setManualGenre(
                              event.target
                                .value,
                            )
                          }
                        >
                          <option value="">
                            Select genre
                          </option>

                          {genreOptions.map(
                            (genre) => (
                              <option
                                key={
                                  genre
                                }
                                value={
                                  genre
                                }
                              >
                                {genre}
                              </option>
                            ),
                          )}
                        </select>

                        <button
                          type="button"
                          className="field-add-button"
                          onClick={() =>
                            setShowNewGenre(
                              (
                                current,
                              ) =>
                                !current,
                            )
                          }
                          aria-label="Add genre"
                        >
                          +
                        </button>
                      </div>
                    </label>

                  </div>

                  {/* NEW GENRE */}

                  {showNewGenre && (
                    <div className="custom-option-editor">
                      <input
                        type="text"
                        value={
                          newGenre
                        }
                        onChange={(
                          event,
                        ) =>
                          setNewGenre(
                            event.target
                              .value,
                          )
                        }
                        placeholder="New genre name"
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={
                          addCustomGenre
                        }
                      >
                        Add Genre
                      </button>
                    </div>
                  )}

                  {/* FORMAT */}

                  <label>
                    <span>
                      Physical Format
                    </span>

                    <div className="select-with-action">
                      <select
                        value={
                          manualFormat
                        }
                        onChange={(
                          event,
                        ) =>
                          setManualFormat(
                            event.target
                              .value as MediaFormat,
                          )
                        }
                      >
                        {formatOptions.map(
                          (
                            format,
                          ) => (
                            <option
                              key={
                                format.value
                              }
                              value={
                                format.value
                              }
                            >
                              {
                                format.label
                              }
                            </option>
                          ),
                        )}
                      </select>

                      <button
                        type="button"
                        className="field-add-button"
                        onClick={() =>
                          setShowNewFormat(
                            (
                              current,
                            ) =>
                              !current,
                          )
                        }
                        aria-label="Add format"
                      >
                        +
                      </button>
                    </div>
                  </label>

                  {/* NEW FORMAT */}

                  {showNewFormat && (
                    <div className="custom-option-editor">
                      <input
                        type="text"
                        value={
                          newFormat
                        }
                        onChange={(
                          event,
                        ) =>
                          setNewFormat(
                            event.target
                              .value,
                          )
                        }
                        placeholder="New format name"
                        autoFocus
                      />

                      <button
                        type="button"
                        onClick={
                          addCustomFormat
                        }
                      >
                        Add Format
                      </button>
                    </div>
                  )}

                  {/* DESCRIPTION */}

                  <label>
                    <span>
                      Description
                    </span>

                    <textarea
                      value={
                        manualDescription
                      }
                      onChange={(
                        event,
                      ) =>
                        setManualDescription(
                          event.target
                            .value,
                        )
                      }
                      placeholder="Add a short description..."
                      rows={4}
                    />
                  </label>

                </div>
              </section>

              {/* ===============================================
                  APPEARANCE
                  =============================================== */}

              <section className="add-media-section">

                <div className="add-media-section-heading">
                  <span>04</span>

                  <strong>
                    Appearance
                  </strong>
                </div>

                <div className="appearance-layout">

                  {/* -------------------------------------------
                      APPEARANCE CONTROLS
                      ------------------------------------------- */}

                  <div className="appearance-fields">

                    <div className="image-upload-grid">

                      {/* SPINE */}

                      <div className="image-upload-card">
                        <div>
                          <span>
                            SPINE ARTWORK
                          </span>

                          <strong>
                            {spineImage
                              ? 'Image selected'
                              : 'Optional'}
                          </strong>
                        </div>

                        <div className="image-upload-actions">

                          {spineImage && (
                            <button
                              type="button"
                              className="remove-image"
                              onClick={() =>
                                setSpineImage(
                                  undefined,
                                )
                              }
                            >
                              Remove
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              spineInputRef.current?.click()
                            }
                          >
                            {spineImage
                              ? 'Change'
                              : 'Upload'}
                          </button>

                          <input
                            ref={
                              spineInputRef
                            }
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(
                              event,
                            ) =>
                              handleImageUpload(
                                event,
                                setSpineImage,
                              )
                            }
                          />

                        </div>
                      </div>

                      {/* COVER */}

                      <div className="image-upload-card">
                        <div>
                          <span>
                            COVER ARTWORK
                          </span>

                          <strong>
                            {coverImage
                              ? 'Image selected'
                              : 'Optional'}
                          </strong>
                        </div>

                        <div className="image-upload-actions">

                          {coverImage && (
                            <button
                              type="button"
                              className="remove-image"
                              onClick={() =>
                                setCoverImage(
                                  undefined,
                                )
                              }
                            >
                              Remove
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              coverInputRef.current?.click()
                            }
                          >
                            {coverImage
                              ? 'Change'
                              : 'Upload'}
                          </button>

                          <input
                            ref={
                              coverInputRef
                            }
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(
                              event,
                            ) =>
                              handleImageUpload(
                                event,
                                setCoverImage,
                              )
                            }
                          />

                        </div>
                      </div>

                    </div>

                    {/* FAVORITE + ORIENTATION */}

                    <div className="manual-options">

                      <label className="checkbox-field">
                        <input
                          type="checkbox"
                          checked={
                            manualFavorite
                          }
                          onChange={(
                            event,
                          ) =>
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

                  </div>

                  {/* -------------------------------------------
                      LIVE PREVIEW
                      ------------------------------------------- */}

                  <div className="media-preview-panel">

                    <div className="preview-heading">
                      <span>
                        LIVE PREVIEW
                      </span>

                      <strong>
                        Shelf Appearance
                      </strong>
                    </div>

                    <div className="media-preview-stage">

                      <div
                        className={`preview-media preview-${manualOrientation}`}
                      >

                        {/* SPINE PREVIEW */}

                        {manualOrientation ===
                          'spine' && (
                          <div
                            className="preview-spine"
                            style={
                              spineImage
                                ? {
                                    backgroundImage:
                                      `url("${spineImage}")`,
                                    backgroundSize:
                                      'cover',
                                    backgroundPosition:
                                      'center',
                                  }
                                : undefined
                            }
                          >
                            {!spineImage && (
                              <>
                                <span>
                                  {previewItem.type ===
                                  'movie'
                                    ? 'FILM'
                                    : 'GAME'}
                                </span>

                                <strong>
                                  {
                                    previewItem.title
                                  }
                                </strong>

                                <small>
                                  {
                                    previewItem.year
                                  }
                                </small>
                              </>
                            )}
                          </div>
                        )}

                        {/* COVER PREVIEW */}

                        {manualOrientation ===
                          'cover' && (
                          <div
                            className="preview-cover"
                            style={
                              coverImage
                                ? {
                                    backgroundImage:
                                      `url("${coverImage}")`,
                                    backgroundSize:
                                      'cover',
                                    backgroundPosition:
                                      'center',
                                  }
                                : undefined
                            }
                          >
                            {!coverImage && (
                              <>
                                <span>
                                  {previewItem.type ===
                                  'movie'
                                    ? 'FILM'
                                    : 'GAME'}
                                </span>

                                <strong>
                                  {
                                    previewItem.title
                                  }
                                </strong>

                                <small>
                                  {
                                    previewItem.year
                                  }
                                </small>
                              </>
                            )}
                          </div>
                        )}

                      </div>

                    </div>

                    <div className="preview-summary">

                      <span>
                        {
                          previewItem.format
                        }
                      </span>

                      <strong>
                        {
                          previewItem.title
                        }
                      </strong>

                      <small>
                        {
                          previewItem.genre
                        }
                        {' · '}
                        {
                          previewItem.year
                        }
                      </small>

                    </div>

                  </div>

                </div>

                {/* ADD BUTTON */}

                <button
                  type="button"
                  className="manual-submit"
                  onClick={
                    handleManualAdd
                  }
                  disabled={
                    !manualTitle.trim()
                  }
                >
                  Add to Collection
                </button>

              </section>
            </>
          )}

        </div>
      </section>
    </div>
  )
}

export default AddMediaModal