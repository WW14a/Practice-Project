import { useEffect, useMemo, useRef, useState } from "react";
import { setTasks } from "../redux/slice/todoSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import CreateTodo from "@/components/createTodo";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { completeTodo, deleteTodo, loadTodos } from "@/utils/todo";
import { TbEditCircle } from "react-icons/tb";

function Todo() {
  let tasks = useSelector((state) => state.todo);

  const [filter, setFilter] = useState("all");
  let [searchQuery, setSearchQuery] = useState("");
  let searchRef = useRef(null);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["todo", 1],
    queryFn: () => loadTodos(),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  let searchedTasks = useMemo(
    () =>
      filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [filteredTasks, searchQuery],
  );

  const completedCount = tasks.filter((task) => task.completed).length;

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

  useEffect(() => {
    if (data) {
      dispatch(setTasks(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  return (
    <div className=" relative min-h-screen bg-gray-950 text-white">
      <div className="fixed bottom-10 right-10">
        <CreateTodo />
      </div>
      <div className="mx-auto  px-4 ">
        <div className="mb-8">
          <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:gap-10">
            <h1 className="  font-bold">My Todos</h1>
            <div className="w-full sm:w-auto sm:pt-6">
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search todo..."
                className="mt-2 w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-gray-600 sm:mb-6"
              />
            </div>
          </div>

          <p className="mt-1 text-gray-400">
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-3 py-2 text-sm ${
              filter === "all"
                ? "bg-white text-gray-900"
                : "bg-gray-900 text-gray-400"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`rounded-md px-3 py-2 text-sm ${
              filter === "active"
                ? "bg-white text-gray-900"
                : "bg-gray-900 text-gray-400"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`rounded-md px-3 py-2 text-sm ${
              filter === "completed"
                ? "bg-white text-gray-900"
                : "bg-gray-900 text-gray-400"
            }`}
          >
            Completed
          </button>
        </div>

        <div className="space-y-3 grid grid-cols-2 gap-4">
          {searchedTasks.map((task) => (
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
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
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
                      className={`text-lg font-semibold truncate line-clamp-1 ${
                        task.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-100 hover:text-white"
                      }`}
                    >
                      {task.title}
                    </Link>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 truncate line-clamp-2 text-xs font-medium ${
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

                  {task.description && (
                    <p className="min-h-10 line-clamp-2 text-sm text-gray-400">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-800 pt-1">
                <Link to={`/todo/${task._id}/edit`} className="cursor-pointer">
                  <TbEditCircle />
                </Link>

                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(task._id)}
                  className=" cursor-pointer"
                >
                  <MdOutlineDeleteForever
                    size={20}
                    className="text-gray-500 hover:text-red-400"
                  />
                </button>
              </div>
            </div>
          ))}

          {searchedTasks.length === 0 && (
            <p className="py-10 text-center text-gray-500">No todo found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
