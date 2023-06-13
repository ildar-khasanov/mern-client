import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

// client отправит post запрос, в котором будет email, password =>
// это все передается в backend, backend вернет ответ и это сохраним в redux (authSlice)
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
    // params (в ней хранится email, password) 2:47
    const { data } = await axios.post("/auth/login", params);
    return data;
});

export const fetchRegistr = createAsyncThunk(
    "auth/fetchRegistr",
    async (params) => {
        const { data } = await axios.post("/auth/register", params);

        return data;
    }
);

export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
    const { data } = await axios.get("/auth/me");
    return data;
});

const initialState = {
    data: null,
    status: "loading",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: {
        // LOGIN
        [fetchAuth.pending]: (state) => {
            state.status = "loading";
            state.data = null;
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = "loaded";
            state.data = action.payload;
        },
        [fetchAuth.rejected]: (state) => {
            state.status = "error";
            state.data = null;
        },

        // AUTH ME
        [fetchAuthMe.pending]: (state) => {
            state.status = "loading";
            state.data = null;
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.status = "loaded";
            state.data = action.payload;
        },
        [fetchAuthMe.rejected]: (state) => {
            state.status = "error";
            state.data = null;
        },

        // REGISTR
        [fetchRegistr.pending]: (state) => {
            state.status = "loading";
        },
        [fetchRegistr.fulfilled]: (state, action) => {
            state.status = "loaded";
        },
        [fetchRegistr.rejected]: (state) => {
            state.status = "error";
        },
    },
});

export const selectedIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
