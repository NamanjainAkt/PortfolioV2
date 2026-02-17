import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all projects (with optional limit and ordering)
router.get('/', async (req, res) => {
  try {
    const { limit, orderBy } = req.query;
    
    const projects = await prisma.project.findMany({
      orderBy: orderBy === 'displayOrder' 
        ? { displayOrder: 'asc' } 
        : { createdAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
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
    
    // Get highest displayOrder and add 1 (new projects at top)
    const highestOrder = await prisma.project.findFirst({
      orderBy: { displayOrder: 'desc' },
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
        displayOrder: (highestOrder?.displayOrder ?? 0) + 1,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, slug, overview, problem, solution, techStack, images, githubUrl, liveUrl, displayOrder, category } = req.body;
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Reorder projects (Admin only) - bulk update displayOrder
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { projects } = req.body; // Array of { id, displayOrder }
    
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
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

// Delete project (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
