import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CalendarAvailability } from "./calendarAvailability"
import { TimeSlotList } from "./timeSlotList"

export function AstrologerAvailabilityDetailsCard({
  astroId,
  price,
}: {
  astroId: number,
  price: number
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)  

  return (
    <Card className="rounded-2xl shadow-sm border border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-center md:text-left">
          🌙 Book an Appointment
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1 text-center md:text-left">
          Select a date to view available time slots.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row gap-8 p-6">
        {/* Left: Calendar */}
        <div className="flex-1 border border-border rounded-xl p-4 shadow-xs bg-background">
          <CalendarAvailability
            astrologerId={astroId}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Right: Slots */}
        <div className="flex-1 border border-border rounded-xl p-4 shadow-xs bg-background">
          <TimeSlotList astrologerId={astroId} selectedDate={selectedDate} price={price}/>
        </div>
      </CardContent>
    </Card>
  )
}
