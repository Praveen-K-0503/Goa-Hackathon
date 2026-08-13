const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// ─── Utility: Circular Mask SVG ─────────────────────────────────────────────
function circularMaskSVG(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`
  );
}

// ─── Format A: PFP Frame (1000×1000) ─────────────────────────────────────────
async function generateFrameA(photoBuffer) {
  const SIZE = 1000;

  // 1. Resize & smart-crop photo to square (auto-rotate according to EXIF metadata)
  const squarePhoto = await sharp(photoBuffer)
    .rotate()
    .resize(SIZE, SIZE, { fit: 'cover', position: 'attention' })
    .toBuffer();

  // 2. Apply circular mask
  const circularPhoto = await sharp(squarePhoto)
    .composite([{
      input: circularMaskSVG(SIZE),
      blend: 'dest-in',
    }])
    .png()
    .toBuffer();

  // 3. Build the frame SVG overlay
  const frameSVG = buildFrameASVG(SIZE);

  // 4. Create dark base canvas
  const base = await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 4, g: 8, b: 23, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  // 5. Composite: base → circular photo → frame overlay
  const result = await sharp(base)
    .composite([
      { input: circularPhoto, top: 0, left: 0 },
      { input: Buffer.from(frameSVG), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 3, effort: 1 })
    .toBuffer();

  return result;
}

// ─── Format B: Builder ID Card (Vertical College Badge Format 700×1000) ──────
async function generateFrameB({ photoBuffer, name, role, stack, builderTitle }) {
  const W = 700;
  const H = 1000;
  const PHOTO_SIZE = 240;
  const PHOTO_X = 230; // (700 - 240) / 2 = 230
  const PHOTO_Y = 120; // Top of photo (Center at cx=350, cy=240, r=120)

  // 1. Resize & crop photo to circle (auto-rotate according to EXIF metadata)
  const squarePhoto = await sharp(photoBuffer)
    .rotate()
    .resize(PHOTO_SIZE, PHOTO_SIZE, { fit: 'cover', position: 'attention' })
    .toBuffer();

  const circularPhoto = await sharp(squarePhoto)
    .composite([{
      input: circularMaskSVG(PHOTO_SIZE),
      blend: 'dest-in',
    }])
    .png()
    .toBuffer();

  // 2. Build full card SVG
  const cardSVG = buildCardSVG({ W, H, name, role, stack, builderTitle });

  // 3. Composite card SVG + photo
  const result = await sharp(Buffer.from(cardSVG))
    .composite([
      {
        input: circularPhoto,
        top: PHOTO_Y,
        left: PHOTO_X,
      },
    ])
    .png({ compressionLevel: 3, effort: 1 })
    .toBuffer();

  return result;
}

// ─── SVG: Format A Frame ─────────────────────────────────────────────────────
function buildFrameASVG(size) {
  const half = size / 2;
  const r = half - 24; // frame ring radius

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00f5ff;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#ff2a85;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ffb703;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#00f5ff;stop-opacity:0.8"/>
        <stop offset="100%" style="stop-color:#ff2a85;stop-opacity:0.8"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <!-- Outer glow ring -->
    <circle cx="${half}" cy="${half}" r="${r + 10}" fill="none"
      stroke="url(#frameGrad)" stroke-width="4" opacity="0.45" filter="url(#glow)"/>

    <!-- Main frame ring -->
    <circle cx="${half}" cy="${half}" r="${r}" fill="none"
      stroke="url(#frameGrad)" stroke-width="18"/>

    <!-- Inner accent ring -->
    <circle cx="${half}" cy="${half}" r="${r - 22}" fill="none"
      stroke="url(#frameGrad)" stroke-width="2" opacity="0.6"/>

    <!-- Tropical Wave Curve Accent (Top) -->
    <path d="M ${half - 180} 50 Q ${half} 15 ${half + 180} 50" fill="none" stroke="url(#waveGrad)" stroke-width="3" opacity="0.8"/>

    <!-- Top badge: "HH GOA 2026" -->
    <rect x="${half - 120}" y="18" width="240" height="46" rx="23"
      fill="#040817" stroke="url(#frameGrad)" stroke-width="2.5"/>
    <text x="${half}" y="47" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="17" font-weight="900"
      fill="url(#frameGrad)" letter-spacing="3">HH GOA 2026</text>

    <!-- Bottom badge: "AI × CRYPTO • GOA 🌊" -->
    <rect x="${half - 145}" y="${size - 68}" width="290" height="46" rx="23"
      fill="#040817" stroke="url(#frameGrad)" stroke-width="2.5"/>
    <text x="${half}" y="${size - 43}" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="15" font-weight="900"
      fill="#00f5ff" letter-spacing="3">AI × CRYPTO • GOA 🌊</text>

    <!-- Corner dots -->
    <circle cx="80" cy="80" r="7" fill="#00f5ff" opacity="0.9"/>
    <circle cx="${size - 80}" cy="80" r="7" fill="#ff2a85" opacity="0.9"/>
    <circle cx="80" cy="${size - 80}" r="7" fill="#ffb703" opacity="0.9"/>
    <circle cx="${size - 80}" cy="${size - 80}" r="7" fill="#00f5ff" opacity="0.9"/>

    <!-- Hashtag watermark -->
    <text x="${half}" y="${size - 10}" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="12" font-weight="700"
      fill="#ffffff" opacity="0.45" letter-spacing="2">#FrameInGoa</text>
  </svg>`;
}

