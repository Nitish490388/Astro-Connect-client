import { useEffect, useState } from "react";
import { AstrologerCard } from "./astrologerCard";
import type { Astrologer } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import axiosClient from "@/utils/axiosClient";

export function AstrologerList() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/api/v1/astrologer")
      .then((res) => setAstrologers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {astrologers.map((a) => (
      <AstrologerCard
        key={a.id}
        id={a.id}
        name={a.user.name as string}
        expertise={a.expertise || "—"}
        pricePerMin={a.price || 0}
        imageUrl="/images/default-astro.png"
        isApproved={a.isApproved}
      />
    ))}
  </div>
);


}
