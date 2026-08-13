import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid rgba(2,132,199,0.25)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 20px rgba(15,23,42,0.12)',
            fontWeight: '600',
          },
          success: {
            iconTheme: { primary: '#0284c7', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#e11d48', secondary: '#ffffff' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
