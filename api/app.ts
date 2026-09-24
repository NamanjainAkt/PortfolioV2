/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import authRoutes from './routes/auth.js'
import projectsRoutes from './routes/projects.js'
import blogsRoutes from './routes/blogs.js'
import uploadRoutes from './routes/upload.js'
import chatRoutes from './routes/chat.js'

dotenv.config()

const app: express.Application = express()

app.set('trust proxy', 1)

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET environment variable is required');
}

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://namanx.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
}))
app.use(express.json({ limit: '4mb' }))
app.use(express.urlencoded({ extended: true, limit: '4mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/blogs', blogsRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/chat', chatRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);

  const errWithStatus = error as Error & { type?: string; status?: number };
  if (errWithStatus.type === 'entity.parse.failed' || errWithStatus.status === 400) {
    return res.status(400).json({ success: false, error: 'Invalid JSON body' });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, error: 'File too large. Maximum size is 4MB.' });
    }
    return res.status(400).json({ success: false, error: error.message });
  }

  if (error.message === 'Only image files (JPEG, PNG, WebP, GIF) are allowed') {
    return res.status(415).json({ success: false, error: error.message });
  }

  res.status(500).json({ success: false, error: 'Server internal error' });
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
