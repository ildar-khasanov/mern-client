import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
    const { data } = await axios.get("/posts");
    return data;
});
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
    const { data } = await axios.get("/tags");
    return data;
});
export const fetchDelete = createAsyncThunk("posts/fetchDelete", async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
});

const initialState = {
    posts: {
        items: [],
        status: "loading",
    },
    tags: {
        items: [],
        status: "loading",
    },
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    // 2:26
    extraReducers: {
        // если пришел запрос pending в redux, обновляем статус
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = "loading";
        },
        // если статус fullfiled
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = "loaded";
        },
        // если произошла ошибка
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = "error";
        },
        // tags
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = "loading";
        },
        // если статус fullfiled
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = "loaded";
        },
        // если произошла ошибка
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = "error";
        },

        // DELETE
        [fetchDelete.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(
                (post) => post._id !== action.meta.arg
            );
        },
        [fetchDelete.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = "error";
        },
    },
});

export const postsReducer = postsSlice.reducer;
