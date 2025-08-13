import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "commentNotification",
  initialState: {
    commentNotifications: [],
  },
  reducers: {
    // ✅ Add a new comment notification
    setCommentNotification: (state, action) => {
      state.commentNotifications.push(action.payload);
    },

    // ✅ Remove a single comment notification by commentId
    removeCommentNotification: (state, action) => {
      const commentId = action.payload;
      state.commentNotifications = state.commentNotifications.filter(
        (item) => item.id !== commentId
      );
    },

    // ✅ Clear all comment notifications
    clearCommentNotifications: (state) => {
      state.commentNotifications = [];
    },
  },
});

export const {
  setCommentNotification,
  removeCommentNotification,
  clearCommentNotifications,
} = commentSlice.actions;

export default commentSlice.reducer;
