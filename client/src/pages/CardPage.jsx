import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, ArrowLeft, X as XIcon } from 'lucide-react'
import axios from 'axios'
import styles from './CardPage.module.css'

const SHARE_TEXT = "Just got my #HackerHouseGoa 2026 builder card! 🌊🤖⛓️\nBuilding at India's biggest AI × Crypto hacker house in Goa.\nGet yours 👇 #FrameInGoa"

export default function CardPage() {
  const { id } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`/api/card/${id}`)
      .then((res) => setCard(res.data))
      .catch(() => setError('Card not found'))
      .finally(() => setLoading(false))
  }, [id])

  // Update page meta for OG (client-side, Twitter bots use server)
  useEffect(() => {
    if (card) {
      document.title = `${card.name || 'Builder'} @ HH Goa 2026 | #FrameInGoa`
    }
  }, [card])

  const handleShare = () => {
    const url = window.location.href
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(url)}`,
      '_blank', 'width=550,height=420'
    )
  }

  const handleDownload = async () => {
    if (!card?.imageUrl) return
    const response = await fetch(card.imageUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hhgoa2026-${id}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className={styles.center}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Loading card...</p>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className={styles.center}>
        <p style={{ fontSize: 48 }}>🤔</p>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>Card not found.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>
          <ArrowLeft size={16} /> Make Your Own
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/" className={styles.back}>
          <ArrowLeft size={16} /> Back to Generator
        </Link>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={card.imageUrl} alt="HH Goa 2026 Card" className={styles.image} />

          <div className={styles.meta}>
            {card.name && <h1 className={styles.name}>{card.name}</h1>}
            {card.builderTitle && (
              <p className={styles.builderTitle}>{card.builderTitle}</p>
            )}
          </div>

          <div className={styles.actions}>
            <button className="btn btn-primary" onClick={handleDownload} style={{ flex: 1 }}>
              <Download size={16} /> Download
            </button>
            <button className="btn btn-gold" onClick={handleShare} style={{ flex: 1 }}>
              <XIcon size={16} /> Share on X
            </button>
          </div>

          <Link to="/" className={styles.makeOwn}>
            🚀 Create your own HH Goa card
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
