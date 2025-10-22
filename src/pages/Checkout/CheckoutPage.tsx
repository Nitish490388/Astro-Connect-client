// src/pages/Checkout/CheckoutPage.tsx
import { useParams } from "react-router-dom"
import { PaymentSummary } from "@/components/paymentSummary"

export default function CheckoutPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>()

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      {appointmentId ? (
        <PaymentSummary appointmentId={appointmentId} />
      ) : (
        <p className="text-center text-muted-foreground">
          Invalid checkout session.
        </p>
      )}
    </div>
  )
}
