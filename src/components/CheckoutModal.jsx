import { useState, useEffect } from 'react'
import {
  X, CheckCircle2, ShieldCheck, Truck, CreditCard,
  MessageCircle, Mail, MapPin, User, Phone, Settings,
  ArrowRight, ExternalLink, Printer, Lock
} from 'lucide-react'

// Helper to load Razorpay checkout SDK dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutModal({
  open,
  onClose,
  cart,
  onClearCart
}) {
  // Store owner configuration (persists in localStorage)
  const [storeConfig, setStoreConfig] = useState(() => {
    const defaults = {
      whatsappNumber: '919876543210', // Store WhatsApp (Owner can update anytime)
      storeEmail: 'orders@rockso.in',
      razorpayKey: 'rzp_test_5173RocksoDemo' // Default test key (or user's own live/test key)
    }
    try {
      const saved = localStorage.getItem('rockso-checkout-config')
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
    } catch {
      return defaults
    }
  })

  const [showConfig, setShowConfig] = useState(false)
  const [configSuccess, setConfigSuccess] = useState(false)

  // Customer Delivery details
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('rockso-customer-info')
      return saved ? JSON.parse(saved) : {
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: 'Karnataka',
        pincode: '',
        notes: ''
      }
    } catch {
      return {
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: 'Karnataka',
        pincode: '',
        notes: ''
      }
    }
  })

  const [formErrors, setFormErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('razorpay') // 'razorpay' | 'whatsapp' | 'cod'
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(null)

  // Calculate pricing
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const freeShippingThreshold = 1999
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 60
  const grandTotal = subtotal + shippingFee

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setOrderComplete(null)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function handleCustomerChange(field, value) {
    const updated = { ...customer, [field]: value }
    setCustomer(updated)
    try {
      localStorage.setItem('rockso-customer-info', JSON.stringify(updated))
    } catch {}
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  function handleSaveConfig(e) {
    e.preventDefault()
    try {
      localStorage.setItem('rockso-checkout-config', JSON.stringify(storeConfig))
      setConfigSuccess(true)
      setTimeout(() => {
        setConfigSuccess(false)
        setShowConfig(false)
      }, 1500)
    } catch {}
  }

  function validateForm() {
    const errors = {}
    if (!customer.name.trim()) errors.name = true
    if (!customer.phone.trim() || customer.phone.trim().length < 10) errors.phone = true
    if (!customer.address.trim()) errors.address = true
    if (!customer.city.trim()) errors.city = true
    if (!customer.pincode.trim() || customer.pincode.trim().length < 6) errors.pincode = true
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Generate unique order ID
  function generateOrderId() {
    return `RS-${Math.floor(100000 + Math.random() * 900000)}`
  }

  // Format order message for WhatsApp
  function formatWhatsAppMessage(order) {
    const itemsList = order.items
      .map(i => `• ${i.quantity}x ${i.name} (Size: ${i.size}) - ₹${(i.price * i.quantity).toLocaleString('en-IN')}`)
      .join('\n')

    return `🛍️ *NEW ROCKSO™ ORDER #${order.orderId}*
──────────────────────
👤 *CUSTOMER DETAILS:*
• Name: ${order.customer.name}
• Phone: ${order.customer.phone}
• Email: ${order.customer.email || 'N/A'}
• Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
${order.customer.notes ? `• Notes: ${order.customer.notes}\n` : ''}
📦 *ITEMS ORDERED:*
${itemsList}

💰 *PAYMENT SUMMARY:*
• Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}
• Delivery: ${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
• *TOTAL AMOUNT:* ₹${order.grandTotal.toLocaleString('en-IN')}
• Method: ${order.paymentMethod.toUpperCase()} ${order.paymentId ? `(ID: ${order.paymentId})` : ''}
• Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
──────────────────────
🚀 Please pack and dispatch this delivery.`
  }

  // Trigger free WhatsApp order notification
  function openWhatsAppNotification(order) {
    const text = encodeURIComponent(formatWhatsAppMessage(order))
    const cleanNumber = storeConfig.whatsappNumber.replace(/[^0-9]/g, '')
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${text}`
    window.open(whatsappUrl, '_blank')
  }

  // Format mailto for free email notification
  function openEmailNotification(order) {
    const subject = encodeURIComponent(`ROCKSO™ Order Confirmation #${order.orderId} - ₹${order.grandTotal}`)
    const body = encodeURIComponent(formatWhatsAppMessage(order))
    const mailtoUrl = `mailto:${storeConfig.storeEmail}?subject=${subject}&body=${body}`
    window.open(mailtoUrl, '_blank')
  }

  // Finalize order placing
  function finalizeOrder(paymentId = null) {
    const orderData = {
      orderId: generateOrderId(),
      date: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal,
      shippingFee,
      grandTotal,
      paymentMethod,
      paymentId
    }

    // Save order in history
    try {
      const prevOrders = JSON.parse(localStorage.getItem('rockso-orders') || '[]')
      localStorage.setItem('rockso-orders', JSON.stringify([orderData, ...prevOrders]))
    } catch {}

    setOrderComplete(orderData)
    if (onClearCart) onClearCart()

    // Automatically trigger WhatsApp notification so store gets delivery notification
    setTimeout(() => {
      openWhatsAppNotification(orderData)
    }, 600)
  }

  // Handle Razorpay Checkout
  async function handleRazorpayPayment() {
    if (!validateForm()) return

    setIsProcessing(true)
    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded || !window.Razorpay) {
      alert('Could not load Razorpay. Falling back to direct WhatsApp / COD order.')
      setIsProcessing(false)
      finalizeOrder('FALLBACK_DIRECT')
      return
    }

    const options = {
      key: storeConfig.razorpayKey,
      amount: grandTotal * 100, // in paise
      currency: 'INR',
      name: 'ROCKSO™ Streetwear',
      description: `Order Payment (${cart.length} item${cart.length > 1 ? 's' : ''})`,
      image: `${import.meta.env.BASE_URL}rockso-logo.jpg`,
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone
      },
      theme: {
        color: '#000000'
      },
      handler: function (response) {
        setIsProcessing(false)
        finalizeOrder(response.razorpay_payment_id || `PAY_${Date.now()}`)
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false)
        }
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (resp) {
        alert(`Payment not completed: ${resp.error.description || 'Cancelled'}. You can still complete your order via WhatsApp or Cash on Delivery.`)
        setIsProcessing(false)
      })
      rzp.open()
    } catch (err) {
      console.warn('Razorpay checkout error', err)
      setIsProcessing(false)
      // Provide instant graceful fallback
      const proceedFallback = confirm('Razorpay live test popup paused. Would you like to confirm this order directly via WhatsApp?')
      if (proceedFallback) {
        finalizeOrder(`RZP_DEMO_${Date.now()}`)
      }
    }
  }

  // Handle direct WhatsApp or Cash On Delivery
  function handleDirectOrder() {
    if (!validateForm()) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      finalizeOrder(paymentMethod === 'cod' ? 'COD_PENDING' : 'WHATSAPP_CONFIRMED')
    }, 400)
  }

  if (!open) return null

  return (
    <div className="checkout-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="checkout-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-modal-header">
          <div className="checkout-brand-title">
            <ShieldCheck size={20} className="shield-icon" />
            <div>
              <h3>ROCKSO™ SECURE CHECKOUT</h3>
              <p>Pan-India Express Delivery & Encrypted Payment</p>
            </div>
          </div>
          <div className="checkout-header-actions">
            <button
              type="button"
              className="icon-btn-settings"
              onClick={() => setShowConfig(!showConfig)}
              title="Store Owner: Configure Razorpay & WhatsApp"
            >
              <Settings size={17} />
            </button>
            <button type="button" className="checkout-close-btn" onClick={onClose} aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── STORE CONFIG PANEL (Visible on Settings click) ── */}
        {showConfig && (
          <form className="store-config-panel" onSubmit={handleSaveConfig}>
            <h4>⚙️ STORE OWNER CONFIGURATION</h4>
            <p>Set your phone number and Razorpay Key to receive payments and instant order alerts directly.</p>
            
            <div className="config-grid">
              <div className="config-field">
                <label>WhatsApp Number (with country code):</label>
                <input
                  type="text"
                  value={storeConfig.whatsappNumber}
                  onChange={e => setStoreConfig({ ...storeConfig, whatsappNumber: e.target.value })}
                  placeholder="e.g. 919876543210"
                  required
                />
              </div>

              <div className="config-field">
                <label>Store Email for Orders:</label>
                <input
                  type="email"
                  value={storeConfig.storeEmail}
                  onChange={e => setStoreConfig({ ...storeConfig, storeEmail: e.target.value })}
                  placeholder="e.g. orders@rockso.in"
                  required
                />
              </div>

              <div className="config-field full">
                <label>Razorpay Key ID (Live or Test):</label>
                <input
                  type="text"
                  value={storeConfig.razorpayKey}
                  onChange={e => setStoreConfig({ ...storeConfig, razorpayKey: e.target.value })}
                  placeholder="e.g. rzp_live_xxxxxxxxxxxx or rzp_test_xxxxxxxxxxxx"
                  required
                />
              </div>
            </div>

            <div className="config-actions">
              <button type="submit" className="btn btn-black sm">
                SAVE SETTINGS
              </button>
              {configSuccess && <span className="config-success">✓ Settings Saved!</span>}
            </div>
          </form>
        )}

        {/* ── ORDER COMPLETE VIEW ── */}
        {orderComplete ? (
          <div className="order-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} color="#16a34a" />
            </div>

            <h2>ORDER CONFIRMED!</h2>
            <p className="order-id-tag">Order ID: <strong>{orderComplete.orderId}</strong></p>
            <p className="success-lead">
              Thank you, <strong>{orderComplete.customer.name}</strong>! Your ROCKSO™ streetwear order has been registered.
            </p>

            {/* Delivery Replicated Box */}
            <div className="delivery-summary-card">
              <h4><Truck size={16} /> DELIVERY & DISPATCH DETAILS</h4>
              <p><strong>Deliver To:</strong> {orderComplete.customer.name} ({orderComplete.customer.phone})</p>
              <p><strong>Address:</strong> {orderComplete.customer.address}, {orderComplete.customer.city}, {orderComplete.customer.state} - {orderComplete.customer.pincode}</p>
              <p><strong>Total Amount:</strong> ₹{orderComplete.grandTotal.toLocaleString('en-IN')} • <em>{orderComplete.paymentMethod.toUpperCase()} {orderComplete.paymentId ? `(${orderComplete.paymentId})` : ''}</em></p>
            </div>

            {/* Direct Replicate Buttons (WhatsApp & Email - 100% Free) */}
            <div className="order-replicate-actions">
              <button
                type="button"
                className="btn-whatsapp-replicate"
                onClick={() => openWhatsAppNotification(orderComplete)}
              >
                <MessageCircle size={18} /> OPEN / SEND VIA WHATSAPP (FREE)
              </button>

              <button
                type="button"
                className="btn-email-replicate"
                onClick={() => openEmailNotification(orderComplete)}
              >
                <Mail size={18} /> SEND ORDER TO EMAIL (FREE)
              </button>

              <button
                type="button"
                className="btn-print-receipt"
                onClick={() => window.print()}
              >
                <Printer size={16} /> PRINT RECEIPT
              </button>
            </div>

            <div className="success-footer-actions">
              <button type="button" className="btn btn-black full" onClick={onClose}>
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : (
          /* ── CHECKOUT FORM & SUMMARY ── */
          <div className="checkout-body-grid">
            {/* Left: Delivery Form */}
            <div className="checkout-form-col">
              <h4 className="section-title">
                <MapPin size={16} /> 1. DELIVERY ADDRESS
              </h4>

              <div className="form-grid">
                <div className={`form-group ${formErrors.name ? 'has-error' : ''}`}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={customer.name}
                    onChange={e => handleCustomerChange('name', e.target.value)}
                  />
                  {formErrors.name && <span className="err-msg">Name is required</span>}
                </div>

                <div className={`form-group ${formErrors.phone ? 'has-error' : ''}`}>
                  <label>WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={customer.phone}
                    maxLength={13}
                    onChange={e => handleCustomerChange('phone', e.target.value)}
                  />
                  {formErrors.phone && <span className="err-msg">Valid phone number required</span>}
                </div>

                <div className="form-group full">
                  <label>Email Address (Optional for invoice):</label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={customer.email}
                    onChange={e => handleCustomerChange('email', e.target.value)}
                  />
                </div>

                <div className={`form-group full ${formErrors.address ? 'has-error' : ''}`}>
                  <label>Complete House / Street Address *</label>
                  <input
                    type="text"
                    placeholder="Flat / House No., Building Name, Street / Area"
                    value={customer.address}
                    onChange={e => handleCustomerChange('address', e.target.value)}
                  />
                  {formErrors.address && <span className="err-msg">Address is required</span>}
                </div>

                <div className={`form-group ${formErrors.city ? 'has-error' : ''}`}>
                  <label>City / Town *</label>
                  <input
                    type="text"
                    placeholder="e.g. Hassan / Bengaluru"
                    value={customer.city}
                    onChange={e => handleCustomerChange('city', e.target.value)}
                  />
                  {formErrors.city && <span className="err-msg">City is required</span>}
                </div>

                <div className={`form-group ${formErrors.pincode ? 'has-error' : ''}`}>
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    value={customer.pincode}
                    onChange={e => handleCustomerChange('pincode', e.target.value.replace(/[^0-9]/g, ''))}
                  />
                  {formErrors.pincode && <span className="err-msg">6-digit PIN required</span>}
                </div>
              </div>

              {/* Payment Method Selector */}
              <h4 className="section-title mt-4">
                <CreditCard size={16} /> 2. PAYMENT METHOD
              </h4>

              <div className="payment-options-grid">
                <label className={`payment-pill-card ${paymentMethod === 'razorpay' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                  <div className="payment-pill-info">
                    <strong>Razorpay (UPI / Cards / NetBanking)</strong>
                    <span>Google Pay, PhonePe, Paytm, All Cards</span>
                  </div>
                  <Lock size={15} className="pay-lock-icon" />
                </label>

                <label className={`payment-pill-card ${paymentMethod === 'whatsapp' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                  />
                  <div className="payment-pill-info">
                    <strong>Direct WhatsApp Order</strong>
                    <span>Send delivery address directly via WhatsApp</span>
                  </div>
                  <MessageCircle size={15} color="#16a34a" />
                </label>

                <label className={`payment-pill-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-pill-info">
                    <strong>Cash on Delivery (COD)</strong>
                    <span>Pay in cash when order arrives</span>
                  </div>
                  <Truck size={15} />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="checkout-action-row">
                {paymentMethod === 'razorpay' ? (
                  <button
                    type="button"
                    className="btn btn-black full btn-pay-now"
                    onClick={handleRazorpayPayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'INITIALIZING RAZORPAY...' : `PAY ₹${grandTotal.toLocaleString('en-IN')} VIA RAZORPAY`}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-black full btn-pay-now"
                    onClick={handleDirectOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'CONFIRMING ORDER...' : `CONFIRM & DISPATCH (₹${grandTotal.toLocaleString('en-IN')})`}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Order Items Summary */}
            <div className="checkout-summary-col">
              <h4>ORDER SUMMARY ({cart.reduce((s, i) => s + i.quantity, 0)} ITEMS)</h4>

              <div className="checkout-items-list">
                {cart.map(item => (
                  <div key={`${item.id}-${item.size}`} className="checkout-item-row">
                    <img src={item.image} alt={item.name} className="checkout-item-thumb" />
                    <div className="checkout-item-meta">
                      <h5>{item.name}</h5>
                      <p>Size: <strong>{item.size}</strong> • Qty: <strong>{item.quantity}</strong></p>
                      <span className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-calc-card">
                <div className="calc-row">
                  <span>Subtotal</span>
                  <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="calc-row">
                  <span>Pan-India Delivery</span>
                  <strong>{shippingFee === 0 ? <span className="free-tag">FREE</span> : `₹${shippingFee}`}</strong>
                </div>
                <div className="calc-row total">
                  <span>Total Amount</span>
                  <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="trust-badges-box">
                <div><ShieldCheck size={14} /> 100% Verified Delivery</div>
                <div><MessageCircle size={14} /> Free Instant WhatsApp Updates</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
