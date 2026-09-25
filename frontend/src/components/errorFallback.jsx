function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen  bg-gray-950 flex justify-center items-center flex-col">
      <h2 className="text-red-500 font-bold mb-3 text-xl ">Error</h2>
      <p className="text-gray-400 mb-3">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-xl px-3 py-2 bg-gray-500 cursor-pointer mt-5"
      >
        Try again
      </button>
    </div>
  );
}

export default ErrorFallback;
