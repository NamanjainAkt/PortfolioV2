import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

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
    const { title, slug, content } = req.body;
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
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
    const { title, slug, content } = req.body;
    const blog = await prisma.blog.update({
      where: { id: req.params.id },
      data: {
        title,
        slug,
        content,
      },
    });
    res.json(blog);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

export default router;
