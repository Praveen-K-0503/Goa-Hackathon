import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X, Sparkles } from 'lucide-react'
import styles from './GoaMoodboardGallery.module.css'

// Import the 4 user moodboard images
import moodboardCulture from '../assets/images/goa_moodboard_culture.jpg'
import moodboardFontainhas from '../assets/images/goa_moodboard_fontainhas.jpg'
import moodboardVibes from '../assets/images/goa_moodboard_vibes.jpg'
import moodboardSunkissed from '../assets/images/goa_moodboard_sunkissed.jpg'

const MOODBOARDS = [
  {
    id: 1,
    title: 'Baga Shacks & Nightlife Culture',
    category: 'CULTURE & FOOD',
    img: moodboardCulture,
    desc: 'Scooters, beach shacks, seafood thalis, and electric Goa nights.',
    tag: '⚡ NIGHTLIFE & FOOD',
  },
  {
    id: 2,
    title: 'Fontainhas Latin Quarter',
    category: 'HERITAGE ARCHITECTURE',
    img: moodboardFontainhas,
    desc: 'Sun-kissed mustard yellow Portuguese villas, hibiscus flowers & cameras.',
    tag: '🏛️ ARCHITECTURE',
  },
  {
    id: 3,
    title: 'Goa Coastal Moodboard',
    category: 'COASTAL LIVING',
    img: moodboardVibes,
    desc: 'Coconuts, evil eyes, surfboards, and palm trees along the Arabian sea.',
    tag: '🌊 BEACH VIBES',
  },
  {
    id: 4,
    title: 'Sunkissed Skin & Salty Hair',
    category: 'LIFESTYLE & NATURE',
    img: moodboardSunkissed,
    desc: 'Sunset sea shacks, shell necklaces, fresh feni, and salty ocean breeze.',
    tag: '☀️ SUNSET & SAND',
  },
]

export default function GoaMoodboardGallery() {
  const [activeItem, setActiveItem] = useState(null)

  return (
    <section id="goa-gallery" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionTag}>
            <Sparkles size={14} /> GOA AESTHETICS & MOODBOARD
          </span>
          <h2 className={styles.title}>The Spirit of Hacker House Goa</h2>
          <p className={styles.subtitle}>
            Explore the vibrant culture, sun-kissed beaches, Portuguese heritage architecture, and coastal lifestyle of Goa.
          </p>
        </motion.div>

        {/* Side-by-side Moodboard Grid */}
        <div className={styles.grid}>
          {MOODBOARDS.map((mb, idx) => (
            <motion.div
              key={mb.id}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => setActiveItem(mb)}
            >
              <div className={styles.imageWrap}>
                <img src={mb.img} alt={mb.title} className={styles.image} />
                <div className={styles.overlay}>
                  <span className={styles.expandBadge}>
                    <Maximize2 size={16} /> Expand
                  </span>
                </div>
                <div className={styles.topChip}>{mb.tag}</div>
              </div>

              <div className={styles.cardBody}>
                <span className={styles.category}>{mb.category}</span>
                <h3 className={styles.cardTitle}>{mb.title}</h3>
                <p className={styles.cardDesc}>{mb.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              className={styles.lightboxContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => setActiveItem(null)}
              >
                <X size={20} />
              </button>
              <img
                src={activeItem.img}
                alt={activeItem.title}
                className={styles.lightboxImg}
              />
              <div className={styles.lightboxMeta}>
                <span className={styles.lightboxCategory}>{activeItem.category}</span>
                <h3 className={styles.lightboxTitle}>{activeItem.title}</h3>
                <p className={styles.lightboxDesc}>{activeItem.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
