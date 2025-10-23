import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UserProfile {
  name: string;
  email: string;
  dob?: string;
  gender?: string;
}

const ProfileTab = ({ user }: { user: UserProfile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
