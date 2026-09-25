import React from "react";

function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 w-full flex justify-center items-center">
      <div className="h-14 w-14 bg-transparent border-gray-200 border-4 rounded-full animate-spin  border-r-blue-500 "></div>
    </div>
  );
}

export default Loading;
