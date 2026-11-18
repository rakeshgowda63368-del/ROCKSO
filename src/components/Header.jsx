import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header({ cartCount, onCartClick, onSearchClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-inner">
        {/* Mobile Menu Toggle */}
        <button
          className="icon-btn mobile-menu"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <a className="logo-wrap" href="#home" aria-label="ROCKSO home">
          <img src={`${import.meta.env.BASE_URL}rockso-logo.jpg`} alt="ROCKSO™" className="header-logo" />
        </a>

        {/* Desktop Nav */}
        <nav className={`main-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
          <a href="#shop" onClick={() => setMenuOpen(false)}>SHOP ALL</a>
          <a href="#tshirts" onClick={() => setMenuOpen(false)}>T-SHIRTS</a>
          <a href="#hoodies" onClick={() => setMenuOpen(false)}>HOODIES</a>
          <a href="#bottoms" onClick={() => setMenuOpen(false)}>BOTTOMS</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>OUR STORY</a>
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

