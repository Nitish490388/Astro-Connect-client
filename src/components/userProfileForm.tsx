import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { updateUser } from "@/store/slices/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { userProfileSchema } from "@/schemas/userProfile";
import ErrorMessage from "./errorMessage";

const UserProfileForm = () => {
  const { user } = useAppSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    birthPlace: "",
    birthTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMessage] = useState<string | null>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        dob: user.dob || "",
        gender: user.gender || "",
        birthPlace: user.birthPlace || "",
        birthTime: user.birthTime || "",
      });
      if (user.dob) {
        setDate(new Date(user.dob));
      }
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const parsed = userProfileSchema.safeParse(formData);
      if (!parsed.success) {
        setErrorMessage(parsed.error.message);
      } else {
        const data = parsed.data;

        await dispatch(updateUser({...data, id: user?.id})).unwrap();
        
        toast("Success!", {
          description: "Your profile has been updated successfully.",
        });
        if(user?.astrologer) {
          navigate("/astro/dashboard")
        }
        navigate("/user/dashboard");
      }
    } catch (err) {
      toast.error("Update Failed", {
        description: "Error in Saving data!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-4">
      <Card className="w-full shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Update Profile
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter your full name" // Placeholder updated
              />
            </div>

            {/* Email (disabled) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="date" className="px-1">
                Date of Birth *
              </Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date"
                    className="w-full justify-between font-normal"
                  >
                    {date ? date.toLocaleDateString() : "Select date"}{" "}
                    {/* Text updated */}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown" // 👈 this enables month & year dropdown
                    fromYear={1950} // 👈 optional: earliest year in dropdown
                    toYear={new Date().getFullYear()} // 👈 latest year (current)
                    onSelect={(d) => {
                      if (d) {
                        setDate(d);
                        setOpen(false);
                        setFormData((prev) => ({
                          ...prev,
                          dob: d.toISOString(),
                        }));
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />{" "}
                  {/* Placeholder updated */}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Birth Place */}
            <div className="space-y-2">
              <Label htmlFor="birthPlace">Birth Place *</Label>
              <Input
                id="birthPlace"
                type="text"
                placeholder="Enter your birth place" // Placeholder updated
                value={formData.birthPlace}
                onChange={(e) => handleChange("birthPlace", e.target.value)}
              />
            </div>

            {/* Birth Time */}
            <div className="space-y-2">
              <Label htmlFor="birthTime">Birth Time</Label>
              <Input
                id="birthTime"
                type="time"
                className="bg-background"
                value={formData.birthTime}
                onChange={(e) => handleChange("birthTime", e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="mt-6 flex flex-col justify-center items-center">
            {" "}
            {/* Changed flex justify-center to flex-col justify-center items-center to accommodate the new note */}
            <div className="text-sm text-muted-foreground mb-4 self-start">
              * is important field
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            {errorMsg ? (
              <div className="mt-4">
                <ErrorMessage message={errorMsg} />
              </div>
            ) : (
              <></>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserProfileForm;
