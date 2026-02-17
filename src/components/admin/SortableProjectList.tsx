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
import { GripVertical, Save, Loader2, Sparkles } from 'lucide-react';
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
      className={`group flex items-center gap-6 p-6 bg-[#0a0a0a] border border-white/5 rounded-[2rem] mb-4 transition-all duration-300 ${
        isDragging ? 'shadow-2xl shadow-accent-crimson/20 border-accent-crimson/50 scale-[1.02] opacity-80' : 'hover:border-white/10'
      }`}
    >
      <button
        className="p-3 bg-white/5 rounded-xl text-tertiary hover:text-white cursor-grab active:cursor-grabbing transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </button>
      
      <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
        {project.images[0] ? (
          <img
            src={getOptimizedImageUrl(project.images[0], { width: ImageSizes.thumbnail })}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-tertiary">
            <Sparkles size={20} />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-serif font-black uppercase tracking-tight group-hover:text-accent-crimson transition-colors">
          {project.title}
        </h3>
        <p className="text-[10px] font-mono text-tertiary uppercase tracking-widest line-clamp-1">/{project.slug}</p>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-mono text-tertiary uppercase tracking-widest mb-1">Position</span>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-accent-glow font-bold">
          {index + 1}
        </div>
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white/5 border border-white/10 p-6 rounded-[2rem]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent-glow/10 rounded-xl flex items-center justify-center">
            <GripVertical className="text-accent-glow" size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Sequence Control</p>
            <p className="text-[10px] font-mono text-tertiary uppercase tracking-[0.2em]">Drag entities to re-prioritize</p>
          </div>
        </div>
        
        <AnimatePresence>
          {hasChanges && (
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-3 px-8 py-3 bg-accent-crimson text-white rounded-xl hover:bg-accent-crimson/90 transition-all shadow-xl shadow-accent-crimson/20 disabled:opacity-50 font-bold uppercase tracking-widest text-xs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Sequence
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
          <div className="space-y-4">
            {projects.map((project, index) => (
              <SortableItem key={project.id} project={project} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SortableProjectList;
