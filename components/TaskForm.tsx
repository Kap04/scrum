// components/TaskForm.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { taskService } from '@/lib/firebase/taskService';
import { ITaskData, ICreateTaskData } from '@/lib/firebase/types';



interface FormErrors {
  title?: string;
  description?: string;
}

// In TaskForm.tsx
interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  currentUser: {
    id: string;
    name: string;
  };
  existingTask?: ITaskData | null;  
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  teamId,
  currentUser,
  existingTask
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<ICreateTaskData>({
    title: existingTask?.title || '',
    description: existingTask?.description || '',
    assignedTo: existingTask?.assignedTo || null,
    teamId,
    createdBy: currentUser.id
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (existingTask) {
        await taskService.updateTask(existingTask.taskID, {
          title: formData.title,
          description: formData.description,
          assignedTo: formData.assignedTo
        });
        toast({
          title: 'Task updated successfully',
          variant: 'default'
        });
      } else {
        await taskService.createTask(formData);
        toast({
          title: 'Task created successfully',
          variant: 'default'
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save task. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={loading}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <span className="text-sm text-red-500">{errors.title}</span>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description}</span>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {existingTask ? 'Update' : 'Create'} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;