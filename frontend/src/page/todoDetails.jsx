import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { completeTask, deleteTask } from "../redux/slice/todoSlice";
import api from "../lib/api";
import Loading from "../components/loading";
import { TbEditCircle } from "react-icons/tb";

function TodoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function getTodo() {
      try {
        setIsLoading(true);
        setHasError(false);
        const response = await api.get(`/todo/${id}`);
        const payload = response.data;
        const todo = payload?.data?.todo || payload?.data || payload;

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

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 text-white">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back to todos
      </button>

      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-8  ">
          <div>
            <div className="flex justify-between   mb-4">
              <p className="mb-2 text-xs uppercase tracking-widest text-gray-400">
                Todo details
              </p>
              <Link to={"edit"}>
                <TbEditCircle className="cursor-pointer size-4 " />
              </Link>
            </div>
            <div className=" flex items-end justify-end gap-2">
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
            <h1 className=" text-3xl font-bold text-white">{task.title}</h1>
            <p className="mt-3 text-sm text-gray-300">{task.description}</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-5">
          <p className="text-sm text-gray-500">Task ID</p>
          <p className="mt-1 text-sm text-gray-300">{task._id}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={toggleTask}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
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
      </div>
    </section>
  );
}

export default TodoDetails;
