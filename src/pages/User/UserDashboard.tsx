import { useEffect, useState } from "react";
import axiosClient from "@/utils/axiosClient";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, CalendarCheck, MessageSquare } from "lucide-react";
import AppointmentsTab from "@/components/AppointmentsTab";
import ProfileTab from "@/components/ProfileTab";
import { ChatsTab } from "@/components/ChatsTab";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  dob?: string;
  gender?: string;
  birthPlace?: string;
}

const UserDashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get("/api/v1/auth/me");
        if (!res.data.birthPlace) {
          navigate("/user/update");
          return;
        }
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">No user data found.</div>;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto pb-20 sm:pb-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">
        Welcome, {user.name} 👋
      </h1>

      <Tabs defaultValue="profile" className="w-full">
        {/* ✅ Mobile-friendly fixed tabs */}
        <TabsList
          className="
            grid grid-cols-3 w-full sm:w-auto mb-6
            fixed bottom-0 left-0 sm:relative sm:mb-6
            bg-background sm:bg-transparent border-t sm:border-none
            z-50 sm:z-auto
          "
        >
          <TabsTrigger
            value="profile"
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </TabsTrigger>

          <TabsTrigger
            value="appointments"
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Appointments</span>
          </TabsTrigger>

          <TabsTrigger
            value="chats"
            className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chats</span>
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="profile">
          <ProfileTab user={user} />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>

        <TabsContent value="chats">
          <ChatsTab role="user" id={user.id}/>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
