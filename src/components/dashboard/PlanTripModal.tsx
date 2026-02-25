"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ShieldAlert,
  CalendarIcon,
  Loader2,
  Plane,
  Check,
  ChevronsUpDown,
  Plus,
  Minus,
  Users,
  Globe,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";

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

const travelerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(0, "Age is required"),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

const tripFormSchema = z.object({
  tripType: z.enum(["domestic", "international"]),
  departureCity: z.string().min(2, "Departure city is required"),
  destination: z.string().min(2, "Destination is required"),
  travelDate: z.date().refine((val) => !!val, "Travel date is required") as any,
  duration: z.string().min(1, "Duration is required"),
  guests: z.coerce.number().min(1, "At least 1 guest is required"),
  budget: z.coerce.number().min(1, "Budget is required"),
  specialRequests: z.string().optional(),
  travelers: z.array(travelerSchema).optional(),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

interface PlanTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    phone?: string;
    gender?: string;
    isPhoneVerified: boolean;
  };
}

export const PlanTripModal: React.FC<PlanTripModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [profileMembers, setProfileMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProfileMembers();
    }
  }, [isOpen]);

  const fetchProfileMembers = async () => {
    try {
      setIsLoadingMembers(true);
      const res = await fetch("/api/customer/members");
      const data = await res.json();
      if (res.ok) {
        setProfileMembers(data.members || []);
      }
    } catch (error) {
      console.error("Failed to fetch profile members", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema) as any,
    defaultValues: {
      tripType: "domestic",
      departureCity: "",
      destination: "",
      duration: "1 Day",
      guests: 1,
      budget: 0,
      specialRequests: "",
      travelers: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "travelers",
  });

  const guests = form.watch("guests");
  const tripType = form.watch("tripType");
  const duration = form.watch("duration");
  const budget = form.watch("budget");
  const { setValue } = form;

  // Sync companions with guest count
  useEffect(() => {
    const requiredCompanions = Math.max(0, guests - 1);
    if (fields.length !== requiredCompanions) {
      if (fields.length < requiredCompanions) {
        for (let i = fields.length; i < requiredCompanions; i++) {
          append({ name: "", age: 0, gender: "male" });
        }
      } else {
        for (let i = fields.length - 1; i >= requiredCompanions; i--) {
          remove(i);
        }
      }
    }
  }, [guests, fields.length, append, remove]);

  // Dynamic Budget Calculation
  React.useEffect(() => {
    const days = parseInt(duration) || 1;
    const ratePerPersonPerDay = tripType === "international" ? 7000 : 3000;
    const calculatedMinBudget = guests * days * ratePerPersonPerDay;
    if (budget < calculatedMinBudget) {
      setValue("budget", calculatedMinBudget);
    }
  }, [tripType, duration, guests, budget, setValue]);

  const onSubmit = async (values: TripFormValues) => {
    setIsSubmitting(true);
    try {
      const names = user.name.split(" ");
      const firstName = names[0] || "Customer";
      const lastName = names.slice(1).join(" ") || "-";

      const primaryTraveler = {
        name: user.name,
        email: user.email,
        phone: user.phone || "0000000000",
        age: 25,
        gender: (user.gender as any) || "male",
      };

      const allTravelers = [primaryTraveler, ...(values.travelers || [])];

      const payload = {
        tripType: values.tripType,
        departureCity: values.departureCity,
        destination: values.destination,
        travelDate: format(values.travelDate, "dd/MM/yyyy"),
        duration: values.duration,
        guests: values.guests,
        budget: values.budget,
        specialRequests: values.specialRequests,
        primaryContact: {
          firstName,
          lastName,
          email: user.email,
          phone: user.phone || "0000000000",
          age: 25,
          gender: (user.gender as any) || "male",
        },
        travelers: allTravelers,
      };

      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit trip plan");
      }

      toast.success("Trip plan submitted successfully!");
      onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Unified input style matching dashboard design
  const inputStyles =
    "h-14! w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50 px-6 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-emerald-500/20 focus:border-emerald-500/40 dark:focus:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        data-lenis-prevent
        className="w-full md:max-w-3xl p-0 overflow-y-auto max-h-[90vh] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl scrollbar-hide focus:outline-none"
      >
        <div className="p-6 md:p-10 lg:p-14">
          <DialogHeader className="mb-10">
            {!user.isPhoneVerified && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-red-900 dark:text-red-200">
                    Phone Verification Required
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    Please verify your phone number in your profile before
                    submitting a trip plan.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-red-800 dark:text-red-400 font-bold text-xs underline decoration-2 underline-offset-4"
                    asChild
                  >
                    <Link href="/dashboard/profile">Go to Profile</Link>
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                <Plane className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <DialogTitle className="text-3xl md:text-4xl font-inter font-medium tracking-tight text-slate-900 dark:text-white">
                  Plan Your Trip
                </DialogTitle>
                <DialogDescription className="text-base text-slate-500 dark:text-slate-400 mt-1">
                  Enter your travel details to get a custom itinerary.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              <div className="space-y-10">
                {/* Row 1: Departure & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  <FormField
                    control={form.control}
                    name="departureCity"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                          Departure City
                        </FormLabel>
                        <Popover
                          open={isDepartureOpen}
                          onOpenChange={setIsDepartureOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isDepartureOpen}
                                className={cn(
                                  inputStyles,
                                  "w-full justify-between font-normal text-left",
                                  !field.value &&
                                    "text-slate-400 dark:text-slate-500",
                                )}
                              >
                                {field.value
                                  ? DEPARTURE_CITIES.find(
                                      (city) => city === field.value,
                                    )
                                  : "Select departure city..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[320px] p-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
                            align="start"
                          >
                            <Command className="rounded-2xl border-none bg-transparent">
                              <CommandInput
                                placeholder="Search city..."
                                className="h-12 text-slate-900 dark:text-slate-100"
                              />
                              <CommandList>
                                <CommandEmpty className="text-slate-500 dark:text-slate-400 py-4 text-center text-sm">
                                  No city found.
                                </CommandEmpty>
                                <CommandGroup className="max-h-[300px] overflow-y-auto p-2">
                                  {DEPARTURE_CITIES.map((city) => (
                                    <CommandItem
                                      key={city}
                                      value={city}
                                      onSelect={(currentValue) => {
                                        form.setValue(
                                          "departureCity",
                                          currentValue === field.value
                                            ? ""
                                            : currentValue,
                                        );
                                        setIsDepartureOpen(false);
                                      }}
                                      className="rounded-lg py-3 cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 data-[selected=true]:bg-emerald-50 dark:data-[selected=true]:bg-emerald-500/10"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400",
                                          field.value === city
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {city}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                          Destination
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Maldives, Paris, Bali..."
                            className={inputStyles}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Trip Type & Travel Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  <FormField
                    control={form.control}
                    name="tripType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                          Trip Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                inputStyles,
                                "pl-12 relative overflow-hidden flex",
                              )}
                            >
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Globe className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <SelectValue placeholder="Select trip type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1">
                            <SelectItem
                              value="domestic"
                              className="rounded-lg py-3 text-slate-700 dark:text-slate-300 focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-300"
                            >
                              Domestic
                            </SelectItem>
                            <SelectItem
                              value="international"
                              className="rounded-lg py-3 text-slate-700 dark:text-slate-300 focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-300"
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
                    control={form.control}
                    name="travelDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                          Travel Date
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  inputStyles,
                                  "w-full text-left font-normal flex items-center justify-between",
                                  !field.value &&
                                    "text-slate-400 dark:text-slate-500",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select travel date...</span>
                                )}
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const minDate = new Date();
                                minDate.setHours(0, 0, 0, 0);
                                minDate.setDate(minDate.getDate() + 2);
                                return date < minDate;
                              }}
                              initialFocus
                              className="rounded-2xl p-4"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Trip Duration & Guest Counter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                          Trip Duration
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                inputStyles,
                                "pl-12 relative overflow-hidden flex",
                              )}
                            >
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Clock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                              </div>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            data-lenis-prevent
                            position="popper"
                            className="w-(--radix-select-trigger-width) max-h-60 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-1"
                          >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(
                              (day) => {
                                const value = `${day} Day${day > 1 ? "s" : ""}`;
                                return (
                                  <SelectItem
                                    key={day}
                                    value={value}
                                    className="rounded-lg py-2 text-slate-700 dark:text-slate-300 focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-300"
                                  >
                                    {value}
                                  </SelectItem>
                                );
                              },
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                          Guests
                        </FormLabel>
                        <FormControl>
                          <div
                            className={cn(
                              inputStyles,
                              "flex items-center justify-between gap-3 p-1 px-2 border shadow-sm",
                            )}
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 shrink-0 transition-all active:scale-95"
                              onClick={() =>
                                field.onChange(Math.max(1, field.value - 1))
                              }
                            >
                              <Minus className="h-5 w-5" />
                            </Button>
                            <div className="flex-1 text-center">
                              <Input
                                type="number"
                                {...field}
                                className="h-10 border-none bg-transparent text-center font-bold text-2xl text-slate-900 dark:text-white focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full p-0"
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  field.onChange(isNaN(val) ? 1 : val);
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 shrink-0 transition-all active:scale-95"
                              onClick={() => field.onChange(field.value + 1)}
                            >
                              <Plus className="h-5 w-5" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 4: Budget */}
                <div className="grid grid-cols-1 gap-8">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            Budget Range (₹)
                          </FormLabel>
                          {field.value > 0 && (
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
                              Recommended: ₹
                              {(
                                guests *
                                (parseInt(duration) || 1) *
                                (tripType === "international" ? 7000 : 3000)
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <FormControl>
                          <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium text-lg group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors">
                              ₹
                            </span>
                            <Input
                              type="number"
                              min={1}
                              className={cn(
                                inputStyles,
                                "pl-12 font-bold text-slate-900 dark:text-white text-xl",
                              )}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-slate-100 dark:bg-slate-800" />

              {/* Travel Companions Section */}
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-[0.15em]">
                      <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Travel Companions ({Math.max(0, guests - 1)} required)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {guests > 1
                        ? `Please select the ${guests - 1} companion(s) traveling with you.`
                        : "Traveling alone? No companions needed."}
                    </p>
                  </div>
                </div>

                {guests > 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field, index) => {
                      const travelerData = form.watch(`travelers.${index}`);
                      const isSelected = !!travelerData?.name;

                      return (
                        <div
                          key={field.id}
                          className="p-3.5 border border-slate-200 dark:border-slate-700/60 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between group hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:bg-emerald-50/50 dark:hover:bg-slate-800/70 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden flex-1">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-100 dark:border-emerald-500/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors shadow-sm">
                              {isSelected ? (
                                <span className="text-sm font-bold">
                                  {travelerData.name.charAt(0).toUpperCase()}
                                </span>
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              {isSelected ? (
                                <div className="flex flex-col">
                                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {travelerData.name}
                                  </p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide flex items-center gap-1.5">
                                    <span>{travelerData.age}y</span>
                                    <span className="opacity-30">•</span>
                                    <span className="capitalize">
                                      {travelerData.gender}
                                    </span>
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 italic">
                                  Not selected
                                </p>
                              )}
                            </div>
                          </div>

                          <Popover
                            open={openPopoverIndex === index}
                            onOpenChange={(open) =>
                              setOpenPopoverIndex(open ? index : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="rounded-xl h-9 px-2.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs ring-1 ring-emerald-100 dark:ring-emerald-500/20 hover:ring-emerald-200 dark:hover:ring-emerald-500/40 transition-all ml-3 shrink-0"
                              >
                                {isSelected ? "Change" : "Select"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[300px] p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
                              align="end"
                            >
                              <div className="space-y-1">
                                <div className="px-1 py-1">
                                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">
                                    Select Traveler
                                  </p>
                                  {profileMembers.length > 0 ? (
                                    <div className="max-h-[280px] overflow-y-auto space-y-1">
                                      {profileMembers.map((member, idx) => {
                                        const isAddedInOtherSlot = fields.some(
                                          (f, i) =>
                                            i !== index &&
                                            f.name === member.name,
                                        );
                                        const isSelectedInThisSlot =
                                          travelerData?.name === member.name;
                                        const isMissingAadhar =
                                          !member.documents?.aadharCard?.length;

                                        return (
                                          <button
                                            key={idx}
                                            type="button"
                                            disabled={
                                              isAddedInOtherSlot ||
                                              isSelectedInThisSlot ||
                                              isMissingAadhar
                                            }
                                            className={cn(
                                              "w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group",
                                              isAddedInOtherSlot ||
                                                isSelectedInThisSlot ||
                                                isMissingAadhar
                                                ? "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50"
                                                : "hover:bg-emerald-50/80 dark:hover:bg-emerald-500/10",
                                            )}
                                            onClick={() => {
                                              update(index, {
                                                name: member.name,
                                                age: member.age,
                                                gender: member.gender,
                                                email: member.email || "",
                                              });
                                              setOpenPopoverIndex(null);
                                            }}
                                          >
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 truncate">
                                                  {member.name}
                                                </p>
                                                {isMissingAadhar && (
                                                  <Badge
                                                    variant="destructive"
                                                    className="h-4 px-1.5 text-[8px] uppercase tracking-tighter"
                                                  >
                                                    Missing Aadhar
                                                  </Badge>
                                                )}
                                              </div>
                                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                                {member.age} yrs •{" "}
                                                {member.gender}
                                              </p>
                                            </div>
                                            {isAddedInOtherSlot ||
                                            isSelectedInThisSlot ? (
                                              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            ) : isMissingAadhar ? (
                                              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
                                            ) : (
                                              <Plus className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="text-center py-6">
                                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        No saved members found.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-2xl bg-slate-50/30 dark:bg-slate-800/20">
                    <div className="bg-white dark:bg-slate-800/60 h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-700/50 text-slate-300 dark:text-slate-600">
                      <Users className="h-7 w-7" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold tracking-tight">
                      Solo Trip
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[220px] mx-auto mt-2 leading-relaxed">
                      Increase the guest count if you&apos;re traveling with
                      family or friends.
                    </p>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <FormField
                control={form.control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1 mb-2">
                      Special Requests (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your preferences, dietary requirements, or specific attractions you want to visit..."
                        className="rounded-2xl border border-slate-200 dark:border-slate-700/60 min-h-[140px] bg-slate-50/50 dark:bg-slate-800/40 p-6 focus-visible:ring-emerald-500/20 text-base resize-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 rounded-2xl h-16 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all border border-slate-200 dark:border-slate-700"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  className="flex-2 rounded-2xl h-16 bg-new-blue hover:brightness-110 text-white font-bold text-lg shadow-xl shadow-blue-100 dark:shadow-blue-900/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:grayscale border-none"
                  disabled={isSubmitting || !user.isPhoneVerified}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Crafting Itinerary...</span>
                    </div>
                  ) : (
                    "Create Trip"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
