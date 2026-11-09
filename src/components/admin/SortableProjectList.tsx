import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types/project';
import { getOptimizedImageUrl, ImageSizes } from '../../lib/imageUtils';

interface SortableProjectListProps {
  projects: Project[];
  onReorder: (projects: Project[]) => Promise<void>;
}

const SortableItem: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 rounded-lg border bg-background p-4 transition-shadow duration-200 ${
        isDragging ? 'border-primary shadow-xl' : 'border-line'
      }`}
    >
      <button
        className="inline-flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-md border border-line text-tertiary transition-colors hover:border-primary hover:text-primary active:cursor-grabbing"
        aria-label={`Reorder ${project.title}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
        {project.images[0] ? (
          <img
            src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.thumbnail })}
            alt={project.title}
            width={48}
            height={48}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-tertiary">
            <GripVertical size={16} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium tracking-tight">{project.title}</h3>
        <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-tertiary">
          /{project.slug}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="mono-label hidden sm:block">Position</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-md border border-line font-mono text-xs tabular-nums text-secondary">
          {index + 1}
        </span>
      </div>
    </div>
  );
};

const SortableProjectList: React.FC<SortableProjectListProps> = ({
  projects: initialProjects,
  onReorder,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        return newArray;
      });
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // The current order in 'projects' state is what we want to save
      await onReorder(projects);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-line px-6 py-20 text-center">
        <GripVertical className="text-tertiary" size={20} />
        <p className="text-sm text-secondary">No projects to reorder yet.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="text-sm font-medium tracking-tight">Display order</p>
          <p className="mono-label mt-0.5">Drag rows to reprioritise</p>
        </div>

        <AnimatePresence>
          {hasChanges && (
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-solid disabled:opacity-50"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save order
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {projects.map((project, index) => (
              <SortableItem key={project.id} project={project} index={index} />
            ))}
          </div>        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SortableProjectList;
