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

interface ApiVideo {
  name: string
  videoId?: string
  provider?: string
  url?: string
}

interface ApiScreenshot {
  imageId: string
  width?: number | null
  height?: number | null
  url: string
}

interface ApiSearchResult {
  externalId: number
  title: string
  releaseDate: string | null
  year: number | null
  description: string

  posterImage?: string | null
  backdropImage?: string | null
  coverImage?: string | null

  genres?: string[]
  platforms?: string[]
  slug?: string | null

  rating?: number | null
  ratingCount?: number

  developers?: string[]
  publishers?: string[]

  gameModes?: string[]
  playerPerspectives?: string[]
  themes?: string[]

  screenshots?: ApiScreenshot[]
  videos?: ApiVideo[]
}

interface ApiMovieDetails extends ApiSearchResult {
  source: 'tmdb'
  originalTitle?: string
  runtime?: number | null
  rating?: number | null
  genres?: string[]
  directors?: string[]
  cast?: string[]
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
  searchResults,
  setSearchResults,
] = useState<ApiSearchResult[]>([])

const [
  selectedAutomaticResult,
  setSelectedAutomaticResult,
] =
  useState<ApiSearchResult | null>(null)

const [
  isSearching,
  setIsSearching,
] = useState(false)

const [
  isLoadingDetails,
  setIsLoadingDetails,
] = useState(false)

const [
  automaticError,
  setAutomaticError,
] = useState('')


const [
  isCustomizingAutomatic,
  setIsCustomizingAutomatic,
] = useState(false)

