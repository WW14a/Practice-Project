import { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../../components/loading";
import ErrorPage from "../../components/error";
import { useNavigate } from "react-router-dom";

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
      const res = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });
      if (res.status === 201) {
        navigate("/auth/login");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading></Loading>;
  }
  if (error) {
    return <ErrorPage error={error.message} />;
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

          <div className="space-y-8 w-full mt-3">
            <label className="text-gray-100 text-sm" htmlFor={"username"}>
              Username
            </label>
            <br></br>
            <input
              className="mt-2 border text-sm text-gray-100 border-gray-700 w-full focus:outline-none focus:border-blue-300 focus:border-2  mb-2 rounded-xl p-2"
              name="username"
              type="text"
              {...register("username", {
                required: "Username is required",
                minlength: {
                  value: 2,
                  message: "Username must be 2 character long",
                },
              })}
            />
            {errors && (
              <p className="text-gray-400 text-xs">
                {errors.username?.message}
              </p>
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
        </form>
      </div>
    </div>
  );
}

export default Register;
