import { useMemo, useState } from 'react'
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

function App() {
  const [activeView, setActiveView] =
    useState<View>('collection')

  const [collection, setCollection] =
    useState<MediaItem[]>(sampleMedia)

  const [selectedMedia, setSelectedMedia] =
    useState<MediaItem | null>(null)

  const [isAddMediaOpen, setIsAddMediaOpen] =
    useState(false)

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

  const recentlyAdded = useMemo(
    () => [...collection].slice(-8).reverse(),
    [collection],
  )

  const movieGenreRows = movieGenres
    .map((genre) => ({
      title: genre,
      items: movies.filter(
        (item) => item.genre === genre,
      ),
    }))
    .filter(
      (row) => row.items.length > 0,
    )

  const gameGenreRows = gameGenres
    .map((genre) => ({
      title: genre,
      items: games.filter(
        (item) => item.genre === genre,
      ),
    }))
    .filter(
      (row) => row.items.length > 0,
    )

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
                  onSelect={
                    handleSelect
                  }
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
                  onSelect={
                    handleSelect
                  }
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
                  item.type ===
                  'movie',
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
                  onSelect={
                    handleSelect
                  }
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
                  onSelect={
                    handleSelect
                  }
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
      />

      <main className="room-content">
        <div className="room-glow room-glow-left" />
        <div className="room-glow room-glow-right" />

        <div className="library">
          <div className="library-controls">
  <button
    type="button"
    className="add-button"
    onClick={() =>
      setIsAddMediaOpen(true)
    }
  >
    <span>+</span>
    Add Media
  </button>
</div>
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

      {selectedMedia && (
        <MediaDetail
          media={selectedMedia}
          onClose={() =>
            setSelectedMedia(null)
          }
        />
      )}

      {isAddMediaOpen && (
        <AddMediaModal
          onClose={() =>
            setIsAddMediaOpen(false)
          }
          onAdd={handleAddMedia}
        />
      )}
    </div>
  )
}

export default App