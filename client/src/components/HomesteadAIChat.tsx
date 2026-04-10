/*
 * HomesteadAIChat — Floating AI Chat Widget
 * Design: Rugged Americana Craft
 * A floating chat button that opens a full chat panel powered by Gemini AI
 */

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Leaf, Loader2, ShieldAlert } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Howdy! I'm your Homestead Hub AI Assistant — think of me as that neighbor who's been homesteading for 20 years and loves to share what works.\n\nI can help with general homesteading topics: butchering technique, gardening, animal husbandry, water systems, solar, hunting, barter, and more.\n\n**Important safety note:** I will not identify specific wild plants or mushrooms — misidentification can be fatal. For food preservation safety (canning times, pressure levels), I always defer to the USDA Complete Guide and Ball Blue Book. These are firm limits, not suggestions.\n\nWhat's on your mind?",
};

export default function HomesteadAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    },
    onError: (err) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I had trouble connecting just now. Try again in a moment — the homestead never sleeps but the internet sometimes does.",
        },
      ]);
    },
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatMutation.isPending]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || chatMutation.isPending) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    // Only send non-welcome messages to the API
    const apiMessages = updatedMessages.filter(
      (m) => m !== WELCOME_MESSAGE
    ) as { role: "user" | "assistant"; content: string }[];

    chatMutation.mutate({ messages: apiMessages });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          backgroundColor: isOpen ? "oklch(0.38 0.12 25)" : "oklch(0.22 0.06 145)",
          color: "oklch(0.96 0.025 85)",
          boxShadow: "0 4px 20px oklch(0.15 0.06 145 / 0.35)",
        }}
        aria-label={isOpen ? "Close AI Chat" : "Open AI Chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Ask the Homestead AI
            </span>
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-50 flex flex-col rounded-sm overflow-hidden shadow-2xl"
          style={{
            width: "min(420px, calc(100vw - 2rem))",
            height: "min(560px, calc(100vh - 120px))",
            backgroundColor: "oklch(0.98 0.01 85)",
            border: "1px solid oklch(0.78 0.04 75)",
            boxShadow: "0 8px 40px oklch(0.15 0.06 145 / 0.25)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ backgroundColor: "oklch(0.22 0.06 145)" }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-sm flex-shrink-0"
              style={{ backgroundColor: "oklch(0.68 0.12 65)" }}
            >
              <Leaf className="w-4 h-4" style={{ color: "oklch(0.15 0.05 145)" }} />
            </div>
            <div>
              <p
                className="font-bold text-sm leading-tight"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "oklch(0.96 0.025 85)",
                }}
              >
                Homestead AI Assistant
              </p>
              <p
                className="text-xs"
                style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                General guidance only · Not a substitute for expert advice
              </p>
            </div>
          </div>

          {/* Safety Disclaimer Banner */}
          <div
            className="flex-shrink-0 flex items-start gap-2 px-3 py-2 text-xs"
            style={{
              backgroundColor: "oklch(0.96 0.10 65 / 0.25)",
              borderBottom: "1px solid oklch(0.78 0.10 65 / 0.4)",
              color: "oklch(0.35 0.08 55)",
              fontFamily: "'Source Serif 4', Georgia, serif",
            }}
          >
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.55 0.14 55)" }} />
            <span>
              <strong>Safety limits:</strong> This AI will not identify wild plants or mushrooms, and will not provide specific canning safety parameters. For those topics, consult a local expert or the{" "}
              <a
                href="https://nchfp.uga.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "oklch(0.40 0.10 220)" }}
              >
                USDA Complete Guide
              </a>{" "}/ Ball Blue Book.
            </span>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ backgroundColor: "oklch(0.96 0.025 85)" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] px-3 py-2 rounded-sm text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          backgroundColor: "oklch(0.22 0.06 145)",
                          color: "oklch(0.96 0.025 85)",
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          borderRadius: "0.35rem 0.35rem 0 0.35rem",
                        }
                      : {
                          backgroundColor: "oklch(0.98 0.01 85)",
                          color: "oklch(0.18 0.06 145)",
                          fontFamily: "'Source Serif 4', Georgia, serif",
                          border: "1px solid oklch(0.82 0.03 75)",
                          borderRadius: "0.35rem 0.35rem 0.35rem 0",
                        }
                  }
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none" style={{ color: "oklch(0.18 0.06 145)" }}>
                      <Streamdown>{msg.content}</Streamdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm"
                  style={{
                    backgroundColor: "oklch(0.98 0.01 85)",
                    border: "1px solid oklch(0.82 0.03 75)",
                    color: "oklch(0.45 0.03 65)",
                    fontFamily: "'Source Serif 4', Georgia, serif",
                  }}
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 px-3 py-3 flex gap-2 items-end"
            style={{
              borderTop: "1px solid oklch(0.82 0.03 75)",
              backgroundColor: "oklch(0.98 0.01 85)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about homesteading..."
              rows={1}
              className="flex-1 resize-none rounded-sm px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: "oklch(0.93 0.02 85)",
                border: "1px solid oklch(0.78 0.04 75)",
                color: "oklch(0.18 0.06 145)",
                fontFamily: "'Source Serif 4', Georgia, serif",
                maxHeight: "80px",
                lineHeight: "1.5",
              }}
              disabled={chatMutation.isPending}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-sm transition-all hover:opacity-90 disabled:opacity-40"
              style={{
                backgroundColor: "oklch(0.22 0.06 145)",
                color: "oklch(0.68 0.12 65)",
              }}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
