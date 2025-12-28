import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/store/hooks";
import axiosClient from "@/utils/axiosClient";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { AlertContentType } from "@/types/types";

interface AstrologerCardProps {
  id: number;
  name: string;
  expertise: string;
  pricePerMin: number;
  imageUrl: string;
  isApproved?: boolean;
}

export function AstrologerCard({
  id,
  name,
  expertise,
  pricePerMin,
  imageUrl,
  isApproved = false,
}: AstrologerCardProps) {
  const navigate = useNavigate();
  // const { user } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  // const handleChatClick = async (astroId: number) => {
  //   try {
  //     // setLoading(true);
  //     // const userId = user?.id;

  //     // if (!userId) {
  //     //   console.error("User not logged in");
  //     //   return;
  //     // }

  //     // const response = await axiosClient.post("/api/v1/chat/createroom", {
  //     //   userId,
  //     //   astroId,
  //     // });

  //     // setLoading(false);

  //     // const room = response.data;

  //     // if (!room?.id) {
  //     //   console.error("❌ No chat room ID in response", response.data);
  //     //   return;
  //     // }

  //     // navigate(`/chat/${room.id}`);

  //     // navigate(`/astrologers/${id}`);
  //   } catch (error) {
  //     console.error("❌ Error creating chat room:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleChatClick = () => {
    console.log("Chat clicked");
  }


  return (
    <Card className="w-full rounded-lg shadow-sm hover:shadow-md transition-all bg-card border border-border">
      <CardContent className="flex items-center justify-between gap-3 ">
        <div className="relative shrink-0">
          <Avatar className="w-12 h-12 border border-primary shadow-sm">
            <AvatarImage src={imageUrl || ""} alt={name} />
            <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          {isApproved && (
            <CheckCircle className="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-green-500 bg-secondary rounded-full" />
          )}
        </div>

        <div className="flex flex-col flex-1 text-left min-w-0 gap-1 ">
          <Link to={`/astrologers/${id}`} className="truncate">
            <h3 className="font-semibold text-sm text-primary truncate">
              {name}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground truncate">{expertise}</p>
        </div>

        <div className="flex flex-col items-end gap-1 ml-auto shrink-0">
          <Button
            variant="outline"
            className="h-6 px-2 text-xs text-primary hover:bg-primary/10 transition"
            onClick={() => handleChatClick()}
          >
            {loading ? <Loader /> : "Chat"}
          </Button>
          <p className="text-xs font-bold text-green-600">
            ₹ {pricePerMin}/min
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
