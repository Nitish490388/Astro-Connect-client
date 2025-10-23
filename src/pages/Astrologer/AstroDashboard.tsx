import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {AvailabilityManager} from "@/components/availabilityManager" 
import {AppointmentsList} from "@/components/appointmentsList"
import { ChatsTab } from "@/components/ChatsTab"
import { useAppSelector } from "@/store/hooks"

export default function AstroDashboard() {
  const [tab, setTab] = useState("availability")
    const { user } = useAppSelector((state) => state.user);
    

  return (
    <div className="bg-background md:px-8">
      <h1 className="text-2xl font-bold text-center mb-4">🪐 Astro Panel</h1>

      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-3xl mx-auto">
        <TabsList className="grid grid-cols-3 rounded-xl bg-muted">
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="operations">Chats</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <Card className="mt-4 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Manage Your Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="mt-4 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card className="mt-4 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatsTab role="astrologer" id={user?.astrologer?.id || 0}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
