import { useState } from 'react'
import Header from './components/Header'
import MediaDetail from './components/MediaDetail'
import MediaRow from './components/MediaRow'
import {
  gameGenres,
  media,
  movieGenres,
  recentlyAdded,
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

  const [selectedMedia, setSelectedMedia] =
    useState<MediaItem | null>(null)

  const movies = media.filter(
    (item) => item.type === 'movie',
  )

  const games = media.filter(
    (item) => item.type === 'game',
  )

  const favorites = media.filter(
    (item) => item.favorite,
  )

  const movieGenreRows = movieGenres
    .map((genre) => ({
      title: genre,
      items: movies.filter(
        (item) => item.genre === genre,
      ),
    }))
    .filter((row) => row.items.length > 0)

  const gameGenreRows = gameGenres
    .map((genre) => ({
      title: genre,
      items: games.filter(
        (item) => item.genre === genre,
      ),
    }))
    .filter((row) => row.items.length > 0)

  const handleSelect = (item: MediaItem) => {
    setSelectedMedia(item)
  }

  const renderRows = () => {
    switch (activeView) {
      case 'movies':
        return (
          <>
            <MediaRow
              title="Recently Added"
              items={recentlyAdded.filter(
                (item) => item.type === 'movie',
              )}
              onSelect={handleSelect}
            />

            {movieGenreRows.map((row) => (
              <MediaRow
                key={row.title}
                title={row.title}
                items={row.items}
                onSelect={handleSelect}
              />
            ))}
          </>
        )

      case 'games':
        return (
          <>
            <MediaRow
              title="Recently Added"
              items={recentlyAdded.filter(
                (item) => item.type === 'game',
              )}
              onSelect={handleSelect}
            />

            {gameGenreRows.map((row) => (
              <MediaRow
                key={row.title}
                title={row.title}
                items={row.items}
                onSelect={handleSelect}
              />
            ))}
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
                (item) => item.type === 'movie',
              )}
              onSelect={handleSelect}
            />

            <MediaRow
              title="Favorite Games"
              items={favorites.filter(
                (item) => item.type === 'game',
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

            {movieGenreRows.slice(0, 4).map((row) => (
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

            {gameGenreRows.slice(0, 4).map((row) => (
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

      {selectedMedia && (
        <MediaDetail
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  )
}

export default App