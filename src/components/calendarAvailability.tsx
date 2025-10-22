import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { isSameDay, parseISO } from "date-fns"
import axiosClient from "@/utils/axiosClient"

interface CalendarAvailabilityProps {
  astrologerId: number
  onDateSelect: (date: Date | null) => void
}

type Availability = {
  id: number
  date: string
}

export function CalendarAvailability({
  astrologerId,
  onDateSelect,
}: CalendarAvailabilityProps) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth() + 1
        const res = await axiosClient.get(
          `/api/v1/availability/${astrologerId}/availability/month`,
          { params: { year, month } }
        )
        console.log(res);
        
        setAvailability(res.data || [])
      } catch (err) {
        console.log("Error fetching availability:", err)
      }
    }
    fetchAvailability()
  }, [astrologerId, currentMonth])

  const isAvailable = (day: Date) =>
    availability.some((a) => isSameDay(parseISO(a.date), day))

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <h3 className="text-lg font-semibold">Availability Calendar</h3>

      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date)
          onDateSelect(date ?? null) 
        }}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        className="rounded-md border p-2"
        modifiers={{
          available: (day) => isAvailable(day),
        }}
        modifiersStyles={{
          available: {
            color: "white",
            backgroundColor: "green",
            borderRadius: "50%",
          },
        }}
      />

      <p className="text-sm text-muted-foreground">
        {selectedDate
          ? isAvailable(selectedDate)
            ? "Astrologer is available on this date ✅"
            : "Not available on this date ❌"
          : "Select a date to check availability"}
      </p>
    </div>
  )
}
