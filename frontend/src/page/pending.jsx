import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/slice/todoSlice";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { completeTodo, deleteTodo, loadTodos } from "@/utils/todo";
import { useEffect } from "react";
import { TbEditCircle } from "react-icons/tb";

function Pending() {
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

  const pendingTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto px-4 ">
        <h1 className="font-bold">Pending Todo</h1>

        <div className="mb-8">
          <p className="mt-1 text-gray-400">
            {pendingTasks.length} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="space-y-3 grid grid-cols-2 gap-4">
          {pendingTasks.map((task) => (
            <div
              key={task._id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
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
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-600"
                >
                  {task.completed && "✓"}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/todo/${task._id}`}
                      className="text-lg font-semibold truncate line-clamp-1 text-gray-100 hover:text-white"
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

                  <p className="min-h-10 line-clamp-2 text-sm text-gray-400">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-800 pt-1">
                <Link to={`/todo/${task._id}/edit`}>
                  <TbEditCircle />
                </Link>

                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(task._id)}
                  className="cursor-pointer"
                >
                  <MdOutlineDeleteForever
                    size={20}
                    className="text-gray-500 hover:text-red-400"
                  />
                </button>
              </div>
            </div>
          ))}

          {pendingTasks.length === 0 && (
            <p className="py-10 text-center text-gray-500">No todo found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pending;
