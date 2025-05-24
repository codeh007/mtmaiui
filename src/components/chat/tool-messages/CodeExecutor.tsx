export const CodeExecutorView = ({ msg }: { msg: any }) => {
  return (
    <div className="rounded-md bg-yellow-100 p-1 max-w-[400px] overflow-x-auto">
      <pre className="text-xs  p-1 whitespace-pre-wrap text-wrap">
        {msg.content}
      </pre>
    </div>
  );
};
