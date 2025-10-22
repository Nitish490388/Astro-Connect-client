import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./messageBubble";
import { ChatInput } from "./chatInput";
import { useChatSocket } from "@/hook/useChatSocket";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderRole?: string;
  createdAt: string;
}

export function ChatWindow({
  appointmentId,
  currentUserId,
}: {
  appointmentId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  const roomId = Number(appointmentId);
  

  const { sendMessage } = useChatSocket({
    roomId,
    userId: Number(currentUserId),
    role: "USER",
    onMessage: (msg) => setMessages((prev) => [...prev, msg]),
    onHistory: (msgs) => setMessages(msgs),
  });

  // Scroll to bottom when new message arrives
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  const handleFileSelect = (file: File) => {
    sendMessage(`📎 Uploaded file: ${file.name}`);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto border rounded-2xl overflow-hidden">
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-background">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.content}
            isSender={Number(msg.senderId) === Number(currentUserId)} // ✅ true only for your own messages
            timestamp={new Date(msg.createdAt).toLocaleTimeString()}
          />
        ))}
      </div>
      <ChatInput onSend={handleSend} onFileSelect={handleFileSelect} />
    </div>
  );
}
