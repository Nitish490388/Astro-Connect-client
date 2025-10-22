import { useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderRole: string;
  createdAt: string;
}

interface UseChatSocketProps {
  roomId: number;
  userId: number;
  role: "USER" | "ASTROLOGER";
  onMessage: (msg: Message) => void;
  onHistory: (msgs: Message[]) => void;
}

export const useChatSocket = ({
  roomId,
  userId,
  role,
  onMessage,
  onHistory,
}: UseChatSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000`); // 👈 update for prod domain

    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket server");
      console.log(userId, role);

      ws.send(
        JSON.stringify({
          type: "JOIN",
          payload: { userId, role, roomId },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "PREVIOUS_MESSAGES":
          onHistory(data.payload);
          break;
        case "NEW_MESSAGE":
          onMessage(data.payload);
          break;
        default:
          console.log("⚠️ Unknown message type", data);
      }
    };

    ws.onerror = (err) => console.error("❌ WS Error:", err);
    ws.onclose = () => console.log("🔒 WebSocket disconnected");

    return () => {
      ws.close();
    };
  }, [roomId, userId, role]);

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "MESSAGE",
          payload: { userId, role, roomId, content },
        })
      );
    } else {
      console.warn("⚠️ WebSocket not ready");
    }
  };

  return { sendMessage };
};
