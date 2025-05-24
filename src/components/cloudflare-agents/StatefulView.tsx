import { useAgent } from "agents/react";
import { useState } from "react";

interface StateProps {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

interface State {
  counter: number;
  text: string;
  color: string;
  initialState: boolean;
}

export function Stateful({ addToast }: StateProps) {
  const [syncedState, setSyncedState] = useState<State>({
    counter: 0,
    text: "",
    color: "#3B82F6",
    initialState: true, // this gets wiped out by the server message
  });

  const agent = useAgent<State>({
    agent: "stateful",
    onStateUpdate: (state, source: "server" | "client") => {
      setSyncedState(state);
    },
  });

  const handleIncrement = () => {
    const newCounter = syncedState.counter + 1;
    agent.setState({ ...syncedState, counter: newCounter });
  };

  const handleDecrement = () => {
    const newCounter = syncedState.counter - 1;
    agent.setState({ ...syncedState, counter: newCounter });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    agent.setState({ ...syncedState, text: newText });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSyncedState((state) => ({ ...state, color: newColor }));
    agent.setState({ ...syncedState, color: newColor });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {!syncedState.initialState && (
          <>
            <div className="bg-gray-50 rounded-lg p-3 transition-transform duration-200 hover:-translate-y-0.5 min-w-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Counter</h3>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded bg-red-500 text-white text-base transition-all duration-200 hover:bg-red-600 flex-shrink-0"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-800 min-w-[3ch] text-center">
                  {syncedState.counter}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded bg-green-500 text-white text-base transition-all duration-200 hover:bg-green-600 flex-shrink-0"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 transition-transform duration-200 hover:-translate-y-0.5 min-w-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Text Input</h3>
              <input
                type="text"
                value={syncedState.text}
                onChange={handleTextChange}
                className="w-full box-border p-2 border-2 border-gray-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                placeholder="Type to sync..."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-3 transition-transform duration-200 hover:-translate-y-0.5 min-w-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Picker</h3>
              <div className="flex flex-col items-center relative w-12 h-12 mx-auto my-2">
                <input
                  type="color"
                  value={syncedState.color}
                  onChange={handleColorChange}
                  className="absolute inset-0 w-12 h-12 p-0 border-none rounded-lg cursor-pointer opacity-0 z-10"
                />
                <div
                  className="absolute inset-0 w-12 h-12 rounded-lg shadow-sm transition-all duration-200 border-2 border-gray-200"
                  style={{ backgroundColor: syncedState.color }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="text-center text-xs text-gray-500 mt-4">
        Open multiple windows to test state synchronization
      </div>
    </div>
  );
}
