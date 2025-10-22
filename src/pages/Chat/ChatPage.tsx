// src/pages/Chat/ChatPage.tsx
import { useParams } from "react-router-dom"
import { ChatWindow } from "@/components/chatWindow"
import { useAppSelector } from "@/store/hooks";

export default function ChatPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>()

  const { user } = useAppSelector((state) => state.user);
  const currentUserId = String(user?.id);

  if (!appointmentId) return <p>Invalid chat session</p>

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <ChatWindow appointmentId={appointmentId} currentUserId={currentUserId} />
    </div>
  )
}
