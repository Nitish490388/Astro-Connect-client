import { useState, useEffect } from "react"
import axiosClient from "@/utils/axiosClient"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, User2, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Appointment = {
  id: string
  clientName: string
  date: string
  time: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
}

export function AppointmentsList() {
  const [tab, setTab] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Reschedule modal states
  const [open, setOpen] = useState(false)
  const [selectedApptId, setSelectedApptId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState("")
  const [newStartTime, setNewStartTime] = useState("")
  const [newEndTime, setNewEndTime] = useState("")

  // ✅ Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await axiosClient.get("/api/v1/appointment/")
        setAppointments(res.data || [])
      } catch (err: any) {
        console.error("Error fetching appointments:", err)
        setError(err.response?.data?.message || "Failed to fetch appointments")
        toast.error("Failed to fetch appointments")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // ✅ Filtered appointments by tab
  const filteredAppointments =
    tab === "all"
      ? appointments
      : appointments.filter((a) => a.status === tab)

  // ✅ Badge colors
  const getBadgeColor = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "accepted":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-red-100 text-red-700"
      case "cancelled":
        return "bg-gray-200 text-gray-600"
      default:
        return ""
    }
  }

  // ✅ Handle status update
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await axiosClient.patch(`/api/v1/appointment/${id}/status`, {
        status: newStatus,
      })

      if (res.status === 200) {
        toast.success(`Appointment ${newStatus}`)
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: newStatus as any } : appt
          )
        )
      }
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update appointment status")
    }
  }

  // ✅ Handle Reschedule
  const handleReschedule = async () => {
    if (!selectedApptId || !newDate || !newStartTime || !newEndTime) {
      toast.error("Please fill all fields")
      return
    }

    try {
      const res = await axiosClient.patch(
        `/api/v1/appointment/${selectedApptId}/reschedule`,
        {
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
        }
      )

      if (res.status === 200) {
        toast.success("Appointment rescheduled successfully!")

        // ✅ Update appointment in local state
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === selectedApptId
              ? {
                  ...appt,
                  date: newDate,
                  time: `${newStartTime} - ${newEndTime}`,
                }
              : appt
          )
        )

        // Reset form
        setOpen(false)
        setSelectedApptId(null)
        setNewDate("")
        setNewStartTime("")
        setNewEndTime("")
      }
    } catch (err) {
      console.error("Error rescheduling appointment:", err)
      toast.error("Failed to reschedule appointment")
    }
  }

  // 🧱 UI Rendering
  return (
    <div className="w-full space-y-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-4 rounded-xl bg-muted">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground mt-4">
              No appointments found.
            </p>
          ) : (
            <div className="grid gap-3 mt-4 sm:grid-cols-2">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className="p-3 rounded-2xl shadow-sm flex flex-col justify-between"
                >
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <User2 className="w-4 h-4 text-muted-foreground" />
                      {appointment.clientName}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <Badge
                      className={`mt-2 capitalize ${getBadgeColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </Badge>

                    {/* Action buttons */}
                    {appointment.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "accepted")
                          }
                        >
                          Accept
                        </Button>
                      </div>
                    )}

                    {appointment.status === "accepted" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedApptId(appointment.id)
                            setOpen(true)
                          }}
                        >
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-red-500 hover:bg-red-600"
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "cancelled")
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ✅ Reschedule Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
