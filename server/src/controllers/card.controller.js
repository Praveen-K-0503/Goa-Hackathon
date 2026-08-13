const { v4: uuidv4 } = require('uuid');
const { convertHeicToJpeg, isHeic } = require('../services/heicConverter');
const { generateFrameA, generateFrameB, generateTeamBanner } = require('../services/imageProcessor');
const { uploadToCloudinary } = require('../services/cloudinary');
const Card = require('../models/Card.model');

// ─── HTML Escape Utility (prevents XSS in OG page) ──────────────────────────
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── POST /api/generate ──────────────────────────────────────────────────────
async function generateCard(req, res, next) {
  try {
    const isTeam = req.body.isTeam === 'true' || req.body.isTeam === true;
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ error: 'No photo uploaded.' });
    }

    const { format = 'A', name, role, stack, builderTitle, teamName = 'Crew', membersJson } = req.body;

    if (!['A', 'B'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Choose A or B.' });
    }

    let imageBuffer;

    if (isTeam) {
      // Parse team members
      let parsedMembers = [];
      try {
        parsedMembers = typeof membersJson === 'string' ? JSON.parse(membersJson) : (membersJson || []);
      } catch (_) {}

      // Build member array with buffers
      const teamMembers = await Promise.all(
        parsedMembers.map(async (mInfo, idx) => {
          const fileMatch = files.find((f) => f.fieldname === `photo_${idx}`) || files[idx];
          let buf = fileMatch ? fileMatch.buffer : null;
          if (buf && isHeic(buf, fileMatch.mimetype, fileMatch.originalname)) {
            buf = await convertHeicToJpeg(buf);
          }
          return {
            photoBuffer: buf,
            name: mInfo.name || `Builder ${idx + 1}`,
            role: mInfo.role || 'Hacker',
            stack: mInfo.stack || 'Full Stack',
            builderTitle: mInfo.builderTitle || 'Code Nomad',
          };
        })
      );

      // Generate composite Team Banner (1920x1080)
      imageBuffer = await generateTeamBanner({
        teamName: teamName || 'Crew',
        members: teamMembers,
        format,
      });
    } else {
      // Single Builder Card
      let photoBuffer = files[0].buffer;
      if (isHeic(photoBuffer, files[0].mimetype, files[0].originalname)) {
        photoBuffer = await convertHeicToJpeg(photoBuffer);
      }

      if (format === 'A') {
        imageBuffer = await generateFrameA(photoBuffer);
      } else {
        imageBuffer = await generateFrameB({
          photoBuffer,
          name: name || 'Builder',
          role: role || 'Hacker',
          stack: stack || 'Full Stack',
          builderTitle: builderTitle || 'Code Nomad',
        });
      }
    }

    // Generate unique card ID
    const cardId = uuidv4().replace(/-/g, '').substring(0, 12);

    // Upload to Cloudinary
    let imageUrl, cloudinaryPublicId;
    try {
      const uploaded = await uploadToCloudinary(imageBuffer, `card-${cardId}`);
      imageUrl = uploaded.url;
      cloudinaryPublicId = uploaded.publicId;
    } catch (cloudErr) {
      console.warn('⚠️ Cloudinary upload failed, using base64 fallback:', cloudErr.message);
      const base64 = imageBuffer.toString('base64');
      imageUrl = `data:image/png;base64,${base64}`;
      cloudinaryPublicId = `local-${cardId}`;
    }

    // Save to MongoDB
    try {
      await Card.create({
        cardId,
        format,
        imageUrl,
        cloudinaryPublicId,
        name: isTeam ? teamName : (name || ''),
        role: isTeam ? 'Team Crew' : (role || ''),
        stack: stack || '',
        builderTitle: builderTitle || '',
      });
    } catch (dbErr) {
      console.warn('⚠️ MongoDB save failed (continuing):', dbErr.message);
    }

    const shareUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/card/${cardId}`;

    res.json({
      id: cardId,
      imageUrl,
      shareUrl,
      format,
      isTeam,
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/card/:id ───────────────────────────────────────────────────────
async function getCard(req, res, next) {
  try {
    const { id } = req.params;

    let card = null;
    try {
      card = await Card.findOne({ cardId: id });
    } catch (dbErr) {
      console.warn('DB lookup failed:', dbErr.message);
    }

    if (!card) {
      return res.status(404).json({ error: 'Card not found.' });
    }

    res.json({
      id: card.cardId,
      imageUrl: card.imageUrl,
      format: card.format,
      name: card.name,
      role: card.role,
      stack: card.stack,
      builderTitle: card.builderTitle,
      createdAt: card.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/card/:id/og — OG HTML page ────────────────────────────────────
async function getCardOG(req, res, next) {
  try {
    const { id } = req.params;

    let card = null;
    try {
      card = await Card.findOne({ cardId: id });
    } catch (_) {}

    const imageUrl = escapeHtml(card?.imageUrl || '');
    const name = escapeHtml(card?.name || 'Builder');
    const title = escapeHtml(`${card?.name || 'Builder'} @ HH Goa 2026 | #FrameInGoa`);
    const desc = escapeHtml('Check out this Hacker House Goa 2026 builder card! AI × Crypto • #FrameInGoa');
    const shareUrl = escapeHtml(`${process.env.CLIENT_URL}/card/${id}`);

    // Track shares
    if (card) {
      Card.findByIdAndUpdate(card._id, { $inc: { shares: 1 } }).catch(() => {});
    }

    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <meta name="description" content="${desc}"/>

  <!-- Open Graph -->
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${desc}"/>
  <meta property="og:image" content="${imageUrl}"/>
  <meta property="og:image:width" content="1920"/>
  <meta property="og:image:height" content="1080"/>
  <meta property="og:url" content="${shareUrl}"/>
  <meta property="og:site_name" content="HH Goa 2026"/>

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${desc}"/>
  <meta name="twitter:image" content="${imageUrl}"/>
  <meta name="twitter:site" content="@HackerHouseGoa"/>

  <script>
    window.location.href = '${shareUrl}';
  </script>
</head>
<body>
  <p>Redirecting to <a href="${shareUrl}">HH Goa 2026 Card</a>...</p>
</body>
</html>`);
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/card/:id/download — Track downloads ─────────────────────────
async function trackDownload(req, res, next) {
  try {
    const { id } = req.params;
    await Card.findOneAndUpdate({ cardId: id }, { $inc: { downloads: 1 } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateCard, getCard, getCardOG, trackDownload };
