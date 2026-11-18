import { X, Search as SearchIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { products } from '../data/products'

export default function SearchOverlay({ open, onClose, onSelectProduct }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const results = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.color.toLowerCase().includes(query.toLowerCase())
      )
    : []

  if (!open) return null

  return (
    <div className="search-overlay" role="dialog" aria-label="Search">
      <button className="search-backdrop" onClick={onClose} />
      <div className="search-box">
        <div className="search-input-wrap">
          <SearchIcon size={18} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map(p => (
              <div
                key={p.id}
                className="search-result-item"
                onClick={() => {
                  if (onSelectProduct) onSelectProduct(p)
                  onClose()
                }}
              >
                <img src={p.image} alt={p.name} />
                <div>
                  <span className="search-category">{p.category}</span>
                  <h4>{p.name}</h4>
                  <strong>₹{p.price.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.length > 1 && results.length === 0 && (
          <p className="no-results">No results for "<strong>{query}</strong>"</p>
        )}

        {query.length <= 1 && (
          <div className="search-popular">
            <p className="eyebrow">POPULAR</p>
            {['Signature Tee', 'Hoodie', 'Cargo'].map(term => (
              <button key={term} onClick={() => setQuery(term)}>
                <SearchIcon size={12} /> {term}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

