import { useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

// Helper: Compress photo on client side before upload to prevent Vercel 413 Payload Too Large error
async function compressImage(file, maxDim = 1200, quality = 0.85) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file)
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => resolve(file)
    img.src = url
  })
}

export function useCardGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [progress, setProgress] = useState(0)

  const generateCard = useCallback(async ({
    file,
    format,
    name,
    role,
    stack,
    builderTitle,
    isTeam,
    teamName,
    teamSize,
    members, // Array of { file, name, role, stack, builderTitle }
  }) => {
    setLoading(true)
    setProgress(10)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('format', format)

      if (isTeam) {
        formData.append('isTeam', 'true')
        formData.append('teamName', teamName || 'Vibe Crew')
        formData.append('teamSize', String(teamSize || 2))

        const membersInfo = []
        for (let idx = 0; idx < (members || []).length; idx++) {
          const m = members[idx]
          if (m.file) {
            const compressed = await compressImage(m.file)
            formData.append(`photo_${idx}`, compressed)
          }
          membersInfo.push({
            name: m.name || '',
            role: m.role || '',
            stack: m.stack || '',
            builderTitle: m.builderTitle || '',
          })
        }

        formData.append('membersJson', JSON.stringify(membersInfo))
      } else {
        if (!file) {
          toast.error('Please upload a photo first!')
          setLoading(false)
          return
        }

        const compressed = await compressImage(file)
        formData.append('photo', compressed)

        if (format === 'B') {
          formData.append('name', name || '')
          formData.append('role', role || '')
          formData.append('stack', stack || '')
          formData.append('builderTitle', builderTitle || '')
        }
      }

      setProgress(40)

      const response = await axios.post(`${API_BASE}/generate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded / e.total) * 40)
          setProgress(40 + pct)
        },
        timeout: 90000,
      })

      setProgress(90)
      const data = response.data
      setResult(data)
      setProgress(100)

      toast.success(isTeam ? 'Team Crew Banner is ready! 🚀🎉' : 'Your card is ready! 🎉')
      return data
    } catch (err) {
      console.error('Generation failed:', err)
      const msg = err.response?.data?.error || 'Generation failed. Please try again.'
      toast.error(msg)
      setProgress(0)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setProgress(0)
    setLoading(false)
  }, [])

  return { generateCard, loading, result, progress, reset }
}
