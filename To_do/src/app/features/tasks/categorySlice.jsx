import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId || typeof userId !== "string") {
        throw new Error("invalid string problem ");
      }
      const snapshot = await getDocs(
        collection(db, "users", userId, "categories")
      );
      return snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ userId, category }, { rejectWithValue }) => {
    try {
      const newCategory = { ...category, userId };
      const ref = await addDoc(
        collection(db, "users", userId, "categories"),
        newCategory
      );
      return { id: ref.id, ...newCategory };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
