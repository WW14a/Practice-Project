import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layout/mainLayout";
import ProtectedRoute from "./routes/protectesRoutes";
import Provider from "./provider/provider";
import Loading from "./components/loading";

import Routesloader, { getData } from "./page/routesloader";
import ErrorFallback from "./components/errorFallback";
import { Toaster } from "./components/ui/toast";
import Pagination from "./page/todoPagination";
import TodoEdit from "./page/todoEdit";

const Login = lazy(() => import("./page/auth/login"));
const Register = lazy(() => import("./page/auth/register"));
const Completed = lazy(() => import("./page/completed"));
const Pending = lazy(() => import("./page/pending"));
const Todo = lazy(() => import("./page/todo"));
const Profile = lazy(() => import("./page/profile"));
const TodoDetails = lazy(() => import("./page/todoDetails"));
const NotFound = lazy(() => import("./page/notFound"));
const Tanstack = lazy(() => import("./page/tanstackPagination"));

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <Login />,
    errorElement: <ErrorFallback />,
  },
  {
    path: "/auth/register",
    element: <Register />,
    errorElement: <ErrorFallback />,
  },

  {
    element: <ProtectedRoute />,
    errorElement: <ErrorFallback />,
    children: [
      {
        element: <MainLayout />,
        errorElement: <ErrorFallback />,
        children: [
          {
            path: "/dashboard",
            element: <Todo />,
          },
          {
            path: "/todo/:id",
            element: <TodoDetails />,
          },
          {
            path: "/todo/:id/edit",
            element: <TodoEdit />,
          },
          {
            path: "/completed",
            element: <Completed />,
          },
          {
            path: "/pending",
            element: <Pending />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/pagination",
            element: <Pagination />,
          },
          {
            path: "/tanstack",
            element: <Tanstack />,
          },
          {
            path: "/routesloader",
            element: <Routesloader />,
            loader: getData,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
    errorElement: <ErrorFallback />,
  },
]);

function App() {
  return (
    <Provider>
      <Toaster />
      <Suspense fallback={<Loading />}>
        {" "}
        {/*we wrap the RouterProvider with Suspense to handle lazy loading */}
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
}

export default App;
