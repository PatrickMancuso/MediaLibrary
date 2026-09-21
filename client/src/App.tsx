import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import MediaDetail from './components/MediaDetail'
import MediaRow from './components/MediaRow'
import AddMediaModal from './components/AddMediaModal'
import {
  gameGenres,
  media as sampleMedia,
  movieGenres,
  type MediaItem,
} from './data/sampleMedia'
import './App.css'

type View =
  | 'collection'
  | 'movies'
  | 'games'
  | 'favorites'

interface CustomOption {
  id: string
  label: string
}

const STORAGE_KEYS = {
  movieGenres: 'medialibrary.customMovieGenres',
  gameGenres: 'medialibrary.customGameGenres',
  movieFormats: 'medialibrary.customMovieFormats',
  gameFormats: 'medialibrary.customGameFormats',
}

function loadStoredOptions(
  key: string,
): CustomOption[] {
  try {
    const saved = localStorage.getItem(key)

    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item): item is CustomOption =>
        typeof item?.id === 'string' &&
        typeof item?.label === 'string',
    )
  } catch {
    return []
  }
}

function App() {
  const [activeView, setActiveView] =
    useState<View>('collection')

  const [collection, setCollection] =
    useState<MediaItem[]>(sampleMedia)

  const [selectedMedia, setSelectedMedia] =
    useState<MediaItem | null>(null)

  const [isAddMediaOpen, setIsAddMediaOpen] =
    useState(false)

  /*
   * Persistent user-created genres/formats.
   *
   * These are loaded once when the application starts.
   */
  const [customMovieGenres, setCustomMovieGenres] =
    useState<CustomOption[]>(() =>
      loadStoredOptions(
        STORAGE_KEYS.movieGenres,
      ),
    )

  const [customGameGenres, setCustomGameGenres] =
    useState<CustomOption[]>(() =>
      loadStoredOptions(
        STORAGE_KEYS.gameGenres,
      ),
    )

  const [customMovieFormats, setCustomMovieFormats] =
    useState<CustomOption[]>(() =>
      loadStoredOptions(
        STORAGE_KEYS.movieFormats,
      ),
    )

  const [customGameFormats, setCustomGameFormats] =
    useState<CustomOption[]>(() =>
      loadStoredOptions(
        STORAGE_KEYS.gameFormats,
      ),
    )

  /*
   * Keep localStorage synchronized with state.
   */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.movieGenres,
      JSON.stringify(customMovieGenres),
    )
  }, [customMovieGenres])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.gameGenres,
      JSON.stringify(customGameGenres),
    )
  }, [customGameGenres])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.movieFormats,
      JSON.stringify(customMovieFormats),
    )
  }, [customMovieFormats])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.gameFormats,
      JSON.stringify(customGameFormats),
    )
  }, [customGameFormats])

  /* =========================================================
     COLLECTION FILTERS
     ========================================================= */

  const movies = useMemo(
    () =>
      collection.filter(
        (item) => item.type === 'movie',
      ),
    [collection],
  )

  const games = useMemo(
    () =>
      collection.filter(
        (item) => item.type === 'game',
      ),
    [collection],
  )

  const favorites = useMemo(
    () =>
      collection.filter(
        (item) => item.favorite,
      ),
    [collection],
  )

  /*
   * Most recently added items are simply the newest
   * entries in the current collection.
   */
  const recentlyAdded = useMemo(
    () =>
      [...collection]
        .slice(-8)
        .reverse(),
    [collection],
  )

  /* =========================================================
     GENRE CATALOGS
     ========================================================= */

  /*
   * A genre can come from:
   *
   * 1. Built-in genres
   * 2. User-created genres
   * 3. A media item that already contains a genre
   *
   * The Set prevents duplicates.
   */
  const allMovieGenres = useMemo(() => {
    const values = new Set([
      ...movieGenres,
      ...customMovieGenres.map(
        (item) => item.label,
      ),
      ...movies.map(
        (item) => item.genre,
      ),
    ])

    return Array.from(values)
  }, [
    movies,
    customMovieGenres,
  ])

  const allGameGenres = useMemo(() => {
    const values = new Set([
      ...gameGenres,
      ...customGameGenres.map(
        (item) => item.label,
      ),
      ...games.map(
        (item) => item.genre,
      ),
    ])

    return Array.from(values)
  }, [
    games,
    customGameGenres,
  ])

  /* =========================================================
     GENRE ROWS
     ========================================================= */

  const movieGenreRows = allMovieGenres
    .map((genre) => ({
      title: genre,
      items: movies.filter(
        (item) => item.genre === genre,
      ),
    }))
    .filter(
      (row) => row.items.length > 0,
    )

  const gameGenreRows = allGameGenres
    .map((genre) => ({
      title: genre,
      items: games.filter(
        (item) => item.genre === genre,
      ),
    }))
    .filter(
      (row) => row.items.length > 0,
    )

  /* =========================================================
     HANDLERS
     ========================================================= */

  const handleSelect = (
    item: MediaItem,
  ) => {
    setSelectedMedia(item)
  }

  const handleAddMedia = (
    newMedia: MediaItem,
  ) => {
    setCollection((current) => [
      ...current,
      newMedia,
    ])
  }

  const handleRemoveMedia = (
  mediaToRemove: MediaItem,
) => {
  const confirmed =
    window.confirm(
      `Remove "${mediaToRemove.title}" from your collection?`,
    )

  if (!confirmed) {
    return
  }

  setCollection((current) =>
    current.filter(
      (item) =>
        item.id !== mediaToRemove.id,
    ),
  )

  setSelectedMedia(null)
}

