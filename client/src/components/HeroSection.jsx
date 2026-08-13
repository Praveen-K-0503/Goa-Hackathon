import { motion } from 'framer-motion'
import styles from './HeroSection.module.css'
import logoImg from '../assets/images/goa_hackathon_logo.png'

const stats = [
  { value: '247', label: 'Builders' },
  { value: '4', label: 'Days' },
  { value: '$50K+', label: 'Bounties' },
  { value: '50+', label: 'Mentors' },
]

export default function HeroSection({ onCTAClick, onGoToGallery }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Center: text */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className={styles.eyebrow}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img src={logoImg} alt="GOA Logo" className={styles.eyebrowLogo} />
            HACKER HOUSE GOA 2026 · SHORTLISTING TASK
          </motion.div>

          <h1 className={styles.headline}>
            Claim your<br />
            <span className="gradient-text">HH Goa 2026</span><br />
            builder identity
          </h1>

          <p className={styles.sub}>
            Upload your photo and get a branded <strong>PFP frame</strong> or{' '}
            <strong>Builder ID card</strong> in seconds — ready to download and
            share on X. No sign-up. No waiting.
          </p>

          <div className={styles.actions}>
            <motion.button
              className={`btn btn-primary ${styles.heroCta}`}
              onClick={onCTAClick}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              Create My Card ✨
            </motion.button>
            <motion.a
              href="#moodboard"
              className={`btn btn-secondary ${styles.heroSecondary}`}
              onClick={(e) => {
                e.preventDefault()
                if (onGoToGallery) onGoToGallery()
              }}
              whileHover={{ scale: 1.02 }}
            >
              Goa Moodboard 🌊
            </motion.a>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.stat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>


    </section>
  )
}
