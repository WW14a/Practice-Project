import { useEffect, useState } from "react";
import api, { clearTokens } from "../lib/api";
import Loading from "@/components/loading";
import { toast } from "@/components/ui/toast";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);

        const response = await api.get("/user/me");

        const profile =
          response.data?.data?.data || response.data?.data || response.data;

        setData(profile);
      } catch (error) {
        toast.add({
          type: "error",
          description:
            error.response?.data?.message || "Unable to load your profile.",
        });
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function updateProfile(event) {
    event.preventDefault();

    try {
      setIsSaving(true);

      const response = await api.patch("/user", {
        name: data.name,
        bio: data.bio,
      });

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Unable to update profile");
      }

      const updatedUser =
        response.data?.data?.user ||
        response.data?.data?.data ||
        response.data?.data;

      setData((prev) => ({
        ...prev,
        ...(updatedUser || {}),
      }));

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

  async function logoutAllSessions() {
    try {
      setIsLoggingOut(true);

      const response = await api.post("/auth/logoutall");

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Unable to log out sessions");
      }

      clearTokens();

      navigate("/auth/login");
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Unable to log out all sessions.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  function formatDate(value) {
    if (!value) return "Unknown";

    return new Date(value).toLocaleString();
  }

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-center text-white">
        Unable to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div>
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-600 bg-gray-700 p-4">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-cyan-950">
                <img
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=500&q=60"
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <h3 className="text-lg font-bold italic text-white">
                {data.name}
              </h3>

              <p className="text-sm text-gray-400">{data.email}</p>

              <div className="flex w-full flex-wrap justify-center gap-2 sm:gap-3">
                <div className="rounded-xl border border-gray-500 p-2 text-center shadow shadow-cyan-600">
                  <h3 className="text-sm text-white">Total todo</h3>

                  <p className="text-sm text-gray-400">{data.todoCount || 0}</p>
                </div>

                <div className="rounded-xl border border-gray-500 p-2 text-center shadow shadow-cyan-600">
                  <h3 className="text-sm text-white">Completed</h3>

                  <p className="text-sm text-gray-400">
                    {data.completedTodo || 0}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-500 p-2 text-center shadow shadow-cyan-600">
                  <h3 className="text-sm text-white">Pending</h3>

                  <p className="text-sm text-gray-400">
                    {(data.todoCount || 0) - (data.completedTodo || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-xl border border-gray-600 bg-gray-700 p-4">
              <form onSubmit={updateProfile}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
                  <div>
                    <label htmlFor="name" className="text-gray-200">
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      value={data.name || ""}
                      onChange={handleChange}
                      className="mt-2 mb-6 w-full rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-gray-100 outline-none placeholder:text-gray-500 focus:border-gray-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-gray-200">
                      Email
                    </label>

                    <input
                      id="email"
                      value={data.email || ""}
                      readOnly
                      className="mt-2 mb-6 w-full rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-gray-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="text-gray-200">
                    Bio
                  </label>

                  <textarea
                    id="bio"
                    name="bio"
                    value={data.bio || ""}
                    onChange={handleChange}
                    rows={4}
                    className="mt-2 mb-6 w-full rounded-lg border border-gray-800 bg-gray-800 px-4 py-3 text-gray-100 outline-none placeholder:text-gray-500 focus:border-gray-600"
                  />
                </div>

                <div className="flex justify-end">
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

        <div className="mt-6 rounded-xl border border-gray-600 bg-gray-700 p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Active sessions
              </h2>

              <p className="text-sm text-gray-400">
                Devices currently signed in to your account.
              </p>
            </div>

            <button
              type="button"
              onClick={logoutAllSessions}
              disabled={isLoggingOut || !data.sessions?.length}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Log out all sessions"}
            </button>
          </div>

          {!data.sessions?.length ? (
            <p className="text-sm text-gray-400">No active sessions found.</p>
          ) : (
            <div className="space-y-3">
              {data.sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-lg border border-gray-600 bg-gray-800 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-medium text-white">
                        {session.deviceName || "Unknown device"}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-400">
                      Expires {formatDate(session.expiresAt)}
                    </p>
                  </div>

                  <dl className="mt-3 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
                    <div>
                      <dt className="text-gray-500">IP address</dt>

                      <dd>{session.ipAddress || "Unknown"}</dd>
                    </div>

                    <div>
                      <dt className="text-gray-500">User agent</dt>

                      <dd className="break-words">
                        {session.userAgent || "Unknown"}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
