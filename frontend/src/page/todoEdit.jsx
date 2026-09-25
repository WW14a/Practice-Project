import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { completeTask, deleteTask } from "../redux/slice/todoSlice";
import api from "../lib/api";
import Loading from "../components/loading";
import Input from "@/components/input";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

function TodoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  let {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    reset,
  } = useForm();
  useEffect(() => {
    let isMounted = true;

    async function getTodo() {
      try {
        setIsLoading(true);
        setHasError(false);
        const response = await api.get(`/todo/${id}`);
        const payload = response.data;
        const todo = payload?.data?.todo || payload?.data || payload;
        reset(todo);

        if (isMounted) {
          setTask(todo);
        }
      } catch {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    getTodo();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (hasError || !task) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-10 text-white">
        <p className="mb-4 text-gray-400">This todo could not be found.</p>
        <button
          className="text-sm text-gray-300 underline"
          onClick={() => navigate(-1)}
        >
          Back to todos
        </button>
      </section>
    );
  }

  function removeTask() {
    dispatch(deleteTask(task._id));
    navigate("/dashboard");
  }

  function toggleTask() {
    setTask((currentTask) => ({
      ...currentTask,
      completed: !currentTask.completed,
    }));
    dispatch(completeTask(task._id));
  }

  async function onSubmit(data) {
    const changedFields = {};

    Object.keys(dirtyFields).forEach((field) => {
      changedFields[field] = data[field];
    });

    console.log("Changed fields:", changedFields);

    if (Object.keys(changedFields).length === 0) {
      console.log("Nothing changed");
      navigate(-1);
    }

    try {
      const res = await api.patch(`/todo/${id}`, changedFields);
      if (res.data.success) {
        toast.add({
          type: "success",
          description: "The todo has been updated successfully.",
        });
      }
      navigate(-1);
    } catch (error) {
      console.error("Failed to update todo:", error);
      toast.add({
        type: "error",
        description: "Failed to update the todo. Please try again.",
      });
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 text-white">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back to todos
      </button>

      <form
        id="update-form"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6"
      >
        <div className="mb-8  ">
          <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
            Todo details
          </p>

          <div className="mb-2 flex items-end justify-end ">
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                task.completed
                  ? "bg-green-950 text-green-300"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {task.completed ? "Completed" : "Active"}
            </span>
          </div>

          <input
            className="text-3xl font-bold text-white focus:outline-none "
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
          <textarea
            {...register("description")}
            className="focus:outline-none mt-8 text-sm w-full text-gray-300"
          ></textarea>
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className=" mb-4">
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className=" border-gray-700 bg-gray-950 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>

                <SelectContent alignItemWithTrigger={false}>
                  <SelectItem value="high">High</SelectItem>

                  <SelectItem value="medium">Medium</SelectItem>

                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="border-t border-gray-800 pt-5">
          <p className="text-sm text-gray-500">Task ID</p>
          <p className="mt-1 text-sm text-gray-300">{task._id}</p>
        </div>

        <div className="mt-8 flex justify-between  flex-wrap gap-3">
          <div>
            <button
              type="button"
              onClick={toggleTask}
              className=" mr-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
            >
              {task.completed ? "Mark active" : "Mark complete"}
            </button>
            <button
              type="button"
              onClick={removeTask}
              className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-300 hover:bg-red-950"
            >
              Delete todo
            </button>
          </div>

          <button
            type="submit"
            form="update-form"
            className=" mr-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            Save changes
          </button>
        </div>
      </form>
    </section>
  );
}

export default TodoEdit;
