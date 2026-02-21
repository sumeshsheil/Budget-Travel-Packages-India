"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RemoveTravelerButtonProps {
  bookingId: string;
  memberId?: string;
  name: string;
}

export default function RemoveTravelerButton({
  bookingId,
  memberId,
  name,
}: RemoveTravelerButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);
    try {
      const url = new URL(
        `/api/customer/bookings/${bookingId}/travelers`,
        window.location.origin,
      );
      if (memberId) {
        url.searchParams.set("memberId", memberId);
      } else {
        url.searchParams.set("name", name);
      }

      const res = await fetch(url.toString(), {
        method: "DELETE",
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("An unexpected error occurred. Please try again.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove companion");
      }

      toast.success("Companion removed successfully");
      router.refresh();
    } catch (error: any) {
      console.error("Remove companion error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Companion?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>{name}</strong> from this
            booking? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            className="bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
