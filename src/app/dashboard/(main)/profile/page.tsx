"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MembersSection from "./MembersSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  User,
  Mail,
  Phone,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Plane,
  FileText,
  Pencil,
  X,
  Check,
  Calendar,
} from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { OtpInput } from "@/components/landing/sections/booking/components/OtpInput";

const OTP_LENGTH = 4;
const INDIA_PHONE_REGEX = /^[6-9]\d{9}$/;

interface UserProfile {
  _id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  phone?: string;
  altPhone?: string;
  image?: string;
  gender?: string;
  travelPreference?: string;
  role: string;
  createdAt: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  documents?: {
    aadharCard: string[];
    passport: string[];
  };
}

export default function ProfilePage() {
  const { update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [gender, setGender] = useState<string>("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // Upload States
  const [profileImage, setProfileImage] = useState<string[]>([]);
  const [aadharCards, setAadharCards] = useState<string[]>([]);
  const [passports, setPassports] = useState<string[]>([]);

  // OTP Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/customer/profile");
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);

        // Populate form
        setFirstName(data.user.firstName || "");
        setLastName(data.user.lastName || "");
        setEmail(data.user.email || "");
        setPhone(data.user.phone || "");
        setAltPhone(data.user.altPhone || "");
        setGender(data.user.gender || "");
        setIsPhoneVerified(data.user.isPhoneVerified || false);

        if (data.user.image) {
          setProfileImage([data.user.image]);
        }

        if (data.user.documents) {
          setAadharCards(data.user.documents.aadharCard || []);
          setPassports(data.user.documents.passport || []);
        }
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveField = async (
    fieldToSave: string,
    payload: Partial<UserProfile>,
  ) => {
    if (fieldToSave === "gender" && !payload.gender) {
      toast.error("Please select a gender");
      return;
    }
    if (
      fieldToSave === "identity" &&
      (!payload.documents?.aadharCard ||
        payload.documents.aadharCard.length === 0) &&
      (!profile?.documents?.aadharCard ||
        profile.documents.aadharCard.length === 0)
    ) {
      toast.error("Aadhar Card is mandatory for verification");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update profile");
      } else {
        setProfile(data.user);
        toast.success("Profile updated successfully");
        setEditingField(null);
        await update();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || !INDIA_PHONE_REGEX.test(phone)) {
      toast.error("Please enter a valid 10-digit Indian phone number");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, countryCode: "91" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setVerificationId(data.verificationId);
      setOtpSent(true);
      setCooldown(60);
      toast.success(`OTP sent to +91 ${phone}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const currentOtp = typeof otpValue === "string" ? otpValue : otp;

    if (currentOtp.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId,
          otp: currentOtp,
          phone,
          countryCode: "91",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      setIsPhoneVerified(true);
      setOtpSent(false);
      setOtp("");
      toast.success("Phone verified successfully!");

      // Save phone to profile
      try {
        const profileRes = await fetch("/api/customer/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setProfile(profileData.user);
        }
      } catch {
        // Phone save failed, but verification was successful
        console.error("Failed to save phone to profile");
      }

      await update(); // Update session
    } catch (err: any) {
      setOtpError(err.message || "Invalid OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4 md:px-0 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Your Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your details and travel companions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Card className="h-fit border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-base text-center">
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {editingField === "image" ? (
              <div className="w-full space-y-3">
                <ImageUpload
                  value={profileImage}
                  onChange={setProfileImage}
                  onRemove={(url) =>
                    setProfileImage(
                      profileImage.filter((current) => current !== url),
                    )
                  }
                  maxFiles={1}
                  folder="/profile-pictures"
                  accept="image/*"
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleSaveField("image", { image: profileImage[0] || "" })
                    }
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}{" "}
                    Save Image
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingField(null);
                      setProfileImage(profile?.image ? [profile.image] : []);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-card shadow-md relative bg-card mx-auto mb-4">
                  {profile?.image ? (
                    <Image
                      src={profile.image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-md bg-white dark:bg-slate-900 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
                  onClick={() => {
                    setProfileImage(profile?.image ? [profile.image] : []);
                    setEditingField("image");
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!editingField && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Click edit to update photo
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" /> Personal
                Information
              </CardTitle>
            </div>
            {editingField !== "personal" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingField("personal")}
                className="bg-white dark:bg-slate-900 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700"
              >
                <Pencil className="h-4 w-4 mr-2" /> Edit Info
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {editingField === "personal" ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Email (Unchangeable)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={email}
                        disabled
                        className="pl-9 bg-muted/50 text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Main Phone (Unchangeable)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={phone}
                        disabled
                        className="pl-9 bg-muted/50 text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Alternative Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        className="pl-9"
                        placeholder="Optional alternative phone"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingField(null);
                      setFirstName(profile?.firstName || "");
                      setLastName(profile?.lastName || "");
                      setAltPhone(profile?.altPhone || "");
                      setGender(profile?.gender || "");
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() =>
                      handleSaveField("personal", {
                        firstName,
                        lastName,
                        altPhone,
                        gender,
                      })
                    }
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}{" "}
                    Save Info
                  </Button>
                </div>
              </div>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Full Name
                  </dt>
                  <dd className="text-base font-semibold text-slate-900 dark:text-white">
                    {profile?.firstName || profile?.lastName
                      ? `${profile.firstName || ""} ${profile.lastName || ""}`
                      : profile?.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Email Address
                  </dt>
                  <dd className="text-base font-medium text-slate-900 dark:text-white">
                    {profile?.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Phone Number
                  </dt>
                  <dd className="text-base font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    {phone || profile?.phone ? (
                      <>
                        +91 {phone || profile?.phone}
                        {isPhoneVerified ? (
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0 h-5 text-[10px] px-1.5"
                          >
                            <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 border-0 h-5 text-[10px] px-1.5"
                          >
                            <ShieldAlert className="w-3 h-3 mr-0.5" />{" "}
                            Unverified
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">
                        Not provided
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Alternative Phone
                  </dt>
                  <dd className="text-base font-medium text-slate-900 dark:text-white">
                    {profile?.altPhone || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Gender
                  </dt>
                  <dd className="text-base font-medium capitalize text-slate-900 dark:text-white">
                    {profile?.gender || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Verification
                  </dt>
                  <dd className="text-base font-medium">
                    {profile?.isVerified ? (
                      <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1 text-sm">
                        <ShieldCheck className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      <span className="text-red-500 dark:text-red-400 flex items-center gap-1 text-sm">
                        <ShieldAlert className="w-4 h-4" /> Unverified
                      </span>
                    )}
                  </dd>
                </div>

                {/* Phone Verification Flow — only when NOT verified */}
                {!isPhoneVerified && (
                  <div className="sm:col-span-2">
                    {otpSent ? (
                      <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              Enter Verification Code
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              4-digit code sent to{" "}
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                +91 {phone}
                              </span>
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                              setOtpError("");
                            }}
                            className="h-7 w-7 p-0 rounded-full"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex justify-center">
                          <OtpInput
                            value={otp}
                            onChange={(val) => {
                              setOtp(val);
                              setOtpError("");
                              if (val.length === OTP_LENGTH)
                                handleVerifyOtp(val);
                            }}
                            length={OTP_LENGTH}
                            error={otpError}
                            disabled={isVerifying}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <button
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                              setOtpError("");
                            }}
                            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                          >
                            Change Number
                          </button>
                          {cooldown > 0 ? (
                            <span className="text-slate-400 dark:text-slate-500 tabular-nums">
                              Resend in {cooldown}s
                            </span>
                          ) : (
                            <button
                              onClick={handleSendOtp}
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                              disabled={isVerifying}
                            >
                              Resend Code
                            </button>
                          )}
                        </div>
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 h-10"
                          onClick={() => handleVerifyOtp()}
                          disabled={isVerifying || otp.length !== OTP_LENGTH}
                        >
                          {isVerifying ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Verify Phone
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl space-y-3 animate-in fade-in duration-300">
                        <div className="flex items-start gap-3">
                          <ShieldAlert className="h-5 w-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-red-800 dark:text-red-200">
                              Phone Not Verified
                            </p>
                            <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                              Verify your phone to unlock trip planning from the
                              dashboard.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 select-none pointer-events-none border-r border-slate-300 dark:border-slate-600 pr-2 h-5">
                              <Image
                                src="/images/flag/india.jpg"
                                alt="India"
                                width={20}
                                height={14}
                                className="rounded-sm object-cover"
                              />
                              <span className="text-xs">+91</span>
                            </div>
                            <Input
                              type="tel"
                              value={phone}
                              onChange={(e) => {
                                const val = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10);
                                setPhone(val);
                              }}
                              placeholder="Enter phone number"
                              maxLength={10}
                              className="pl-22 h-10 bg-white dark:bg-slate-800"
                            />
                          </div>
                          <Button
                            onClick={handleSendOtp}
                            disabled={
                              isVerifying ||
                              !phone ||
                              !INDIA_PHONE_REGEX.test(phone)
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 h-10 px-5 shrink-0"
                          >
                            {isVerifying ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Send OTP"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </dl>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row  justify-between pb-2">
          <div>
            <CardTitle className="flex items-center whitespace-nowrap mb-2 gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />{" "}
              Official Document Verification
            </CardTitle>
            <CardDescription className="text-sm">
              Submit your government-issued identification to complete your
              profile verification.
            </CardDescription>
          </div>
          {editingField !== "identity" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingField("identity")}
              className="text-emerald-700"
            >
              <Pencil className="h-4 w-4 mr-2" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {editingField === "identity" ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 mb-6">
                <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    <strong>Verification Guidelines:</strong> Please upload a
                    high-quality PDF containing both the{" "}
                    <strong>front and back</strong> of your document in a single
                    file. For security, once a mandatory document is verified,
                    it can be updated but not removed.
                  </span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold">Aadhar Card</label>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border-0 text-[10px] px-2"
                    >
                      Required for 100% Profile
                    </Badge>
                  </div>
                  <ImageUpload
                    value={aadharCards}
                    onChange={setAadharCards}
                    onRemove={(url) => {
                      toast.info(
                        "Aadhar cannot be deleted. Use the 'Replace File' button to update it.",
                      );
                    }}
                    maxFiles={1}
                    folder="/documents/aadhar"
                    accept="application/pdf"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold">Passport</label>
                    <Badge variant="outline" className="text-[10px] px-2">
                      Optional Document
                    </Badge>
                  </div>
                  <ImageUpload
                    value={passports}
                    onChange={setPassports}
                    onRemove={(url) => {
                      toast.info(
                        "Passport cannot be deleted. Use the 'Replace File' button to update it.",
                      );
                    }}
                    maxFiles={1}
                    folder="/documents/passport"
                    accept="application/pdf"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingField(null);
                    setAadharCards(profile?.documents?.aadharCard || []);
                    setPassports(profile?.documents?.passport || []);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() =>
                    handleSaveField("identity", {
                      documents: {
                        aadharCard: aadharCards,
                        passport: passports,
                      },
                    })
                  }
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}{" "}
                  Save Documents
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  Aadhar Card
                </h4>
                {profile?.documents?.aadharCard?.length ? (
                  profile.documents.aadharCard.map((url, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-950 dark:text-emerald-300">
                          Aadhar #{i + 1}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="h-8">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center gap-2">
                    <X className="w-4 h-4" /> No Aadhar uploaded
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  Passport
                </h4>
                {profile?.documents?.passport?.length ? (
                  profile.documents.passport.map((url, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <Plane className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-950 dark:text-purple-300">
                          Passport #{i + 1}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="h-8">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border">
                    No passport uploaded.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <MembersSection />
    </div>
  );
}
