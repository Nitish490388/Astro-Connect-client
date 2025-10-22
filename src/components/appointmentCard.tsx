// src/components/AppointmentCard.tsx
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Appointment {
  id: number
  astrologer: { id: number; name: string }
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}

interface Props {
  appointment: Appointment
  onReschedule?: (id: number) => void
  onCancel?: (id: number) => void
}

export function AppointmentCard({ appointment, onReschedule, onCancel }: Props) {
  const { id, astrologer, date, time, status } = appointment

  const statusColor =
    status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : status === "confirmed"
      ? "bg-green-100 text-green-700"
      : status === "cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700"

  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <CardHeader>
        <CardTitle>{astrologer.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {date} at {time}
        </p>
        <Badge className={`${statusColor} mt-2 capitalize`}>{status}</Badge>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReschedule?.(id)}
          disabled={status !== "confirmed" && status !== "pending"}
        >
          Reschedule
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onCancel?.(id)}
          disabled={status === "cancelled" || status === "completed"}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
