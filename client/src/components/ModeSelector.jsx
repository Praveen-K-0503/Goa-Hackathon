import { motion } from 'framer-motion'
import styles from './ModeSelector.module.css'

const formats = [
  {
    id: 'A',
    label: 'PFP Frame',
    emoji: '🖼️',
    desc: 'Branded circle frame for your X profile picture',
    tag: 'Format A',
  },
  {
    id: 'B',
    label: 'Builder ID Card',
    emoji: '🪪',
    desc: 'Event badge with photo, name, role & builder title',
    tag: 'Format B',
  },
]

const crewSizes = [
  { size: 1, label: 'Solo Card', tag: '1 Builder' },
  { size: 2, label: 'Crew of 2', tag: 'Duo Team' },
  { size: 3, label: 'Crew of 3', tag: 'Trio Team' },
]

export default function ModeSelector({ selected, onSelect, teamSize = 1, onTeamSizeChange, teamName, onTeamNameChange }) {
  return (
    <div className={styles.container}>
      {/* ── STEP 1: Submission Type (Solo vs Crew) ── */}
      <div className={styles.header}>
        <span className={styles.step}>STEP 1</span>
        <h2 className={styles.title}>Select Team Size</h2>
      </div>

      <div className={styles.crewGrid}>
        {crewSizes.map((c) => (
          <button
            key={c.size}
            className={`${styles.crewBtn} ${teamSize === c.size ? styles.crewBtnActive : ''}`}
            onClick={() => onTeamSizeChange(c.size)}
          >
            <span className={styles.crewTag}>{c.tag}</span>
            <span className={styles.crewLabel}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Team Name Input (shown if team size > 1) */}
      {teamSize > 1 && (
        <motion.div
          className={styles.teamNameWrap}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="form-label">Team / Crew Name *</label>
          <input
            className="form-input"
            value={teamName || ''}
            onChange={(e) => onTeamNameChange?.(e.target.value)}
            placeholder="e.g. Arambol Animators, Vibe Coders"
          />
        </motion.div>
      )}

      {/* ── STEP 2: Choose Graphic Format ── */}
      <div className={styles.header} style={{ marginTop: 12 }}>
        <span className={styles.step}>FORMAT</span>
        <h2 className={styles.title}>Choose graphic design</h2>
      </div>

      <div className={styles.grid}>
        {formats.map((mode) => (
          <motion.button
            key={mode.id}
            className={`${styles.card} ${selected === mode.id ? styles.active : ''}`}
            onClick={() => onSelect(mode.id)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className={styles.tag}>{mode.tag}</span>
            <span className={styles.emoji}>{mode.emoji}</span>
            <h3 className={styles.cardTitle}>{mode.label}</h3>
            <p className={styles.cardDesc}>{mode.desc}</p>

            {selected === mode.id && (
              <motion.div
                className={styles.activeIndicator}
                layoutId="activeMode"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
