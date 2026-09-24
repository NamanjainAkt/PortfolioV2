import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const handleBlogPrismaError = (error: any, res: any, fallback: string) => {
  if (error?.code === 'P2002') {
    return res.status(409).json({ success: false, error: 'Slug already exists' });
  }
  if (error?.code === 'P2023') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }
  if (error?.code === 'P2025') {
    return res.status(404).json({ success: false, error: 'Resource not found' });
  }
  console.error(fallback, error);
  return res.status(500).json({ success: false, error: fallback });
};

router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    let take: number | undefined;
    if (limit !== undefined) {
      const raw = String(limit).trim();
      const parsed = Number(raw);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
        return res.status(400).json({ success: false, error: 'Invalid limit parameter (must be 1-100)' });
      }
      take = parsed;
    }
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug },
    });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Create blog (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, slug, content, featuredImage, category } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, slug, content' });
    }
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        featuredImage,
        category,
      },
    });
    res.json(blog);
  } catch (error: any) {
    return handleBlogPrismaError(error, res, 'Failed to create blog');
  }
});

// Update blog (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, slug, content, featuredImage, category } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, slug, content' });
    }
    const blog = await prisma.blog.update({
      where: { id: req.params.id },
      data: {
        title,
        slug,
        content,
        featuredImage,
        category,
      },
    });
    res.json(blog);
  } catch (error: any) {
    return handleBlogPrismaError(error, res, 'Failed to update blog');
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.blog.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Blog deleted' });
  } catch (error: any) {
    return handleBlogPrismaError(error, res, 'Failed to delete blog');
  }
});

export default router;
