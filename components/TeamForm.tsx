// components/TeamForm.tsx
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { teamService } from '@/lib/firebase/teamService';

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
  onTeamCreated?: (teamId: string) => void; // Add this prop


}


interface FormData {
  name: string;
  description: string;
}

const TeamForm: React.FC<TeamFormProps> = ({ isOpen, onClose, currentUser,onTeamCreated }) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const teamId = await teamService.createTeam(
        { name: data.name, description: data.description, createdBy: currentUser.id },
        { userId: currentUser.id, name: currentUser.name, email: currentUser.email, role: 'owner', joinedAt: new Date() }
      );

      toast({ title: 'Team created', description: 'Your team has been created successfully' });

      if (onTeamCreated) {
        onTeamCreated(teamId); // Notify parent component
      }

      onClose();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create team', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Team Name"
              {...register('name', { required: 'Team name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Textarea
              placeholder="Team Description (optional)"
              {...register('description')}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeamForm;