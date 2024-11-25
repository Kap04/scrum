import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/lib/firebase/taskService';
import type { ITaskData } from '@/lib/firebase/types';
import TaskForm from './TaskForm';
import ErrorBoundary from './ErrorBoundary';
import confetti from 'canvas-confetti';

interface ColumnType {
  id: 'pending' | 'doing' | 'completed';
  title: string;
  color: string;
}

interface TaskBoardProps {
  teamId: string;
  currentUser: {
    id: string;
    name: string;
  };
}

const columns: ColumnType[] = [
  { id: 'pending', title: 'To Do', color: 'bg-yellow-100' },
  { id: 'doing', title: 'In Progress', color: 'bg-blue-100' },
  { id: 'completed', title: 'Done', color: 'bg-green-100' }
];

const TaskCard: React.FC<{
  task: ITaskData;
  onEdit: (task: ITaskData) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (task: ITaskData) => void;
}> = ({ task, onEdit, onDelete, onDragStart }) => (
  <div
    className="bg-opacity-70 bg-black p-4 rounded-lg shadow mb-2 cursor-move"
    draggable
    onDragStart={() => onDragStart(task)}
  >
    <h3 className="font-medium mb-1">{task.title}</h3>
    <p className="text-sm text-zinc-400 mb-2">{task.description}</p>
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(task)}
      >
        Edit
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(task.taskID)}
      >
        Delete
      </Button>
    </div>
  </div>
);

const TaskBoard: React.FC<TaskBoardProps> = ({ teamId, currentUser }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ITaskData[]>([]);
  const [draggedTask, setDraggedTask] = useState<ITaskData | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITaskData | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = taskService.subscribeToTeamTasks(teamId, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teamId]);

  useEffect(() => {
    if (tasks.length > 0 && tasks.every(task => task.status === 'completed')) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [tasks]);

  const handleDragStart = (task: ITaskData) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: 'pending' | 'doing' | 'completed') => {
    if (draggedTask && draggedTask.status !== status) {
      try {
        await taskService.updateTask(draggedTask.taskID, { status });
        toast({
          title: 'Task status updated',
          description: `Task moved to ${status}`,
        });
      } catch (err) {
        console.error('Error updating task status:', err);
        toast({
          title: 'Error updating task',
          description: 'Failed to update task status',
          variant: 'destructive',
        });
      }
      setDraggedTask(null);
    }
  };

  const handleEditTask = (task: ITaskData) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        toast({
          title: 'Task deleted',
          description: 'Task has been successfully deleted',
        });
      } catch (err) {
        console.error('Error deleting task:', err);
        toast({
          title: 'Error deleting task',
          description: 'Failed to delete task',
          variant: 'destructive',
        });
      }
    }
  };

  const groupedTasks = {
    pending: tasks.filter(task => task.status === 'pending'),
    doing: tasks.filter(task => task.status === 'doing'),
    completed: tasks.filter(task => task.status === 'completed'),
  };

  return (
    <ErrorBoundary>
      <Card className="w-full max-w-6xl bg-stone-700 bg-opacity-40 mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className='text-2xl text-zinc-200'>Team Task Board</CardTitle>
            <Button
              onClick={() => {
                setSelectedTask(null);
                setIsTaskFormOpen(true);
              }}
              className="flex bg-zinc-400 items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className={`w-full md:w-1/3 p-4 rounded-lg ${column.color}`}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.id)}
                >
                  <h2 className="font-semibold mb-4 text-gray-950">{column.title}</h2>
                  <div className="space-y-2 text-zinc-300">
                    {groupedTasks[column.id].map((task) => (
                      <TaskCard
                        key={task.taskID}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isTaskFormOpen && (
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => {
            setIsTaskFormOpen(false);
            setSelectedTask(null);
          }}
          teamId={teamId}
          currentUser={currentUser}
          existingTask={selectedTask ?? undefined}
        />
      )}
    </ErrorBoundary>
  );
};

export default TaskBoard;

