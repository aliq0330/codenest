import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Check, CheckCheck } from "lucide-react";
import { Avatar } from "@/components/ui";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantUsername: string;
  online: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

const ME = "me";

const CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    participantId: "user1",
    participantName: "Sarah Kim",
    participantUsername: "sarahkim",
    online: true,
    lastMessage: "That useCallback example you shared was super helpful!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        senderId: ME,
        text: "Hey Sarah! Did you get a chance to look at that React patterns repo I shared?",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
      },
      {
        id: "m2",
        senderId: "user1",
        text: "Yes! It's really well organized. I especially liked the section on compound components.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(),
        read: true,
      },
      {
        id: "m3",
        senderId: ME,
        text: "Thanks! I spent a lot of time on that part. The render props pattern is tricky to explain without good examples.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
        read: true,
      },
      {
        id: "m4",
        senderId: "user1",
        text: "Totally agree. I always mix up when to use render props vs hooks. Do you have any examples of that?",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        read: true,
      },
      {
        id: "m5",
        senderId: ME,
        text: "I'll put together a quick snippet showing both approaches side by side. Give me a few minutes.",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        read: true,
      },
      {
        id: "m6",
        senderId: "user1",
        text: "That useCallback example you shared was super helpful!",
        createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        read: false,
      },
    ],
  },
  {
    id: "conv2",
    participantId: "user2",
    participantName: "Marcus Webb",
    participantUsername: "marcuswebb",
    online: false,
    lastMessage: "Merged the PR. Great work on the animation system.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unreadCount: 0,
    messages: [],
  },
  {
    id: "conv3",
    participantId: "user3",
    participantName: "Priya Nair",
    participantUsername: "priyanair",
    online: true,
    lastMessage: "Can you review my Zustand store setup?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    unreadCount: 1,
    messages: [],
  },
  {
    id: "conv4",
    participantId: "user4",
    participantName: "Tom Erikson",
    participantUsername: "tomerikson",
    online: false,
    lastMessage: "Ship it 🚀",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unreadCount: 0,
    messages: [],
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] ring-1 ring-[#2e2e2e]">
        <span className="text-xs text-[#6b6b6b]">S</span>
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#1a1a1a] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#6b6b6b] animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn("flex items-end gap-2 px-4 py-1", isOwn && "flex-row-reverse")}>
      {!isOwn && (
        <Avatar
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=sarah`}
          alt="S"
          size="xs"
          className="mb-0.5"
        />
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isOwn
            ? "rounded-br-sm bg-[#f5f5f5] text-[#0a0a0a]"
            : "rounded-bl-sm bg-[#1a1a1a] text-[#f5f5f5]"
        )}
      >
        {message.text}
      </div>
      {isOwn && (
        <span className="mb-0.5 text-[#3d3d3d]">
          {message.read ? (
            <CheckCheck className="h-3 w-3 text-blue-400" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </span>
      )}
    </div>
  );
}

function ConversationView({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [showTyping, setShowTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const msg: Message = {
      id: Date.now().toString(),
      senderId: ME,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          senderId: conversation.participantId,
          text: "Thanks for the message! I'll get back to you shortly.",
          createdAt: new Date().toISOString(),
          read: false,
        },
      ]);
    }, 1800);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#2e2e2e] px-4 py-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b6b] transition-colors hover:bg-[#1a1a1a] hover:text-[#f5f5f5] md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Avatar
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.participantUsername}`}
          alt={conversation.participantName}
          size="sm"
          online={conversation.online}
        />
        <div>
          <p className="text-sm font-semibold text-[#f5f5f5]">
            {conversation.participantName}
          </p>
          <p className="text-xs text-[#6b6b6b]">
            {conversation.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-0.5 min-h-0">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-[#3d3d3d]">No messages yet. Say hi!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === ME}
              />
            ))}
            {showTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-[#2e2e2e] px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#2e2e2e] bg-[#1a1a1a] px-3 py-2 focus-within:border-[#6b6b6b] transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-[#f5f5f5] placeholder:text-[#3d3d3d] focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5] text-[#0a0a0a] transition-opacity disabled:opacity-30 hover:bg-white"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111111] border border-[#2e2e2e]">
        <Send className="h-7 w-7 text-[#3d3d3d]" />
      </div>
      <p className="text-sm text-[#6b6b6b]">Select a conversation</p>
    </div>
  );
}

export function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  function selectConversation(id: string) {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  }

  return (
    <div className="flex h-[calc(100vh-56px)] bg-[#0a0a0a]">
      {/* Left panel — conversation list */}
      <div
        className={cn(
          "w-full flex-shrink-0 border-r border-[#2e2e2e] bg-[#0a0a0a] flex flex-col md:w-80",
          selected && "hidden md:flex"
        )}
      >
        <div className="border-b border-[#2e2e2e] px-4 py-3">
          <h1 className="text-base font-semibold text-[#f5f5f5]">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#111111]",
                selectedId === conv.id && "bg-[#111111]"
              )}
            >
              <Avatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.participantUsername}`}
                alt={conv.participantName}
                size="md"
                online={conv.online}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-[#f5f5f5]">
                    {conv.participantName}
                  </p>
                  <span className="shrink-0 text-xs text-[#3d3d3d]">
                    {formatRelativeTime(conv.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="truncate text-xs text-[#6b6b6b]">
                    {conv.lastMessage}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="flex h-4.5 min-w-[18px] shrink-0 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-semibold text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel — conversation view */}
      <div
        className={cn(
          "flex-1 min-w-0",
          !selected && "hidden md:flex md:items-center md:justify-center"
        )}
      >
        {selected ? (
          <ConversationView
            key={selected.id}
            conversation={selected}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
