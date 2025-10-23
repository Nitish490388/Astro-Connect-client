import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Appointment } from "@/types/types";

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/api/v1/appointment/");
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleChatClick = async (astroId: number, userId: number) => {
    try {
      setLoading(true);

      const response = await axiosClient.post("/api/v1/chat/createroom", {
        userId,
        astroId,
      });

      setLoading(false);

      const room = response.data;

      if (!room?.id) {
        console.error("❌ No chat room ID in response", response.data);
        return;
      }

      // TODO
      navigate(`/chat/${room.id}`);
    } catch (error) {
      console.error("❌ Error creating chat room:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading appointments...
      </div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Your Appointments</CardTitle>
        <Button onClick={() => navigate("/book")}>Book New</Button>
      </CardHeader>

      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-gray-500 italic">
            No appointments found. Tap “Book New” to get started!
          </p>
        ) : (
          <div className="grid gap-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow transition space-y-3 sm:space-y-0"
              >
                <div className="flex-grow">
                  <p className="font-bold text-gray-800">
                    Astrologer: {appt.astrologer?.user?.name}
                  </p>
                  <div className="flex flex-col text-sm text-gray-600 mt-1 space-y-1">
                    <div className="flex items-center gap-1">
                      <CalendarCheck className="h-4 w-4 text-primary" />
                      <span>{new Date(appt.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>
                        {appt.startTime} - {appt.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full min-w-[100px] text-center ${
                      appt.status === "COMPLETED"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : appt.status === "CANCELLED"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                    }`}
                  >
                    {appt.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      handleChatClick(appt.astrologerId, appt.userId)
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
