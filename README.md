# 🌊 HH Goa 2026 — Frame & ID Card Generator

> **Hacker House Goa 2026 Shortlisting Task**  
> Build a branded photo frame / builder ID card generator for AI × Crypto builders.

[![Live Demo](https://img.shields.io/badge/Live-Demo-00f5ff?style=for-the-badge)](https://your-app.vercel.app)
[![#FrameInGoa](https://img.shields.io/badge/%23FrameInGoa-Twitter-1DA1F2?style=for-the-badge)](https://twitter.com/search?q=%23FrameInGoa)

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Format A: PFP Frame (X profile pic ready) | ✅ |
| Format B: Builder ID Card (event badge) | ✅ |
| HEIC (iPhone photo) support | ✅ |
| Server-side image compositing (Sharp) | ✅ |
| Cloudinary CDN for permanent URLs | ✅ |
| MongoDB card storage | ✅ |
| Share to X with `#FrameInGoa` pre-filled | ✅ |
| OG image preview on Twitter | ✅ |
| Real PNG download | ✅ |
| 3D animated starfield background (Three.js) | ✅ |
| Mobile-first responsive design | ✅ |
| Drag & drop upload (desktop) | ✅ |
| Camera capture (mobile) | ✅ |
| AI-generated builder title | ✅ |
| Rate limiting (20 req/hr/IP) | ✅ |
| No login / no signup | ✅ |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────┐
│   Client: React 18 + Vite            │
│   Three.js · Framer Motion           │
│   React Hook Form · Konva.js         │
│   Deploy: Vercel                     │
└──────────────┬───────────────────────┘
               │ REST API
┌──────────────▼───────────────────────┐
│   Server: Node.js + Express          │
│   Multer · Sharp · heic-convert      │
│   Cloudinary · Mongoose              │
│   Deploy: Railway                    │
└──────┬───────────────┬───────────────┘
       │               │
  MongoDB Atlas    Cloudinary CDN
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier — 25GB storage)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/hh-goa-2026.git
cd hh-goa-2026

# Install client deps
cd client && npm install

# Install server deps
cd ../server && npm install
```

### 2. Configure Environment

**Server** — copy and fill in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/hhgoa2026
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client** — `client/.env` is already set:
```env
VITE_API_URL=/api
```

### 3. Start Dev Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev
# → http://localhost:5000

# Terminal 2 — Frontend
cd client && npm run dev
# → http://localhost:5173
```

> **Note:** The app works without MongoDB/Cloudinary — images are returned as base64 (local fallback mode). Useful for testing.

---

## 📦 Deployment

### Frontend → Vercel

```bash
cd client
npx vercel --prod
```

Set environment variable in Vercel dashboard:
```
VITE_API_URL = https://your-backend.railway.app/api
```

### Backend → Railway

1. Push `server/` to GitHub
2. Connect to [Railway](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables:

```env
PORT=5000
MONGODB_URI=<your atlas uri>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

### MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free M0 cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (allow all for Railway)
5. Copy connection string → paste in `MONGODB_URI`

### Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) → free account
2. Go to Dashboard → copy **Cloud name**, **API Key**, **API Secret**
3. Paste in `.env`

---

## 🎨 Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| Vite | latest | Build tool + HMR |
| @react-three/fiber | latest | Three.js React renderer |
| @react-three/drei | latest | Three.js helpers |
| Framer Motion | latest | Animations |
| React Hook Form | latest | Form management |
| React Router | 6 | Client routing |
| Axios | latest | HTTP client |
| Lucide React | latest | Icons |
| React Hot Toast | latest | Notifications |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Express | 4 | HTTP server |
| Mongoose | 8 | MongoDB ODM |
| Multer | 1 | File upload |
| Sharp | 0.33 | Image processing |
| Cloudinary | 2 | Image CDN |
| heic-convert | 2 | iPhone HEIC → JPEG |
| helmet | 7 | Security headers |
| express-rate-limit | 7 | Rate limiting |
| uuid | 10 | Unique card IDs |

---

## 🖼️ Image Processing Pipeline

### Format A — PFP Frame
```
Upload → HEIC? Convert → Smart Crop 1000×1000 → Circular Mask → SVG Frame Overlay → PNG
```

### Format B — Builder ID Card
```
Upload → HEIC? Convert → Smart Crop 280×280 → Circular Mask →
SVG Card Template (1080×1080) → Composite Photo → Add Text Fields → PNG
```

Both pipelines run server-side with **Sharp** for:
- Smart-crop centering (attention-based)
- Circular mask via SVG
- Text rendering via embedded SVG
- Cloudinary upload for CDN URL

---

## 🔗 API Reference

### `POST /api/generate`
Generate a branded card image.

**Body** (`multipart/form-data`):
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `photo` | File | ✅ | JPG, PNG, HEIC, WebP |
| `format` | `"A"` \| `"B"` | ✅ | |
| `name` | string | Format B | Max 30 chars |
| `role` | string | Format B | Max 40 chars |
| `stack` | string | Format B | Max 60 chars |
| `builderTitle` | string | Format B | Auto-generated |

**Response** `200`:
```json
{
  "id": "abc123def456",
  "imageUrl": "https://res.cloudinary.com/.../hhgoa-abc123.png",
  "shareUrl": "https://your-app.vercel.app/card/abc123def456",
  "format": "B"
}
```

### `GET /api/card/:id`
Get card metadata (JSON).

### `GET /api/og/:id`
Returns HTML with Open Graph meta tags for Twitter link preview.

### `PATCH /api/card/:id/download`
Track download analytics.

---

## 📁 Project Structure

```
hh-goa-2026/
├── client/                    ← React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero3D.jsx          ← Three.js starfield
│   │   │   ├── ModeSelector.jsx    ← Format A/B toggle
│   │   │   ├── UploadZone.jsx      ← Drag-drop upload
│   │   │   ├── BuilderForm.jsx     ← Name/role/stack form
│   │   │   └── ResultCard.jsx      ← Download + Share UI
│   │   ├── hooks/
│   │   │   └── useCardGenerator.js ← API + state
│   │   ├── pages/
│   │   │   └── CardPage.jsx        ← /card/:id share page
│   │   ├── utils/
│   │   │   └── titleGenerator.js   ← Builder title AI
│   │   ├── styles/
│   │   │   └── index.css           ← Design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
└── server/                    ← Node.js + Express backend
    ├── src/
    │   ├── app.js                  ← Express entry + MongoDB
    │   ├── routes/card.routes.js   ← API routes
    │   ├── controllers/card.controller.js
    │   ├── services/
    │   │   ├── imageProcessor.js   ← Sharp compositing
    │   │   ├── cloudinary.js       ← CDN upload
    │   │   └── heicConverter.js    ← HEIC → JPEG
    │   ├── models/Card.model.js    ← Mongoose schema
    │   └── middleware/
    │       ├── upload.js           ← Multer config
    │       └── errorHandler.js
    └── package.json
```

---

## 🛡️ Security

- `helmet` — sets secure HTTP headers
- `cors` — whitelisted origins only
- `express-rate-limit` — 20 requests/hour/IP on `/api/generate`
- File type validation (MIME + extension)
- Max file size: 20MB
- No user data stored beyond card metadata
- `.env` never committed to git

---

## 🏆 Hackathon Details

**Event:** Hacker House Goa 2026  
**Organizer:** 2:47PM Studio  
**Theme:** AI × Crypto  
**Dates:** 4-day builder residency in Goa  
**Hashtag:** `#FrameInGoa`  
**Submit:** [forms.gle/jM5hTaGvsrfEfixPA](https://forms.gle/jM5hTaGvsrfEfixPA)  
**Deadline:** 11:59 PM, August 13, 2026

---

Made with ❤️ for HH Goa 2026 • `#FrameInGoa`
