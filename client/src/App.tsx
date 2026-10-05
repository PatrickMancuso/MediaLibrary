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


interface MediaItemRow {
  id: string
  user_id: string

  title: string
  type: 'movie' | 'game'
  format: string
  year: number
  genre: string
  description: string
  favorite: boolean
  orientation: 'spine' | 'cover'

  spine_image: string | null
  cover_image: string | null

  source:
    | 'tmdb'
    | 'igdb'
    | 'manual'
    | null

  external_id: string | null

  backdrop_image: string | null
  logo_image: string | null

  release_date: string | null
  rating: number | null
  runtime: number | null

  director: string | null

  cast_members: string[] | null
  production_companies: string[] | null
  countries: string[] | null
  languages: string[] | null

  developers: string[] | null
  publishers: string[] | null
  platforms: string[] | null
  game_modes: string[] | null
  player_perspectives: string[] | null
  themes: string[] | null

  screenshots: string[] | null

  videos:
    | MediaItem['videos']
    | null

  created_at: string
  updated_at: string
}

function rowToMediaItem(
  row: MediaItemRow,
): MediaItem {
  return {
    id: row.id,

    title: row.title,

    type: row.type,

    format: row.format,

    year: row.year,

    genre: row.genre,

    description: row.description,

    favorite: row.favorite,

    orientation: row.orientation,

    spineImage:
      row.spine_image ?? undefined,

    coverImage:
      row.cover_image ?? undefined,

    source:
      row.source ?? undefined,

    externalId:
      row.external_id ?? undefined,

    backdropImage:
      row.backdrop_image ?? undefined,

    logoImage:
      row.logo_image ?? undefined,

    releaseDate:
      row.release_date ?? undefined,

    rating:
      row.rating ?? undefined,

    runtime:
      row.runtime ?? undefined,

    director:
      row.director ?? undefined,

    cast:
      row.cast_members ?? undefined,

    productionCompanies:
      row.production_companies ??
      undefined,

    countries:
      row.countries ?? undefined,

    languages:
      row.languages ?? undefined,

    developers:
      row.developers ?? undefined,

    publishers:
      row.publishers ?? undefined,

    platforms:
      row.platforms ?? undefined,

    gameModes:
      row.game_modes ?? undefined,

    playerPerspectives:
      row.player_perspectives ??
      undefined,

    themes:
      row.themes ?? undefined,

    screenshots:
      row.screenshots ?? undefined,

    videos:
      row.videos ?? undefined,
  }
}


function mediaItemToRow(
  media: MediaItem,
  userId: string,
) {
  return {
    id: media.id,
    user_id: userId,

    title: media.title,
    type: media.type,
    format: media.format,
    year: media.year,
    genre: media.genre,
    description: media.description,
    favorite: media.favorite,
    orientation: media.orientation,

    spine_image:
      media.spineImage ?? null,

    cover_image:
      media.coverImage ?? null,

    source:
      media.source ?? null,

    external_id:
      media.externalId ?? null,

    backdrop_image:
      media.backdropImage ?? null,

    logo_image:
      media.logoImage ?? null,

    release_date:
      media.releaseDate ?? null,

    rating:
      media.rating ?? null,

    runtime:
      media.runtime ?? null,

    director:
      media.director ?? null,

    cast_members:
      media.cast ?? null,

    production_companies:
      media.productionCompanies ?? null,

    countries:
      media.countries ?? null,

    languages:
      media.languages ?? null,

    developers:
      media.developers ?? null,

    publishers:
      media.publishers ?? null,

    platforms:
      media.platforms ?? null,

    game_modes:
      media.gameModes ?? null,

    player_perspectives:
      media.playerPerspectives ?? null,

    themes:
      media.themes ?? null,

    screenshots:
      media.screenshots ?? null,

    videos:
      media.videos ?? null,
  }
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

    const [user, setUser] =
  useState<User | null>(null)

const [isAuthModalOpen, setIsAuthModalOpen] =
  useState(false)

const [authLoading, setAuthLoading] =
  useState(true)

const [collection, setCollection] =
  useState<MediaItem[]>([])

const [
  collectionLoading,
  setCollectionLoading,
] = useState(true)

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
  let cancelled = false

  const loadCollection =
    async () => {
      if (authLoading) {
        return
      }

      if (!user) {
        setCollection([])
        setCollectionLoading(false)

        return
      }

      setCollectionLoading(true)

      const {
        data,
        error,
      } = await supabase
        .from('media_items')
        .select('*')
        .order(
          'created_at',
          {
            ascending: true,
          },
        )

      if (cancelled) {
        return
      }

      if (error) {
        console.error(
          'Failed to load collection from Supabase:',
          error,
        )

        setCollection([])
        setCollectionLoading(false)

        return
      }

      const items =
        (data ?? []).map(
          (row) =>
            rowToMediaItem(
              row as MediaItemRow,
            ),
        )

      setCollection(items)
      setCollectionLoading(false)
    }

  void loadCollection()

  return () => {
    cancelled = true
  }
}, [
  user,
  authLoading,
])

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

 const handleAddMedia = async (
  newMedia: MediaItem,
) => {
  if (!user) {
    console.error(
      'Cannot add media without a signed-in user.',
    )

    return
  }

  const row =
    mediaItemToRow(
      newMedia,
      user.id,
    )

  const {
    data,
    error,
  } = await supabase
    .from('media_items')
    .insert(row)
    .select()
    .single()

  if (error) {
    console.error(
      'Failed to save media to Supabase:',
      error,
    )

    window.alert(
      'Unable to save this media item. Please try again.',
    )

    return
  }

  const savedMedia =
    rowToMediaItem(
      data as MediaItemRow,
    )

  setCollection(
    (current) => [
      ...current,
      savedMedia,
    ],
  )
}



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

{collectionLoading ? (
  <div className="collection-loading">
    Loading your collection...
  </div>
) : activeView === 'collection' ? (
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