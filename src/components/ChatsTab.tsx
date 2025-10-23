import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axiosClient from "@/utils/axiosClient";

interface ChatRoom {
  id: number;
  name: string;
}

interface ChatsTabProps {
  role: "user" | "astrologer";
  id: number;
}

export const ChatsTab: React.FC<ChatsTabProps> = ({ role, id }) => {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        console.log(id);
        
        setLoading(true);
        const endpoint =
          role === "user"
            ? `/api/v1/chat/createroom/user/${id}`
            : `/api/v1/chat/createroom/astrologer/${id}`;

        const res = await axiosClient.get(endpoint);
        console.log(res.data);
        
        setChats(res.data);
      } catch (error) {
        console.log("Failed to fetch chat rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [role, id]);

  if (loading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Chats...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );

  return (
  <Card className="overflow-hidden rounded-xl shadow">
    <CardHeader className="bg-muted/50">
      <CardTitle className="text-lg font-semibold">Your Chats</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {chats.length === 0 ? (
        <p className="text-muted-foreground italic text-center py-6">
          No active chats yet.
        </p>
      ) : (
        <ul className="divide-y divide-muted/20">
          {chats.map((chat) => {
            const participantName = chat.name;

            return (
              <li
                key={chat.id}
                // TODO
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="flex items-center gap-4 py-3 px-4 hover:bg-muted/20 cursor-pointer transition"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {participantName.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{participantName}</p>
                </div>

                {/* Chevron */}
                <div className="text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </CardContent>
  </Card>
);


};
