import React, { useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, formatDistanceToNow } from 'date-fns';
import { GripVertical, Plus, Calendar as CalendarIcon, Tag, Trash2, Settings, FileUp, FileDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks, Task } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from 'sonner';
type TaskItemProps = {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
};
function TaskItem({ task, onUpdate, onDelete, onToggleComplete }: TaskItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleBlur = () => {
    if (title.trim() && title.trim() !== task.title) {
      onUpdate(task.id, { title: title.trim() });
    } else {
      setTitle(task.title);
    }
    setIsEditing(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
  };
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layoutId={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn('touch-none', isDragging && 'shadow-lg')}
    >
      <Card className="rounded-2xl shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6 flex items-center gap-4">
          <div {...attributes} {...listeners} className="cursor-grab p-2 text-muted-foreground hover:text-foreground">
            <GripVertical size={20} />
          </div>
          <Switch id={`complete-${task.id}`} checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} />
          <div className="flex-1" onDoubleClick={() => setIsEditing(true)}>
            {isEditing ? (
              <Input
                ref={inputRef}
                value={title}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="h-auto p-0 border-none focus-visible:ring-0 bg-transparent text-base md:text-lg"
              />
            ) : (
              <p className={cn('text-base md:text-lg font-medium text-foreground', task.completed && 'line-through text-muted-foreground')}>
                {task.title}
              </p>
            )}
            {task.dueDate && (
              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <CalendarIcon size={14} />
                <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon"><CalendarIcon size={18} /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={task.dueDate ? new Date(task.dueDate) : undefined}
                onSelect={(date) => onUpdate(task.id, { dueDate: date?.getTime() })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="text-muted-foreground hover:text-destructive">
            <Trash2 size={18} />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
type TaskComposerProps = {
  onCreate: (title: string) => void;
};
export function TaskComposer({ onCreate }: TaskComposerProps) {
  const [title, setTitle] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title.trim());
      setTitle('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 text-lg h-12 rounded-lg bg-secondary/50 border-input focus:bg-background"
      />
      <Button type="submit" size="lg" className="h-12 rounded-lg bg-[rgb(243_128_32)] hover:bg-[rgb(223_77_22)] text-white shadow-primary transition-all duration-200 active:scale-95">
        <Plus className="mr-2 h-5 w-5" /> Add
      </Button>
    </form>
  );
}
type SettingsSheetProps = {
  onExport: () => void;
  onImport: (file: File) => void;
};
function SettingsSheet({ onExport, onImport }: SettingsSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon"><Settings /></Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={onExport} variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export Tasks</Button>
          <Button onClick={handleImportClick} variant="outline"><FileUp className="mr-2 h-4 w-4" /> Import Tasks</Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
export function TaskListContainer() {
  const { tasks, createTask, updateTask, deleteTask, reorderTasks, toggleComplete, exportJson, importJson, isLoading } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
      })
      .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [tasks, filter, searchTerm]);
  const activeTasks = useMemo(() => filteredTasks.filter(t => !t.completed), [filteredTasks]);
  const completedTasks = useMemo(() => filteredTasks.filter(t => t.completed), [filteredTasks]);
  const handleCreate = async (title: string) => {
    try {
      await createTask(title);
      toast.success(`Task "${title.substring(0, 20)}..." added.`);
    } catch (error) {
      toast.error("Failed to create task.");
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-4 max-w-3xl w-full">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-8 max-w-3xl w-full">
        <TaskComposer onCreate={handleCreate} />
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={filter === 'all' ? 'secondary' : 'ghost'} onClick={() => setFilter('all')}>All</Button>
            <Button variant={filter === 'active' ? 'secondary' : 'ghost'} onClick={() => setFilter('active')}>Active</Button>
            <Button variant={filter === 'completed' ? 'secondary' : 'ghost'} onClick={() => setFilter('completed')}>Completed</Button>
            <SettingsSheet onExport={exportJson} onImport={importJson} />
          </div>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center py-16 px-6 border-2 border-dashed rounded-2xl">
            <h3 className="text-xl font-semibold text-foreground">You're all clear!</h3>
            <p className="text-muted-foreground mt-2">Add a task above to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence>
                {activeTasks.map(task => (
                  <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onToggleComplete={toggleComplete} />
                ))}
              </AnimatePresence>
            </SortableContext>
            {completedTasks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <hr className="flex-1 border-border" />
                  <span className="text-sm font-medium text-muted-foreground">Completed</span>
                  <hr className="flex-1 border-border" />
                </div>
                <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  <AnimatePresence>
                    {completedTasks.map(task => (
                      <TaskItem key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} onToggleComplete={toggleComplete} />
                    ))}
                  </AnimatePresence>
                </SortableContext>
              </div>
            )}
            {filteredTasks.length === 0 && searchTerm && (
                <div className="text-center py-16 px-6 border-2 border-dashed rounded-2xl">
                    <h3 className="text-xl font-semibold text-foreground">No tasks found</h3>
                    <p className="text-muted-foreground mt-2">Try a different search term.</p>
                </div>
            )}
          </div>
        )}
      </div>
      <Toaster richColors closeButton />
    </DndContext>
  );
}