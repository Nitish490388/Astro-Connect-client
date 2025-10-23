import { useEffect, useState } from "react"
import { format } from "date-fns"
import axiosClient from "@/utils/axiosClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, Clock } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface TimeSlotListProps {
  astrologerId: number,
  price: number
  selectedDate: Date | null
}

type Slot = {
  id: number
  ammount: number
  startTime: string
  endTime: string
  isBlocked: boolean
}

export function TimeSlotList({ astrologerId, selectedDate, price }: TimeSlotListProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState<number | null>(null)

  const navigate = useNavigate();
  // Fetch slots for selected date
  useEffect(() => {
    if (!selectedDate) return

    const fetchSlots = async () => {
      try {
        setLoading(true)
        setError(null)
        const formattedDate = format(selectedDate, "yyyy-MM-dd")

        const res = await axiosClient.get(
          `/api/v1/availability/${astrologerId}/availability/date`,
          { params: { date: formattedDate } }
        )

        const data = res.data || []
        setSlots(data)
      } catch (err) {
        console.log(err)
        setError("Error fetching slots")
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [selectedDate, astrologerId])


  const handleSlotBook = async (slot: Slot) => {
    if (!selectedDate) {
      toast("Please select a date first")
      return
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd")
    
    // try {
    //   setBookingLoading(slot.id)

    //   const res = await axiosClient.post("/api/v1/appointment/", {
    //     astrologerId,
    //     date: formattedDate,
    //     startTime: slot.startTime,
    //     endTime: slot.endTime,
    //   })
      
    //   if (res.status === 200 || res.status === 201) {
    //     toast.success("Appointment booked successfully!", {
    //       description: `${slot.startTime} - ${slot.endTime} on ${formattedDate}`,
    //     })

    //     setSlots((prev) =>
    //       prev.map((s) =>
    //         s.id === slot.id ? { ...s, isBlocked: true } : s
    //       )
    //     )
    //   } else {
    //     toast.error("Failed to book appointment", {
    //       description: res.data?.message || "Unexpected error occurred",
    //     })
    //   }
    // } catch (err: any) {
    //   console.error("Booking error:", err)
    //   toast.error("Error booking appointment", {
    //     description: err.response?.data?.message || "Something went wrong",
    //   })
    // } finally {
    //   setBookingLoading(null)
    // }

    navigate(
    `/checkout?astrologerId=${astrologerId}&price=${price}&date=${formattedDate}&startTime=${slot.startTime}&endTime=${slot.endTime}`
  )
  }

  if (!selectedDate) {
    return <p className="text-center text-muted-foreground">Select a date first 📅</p>
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }

  if (!slots.length) {
    return (
      <div className="text-center text-muted-foreground py-6">
        ❌ No slots available for this date
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-center md:text-left">
        Available Time Slots
      </h3>

      {slots.map((slot) => (
        <Card
          key={slot.id}
          className={`transition-all ${
            slot.isBlocked
              ? "opacity-50 cursor-not-allowed border-border"
              : "hover:shadow-md"
          }`}
        >
          <CardContent className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {slot.startTime} – {slot.endTime}
              </span>
            </div>

            {slot.isBlocked ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span className="text-xs">Booked</span>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={bookingLoading === slot.id}
                className="text-green-600 border-green-400 hover:bg-green-100"
                onClick={() => handleSlotBook(slot)}
              >
                {bookingLoading === slot.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Book"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