const [
  importedMetadata,
  setImportedMetadata,
] = useState<ApiSearchResult | null>(
  null,
)

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
setSelectedAutomaticResult(null)
setSearchResults([])
setAutomaticError('')
setIsCustomizingAutomatic(false)
  }, [
    mediaType,
    formatOptions,
  ])

  /* =========================================================
     AUTOMATIC SEARCH
     ========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3000'

const handleAutomaticSearch =
  async () => {
    const query = search.trim()

    if (!query) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setAutomaticError('')
    setSelectedAutomaticResult(null)

    try {
      const endpoint =
        mediaType === 'movie'
          ? '/api/media/search/movie'
          : '/api/media/search/game'

      const response = await fetch(
        `${API_BASE_URL}${endpoint}?q=${encodeURIComponent(
          query,
        )}`,
      )

      if (!response.ok) {
        throw new Error(
          `${mediaType === 'movie'
            ? 'Movie'
            : 'Game'} search failed with status ${response.status}`,
        )
      }

      const data =
        await response.json()

      setSearchResults(
        Array.isArray(data.results)
          ? data.results
          : [],
      )
    } catch (error) {
      console.error(
        'Automatic media search failed:',
        error,
      )

      setSearchResults([])

      setAutomaticError(
        'Unable to search for media right now.',
      )
    } finally {
      setIsSearching(false)
    }
  }

  /* =========================================================
     MEDIA TYPE SWITCH
     ========================================================= */

  const switchMediaType = (
    type: MediaType,
  ) => {
    setMediaType(type)

setSelectedAutomaticResult(null)
setImportedMetadata(null)
setSearchResults([])
setAutomaticError('')
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
const handleAutomaticSelect =
  async (
    result: ApiSearchResult,
  ) => {
    setSelectedAutomaticResult(result)
setImportedMetadata(result)
setAutomaticError('')

    /*
     * MOVIE
     * -----
     * TMDB search results need a second request
     * to get the richer movie information.
     */
    if (mediaType === 'movie') {
      setIsLoadingDetails(true)

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/media/movie/${result.externalId}`,
        )

        if (!response.ok) {
          throw new Error(
            `Movie details failed with status ${response.status}`,
          )
        }

        const details: ApiMovieDetails =
          await response.json()

          setImportedMetadata(details)

        setManualTitle(
          details.title ?? '',
        )

        setManualYear(
          details.year
            ? String(details.year)
            : '',
        )

        setManualDescription(
          details.description ?? '',
        )

        setCoverImage(
          details.posterImage ??
            undefined,
        )

        const firstGenre =
          details.genres?.[0] ?? ''

        const matchingGenre =
          genreOptions.find(
            (genre) =>
              genre.toLowerCase() ===
              firstGenre.toLowerCase(),
          )

        if (matchingGenre) {
          setManualGenre(
            matchingGenre,
          )
        } else {
          setManualGenre('')
        }
      } catch (error) {
        console.error(
          'Automatic movie detail lookup failed:',
          error,
        )

        setAutomaticError(
          'The title was found, but its detailed information could not be loaded.',
        )
      } finally {
        setIsLoadingDetails(false)
      }

      return
    }

    /*
     * GAME
     * ----
     * IGDB search results already contain the
     * basic information we need, so no second
     * request is required yet.
     */
    setManualTitle(
      result.title ?? '',
    )

    setManualYear(
      result.year
        ? String(result.year)
        : '',
    )

    setManualDescription(
      result.description ?? '',
    )

    setCoverImage(
      result.coverImage ??
        undefined,
    )

    const firstGameGenre =
      result.genres?.[0] ?? ''

    const matchingGameGenre =
      genreOptions.find(
        (genre) =>
          genre.toLowerCase() ===
          firstGameGenre.toLowerCase(),
      )

    if (matchingGameGenre) {
      setManualGenre(
        matchingGameGenre,
      )
    } else {
      setManualGenre('')
    }
  }

  /* =========================================================
     AUTOMATIC ADD
     ========================================================= */

  

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

source:
  mode === 'automatic'
    ? mediaType === 'movie'
      ? 'tmdb'
      : 'igdb'
    : 'manual',

externalId:
  mode === 'automatic' &&
  selectedAutomaticResult
    ? String(
        selectedAutomaticResult.externalId,
      )
    : undefined,

    releaseDate:
  importedMetadata?.releaseDate ??
  undefined,

rating:
  importedMetadata?.rating ??
  undefined,

platforms:
  mediaType === 'game'
    ? importedMetadata?.platforms
    : undefined,

developers:
  mediaType === 'game'
    ? importedMetadata?.developers
    : undefined,

publishers:
  mediaType === 'game'
    ? importedMetadata?.publishers
    : undefined,

gameModes:
  mediaType === 'game'
    ? importedMetadata?.gameModes
    : undefined,

playerPerspectives:
  mediaType === 'game'
    ? importedMetadata?.playerPerspectives
    : undefined,

themes:
  mediaType === 'game'
    ? importedMetadata?.themes
    : undefined,

screenshots:
  mediaType === 'game'
    ? importedMetadata?.screenshots
        ?.map(
          (screenshot) =>
            screenshot.url,
        )
        .filter(Boolean)
    : undefined,

videos:
  importedMetadata?.videos?.map(
    (video) => ({
      name: video.name,

      provider:
        video.provider,

      videoId:
        video.videoId,

      url:
        video.url,
    }),
  ),
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
      What are you adding?
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
        switchMediaType('movie')
      }
    >
      <strong>Movie</strong>

      <span>
        VHS, DVD, Blu-ray,
        LaserDisc
      </span>
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
      <strong>Video Game</strong>

      <span>
        NES, PlayStation, Xbox
      </span>
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
        {isCustomizingAutomatic
          ? 'Customize Imported Media'
          : `Find ${
              mediaType === 'movie'
                ? 'a Movie'
                : 'a Game'
            }`}
      </strong>
    </div>

    {!isCustomizingAutomatic && (
      <>
        <div className="automatic-search">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === 'Enter'
              ) {
                void handleAutomaticSearch()
              }
            }}
            placeholder={
              mediaType === 'movie'
                ? 'Search for a movie...'
                : 'Search for a game...'
            }
          />

          <button
            type="button"
            className="automatic-search-button"
            onClick={() =>
              void handleAutomaticSearch()
            }
            disabled={
              isSearching ||
              !search.trim()
            }
          >
            {isSearching
              ? 'Searching...'
              : 'Search'}
          </button>
        </div>

        <div className="automatic-results">
          {searchResults.map(
            (result) => (
              <button
                key={result.externalId}
                type="button"
                className={`automatic-result ${
                  selectedAutomaticResult?.externalId ===
                  result.externalId
                    ? 'selected'
                    : ''
                }`}
                onClick={() =>
                  void handleAutomaticSelect(
                    result,
                  )
                }
              >
                <span
  className="result-cover"
  style={
    (
      result.posterImage ??
      result.coverImage
    )
      ? {
          backgroundImage:
            `url("${
              result.posterImage ??
              result.coverImage
            }")`,
          backgroundSize:
            'cover',
          backgroundPosition:
            'center',
        }
      : undefined
  }
>
  {!result.posterImage &&
    !result.coverImage &&
    (mediaType === 'movie'
      ? 'FILM'
      : 'GAME')}
</span>

                <span className="result-info">
                  <strong>
                    {result.title}
                  </strong>

                  <span>
                    {result.year ??
                      'Unknown year'}
                  </span>
                </span>

                <span className="result-check">
                  {selectedAutomaticResult?.externalId ===
                  result.externalId
                    ? '✓'
                    : '＋'}
                </span>
              </button>
            ),
          )}

          {isLoadingDetails && (
            <div className="empty-search">
              Loading title details...
            </div>
          )}

          {automaticError && (
            <div className="empty-search">
              {automaticError}
            </div>
          )}

          {!isSearching &&
            !automaticError &&
            search.trim() &&
            searchResults.length === 0 && (
              <div className="empty-search">
                No results found.
              </div>
            )}
        </div>

        {selectedAutomaticResult && (
          <div className="automatic-import-preview">
            <div className="automatic-import-art">
  {(
    selectedAutomaticResult.posterImage ??
    selectedAutomaticResult.coverImage
  ) ? (
    <img
      src={
        selectedAutomaticResult.posterImage ??
        selectedAutomaticResult.coverImage ??
        ''
      }
      alt=""
    />
  ) : (
    <span>
      {mediaType === 'movie'
        ? 'FILM'
        : 'GAME'}
    </span>
  )}
</div>

            <div className="automatic-import-info">
              <span>
                {mediaType === 'movie'
  ? 'TMDB RESULT'
  : 'IGDB RESULT'}
              </span>

              <strong>
                {
                  selectedAutomaticResult.title
                }
              </strong>

              <p>
                {
                  selectedAutomaticResult.year ??
                    'Unknown year'
                }
                {' · '}
                Imported metadata ready
                to customize
              </p>

              <button
                type="button"
                onClick={() =>
                  setIsCustomizingAutomatic(
                    true,
                  )
                }
              >
                Customize &amp; Add
              </button>
            </div>
          </div>
        )}
      </>
    )}

  </section>
)}
          {/* =================================================
              MANUAL MODE
              ================================================= */}

          {(mode === 'manual' ||
  (mode === 'automatic' &&
    isCustomizingAutomatic)) && (
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
                  IMPORTED GAME INFORMATION
                  =============================================== */}

              {mode === 'automatic' &&
                mediaType === 'game' &&
                importedMetadata && (
                  <section className="add-media-section imported-media-section">
                    <div className="add-media-section-heading">
                      <span>04</span>

                      <strong>
                        Imported Game Information
                      </strong>
                    </div>

                    <div className="imported-game-panel">
                      <div className="imported-game-header">
                        <div>
                          <span className="imported-label">
                            IGDB METADATA
                          </span>

                          <h3>
                            {importedMetadata.title}
                          </h3>

                          <p>
                            {importedMetadata.year ??
                              'Unknown year'}
                            {' · '}
                            {importedMetadata.genres
                              ?.join(' · ') ||
                              'No genres available'}
                          </p>
                        </div>

                        {importedMetadata.rating != null && (
                          <div className="imported-rating">
                            <span>IGDB RATING</span>

                            <strong>
                              {importedMetadata.rating.toFixed(
                                1,
                              )}
                            </strong>

                            <small>
                              / 100
                            </small>
                          </div>
                        )}
                      </div>

                      <div className="imported-info-grid">
                        {importedMetadata.developers &&
                          importedMetadata.developers.length >
                            0 && (
                            <div className="imported-info-card">
                              <span>
                                Developer
                              </span>

                              <strong>
                                {importedMetadata.developers.join(
                                  ', ',
                                )}
                              </strong>
                            </div>
                          )}

                        {importedMetadata.publishers &&
                          importedMetadata.publishers.length >
                            0 && (
                            <div className="imported-info-card">
                              <span>
                                Publisher
                              </span>

                              <strong>
                                {importedMetadata.publishers.join(
                                  ', ',
                                )}
                              </strong>
                            </div>
                          )}

                        {importedMetadata.platforms &&
                          importedMetadata.platforms.length >
                            0 && (
                            <div className="imported-info-card">
                              <span>
                                Platforms
                              </span>

                              <strong>
                                {importedMetadata.platforms.join(
                                  ' · ',
                                )}
                              </strong>
                            </div>
                          )}

                        {importedMetadata.gameModes &&
                          importedMetadata.gameModes.length >
                            0 && (
                            <div className="imported-info-card">
                              <span>
                                Game Modes
                              </span>

                              <strong>
                                {importedMetadata.gameModes.join(
                                  ' · ',
                                )}
                              </strong>
                            </div>
                          )}

                        {importedMetadata.playerPerspectives &&
                          importedMetadata.playerPerspectives.length >
                            0 && (
                            <div className="imported-info-card">
                              <span>
                                Perspective
                              </span>

                              <strong>
                                {importedMetadata.playerPerspectives.join(
                                  ' · ',
                                )}
                              </strong>
                            </div>
                          )}

                        {importedMetadata.themes &&
                          importedMetadata.themes.length >
                            0 && (
                            <div className="imported-info-card">
                              <span>
                                Themes
                              </span>

                              <strong>
                                {importedMetadata.themes.join(
                                  ' · ',
                                )}
                              </strong>
                            </div>
                          )}
                      </div>

                      {importedMetadata.screenshots &&
                        importedMetadata.screenshots.length >
                          0 && (
                          <div className="imported-media-group">
                            <div className="imported-media-heading">
                              <span>
                                SCREENSHOTS
                              </span>

                              <small>
                                {
                                  importedMetadata
                                    .screenshots
                                    .length
                                }{' '}
                                available
                              </small>
                            </div>

                            <div className="imported-screenshot-grid">
                              {importedMetadata.screenshots.map(
                                (screenshot) => (
                                  <div
                                    key={
                                      screenshot.imageId
                                    }
                                    className="imported-screenshot"
                                  >
                                    <img
                                      src={
                                        screenshot.url
                                      }
                                      alt=""
                                    />
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {importedMetadata.videos &&
                        importedMetadata.videos.length >
                          0 && (
                          <div className="imported-media-group">
                            <div className="imported-media-heading">
                              <span>
                                VIDEOS
                              </span>

                              <small>
                                {
                                  importedMetadata
                                    .videos.length
                                }{' '}
                                available
                              </small>
                            </div>

                            <div className="imported-video-list">
                              {importedMetadata.videos.map(
                                (video) => (
                                  <a
                                    key={
                                      video.videoId ??
                                      video.url ??
                                      video.name
                                    }
                                    href={video.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="imported-video-card"
                                  >
                                    <span className="imported-video-icon">
                                      ▶
                                    </span>

                                    <span>
                                      {video.name ||
                                        'Game Video'}
                                    </span>
                                  </a>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </section>
                )}

           



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