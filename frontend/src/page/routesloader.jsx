import api from "@/lib/api";
import { completeTodo, deleteTodo } from "@/utils/todo";
import { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { TbEditCircle } from "react-icons/tb";
import { Link, useLoaderData } from "react-router-dom";

export const getData = async () => {
  let res = await api.get(`/todo?page=${1}&limit=${100}`);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return res.data.data.todo;
};

function Routesloader() {
  const [tasks, setTask] = useState(useLoaderData());

  let handleComplete = (id, completed) => {
    completeTodo(id, completed);

    setTask((prev) =>
      prev.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };
  let handleDelete = (id) => {
    deleteTodo(id);
    setTask((prev) => prev.filter((task) => task._id !== id));
  };

  let completedTasks = tasks.filter((task) => task.completed);
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto  px-4">
        <h1 className="  font-bold">Todo</h1>
        <div className="mb-8">
          <p className="mt-1 text-gray-400">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="space-y-3 grid grid-cols-2 gap-4">
          {tasks.map((data) => (
            <div
              key={data._id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleComplete(data._id, !data.completed)}
                  className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-600"
                >
                  {data.completed && "✓"}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to={`/todo/${data._id}`}
                      className={`text-lg font-semibold truncate line-clamp-1 ${
                        data.completed
                          ? "text-gray-500 line-through"
                          : "text-gray-100 hover:text-white"
                      }`}
                    >
                      {data.title}
                    </Link>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        data.priority === "high"
                          ? "bg-red-950 text-red-300"
                          : data.priority === "low"
                            ? "bg-blue-950 text-blue-300"
                            : "bg-yellow-950 text-yellow-300"
                      }`}
                    >
                      {data.priority || "medium"}
                    </span>
                  </div>

                  <p className="min-h-10 line-clamp-2 text-sm text-gray-400">
                    {data.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-800 pt-1">
                <Link to={`/todo/${data._id}/edit`}>
                  <TbEditCircle />
                </Link>

                <button
                  onClick={() => handleDelete(data._id)}
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

          {tasks.length === 0 && (
            <p className="py-10 text-center text-gray-500">No todo found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Routesloader;
