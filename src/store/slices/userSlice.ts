import axiosClient from "@/utils/axiosClient";
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/types";

interface UserState {
  user: User | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: "idle",
  error: null,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (_, thunkAPI) => {
  try {
    const res = await axiosClient.get(`/api/v1/auth/me`);    
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch user");
  }
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData: Partial<User>, thunkAPI) => {
    try {
      const res = await axiosClient.put(`/api/v1/user/${userData.id}`, userData);
      
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = 'pending'
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.payload as string;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
