import { motion } from 'framer-motion'
import { Download, RefreshCw, Copy, X as XIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './ResultCard.module.css'
import axios from 'axios'

const SHARE_TEXT_SOLO = "Just got my #HackerHouseGoa 2026 builder card! 🌊🤖⛓️\n\nBuilding at India's biggest AI × Crypto hacker house in Goa.\n\nGet yours 👇 #FrameInGoa"
const SHARE_TEXT_TEAM = "Just submitted our #HackerHouseGoa 2026 crew banner! 🚀🌊\n\nBuilding together at India's premier AI × Crypto hacker house in Goa.\n\nGet yours 👇 #FrameInGoa"

export default function ResultCard({ result, onReset }) {
  if (!result) return null

  const { id, imageUrl, shareUrl, format, isTeam } = result

  const shareText = isTeam ? SHARE_TEXT_TEAM : SHARE_TEXT_SOLO

  // Check if it's a base64 image (local fallback) or a URL
  const isBase64 = imageUrl?.startsWith('data:')

  const handleDownload = async () => {
    try {
      if (isBase64) {
        // Direct base64 download
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = isTeam ? 'hhgoa2026-crew-banner.png' : `hhgoa2026-${format === 'A' ? 'frame' : 'card'}.png`
        link.click()
      } else {
        // Fetch from Cloudinary/Server and trigger download
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = isTeam ? `hhgoa2026-crew-banner-${id}.png` : `hhgoa2026-${format === 'A' ? 'frame' : 'card'}-${id}.png`
        link.click()
        URL.revokeObjectURL(url)
      }

      // Track download
      if (id) {
        axios.patch(`/api/card/${id}/download`).catch(() => {})
      }

      toast.success(isTeam ? 'Team Banner Downloaded! 📥' : 'Downloaded! 📥')
    } catch (err) {
      toast.error('Download failed. Right-click the image to save.')
    }
  }

  const handleShareX = () => {
    const url = isBase64
      ? 'https://hhgoa2026.vercel.app'
      : (shareUrl || 'https://hhgoa2026.vercel.app')

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`
    window.open(tweetUrl, '_blank', 'width=550,height=420')

    toast('Opening X/Twitter... 🐦', { icon: '𝕏' })
  }

  const handleCopyLink = async () => {
    const link = isBase64 ? window.location.href : (shareUrl || window.location.href)
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Copy failed. Please copy the URL manually.')
    }
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Success header */}
      <div className={styles.successHeader}>
        <motion.div
          className={styles.successIcon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
        >
          {isTeam ? '🚀' : '✨'}
        </motion.div>
        <div>
          <h2 className={styles.successTitle}>
            {isTeam ? 'Your Team Crew Banner is ready!' : 'Your card is ready!'}
          </h2>
          <p className={styles.successSub}>
            Download & share on X with <span className={styles.hash}>#FrameInGoa</span>
          </p>
        </div>
      </div>

      {/* Generated image */}
      <motion.div
        className={styles.imageWrapper}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img
          src={imageUrl}
          alt="Generated HH Goa 2026 card"
          className={styles.cardImage}
        />
        <div className={styles.imageGlow} />
      </motion.div>

      {/* Action buttons */}
      <div className={styles.actions}>
        {/* Primary: Download */}
        <motion.button
          className={`btn btn-primary ${styles.btnFull}`}
          onClick={handleDownload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Download size={18} />
          {isTeam ? 'Download Team Banner (1920×1080 PNG)' : 'Download PNG'}
        </motion.button>

        {/* Share to X */}
        <motion.button
          className={`btn btn-gold ${styles.btnFull}`}
          onClick={handleShareX}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <XIcon size={18} />
          Share Crew Banner on X  •  #FrameInGoa
        </motion.button>

        {/* Secondary actions */}
        <div className={styles.secondaryActions}>
          <motion.button
            className="btn btn-secondary"
            onClick={handleCopyLink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ flex: 1 }}
          >
            <Copy size={15} />
            Copy Link
          </motion.button>

          <motion.button
            className="btn btn-secondary"
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ flex: 1 }}
          >
            <RefreshCw size={15} />
            Create Another
          </motion.button>
        </div>
      </div>

      {/* Caption preview */}
      <div className={styles.captionPreview}>
        <p className={styles.captionLabel}>Pre-filled tweet caption:</p>
        <p className={styles.captionText}>{shareText}</p>
      </div>
    </motion.div>
  )
}
