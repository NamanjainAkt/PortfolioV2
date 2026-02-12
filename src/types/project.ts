export interface Project {
  id: string;
  slug: string;
  title: string;
  overview: string;
  problem?: string;
  solution?: string;
  techStack: string[];
  images: string[];
  githubUrl?: string;
  liveUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'tiles' | 'carousel' | 'masonry' | 'bento' | 'timeline';
