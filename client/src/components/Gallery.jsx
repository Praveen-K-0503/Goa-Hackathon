import { motion } from 'framer-motion'
import styles from './Gallery.module.css'

// Sample cards rendered as pure CSS/SVG — zero image loading
const SAMPLES = [
  {
    type: 'B',
    name: 'Arjun Sharma',
    role: 'AI Engineer',
    stack: 'Python · LLMs · RAG',
    title: '🧠 Neural Forge Master',
    accent: 'var(--accent-cyan)',
  },
  {
    type: 'A',
    label: 'PFP Frame',
    accent: 'var(--accent-coral)',
  },
  {
    type: 'B',
    name: 'Diya Nair',
    role: 'DeFi Developer',
    stack: 'Solidity · Foundry · EVM',
    title: '⛓ Chain Whisperer',
    accent: 'var(--accent-purple)',
  },
  {
    type: 'A',
    label: 'PFP Frame',
    accent: 'var(--accent-cyan)',
  },
  {
    type: 'B',
    name: 'Rishi Kapoor',
    role: 'Product Designer',
    stack: 'Figma · Motion · 3D',
    title: '🎨 Pixel Alchemist',
    accent: 'var(--accent-gold)',
  },
  {
    type: 'B',
    name: 'Meera Iyer',
    role: 'Fullstack Dev',
    stack: 'MERN · AWS · Docker',
    title: '⚡ Stack Bender',
    accent: 'var(--accent-coral)',
  },
]

function SampleCardB({ name, role, stack, title, accent }) {
  return (
    <div className={styles.sampleB} style={{ '--sample-accent': accent }}>
      <div className={styles.sampleBBar} />
      <div className={styles.sampleBHead}>
        <span className={styles.sampleBBadge}>BUILDER ID</span>
        <span className={styles.sampleBEvent}>HH GOA 2026</span>
      </div>
      <div className={styles.sampleBPhoto} style={{ boxShadow: `0 0 20px ${accent}40` }} />
      <div className={styles.sampleBName}>{name}</div>
      <div className={styles.sampleBRole} style={{ color: accent }}>{role}</div>
      <div className={styles.sampleBTitle}>{title}</div>
      <div className={styles.sampleBStack}>{stack}</div>
      <div className={styles.sampleBHash}>#FrameInGoa</div>
    </div>
  )
}

function SampleCardA({ accent }) {
  return (
    <div className={styles.sampleA} style={{ '--sample-accent': accent }}>
      <div className={styles.sampleAPhoto} />
      <div className={styles.sampleARing} />
      <div className={styles.sampleATop}>HH GOA 2026</div>
      <div className={styles.sampleABot}>AI × CRYPTO</div>
      <div className={styles.sampleAPfpLabel}>PFP Frame</div>
    </div>
  )
}

export default function Gallery() {
  return (
    <section id="gallery" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionTag}>GALLERY</span>
          <h2 className={styles.title}>See what builders are creating</h2>
          <p className={styles.subtitle}>
            Sample cards from the community. Your design will be uniquely yours.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {SAMPLES.map((s, i) => (
            <motion.div
              key={i}
              className={styles.item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              {s.type === 'B'
                ? <SampleCardB {...s} />
                : <SampleCardA {...s} />
              }
              <div className={styles.itemOverlay}>
                <span>Create yours →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
