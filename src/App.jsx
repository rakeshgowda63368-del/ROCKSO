import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowRight,
  Truck, ShieldCheck, RefreshCw, Award, ChevronRight
} from 'lucide-react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'
import Footer from './components/Footer'
import { products, categories } from './data/products'

export default function App() {
  const [filter, setFilter] = useState('ALL')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rockso-cart') || '[]') } catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickProduct, setQuickProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [notice, setNotice] = useState('')
  const [sizeError, setSizeError] = useState(false)

  useEffect(() => {
    localStorage.setItem('rockso-cart', JSON.stringify(cart))
  }, [cart])

  // Keyboard shortcut for search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setQuickProduct(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const visibleProducts = useMemo(() => {
    if (filter === 'ALL') return products
    return products.filter(p => p.category.toUpperCase() === filter.replace('-', ' '))
  }, [filter])

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  function addToCart(product, size) {
    if (!size) { setSizeError(true); return }
    setSizeError(false)
    setCart(current => {
      const key = `${product.id}-${size}`
      const found = current.find(item => `${item.id}-${item.size}` === key)
      return found
        ? current.map(item =>
            `${item.id}-${item.size}` === key
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...current, { ...product, size, quantity: 1 }]
    })
    setQuickProduct(null)
    setSelectedSize('')
    setCartOpen(true)
  }

  function updateCart(item, delta) {
    setCart(current =>
      current
        .map(p =>
          p.id === item.id && p.size === item.size
            ? { ...p, quantity: p.quantity + delta }
            : p
        )
        .filter(p => p.quantity > 0)
    )
  }

  function checkout() {
    setNotice('Checkout coming soon. Connect Razorpay + shipping before accepting real orders.')
    setCartOpen(false)
    setTimeout(() => setNotice(''), 7000)
  }

  function openQuick(product) {
    setQuickProduct(product)
    setSelectedSize('')
    setSizeError(false)
  }

  return (
    <div id="home">
      {/* Announcement Bar */}
      <div className="announcement">
        <span>FIRST DROP — LIMITED STOCK</span>
      </div>

      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      <main>
        {/* ── HERO ── */}
        <section className="hero" id="home-hero">
          <img src={`${import.meta.env.BASE_URL}hero-bg.jpg`} alt="ROCKSO — Define Your Own" className="hero-img" loading="eager" fetchPriority="high" decoding="sync" />
          <div className="hero-overlay" />

          {/* CTA pinned bottom-left */}
          <div className="hero-cta-block">
            <a className="btn btn-white" href="#shop">
              SHOP THE DROP <ArrowRight size={15} />
            </a>
            <a className="btn btn-ghost-light" href="#story">
              OUR STORY <ChevronRight size={15} />
            </a>
          </div>

          <a href="#shop" className="scroll-cue">
            <ArrowDownRight size={16} /> SCROLL TO DISCOVER
          </a>

          {/* Hero Stats */}
          <div className="hero-stats">
            <div><strong>500+</strong><span>PIECES MADE</span></div>
            <div className="stat-divider" />
            <div><strong>100%</strong><span>COTTON</span></div>
            <div className="stat-divider" />
            <div><strong>EST.</strong><span>2026</span></div>
          </div>
        </section>

        {/* ── BRAND MARQUEE ── */}
        <div className="marquee-wrap" aria-hidden="true">
          <div className="marquee-track">
            {Array(6).fill('DEFINE YOUR OWN · ROCKSO™ · STREETWEAR · ').map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── MANIFESTO ── */}
        <section className="manifesto" id="story">
          <div className="manifesto-bg-watermark">ROCKSO</div>
          <div className="manifesto-inner">
            <div className="manifesto-label">
              <span className="eyebrow">THE ROCKSO MINDSET</span>
              <div className="label-line" />
              <span className="manifesto-est">EST. 2026</span>
            </div>
            <div className="manifesto-text">
              <h2>
                STYLE ISN'T GIVEN.<br />
                <span className="outline-text">IT'S DESIGNED.</span>
              </h2>
              <p className="manifesto-lead">
                We believe what you wear should say something before you do. Our brand is built around individuality, confidence, and uncompromising streetwear silhouettes.
              </p>
              <div className="manifesto-pillars">
                <div className="pillar-item">
                  <strong>01 / RAW</strong>
                  <span>Heavyweight fabrics with unrefined industrial aesthetics.</span>
                </div>
                <div className="pillar-item">
                  <strong>02 / CRAFTED</strong>
                  <span>Engineered boxy cuts built specifically for all-day comfort.</span>
                </div>
                <div className="pillar-item">
                  <strong>03 / UNCOMMON</strong>
                  <span>Limited drops. Built for those who set the trend, never chase it.</span>
                </div>
              </div>
              <div className="manifesto-action">
                <a className="btn btn-black" href="#shop">
                  EXPLORE THE COLLECTION <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED BANNER ── */}
        <section className="featured-banner">
          <div className="featured-left">
            <div className="featured-image featured-img-1" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}product-03.jpg)` }} />
            <div className="featured-card">
              <span className="eyebrow light">DROP 01</span>
              <h3>SIGNATURE COLLECTION</h3>
              <a href="#shop" className="btn btn-white sm">SHOP TEES <ArrowRight size={12} /></a>
            </div>
          </div>
          <div className="featured-right">
            <div className="featured-image featured-img-2" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}product-02.jpg)` }} />
            <div className="featured-card">
              <span className="eyebrow light">HEAVYWEIGHT</span>
              <h3>HOODIES & LAYERS</h3>
              <a href="#shop" className="btn btn-white sm">SHOP HOODIES <ArrowRight size={12} /></a>
            </div>
          </div>
        </section>

        {/* ── SHOP SECTION ── */}
        <section className="shop-section" id="shop">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE FIRST EDIT</span>
              <h2>SHOP THE DROP<span className="tm">™</span></h2>
            </div>
            <p>Everyday essentials.<br />Unmistakable attitude.</p>
          </div>

          {/* Category Filters */}
          <div className="filters" role="tablist">
            {categories.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={filter === cat}
                className={filter === cat ? 'active' : ''}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="product-grid">
            {visibleProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={openQuick}
              />
            ))}
          </div>

          <p className="demo-note">
            ⚠ DEMO PRODUCTS & PLACEHOLDER IMAGES — Replace with your real ROCKSO inventory before launch.
          </p>
        </section>

        {/* ── STATEMENT ── */}
        <section className="statement">
          <div className="statement-mark">R.</div>
          <p>DON'T FOLLOW THE FIT.<br /><strong>DEFINE YOUR OWN.</strong></p>
          <span>ROCKSO™ · EST. 2026</span>
        </section>

        {/* ── PERKS ── */}
        <section className="perks">
          <div className="perk">
            <div className="perk-icon"><Truck size={22} /></div>
            <h3>PAN-INDIA DELIVERY</h3>
            <p>Free shipping on orders over ₹1,999</p>
          </div>
          <div className="perk">
            <div className="perk-icon"><ShieldCheck size={22} /></div>
            <h3>SECURE CHECKOUT</h3>
            <p>Razorpay & UPI integration coming soon</p>
          </div>
          <div className="perk">
            <div className="perk-icon"><RefreshCw size={22} /></div>
            <h3>EASY RETURNS</h3>
            <p>7-day hassle-free return policy</p>
          </div>
          <div className="perk">
            <div className="perk-icon"><Award size={22} /></div>
            <h3>PREMIUM QUALITY</h3>
            <p>320+ GSM cotton, built to last</p>
          </div>
        </section>

        {/* ── INSTAGRAM STRIP ── */}
        <section className="insta-strip">
          <div className="insta-heading">
            <span className="eyebrow">FOLLOW THE MOVEMENT</span>
            <h2>@ROCKSO_OFFICIAL</h2>
          </div>
          <div className="insta-grid">
            {[
              'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=400&q=80',
              'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80',
            ].map((src, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="insta-cell"
                aria-label="View on Instagram"
              >
                <img src={src} alt="" loading="lazy" />
                <div className="insta-hover">
                  <span>VIEW</span>
                </div>
              </a>
            ))}
          </div>
          <a
            className="btn btn-black insta-cta"
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            FOLLOW @ROCKSO_OFFICIAL
          </a>
        </section>
      </main>

      <Footer />

      {/* ── CART DRAWER ── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdate={updateCart}
        onCheckout={checkout}
      />

      {/* ── SEARCH OVERLAY ── */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ── QUICK ADD MODAL ── */}
      {quickProduct && (
        <div
          className="modal-backdrop"
          onClick={() => setQuickProduct(null)}
          role="dialog"
          aria-label={`Quick add ${quickProduct.name}`}
          aria-modal="true"
        >
          <div className="quick-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setQuickProduct(null)} aria-label="Close">
              ×
            </button>
            <div className="quick-modal-img">
              <img src={quickProduct.image} alt={quickProduct.name} />
              {quickProduct.badge && <span className="product-badge">{quickProduct.badge}</span>}
            </div>
            <div className="quick-modal-info">
              <span className="eyebrow">{quickProduct.category}</span>
              <h2>{quickProduct.name}</h2>
              <div className="quick-price">
                <strong>₹{quickProduct.price.toLocaleString('en-IN')}</strong>
                {quickProduct.compareAt && (
                  <del>₹{quickProduct.compareAt.toLocaleString('en-IN')}</del>
                )}
              </div>
              <p>{quickProduct.description}</p>

              <label>SELECT SIZE {sizeError && <span className="size-err">— Please select a size</span>}</label>
              <div className="size-options">
                {quickProduct.sizes.map(size => (
                  <button
                    key={size}
                    className={selectedSize === size ? 'selected' : ''}
                    onClick={() => { setSelectedSize(size); setSizeError(false) }}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-black full"
                onClick={() => addToCart(quickProduct, selectedSize)}
              >
                ADD TO BAG
              </button>
              <p className="quick-modal-note">Free shipping on orders over ₹1,999</p>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTICE TOAST ── */}
      {notice && (
        <div className="notice" role="alert">
          {notice}
        </div>
      )}
    </div>
  )
}

