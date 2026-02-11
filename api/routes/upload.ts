import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';

const router = Router();

// Validate environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('[Cloudinary] Missing required environment variables:');
  console.error('  - CLOUDINARY_CLOUD_NAME:', cloudName ? '✓' : '✗');
  console.error('  - CLOUDINARY_API_KEY:', apiKey ? '✓' : '✗');
  console.error('  - CLOUDINARY_API_SECRET:', apiSecret ? '✓' : '✗');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Configure multer for memory storage (no disk storage needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Server-side upload endpoint
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'portfolio';
    
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
      error: error.message || 'Failed to upload image' 
    });
  }
});

// Legacy signature endpoint (kept for backwards compatibility if needed)
router.get('/signature', authenticateToken, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'portfolio',
      },
      apiSecret!
    );

    console.log('[Cloudinary] Generated signature:', { timestamp, hasSignature: !!signature });

    res.json({
      signature,
      timestamp,
      cloudName,
      apiKey,
    });
  } catch (error) {
    console.error('[Cloudinary] Error generating signature:', error);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

export default router;
