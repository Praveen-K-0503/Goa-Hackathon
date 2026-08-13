import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Sparkles } from 'lucide-react'
import { generateBuilderTitle } from '../utils/titleGenerator'
import styles from './BuilderForm.module.css'

export default function BuilderForm({ onChange }) {
  const { register, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { name: '', role: '', stack: '', builderTitle: '' }
  })

  const role = watch('role')
  const stack = watch('stack')
  const name = watch('name')
  const builderTitle = watch('builderTitle')

  // Auto-generate builder title when role/stack changes
  useEffect(() => {
    if (role || stack) {
      const title = generateBuilderTitle(role, stack)
      setValue('builderTitle', title)
    }
  }, [role, stack, setValue])

  // Notify parent on any field change
  useEffect(() => {
    onChange?.({ name, role, stack, builderTitle })
  }, [name, role, stack, builderTitle, onChange])

  const rerollTitle = () => {
    // Force a different title by slightly modifying input
    const title = generateBuilderTitle(role + ' x', stack + ' y')
    setValue('builderTitle', title)
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.header}>
        <span className={styles.step}>STEP 3</span>
        <h2 className={styles.title}>Your builder details</h2>
      </div>

      <div className={styles.form}>
        {/* Name */}
        <div className="form-group">
          <label className="form-label">Your Name *</label>
          <input
            {...register('name', { required: 'Name is required', maxLength: 30 })}
            className="form-input"
            placeholder="e.g. Arjun Sharma"
            autoComplete="name"
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>

        {/* Role -->  -->  */}
        <div className="form-group">
          <label className="form-label">Role / Title</label>
          <input
            {...register('role', { maxLength: 40 })}
            className="form-input"
            placeholder="e.g. Fullstack Developer, AI Researcher"
          />
        </div>

        {/* Stack -->  -->  -->  */}
        <div className="form-group">
          <label className="form-label">Tech Stack / Skills</label>
          <input
            {...register('stack', { maxLength: 60 })}
            className="form-input"
            placeholder="e.g. React, Solidity, Python, LLMs"
          />
        </div>

        {/* Builder Title (auto-generated) -->  -->  -->  -->  */}
        <div className="form-group">
          <label className="form-label">
            <Sparkles size={12} style={{ display: 'inline', marginRight: 5 }} />
            Builder Title (auto-generated)
          </label>
          <div className={styles.titleRow}>
            <input
              {...register('builderTitle')}
              className={`form-input ${styles.titleInput}`}
              placeholder="Your epic builder title"
              readOnly
            />
            <motion.button
              type="button"
              className={styles.rerollBtn}
              onClick={rerollTitle}
              title="Generate new title"
              whileHover={{ scale: 1.08, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              ↻
            </motion.button>
          </div>
          <p className={styles.hint}>Auto-generated from your role & stack. Click ↻ to reroll!</p>
        </div>
      </div>
    </motion.div>
  )
}
