import {
  Baby,
  GraduationCap,
  PersonStanding,
  School,
  Swords,
} from "lucide-react";
import type { CanvasGraphParams } from "mtmaiapi";
import { TooltipIconButton } from "mtxuilib/mt/tooltip-icon-button";
import type { ReadingLevelOptions as ReadingLevelOptionsType } from "mtxuilib/types";

export interface ReadingLevelOptionsProps {
  streamMessage: (params: CanvasGraphParams) => Promise<void>;
  handleClose: () => void;
}

export function ReadingLevelOptions(props: ReadingLevelOptionsProps) {
  const { streamMessage } = props;

  const handleSubmit = async (readingLevel: ReadingLevelOptionsType) => {
    props.handleClose();
    await streamMessage({
      readingLevel,
    });
  };

  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <TooltipIconButton
        tooltip="PhD"
        variant="ghost"
        className="transition-colors w-[36px] h-[36px]"
        delayDuration={400}
        onClick={async () => await handleSubmit("phd")}
      >
        <GraduationCap />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="College"
        variant="ghost"
        className="transition-colors w-[36px] h-[36px]"
        delayDuration={400}
        onClick={async () => await handleSubmit("college")}
      >
        <School />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="Teenager"
        variant="ghost"
        className="transition-colors w-[36px] h-[36px]"
        delayDuration={400}
        onClick={async () => await handleSubmit("teenager")}
      >
        <PersonStanding />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="Child"
        variant="ghost"
        className="transition-colors w-[36px] h-[36px]"
        delayDuration={400}
        onClick={async () => await handleSubmit("child")}
      >
        <Baby />
      </TooltipIconButton>
      <TooltipIconButton
        tooltip="Pirate"
        variant="ghost"
        className="transition-colors w-[36px] h-[36px]"
        delayDuration={400}
        onClick={async () => await handleSubmit("pirate")}
      >
        <Swords />
      </TooltipIconButton>
    </div>
  );
}
