import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import styles from './Navbar.module.css'

const NAV_TABS = [
  { id: 'home',      label: 'Home' },
  { id: 'works',     label: 'How it Works' },
  { id: 'generator', label: 'Generator' },
  { id: 'moodboard', label: 'Goa Moodboard' },
  { id: 'about',     label: 'About Event' },
  { id: 'faq',       label: 'FAQ' },
]

export default function Navbar({ activeTab = 'home', onSelectTab }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleTabClick = (tabId) => {
    setMobileOpen(false)
    if (onSelectTab) {
      onSelectTab(tabId)
    }
  }

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.inner}>
          {/* Logo Anchor */}
          <a
            href="#home"
            className={styles.logoAnchor}
            onClick={(e) => { e.preventDefault(); handleTabClick('home') }}
          >
            <Logo size="medium" />
          </a>

          {/* Desktop Direct Section Tabs */}
          <ul className={styles.links}>
            {NAV_TABS.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`${styles.link} ${activeTab === tab.id ? styles.linkActive : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            className={`${styles.cta} btn btn-primary`}
            onClick={() => handleTabClick('generator')}
          >
            Create My Card ✨
          </button>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.drawer}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <ul className={styles.drawerLinks}>
              {NAV_TABS.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`${styles.drawerLink} ${activeTab === tab.id ? styles.drawerLinkActive : ''}`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className={`btn btn-primary ${styles.drawerCta}`}
                  onClick={() => handleTabClick('generator')}
                >
                  Create My Card ✨
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
