export type MediaType = 'movie' | 'game'

export type MediaFormat =
  | 'vhs'
  | 'dvd'
  | 'bluray'
  | 'laserdisc'
  | 'nes'
  | 'ps1'
  | 'xbox360'

export type MediaOrientation = 'spine' | 'cover'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  format: MediaFormat
  year: number
  genre: string
  description: string
  favorite: boolean

  /*
   * spine = upright physical case
   * cover = title displayed horizontally with cover facing forward
   */
  orientation: MediaOrientation
}

export const media: MediaItem[] = [
  // =====================================================
  // MOVIES
  // =====================================================

  {
    id: 'dune',
    title: 'Dune',
    type: 'movie',
    format: 'bluray',
    year: 2021,
    genre: 'Sci-Fi',
    description:
      'Paul Atreides arrives on the dangerous desert planet Arrakis, becoming caught in a conflict surrounding its precious resources and the future of his family.',
    favorite: true,
    orientation: 'spine',
  },

  {
    id: 'alien',
    title: 'Alien',
    type: 'movie',
    format: 'vhs',
    year: 1979,
    genre: 'Horror',
    description:
      'A deep-space mining crew encounters an unknown lifeform aboard their ship, turning a routine mission into a fight for survival.',
    favorite: true,
    orientation: 'spine',
  },

  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    type: 'movie',
    format: 'bluray',
    year: 2017,
    genre: 'Sci-Fi',
    description:
      'A young blade runner uncovers a long-buried secret that leads him on a search for a former LAPD blade runner who has been missing for decades.',
    favorite: true,
    orientation: 'spine',
  },

  {
    id: 'matrix',
    title: 'The Matrix',
    type: 'movie',
    format: 'dvd',
    year: 1999,
    genre: 'Sci-Fi',
    description:
      'A computer hacker discovers that reality is not what it appears to be and is drawn into a hidden conflict between humanity and intelligent machines.',
    favorite: false,
    orientation: 'spine',
  },

  {
    id: 'interstellar',
    title: 'Interstellar',
    type: 'movie',
    format: 'bluray',
    year: 2014,
    genre: 'Sci-Fi',
    description:
      'A former pilot joins a mission through a wormhole in search of a new home for humanity as Earth becomes increasingly uninhabitable.',
    favorite: true,
    orientation: 'cover',
  },

  {
    id: 'jurassic-park',
    title: 'Jurassic Park',
    type: 'movie',
    format: 'vhs',
    year: 1993,
    genre: 'Adventure',
    description:
      'A theme park filled with genetically engineered dinosaurs becomes a fight for survival after the creatures escape containment.',
    favorite: false,
    orientation: 'spine',
  },

  {
    id: 'dark-knight',
    title: 'The Dark Knight',
    type: 'movie',
    format: 'dvd',
    year: 2008,
    genre: 'Action',
    description:
      'Batman faces a criminal mastermind who pushes Gotham City and its defenders toward increasingly dangerous choices.',
    favorite: true,
    orientation: 'spine',
  },

  {
    id: 'pulp-fiction',
    title: 'Pulp Fiction',
    type: 'movie',
    format: 'vhs',
    year: 1994,
    genre: 'Crime',
    description:
      'Several interconnected stories of criminals, small-time hustlers, and unexpected encounters unfold across Los Angeles.',
    favorite: false,
    orientation: 'spine',
  },

  {
    id: 'spider-verse',
    title: 'Spider-Man: Into the Spider-Verse',
    type: 'movie',
    format: 'bluray',
    year: 2018,
    genre: 'Animation',
    description:
      'Miles Morales discovers a world of alternate Spider-People and learns what it means to become a hero of his own.',
    favorite: false,
    orientation: 'spine',
  },

  {
    id: 'everything-everywhere',
    title: 'Everything Everywhere All at Once',
    type: 'movie',
    format: 'dvd',
    year: 2022,
    genre: 'Comedy',
    description:
      'An overwhelmed woman discovers that she must connect with alternate versions of herself across the multiverse.',
    favorite: true,
    orientation: 'cover',
  },

  // =====================================================
  // GAMES
  // =====================================================

  {
    id: 'elden-ring',
    title: 'Elden Ring',
    type: 'game',
    format: 'ps1',
    year: 2022,
    genre: 'RPG',
    description:
      'Explore a vast interconnected world filled with ancient ruins, dangerous creatures, powerful enemies, and countless hidden paths.',
    favorite: true,
    orientation: 'spine',
  },

  {
    id: 'last-of-us',
    title: 'The Last of Us',
    type: 'game',
    format: 'ps1',
    year: 2013,
    genre: 'Adventure',
    description:
      'Joel and Ellie travel across a devastated United States while forming an unlikely bond in a world transformed by catastrophe.',
    favorite: true,
    orientation: 'cover',
  },

  {
    id: 'red-dead-redemption-2',
    title: 'Red Dead Redemption 2',
    type: 'game',
    format: 'xbox360',
    year: 2018,
    genre: 'Open World',
    description:
      'Follow Arthur Morgan and the Van der Linde gang as they attempt to survive a changing American frontier.',
    favorite: true,
    orientation: 'spine',
  },

  {
    id: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    type: 'game',
    format: 'xbox360',
    year: 2020,
    genre: 'RPG',
    description:
      'Step into Night City as V, a mercenary caught between powerful corporations, criminals, and a mysterious digital personality.',
    favorite: false,
    orientation: 'spine',
  },

  {
    id: 'hollow-knight',
    title: 'Hollow Knight',
    type: 'game',
    format: 'nes',
    year: 2017,
    genre: 'Indie',
    description:
      'Journey through a ruined underground kingdom filled with ancient secrets, strange creatures, and challenging battles.',
    favorite: true,
    orientation: 'spine',
  },

  {
    id: 'skyrim',
    title: 'The Elder Scrolls V: Skyrim',
    type: 'game',
    format: 'xbox360',
    year: 2011,
    genre: 'RPG',
    description:
      'Explore the province of Skyrim as the legendary Dragonborn and shape the fate of a land caught in civil war.',
    favorite: false,
    orientation: 'spine',
  },

  {
    id: 'portal-2',
    title: 'Portal 2',
    type: 'game',
    format: 'nes',
    year: 2011,
    genre: 'Puzzle',
    description:
      'Use portals, physics, and increasingly elaborate machinery to escape a mysterious laboratory while uncovering its history.',
    favorite: false,
    orientation: 'spine',
  },

  {
    id: 'breath-of-the-wild',
    title: 'The Legend of Zelda: Breath of the Wild',
    type: 'game',
    format: 'nes',
    year: 2017,
    genre: 'Adventure',
    description:
      'Awaken in a mysterious land and explore the open world of Hyrule while uncovering the events of a forgotten past.',
    favorite: true,
    orientation: 'cover',
  },
]

export const recentlyAdded = [
  media.find((item) => item.id === 'breath-of-the-wild')!,
  media.find((item) => item.id === 'interstellar')!,
  media.find((item) => item.id === 'dune')!,
  media.find((item) => item.id === 'elden-ring')!,
  media.find((item) => item.id === 'alien')!,
  media.find((item) => item.id === 'last-of-us')!,
  media.find((item) => item.id === 'blade-runner-2049')!,
  media.find((item) => item.id === 'matrix')!,
]

export const movieGenres = [
  'Sci-Fi',
  'Action',
  'Adventure',
  'Horror',
  'Crime',
  'Animation',
  'Comedy',
]

export const gameGenres = [
  'RPG',
  'Adventure',
  'Open World',
  'Indie',
  'Puzzle',
]