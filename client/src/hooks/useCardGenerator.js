import { useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

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
        members.forEach((m, idx) => {
          if (m.file) {
            formData.append(`photo_${idx}`, m.file)
          }
          membersInfo.push({
            name: m.name || '',
            role: m.role || '',
            stack: m.stack || '',
            builderTitle: m.builderTitle || '',
          })
        })

        formData.append('membersJson', JSON.stringify(membersInfo))
      } else {
        if (!file) {
          toast.error('Please upload a photo first!')
          setLoading(false)
          return
        }

        formData.append('photo', file)
        if (format === 'B') {
          formData.append('name', name || '')
          formData.append('role', role || '')
          formData.append('stack', stack || '')
          formData.append('builderTitle', builderTitle || '')
        }
      }

      setProgress(30)

      const response = await axios.post(`${API_BASE}/generate`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded / e.total) * 40)
          setProgress(30 + pct)
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
