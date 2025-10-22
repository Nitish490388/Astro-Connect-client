import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/store/hooks";
import axiosClient from "@/utils/axiosClient";
import { useState } from "react";

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
  const { user } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  const handleChatClick = async (astroId: number) => {
    try {
      // setLoading(true);
      // const userId = user?.id;

      // if (!userId) {
      //   console.error("User not logged in");
      //   return;
      // }

      // const response = await axiosClient.post("/api/v1/chat/createroom", {
      //   userId,
      //   astroId,
      // });

      // setLoading(false);

      // const room = response.data;

      // if (!room?.id) {
      //   console.error("❌ No chat room ID in response", response.data);
      //   return;
      // }

      // navigate(`/chat/${room.id}`);

      navigate(`/astrologers/${id}`)
    } catch (error) {
      console.error("❌ Error creating chat room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-2xl shadow-sm hover:shadow-md transition-all bg-card border border-border">
      <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4">
        {/* Profile Image */}
        <div className="relative shrink-0">
          <Avatar className="w-20 h-20 sm:w-16 sm:h-16 border border-primary shadow-sm">
            <AvatarImage src={imageUrl || ""} alt={name} />
            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          {isApproved && (
            <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-green-500 bg-secondary rounded-full" />
          )}
        </div>

        {/* Astrologer Info */}
        <div className="flex flex-col text-center sm:text-left flex-1">
          {/* Name always shown */}
          <Link to={`/astrologers/${id}`}>
            <h3 className="font-semibold text-lg text-primary">{name}</h3>
          </Link>
          {/* Expertise */}
          <p className="text-sm text-muted-foreground">{expertise}</p>

          {/* Price + Chat Button */}
          <div className="flex items-center justify-center sm:justify-between mt-3">
            <p className="text-sm font-medium">₹ {pricePerMin}/min</p>
            <Button
              size="sm"
              variant="outline"
              className="text-primary hover:bg-primary/10 transition"
              onClick={() => handleChatClick(id)}
            >
              {loading ? <Loader /> : "Book"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
