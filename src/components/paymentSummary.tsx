
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"
import axiosClient from "@/utils/axiosClient"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface Appointment {
  id: number
  astrologer: { name: string }
  date: string
  time: string
  price: number
}

export function PaymentSummary({ appointmentId }: { appointmentId: string }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch appointment details (price, astrologer, etc.)
    axiosClient
      .get(`/api/v1/appointment/${appointmentId}`)
      .then((res) => setAppointment(res.data))
      .catch(() => toast.error("Failed to load appointment"))
      .finally(() => setLoading(false))
  }, [appointmentId])

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handlePayment = async () => {
    if (!appointment) return

    try {
      // Step 1: Create Razorpay order from backend
      const { data: order } = await axios.post("/api/payments/create", {
        appointmentId: appointment.id,
        amount: appointment.price,
      })

      // Step 2: Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // add in .env
        amount: order.amount,
        currency: order.currency,
        name: "AstroConnect",
        description: `Payment for appointment #${appointment.id}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment
            await axios.post("/api/payments/verify", {
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              appointmentId: appointment.id,
            })
            toast.success("Payment successful! 🎉")
          } catch {
            toast.error("Payment verification failed.")
          }
        },
        prefill: {
          name: "User Name",
          email: "user@email.com",
        },
        theme: { color: "#6d28d9" },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error("Payment initialization failed.")
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <CardTitle>Loading payment details...</CardTitle>
      </Card>
    )
  }

  if (!appointment) {
    return <p className="text-center text-muted-foreground">No appointment found.</p>
  }

  return (
    <Card className="max-w-lg mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Astrologer:</strong> {appointment.astrologer.name}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Amount:</strong> ₹{appointment.price}</p>
        <Button className="w-full mt-4" onClick={handlePayment}>
          Pay Now
        </Button>
      </CardContent>
    </Card>
  )
}
