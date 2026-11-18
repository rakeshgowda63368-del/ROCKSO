import { Plus, Heart } from 'lucide-react'
import { useState } from 'react'

export default function ProductCard({ product, onQuickAdd, onSelectProduct }) {
  const [wished, setWished] = useState(false)
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : null

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product)
    }
  }

  return (
    <article
      className="product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />

        {/* Badges */}
        <div className="badge-row">
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {discount && <span className="product-badge discount">−{discount}%</span>}
        </div>

        {/* Wishlist */}
        <button
          className={`wishlist-btn${wished ? ' active' : ''}`}
          onClick={(e) => { e.stopPropagation(); setWished(!wished) }}
          aria-label="Add to wishlist"
        >
          <Heart size={15} fill={wished ? '#fff' : 'none'} />
        </button>

        {/* Quick Add */}
        <button
          className="quick-add"
          onClick={(e) => {
            e.stopPropagation()
            onQuickAdd(product)
          }}
        >
          <Plus size={14} /> QUICK ADD
        </button>
      </div>

      <div className="product-meta">
        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-color">{product.color}</p>
        </div>
        <div className="price-block">
          <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.compareAt && (
            <del className="price-original">₹{product.compareAt.toLocaleString('en-IN')}</del>
          )}
        </div>
      </div>
    </article>
  )
}

