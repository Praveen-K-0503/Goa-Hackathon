import styles from './Logo.module.css'
import logoImg from '../assets/images/goa_hackathon_logo.png'

export default function Logo({ size = 'large' }) {
  return (
    <div className={`${styles.logoPill} ${styles[size]}`}>
      <img
        src={logoImg}
        alt="GOA Hacker House 2026 Logo"
        className={styles.logoImg}
      />
      <div className={styles.textWrap}>
        <span className={styles.tagline}>HACKER HOUSE</span>
        <span className={styles.year}>2026</span>
      </div>
    </div>
  )
}
