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
import ErrorMessage from "@/components/errorMessage";

const ChatIntakeForm = () => {
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
  <Card className="w-full max-w-lg md:max-w-2xl shadow-lg border border-border">
    <CardHeader className="space-y-2">
      <CardTitle className="text-center text-xl md:text-2xl font-semibold">
        Fill the form to proceed with chat
      </CardTitle>
      <p className="text-center text-sm text-muted-foreground">
        Please provide accurate details for better guidance
      </p>
    </CardHeader>

    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-5">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="date">Date of Birth *</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  fromYear={1950}
                  toYear={new Date().getFullYear()}
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
                <SelectValue placeholder="Select gender" />
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
              value={formData.birthPlace}
              onChange={(e) => handleChange("birthPlace", e.target.value)}
              placeholder="Enter your birth place"
            />
          </div>

          {/* Birth Time */}
          <div className="space-y-2">
            <Label htmlFor="birthTime">Birth Time</Label>
            <Input
              id="birthTime"
              type="time"
              value={formData.birthTime}
              onChange={(e) => handleChange("birthTime", e.target.value)}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <p className="self-start text-xs text-muted-foreground">
          * Required fields
        </p>

        <Button
          type="submit"
          className="w-full md:w-1/2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save & Continue"
          )}
        </Button>

        {errorMsg && <ErrorMessage message={errorMsg} />}
      </CardFooter>
    </form>
  </Card>
</div>

  );
};

export default ChatIntakeForm;
