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
import { decryptData, encryptData } from "../../../lib/crypto";

// adding task in firebase
export const addTaskInFirebase = createAsyncThunk(
  "tasks/addTask",
  async ({ taskText, userId, categoryId }, { rejectWithValue }) => {
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

      const encryptedData = encryptData(taskText);
      const taskRef = await addDoc(collection(db, "tasks"), {
        text: encryptedData,
        userId,
        completed: false,
        categoryId,
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
        throw new Error("userId te problem");
      }
      console.log("ekhane problem ", userId);
      const taskQuery = query(
        collection(db, "tasks"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(taskQuery);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: decryptData(data.text) || "facing error",
          completed: data.completed,
          userId: data.userId,
          categoryId: data.categoryId,
          createdAt: data.createdAt,
        };
      });
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
      if (isDuplicate) {
        return rejectWithValue("Task already exist");
      }
      // encryption before updating
      const encryptedData = encryptData(newUpdateText);
      await updateDoc(doc(db, "tasks", taskId), {
        text: encryptedData,
      });
      return { taskId, newUpdateText };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchTasksByCategory = createAsyncThunk(
  "tasks/fetchTasksByCategory",
  async ({ userId, categoryId }, { dispatch, getState, rejectWithValue }) => {
    try {
      //* ensure tasks are loaded /decrypted  via your secure thunk
      console.log("fetching from taskByCategory", userId);
      const stateBefore = getState();
      const taskSlice = stateBefore?.listOfTask;
      const alreadyLoaded =
        taskSlice &&
        Array.isArray(taskSlice?.tasks) &&
        taskSlice.tasks.length > 0;
      if (!alreadyLoaded) {
        await dispatch(fetchUserTasksFromFirebase({ userId }));
      }
      const stateAfter = getState();
      const allTasks = Array.isArray(stateAfter?.listOfTask?.tasks)
        ? stateAfter.listOfTask.tasks
        : [];
      if (!categoryId || categoryId === "all") return allTasks;
      return allTasks.filter((t) => t.categoryId === categoryId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    allTasks: [],
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
        state.allTasks.push(action.payload);
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
        state.allTasks = action.payload;
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
        state.allTasks = state.allTasks.filter(
          (task) => task.id !== action.payload
        );
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
        const allTasks = state.allTasks.find(
          (task) => task.id === action.payload.taskId
        );

        if (task && allTasks) {
          task.completed = action.payload.completed;
          allTasks.completed = action.payload.completed;
        }
      })
      .addCase(updateTasks.fulfilled, (state, action) => {
        state.loading = false;
        const task = state.tasks.find((t) => t.id === action.payload.taskId);
        if (task) {
          task.text = action.payload.newUpdateText;
        }
      })
      .addCase(updateTasks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTasksByCategory.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchTasksByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "kichu jhamela hoegache";
      })
      .addCase(fetchTasksByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      });
  },
});

export default taskSlice.reducer;
