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
import { motion } from 'framer-motion';
import { Project } from '../../types/project';

interface SortableProjectListProps {
  projects: Project[];
  onReorder: (projects: Project[]) => Promise<void>;
}

const SortableItem: React.FC<{ project: Project }> = ({ project }) => {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-elevated border border-border rounded-lg mb-3 ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <button
        className="p-2 hover:bg-background rounded cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} className="text-secondary" />
      </button>
      
      {project.images[0] && (
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-16 h-16 object-cover rounded-lg"
        />
      )}
      
      <div className="flex-1">
        <h3 className="font-bold">{project.title}</h3>
        <p className="text-sm text-secondary line-clamp-1">{project.overview}</p>
      </div>
      
      <div className="text-sm text-tertiary font-mono">
        Order: {project.displayOrder}
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
    useSensor(PointerSensor),
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
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update displayOrder based on new positions
      const reorderedProjects = projects.map((project, index) => ({
        ...project,
        displayOrder: index,
      }));
      
      await onReorder(reorderedProjects);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-secondary text-sm">
          Drag and drop to reorder projects. Lower order = appears first.
        </p>
        
        {hasChanges && (
          <motion.button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-accent-crimson text-white rounded-lg hover:bg-accent-crimson/90 transition-colors disabled:opacity-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Order
              </>
            )}
          </motion.button>
        )}
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
          <div>
            {projects.map((project) => (
              <SortableItem key={project.id} project={project} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SortableProjectList;
