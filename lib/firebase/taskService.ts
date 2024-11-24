// lib/firebase/taskService.ts
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import type { 
  ITaskData, 
  ICreateTaskData, 
  IUpdateTaskData 
} from './types';

class TaskServiceClass {
  private tasksCollection = collection(db, 'tasks');

  subscribeToTeamTasks(teamId: string, callback: (tasks: ITaskData[]) => void) {
    const q = query(
      this.tasksCollection,
      where('teamId', '==', teamId),
      orderBy('createdAt', 'desc')
    );
  
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => {
        const data = doc.data();
        //console.log('Task document data:', data);

  
        return {
          taskID: doc.id,
          ...data,
          createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : null,
          updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : null,
        };
      }) as ITaskData[];
  
      callback(tasks);
    });
  }
  

  async createTask(taskData: ICreateTaskData): Promise<string> {
    const docRef = await addDoc(this.tasksCollection, {
      ...taskData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async updateTask(taskId: string, updates: IUpdateTaskData): Promise<void> {
    const taskRef = doc(this.tasksCollection, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(this.tasksCollection, taskId);
    await deleteDoc(taskRef);
  }
}

export const taskService = new TaskServiceClass();