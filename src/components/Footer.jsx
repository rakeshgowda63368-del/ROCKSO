import { Instagram, Mail, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function Footer({ onCategoryClick, onStoryClick }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Top Row */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <a href="#home" className="footer-logo-wrap">
              <img src={`${import.meta.env.BASE_URL}rockso-logo.jpg`} alt="ROCKSO™" className="footer-logo" />
            </a>
            <p className="footer-tagline">DEFINE YOUR OWN.</p>
            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={17} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-group">
            <div>
              <h4>SHOP</h4>
              <nav>
                <a
                  href="#shop"
                  onClick={(e) => {
                    if (onCategoryClick) {
                      e.preventDefault()
                      onCategoryClick('ALL')
                    }
                  }}
                >
                  All Products
                </a>
                <a
                  href="#tshirts"
                  onClick={(e) => {
                    if (onCategoryClick) {
                      e.preventDefault()
                      onCategoryClick('T-SHIRTS')
                    }
                  }}
                >
                  T-Shirts
                </a>
                <a
                  href="#hoodies"
                  onClick={(e) => {
                    if (onCategoryClick) {
                      e.preventDefault()
                      onCategoryClick('HOODIES')
                    }
                  }}
                >
                  Hoodies
                </a>
                <a href="#custom-cups">Custom Cups</a>
                <a
                  href="#story"
                  onClick={(e) => {
                    if (onStoryClick) {
                      e.preventDefault()
                      onStoryClick()
                    }
                  }}
                >
                  Our Story
                </a>
              </nav>
            </div>
            <div>
              <h4>SUPPORT</h4>
              <nav>
                <a href="mailto:hello@rockso.in">Contact Us</a>
              </nav>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>FIRST ACCESS</h4>
            <p>Get early access to drops, restocks and exclusive deals.</p>
            {subscribed ? (
              <p className="subscribe-success">✓ You're in. Watch your inbox.</p>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <div className="newsletter-input-wrap">
                  <Mail size={14} />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    aria-label="Email for newsletter"
                  />
                </div>
                <button type="submit" className="btn btn-white newsletter-btn">
                  JOIN <ArrowRight size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="footer-bottom">
          <span>© 2026 ROCKSO™. ALL RIGHTS RESERVED.</span>
          <div className="footer-legal">
            <a href="#shop">Privacy Policy</a>
            <a href="#shop">Terms of Service</a>
            <a href="#shop">Cookie Policy</a>
          </div>
          <span className="footer-made">MADE FOR THE UNCOMMON · INDIA</span>
        </div>
      </div>
    </footer>
  )
}

