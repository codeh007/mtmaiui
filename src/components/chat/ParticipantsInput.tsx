import type { AssistantAgent } from "mtmaiapi";
import { DebugValue } from "mtxuilib/components/devtools/DebugValue";
import { useFormContext } from "react-hook-form";

interface ParticipantsInputProps {
  participants: AssistantAgent[];
  onChange: (participants: AssistantAgent[]) => void;
}
export const ParticipantsInput = ({
  participants,
  onChange,
}: ParticipantsInputProps) => {
  const form = useFormContext();
  return (
    <>
      <h1>ParticipantsFields</h1>
      <DebugValue data={participants} />
    </>
  );
};
