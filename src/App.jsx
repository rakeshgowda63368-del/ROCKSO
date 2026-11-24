import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowRight, ChevronRight
} from 'lucide-react'
import Header from './components/Header'
import ProductCard from './components/ProductCard'
import ProductDetailPage from './components/ProductDetailPage'
import OurStoryPage from './components/OurStoryPage'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'
import CustomCupsSection from './components/CustomCupsSection'
import Footer from './components/Footer'
import CheckoutModal from './components/CheckoutModal'
import { products, categories } from './data/products'

export default function App() {
  const [filter, setFilter] = useState('ALL')
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('rockso-cart')
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed)
        ? parsed.map(item => {
            if (item.image && typeof item.image === 'string' && item.image.startsWith('data:') && item.image.length > 30000) {
              return { ...item, image: `${import.meta.env.BASE_URL}product-01.jpg` }
            }
            return item
          })
        : []
    } catch {
      try { localStorage.removeItem('rockso-cart') } catch {}
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickProduct, setQuickProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showStory, setShowStory] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [notice, setNotice] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleCategoryNavigate = (cat) => {
    setFilter(cat)
    setSelectedProduct(null)
    setShowStory(false)
    setTimeout(() => {
      const shopEl = document.getElementById('shop')
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
  }

  const handleOpenStory = () => {
    setSelectedProduct(null)
    setShowStory(true)
    window.location.hash = 'story'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackFromStory = () => {
    setShowStory(false)
    setSelectedProduct(null)
    window.location.hash = 'home'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle hash for product detail page (Flipkart / Amazon style URL) & Story
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash.startsWith('#product/')) {
        const id = hash.replace('#product/', '')
        const found = products.find(p => p.id === id)
        if (found) {
          setSelectedProduct(found)
          setShowStory(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else if (hash === '#story' || hash === '#our-story') {
        setSelectedProduct(null)
        setShowStory(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash === '#tshirts') {
        setSelectedProduct(null)
        setShowStory(false)
        setFilter('T-SHIRTS')
        setTimeout(() => {
          const shopEl = document.getElementById('shop')
          if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      } else if (hash === '#hoodies') {
        setSelectedProduct(null)
        setShowStory(false)
        setFilter('HOODIES')
        setTimeout(() => {
          const shopEl = document.getElementById('shop')
          if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      } else if (hash === '#shop') {
        setSelectedProduct(null)
        setShowStory(false)
        setFilter('ALL')
        setTimeout(() => {
          const shopEl = document.getElementById('shop')
          if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' })
        }, 50)
      } else {
        setSelectedProduct(null)
        setShowStory(false)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    setShowStory(false)
    window.location.hash = `product/${product.id}`
  }

  const handleBackToCatalog = () => {
    setSelectedProduct(null)
    setShowStory(false)
    window.location.hash = 'shop'
  }

  const handleBuyNow = (product, size) => {
    addToCart(product, size)
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  useEffect(() => {
    try {
      // Safe serialization: strip massive base64 images if they exceed safe storage size
      const safeCart = cart.map(item => {
        if (item.image && typeof item.image === 'string' && item.image.startsWith('data:') && item.image.length > 30000) {
          return { ...item, image: `${import.meta.env.BASE_URL}product-01.jpg` }
        }
        return item
      })
      localStorage.setItem('rockso-cart', JSON.stringify(safeCart))
    } catch (err) {
      console.warn('Quota exceeded or failed to persist cart to localStorage:', err)
      try {
        // Fallback: store minimal metadata
        const minimalCart = cart.map(({ id, name, size, price, quantity, color }) => ({
          id, name, size, price, quantity, color, image: `${import.meta.env.BASE_URL}product-01.jpg`
        }))
        localStorage.setItem('rockso-cart', JSON.stringify(minimalCart))
      } catch {
        // Silent catch so app never crashes
      }
    }
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
    const clean = str => (str || '').toUpperCase().replace(/[^A-Z]/g, '')
    return products.filter(p => clean(p.category) === clean(filter))
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
    setCartOpen(false)
    setCheckoutOpen(true)
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
        onCategoryClick={handleCategoryNavigate}
        onStoryClick={handleOpenStory}
      />

      <main>
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={handleBackToCatalog}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
          />
        ) : showStory ? (
          <OurStoryPage
            onBack={handleBackFromStory}
            onExploreShop={() => {
              setShowStory(false)
              handleCategoryNavigate('ALL')
            }}
          />
        ) : (
          <>
            {/* ── HERO ── */}
        <section className="hero" id="home-hero">
          <img src={`${import.meta.env.BASE_URL}hero-bg.jpg`} alt="ROCKSO — Define Your Own" className="hero-img" loading="eager" fetchpriority="high" decoding="sync" />
          <div className="hero-overlay" />

          {/* CTA pinned bottom-left */}
          <div className="hero-cta-block">
            <a className="btn btn-white" href="#shop">
              SHOP THE DROP <ArrowRight size={15} />
            </a>
            <a
              className="btn btn-ghost-light"
              href="#story"
              onClick={(e) => {
                e.preventDefault()
                handleOpenStory()
              }}
            >
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
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              const p = products.find(prod => prod.id === 'rs-polo-001')
              if (p) handleSelectProduct(p)
            }}
            className="featured-card-interactive featured-left"
          >
            <div className="featured-image-wrapper">
              <img src={`${import.meta.env.BASE_URL}product-03.jpg`} alt="Signature Collection" className="featured-img" />
            </div>
            <div className="featured-card-overlay">
              <span className="eyebrow light">LIMITED DROP</span>
              <h3>PLAY BOLD CHAMPION POLO</h3>
              <div className="btn btn-white sm featured-btn">
                VIEW PRODUCT <ArrowRight size={12} />
              </div>
            </div>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              const p = products.find(prod => prod.id === 'rs-hoodie-hassan')
              if (p) handleSelectProduct(p)
            }}
            className="featured-card-interactive featured-right"
          >
            <div className="featured-image-wrapper">
              <img src={`${import.meta.env.BASE_URL}product-02.jpg`} alt="Hoodies & Layers" className="featured-img" />
            </div>
            <div className="featured-card-overlay">
              <span className="eyebrow light">HEAVYWEIGHT</span>
              <h3>NAMMA HASSAN HOODIE</h3>
              <div className="btn btn-white sm featured-btn">
                VIEW PRODUCT <ArrowRight size={12} />
              </div>
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
                onSelectProduct={handleSelectProduct}
              />
            ))}
          </div>
        </section>

        {/* ── STATEMENT ── */}
        <section className="statement">
          <div
            className="statement-bg"
            style={{ backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.jpg)` }}
            aria-hidden="true"
          />
          <div className="statement-overlay" aria-hidden="true" />
          <div className="statement-content">
            <div className="statement-mark">R.</div>
            <p>DON'T FOLLOW THE FIT.<br /><strong>DEFINE YOUR OWN.</strong></p>
            <span>ROCKSO™ · EST. 2026</span>
          </div>
        </section>

        {/* ── CUSTOM DRINKWARE & CUPS CONTAINER ── */}
        <CustomCupsSection
          onAddToCart={addToCart}
          onOpenCart={() => setCartOpen(true)}
        />
          </>
        )}
      </main>

      <Footer
        onCategoryClick={handleCategoryNavigate}
        onStoryClick={handleOpenStory}
      />

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
        onSelectProduct={handleSelectProduct}
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

      {/* ── CHECKOUT & DELIVERY MODAL (Razorpay + WhatsApp / Email replication) ── */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onClearCart={() => {
          setCart([])
          try { localStorage.removeItem('rockso-cart') } catch {}
        }}
      />

      {/* ── NOTICE TOAST ── */}
      {notice && (
        <div className="notice" role="alert">
          {notice}
        </div>
      )}
    </div>
  )
}

