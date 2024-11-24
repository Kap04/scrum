// components/TaskForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/lib/firebase/taskService';
import type { ITaskData, ICreateTaskData, IUpdateTaskData } from '@/lib/firebase/types';
import { teamService } from '@/lib/firebase/teamService';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  currentUser: {
    id: string;
    name: string;
  };
  existingTask?: ITaskData;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  teamId,
  currentUser,
  existingTask,
}) => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = React.useState<Array<{ userId: string; name: string }>>([]);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ICreateTaskData>({
    defaultValues: existingTask || {
      title: '',
      description: '',
      status: 'pending',
      teamId: teamId,
      createdBy: currentUser.id,
      assignedTo: currentUser.id // Default to current user
    }
  });

  React.useEffect(() => {
    // Fetch team members when the form opens
    const fetchTeamMembers = async () => {
      const team = await teamService.getTeamById(teamId);
      if (team) {
        setTeamMembers(team.members.map(member => ({
          userId: member.userId,
          name: member.name
        })));
      }
    };
    
    if (isOpen) {
      fetchTeamMembers();
    }
  }, [isOpen, teamId]);

  const onSubmit = async (data: ICreateTaskData) => {
    try {
      if (existingTask) {
        const updateData: IUpdateTaskData = {
          title: data.title,
          description: data.description,
          status: data.status,
          assignedTo: data.assignedTo
        };
        await taskService.updateTask(existingTask.taskID, updateData);
        toast({
          title: 'Task updated',
          description: 'Task has been successfully updated',
        });
      } else {
        await taskService.createTask(data);
        toast({
          title: 'Task created',
          description: 'New task has been created',
        });
      }
      reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save task',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{existingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Task Title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <Textarea
              placeholder="Task Description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Select
              defaultValue={existingTask?.status || 'pending'}
              onValueChange={(value) => setValue('status', value as 'pending' | 'doing' | 'completed')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">To Do</SelectItem>
                <SelectItem value="doing">In Progress</SelectItem>
                <SelectItem value="completed">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              defaultValue={existingTask?.assignedTo || currentUser.id}
              onValueChange={(value) => setValue('assignedTo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assign to" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;