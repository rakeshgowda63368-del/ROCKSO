import { useState, useRef } from 'react'
import {
  Sparkles, Upload, Type, Image as ImageIcon,
  RotateCcw, Check, ShoppingBag, Wand2, Eye, Sliders
} from 'lucide-react'

// Preset AI Streetwear Graphics
const AI_GRAPHICS = [
  {
    id: 'samurai',
    name: 'Neo Samurai',
    prompt: 'Cyberpunk Oni Samurai with dual katanas in dark streetwear aesthetic',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    tag: 'CYBER'
  },
  {
    id: 'skull',
    name: 'Gothic Skull',
    prompt: 'Vintage distressed dark skull with thorned roses and chrome accents',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    tag: 'GOTHIC'
  },
  {
    id: 'tiger',
    name: 'Sumi-e Tiger',
    prompt: 'Traditional Japanese brush ink tiger leaping through smoke',
    url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
    tag: 'TRIBAL'
  },
  {
    id: 'drift',
    name: 'Tokyo Drift 90s',
    prompt: 'Vintage 90s JDM turbo sports car in retro synthwave typography',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    tag: 'JDM'
  },
  {
    id: 'astro',
    name: 'Cosmic Drift',
    prompt: 'Astronaut floating in deep space with shattered holographic visor',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    tag: 'COSMIC'
  },
  {
    id: 'divine',
    name: 'Lord Shiva Art',
    prompt: 'Meditating Shiva artwork with crescent moon and trident sacred geometry',
    url: `${import.meta.env.BASE_URL}product-01.jpg`,
    tag: 'SACRED'
  }
]

const TEE_COLORS = [
  { id: 'white', name: 'Pure White', hex: '#ffffff', textDefault: '#111111', border: '#dcdad7' },
  { id: 'black', name: 'Jet Black', hex: '#141414', textDefault: '#ffffff', border: '#2a2a2a' },
  { id: 'charcoal', name: 'Vintage Charcoal', hex: '#2c2d30', textDefault: '#ffffff', border: '#3e4044' },
  { id: 'olive', name: 'Washed Olive', hex: '#3e463a', textDefault: '#f5f5f0', border: '#4e5649' },
  { id: 'sand', name: 'Desert Sand', hex: '#d8ccb8', textDefault: '#1a1a1a', border: '#c7bba7' }
]

const FONTS = [
  { id: 'barlow', name: 'Street Condensed', family: "'Barlow Condensed', sans-serif", weight: '900', letterSpacing: '2px' },
  { id: 'gothic', name: 'Bold Gothic', family: "'Impact', 'Arial Black', sans-serif", weight: '900', letterSpacing: '3px' },
  { id: 'mono', name: 'Tech Mono', family: "'Courier New', monospace", weight: '700', letterSpacing: '4px' },
  { id: 'script', name: 'Clean Modern', family: "'DM Sans', sans-serif", weight: '700', letterSpacing: '1px' }
]

