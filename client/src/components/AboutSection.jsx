import { motion } from 'framer-motion'
import styles from './AboutSection.module.css'

const stats = [
  { val: '247',    label: 'Selected Builders',    color: 'var(--accent-cyan)'   },
  { val: '10K+',   label: 'Applications',         color: 'var(--accent-purple)' },
  { val: '4 Days', label: 'Structured Building',  color: 'var(--accent-coral)'  },
  { val: '50+',    label: 'Speakers & Mentors',   color: 'var(--accent-gold)'   },
  { val: '$50K+',  label: 'In Bounties',          color: 'var(--accent-cyan)'   },
  { val: '100+',   label: 'Projects Shipped',     color: 'var(--accent-purple)' },
]

export default function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionTag}>ABOUT THE EVENT</span>
          <h2 className={styles.title}>What is Hacker House Goa?</h2>
        </motion.div>

        <div className={styles.twoCol}>
          {/* Left: description */}
          <motion.div
            className={styles.desc}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className={styles.badge}>
              🌊 India's Premier Builder Residency
            </div>
            <p>
              Hacker House Goa 2026 is India's most ambitious builder event — where
              the best developers, designers, marketers, and AI-native creators don't
              just hack, they <strong>ship</strong>.
            </p>
            <p>
              For <strong>4 days at a private beach resort in Goa</strong>, 247 selected
              builders live under one roof — building, scaling, launching, and marketing
              real products with VCs, mentors, and ecosystem leaders in the same building.
            </p>
            <p>
              Most hackathons give you 36 hours and a GitHub repo nobody opens Monday.
              Hacker House Goa gives you 4 days to ship something <em>real</em>.
            </p>
            <div className={styles.tagRow}>
              {['AI × Crypto', 'Multichain', 'Goa 🌊', 'Powered by 2:47PM Studio'].map((t) => (
                <span key={t} className={styles.tagChip}>{t}</span>
              ))}
            </div>
          </motion.div>

          {/* Right: stats grid */}
          <motion.div
            className={styles.statsGrid}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <span className={styles.statVal} style={{ color: s.color }}>{s.val}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
