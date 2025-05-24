import Markdown from "react-markdown";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export const MarkdownView = ({
  content,
  className = "",
}: MarkdownViewProps) => {
  return (
    <div className={`text-sm w-full text-primary rounded   ${className}`}>
      <Markdown>{content}</Markdown>
    </div>
  );
};
