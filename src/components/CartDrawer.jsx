import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

export default function CartDrawer({ open, onClose, cart, onUpdate, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const freeShippingThreshold = 1999
  const remaining = freeShippingThreshold - total

  return (
    <>
      {open && (
        <button
          className="drawer-backdrop"
          aria-label="Close cart"
          onClick={onClose}
        />
      )}

      <aside className={`cart-drawer${open ? ' visible' : ''}`} aria-hidden={!open} aria-label="Shopping cart">
        {/* Header */}
        <div className="drawer-head">
          <div>
            <span className="eyebrow">YOUR SELECTION</span>
            <h2>Shopping Bag {cartCount(cart) > 0 && <small>({cartCount(cart)})</small>}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Bar */}
        {cart.length > 0 && (
          <div className="free-shipping-bar">
            {remaining > 0 ? (
              <>
                <div
                  className="free-shipping-progress"
                  style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                />
                <p>Add ₹{remaining.toLocaleString('en-IN')} more for <strong>FREE SHIPPING</strong></p>
              </>
            ) : (
              <p className="free-shipping-achieved">🎉 You've unlocked <strong>FREE SHIPPING!</strong></p>
            )}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={42} strokeWidth={1} />
            <h3>Your bag is empty</h3>
            <p>Find something that defines you.</p>
            <button className="btn btn-white" onClick={onClose}>
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cart-items">
              {cart.map(item => (
                <div className="cart-item" key={`${item.id}-${item.size}`}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div>
                        <h3>{item.name}</h3>
                        <p>Size: <strong>{item.size}</strong></p>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => onUpdate(item, -item.quantity)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="cart-item-bottom">
                      <div className="quantity">
                        <button onClick={() => onUpdate(item, -1)} aria-label="Decrease quantity">
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdate(item, 1)} aria-label="Increase quantity">
                          <Plus size={12} />
                        </button>
                      </div>
                      <strong className="item-price">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{total.toLocaleString('en-IN')}</strong>
              </div>
              <div className="summary-row muted">
                <span>Shipping</span>
                <span>{total >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout'}</span>
              </div>
              <p className="tax-note">GST included. Final amount at checkout.</p>
              <button className="btn btn-white full" onClick={onCheckout}>
                PROCEED TO CHECKOUT
              </button>
              <button className="btn btn-ghost full" onClick={onClose}>
                CONTINUE SHOPPING
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function cartCount(cart) {
  return cart.reduce((sum, i) => sum + i.quantity, 0)
}

