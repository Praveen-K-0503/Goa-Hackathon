import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Upload, Trash2 } from 'lucide-react'
import styles from './GeneratorSection.module.css'
import ModeSelector from './ModeSelector'
import UploadZone from './UploadZone'
import BuilderForm from './BuilderForm'
import ResultCard from './ResultCard'
import { generateBuilderTitle } from '../utils/titleGenerator'

export default function GeneratorSection({
  format, onFormatChange,
  file, preview, onFileSelect, onClear,
  formData, onFormChange,
  loading, result, progress,
  onGenerate, onReset
}) {
  const [teamSize, setTeamSize] = useState(1) // 1 = Solo, 2, 3 = Crew
  const [teamName, setTeamName] = useState('Vibe Crew')

  // Array of member states for Crew Mode (Max 3) — Clean initial state
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: '', role: '', stack: '', builderTitle: '⚡ Vibe Coder Supreme', file: null, preview: null },
    { id: 2, name: '', role: '', stack: '', builderTitle: '🧠 Neural Forge Master', file: null, preview: null },
    { id: 3, name: '', role: '', stack: '', builderTitle: '⛓ Chain Whisperer', file: null, preview: null },
  ])

  const updateMember = (index, field, value) => {
    setTeamMembers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleMemberPhoto = (index, selectedFile) => {
    if (!selectedFile) return
    const url = URL.createObjectURL(selectedFile)
    setTeamMembers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], file: selectedFile, preview: url }
      return next
    })
  }

  const handleMemberRerollTitle = (index) => {
    const role = teamMembers[index]?.role || 'Hacker'
    const newTitle = generateBuilderTitle(role)
    updateMember(index, 'builderTitle', newTitle)
  }

  const isTeam = teamSize > 1
  const canGenerateSolo = !isTeam && !!file && !loading
  const canGenerateTeam = isTeam && teamMembers.slice(0, teamSize).some((m) => !!m.file) && !loading
  const canGenerate = isTeam ? canGenerateTeam : canGenerateSolo

  const handleTriggerGenerate = () => {
    if (isTeam) {
      onGenerate({
        isTeam: true,
        teamSize,
        teamName,
        members: teamMembers.slice(0, teamSize),
      })
    } else {
      onGenerate({ isTeam: false })
    }
  }

  return (
    <section id="generator" className={styles.section}>
      <div className={styles.container}>
        {/* Section header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionTag}>GENERATOR</span>
          <h2 className={styles.title}>{isTeam ? `Build Crew of ${teamSize} Banner` : 'Create your card'}</h2>
          <p className={styles.subtitle}>
            {isTeam
              ? `Fill in details for your ${teamSize} crew members and export a 1920×1080 Team Banner.`
              : 'Choose your format, upload your photo, and get your branded card in seconds.'}
          </p>
        </motion.div>

        {/* Single-column centered form box */}
        <div className={styles.controlsBox}>
          <ModeSelector
            selected={format}
            onSelect={onFormatChange}
            teamSize={teamSize}
            onTeamSizeChange={setTeamSize}
            teamName={teamName}
            onTeamNameChange={setTeamName}
          />

          <div className={styles.divider} />

          {/* SOLO MODE FORM */}
          {!isTeam && (
            <>
              <UploadZone
                file={file}
                preview={preview}
                onFileSelect={onFileSelect}
                onClear={onClear}
              />

              <AnimatePresence>
                {format === 'B' && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.divider} />
                    <BuilderForm onChange={onFormChange} />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* CREW / TEAM MODE MULTI-MEMBER FORM */}
          {isTeam && (
            <div className={styles.crewFormContainer}>
              <div className={styles.crewFormHeader}>
                <span className={styles.crewFormBadge}>CREW SUBMISSION</span>
                <h3 className={styles.crewFormTitle}>Member Cards ({teamSize} Members)</h3>
              </div>

              <div className={styles.crewMembersGrid}>
                {Array.from({ length: teamSize }).map((_, idx) => {
                  const m = teamMembers[idx]
                  return (
                    <div key={idx} className={styles.memberBox}>
                      <div className={styles.memberBoxHeader}>
                        <span className={styles.memberNum}>MEMBER 0{idx + 1}</span>
                        {m.builderTitle && (
                          <span className={styles.memberTitleBadge}>⚡ {m.builderTitle}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Builder Name *</label>
                        <input
                          className="form-input"
                          value={m.name}
                          onChange={(e) => updateMember(idx, 'name', e.target.value)}
                          placeholder={`e.g. Builder ${idx + 1}`}
                        />
                      </div>

                      <div className="form-group" style={{ marginTop: 10 }}>
                        <label className="form-label">Role / Stack</label>
                        <input
                          className="form-input"
                          value={m.role}
                          onChange={(e) => updateMember(idx, 'role', e.target.value)}
                          placeholder="e.g. Full Stack Dev, AI Engineer"
                        />
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <label className="form-label">Photo Upload *</label>
                        {m.preview ? (
                          <div className={styles.memberPhotoPreview}>
                            <img src={m.preview} alt="Member photo" className={styles.memberImg} />
                            <button
                              className={styles.memberClearBtn}
                              type="button"
                              onClick={() => {
                                updateMember(idx, 'preview', null)
                                updateMember(idx, 'file', null)
                              }}
                            >
                              <Trash2 size={14} /> Remove Photo
                            </button>
                          </div>
                        ) : (
                          <label className={styles.memberUploadBtn}>
                            <Upload size={16} /> Upload Member {idx + 1} Photo
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files?.[0]) handleMemberPhoto(idx, e.target.files[0])
                              }}
                            />
                          </label>
                        )}
                      </div>

                      <button
                        className={styles.memberRerollBtn}
                        type="button"
                        onClick={() => handleMemberRerollTitle(idx)}
                      >
                        <RefreshCw size={12} /> Reroll Title
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className={styles.divider} />

          {/* Progress bar */}
          {loading && (
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
              <span className={styles.progressText}>
                {isTeam ? 'Exporting 1920×1080 Team Banner…' : 'Generating your card…'}
              </span>
            </div>
          )}

          <motion.button
            className={`btn btn-primary ${styles.generateBtn}`}
            onClick={handleTriggerGenerate}
            disabled={!canGenerate}
            whileHover={canGenerate ? { scale: 1.02, y: -2 } : {}}
            whileTap={canGenerate ? { scale: 0.97 } : {}}
          >
            {loading
              ? <><div className="spinner" /> Generating…</>
              : <>✨ {isTeam ? `Export Crew of ${teamSize} Banner` : 'Generate My Card'}</>
            }
          </motion.button>

          {!canGenerate && !loading && (
            <p className={styles.hint}>
              {isTeam
                ? '⬆ Upload at least 1 member photo to generate Team Banner'
                : '⬆ Upload a photo first to get started'}
            </p>
          )}
        </div>

        {/* GENERATED ID / TEAM BANNER RESULT (RENDERED BELOW FORM) */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="result-section"
              className={styles.resultContainer}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className={styles.resultHeader}>
                <span className={styles.resultBadge}>FINAL GRAPHIC GENERATED</span>
                <h3 className={styles.resultTitle}>
                  {isTeam ? 'Your 1920×1080 Team Banner is Ready!' : 'Your Builder Card is Ready!'}
                </h3>
              </div>
              <ResultCard result={result} onReset={onReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
