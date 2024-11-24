import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';

// Type definitions
interface Task {
  taskID: string;
  title: string;
  description: string;
  status: 'pending' | 'doing' | 'completed';
  createdBy: string;
  assignedTo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskBoardProps {
  teamId: string;
  currentUser: {
    id: string;
    name: string;
  };
}

interface TasksState {
  pending: Task[];
  doing: Task[];
  completed: Task[];
}

interface ColumnProps {
  id: 'pending' | 'doing' | 'completed';
  title: string;
  color: string;
  tasks: Task[];
}

interface TaskCardProps {
  task: Task;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ teamId, currentUser }) => {
  const [tasks, setTasks] = useState<TasksState>({
    pending: [],
    doing: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: Array<Omit<ColumnProps, 'tasks'>> = [
    { id: 'pending', title: 'Pending', color: 'bg-yellow-100' },
    { id: 'doing', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' }
  ];

  // Handle drag events
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: 'pending' | 'doing' | 'completed') => {
    if (draggedTask) {
      const updatedTasks = { ...tasks };
      const oldStatus = draggedTask.status;
      
      updatedTasks[oldStatus] = updatedTasks[oldStatus].filter(
        task => task.taskID !== draggedTask.taskID
      );
      
      updatedTasks[status] = [
        ...updatedTasks[status],
        { ...draggedTask, status }
      ];
      
      setTasks(updatedTasks);
      setDraggedTask(null);
    }
  };

  const TaskCard: React.FC<TaskCardProps> = ({ task }) => (
    <div
      draggable
      onDragStart={() => handleDragStart(task)}
      className="bg-white p-4 rounded-lg shadow mb-2 cursor-move hover:shadow-md transition-shadow"
    >
      <h3 className="font-medium mb-2">{task.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Created by: {task.createdBy}</span>
        {task.assignedTo && <span>Assigned to: {task.assignedTo}</span>}
      </div>
    </div>
  );

  const Column: React.FC<ColumnProps> = ({ id, title, color, tasks }) => (
    <div
      className={`w-full md:w-1/3 p-4 ${color} rounded-lg mx-2`}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(id)}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <span className="bg-white px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.taskID} task={task} />
        ))}
      </div>
    </div>
  );

  // Mock data - replace with Firestore fetch
  useEffect(() => {
    const mockTasks: TasksState = {
      pending: [
        {
          taskID: '1',
          title: 'Design User Interface',
          description: 'Create mockups for the new dashboard',
          status: 'pending',
          createdBy: 'John',
          assignedTo: 'Alice',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      doing: [
        {
          taskID: '2',
          title: 'Implement Authentication',
          description: 'Set up Firebase Authentication',
          status: 'doing',
          createdBy: 'Alice',
          assignedTo: 'Bob',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      completed: [
        {
          taskID: '3',
          title: 'Project Setup',
          description: 'Initialize project and install dependencies',
          status: 'completed',
          createdBy: 'Bob',
          assignedTo: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    };

    setTasks(mockTasks);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Team Task Board</CardTitle>
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              tasks={tasks[column.id]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskBoard;