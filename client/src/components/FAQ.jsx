import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import styles from './FAQ.module.css'

const FAQS = [
  {
    q: 'What formats can I create?',
    a: 'Two formats: Format A is a circular PFP frame — it wraps your photo in a branded HH Goa 2026 ring, perfect for your X profile picture. Format B is a full Builder ID Card — a 1080×1080 event badge with your photo, name, role, tech stack, and an AI-generated builder title.',
  },
  {
    q: 'Do I need to sign up or create an account?',
    a: 'No. Zero login. Zero signup. Upload your photo, fill in your details (Format B only), and your card generates instantly. We built this as a one-pass tool — start to finish without any account required.',
  },
  {
    q: 'Is my photo stored on your servers?',
    a: 'Your uploaded photo is processed server-side to generate the card and is not stored permanently. The generated card image is hosted on Cloudinary CDN to power the shareable link and Twitter OG preview. We do not share or sell any data.',
  },
  {
    q: 'How do I share on X with the correct hashtag?',
    a: 'After your card is generated, click "Share on X". This opens a pre-filled tweet with your card link and the caption already written — including #FrameInGoa and #HackerHouseGoa. ⚠️ Important: submissions without #FrameInGoa in the X post will be flagged as invalid by the HH Goa team.',
  },
  {
    q: 'What image formats can I upload?',
    a: 'JPG, PNG, WebP, and HEIC (iPhone photos) are all supported. You don\'t need to crop or resize your photo first — our server handles portrait, landscape, square, and off-center photos automatically with smart cropping.',
  },
  {
    q: 'What is #FrameInGoa?',
    a: '#FrameInGoa is the official hashtag for this shortlisting task from Hacker House Goa 2026. Sharing your generated card on X with this hashtag is a required step in the selection process. Every valid submission must include an X post with #FrameInGoa.',
  },
]

function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      className={`${styles.item} ${open ? styles.itemOpen : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <button className={styles.question} onClick={() => setOpen((o) => !o)}>
        <span>{faq.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={styles.chevron}
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="answer"
            className={styles.answer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className={styles.sectionTag}>FAQ</span>
          <h2 className={styles.title}>Common questions</h2>
          <p className={styles.subtitle}>Everything you need to know before creating your card.</p>
        </motion.div>

        <div className={styles.list}>
          {FAQS.map((faq, i) => (
            <FaqItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
