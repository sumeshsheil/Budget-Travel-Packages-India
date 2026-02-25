"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Plus,
  CalendarIcon,
  Trash2,
  UserPlus,
  Globe,
  ChevronsUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ui/image-upload";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DurationSelect } from "@/components/shared/DurationSelect";
import { GuestCounter } from "@/components/shared/GuestCounter";
// ... (rest of imports same)
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { createLead } from "@/app/admin/(dashboard)/leads/actions";

const DEPARTURE_CITIES = [
  "Agartala",
  "Ahmedabad",
  "Aizawl",
  "Ajmer",
  "Amritsar",
  "Asansol",
  "Aurangabad",
  "Bagdogra",
  "Belagavi",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Bilaspur",
  "Bokaro",
  "Calicut",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Dibrugarh",
  "Dimapur",
  "Durgapur",
  "Erode",
  "Gaya",
  "Guwahati",
  "Hubballi",
  "Hyderabad",
  "Imphal",
  "Indore",
  "Itanagar",
  "Jabalpur",
  "Jaipur",
  "Jammu",
  "Jamshedpur",
  "Jodhpur",
  "Kadapa",
  "Kannur",
  "Kanpur",
  "Kanyakumari",
  "Karimnagar",
  "Kochi",
  "Kolhapur",
  "Kolkata",
  "Korba",
  "Kurnool",
  "Lucknow",
  "Madurai",
  "Mangaluru",
  "Mumbai",
  "Nagpur",
  "Nellore",
  "Nizamabad",
  "Patna",
  "Port Blair",
  "Pune",
  "Raipur",
  "Rajahmundry",
  "Ranchi",
  "Salem",
  "Shillong",
  "Silchar",
  "Siliguri",
  "Srinagar",
  "Surat",
  "Tezpur",
  "Thiruvananthapuram",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirupati",
  "Tiruppur",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
];

// ... (schemas same)
const travelerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  altPhone: z.string().optional(),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Age must be valid",
  }),
  gender: z
    .string()
    .refine((val) => ["male", "female", "other"].includes(val), {
      message: "Gender is required",
    }),
  aadharCard: z.array(z.string()).min(1, "Aadhaar Card is mandatory"),
  passport: z.array(z.string()).optional().default([]),
});

const formSchema = z
  .object({
    tripType: z.enum(["domestic", "international"]),
    destination: z.string().min(2, "Destination is required"),
    departureCity: z.string().min(2, "Departure city is required"),
    travelDate: z.date(),
    duration: z.string().min(1, "Duration is required"),
    guests: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be at least 1 guest",
    }),
    budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Budget must be fixed",
    }),
    travelers: z
      .array(travelerSchema)
      .min(1, "At least one traveler is required"),
    specialRequests: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tripType === "international") {
      data.travelers.forEach((traveler, index) => {
        if (!traveler.passport || traveler.passport.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passport is mandatory for international trips",
            path: ["travelers", index, "passport"],
          });
        }
      });
    }
  });

interface CreateLeadDialogProps {
  triggerClassName?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  fullWidth?: boolean;
}

