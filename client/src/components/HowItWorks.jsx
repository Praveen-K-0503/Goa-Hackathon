import { motion } from 'framer-motion'
import { Upload, Sparkles, Share2 } from 'lucide-react'
import styles from './HowItWorks.module.css'

const steps = [
  {
    num: '01',
    icon: Upload,
    color: 'cyan',
    title: 'Upload Your Photo',
    desc: 'Drop any photo — JPG, PNG, or HEIC straight from your iPhone. Any aspect ratio works. We handle the cropping.',
  },
  {
    num: '02',
    icon: Sparkles,
    color: 'purple',
    title: 'Customise & Generate',
    desc: 'Choose a PFP frame or full Builder ID Card. Add your name, role and stack — your builder title is auto-generated.',
  },
  {
    num: '03',
    icon: Share2,
    color: 'coral',
    title: 'Download & Share on X',
    desc: 'Download a real PNG file instantly. Hit "Share on X" to open a pre-filled tweet with your card and #FrameInGoa.',
  },
]

const colorMap = {
  cyan:   { accent: 'var(--accent-cyan)',   glow: 'rgba(0,245,255,0.15)',   border: 'rgba(0,245,255,0.25)'   },
  purple: { accent: 'var(--accent-purple)', glow: 'rgba(123,47,255,0.15)',  border: 'rgba(123,47,255,0.25)'  },
  coral:  { accent: 'var(--accent-coral)',  glow: 'rgba(255,61,113,0.15)',  border: 'rgba(255,61,113,0.25)'  },
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionTag}>HOW IT WORKS</span>
          <h2 className={styles.title}>Three steps to your card</h2>
          <p className={styles.subtitle}>
            No accounts. No waiting. Upload to download in under 10 seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className={styles.steps}>
          {steps.map((step, i) => {
            const c = colorMap[step.color]
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                className={styles.step}
                style={{ '--step-border': c.border, '--step-glow': c.glow }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                {/* Number */}
                <span className={styles.stepNum} style={{ color: c.accent }}>
                  {step.num}
                </span>

                {/* Icon circle */}
                <div
                  className={styles.iconCircle}
                  style={{
                    background: c.glow,
                    border: `1.5px solid ${c.border}`,
                    boxShadow: `0 0 20px ${c.glow}`,
                    color: c.accent,
                  }}
                >
                  <Icon size={28} strokeWidth={1.8} />
                </div>

                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>

                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className={styles.connector}>
                    <motion.div
                      className={styles.connectorLine}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
                    />
                    <span className={styles.connectorArrow}>→</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
