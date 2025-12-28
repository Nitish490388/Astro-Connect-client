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
    <div>
      <div className="flex flex-col gap-2 p-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
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
      {/* {alertContent && (
        <div className="md:min-w-3xs min-w-full p-4 fixed z-10 bottom-0 left-0">
          <div>
            <Alert>
              <CheckCircle2Icon />
              <AlertTitle>Chat with {alertContent.name.split(" ")[0]}</AlertTitle>
              <AlertDescription>
                This is an alert with icon, title and description.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )} */}
    </div>
  );
}
