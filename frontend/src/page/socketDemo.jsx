import Input from "@/components/input";
import { useEffect, useState } from "react";
import { TbPlugConnected } from "react-icons/tb";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  path: "/sck",
});
function SocketDemo() {
  const [result, setResult] = useState([]);
  let [inputValue, setInputValue] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("message", (data) => {
      console.log("Received message from server:", data);
      setResult((prev) => [...prev, data]);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, []);

  let sendData = () => {
    socket.emit("message", { data: inputValue });
  };

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-cyan-400">
            <TbPlugConnected size={28} />
            <span className="text-sm font-medium uppercase tracking-wider">
              Socket UI
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Server result</h1>
          <p className="mt-2 max-w-xl text-gray-400">
            Connect your socket event to the button and display the response in
            the result panel below.
          </p>
        </div>

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter data to send..."
                type={"text"}
              />
            </div>

            <button
              type="button"
              onClick={sendData}
              className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-3 font-medium text-gray-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              send data to server
            </button>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">Result</h2>
              <span className="text-xs uppercase tracking-wider text-gray-500">
                socket response
              </span>
            </div>

            <div className="min-h-40 rounded-lg border border-dashed border-gray-700 bg-gray-950 p-4">
              {result ? (
                <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-cyan-300">
                  {result.map((item, index) => (
                    <div key={index}>{JSON.stringify(item, null, 2)}</div>
                  ))}
                </pre>
              ) : (
                <div className="flex min-h-32 items-center justify-center text-center text-sm text-gray-500">
                  Waiting for a socket response...
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SocketDemo;
