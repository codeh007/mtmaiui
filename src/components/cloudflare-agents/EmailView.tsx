import { useAgentChat } from "agents/ai-react";
import { useAgent } from "agents/react";
import type { Email as PostalEmail } from "postal-mime";
import { useEffect, useState } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface EmailProps {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

export default function Email({ addToast }: EmailProps) {
  const agent = useAgent({
    agent: "email-agent",
  });
  const { messages, input, handleInputChange, handleSubmit, clearHistory } = useAgentChat({
    agent,
  });

  const [emails, setEmails] = useState<PostalEmail[]>([
    {
      messageId: "1",
      subject: "Welcome to the Email Agent",
      text: "Hello! This is your first email from the agent. You can reply to this email when chat is disconnected.",
      from: {
        name: "Agent",
        address: "agent@example.com",
      },
      headers: [],
      attachments: [],
      date: new Date().toISOString(),
    },
  ]);

  const mailboxAgent = useAgent({
    agent: "mock-email-service",
    onMessage(evt) {
      const msg = JSON.parse(evt.data);
      if (msg.type === "inbox:all") {
        setEmails(msg.messages);
      } else if (msg.type === "inbox:new-message") {
        const email = msg.message;
        setEmails((prev) => [...prev, email]);
      }
    },
  });

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isChatDisabled, setIsChatDisabled] = useState(false);

  useEffect(() => {
    if (isChatDisabled) {
      addToast("Chat is disabled. You can use email instead.", "info");
    }
  }, [isChatDisabled, addToast]);

  const sendChatMessage = (e: React.FormEvent) => {
    handleSubmit(e);
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    const newEmail: PostalEmail = {
      messageId: crypto.randomUUID(),
      subject: emailSubject,
      text: emailBody,
      from: {
        name: "User",
        address: "user",
      },
      headers: [],
      attachments: [],
      date: new Date().toISOString(),
    };

    setEmails((prev) => [...prev, newEmail]);
    mailboxAgent.send(
      JSON.stringify({
        type: "send-email",
        to: "theman@example.com",
        subject: emailSubject,
        text: emailBody,
      }),
    );
    setEmailSubject("");
    setEmailBody("");
    addToast("Email sent successfully", "success");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearChatMessages = () => {
    clearHistory();
    addToast("Chat history cleared", "info");
  };

  const clearEmails = () => {
    setEmails([]);
    mailboxAgent.send(
      JSON.stringify({
        type: "clear-emails",
      }),
    );
    addToast("Email history cleared", "info");
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-5">
        {/* Left side - Chat Window */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
            <h3 className="text-base font-semibold m-0">Chat Window</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearChatMessages}
                className="bg-gray-100 text-gray-600 border-none rounded px-2 py-1 text-xs cursor-pointer hover:bg-gray-200 hover:text-gray-800 transition-all"
                title="Clear chat history"
              >
                Clear
              </button>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer text-sm">
                  <span className="mr-2">Disabled</span>
                  <input
                    type="checkbox"
                    checked={isChatDisabled}
                    onChange={() => setIsChatDisabled(!isChatDisabled)}
                    className="hidden"
                  />
                  <span
                    className={`relative inline-block w-10 h-5 rounded-full transition-colors ${isChatDisabled ? "bg-red-500" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isChatDisabled ? "translate-x-5" : ""}`}
                    />
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-3 flex flex-col gap-2.5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2.5 rounded-lg max-w-[80%] break-words ${
                  message.role === "assistant"
                    ? "self-start bg-gray-200"
                    : "self-end bg-blue-500 text-white"
                }`}
              >
                <div>{message.content}</div>
                <div className="text-xs opacity-75">
                  {formatTime(new Date(message.createdAt as unknown as string))}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendChatMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={isChatDisabled ? "Chat is disabled" : "Type a message..."}
              disabled={isChatDisabled}
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isChatDisabled || !input.trim()}
              className="px-4 py-2.5 bg-blue-500 text-white border-none rounded-md cursor-pointer font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        {/* Right side - Email Chain */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
            <h3 className="text-base font-semibold m-0">Email Chain</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearEmails}
                className="bg-gray-100 text-gray-600 border-none rounded px-2 py-1 text-xs cursor-pointer hover:bg-gray-200 hover:text-gray-800 transition-all"
                title="Clear email history"
              >
                Clear
              </button>
              <div className="text-xs text-gray-600">
                {isChatDisabled
                  ? "Chat is disabled. Use email instead."
                  : "Available when chat is disconnected"}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-3 flex flex-col gap-2.5">
            {emails.map((email, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg mb-2.5 ${
                  email.from?.address === "agent"
                    ? "bg-gray-100 border-l-4 border-blue-500"
                    : "bg-gray-50 border-l-4 border-green-500"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <div className="font-semibold">{email.subject}</div>
                  <div className="text-xs text-gray-600">{email.date}</div>
                </div>
                <div className="text-sm whitespace-pre-wrap">{email.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={sendEmail} className="flex flex-col gap-2">
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject..."
              className="px-3 py-2.5 border border-gray-200 rounded-md text-sm"
            />
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Email body..."
              className="min-h-[100px] resize-y px-3 py-2.5 border border-gray-200 rounded-md text-sm"
            />
            <button
              type="submit"
              disabled={!emailSubject.trim() || !emailBody.trim()}
              className="send-button"
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
