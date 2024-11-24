// lib/firebase/types.ts

export interface ITeamMember {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
  joinedAt: Date;
}

export interface ICreateTeam {
  name: string;
  description?: string;
  createdBy: string;
}

export interface ITeam extends ICreateTeam {
  teamId: string;
  joinCode: string;
  members: ITeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTaskData {
  title: string;
  description: string;
  status: 'pending' | 'doing' | 'completed';
  teamId: string;
  createdBy: string;
  assignedTo: string; // Added assignedTo field
}

export interface IUpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'doing' | 'completed';
  assignedTo?: string; // Added assignedTo field
}

export interface ITaskData extends ICreateTaskData {
  taskID: string;
  createdAt: Date;
  updatedAt: Date;
}