import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
      // normalized
      const normalizedInput = taskText.toLowerCase().replace(/\s+/g, "");

      // fetch tasks one users
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      // check duplicates
      const isDuplicate = querySnapshot.docs.some((doc) => {
        const existingNormalized = doc
          .data()
          .text.toLowerCase()
          .replace(/\s+/g, "");
        return existingNormalized === normalizedInput;
      });
      if (isDuplicate) {
        return rejectWithValue("task already exist");
      }
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
      if (!userId) {
        throw new Error("user id is missing");
      }
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
      return rejectWithValue(error.message);
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
      return rejectWithValue(error.message);
    }
  }
);
export const toggleTaskComplete = createAsyncThunk(
  "tasks/completeTask",
  async ({ taskId, completed }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        completed: !completed,
      });
      return { taskId, completed: !completed };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateTasks = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, newUpdateText, userId }, { rejectWithValue }) => {
    try {
      const normalizedText = newUpdateText.toLowerCase().replace(/\s+/g, "");
      const q = query(collection(db, "tasks"), where("userId", "==", userId));
      const fetchingTask = await getDocs(q);
      // duplication check
      const isDuplicate = fetchingTask.docs.some((doc) => {
        const existingNormalized = doc
          .data()
          .text.toLowerCase()
          .replace(/\s+/g, "");
        return existingNormalized === normalizedText;
      });
      if (!isDuplicate) {
        return rejectWithValue("Task already exist");
      }
      await updateDoc(doc(db, "tasks", taskId), {
        text: newUpdateText,
      });
      return { taskId, newUpdateText };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTaskInFirebase.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTaskInFirebase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTaskInFirebase.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(fetchUserTasksFromFirebase.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserTasksFromFirebase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserTasksFromFirebase.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(deleteTaskFromFirbase.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteTaskFromFirbase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTaskFromFirbase.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(toggleTaskComplete.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        state.loading = false;
        const task = state.tasks.find(
          (task) => task.id === action.payload.taskId
        );
        if (task) {
          task.completed = action.payload.completed;
        }
      });
  },
});

export default taskSlice.reducer;
