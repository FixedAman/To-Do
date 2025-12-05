import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
      if (!userId) return rejectWithValue("userId is misssing!");
      if (!category?.name)
        return rejectWithValue("whole category name in data is missing!");
      const name = category.name.trim();
      const normalized = category.name.toLowerCase().replace(/\s+/g, "");
      const q = query(collection(db, "users", userId, "categories"));
      const snap = await getDocs(q);
      const existingDoc = snap.docs.find((doc) => {
        const exist = doc.data().name.toLowerCase().replace(/\s+/g, "");
        return normalized === exist;
      });
      if (existingDoc) {
        return {
          id: existingDoc.id,
          ...existingDoc.data(),
        };
      } else {
        const newCategoryData = {
          name,
          normalized,
          createdAt: new Date().toISOString(),
          userId,
        };

        const ref = await addDoc(
          collection(db, "users", userId, "categories"),
          newCategoryData
        );
        return { id: ref.id, ...newCategoryData };
      }
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
