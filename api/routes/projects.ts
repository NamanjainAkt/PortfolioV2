import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
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
    const { title, slug, overview, problem, solution, techStack, images, githubUrl, demoUrl } = req.body;
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        overview,
        problem,
        solution,
        techStack,
        images,
        githubUrl,
        demoUrl,
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
    const { title, slug, overview, problem, solution, techStack, images, githubUrl, demoUrl } = req.body;
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
        demoUrl,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
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
