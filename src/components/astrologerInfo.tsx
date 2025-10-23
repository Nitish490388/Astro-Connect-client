import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, CheckCircle } from "lucide-react";
import axiosClient from "@/utils/axiosClient";
import type { Astrologer } from "@/types/types";
import { AstrologerAvailabilityDetailsCard } from "./astrologerAvailablityDetailsCard";

export function AstroInfo() {
  const { id } = useParams();
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAstrologer() {
      try {
        const res = await axiosClient(`/api/v1/astrologer/${id}`);
        
        setAstrologer(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAstrologer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="flex justify-center items-center text-muted-foreground">
        Astrologer not found.
      </div>
    );
  }

  // Helper to get initials (first + last name letters)
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    
    <div className="w-full flex justify-center items-center px-4 py-8 bg-background">
      <div>
        <Card className="w-full max-w-3xl rounded-2xl shadow-md bg-card border border-border">
          <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-8">
            {/* Profile Avatar */}
            <div className="relative flex justify-center sm:justify-start">
              <Avatar className="w-40 h-40 sm:w-32 sm:h-32 border-2 border-primary shadow-sm">
                <AvatarImage src={""} alt={astrologer.user.name} />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {getInitials(astrologer.user.name as string)}
                </AvatarFallback>
              </Avatar>
              {astrologer.isApproved && (
                <CheckCircle className="absolute bottom-2 right-2 w-6 h-6 text-green-500 bg-secondary rounded-full" />
              )}
            </div>

            {/* Astrologer Info */}
            <div className="flex flex-col flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-primary">
                {astrologer.user.name}
              </h2>

              {astrologer.expertise && (
                <p className="text-sm text-muted-foreground mt-1">
                  {astrologer.expertise}
                </p>
              )}

              {astrologer.bio && (
                <p className="text-sm mt-4 text-foreground/80 leading-relaxed">
                  {astrologer.bio}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
                <p className="text-base font-medium">
                  ₹ {astrologer.price || 0}/min
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-primary hover:bg-primary/10"
                >
                  Chat Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
          <AstrologerAvailabilityDetailsCard astroId={Number(id)} price={astrologer.price || 0} />
        </div>
    </div>
  );
}
