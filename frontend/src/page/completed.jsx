import { MdOutlineDeleteForever } from "react-icons/md";
import { TbEditCircle } from "react-icons/tb";
import { Link } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { loadTodos, completeTodo, deleteTodo } from "@/utils/todo";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/slice/todoSlice";
import { useEffect } from "react";

function Completed() {
  const tasks = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["todo"],
    queryFn: loadTodos,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data) {
      dispatch(setTasks(data));
    }
  }, [data, dispatch]);

  const completeMutation = useMutation({
    mutationFn: ({ id, completed }) => completeTodo(id, completed),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
    },
  });

  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto  px-4 ">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Completed Todo</h1>

          <p className="mt-1 text-gray-400">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {completedTasks.map((task) => (
            <div
              key={task._id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <button
                  disabled={completeMutation.isPending}
                  onClick={() =>
                    completeMutation.mutate({
                      id: task._id,
                      completed: !task.completed,
                    })
                  }
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                    task.completed
                      ? "border-white bg-white text-gray-900"
                      : "border-gray-600"
                  }`}
                >
                  {task.completed && "✓"}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/todo/${task._id}`}
                      className={`line-clamp-1 truncate text-lg font-semibold ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-100 hover:text-white"
                      }`}
                    >
                      {task.title}
                    </Link>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-950 text-red-300"
                          : task.priority === "low"
                            ? "bg-blue-950 text-blue-300"
                            : "bg-yellow-950 text-yellow-300"
                      }`}
                    >
                      {task.priority || "medium"}
                    </span>
                  </div>

                  <p className="mt-2 min-h-10 line-clamp-2 text-sm text-gray-400">
                    {task.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-800 pt-3">
                <Link
                  to={`/todo/${task._id}/edit`}
                  className="text-gray-500 transition hover:text-white"
                >
                  <TbEditCircle size={20} />
                </Link>

                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(task._id)}
                  className="cursor-pointer text-gray-500 transition hover:text-red-400"
                >
                  <MdOutlineDeleteForever size={20} />
                </button>
              </div>
            </div>
          ))}

          {completedTasks.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-500">No completed todo found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Completed;
