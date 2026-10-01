interface HeaderProps {
  activeView:
    | 'collection'
    | 'movies'
    | 'games'
    | 'favorites'

  onViewChange: (
    view:
      | 'collection'
      | 'movies'
      | 'games'
      | 'favorites',
  ) => void

  onAddMedia: () => void

  onAccount: () => void

  userEmail?: string | null
}
function Header({
  activeView,
  onViewChange,
  onAddMedia,
  onAccount,
  userEmail,
}: HeaderProps) {
  const navigation = [
    {
      id: 'collection' as const,
      label: 'Collection',
    },
    {
      id: 'movies' as const,
      label: 'Movies',
    },
    {
      id: 'games' as const,
      label: 'Games',
    },
    {
      id: 'favorites' as const,
      label: 'Favorites',
    },
  ]

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          type="button"
          className="brand-console"
          onClick={() =>
            onViewChange('collection')
          }
          aria-label="Go to collection"
        >
          <span className="brand-light" />

          <span className="brand-mark">
            MEDIA<span>VAULT</span>
          </span>

          <span className="brand-caption">
            PERSONAL MEDIA ARCHIVE
          </span>
        </button>

        <nav
          className="main-nav"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                activeView === item.id
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                onViewChange(item.id)
              }
            >
              <span className="nav-label">
                {item.label}
              </span>

              <span className="nav-indicator" />
            </button>
          ))}
        </nav>

   <div className="header-actions">
  <button
    type="button"
    className="header-account"
    onClick={onAccount}
  >
    <span className="header-account-icon">
      {userEmail
        ? userEmail
            .charAt(0)
            .toUpperCase()
        : '○'}
    </span>

    <span>
      {userEmail
        ? userEmail
        : 'Account'}
    </span>
  </button>

  <button
    type="button"
    className="header-add-media"
    onClick={onAddMedia}
  >
    <span className="header-add-icon">
      +
    </span>

    <span>Add Media</span>
  </button>
</div>
      </div>
    </header>
  )
}

export default Header