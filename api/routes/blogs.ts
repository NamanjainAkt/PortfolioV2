import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
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
  } catch (error) {
    if ((error as any)?.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    console.error('Failed to update blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.blog.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    if ((error as any)?.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    console.error('Failed to delete blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
