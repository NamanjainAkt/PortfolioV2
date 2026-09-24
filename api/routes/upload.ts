import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';

const router = Router();

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
};

const ensureCloudinary = () => {
  const cfg = getCloudinaryConfig();
  if (!cfg) return null;
  cloudinary.config({
    cloud_name: cfg.cloudName,
    api_key: cfg.apiKey,
    api_secret: cfg.apiSecret,
  });
  return cfg;
};

const ALLOWED_FOLDERS = /^[a-z0-9_-]{1,40}$/;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
    }
  },
});

router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const cfg = ensureCloudinary();
    if (!cfg) {
      return res.status(503).json({ error: 'Image upload is currently unavailable' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let folder = 'portfolio';
    if (req.body.folder) {
      const raw = String(req.body.folder).trim().toLowerCase();
      if (!ALLOWED_FOLDERS.test(raw)) {
        return res.status(400).json({ error: 'Invalid folder name' });
      }
      folder = raw;
    }
    
    // Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary] Upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(req.file!.buffer);
    });

    const uploadResult = result as any;
    
    console.log('[Cloudinary] Upload successful:', {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    });

    res.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error('[Cloudinary] Server upload error:', error);
    res.status(500).json({
      error: 'Failed to upload image'
    });
  }
});

router.get('/signature', authenticateToken, (req, res) => {
  try {
    const cfg = ensureCloudinary();
    if (!cfg) {
      return res.status(503).json({ error: 'Image upload is currently unavailable' });
    }
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'portfolio',
      },
      cfg.apiSecret
    );

    res.json({
      signature,
      timestamp,
      cloudName: cfg.cloudName,
    });
  } catch (error) {
    console.error('[Cloudinary] Error generating signature:', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

export default router;
