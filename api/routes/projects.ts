import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

const handlePrismaError = (error: any, res: any, fallback: string) => {
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

// Get all projects (with optional limit and ordering)
router.get('/', async (req, res) => {
  try {
    const { limit, orderBy } = req.query;
    
    let take: number | undefined;
    if (limit !== undefined) {
      const raw = String(limit).trim();
      const parsed = Number(raw);
      if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
        return res.status(400).json({ success: false, error: 'Invalid limit parameter (must be 1-100)' });
      }
      take = parsed;
    }
    
    const projects = await prisma.project.findMany({
      orderBy: orderBy === 'displayOrder' 
        ? { displayOrder: 'asc' } 
        : { createdAt: 'desc' },
      take,
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Reorder projects (Admin only) - bulk update displayOrder
// MUST be before /:slug to avoid being caught by slug route
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { projects } = req.body;
    if (!Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({ success: false, error: 'projects array is required' });
    }
    for (const p of projects) {
      if (!p.id || typeof p.displayOrder !== 'number' || !Number.isFinite(p.displayOrder)) {
        return res.status(400).json({ success: false, error: 'Each project must have id and a finite displayOrder' });
      }
    }
    
    // Update all projects in a transaction
    const updates = projects.map((p: { id: string; displayOrder: number }) =>
      prisma.project.update({
        where: { id: p.id },
        data: { displayOrder: p.displayOrder },
      })
    );
    
    await prisma.$transaction(updates);
    res.json({ message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

// Get single project by slug
router.get('/:slug', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, slug, overview, problem, solution, techStack, images, githubUrl, liveUrl, category } = req.body;
    if (!title || !slug || !overview) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, slug, overview' });
    }
    if (techStack !== undefined && !Array.isArray(techStack)) {
      return res.status(400).json({ success: false, error: 'techStack must be an array' });
    }
    if (images !== undefined && !Array.isArray(images)) {
      return res.status(400).json({ success: false, error: 'images must be an array' });
    }
    
    const lowestOrder = await prisma.project.findFirst({
      orderBy: { displayOrder: 'asc' },
      select: { displayOrder: true },
    });
    
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        overview,
        problem,
        solution,
        techStack,
        images,
        category: category || 'Development',
        githubUrl,
        liveUrl,
        displayOrder: (lowestOrder?.displayOrder ?? 1) - 1,
      },
    });
    res.json(project);
  } catch (error: any) {
    return handlePrismaError(error, res, 'Failed to create project');
  }
});

// Update project (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, slug, overview, problem, solution, techStack, images, githubUrl, liveUrl, displayOrder, category } = req.body;
    if (!title || !slug || !overview) {
      return res.status(400).json({ success: false, error: 'Missing required fields: title, slug, overview' });
    }
    if (techStack !== undefined && !Array.isArray(techStack)) {
      return res.status(400).json({ success: false, error: 'techStack must be an array' });
    }
    if (images !== undefined && !Array.isArray(images)) {
      return res.status(400).json({ success: false, error: 'images must be an array' });
    }
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        title,
        slug,
        overview,
        problem,
        solution,
        techStack,
        images,
        githubUrl,
        liveUrl,
        displayOrder,
        category,
      },
    });
    res.json(project);
  } catch (error: any) {
    return handlePrismaError(error, res, 'Failed to update project');
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Project deleted' });
  } catch (error: any) {
    return handlePrismaError(error, res, 'Failed to delete project');
  }
});

export default router;
