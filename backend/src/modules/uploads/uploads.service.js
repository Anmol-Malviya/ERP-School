const crypto = require('crypto');
const config = require('../../config/env');
const C = require('../../core');

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

function cloudConfigured() {
  return Boolean(config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret);
}

function safeSegment(value) {
  return String(value || 'platform').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80);
}

module.exports = {
  async sign(req) {
    if (!cloudConfigured()) {
      throw new C.ApiError(503, 'Cloudinary upload is not configured');
    }

    const fileName = String(req.body.fileName || '').trim();
    const mimeType = String(req.body.mimeType || '').trim().toLowerCase();
    const size = Number(req.body.size || 0);

    if (!fileName || !mimeType || !Number.isFinite(size) || size <= 0) {
      throw new C.ApiError(400, 'fileName, mimeType and size are required');
    }
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new C.ApiError(400, 'Unsupported file type');
    }
    if (size > config.uploadMaxBytes) {
      throw new C.ApiError(413, `File exceeds ${Math.round(config.uploadMaxBytes / 1048576)} MB limit`);
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const tenant = safeSegment(req.tenantId || req.user?.schoolId || req.user?._id);
    const folder = `${config.cloudinary.folder}/${tenant}`;
    const signatureBase = `folder=${folder}&timestamp=${timestamp}${config.cloudinary.apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    return {
      provider: 'cloudinary',
      uploadUrl: `https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudinary.cloudName)}/auto/upload`,
      apiKey: config.cloudinary.apiKey,
      timestamp,
      folder,
      signature,
      maxBytes: config.uploadMaxBytes,
      allowedMimeTypes
    };
  }
};
