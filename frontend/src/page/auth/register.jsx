import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../../components/loading";
import ErrorPage from "../../components/error";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/components/ui/toast";

function Register() {
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let [error, setError] = useState("");
  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let formSubmit = async (data) => {
    try {
      setLoading(true);
      const Backend_URL = import.meta.env.VITE_BACKEND_URL;
      console.log("Backend_URL:", Backend_URL);
      const res = await axios.post(`${Backend_URL}/auth/register`, {
        name: data.firstName + " " + data.lastName,
        email: data.email,
        password: data.password,
      });

      toast.add({ type: "success", description: res.data.message });
      if (res.status === 201) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data.message);
      toast.add({
        type: "error",
        description:
          error.response?.data.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col justify-center items-center font-sans ">
      <div className="mx-4 w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 px-4 py-6 shadow shadow-gray-600 sm:mx-0">
        <h2 className=" text-white font-bold mb-2">Register </h2>
        <p className="text-sm text-gray-200 ">
          Enter your information below to register your account
        </p>
        <form className="my-2 mt-10" onSubmit={handleSubmit(formSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="w-full">
              <label className="text-gray-100 text-sm" htmlFor="firstName">
                First name
              </label>
              <input
                className="mt-2 border text-sm text-gray-100 border-gray-700 w-full focus:outline-none focus:border-blue-300 focus:border-2 mb-2 rounded-xl p-2"
                id="firstName"
                type="text"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-gray-400 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="text-gray-100 text-sm" htmlFor="lastName">
                Last name
              </label>
              <input
                className="mt-2 border text-sm text-gray-100 border-gray-700 w-full focus:outline-none focus:border-blue-300 focus:border-2 mb-2 rounded-xl p-2"
                id="lastName"
                type="text"
                {...register("lastName", {
                  required: "Last name is required",
                })}
              />
              {errors.lastName && (
                <p className="text-gray-400 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full mt-4">
            <label className="text-gray-100 text-sm" htmlFor="email">
              Email
            </label>
            <input
              className="mt-2 border text-sm text-gray-100 border-gray-700 w-full focus:outline-none focus:border-blue-300 focus:border-2 mb-2 rounded-xl p-2"
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-gray-400 text-xs">{errors.email.message}</p>
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
              Register
            </button>
          </div>
          <p className="text-gray-400 text-center pt-4 text-xs ml-2">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-300 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
