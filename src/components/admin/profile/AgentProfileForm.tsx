"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Loader2,
  Check,
  ShieldAlert,
  ShieldCheck,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ui/image-upload";
import {
  updateAgentProfile,
  submitVerification,
} from "@/app/admin/(dashboard)/profile/actions";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  age: z.number().min(18, "Must be at least 18 years old").max(100),
  gender: z.enum(["male", "female", "other"]),
  address: z.string().min(10, "Address must be at least 10 characters"),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Invalid Aadhaar number (12 digits)"),
  panNumber: z
    .string()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN number (e.g., ABCDE1234F)",
    ),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface AgentProfileFormProps {
  initialData: any;
}

export function AgentProfileForm({ initialData }: AgentProfileFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  const [aadharCards, setAadharCards] = useState<string[]>(
    initialData.documents?.aadharCard || [],
  );
  const [panCards, setPanCards] = useState<string[]>(
    initialData.documents?.panCard || [],
  );
  const [profileImage, setProfileImage] = useState<string[]>(
    initialData.image ? [initialData.image] : [],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name || "",
      phone: initialData.phone || "",
      age: initialData.age || 0,
      gender: initialData.gender || "male",
      address: initialData.address || "",
      aadhaarNumber: initialData.aadhaarNumber || "",
      panNumber: initialData.panNumber || "",
      image: initialData.image || "",
    },
  });

  async function onProfileSubmit(values: ProfileFormValues) {
    setIsPending(true);
    try {
      const result = await updateAgentProfile({
        ...values,
        image: profileImage[0] || "",
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  }

  async function onDocSubmit() {
    if (!aadharCards.length || !panCards.length) {
      toast.error("Please upload both Aadhaar and PAN cards");
      return;
    }

    setIsSubmittingDoc(true);
    try {
      const result = await submitVerification({
        aadharCard: aadharCards,
        panCard: panCards,
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to submit verification");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmittingDoc(false);
    }
  }

  const statusColors = {
    unverified:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Status Banner */}
      <Card
        className={`border-none ${statusColors[initialData.verificationStatus as keyof typeof statusColors]}`}
      >
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {initialData.verificationStatus === "approved" ? (
              <ShieldCheck className="h-6 w-6" />
            ) : initialData.verificationStatus === "rejected" ? (
              <ShieldAlert className="h-6 w-6" />
            ) : (
              <Loader2
                className={`h-6 w-6 ${initialData.verificationStatus === "pending" ? "animate-spin" : ""}`}
              />
            )}
            <div>
              <p className="font-bold flex items-center gap-2">
                Verification Status:{" "}
                <span className="capitalize">
                  {initialData.verificationStatus}
                </span>
              </p>
              {initialData.verificationNote && (
                <p className="text-sm opacity-90">
                  {initialData.verificationNote}
                </p>
              )}
            </div>
          </div>
          {initialData.verificationStatus === "unverified" && (
            <Badge variant="outline" className="border-current">
              Action Required
            </Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Profile Pic & Docs */}
        <div className="space-y-8 col-span-1">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ImageUpload
                value={profileImage}
                onChange={setProfileImage}
                onRemove={() => setProfileImage([])}
                maxFiles={1}
                folder="/agent-profiles"
                accept="image/*"
              />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Clear portrait for your agent profile. (Max 4MB)
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" /> Identity
                Documents
              </CardTitle>
              <CardDescription>
                Upload clear PDF copies for verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="font-bold">Aadhaar Card (PDF)</Label>
                <ImageUpload
                  value={aadharCards}
                  onChange={setAadharCards}
                  onRemove={() => setAadharCards([])}
                  maxFiles={1}
                  folder="/agent-docs/aadhaar"
                  accept="application/pdf"
                  disabled={initialData.verificationStatus === "approved"}
                />
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="font-bold">PAN Card (PDF)</Label>
                <ImageUpload
                  value={panCards}
                  onChange={setPanCards}
                  onRemove={() => setPanCards([])}
                  maxFiles={1}
                  folder="/agent-docs/pan"
                  accept="application/pdf"
                  disabled={initialData.verificationStatus === "approved"}
                />
              </div>
            </CardContent>
            {initialData.verificationStatus !== "approved" && (
              <CardFooter>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={onDocSubmit}
                  disabled={
                    isSubmittingDoc ||
                    initialData.verificationStatus === "pending"
                  }
                >
                  {isSubmittingDoc ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Submit for Verification
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Right Column: Personal Info Form */}
        <Card className="col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>
              Update your contact and identification details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="John Doe"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email (Read-only) */}
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9 bg-muted/50"
                          value={initialData.email}
                          disabled
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Registered login email.</FormDescription>
                  </FormItem>

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="+91 98765 43210"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Age */}
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber || 0)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="Block A, Sector 12, Delhi"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="md:col-span-2" />

                  {/* Aadhaar Number */}
                  <FormField
                    control={form.control}
                    name="aadhaarNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhaar Number (12 Digits)</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PAN Number */}
                  <FormField
                    control={form.control}
                    name="panNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number</FormLabel>
                        <FormControl>
                          <Input
                            className="uppercase"
                            placeholder="ABCDE1234F"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
