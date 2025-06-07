import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";

// adding task in firebase
export const addTaskInFirebase = createAsyncThunk(
  "tasks/addTask",
  async ({ taskText, userId }, { rejectWithValue }) => {
    try {
      const taskRef = await addDoc(collection(db, "tasks"), {
        text: taskText,
        userId,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      return { id: taskRef.id, text: taskText, completed: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchUserTasksFromFirebase = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const taskQuery = query(
        collection(db, "tasks"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(taskQuery);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
export const deleteTaskFromFirbase = createAsyncThunk(
  "tasks/deleteTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      return taskId;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
export const toggleTaskComplete = createAsyncThunk(
  "tasks/completeTask",
  async (taskId, completed, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        completed: !completed,
      });
      return { taskId, completed: !completed };
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
