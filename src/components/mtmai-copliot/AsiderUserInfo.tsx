"use client";

export const AsiderUserInfo = ({
  isCollapsed,
}: {
  isCollapsed?: boolean;
}) => {
  // const userQuery = useUserInfo();
  return (
    <>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            // variant="ghost"
            className={cn(
              "inline-flex items-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 py-2 h-8 shrink-0 justify-start gap-2 overflow-hidden px-2.5 text-sm font-normal hover:bg-primary/20 hover:text-primary dark:hover:bg-accent dark:hover:text-foreground",
              // isActive && "bg-slate-200",
              "min-h-12",
            )}
          >
            {/* <Avatar className="p-0 m-0 flex items-center justify-center h-5 w-5">
							<AvatarImage
								className="cursor-pointer hover:shadow-inner hover:ring-1 p-0 m-0 flex items-center justify-center"
								src={"/api/v1/users/avatar"}
								alt={`@${userQuery.data?.email}`}
							/>
							<AvatarFallback>
								<Icons.user className="w-5 h-5" />
							</AvatarFallback>
						</Avatar>
						<span className={cn(isCollapsed && "sr-only")}>
							{userQuery.data?.email}
						</span> */}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {/* {userQuery.data?.email} */}
          {/* {link.label && (
										<span className="ml-auto text-muted-foreground">
											{link.label}
										</span>
									)} */}
        </TooltipContent>
      </Tooltip>
    </>
  );
};
