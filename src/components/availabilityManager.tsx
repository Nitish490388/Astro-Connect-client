import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosClient from "@/utils/axiosClient";
import { useAppSelector } from "@/store/hooks";
import { DatePicker } from "./datePicker";
import type { Slot } from "@/types/types";
import { format } from 'date-fns';


export function AvailabilityManager() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined)

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAppSelector((state) => state.user);

  const astrologerId = user?.astrologer?.id;

  // ✅ Fetch astrologer slots
  const fetchSlots = async () => {
    if (!astrologerId) return;
    setLoading(true);
    try {
      const res = await axiosClient.get(
        `/api/v1/availability/${astrologerId}/availability`
      );
      console.log(res.data);

      setSlots(res.data || []);
    } catch (err) {
      console.error(err);
      toast("Error fetching slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // ✅ Add new slot
  const handleAddSlot = async () => {
    if (!date || !startTime || !endTime) return toast("Please fill all fields");

    console.log(date, startTime, endTime);
    try {
      const res = await axiosClient.post(`/api/v1/availability/${astrologerId}/availability`, {
        date,
        startTime,
        endTime,
      })

      setSlots((prev) => [...prev, res.data.slots])
      toast("Success!", { description: "Slot added successfully!" });
      setDate(undefined);
      setStartTime("");
      setEndTime("");
    } catch (err) {
      // console.log(err);
      toast.error("Error adding slot");
    }
  };

  // ✅ Block / Unblock slot
  const toggleBlock = async (slotId: string, isBlocked: boolean) => {
    try {
      const endpoint = `/api/v1/availability/${astrologerId}/availability/${slotId}/${
        isBlocked ? "unblock" : "block"
      }`;
      await axiosClient.patch(endpoint);

      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === slotId ? { ...slot, isBlocked: !isBlocked } : slot
        )
      );

      toast("Success!", {
        description: isBlocked ? "Slot unblocked" : "Slot blocked",
      });
    } catch (err) {
      console.error(err);
      toast("Error updating slot");
    }
  };

  return (
    <div className="space-y-4">
      {/* ➕ Add Slot Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto">+ Add Availability</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Slot</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {/* Date Picker */}
            <DatePicker day={date} setDay={setDate}/>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleAddSlot} className="w-full">
              Save Slot
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 🕒 Slots List */}
      <div className="grid gap-3 sm:grid-cols-2">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : slots.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No slots yet. Add your availability.
          </p>
        ) : (
          slots.map((slot) => (
            <Card key={slot.id} className="shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">
                  {format(slot.date, 'do MMMM yyyy')} — {slot.startTime} to {slot.endTime}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    slot.isBlocked ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {slot.isBlocked ? "Blocked" : "Active"}
                </span>

                <Switch
                  checked={!slot.isBlocked}
                  onCheckedChange={() => toggleBlock(slot.id, slot.isBlocked)}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
