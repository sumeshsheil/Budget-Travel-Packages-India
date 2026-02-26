"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upload } from "@imagekit/javascript";
import Image from "next/image";
import footerLogo from "@/../public/images/logo/footer-logo.svg";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  User,
  FileText,
  ScanFace,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CameraCapture } from "@/components/admin/onboarding/CameraCapture";

// Step 1 schema
const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female", "other"], "Gender is required"),
  age: z.coerce.number().min(18, "Must be 18+").max(120),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
});

// Step 3 password
const passwordSchema = z
  .object({
    password: z.string().min(8, "Min 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PersonalData = z.infer<typeof personalSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

function OnboardingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Data across steps
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [panImage, setPanImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const personalForm = useForm<PersonalData>({
    resolver: zodResolver(personalSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      age: undefined,
      phone: "",
      address: "",
    },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Invalid Onboarding Link
          </h1>
          <p className="text-slate-500">
            This link is invalid or has expired. Please register again from the
            login page.
          </p>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
          >
            <a href="/admin/login">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4 max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Registration Complete!
          </h1>
          <p className="text-slate-500">
            Your profile has been submitted for verification. An admin will
            review your documents and activate your account. You&apos;ll be
            notified once verified.
          </p>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-medium text-amber-800">
              ⏳ Pending Admin Verification
            </p>
            <p className="text-xs text-amber-600 mt-1">
              You cannot login until your account is verified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function uploadToImageKit(
    dataUrl: string,
    fileName: string,
  ): Promise<string> {
    const authRes = await fetch("/api/auth/imagekit");
    const authParams = await authRes.json();

    // Convert data URL to file
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${fileName}.jpg`, { type: "image/jpeg" });

    const result = await upload({
      file,
      fileName: `${fileName}.jpg`,
      folder: "/agent-onboarding/",
      ...authParams,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    });

    return result.url!;
  }

  function handleStep1(data: PersonalData) {
    setPersonalData(data);
    setStep(2);
  }

  function handleStep2Next() {
    setError(null);
    if (!aadhaarNumber || aadhaarNumber.length < 12) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    if (!panNumber || panNumber.length < 10) {
      setError("Please enter a valid PAN number.");
      return;
    }
    if (!aadhaarImage) {
      setError("Please capture your Aadhaar card photo.");
      return;
    }
    if (!panImage) {
      setError("Please capture your PAN card photo.");
      return;
    }
    setStep(3);
  }

  async function handleFinalSubmit(pwData: PasswordData) {
    if (!faceImage) {
      setError("Please capture your face photo.");
      return;
    }
    if (!personalData) return;

    setIsLoading(true);
    setError(null);

    try {
      // Upload all images to ImageKit
      const [aadhaarUrl, panUrl, faceUrl] = await Promise.all([
        uploadToImageKit(aadhaarImage!, `aadhaar-${Date.now()}`),
        uploadToImageKit(panImage!, `pan-${Date.now()}`),
        uploadToImageKit(faceImage, `face-${Date.now()}`),
      ]);

      const response = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...personalData,
          aadhaarNumber,
          panNumber,
          password: pwData.password,
          aadhaarImage: aadhaarUrl,
          panImage: panUrl,
          faceImage: faceUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        return;
      }

      setDone(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const steps = [
    { num: 1, label: "Details", icon: User },
    { num: 2, label: "Documents", icon: FileText },
    { num: 3, label: "Verify", icon: ScanFace },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <Image
          src={footerLogo}
          alt="Budget Travel Packages"
          width={140}
          height={50}
          className="h-8 w-auto object-contain"
          priority
        />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Agent Onboarding
        </span>
      </div>

      {/* Stepper */}
      <div className="px-6 py-6 border-b border-slate-50">
        <div className="flex items-center justify-center gap-0 max-w-sm mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.num
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-semibold ${step >= s.num ? "text-emerald-700" : "text-slate-400"}`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 mb-4 rounded-full transition-all ${step > s.num ? "bg-emerald-500" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-lg mx-auto">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Personal Details
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Fill in your basic information to get started.
              </p>

              <Form {...personalForm}>
                <form
                  onSubmit={personalForm.handleSubmit(handleStep1)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={personalForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="John"
                              className="h-11 rounded-xl text-slate-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Doe"
                              className="h-11 rounded-xl text-slate-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={personalForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Gender
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select" />
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
                    <FormField
                      control={personalForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">
                            Age
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={18}
                              placeholder="25"
                              className="h-11 rounded-xl text-slate-900"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={personalForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+91 9876543210"
                            className="h-11 rounded-xl text-slate-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={personalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Full address"
                            className="h-11 rounded-xl text-slate-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-4"
                  >
                    Next: Documents
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {/* STEP 2: Documents */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Identity Documents
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Use your camera to capture photos of your documents. No file
                uploads — camera only.
              </p>

              <div className="space-y-6">
                {/* Aadhaar */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Aadhaar Number
                  </label>
                  <Input
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="1234 5678 9012"
                    maxLength={14}
                    className="h-11 rounded-xl text-slate-900"
                  />
                  <CameraCapture
                    label="Capture Aadhaar Card"
                    onCapture={setAadhaarImage}
                    capturedImage={aadhaarImage}
                    autoStart={true}
                  />
                </div>

                {/* PAN */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">
                    PAN Number
                  </label>
                  <Input
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className="h-11 rounded-xl text-slate-900"
                  />
                  <CameraCapture
                    label="Capture PAN Card"
                    onCapture={setPanImage}
                    capturedImage={panImage}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleStep2Next}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Next: Face Verify
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Face + Password + Submit */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Face Verification & Password
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Take a clear photo of your face and set your login password.
              </p>

              <div className="space-y-6">
                <CameraCapture
                  label="Capture Your Face"
                  onCapture={setFaceImage}
                  capturedImage={faceImage}
                  autoStart={step === 3}
                />

                <div className="border-t border-slate-100 pt-6">
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(handleFinalSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Create Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Min 8 characters"
                                  className="h-11 rounded-xl pr-12 text-slate-900"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-700">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="password"
                                placeholder="Re-enter password"
                                className="h-11 rounded-xl text-slate-900"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="flex-1 h-12 rounded-xl"
                          disabled={isLoading}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          {isLoading
                            ? "Submitting..."
                            : "Complete Registration"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
