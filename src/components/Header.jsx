import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function Header({ cartCount, onCartClick, onSearchClick, onCategoryClick, onStoryClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuTop, setMenuTop] = useState(60)
  const headerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      if (menuOpen && headerRef.current) {
        setMenuTop(headerRef.current.getBoundingClientRect().bottom)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen) {
      if (headerRef.current) {
        setMenuTop(headerRef.current.getBoundingClientRect().bottom)
      }
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className={`site-header${scrolled ? ' scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}
    >
      <div className="header-inner">
        {/* Mobile Menu Toggle */}
        <button
          className="icon-btn mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <a className="logo-wrap" href="#home" aria-label="ROCKSO home" onClick={() => setMenuOpen(false)}>
          <img src={`${import.meta.env.BASE_URL}rockso-logo.jpg`} alt="ROCKSO™" className="header-logo" />
        </a>

        {/* Desktop / Mobile Nav Drawer */}
        <nav
          className={`main-nav${menuOpen ? ' open' : ''}`}
          aria-label="Main navigation"
          style={menuOpen ? { top: `${menuTop}px`, height: `calc(100dvh - ${menuTop}px)` } : undefined}
        >
          <a
            href="#shop"
            onClick={(e) => {
              setMenuOpen(false)
              if (onCategoryClick) {
                e.preventDefault()
                onCategoryClick('ALL')
              }
            }}
          >
            SHOP ALL
          </a>
          <a
            href="#tshirts"
            onClick={(e) => {
              setMenuOpen(false)
              if (onCategoryClick) {
                e.preventDefault()
                onCategoryClick('T-SHIRTS')
              }
            }}
          >
            T-SHIRTS
          </a>
          <a
            href="#hoodies"
            onClick={(e) => {
              setMenuOpen(false)
              if (onCategoryClick) {
                e.preventDefault()
                onCategoryClick('HOODIES')
              }
            }}
          >
            HOODIES
          </a>
          <a href="#custom-cups" onClick={() => setMenuOpen(false)}>CUSTOM CUPS</a>
          <a
            href="#story"
            onClick={(e) => {
              setMenuOpen(false)
              if (onStoryClick) {
                e.preventDefault()
                onStoryClick()
              }
            }}
          >
            OUR STORY
          </a>
          {menuOpen && (
            <div className="mobile-nav-footer">
              <span>© 2026 ROCKSO™</span>
              <span>DEFINE YOUR OWN.</span>
            </div>
          )}
        </nav>

        {/* Right Icons */}
        <div className="header-right">
          <button className="icon-btn" onClick={onSearchClick} aria-label="Search">
            <Search size={19} />
          </button>
          <button className="cart-button" onClick={onCartClick} aria-label={`Shopping bag with ${cartCount} items`}>
            <ShoppingBag size={19} />
            <span className="cart-label">BAG</span>
            {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
          </button>
        </div>
      </div>
    </header>
  )
}

