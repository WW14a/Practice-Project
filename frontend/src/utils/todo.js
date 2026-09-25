import { toast } from "@/components/ui/toast";
import api from "@/lib/api";

export const completeTodo = async (id, completed) => {
  try {
    await api.patch(`/todo/${id}`, {
      completed: completed.toString(),
    });
  } catch (error) {
    toast.add({
      type: "error",
      description:
        error.response?.data?.message ||
        error.response?.data?.data?.message ||
        error.message ||
        "Unable to update task",
    });
  }
};

export const deleteTodo = async (id) => {
  try {
    const res = await api.delete(`/todo/${id}`);
    if (res.data.success === true) {
      toast.add({
        type: "success",
        description: "Todo deleted successfully",
      });
    }
  } catch (error) {
    toast.add({
      type: "error",
      description:
        error.response?.data?.message ||
        error.response?.data?.data?.message ||
        error.message ||
        "Unable to delete task",
    });
  }
};

export const loadTodos = async () => {
  try {
    const response = await api.get("/todo?page=1&limit=100");
    return response.data?.data?.todo || [];
  } catch (error) {
    toast.add({
      type: "error",
      title: "Unable to load todos",
      description: error.response?.data?.message || "Please try again later.",
    });
  }
};
