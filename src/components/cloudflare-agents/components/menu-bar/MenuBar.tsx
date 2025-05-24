// import { useMenuNavigation } from "@/hooks/useMenuNavigation";
import { IconContext } from "@phosphor-icons/react";
import { cn } from "mtxuilib/lib/utils";
import { BetterTooltip } from "mtxuilib/ui/tooltip.jsx";
import { useRef } from "react";
import { useMenuNavigation } from "../../hooks/useMenuNavigation";
// import { Tooltip } from "../tooltip/Tooltip";

type MenuOptionProps = {
  icon: React.ReactNode;
  id?: number;
  isActive?: number | boolean | string | undefined;
  onClick: () => void;
  tooltip: string;
};

const MenuOption = ({ icon, id, isActive, onClick, tooltip }: MenuOptionProps) => (
  <BetterTooltip
    content={tooltip}
    id={id}
    className="first-of-type:*:first:rounded-l-lg last-of-type:*:first:rounded-r-lg"
  >
    <button
      type="button"
      className={cn(
        "text-ob-base-100 hover:text-ob-base-300 border-ob-border focus:inset-ring-focus focus-visible:border-ob-focus relative -ml-px flex h-full w-11 cursor-pointer items-center justify-center border transition-colors focus:z-10 focus:outline-none focus-visible:z-10 focus-visible:inset-ring-[0.5]",
        {
          "text-ob-base-300 bg-ob-base-200 focus-visible:border-ob-focus": isActive === id,
        },
      )}
      onClick={onClick}
    >
      <IconContext.Provider value={{ size: 18 }}>{icon}</IconContext.Provider>
    </button>
  </BetterTooltip>
);

type MenuBarProps = {
  className?: string;
  isActive: number | boolean | string | undefined;
  options: MenuOptionProps[];
  optionIds?: boolean;
};

export const MenuBar = ({
  className,
  isActive,
  options,
  optionIds = false, // if option needs an extra unique ID
}: MenuBarProps) => {
  const menuRef = useRef<HTMLElement | null>(null);

  useMenuNavigation({ menuRef, direction: "horizontal" });

  return (
    <nav
      className={cn("bg-ob-base-100 flex rounded-lg shadow-xs transition-colors", className)}
      ref={menuRef}
    >
      {options.map((option, index) => (
        <MenuOption
          // biome-ignore lint/suspicious/noArrayIndexKey: TODO
          key={index}
          {...option}
          isActive={isActive}
          id={optionIds ? option.id : index}
        />
      ))}
    </nav>
  );
};
