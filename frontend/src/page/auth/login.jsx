import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../../components/loading";
import ErrorPage from "../../components/error";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/user";
import { login, saveTokens } from "../../lib/api";
import { toast } from "@/components/ui/toast";

function Login() {
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let [error, setError] = useState("");
  let { setUser } = useUser();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/dashboard";

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let formSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await login({
        email: data.email,
        password: data.password,
      });

      if (response.data?.success === false) {
        toast.add({
          type: "error",
          description: response.data.message || "Invalid email or password",
        });
        return;
      }

      saveTokens(response.data);
      setUser(response.data.data.data);
      toast.add({
        type: "success",
        description: "You have successfully logged in.",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error.response?.data?.message ||
          error.response?.data?.data?.message ||
          error.message ||
          "Unable to login",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading></Loading>;
  }
  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col justify-center items-center font-sans ">
      <div className="mx-4 w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 px-4 py-6 shadow shadow-gray-600 sm:mx-0">
        <h2 className=" text-white font-bold mb-2">Login </h2>
        <p className="text-sm text-gray-200 ">
          Enter your email below to login your account
        </p>
        <form className="my-2 mt-10" onSubmit={handleSubmit(formSubmit)}>
          <div className="space-y-8 w-full">
            <label className="text-gray-100 text-sm" htmlFor={"email"}>
              Email
            </label>
            <br></br>
            <input
              className="mt-2 border text-sm text-gray-100 border-gray-700 w-full focus:outline-none focus:border-blue-300 focus:border-2  mb-2 rounded-xl p-2"
              name="email"
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors && (
              <p className="text-gray-400 text-xs">{errors.email?.message}</p>
            )}
          </div>

          <div className="space-y-8 w-full mt-4">
            <label className="text-gray-100 text-sm" htmlFor={"password"}>
              Password
            </label>
            <br></br>
            <input
              className="mt-2 border text-sm text-gray-100 border-gray-700 w-full focus:outline-none focus:border-blue-300 focus:border-2  mb-2 rounded-xl p-2"
              name="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 7,
                  message: "Password must be 7 character long",
                },
              })}
            />
            {errors.password && (
              <p className="text-gray-400 text-xs">
                {errors.password?.message}
              </p>
            )}
          </div>

          <div className="flex justify-center items-center mt-10">
            <button
              className="bg-gray-600 text-gray-200 rounded cursor-pointer px-4 py-2"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
