// lib/firebase/taskService.ts
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { ITaskData, ICreateTaskData, IUpdateTaskData } from './types';

class TaskServiceClass {
  private tasksCollection = collection(db, 'tasks');

  async createTask(taskData: ICreateTaskData): Promise<string> {
    const docRef = await addDoc(this.tasksCollection, {
      ...taskData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async updateTask(taskId: string, updateData: IUpdateTaskData): Promise<void> {
    const taskRef = doc(this.tasksCollection, taskId);
    await updateDoc(taskRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(this.tasksCollection, taskId);
    await deleteDoc(taskRef);
  }

  // In taskService.ts
subscribeToTeamTasks(teamId: string, callback: (tasks: ITaskData[]) => void): () => void {
  const q = query(this.tasksCollection, where('teamId', '==', teamId));
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        taskID: doc.id,
        ...data,
        // Add null checks for timestamps
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
        updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date()
      };
    }) as ITaskData[];
    
    callback(tasks);
  });
}
}

export const taskService = new TaskServiceClass();