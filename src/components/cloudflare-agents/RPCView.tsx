import { useAgent } from "agents/react";
import { useState } from "react";

export default function RPC({
  addToast,
}: {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}) {
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { call } = useAgent({ agent: "rpc" });

  const handleRegularCall = async () => {
    try {
      setLoading(true);
      const result = await call("test");
      addToast(`Regular RPC result: ${result}`, "success");
    } catch (error) {
      addToast(`Error: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStreamingCall = async () => {
    try {
      setLoading(true);
      setMessages([]);
      await call("testStreaming", [], {
        onChunk: (chunk: unknown) => {
          setMessages((prev) => [...prev, chunk as string]);
        },
      });
    } catch (error) {
      addToast(`Error: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleRegularCall}
            disabled={loading}
            className="flex-1 px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-sm border-none cursor-pointer inline-flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Loading spinner"
                >
                  <title>Loading spinner</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Regular RPC Call"
            )}
          </button>
          <button
            type="button"
            onClick={handleStreamingCall}
            disabled={loading}
            className="flex-1 px-6 py-3 font-medium rounded-lg transition-all duration-200 shadow-sm border-none cursor-pointer inline-flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Loading spinner"
                >
                  <title>Loading spinner</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Streaming...
              </span>
            ) : (
              "Start Streaming"
            )}
          </button>
        </div>

        {messages.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Streaming Messages</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {messages.map((message, messageId) => (
                <div
                  key={`message-${messageId}`}
                  className="p-4 transition-colors duration-150 border-b border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-label="Message icon"
                      >
                        <title>Message icon</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{message}</p>
                      <p className="text-xs text-gray-500 mt-1">Message #{messageId + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
