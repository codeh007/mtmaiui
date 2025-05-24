"use client";
import { Settings } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "mtxuilib/ui/tooltip";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export const Dash5Aside = () => {
  const segments = useSelectedLayoutSegments();
  const resModName = segments.slice(1).at(0);
  return (
    <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        {/* <Link
					href={`${data.basePath}`}
					className="bg-primary text-primary-foreground group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
				>
					<Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
					<span className="sr-only">Acme Inc</span>
				</Link> */}
        {/* {data.menus.map((item, i) => {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Tooltip key={i}>
							<TooltipTrigger asChild>
								<Link
									href={`${data.basePath}/${item.url}`}
									className={cn(
										"text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8",
										resModName === item.url && "bg-red-200",
									)}
								>
									<IconX name={item.icon || ""} className="h-5 w-5" />
									<span className="sr-only">{item.label}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">{item.label}</TooltipContent>
						</Tooltip>
					);
				})} */}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};
