import { Coffee, ShoppingBag } from 'lucide-react'

export default function CustomCupsSection({ onAddToCart, onOpenCart }) {
  const cup = {
    id: 'cup-custom-ceramic',
    name: 'ROCKSO™ Customized Ceramic Mug (350ml)',
    type: 'Custom Ceramic Mug',
    price: 399,
    compareAt: 599,
    badge: 'CUSTOMIZABLE',
    capacity: '350 ml',
    material: '100% Food-Grade Stoneware Ceramic',
    image: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?auto=format&fit=crop&w=700&q=80'
  }

  const discount = Math.round(((cup.compareAt - cup.price) / cup.compareAt) * 100)

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: `${cup.id}-${Date.now()}`,
          name: cup.name,
          category: 'Accessories',
          price: cup.price,
          compareAt: cup.compareAt,
          badge: cup.badge,
          color: 'Pure White',
          image: cup.image,
          description: 'Customized 350ml Stoneware Ceramic Mug. 360° permanent sublimation wrap, microwave and dishwasher safe.'
        },
        '350ml'
      )
      if (onOpenCart) onOpenCart()
    }
  }

  return (
    <section className="cups-section" id="custom-cups">
      {/* ── Section Header ── */}
      <div className="cups-header">
        <div className="cups-badge">
          <Coffee size={14} /> ROCKSO™ DRINKWARE LAB
        </div>
        <h2 className="cups-title">CUSTOMIZED CUPS AVAILABLE</h2>
        <p className="cups-subtitle">
          Premium 360° permanent sublimation on stoneware ceramic mugs. Printed with official ROCKSO™ graphics or customized with your desired logo.
        </p>
      </div>

      {/* ── Single Mug Showcase ── */}
      <div className="cups-catalog-grid">
        <div className="cup-product-card single-showcase">
          <div className="cup-image-wrap">
            <img src={cup.image} alt={cup.name} loading="lazy" />
            <span className="cup-badge">{cup.badge}</span>
            <span className="cup-capacity-tag">{cup.capacity}</span>
          </div>

          <div className="cup-details">
            <div className="cup-type-meta">
              <span>{cup.type.toUpperCase()}</span>
              <small>{cup.material}</small>
            </div>

            <h3 className="cup-name">{cup.name}</h3>

            <div className="cup-price-row">
              <div className="cup-price-box">
                <span className="cup-current-price">₹{cup.price.toLocaleString('en-IN')}</span>
                <del className="cup-mrp">₹{cup.compareAt.toLocaleString('en-IN')}</del>
                <span className="cup-discount-pill">{discount}% OFF</span>
              </div>

              <button
                type="button"
                className="cup-add-btn"
                onClick={handleAddToCart}
                aria-label={`Add ${cup.name} to bag`}
              >
                <ShoppingBag size={14} /> ADD TO BAG
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
