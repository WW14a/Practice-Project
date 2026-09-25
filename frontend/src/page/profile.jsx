import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUser } from "../context/user";
import { useSelector } from "react-redux";
import api from "../lib/api";
import { toast } from "@/components/ui/toast";

function Profile() {
  let { user, setUser } = useUser();
  let todo = useSelector((state) => state.todo);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      bio: user?.bio || "",
    });
  }, [user]);

  let pendingTodo = todo.filter((task) => !task.completed).length;
  let completedTodo = todo.filter((task) => task.completed).length;

  async function updateProfile(event) {
    event.preventDefault();

    try {
      setIsSaving(true);
      const response = await api.patch("/user", formData);

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Unable to update profile");
      }

      const payload = response.data;
      const updatedUser =
        payload?.data?.user || payload?.data?.data || payload?.data;

      setUser(updatedUser || { ...user, ...formData });
      toast.add({
        type: "success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Unable to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-1">
          <div className=" rounded-xl bg-gray-700 p-4 border border-gray-600 flex flex-col  items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden flex justify-center items-center bg-cyan-950">
              <img
                src={
                  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
                }
                className="h-full w-full rounded-full object-cover   "
              />
            </div>

            <h3 className="text-white font-bold italic text-lg">{user.name}</h3>

            <div className="w-full flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <div className=" text-center p-2 rounded-xl border shadow shadow-cyan-600 border-gray-500">
                <h3 className="text-white  text-sm">Total todo</h3>
                <p className="text-gray-400 text-sm">{todo.length}</p>
              </div>

              <div className=" text-center p-2 rounded-xl border shadow shadow-cyan-600 border-gray-500">
                <h3 className="text-white  text-sm">Completed</h3>
                <p className="text-gray-400 text-sm">{completedTodo}</p>
              </div>

              <div className=" text-center p-2 rounded-xl border shadow shadow-cyan-600  border-gray-500">
                <h3 className="text-white  text-sm">Pending</h3>
                <p className="text-gray-400 text-sm">{pendingTodo}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl  bg-gray-700 p-4  border border-gray-600">
            <form onSubmit={updateProfile}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-gray-200 " htmlFor="username">
                    Name
                  </label>
                  <br></br>
                  <input
                    id="username"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                    className="flex-1  w-full mb-6 mt-2 rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-gray-100 outline-none placeholder:text-gray-500 focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-gray-200 " htmlFor="email">
                    Email
                  </label>
                  <br></br>
                  <input
                    id="email"
                    value={user.email}
                    className="flex-1  w-full mb-6 mt-2 rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-gray-100 outline-none placeholder:text-gray-500 focus:border-gray-600"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-200 " htmlFor="bio">
                  Bio
                </label>
                <br></br>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(event) =>
                    setFormData({ ...formData, bio: event.target.value })
                  }
                  className="flex-1  w-full mb-6 mt-2 rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-gray-100 outline-none placeholder:text-gray-500 focus:border-gray-600"
                />
              </div>

              <div className="flex items-end justify-end gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
