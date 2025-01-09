import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "mtxuilib/ui/tooltip";

type Props = {
  content: string;
};

export function HelpTooltip({ content }: Props) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <QuestionMarkCircledIcon className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[250px]">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
