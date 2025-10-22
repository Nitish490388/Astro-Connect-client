// src/components/AppointmentForm.tsx
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import axiosClient from "@/utils/axiosClient"

const appointmentSchema = z.object({
  astrologerId: z.string().nonempty("Please select an astrologer"),
  date: z.string().nonempty("Please select a date"),
  time: z.string().nonempty("Please select a time"),
  topic: z.string().optional(),
})

type AppointmentValues = z.infer<typeof appointmentSchema>

interface Astrologer {
  id: number
  name: string
}

export function AppointmentForm() {
  const form = useForm<AppointmentValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { astrologerId: "", date: "", time: "", topic: "" },
  })

  const [astrologers, setAstrologers] = useState<Astrologer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axiosClient.get("/api/v1/astrologer")
      .then(res => setAstrologers(res.data))
      .catch(() => toast.error("Failed to load astrologers"))
  }, [])

  const onSubmit = async (values: AppointmentValues) => {
    try {
      setLoading(true)
      await axiosClient.post("/api/appointments", values)
      toast.success("Appointment booked successfully!")
      form.reset()
    } catch {
      toast.error("Failed to book appointment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-card p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-center">Book Appointment</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="astrologerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Astrologer</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select astrologer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {astrologers.map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Career, Love, Health, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
