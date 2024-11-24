import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { teamService } from '@/lib/firebase/teamService';

interface JoinTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
}

interface FormData {
  joinCode: string;
}

const JoinTeamDialog: React.FC<JoinTeamDialogProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const { toast } = useToast();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset 
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await teamService.joinTeam(
        data.joinCode.toUpperCase(),
        {
          userId: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: 'member',
          joinedAt: new Date(),
        }
      );

      toast({
        title: 'Joined team',
        description: 'You have successfully joined the team',
      });
      reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to join team',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter Team Code"
              {...register('joinCode', { 
                required: 'Team code is required',
                minLength: { 
                  value: 6, 
                  message: 'Team code must be 6 characters' 
                },
                maxLength: { 
                  value: 6, 
                  message: 'Team code must be 6 characters' 
                },
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: 'Team code can only contain letters and numbers'
                }
              })}
              className="uppercase"
            />
            {errors.joinCode && (
              <p className="text-sm text-destructive">
                {errors.joinCode.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinTeamDialog;