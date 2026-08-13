import { useRef, useEffect } from 'react'
import styles from './GoaBackground.module.css'
import goaVideo from '../assets/goa_beach_video.mp4'

export default function GoaBackground() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback gracefully if autoplay policy restricts
      })
    }
  }, [])

  return (
    <div className={styles.bgContainer}>
      {/* Background Video Layer */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
      >
        <source src={goaVideo} type="video/mp4" />
      </video>

      {/* Soft overlay to allow text readability over bright video */}
      <div className={styles.overlay} />

      {/* Soft Bottom Fade to content sections */}
      <div className={styles.fadeBottom} />
    </div>
  )
}
