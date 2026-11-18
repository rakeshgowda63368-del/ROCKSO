import { useState, useEffect } from 'react'
import {
  Star, ShieldCheck, Truck, RotateCcw, Tag, Check, ShoppingBag,
  Zap, ArrowLeft, Heart, Share2, MapPin, ChevronRight, CheckCircle2
} from 'lucide-react'

export default function ProductDetailPage({
  product,
  allProducts,
  onBack,
  onAddToCart,
  onBuyNow
}) {
  const [selectedSize, setSelectedSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [pincode, setPincode] = useState('560001')
  const [pincodeChecked, setPincodeChecked] = useState(true)
  const [wished, setWished] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeImage, setActiveImage] = useState(product.image)

  useEffect(() => {
    setActiveImage(product.image)
    setSelectedSize('')
    setSizeError(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [product])

  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null

  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  function handleAdd() {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    onAddToCart(product, selectedSize)
  }

  function handleBuy() {
    if (!selectedSize) {
      setSizeError(true)
      return
    }
    setSizeError(false)
    onBuyNow(product, selectedSize)
  }

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const rating = product.rating || 4.8
  const ratingCount = product.ratingCount || 142

  return (
    <div className="pdp-container">
      {/* ── Breadcrumb & Back ── */}
      <nav className="pdp-breadcrumb-bar" aria-label="Breadcrumb">
        <button className="pdp-back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> BACK TO STORE
        </button>
        <div className="pdp-breadcrumb">
          <span onClick={onBack} className="crumb-link">HOME</span>
          <ChevronRight size={12} />
          <span className="crumb-cat">{product.category.toUpperCase()}</span>
          <ChevronRight size={12} />
          <span className="crumb-current">{product.name}</span>
        </div>
      </nav>

      {/* ── Main PDP Grid ── */}
      <div className="pdp-grid">
        {/* LEFT COLUMN: Gallery */}
        <div className="pdp-gallery-col">
          <div className="pdp-gallery-sticky">
            <div className="pdp-main-image-wrap">
              <img src={activeImage} alt={product.name} className="pdp-main-image" />
              
              {/* Badges */}
              <div className="pdp-image-badges">
                {product.badge && <span className="pdp-badge">{product.badge}</span>}
                <span className="pdp-badge assured">ROCKSO ASSURED</span>
              </div>

              {/* Wishlist & Share buttons */}
              <div className="pdp-image-actions">
                <button
                  className={`pdp-icon-action${wished ? ' active' : ''}`}
                  onClick={() => setWished(!wished)}
                  title="Save to Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart size={18} fill={wished ? '#e11d48' : 'none'} color={wished ? '#e11d48' : '#000'} />
                </button>
                <button
                  className="pdp-icon-action"
                  onClick={handleShare}
                  title="Share product link"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {copied && <span className="pdp-toast">Link Copied!</span>}
            </div>

            {/* Desktop Action Buttons under image (Flipkart style) */}
            <div className="pdp-desktop-actions">
              <button className="btn-pdp-cart" onClick={handleAdd}>
                <ShoppingBag size={18} /> ADD TO BAG
              </button>
              <button className="btn-pdp-buy" onClick={handleBuy}>
                <Zap size={18} /> BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Product Info */}
        <div className="pdp-details-col">
          <div className="pdp-header">
            <span className="pdp-brand">ROCKSO™ STREETWEAR</span>
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-color-label">Color: <strong>{product.color}</strong></p>

            {/* Rating pill (Flipkart green badge style) */}
            <div className="pdp-rating-row">
              <span className="pdp-rating-badge">
                {rating} <Star size={12} fill="#fff" />
              </span>
              <span className="pdp-rating-count">
                {ratingCount.toLocaleString('en-IN')} Ratings & {Math.round(ratingCount * 0.28)} Reviews
              </span>
              <span className="pdp-verified-tag">
                <CheckCircle2 size={13} /> 100% Verified Buyers
              </span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="pdp-price-card">
            <div className="pdp-price-row">
              <span className="pdp-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.compareAt && (
                <>
                  <del className="pdp-mrp">₹{product.compareAt.toLocaleString('en-IN')}</del>
                  <span className="pdp-discount">{discount}% OFF</span>
                </>
              )}
            </div>
            <p className="pdp-tax-note">inclusive of all taxes • Free Shipping on this drop</p>
          </div>

          {/* Flipkart / Amazon Offers Box */}
          <div className="pdp-offers-box">
            <div className="pdp-offers-title">
              <Tag size={16} /> Available Offers & Discounts
            </div>
            <ul className="pdp-offers-list">
              <li>
                <strong>Bank Offer:</strong> 5% Unlimited Cashback on Axis Bank & SBI Credit Cards <span>T&C</span>
              </li>
              <li>
                <strong>Special Price:</strong> Get extra ₹300 off (Price inclusive of discount) <span>T&C</span>
              </li>
              <li>
                <strong>Partner Offer:</strong> Buy 2 or more streetwear items and get an extra 10% instant discount
              </li>
              <li>
                <strong>No Cost EMI:</strong> Available on major credit cards for orders above ₹1,999
              </li>
            </ul>
          </div>

          {/* Size Selector */}
          <div className="pdp-size-section">
            <div className="pdp-size-header">
              <label>Select Size {selectedSize && <strong>({selectedSize})</strong>}</label>
              <button type="button" className="pdp-size-chart-link">
                SIZE GUIDE (CM / INCH)
              </button>
            </div>

            <div className="pdp-size-chips">
              {product.sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  className={`pdp-size-chip${selectedSize === size ? ' active' : ''}`}
                  onClick={() => {
                    setSelectedSize(size)
                    setSizeError(false)
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            {sizeError && (
              <p className="pdp-size-error">
                ⚠️ Please select a size before adding to bag or buying
              </p>
            )}
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="pdp-delivery-card">
            <div className="pdp-delivery-title">
              <MapPin size={16} /> Delivery Options
            </div>
            <div className="pdp-pincode-input-wrap">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="pdp-pincode-input"
              />
              <button
                type="button"
                className="pdp-pincode-btn"
                onClick={() => setPincodeChecked(true)}
              >
                CHECK
              </button>
            </div>

            {pincodeChecked && (
              <div className="pdp-delivery-perks">
                <div className="pdp-perk-row">
                  <Truck size={16} className="perk-icon" />
                  <div>
                    <strong>FREE Delivery</strong> to {pincode || 'your location'} by <strong>Friday, 9 PM</strong>
                  </div>
                </div>
                <div className="pdp-perk-row">
                  <RotateCcw size={16} className="perk-icon" />
                  <div>
                    <strong>7 Days Easy Replacement & Return</strong> if size doesn't fit
                  </div>
                </div>
                <div className="pdp-perk-row">
                  <ShieldCheck size={16} className="perk-icon" />
                  <div>
                    <strong>Cash on Delivery (COD)</strong> available at checkout
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Specifications Table (Flipkart style) */}
          <div className="pdp-specs-box">
            <h3 className="pdp-specs-heading">Product Details & Specifications</h3>
            <p className="pdp-description">{product.description}</p>

            <table className="pdp-specs-table">
              <tbody>
                <tr>
                  <th>Fit</th>
                  <td>Relaxed Oversized Streetwear Silhouette</td>
                </tr>
                <tr>
                  <th>Fabric</th>
                  <td>100% Super-Combed Heavyweight Cotton (300+ GSM)</td>
                </tr>
                <tr>
                  <th>Pattern</th>
                  <td>High-Definition Custom Screen Artwork</td>
                </tr>
                <tr>
                  <th>Occasion</th>
                  <td>Streetwear, Daily Casual, Concerts & Clubbing</td>
                </tr>
                <tr>
                  <th>Wash Care</th>
                  <td>Machine wash cold inside out, tumble dry low, do not iron on print</td>
                </tr>
                <tr>
                  <th>Country of Origin</th>
                  <td>India</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Features list */}
          {product.features && (
            <div className="pdp-features-box">
              <h3>Highlights</h3>
              <ul>
                {product.features.map((feat, i) => (
                  <li key={i}><Check size={14} /> {feat}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews & Ratings Section */}
          <div className="pdp-reviews-box">
            <h3>Customer Ratings & Reviews</h3>
            <div className="pdp-review-summary">
              <div className="pdp-big-score">
                <span className="score-num">{rating}</span>
                <span className="score-stars">★★★★★</span>
                <span className="score-label">{ratingCount} Verified Ratings</span>
              </div>
              <div className="pdp-rating-bars">
                <div className="bar-row">
                  <span>5 ★</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '82%' }}></div></div>
                  <span className="bar-pct">82%</span>
                </div>
                <div className="bar-row">
                  <span>4 ★</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '12%' }}></div></div>
                  <span className="bar-pct">12%</span>
                </div>
                <div className="bar-row">
                  <span>3 ★</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '4%' }}></div></div>
                  <span className="bar-pct">4%</span>
                </div>
                <div className="bar-row">
                  <span>2 ★</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: '1%' }}></div></div>
                  <span className="bar-pct">1%</span>
                </div>
              </div>
            </div>

            {/* Sample Verified Reviews */}
            <div className="pdp-review-cards">
              <div className="pdp-review-item">
                <div className="review-top">
                  <span className="review-stars">★★★★★</span>
                  <span className="review-title">Best streetwear purchase of the year!</span>
                </div>
                <p className="review-body">
                  "The GSM feel is crazy heavy and premium. The graphic on the back is ultra crisp and hasn't faded even after multiple washes. Pure quality."
                </p>
                <div className="review-author">
                  <span>Vikas Gowda</span> • <span className="verified">Verified Buyer</span> • 3 days ago
                </div>
              </div>
              <div className="pdp-review-item">
                <div className="review-top">
                  <span className="review-stars">★★★★★</span>
                  <span className="review-title">Perfect boxy oversized fit</span>
                </div>
                <p className="review-body">
                  "Got size L for oversized look and it sits perfectly on the shoulders. Packaging and tags were also top notch."
                </p>
                <div className="review-author">
                  <span>Pooja R.</span> • <span className="verified">Verified Buyer</span> • 1 week ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── You May Also Like ── */}
      {related.length > 0 && (
        <section className="pdp-related-section">
          <h2>SIMILAR STREETWEAR DROPS</h2>
          <div className="pdp-related-grid">
            {related.map(p => (
              <div
                key={p.id}
                className="pdp-related-card"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                  onBack()
                }}
              >
                <img src={p.image} alt={p.name} />
                <h4>{p.name}</h4>
                <p>₹{p.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Sticky Mobile Bottom Action Bar (Flipkart / Amazon Mobile App Style) ── */}
      <div className="pdp-mobile-sticky-bar">
        <div className="pdp-sticky-price">
          <span className="mobile-price-current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.compareAt && (
            <del className="mobile-price-mrp">₹{product.compareAt.toLocaleString('en-IN')}</del>
          )}
        </div>
        <div className="pdp-sticky-actions">
          <button className="mobile-btn-cart" onClick={handleAdd}>
            <ShoppingBag size={14} /> ADD TO BAG
          </button>
          <button className="mobile-btn-buy" onClick={handleBuy}>
            <Zap size={14} /> BUY NOW
          </button>
        </div>
      </div>
    </div>
  )
}

