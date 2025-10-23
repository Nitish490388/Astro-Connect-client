import { useSearchParams, useNavigate, data } from "react-router-dom";
import axiosClient from "@/utils/axiosClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { user } = useAppSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const astrologerId = Number(searchParams.get("astrologerId"));
  const date = searchParams.get("date");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const price = searchParams.get("price");

 const handlePayment = async () => {
  try {
    setLoading(true);

    const { data: order } = await axiosClient.post("/api/v1/payment/create-order", {
      amount: Number(price),
      userId: user?.id,
      astrologerId,
      date,
      startTime,
      endTime,
    });
    console.log(order);

    if (!(window as any).Razorpay) {
      toast.error("Payment SDK not loaded. Please refresh and try again.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "AstroConnect",
      description: "Astrologer Appointment Booking",
      order_id: order.orderId,
      handler: async (response: any) => {
        try {
          // Include userId here as well
          const verifyRes = await axiosClient.post("/api/v1/payment/verify", {
            ...response,
            appointmentData: {
              userId: user?.id,  // ✅ Add userId
              astrologerId,
              date,
              startTime,
              endTime,
            },
          });

          if (verifyRes.status === 200) {
            toast.success("Payment successful! Appointment booked.");
            navigate(`/user/dashboard`);
          } else {
            toast.error(
              "Payment successful but slot is no longer available. Initiating refund..."
            );

            // Trigger automatic refund
            // await axiosClient.post("/api/v1/payment/refund", {
            //   orderId: order.orderId,
            //   paymentId: response.razorpay_payment_id,
            //   reason: "Slot unavailable",
            // });
          }
        } catch (err) {
          console.error("Error verifying payment or booking:", err);
          toast.error(
            "Payment succeeded but booking failed. Refund may be triggered."
          );
        }
      },
      prefill: {
        name: user?.name || "Your Name",
        email: user?.email || "youremail@example.com",
      },
      theme: { color: "#6366F1" },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
  } catch (error) {
    console.error(error);
    toast.error("Failed to initiate payment");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
      <h2 className="text-xl font-semibold">Confirm your booking</h2>
      <p>
        {date} | {startTime} - {endTime}
      </p>
      <Button onClick={handlePayment} disabled={loading}>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Pay & Confirm"
        )}
      </Button>
    </div>
  );
}
