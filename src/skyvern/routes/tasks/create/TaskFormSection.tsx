import { cn } from "mtxuilib/lib/utils";

type Props = {
  index: number;
  title: string;
  active: boolean;
  hasError?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
};

export function TaskFormSection({
  index,
  title,
  active,
  onClick,
  children,
  hasError,
}: Props) {
  return (
    <section className="space-y-8 rounded-lg bg-slate-elevation3 px-6 py-5">
      <header className="flex h-7 gap-4">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className="flex h-7 cursor-pointer gap-4"
          // biome-ignore lint/complexity/useOptionalChain: <explanation>
          onClick={() => onClick && onClick()}
        >
          <div
            className={cn(
              "flex w-7 items-center justify-center rounded-full border border-slate-400, hover:bg-slate-400 hover:text-slate-950",
              {
                "border-destructive": !active && hasError,
                "bg-slate-400 text-slate-950": active,
              },
            )}
          >
            <span className={""}>{String(index)}</span>
          </div>
          <span
            className={cn("text-lg", {
              "text-destructive": !active && hasError,
            })}
          >
            {title}
          </span>
        </div>
      </header>
      {children}
    </section>
  );
}
