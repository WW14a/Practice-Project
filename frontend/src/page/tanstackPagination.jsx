import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import Loading from "../components/loading";
import ErrorPage from "../components/error";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api";
import { completeTodo, deleteTodo } from "@/utils/todo";
import { TbEditCircle } from "react-icons/tb";
import { Link } from "react-router-dom";

function Tanstack() {
  let [page, setpage] = useState(1);
  let queryClient = useQueryClient();

  let limit = 5;

  let getTask = async () => {
    let res = await api.get(`/todo?page=${page}&limit=${limit}`);

    return res.data.data.todo;
  };
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["todo", page],
    queryFn: getTask,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  let handleComplete = (id) => {
    completeTodo(id, !data.find((task) => task._id === id)?.completed);
    queryClient.setQueryData(["todo", page], (oldData) =>
      oldData.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  let handleDelete = (id) => {
    deleteTodo(id);
    queryClient.setQueryData(["todos", page], (oldData) =>
      oldData.filter((task) => task._id !== id),
    );
  };

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <ErrorPage error={error.message} />;
  }
  let completeTasks = data.filter((task) => task.completed);
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto px-4 ">
        <h1 className="  font-bold">Todo Pagination</h1>
        <div className="mb-8">
          <p className="mt-1 text-gray-400">
            {completeTasks.length} of {data.length} todos completed
          </p>
        </div>

        <div className="space-y-3 grid grid-cols-2 gap-4">
          {data.map((task) => (
            <div
              key={task._id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(task._id)}
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-600"
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
                  onClick={() => handleDelete(task._id)}
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

          {data.length === 0 && (
            <p className="py-10 text-center text-gray-500">No todo found.</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={() => setpage(page - 1)}
          disabled={page === 1}
          className="rounded-md cursor-pointer bg-gray-800 px-3 py-2 text-sm text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">
          Page
          <input
            type="number"
            min="1"
            value={page}
            className="w-9"
            onChange={(e) => setpage(parseInt(e.target.value) || 1)}
          />
        </span>
        <button
          onClick={() => setpage(page + 1)}
          disabled={data.length < limit}
          className="rounded-md cursor-pointer bg-gray-800 px-3 py-2 text-sm text-gray-400 "
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Tanstack;
