"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Member = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  gender: "male" | "female" | "other";
  age: number;
};

interface AddCompanionModalProps {
  bookingId: string;
  availableMembers: Member[];
  remainingSpots: number;
}

export default function AddCompanionModal({
  bookingId,
  availableMembers,
  remainingSpots,
}: AddCompanionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const router = useRouter();

  const handleAddCompanion = async () => {
    if (!selectedMemberId) {
      toast.error("Please select a companion from the list");
      return;
    }

    const member = availableMembers.find((m) => m._id === selectedMemberId);
    if (!member) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/customer/bookings/${bookingId}/travelers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: member.name,
          age: member.age,
          gender: member.gender,
          email: member.email || "",
          phone: member.phone || "",
          memberId: member._id,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        // Handle non-JSON responses
        throw new Error("An unexpected error occurred. Please try again.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to add companion");
      }

      toast.success("Companion added successfully");
      setOpen(false);
      setSelectedMemberId("");
      router.refresh();
    } catch (error: any) {
      console.error("Add companion error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (remainingSpots <= 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add Companion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Companion to Booking</DialogTitle>
          <DialogDescription>
            Select a member from your profile to join this trip. You have{" "}
            {remainingSpots} spot(s) remaining.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {availableMembers.length === 0 ? (
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                You have no saved companions
              </p>
              <Button asChild size="sm" variant="outline" className="w-full">
                <a href="/dashboard/profile">Go to Profile to Add Members</a>
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="member">Select Companion</Label>
              <Select
                value={selectedMemberId}
                onValueChange={setSelectedMemberId}
              >
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select a saved member" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.map((member) => (
                    <SelectItem key={member._id} value={member._id}>
                      {member.name} ({member.age} yrs, {member.gender})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {availableMembers.length > 0 && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCompanion}
              disabled={loading || !selectedMemberId}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add to Trip
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