export function CreateLeadDialog({
  triggerClassName,
  variant,
  fullWidth,
}: CreateLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      tripType: "domestic",
      destination: "",
      departureCity: "",
      duration: "",
      guests: "1",
      budget: "",
      travelers: [
        {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          altPhone: "",
          age: "",
          gender: undefined as any, // force empty string or undefined based on type
          aadharCard: [],
          passport: [],
        },
      ],
      specialRequests: "",
    },
  });

  const { control, handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "travelers",
  });

  const guests = form.watch("guests");

  // Sync travelers with guest count
  useEffect(() => {
    const guestCount = parseInt(guests) || 1;
    if (fields.length !== guestCount) {
      if (fields.length < guestCount) {
        for (let i = fields.length; i < guestCount; i++) {
          append(
            {
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              altPhone: "",
              age: "",
              gender: undefined as any,
              aadharCard: [],
              passport: [],
            },
            { shouldFocus: false },
          );
        }
      } else {
        for (let i = fields.length - 1; i >= guestCount; i--) {
          remove(i);
        }
      }
    }
  }, [guests, fields.length, append, remove]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();

      // Append standard fields
      Object.entries(values).forEach(([key, value]) => {
        if (key === "travelDate") {
          formData.append(key, format(value as Date, "dd/MM/yyyy"));
        } else if (key !== "travelers") {
          formData.append(key, String(value));
        }
      });

      // Format travelers specifically to recreate the "name" expected by the DB
      const formattedTravelers = values.travelers.map((t) => {
        const { firstName, lastName, ...rest } = t;
        return {
          ...rest,
          name: `${firstName} ${lastName}`.trim(),
        };
      });

      // Append travelers as JSON
      formData.append("travelers", JSON.stringify(formattedTravelers));

      const result = await createLead(null, formData);

      if (result.success) {
        toast.success("Lead created successfully");
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create lead");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "bg-emerald-600 hover:bg-emerald-700 text-white",
            fullWidth && "w-full justify-start",
            triggerClassName,
          )}
          variant={variant || "default"}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Manual Lead
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl scrollbar-hide w-full lg:w-[95vw] max-h-[95vh] overflow-y-auto overflow-x-hidden px-0 sm:px-8"
        data-lenis-prevent
      >
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
          <DialogDescription>
            Manually add a new travel inquiry and traveler details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
            {/* Trip Details Section */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-none">
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-500 uppercase tracking-wider mb-4 h-5 flex items-center">
                  1. Trip Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                  <FormField
                    control={control}
                    name="tripType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Trip Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 py-5 w-full pl-12 relative overflow-hidden flex border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20">
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Globe className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            data-lenis-prevent
                            position="popper"
                            className="w-(--radix-select-trigger-width) rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1"
                          >
                            <SelectItem
                              value="domestic"
                              className="rounded-lg py-2.5 text-slate-700 dark:text-slate-300 focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-300 cursor-pointer"
                            >
                              Domestic
                            </SelectItem>
                            <SelectItem
                              value="international"
                              className="rounded-lg py-2.5 text-slate-700 dark:text-slate-300 focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-300 cursor-pointer"
                            >
                              International
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Destination
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Destination"
                            className="h-11 px-4 border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 bg-slate-50/50 dark:bg-slate-900/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    data-lenis-prevent
                    control={control}
                    name="departureCity"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Departure City <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between h-11 px-4 border-slate-200 dark:border-slate-800 font-normal bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value
                                  ? DEPARTURE_CITIES.find(
                                      (city) =>
                                        city.toLowerCase() ===
                                        field.value.toLowerCase(),
                                    ) || field.value
                                  : "Select city..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            data-lenis-prevent="true"
                            className="w-[300px] p-0 dark:border-slate-800 lenis-prevent"
                            align="start"
                            onWheel={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center p-2 border-b dark:border-slate-800">
                              <Input
                                placeholder="Search city..."
                                className="h-8 shadow-none border-none focus-visible:ring-0"
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            <div
                              data-lenis-prevent="true"
                              className="max-h-[300px] overflow-y-auto p-1 lenis-prevent"
                              onWheel={(e) => e.stopPropagation()}
                            >
                              {DEPARTURE_CITIES.filter((c) =>
                                c
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()),
                              ).map((city) => (
                                <div
                                  data-lenis-prevent="true"
                                  key={city}
                                  className={cn(
                                    "px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800",
                                    field.value.toLowerCase() ===
                                      city.toLowerCase() &&
                                      "bg-slate-100 dark:bg-slate-800 font-medium",
                                  )}
                                  onClick={() => {
                                    field.onChange(city);
                                  }}
                                >
                                  {city}
                                </div>
                              ))}
                              {DEPARTURE_CITIES.filter((c) =>
                                c
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()),
                              ).length === 0 && (
                                <div className="p-2 text-sm text-center text-muted-foreground">
                                  No city found.
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="travelDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Travel Date <span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full px-4 text-left font-normal h-11 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span className="text-sm">Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0"
                            align="start"
                            data-lenis-prevent="true"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px]  font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Duration
                        </FormLabel>
                        <DurationSelect
                        className="py-[22px]"
                        
                          value={field.value}
                          onChange={field.onChange}
                          useFormControl
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Guests
                        </FormLabel>
                        <GuestCounter
                          className="py-[22px]"
                          value={field.value}
                          onChange={field.onChange}
                          useFormControl
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Budget (₹)
                        </FormLabel>
                        <FormControl>
                          <div className="relative group/budget">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium text-lg group-focus-within/budget:text-emerald-600 dark:group-focus-within/budget:text-emerald-400 transition-colors">
                              ₹
                            </span>
                            <Input
                              type="number"
                              placeholder="50000"
                              className="h-11 pl-12 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Travelers Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-500 uppercase tracking-wider">
                  2. Travelers & Document Details
                </h3>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card
                    key={field.id}
                    className="relative bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {index === 0
                            ? "PRIMARY TRAVELER"
                            : `MEMBER #${index + 1}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <FormField
                          control={control}
                          name={`travelers.${index}.firstName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                First Name{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="First name"
                                  className="h-11 px-4 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`travelers.${index}.lastName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Last name"
                                  className="h-11 px-4 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`travelers.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                Email <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="email@example.com"
                                  className="h-11 px-4 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`travelers.${index}.phone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                Phone <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="10 Digits"
                                  className="h-11 px-4 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name={`travelers.${index}.age`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                  Age
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Age"
                                    className="h-11 px-4 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`travelers.${index}.gender`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                  Gender
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-11 px-4 py-[22px] w-full border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20">
                                      <SelectValue placeholder="Gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                      Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={control}
                          name={`travelers.${index}.altPhone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                Alternate Phone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Alt Phone (Optional)"
                                  className="h-11 px-4 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <FormField
                            control={control}
                            name={`travelers.${index}.aadharCard`}
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <FormLabel className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                                      Aadhaar Card{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0 h-4 bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                                    >
                                      Mandatory
                                    </Badge>
                                  </div>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    Upload PDF format only
                                  </span>
                                </div>
                                <FormControl>
                                  <div className="w-full">
                                    <ImageUpload
                                      value={field.value}
                                      onChange={field.onChange}
                                      onRemove={(url: string) =>
                                        field.onChange(
                                          field.value.filter(
                                            (u: string) => u !== url,
                                          ),
                                        )
                                      }
                                      maxFiles={1}
                                      folder="/documents/aadhar"
                                      accept="application/pdf"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`travelers.${index}.passport`}
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2">
                                    <FormLabel className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                                      Passport{" "}
                                      {form.watch("tripType") ===
                                        "international" && (
                                        <span className="text-red-500">*</span>
                                      )}
                                    </FormLabel>
                                    <Badge
                                      variant="secondary"
                                      className={cn(
                                        "text-[10px] px-1.5 py-0 h-4 border-purple-100 font-bold",
                                        form.watch("tripType") ===
                                          "international"
                                          ? "bg-red-50 text-red-600 border-red-100"
                                          : "bg-purple-50 text-purple-600",
                                      )}
                                    >
                                      {form.watch("tripType") ===
                                      "international"
                                        ? "Required"
                                        : "Optional"}
                                    </Badge>
                                  </div>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    Upload PDF format only
                                  </span>
                                </div>
                                <FormControl>
                                  <div className="w-full">
                                    <ImageUpload
                                      value={field.value}
                                      onChange={field.onChange}
                                      onRemove={(url: string) =>
                                        field.onChange(
                                          field.value.filter(
                                            (u: string) => u !== url,
                                          ),
                                        )
                                      }
                                      maxFiles={1}
                                      folder="/documents/passport"
                                      accept="application/pdf"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {fields.length === 0 && (
                  <div className="text-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
                    No travelers added. Please add at least one member.
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <FormField
              control={control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Special Requests / Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any vegetarian meals, accessibility needs, or specific requirements..."
                      className="resize-none min-h-[100px] px-4 py-3 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:ring-emerald-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 px-8"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Save & Create Lead
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
