import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, ImageIcon, X } from 'lucide-react'
import styles from './UploadZone.module.css'
import toast from 'react-hot-toast'

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'image/webp']
const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export default function UploadZone({ file, preview, onFileSelect, onClear }) {
  const inputRef = useRef()
  const cameraRef = useRef()
  const [dragging, setDragging] = useState(false)

  const validateAndSet = useCallback((selectedFile) => {
    if (!selectedFile) return

    const mime = selectedFile.type.toLowerCase()
    const ext = selectedFile.name.split('.').pop().toLowerCase()
    const validExts = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp']

    if (!ACCEPTED.includes(mime) && !validExts.includes(ext)) {
      toast.error('Please upload a JPG, PNG, HEIC, or WebP image.')
      return
    }

    if (selectedFile.size > MAX_SIZE) {
      toast.error('File too large. Maximum size is 20MB.')
      return
    }

    onFileSelect(selectedFile)
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    validateAndSet(dropped)
  }, [validateAndSet])

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.step}>STEP 2</span>
        <h2 className={styles.title}>Upload your photo</h2>
      </div>

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            className={styles.previewWrapper}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <img src={preview} alt="Uploaded preview" className={styles.previewImg} />
            <div className={styles.previewOverlay}>
              <span className={styles.fileName}>{file?.name}</span>
              <button className={styles.clearBtn} onClick={onClear} title="Remove photo">
                <X size={16} />
              </button>
            </div>
            <div className={styles.successBadge}>
              <span>✓</span> Photo ready
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={styles.uploadIcon}
              animate={{ y: dragging ? -8 : 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Upload size={40} strokeWidth={1.5} />
            </motion.div>
            <p className={styles.uploadMain}>
              {dragging ? 'Drop it here!' : 'Drop photo here'}
            </p>
            <p className={styles.uploadSub}>or click to browse</p>
            <p className={styles.uploadFormats}>JPG · PNG · HEIC · WebP • Max 20MB</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile camera button */}
      {!preview && (
        <motion.button
          className={`${styles.cameraBtn} btn btn-secondary`}
          onClick={() => cameraRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Camera size={18} />
          Take Photo
        </motion.button>
      )}

      {/* Hidden file inputs */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp,.heic,.heif"
        onChange={(e) => validateAndSet(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => validateAndSet(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </div>
  )
}
