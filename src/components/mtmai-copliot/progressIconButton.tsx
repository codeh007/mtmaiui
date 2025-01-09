import { Button } from "mtxuilib/ui/button";

export default function CircularProgressIconButton({
  progress,
  children,
  ...iconButtonProps
}) {
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <Button {...iconButtonProps}>{children}</Button>
      {progress < 100 && (
        <div className="absolute top-0 left-0 w-[30px] h-[30px] pointer-events-none">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
            />
            <circle
              className="text-blue-600 transition-all duration-300 ease-in-out"
              strokeWidth="8"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progress) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
