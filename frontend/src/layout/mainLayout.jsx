import { useState } from "react";
import { TbPageBreak } from "react-icons/tb";
import { SiTodoist } from "react-icons/si";
import { CgProfile, CgCheckO, CgTimelapse, CgList } from "react-icons/cg";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/user";
import { TbLoader3 } from "react-icons/tb";
import { clearTokens } from "../lib/api";
import api from "../lib/api";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/toast";

function MainLayout() {
  const location = useLocation();
  const path = location.pathname.split("/")[1].trim();

  const [isOpen, setIsOpen] = useState(false);

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await api.post("/auth/logout");
    if (response.data?.success === false) {
      toast.add({
        type: "error",
        description: response.data?.message || "Please try again later.",
      });
      return;
    }
    toast.add({
      type: "success",

      description: "You have been logged out successfully.",
    });
    clearTokens();
    setUser(null);
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-white">
      <aside
        className="
          fixed inset-y-0 left-0 z-30
          flex h-screen w-16 flex-col
          border-r border-gray-800 bg-gray-950
          md:w-56
        "
      >
        <div
          className="
            flex h-16 shrink-0 items-center justify-center
            border-b border-gray-700
            md:justify-between md:px-4
          "
        >
          <span className="hidden font-semibold md:block">Todo App</span>

          <SiTodoist size={28} />
        </div>

        <nav className="flex flex-1 flex-col px-2 py-5 md:px-4">
          <Link
            to="/dashboard"
            className={`
              mb-2 flex items-center justify-center rounded-lg
              px-2 py-3 transition
              md:justify-start md:px-3
              ${
                path === "dashboard"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <CgList size={22} />

            <span className="ml-3 hidden text-sm md:block">Dashboard</span>
          </Link>

          <Link
            to="/completed"
            className={`
              mb-2 flex items-center justify-center rounded-lg
              px-2 py-3 transition
              md:justify-start md:px-3
              ${
                path === "completed"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <CgCheckO size={22} />

            <span className="ml-3 hidden text-sm md:block">Completed</span>
          </Link>

          <Link
            to="/pending"
            className={`
              mb-2 flex items-center justify-center rounded-lg
              px-2 py-3 transition
              md:justify-start md:px-3
              ${
                path === "pending"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <CgTimelapse size={22} />

            <span className="ml-3 hidden text-sm md:block">Pending</span>
          </Link>

          <Link
            to="/pagination"
            className={`
              mb-2 flex items-center justify-center rounded-lg
              px-2 py-3 transition
              md:justify-start md:px-3
              ${
                path === "pagination"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <TbPageBreak size={22} />
            <span className="ml-3 hidden text-sm md:block">Pagination</span>
          </Link>
          <Link
            to="/tanstack"
            className={`
              mb-2 flex items-center justify-center rounded-lg
              px-2 py-3 transition
              md:justify-start md:px-3
              ${
                path === "tanstack"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <TbPageBreak size={22} />
            <span className="ml-3 hidden text-sm md:block">
              TanStack Pagination
            </span>
          </Link>

          <Link
            to="/routesloader"
            className={`
              mb-2 flex items-center justify-center rounded-lg
              px-2 py-3 transition
              md:justify-start md:px-3
              ${
                path === "routesloader"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            <TbLoader3 size={22} />

            <span className="ml-3 hidden text-sm md:block">Routes Loader</span>
          </Link>
        </nav>

        <Link
          to="/profile"
          className={`
            flex shrink-0 items-center
            justify-center border-t border-gray-700
            px-2 py-4 transition
            md:justify-start md:px-4
            ${
              path === "profile"
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }
          `}
        >
          <CgProfile size={22} />

          <span className="ml-3 hidden text-sm md:block">Profile</span>
        </Link>
      </aside>

      <div className="ml-16 min-h-screen md:ml-56">
        <header
          className="
            sticky top-0 z-20
            flex h-14 items-center justify-end
            border-b border-gray-700
            bg-gray-950 px-4
          "
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="
                flex items-center justify-center
                rounded-full p-2
                text-gray-300
                transition
                hover:bg-gray-800
                hover:text-white
              "
            >
              <CgProfile size={25} />
            </button>
            {isOpen && (
              <div
                className="
                  absolute right-0 top-12 z-50
                  w-44 overflow-hidden
                  rounded-lg border border-gray-700
                  bg-gray-900 shadow-xl
                "
              >
                <p className="px-4 py-3 text-sm italic text-gray-300">
                  Hello, {user?.name}
                </p>

                <div className="border-t border-gray-700" />

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="
                    block px-4 py-3 text-sm
                    text-gray-300
                    hover:bg-gray-800 hover:text-white
                  "
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    block w-full px-4 py-3
                    text-left text-sm
                    text-gray-300
                    hover:bg-gray-800 hover:text-white
                  "
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main
          className="min-h-[calc(100vh-4rem)]"
          onClick={() => setIsOpen(false)}
        >
          <div className="px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