// ─── SVG: Format B ID Card (College ID Badge Dimensions 700×1000) ─────────────
function buildCardSVG({ W, H, name, role, stack, builderTitle }) {
  const safeName = escapeXml(name || 'Builder');
  const safeRole = escapeXml(role || 'Hacker');
  const safeStack = escapeXml(stack || 'Full Stack');
  const safeTitle = escapeXml(builderTitle || 'Code Nomad');

  const displayName = safeName.length > 20 ? safeName.substring(0, 20) + '...' : safeName;
  const displayStack = safeStack.length > 26 ? safeStack.substring(0, 26) + '...' : safeStack;

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#040817;stop-opacity:1"/>
        <stop offset="50%" style="stop-color:#091130;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#140826;stop-opacity:1"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#00f5ff"/>
        <stop offset="50%" style="stop-color:#ff2a85"/>
        <stop offset="100%" style="stop-color:#ffb703"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ffb703"/>
        <stop offset="100%" style="stop-color:#ff5e62"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Background card plate -->
    <rect width="${W}" height="${H}" rx="24" fill="url(#bgGrad)"/>

    <!-- Lanyard clip slot at top center (authentic college ID card slot) -->
    <rect x="${W / 2 - 40}" y="14" width="80" height="12" rx="6" fill="#02050e" stroke="url(#accentGrad)" stroke-width="1.5"/>

    <!-- Subtle grid pattern -->
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#ffffff" stroke-width="0.3" opacity="0.08"/>
    </pattern>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>

    <!-- Top header accent bar -->
    <rect x="0" y="0" width="${W}" height="6" fill="url(#accentGrad)"/>

    <!-- Event Header -->
    <text x="${W / 2}" y="48" text-anchor="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="14" font-weight="900"
      fill="#ffffff" letter-spacing="6">HACKER HOUSE GOA 2026</text>

    <!-- "BUILDER ID" Badge -->
    <rect x="${W / 2 - 65}" y="62" width="130" height="24" rx="12"
      fill="#040817" stroke="url(#accentGrad)" stroke-width="1.5"/>
    <text x="${W / 2}" y="78" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="10" font-weight="800"
      fill="#00f5ff" letter-spacing="3">BUILDER ID</text>

    <!-- Photo circle border (glow ring at cx=350, cy=240, r=120) -->
    <circle cx="350" cy="240" r="126" fill="none"
      stroke="url(#accentGrad)" stroke-width="4.5" filter="url(#glow)"/>
    <circle cx="350" cy="240" r="121" fill="none"
      stroke="url(#accentGrad)" stroke-width="1.2" opacity="0.6"/>

    <!-- Photo placeholder circle -->
    <circle cx="350" cy="240" r="120" fill="#080e26"/>

    <!-- ── BUILDER TITLE badge ── -->
    <rect x="${W / 2 - 160}" y="380" width="320" height="42" rx="21"
      fill="#040817" stroke="url(#goldGrad)" stroke-width="2"/>
    <text x="${W / 2}" y="405" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="14" font-weight="900"
      fill="url(#goldGrad)" letter-spacing="1">⚡ ${safeTitle}</text>

    <!-- ── NAME ── -->
    <text x="${W / 2}" y="468" text-anchor="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="42" font-weight="900"
      fill="#ffffff" filter="url(#softGlow)">${displayName}</text>

    <!-- Divider line -->
    <line x1="${W / 2 - 180}" y1="490" x2="${W / 2 + 180}" y2="490"
      stroke="url(#accentGrad)" stroke-width="1.8" opacity="0.7"/>

    <!-- ── ROLE ── -->
    <text x="${W / 2}" y="525" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="19" font-weight="800"
      fill="#00f5ff" letter-spacing="3">${safeRole.toUpperCase()}</text>

    <!-- Stack section -->
    <text x="${W / 2}" y="565" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="11" font-weight="700"
      fill="#ffffff" opacity="0.7" letter-spacing="3">STACK</text>
    <text x="${W / 2}" y="590" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="16" font-weight="700"
      fill="#ffffff">${displayStack}</text>

    <!-- Info boxes row -->
    <!-- Box 1: Event -->
    <rect x="45" y="630" width="280" height="66" rx="12"
      fill="#ffffff" fill-opacity="0.06" stroke="url(#accentGrad)" stroke-opacity="0.4" stroke-width="1"/>
    <text x="185" y="655" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="10" fill="#00f5ff" letter-spacing="2" font-weight="800">EVENT</text>
    <text x="185" y="678" text-anchor="middle"
      font-family="Arial Black, sans-serif" font-size="14" fill="#ffffff">Hacker House Goa</text>

    <!-- Box 2: Edition -->
    <rect x="375" y="630" width="280" height="66" rx="12"
      fill="#ffffff" fill-opacity="0.06" stroke="url(#accentGrad)" stroke-opacity="0.4" stroke-width="1"/>
    <text x="515" y="655" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="10" fill="#ff2a85" letter-spacing="2" font-weight="800">EDITION</text>
    <text x="515" y="678" text-anchor="middle"
      font-family="Arial Black, sans-serif" font-size="14" fill="#ffffff">2026 • GOA 🌊</text>

    <!-- AI × Crypto badge -->
    <rect x="${W / 2 - 130}" y="720" width="260" height="42" rx="21"
      fill="url(#accentGrad)" opacity="0.18"/>
    <rect x="${W / 2 - 130}" y="720" width="260" height="42" rx="21"
      fill="none" stroke="url(#accentGrad)" stroke-width="1.8"/>
    <text x="${W / 2}" y="746" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="14" font-weight="900"
      fill="#ffffff" letter-spacing="2">AI × CRYPTO • GOA</text>

    <!-- Stats row -->
    <text x="140" y="805" text-anchor="middle"
      font-family="Arial Black, sans-serif" font-size="22" fill="#ffb703">247</text>
    <text x="140" y="825" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="10" fill="#ffffff" opacity="0.8" font-weight="700">BUILDERS</text>

    <text x="${W / 2}" y="805" text-anchor="middle"
      font-family="Arial Black, sans-serif" font-size="22" fill="#00f5ff">4</text>
    <text x="${W / 2}" y="825" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="10" fill="#ffffff" opacity="0.8" font-weight="700">DAYS</text>

    <text x="560" y="805" text-anchor="middle"
      font-family="Arial Black, sans-serif" font-size="22" fill="#ffb703">$50K+</text>
    <text x="560" y="825" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="10" fill="#ffffff" opacity="0.8" font-weight="700">BOUNTIES</text>

    <!-- Separator -->
    <line x1="45" y1="855" x2="${W - 45}" y2="855"
      stroke="url(#accentGrad)" stroke-width="0.8" opacity="0.4"/>

    <!-- Bottom: hashtag + powered by -->
    <text x="${W / 2}" y="895" text-anchor="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="900"
      fill="url(#accentGrad)">#FrameInGoa</text>

    <text x="${W / 2}" y="920" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="11" font-weight="700"
      fill="#ffffff" opacity="0.6">Powered by 2:47PM Studio</text>

    <!-- Bottom bar -->
    <rect x="0" y="${H - 6}" width="${W}" height="6" fill="url(#accentGrad)"/>
  </svg>`;
}

// ─── Team / Crew Banner: Composite 1920×1080 Widescreen ────────────────────────
async function generateTeamBanner({ teamName = 'Crew', members = [], format = 'B' }) {
  const BANNER_W = 1920;
  const BANNER_H = 1080;
  const count = Math.min(Math.max(members.length, 1), 4);

  // 1. Generate individual card for each member
  const cardBuffers = await Promise.all(
    members.map(async (m) => {
      if (format === 'A') {
        return await generateFrameA(m.photoBuffer);
      } else {
        return await generateFrameB({
          photoBuffer: m.photoBuffer,
          name: m.name,
          role: m.role,
          stack: m.stack,
          builderTitle: m.builderTitle,
        });
      }
    })
  );

  // 2. Resize individual cards based on member count to fit 1920x1080 canvas
  const CARD_H = format === 'A' ? 620 : 720;
  const CARD_W = format === 'A' ? 620 : 640;

  const resizedCards = await Promise.all(
    cardBuffers.map((buf) =>
      sharp(buf)
        .resize(CARD_W, CARD_H, { fit: 'contain' })
        .toBuffer()
    )
  );

  // 3. Build background banner SVG overlay
  const bannerSVG = buildTeamBannerSVG({
    W: BANNER_W,
    H: BANNER_H,
    teamName,
    count,
  });

  // 4. Create base banner canvas (Dark Navy plate)
  const base = await sharp({
    create: {
      width: BANNER_W,
      height: BANNER_H,
      channels: 4,
      background: { r: 4, g: 8, b: 23, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  // 5. Calculate horizontal positions for cards
  const totalCardsWidth = count * CARD_W;
  const availableSpace = BANNER_W - totalCardsWidth;
  const gap = Math.max(20, availableSpace / (count + 1));
  const TOP_Y = 220;

  const compositeInputs = [
    { input: Buffer.from(bannerSVG), top: 0, left: 0 },
  ];

  resizedCards.forEach((cardBuf, idx) => {
    const leftX = Math.round(gap + idx * (CARD_W + gap));
    compositeInputs.push({
      input: cardBuf,
      top: TOP_Y,
      left: leftX,
    });
  });

  // 6. Composite background + overlay SVG + member cards
  const result = await sharp(base)
    .composite(compositeInputs)
    .png()
    .toBuffer();

  return result;
}

// ─── SVG: Team Banner Frame ──────────────────────────────────────────────────
function buildTeamBannerSVG({ W, H, teamName, count }) {
  const safeTeam = escapeXml(teamName || 'Vibe Crew');

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#040817;stop-opacity:1"/>
        <stop offset="50%" style="stop-color:#091130;stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#140826;stop-opacity:1"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#00f5ff"/>
        <stop offset="50%" style="stop-color:#ff2a85"/>
        <stop offset="100%" style="stop-color:#ffb703"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ffb703"/>
        <stop offset="100%" style="stop-color:#ff5e62"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>

    <!-- Tropical Wave Background Silhouettes -->
    <path d="M 0 350 Q 480 250 960 350 T 1920 350 L 1920 1080 L 0 1080 Z" fill="#ff2a85" opacity="0.04"/>
    <path d="M 0 550 Q 500 650 1000 550 T 1920 550 L 1920 1080 L 0 1080 Z" fill="#00f5ff" opacity="0.03"/>

    <!-- Top header bar -->
    <rect x="0" y="0" width="${W}" height="10" fill="url(#accentGrad)"/>

    <!-- Event Banner Title -->
    <text x="${W / 2}" y="65" text-anchor="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="20" font-weight="900"
      fill="#00f5ff" letter-spacing="8">HACKER HOUSE GOA 2026</text>

    <!-- Team Crew Tag -->
    <rect x="${W / 2 - 250}" y="85" width="500" height="48" rx="24"
      fill="#040817" stroke="url(#accentGrad)" stroke-width="2.5" filter="url(#glow)"/>
    <text x="${W / 2}" y="115" text-anchor="middle" dominant-baseline="middle"
      font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="900"
      fill="#ffffff" letter-spacing="3">🚀 CREW: ${safeTeam.toUpperCase()} (${count} BUILDERS)</text>

    <text x="${W / 2}" y="170" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="14" font-weight="700"
      fill="#ffffff" opacity="0.6" letter-spacing="4">OFFICIAL HACKER HOUSE CREW SUBMISSION • #FRAMEINGOA</text>

    <!-- Bottom Bar -->
    <rect x="0" y="${H - 10}" width="${W}" height="10" fill="url(#accentGrad)"/>

    <text x="60" y="${H - 35}" text-anchor="start"
      font-family="Arial Black, Arial, sans-serif" font-size="18" font-weight="900"
      fill="url(#accentGrad)">#FrameInGoa</text>

    <text x="${W - 60}" y="${H - 35}" text-anchor="end"
      font-family="Arial, sans-serif" font-size="13" font-weight="700"
      fill="#ffffff" opacity="0.5">India's Premier AI × Crypto Builder Residency • Goa 🌊</text>
  </svg>`;
}

// ─── XML escape utility ──────────────────────────────────────────────────────
function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = { generateFrameA, generateFrameB, generateTeamBanner };
