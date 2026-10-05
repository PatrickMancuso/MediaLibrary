import { useEffect, useRef, useState } from 'react'

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

  onSignOut: () => void

  userEmail?: string | null
}

function Header({
  activeView,
  onViewChange,
  onAddMedia,
  onAccount,
  onSignOut,
  userEmail,
}: HeaderProps) {
  const [
    isAccountMenuOpen,
    setIsAccountMenuOpen,
  ] = useState(false)

  const accountMenuRef =
    useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      )
    }
  }, [])

  const handleAccountClick = () => {
    if (!userEmail) {
      onAccount()
      return
    }

    setIsAccountMenuOpen(
      (current) => !current,
    )
  }

  const handleSignOut = () => {
    setIsAccountMenuOpen(false)
    onSignOut()
  }

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
            className="header-add-media"
            onClick={onAddMedia}
          >
            <span className="header-add-icon">
              +
            </span>

            <span>Add Media</span>
          </button>

          <button
            type="button"
            className="header-settings"
            onClick={() => {
              // Placeholder for future settings
            }}
          >
            <span className="header-settings-icon">
              ⚙
            </span>

            <span>Settings</span>
          </button>

          <div
            className="header-account-wrapper"
            ref={accountMenuRef}
          >
            <button
              type="button"
              className="header-account"
              onClick={
                handleAccountClick
              }
              aria-expanded={
                userEmail
                  ? isAccountMenuOpen
                  : undefined
              }
              aria-haspopup={
                userEmail
                  ? 'menu'
                  : undefined
              }
            >
              <span className="header-account-icon">
                {userEmail
                  ? userEmail
                      .charAt(0)
                      .toUpperCase()
                  : '○'}
              </span>

              <span className="header-account-label">
                {userEmail ??
                  'Account'}
              </span>

              {userEmail && (
                <span
                  className={
                    isAccountMenuOpen
                      ? 'header-account-arrow open'
                      : 'header-account-arrow'
                  }
                >
                  ▾
                </span>
              )}
            </button>

            {userEmail &&
              isAccountMenuOpen && (
                <div
                  className="account-menu"
                  role="menu"
                >
                  <div className="account-menu-email">
                    {userEmail}
                  </div>

                  <div className="account-menu-divider" />

                  <button
                    type="button"
                    className="account-menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountMenuOpen(
                        false,
                      )

                      onAccount()
                    }}
                  >
                    <span>
                      Account Settings
                    </span>

                    <span>›</span>
                  </button>

                  <div className="account-menu-divider" />

                  <button
                    type="button"
                    className="account-menu-item account-menu-signout"
                    role="menuitem"
                    onClick={
                      handleSignOut
                    }
                  >
                    <span>
                      Sign Out
                    </span>
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header