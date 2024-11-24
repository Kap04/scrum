export interface ITaskData {
    taskID: string;
    title: string;
    description: string;
    status: 'pending' | 'doing' | 'completed';
    createdBy: string;
    assignedTo: string | null;
    teamId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ICreateTaskData {
    title: string;
    description: string;
    assignedTo?: string | null;
    teamId: string;
    createdBy: string;
  }
  
  export interface IUpdateTaskData {
    title?: string;
    description?: string;
    status?: 'pending' | 'doing' | 'completed';
    assignedTo?: string | null;
  }
  