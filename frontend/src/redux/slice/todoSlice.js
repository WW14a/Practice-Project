import { completeTodo, deleteTodo } from "@/utils/todo";
import { createSlice } from "@reduxjs/toolkit";

let initialState = [];

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTasks: (_state, action) => {
      return action.payload;
    },

    addTask: (state, action) => {
      state.push(action.payload);
    },

    completeTask: (state, action) => {
      const task = state.find((task) => task._id === action.payload);
      if (!task) {
        return state;
      }
      task.completed = !task.completed;

      return state;
    },
    deleteTask: (state, action) => {
      return state.filter((task) => task._id !== action.payload);
    },
  },
});

export const { setTasks, addTask, completeTask, deleteTask } =
  todoSlice.actions;
export default todoSlice.reducer;