const handleEditMedia = (
  mediaToEdit: MediaItem,
) => {
  /*
   * We'll connect this to the same media editor
   * in the next step.
   *
   * For now, keep the selected item open so
   * nothing breaks while we wire the editor.
   */
  console.log(
    'Edit media:',
    mediaToEdit,
  )
}

  /*
   * These are passed to AddMediaModal so that the
   * parent remains the source of truth for custom
   * genres and formats.
   */
const handleAddCustomGenre = (
  type: 'movie' | 'game',
  option: CustomOption,
) => {
  if (type === 'movie') {
    setCustomMovieGenres((current) => [
      ...current,
      option,
    ])
  } else {
    setCustomGameGenres((current) => [
      ...current,
      option,
    ])
  }
}

  const handleAddCustomFormat = (
    type: 'movie' | 'game',
    option: CustomOption,
  ) => {
    if (type === 'movie') {
      setCustomMovieFormats((current) => [
        ...current,
        option,
      ])
    } else {
      setCustomGameFormats((current) => [
        ...current,
        option,
      ])
    }
  }

  /* =========================================================
     RENDER ROWS
     ========================================================= */

  const renderRows = () => {
    switch (activeView) {
      case 'movies':
        return (
          <>
            <MediaRow
              title="Recently Added"
              items={recentlyAdded.filter(
                (item) =>
                  item.type === 'movie',
              )}
              onSelect={handleSelect}
            />

            {movieGenreRows.map(
              (row) => (
                <MediaRow
                  key={row.title}
                  title={row.title}
                  items={row.items}
                  onSelect={handleSelect}
                />
              ),
            )}
          </>
        )

      case 'games':
        return (
          <>
            <MediaRow
              title="Recently Added"
              items={recentlyAdded.filter(
                (item) =>
                  item.type === 'game',
              )}
              onSelect={handleSelect}
            />

            {gameGenreRows.map(
              (row) => (
                <MediaRow
                  key={row.title}
                  title={row.title}
                  items={row.items}
                  onSelect={handleSelect}
                />
              ),
            )}
          </>
        )

      case 'favorites':
        return (
          <>
            <MediaRow
              title="Favorites"
              items={favorites}
              onSelect={handleSelect}
            />

            <MediaRow
              title="Favorite Movies"
              items={favorites.filter(
                (item) =>
                  item.type === 'movie',
              )}
              onSelect={handleSelect}
            />

            <MediaRow
              title="Favorite Games"
              items={favorites.filter(
                (item) =>
                  item.type === 'game',
              )}
              onSelect={handleSelect}
            />
          </>
        )

      case 'collection':
      default:
        return (
          <>
            <MediaRow
              title="Recently Added"
              items={recentlyAdded}
              onSelect={handleSelect}
            />

            <MediaRow
              title="Movies"
              items={movies}
              onSelect={handleSelect}
            />

            {movieGenreRows
              .slice(0, 4)
              .map((row) => (
                <MediaRow
                  key={row.title}
                  title={row.title}
                  items={row.items}
                  onSelect={handleSelect}
                />
              ))}

            <MediaRow
              title="Games"
              items={games}
              onSelect={handleSelect}
            />

            {gameGenreRows
              .slice(0, 4)
              .map((row) => (
                <MediaRow
                  key={row.title}
                  title={row.title}
                  items={row.items}
                  onSelect={handleSelect}
                />
              ))}
          </>
        )
    }
  }

  return (
    <div className="room">
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onAddMedia={() =>
          setIsAddMediaOpen(true)
        }
      />

      <main className="room-content">
        <div className="room-glow room-glow-left" />
        <div className="room-glow room-glow-right" />

        <div className="library">
          <div className="bookcase">
            <div className="bookcase-top" />

            <div className="bookcase-content">
              <div className="bookcase-back" />

              <div className="rows">
                {renderRows()}
              </div>
            </div>

            <div className="bookcase-base" />
          </div>
        </div>
      </main>

      {/* =======================================================
          MEDIA DETAIL
          ======================================================= */}

      {selectedMedia && (
       <MediaDetail
  media={selectedMedia}
  onClose={() =>
    setSelectedMedia(null)
  }
  onRemove={handleRemoveMedia}
  onEdit={handleEditMedia}
/>
      )}

      {/* =======================================================
          ADD MEDIA
          ======================================================= */}

      {isAddMediaOpen && (
        <AddMediaModal
          onClose={() =>
            setIsAddMediaOpen(false)
          }
          onAdd={handleAddMedia}
          customMovieGenres={
            customMovieGenres
          }
          customGameGenres={
            customGameGenres
          }
          customMovieFormats={
            customMovieFormats
          }
          customGameFormats={
            customGameFormats
          }
          onAddCustomGenre={
            handleAddCustomGenre
          }
          onAddCustomFormat={
            handleAddCustomFormat
          }
        />
      )}
    </div>
  )
}

export default App