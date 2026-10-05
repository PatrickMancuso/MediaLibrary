import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { User } from '@supabase/supabase-js'

import Header from './components/Header'
import MediaDetail from './components/MediaDetail'
import MediaRow from './components/MediaRow'
import AuthModal from './components/AuthModal'
import { supabase } from './lib/supabase'
import AddMediaModal from './components/AddMediaModal'
import CollectionDashboard from './components/CollectionDashboard'

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
collection: 'media-library-collection',
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

function loadStoredCollection(): MediaItem[] {
  try {
    const saved = localStorage.getItem(
      STORAGE_KEYS.collection,
    )

    if (!saved) {
      return sampleMedia
    }

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return sampleMedia
    }

    return parsed as MediaItem[]
  } catch {
    return sampleMedia
  }
}

function App() {
  const [activeView, setActiveView] =
    useState<View>('collection')

    const [user, setUser] =
  useState<User | null>(null)

const [isAuthModalOpen, setIsAuthModalOpen] =
  useState(false)

const [authLoading, setAuthLoading] =
  useState(true)

 const [collection, setCollection] =
  useState<MediaItem[]>(
    loadStoredCollection,
  )

  useEffect(() => {
  let mounted = true

  supabase.auth.getSession().then(
    ({ data }) => {
      if (!mounted) {
        return
      }

      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    },
  )

  const {
    data: authListener,
  } =
    supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user ?? null,
        )

        setAuthLoading(false)
      },
    )

  return () => {
    mounted = false

    authListener.subscription.unsubscribe()
  }
}, [])

useEffect(() => {
  try {
   localStorage.setItem(
  STORAGE_KEYS.collection,
  JSON.stringify(collection),
)
  } catch (error) {
    console.error(
      'Failed to save collection:',
      error,
    )
  }
}, [collection])

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


const testSupabaseInsert = async () => {
  if (!user) {
    console.error(
      'You must be signed in to test Supabase.',
    )

    return
  }

  const testItem =
    collection[0]

  if (!testItem) {
    console.error(
      'No media item is available to test.',
    )

    return
  }

  const {
    data,
    error,
  } = await supabase
    .from('media_items')
    .insert({
      user_id:
        user.id,

      title:
        testItem.title,

      type:
        testItem.type,

      format:
        testItem.format,

      year:
        testItem.year,

      genre:
        testItem.genre,

      description:
        testItem.description,

      favorite:
        testItem.favorite,

      orientation:
        testItem.orientation,

      spine_image:
        testItem.spineImage ??
        null,

      cover_image:
        testItem.coverImage ??
        null,

      source:
        testItem.source ??
        null,

      external_id:
        testItem.externalId ??
        null,

      backdrop_image:
        testItem.backdropImage ??
        null,

      logo_image:
        testItem.logoImage ??
        null,

      release_date:
        testItem.releaseDate ??
        null,

      rating:
        testItem.rating ??
        null,

      runtime:
        testItem.runtime ??
        null,

      director:
        testItem.director ??
        null,

      cast_members:
        testItem.cast ??
        null,

      production_companies:
        testItem.productionCompanies ??
        null,

      countries:
        testItem.countries ??
        null,

      languages:
        testItem.languages ??
        null,

      developers:
        testItem.developers ??
        null,

      publishers:
        testItem.publishers ??
        null,

      platforms:
        testItem.platforms ??
        null,

      game_modes:
        testItem.gameModes ??
        null,

      player_perspectives:
        testItem.playerPerspectives ??
        null,

      themes:
        testItem.themes ??
        null,

      screenshots:
        testItem.screenshots ??
        null,

      videos:
        testItem.videos ??
        null,
    })
    .select()
    .single()

  if (error) {
    console.error(
      'Supabase insert test failed:',
      error,
    )

    return
  }

  console.log(
    'Supabase insert test succeeded:',
    data,
  )
}


useEffect(() => {
  const testWindow =
    window as typeof window & {
      testSupabaseInsert?: () => Promise<void>
    }

  testWindow.testSupabaseInsert =
    testSupabaseInsert

  return () => {
    delete testWindow.testSupabaseInsert
  }
}, [
  user,
  collection,
])

  const handleSignOut = async () => {
  const {
    error,
  } = await supabase.auth.signOut()

  if (error) {
    console.error(
      'Failed to sign out:',
      error,
    )

    return
  }

  setIsAuthModalOpen(false)
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

      
    }
  }

const renderCollectionDashboard = () => (
  <CollectionDashboard
    recentlyAdded={recentlyAdded}
    movies={movies}
    games={games}
    favorites={favorites}
    onSelect={handleSelect}
    onViewChange={setActiveView}
  />
)

  return (
    <div className="room">
      <Header
  activeView={activeView}
  onViewChange={setActiveView}
  onAddMedia={() =>
    setIsAddMediaOpen(true)
  }
  onAccount={() => {
    if (user) {
      void handleSignOut()
    } else {
      setIsAuthModalOpen(true)
    }
  }}
  userEmail={
    user?.email ?? null
  }
/>

      <main className="room-content">
        <div className="room-glow room-glow-left" />
        <div className="room-glow room-glow-right" />

        {activeView === 'collection' ? (
  renderCollectionDashboard()
) : (
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
)}
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


{isAuthModalOpen && !authLoading && (
  <AuthModal
    onClose={() =>
      setIsAuthModalOpen(false)
    }
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