import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

export function DatePicker({
  day,
  setDay,
}: {
  day: Date | undefined
  setDay: (date: Date | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  

  return (
    <div className="flex flex-col space-y-2">
      <Label>Date</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {day ? format(day, "PPP") : <span>Select date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Calendar
            mode="single"
            selected={day}
            onSelect={(date) => {
              setDay(date)
              setOpen(false) // ✅ closes after selection
            }}
            disabled={(date) => date < today}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
