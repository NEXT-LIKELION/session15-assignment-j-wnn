import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import type { Task } from '@/types/index';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// Utility functions
const convertTimestampToISO = (timestamp: Timestamp | null): string | undefined => {
  return timestamp ? timestamp.toDate().toISOString() : undefined;
};

const convertToTimestamp = (dateString: string | undefined): Timestamp | null => {
  return dateString ? Timestamp.fromDate(new Date(dateString)) : null;
};

// Task service
export const taskService = {
  // Get tasks collection reference for a user
  getTasksCollection: (username: string) => {
    return collection(db, 'users', username, 'tasks');
  },

  // Get task document reference
  getTaskDoc: (username: string, taskId: string) => {
    return doc(db, 'users', username, 'tasks', taskId);
  },

  // Subscribe to tasks changes
  subscribeToTasks: (username: string, callback: (tasks: Task[]) => void) => {
    const tasksRef = taskService.getTasksCollection(username);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const tasks = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: convertTimestampToISO(doc.data().createdAt),
        dueDate: convertTimestampToISO(doc.data().dueDate)
      })) as Task[];
      callback(tasks);
    });
  },

  // Add new task
  addTask: async (username: string, taskData: Omit<Task, "id" | "createdAt">) => {
    const tasksRef = taskService.getTasksCollection(username);
    await addDoc(tasksRef, {
      ...taskData,
      createdAt: Timestamp.fromDate(new Date()),
      dueDate: convertToTimestamp(taskData.dueDate)
    });
  },

  // Update task
  updateTask: async (username: string, task: Task) => {
    const taskRef = taskService.getTaskDoc(username, task.id);
    await updateDoc(taskRef, {
      ...task,
      createdAt: convertToTimestamp(task.createdAt),
      dueDate: convertToTimestamp(task.dueDate)
    });
  },

  // Delete task
  deleteTask: async (username: string, taskId: string) => {
    const taskRef = taskService.getTaskDoc(username, taskId);
    await deleteDoc(taskRef);
  },

  // Toggle task completion
  toggleTaskCompletion: async (username: string, taskId: string, completed: boolean) => {
    const taskRef = taskService.getTaskDoc(username, taskId);
    await updateDoc(taskRef, { completed });
  }
};

export { app, db }; 