const TEXT_COLORS = ['#ffffff', '#111111', '#e11d48', '#f59e0b', '#06b6d4', '#84cc16']
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function CustomizerSection({ onAddToCart, onOpenCart }) {
  // Tee config
  const [selectedColor, setSelectedColor] = useState(TEE_COLORS[1]) // Default Jet Black
  const [selectedSize, setSelectedSize] = useState('L')
  const [activeSide, setActiveSide] = useState('back') // 'front' | 'back'
  const [activeTab, setActiveTab] = useState('ai') // 'ai' | 'text' | 'upload'

  // Design config
  const [selectedGraphic, setSelectedGraphic] = useState(AI_GRAPHICS[0])
  const [customText, setCustomText] = useState('DEFINE YOUR OWN')
  const [selectedFont, setSelectedFont] = useState(FONTS[0])
  const [selectedTextColor, setSelectedTextColor] = useState('#ffffff')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [graphicScale, setGraphicScale] = useState(72) // 40 - 100%
  const [graphicPosition, setGraphicPosition] = useState('center') // 'chest' | 'center' | 'bottom'

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuccess, setAiSuccess] = useState(false)
  const fileInputRef = useRef(null)

  // Handle AI generation simulation
  const handleGenerate = (e) => {
    e?.preventDefault()
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    setAiSuccess(false)

    setTimeout(() => {
      // Pick or create new generated graphic
      const generated = {
        id: `gen-${Date.now()}`,
        name: aiPrompt.slice(0, 18),
        prompt: aiPrompt,
        url: selectedGraphic.url, // In preview, wraps with new prompt
        tag: 'AI-GEN'
      }
      setSelectedGraphic(generated)
      setIsGenerating(false)
      setAiSuccess(true)
      setTimeout(() => setAiSuccess(false), 3000)
    }, 1200)
  }

  // Handle custom file upload with instant client-side canvas compression
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const rawUrl = event.target.result
        const img = new Image()
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const maxDim = 420
            let w = img.width
            let h = img.height
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w)
                w = maxDim
              } else {
                w = Math.round((w * maxDim) / h)
                h = maxDim
              }
            }
            canvas.width = w
            canvas.height = h
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, w, h)
            const compressed = canvas.toDataURL('image/jpeg', 0.82)
            setUploadedImage(compressed)
            setSelectedGraphic({
              id: 'user-upload',
              name: file.name.slice(0, 16),
              url: compressed,
              tag: 'CUSTOM'
            })
          } catch {
            // Fallback if canvas fails
            setUploadedImage(rawUrl)
            setSelectedGraphic({
              id: 'user-upload',
              name: file.name.slice(0, 16),
              url: rawUrl,
              tag: 'CUSTOM'
            })
          }
        }
        img.src = rawUrl
      }
      reader.readAsDataURL(file)
    }
  }

  // Add custom tee to shopping bag
  const handleAddCustomToBag = () => {
    const customProduct = {
      id: `custom-tee-${selectedColor.id}-${Date.now()}`,
      name: `Custom ${selectedColor.name} Oversized Tee`,
      category: 'T-Shirts',
      price: 899,
      compareAt: 1299,
      badge: 'CUSTOM LAB',
      color: selectedColor.name,
      image: selectedGraphic?.url || `${import.meta.env.BASE_URL}product-01.jpg`,
      description: `Custom 1-of-1 ROCKSO Oversized Tee in ${selectedColor.name}. Printed on ${activeSide.toUpperCase()} with ${selectedGraphic?.name || 'custom design'} & custom typography "${customText}". 300+ GSM Heavyweight Cotton.`
    }

    if (onAddToCart) {
      onAddToCart(customProduct, selectedSize)
      if (onOpenCart) onOpenCart()
    }
  }

  return (
    <section className="customizer-section" id="custom-lab">
      <div className="customizer-header">
        <div className="customizer-badge">
          <Sparkles size={14} /> ROCKSO™ CUSTOM LAB
        </div>
        <h2 className="customizer-title">DESIGN YOUR OWN OVERSIZED TEE</h2>
        <p className="customizer-subtitle">
          Pick a blank heavyweight canvas, generate AI streetwear graphics or upload your custom design. Built on 300+ GSM premium cotton.
        </p>
      </div>

      <div className="customizer-grid">
        {/* ── LEFT: INTERACTIVE T-SHIRT CANVAS ── */}
        <div className="mockup-display-card">
          {/* Side Toggle & View Indicators */}
          <div className="mockup-top-bar">
            <div className="side-toggle">
              <button
                type="button"
                className={`side-btn${activeSide === 'front' ? ' active' : ''}`}
                onClick={() => setActiveSide('front')}
              >
                FRONT VIEW
              </button>
              <button
                type="button"
                className={`side-btn${activeSide === 'back' ? ' active' : ''}`}
                onClick={() => setActiveSide('back')}
              >
                BACK VIEW
              </button>
            </div>

            <div className="canvas-badge">
              <Eye size={13} /> LIVE MOCKUP
            </div>
          </div>

          {/* Interactive Shirt Graphic Canvas */}
          <div className="tee-canvas-stage">
            {/* Realistic T-Shirt SVG Shape with Dynamic Color */}
            <div
              className="tee-silhouette-wrapper"
              style={{ filter: selectedColor.id === 'white' ? 'drop-shadow(0 15px 35px rgba(0,0,0,0.12))' : 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))' }}
            >
              <svg
                viewBox="0 0 500 520"
                className="tee-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle fabric fold gradient */}
                  <linearGradient id="teeShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="50%" stopColor="#000000" stopOpacity="0.0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
                  </linearGradient>
                  {/* Neck shading */}
                  <radialGradient id="neckGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                  </radialGradient>
                </defs>

                {/* Oversized Boxy Streetwear T-shirt Body */}
                <path
                  d="M 175 45 
                     C 195 62, 305 62, 325 45 
                     L 440 105 
                     C 455 113, 465 130, 460 148 
                     L 435 210 
                     C 430 222, 415 228, 402 222 
                     L 375 210 
                     L 375 490 
                     C 375 498, 368 505, 360 505 
                     L 140 505 
                     C 132 505, 125 498, 125 490 
                     L 125 210 
                     L 98 222 
                     C 85 228, 70 222, 65 210 
                     L 40 148 
                     C 35 130, 45 113, 60 105 
                     Z"
                  fill={selectedColor.hex}
                  stroke={selectedColor.border}
                  strokeWidth="2.5"
                />

                {/* Shading overlay */}
                <path
                  d="M 175 45 C 195 62, 305 62, 325 45 L 440 105 C 455 113, 465 130, 460 148 L 435 210 C 430 222, 415 228, 402 222 L 375 210 L 375 490 C 375 498, 368 505, 360 505 L 140 505 C 132 505, 125 498, 125 490 L 125 210 L 98 222 C 85 228, 70 222, 65 210 L 40 148 C 35 130, 45 113, 60 105 Z"
                  fill="url(#teeShadow)"
                />

                {/* Collar Ribbing */}
                {activeSide === 'front' ? (
                  <>
                    <path
                      d="M 175 45 C 200 80, 300 80, 325 45"
                      fill="none"
                      stroke={selectedColor.border}
                      strokeWidth="5"
                    />
                    <path
                      d="M 175 45 C 200 78, 300 78, 325 45"
                      fill="url(#neckGrad)"
                    />
                  </>
                ) : (
                  <path
                    d="M 175 45 C 205 58, 295 58, 325 45"
                    fill="none"
                    stroke={selectedColor.border}
                    strokeWidth="5"
                  />
                )}

                {/* Sleeve Stitch Lines */}
                <path d="M 375 210 L 435 210" stroke={selectedColor.border} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 125 210 L 65 210" stroke={selectedColor.border} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                {/* Hem Stitch */}
                <path d="M 125 488 L 375 488" stroke={selectedColor.border} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              </svg>

              {/* ── PRINT AREA OVERLAY ── */}
              <div
                className={`print-zone-target ${activeSide === 'front' ? 'front-zone' : 'back-zone'} pos-${graphicPosition}`}
                style={{
                  width: `${graphicScale}%`,
                  maxWidth: activeSide === 'front' ? '200px' : '270px'
                }}
              >
                {/* Custom Graphic */}
                {selectedGraphic && (
                  <div className="printed-artwork-container">
                    <img
                      src={selectedGraphic.url}
                      alt={selectedGraphic.name}
                      className="printed-artwork-img"
                    />
                  </div>
                )}

                {/* Custom Slogan / Text Print */}
                {customText.trim() && (
                  <div
                    className="printed-text"
                    style={{
                      fontFamily: selectedFont.family,
                      fontWeight: selectedFont.weight,
                      letterSpacing: selectedFont.letterSpacing,
                      color: selectedTextColor,
                      textShadow: selectedTextColor === '#ffffff' ? '0 2px 8px rgba(0,0,0,0.6)' : 'none'
                    }}
                  >
                    {customText}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Canvas Controls */}
          <div className="canvas-bottom-controls">
            <div className="canvas-color-indicator">
              <span>COLOR: <strong>{selectedColor.name}</strong></span>
              <span>PLACEMENT: <strong>{activeSide.toUpperCase()}</strong></span>
            </div>
            <div className="canvas-scale-slider">
              <Sliders size={13} />
              <label>Print Scale</label>
              <input
                type="range"
                min="45"
                max="95"
                value={graphicScale}
                onChange={(e) => setGraphicScale(Number(e.target.value))}
              />
              <span>{graphicScale}%</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: STUDIO CONTROL PANEL ── */}
        <div className="customizer-panel-card">
          {/* Studio Navigation Tabs */}
          <div className="studio-tabs">
            <button
              type="button"
              className={`studio-tab-btn${activeTab === 'ai' ? ' active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <Wand2 size={14} /> AI GENERATOR
            </button>
            <button
              type="button"
              className={`studio-tab-btn${activeTab === 'text' ? ' active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              <Type size={14} /> CUSTOM TEXT
            </button>
            <button
              type="button"
              className={`studio-tab-btn${activeTab === 'upload' ? ' active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={14} /> UPLOAD LOGO
            </button>
          </div>

          <div className="studio-tab-content">
            {/* ── TAB 1: AI GENERATION ── */}
            {activeTab === 'ai' && (
              <div className="ai-studio-block">
                <label className="studio-field-label">
                  <Sparkles size={13} /> AI Streetwear Art Prompt
                </label>
                <form onSubmit={handleGenerate} className="ai-input-form">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Cyberpunk samurai with neon swords..."
                    className="ai-prompt-input"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !aiPrompt.trim()}
                    className="btn btn-black ai-gen-btn"
                  >
                    {isGenerating ? 'GENERATING...' : 'GENERATE'}
                  </button>
                </form>

                {aiSuccess && (
                  <p className="ai-success-msg">
                    <Check size={14} /> Graphic generated & applied to t-shirt!
                  </p>
                )}

                {/* Curated Graphics Presets */}
                <div className="presets-group">
                  <label className="studio-field-label">Or Pick Curated Streetwear Artworks:</label>
                  <div className="graphics-preset-grid">
                    {AI_GRAPHICS.map((g) => (
                      <div
                        key={g.id}
                        className={`graphic-preset-tile${selectedGraphic?.id === g.id ? ' active' : ''}`}
                        onClick={() => setSelectedGraphic(g)}
                      >
                        <img src={g.url} alt={g.name} />
                        <div className="preset-info">
                          <span>{g.name}</span>
                          <small>{g.tag}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: CUSTOM TEXT ── */}
            {activeTab === 'text' && (
              <div className="text-studio-block">
                <label className="studio-field-label">Custom Typography / Slogan</label>
                <input
                  type="text"
                  maxLength={30}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. DEFINE YOUR OWN"
                  className="studio-text-input"
                />

                {/* Font selector */}
                <div className="font-selector-row">
                  <label className="studio-field-label">Typography Style:</label>
                  <div className="font-chips">
                    {FONTS.map(f => (
                      <button
                        key={f.id}
                        type="button"
                        className={`font-chip${selectedFont.id === f.id ? ' active' : ''}`}
                        style={{ fontFamily: f.family }}
                        onClick={() => setSelectedFont(f)}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Color */}
                <div className="color-selector-row">
                  <label className="studio-field-label">Text Color:</label>
                  <div className="color-swatches">
                    {TEXT_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`color-swatch-sm${selectedTextColor === c ? ' active' : ''}`}
                        style={{ background: c }}
                        onClick={() => setSelectedTextColor(c)}
                        aria-label={`Select text color ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: UPLOAD DESIGN ── */}
            {activeTab === 'upload' && (
              <div className="upload-studio-block">
                <label className="studio-field-label">Upload Your Graphic / Brand Logo</label>
                <div
                  className="upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <Upload size={28} />
                  <p><strong>Click to browse</strong> or drag artwork here</p>
                  <span>Supports PNG, SVG, JPG (Transparent PNG recommended)</span>
                </div>

                {uploadedImage && (
                  <div className="upload-preview-row">
                    <img src={uploadedImage} alt="Uploaded preview" />
                    <div>
                      <strong>Active Custom Graphic</strong>
                      <p>Mapped to {activeSide.toUpperCase()} print</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── TEE COLOR & SIZE SELECTION ── */}
          <div className="tee-options-section">
            {/* Color Swatches */}
            <div className="tee-colors-row">
              <label className="studio-field-label">
                Blank Heavyweight T-Shirt Color: <strong>{selectedColor.name}</strong>
              </label>
              <div className="tee-color-swatches">
                {TEE_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={`tee-swatch${selectedColor.id === c.id ? ' active' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => {
                      setSelectedColor(c)
                      setSelectedTextColor(c.textDefault)
                    }}
                    title={c.name}
                  >
                    {selectedColor.id === c.id && (
                      <Check size={14} color={c.id === 'white' ? '#000' : '#fff'} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="tee-sizes-row">
              <div className="size-label-row">
                <label className="studio-field-label">Oversized Fit Size:</label>
                <span className="size-guide-hint">Boxy Dropped Shoulder Fit</span>
              </div>
              <div className="size-chips-grid">
                {SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`size-chip${selectedSize === s ? ' active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── PRICE & BUY ACTION ── */}
          <div className="custom-checkout-card">
            <div className="custom-price-block">
              <div>
                <span className="custom-price-current">₹899</span>
                <del className="custom-price-mrp">₹1,299</del>
                <span className="custom-discount">30% OFF</span>
              </div>
              <p className="custom-includes">Includes 300+ GSM Tee + High-Definition Screen Print</p>
            </div>

            <button
              type="button"
              className="btn btn-black btn-add-custom"
              onClick={handleAddCustomToBag}
            >
              <ShoppingBag size={18} /> ADD CUSTOM DROP TO BAG
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
