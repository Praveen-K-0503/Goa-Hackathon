import Logo from './Logo'
import styles from './Footer.module.css'

// Map footer labels → section IDs
const NAV_MAP = [
  ['Home',         'home'],
  ['How it Works', 'works'],
  ['Generator',    'generator'],
  ['Goa Moodboard','moodboard'],
  ['About',        'about'],
  ['FAQ',          'faq'],
]

export default function Footer({ onSelectTab }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Top row */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Logo size="medium" />
            <p className={styles.tagline}>
              Claim your Hacker House Goa 2026 builder identity.
              <br />AI × Crypto · Goa 🌊
            </p>
            <div className={styles.hashBadge}>#FrameInGoa</div>
          </div>

          {/* Links */}
          <div className={styles.linksGroup}>
            <p className={styles.linksTitle}>Navigate</p>
            <ul className={styles.links}>
              {NAV_MAP.map(([label, tabId]) => (
                <li key={tabId}>
                  <button
                    className={styles.link}
                    onClick={() => onSelectTab?.(tabId)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Event info */}
          <div className={styles.linksGroup}>
            <p className={styles.linksTitle}>Event</p>
            <ul className={styles.links}>
              <li><a className={styles.link} href="https://forms.gle/jM5hTaGvsrfEfixPA" target="_blank" rel="noreferrer">Submit Your Entry ↗</a></li>
              <li><a className={styles.link} href="https://twitter.com/search?q=%23FrameInGoa" target="_blank" rel="noreferrer">#FrameInGoa on X ↗</a></li>
              <li><a className={styles.link} href="https://twitter.com/HackerHouseGoa" target="_blank" rel="noreferrer">@HackerHouseGoa ↗</a></li>
            </ul>
            <div className={styles.poweredBy}>
              Powered by <strong>2:47PM Studio</strong>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom row */}
        <div className={styles.bottom}>
          <p className={styles.copy}>
            © 2026 Hacker House Goa · FrameGoa · All rights reserved
          </p>
          <p className={styles.deadline}>
            ⏰ Submission deadline: <strong>11:59 PM, August 13, 2026</strong>
          </p>
        </div>
      </div>
    </footer>
  )
}
