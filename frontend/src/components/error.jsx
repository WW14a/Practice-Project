import React from "react";

function ErrorPage({ error }) {
  return (
    <div className="min-h-screen  bg-gray-950 flex justify-center items-center flex-col">
      <h2 className="text-red-500 font-bold mb-3 text-xl ">
        Something went wrong!
      </h2>
      <button className="rounded-xl px-3 py-2 bg-gray-500 cursor-pointer">
        Try again
      </button>
    </div>
  );
}

export default ErrorPage;
