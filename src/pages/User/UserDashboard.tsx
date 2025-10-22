
import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, CalendarCheck, Clock } from 'lucide-react';

interface Appointment {
  id: number;
  astrologer: { user: { name: string } };
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  dob?: string;
  gender?: string;
}

const UserDashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axiosClient.get("/api/v1/auth/me");
        // console.log(userRes);
        if(!userRes.data.birthPlace) {
          navigate("/user/update");
        }
        
        const apptRes = await axiosClient.get("/api/v1/appointment/");
        setUser(userRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">No user data found.</div>;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Welcome, {user.name} 👋
        </h1>
        {/* Full width on small screens, primary button */}
        <Button onClick={() => navigate("/book")} className="bg-primary w-full sm:w-auto">
          Book New Appointment
        </Button>
      </div>

      {/* --- */}

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        {/* Forces content to stack vertically on mobile (default grid is 1 column) and 2 columns on medium screens */}
        <CardContent className="grid md:grid-cols-2 gap-4 text-gray-700">
          <p className="flex items-center gap-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="flex items-center gap-2">
            <strong>Gender:</strong> {user.gender || "Not specified"}
          </p>
          <p className="flex items-center gap-2">
            <strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
          </p>
          {/* Add more profile fields here if needed */}
        </CardContent>
      </Card>

      {/* --- */}

      {/* Appointments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-gray-500 italic">No appointments found. Tap 'Book New Appointment' to get started!</p>
          ) : (
            <div className="grid gap-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow transition space-y-3 sm:space-y-0"
                >
                  {/* Appointment Details - Stacks on mobile */}
                  <div className="flex-grow">
                    <p className="font-bold text-base text-gray-800">
                      Astrologer: {appt.astrologer?.user?.name}
                    </p>
                    <div className="flex flex-col text-sm text-gray-600 mt-1 space-y-1">
                      <div className="flex items-center gap-1">
                          <CalendarCheck className="h-4 w-4 text-primary" />
                          <span>{new Date(appt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{appt.startTime} - {appt.endTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Action Buttons - Moves to the right/bottom on mobile */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 sm:mt-0">
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
                      size="sm" // Use small size for better mobile fit
                      className="w-full sm:w-auto flex items-center gap-2"
                      onClick={() => navigate(`/chat/${appt.id}`)}
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
    </div>
  );
};

export default UserDashboard;
