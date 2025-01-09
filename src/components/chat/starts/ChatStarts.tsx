"use client";

import { exampleCases } from "../../../skyvern/routes/tasks/data/exampleCases";

export const ChatStarts = () => {
  const handleHumanInput = useWorkbrenchStore((x) => x.handleHumanInput);

  const handleClick = (example: (typeof exampleCases)[0]) => {
    // router.push(`${basePath}/create/${example.key}`);
    handleHumanInput(example.label);
  };
  return (
    <div className="flex flex-wrap justify-center gap-4 rounded-sm bg-slate-elevation1 p-4">
      {exampleCases.map((example) => {
        return (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={example.key}
            className="cursor-pointer whitespace-nowrap rounded-sm bg-slate-elevation3 px-4 py-3 hover:bg-slate-elevation5"
            onClick={() => {
              handleClick(example);
            }}
          >
            {example.label}
          </div>
        );
      })}
    </div>
  );
};
