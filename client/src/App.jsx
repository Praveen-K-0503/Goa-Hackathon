import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'

// Layout
import GoaBackground from './components/GoaBackground'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Page sections
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import GeneratorSection from './components/GeneratorSection'
import GoaMoodboardGallery from './components/GoaMoodboardGallery'
import Gallery from './components/Gallery'
import AboutSection from './components/AboutSection'
import FAQ from './components/FAQ'

// Card share page
import CardPage from './pages/CardPage'

// Hook
import { useCardGenerator } from './hooks/useCardGenerator'

import styles from './App.module.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/card/:id" element={<CardPage />} />
    </Routes>
  )
}

const SECTION_IDS = ['home', 'works', 'generator', 'moodboard', 'about', 'faq']

function MainApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [format, setFormat] = useState('A')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({ name: '', role: '', stack: '', builderTitle: '' })

  const { generateCard, loading, result, progress, reset } = useCardGenerator()

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)
  }, [])

  const handleClear = useCallback(() => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }, [preview])

  const handleReset = useCallback(() => {
    handleClear()
    reset()
    setFormat('A')
    setFormData({ name: '', role: '', stack: '', builderTitle: '' })
  }, [handleClear, reset])

  const handleGenerate = async (params) => {
    const res = await generateCard({ file, format, ...formData, ...params })
    if (res) {
      setTimeout(() => {
        const el = document.getElementById('result-section')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }

  // Smooth scroll to target section when clicking navbar/footer items
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const elem = document.getElementById(tabId)
      if (elem) {
        const offset = 80 // Navbar height offset
        const bodyRect = document.body.getBoundingClientRect().top
        const elemRect = elem.getBoundingClientRect().top
        const elemPosition = elemRect - bodyRect
        const offsetPosition = elemPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  // Real-time Scroll Spy: updates active tab as user scrolls down the page
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.app}>
      {/* Fixed Goa Background Video + Image */}
      <GoaBackground />

      {/* Sticky Navbar with active section indicator */}
      <Navbar activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Main Content — Continuous Single Page Scroll */}
      <main className={styles.main}>
        <div id="home">
          <HeroSection
            onCTAClick={() => handleSelectTab('generator')}
            onGoToGallery={() => handleSelectTab('gallery')}
          />
        </div>

        <div className={styles.sectionDivider} />

        <div id="works">
          <HowItWorks />
        </div>

        <div className={styles.sectionDivider} />

        <div id="generator">
          <GeneratorSection
            format={format}
            onFormatChange={setFormat}
            file={file}
            preview={preview}
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            formData={formData}
            onFormChange={setFormData}
            loading={loading}
            result={result}
            progress={progress}
            onGenerate={handleGenerate}
            onReset={handleReset}
          />
        </div>

        <div className={styles.sectionDivider} />

        <div id="moodboard">
          <GoaMoodboardGallery />
        </div>

        <div className={styles.sectionDivider} />

        <div id="about">
          <AboutSection />
        </div>

        <div className={styles.sectionDivider} />

        <div id="faq">
          <FAQ />
        </div>
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  )
}
