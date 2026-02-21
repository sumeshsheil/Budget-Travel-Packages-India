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

  // Upload States
  const [profileImage, setProfileImage] = useState<string[]>([]);
  const [aadharCards, setAadharCards] = useState<string[]>([]);
  const [passports, setPassports] = useState<string[]>([]);

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
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your details and travel companions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <Card className="h-fit">
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
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md relative bg-white mx-auto mb-4">
                  {profile?.image ? (
                    <Image
                      src={profile.image}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full shadow-md"
                  onClick={() => {
                    setProfileImage(profile?.image ? [profile.image] : []);
                    setEditingField("image");
                  }}
                >
                  <Pencil className="h-4 w-4 text-gray-600" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" /> Personal
                Information
              </CardTitle>
            </div>
            {editingField !== "personal" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingField("personal")}
                className="text-emerald-700"
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
                        className="pl-9 bg-gray-50 text-gray-500"
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
                        className="pl-9 bg-gray-50 text-gray-500"
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
                  <dt className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </dt>
                  <dd className="text-base font-medium">
                    {profile?.firstName || profile?.lastName
                      ? `${profile.firstName || ""} ${profile.lastName || ""}`
                      : profile?.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email Address
                  </dt>
                  <dd className="text-base font-medium">{profile?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </dt>
                  <dd className="text-base font-medium">
                    {profile?.phone || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Alternative Phone
                  </dt>
                  <dd className="text-base font-medium">
                    {profile?.altPhone || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Gender
                  </dt>
                  <dd className="text-base font-medium capitalize">
                    {profile?.gender || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Verification
                  </dt>
                  <dd className="text-base font-medium">
                    {profile?.isVerified ? (
                      <span className="text-emerald-600 flex items-center gap-1 text-sm">
                        <ShieldCheck className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1 text-sm">
                        <ShieldAlert className="w-4 h-4" /> Unverified
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> Official
              Document Verification
            </CardTitle>
            <CardDescription>
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
              <Pencil className="h-4 w-4 mr-2" /> Update Documents
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {editingField === "identity" ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 mb-6">
                <p className="text-xs text-emerald-800 leading-relaxed flex items-start gap-2">
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
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-[10px] px-2"
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
                      className="flex items-center justify-between p-3 border rounded-xl bg-emerald-50/50 border-emerald-100"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-950">
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
                  <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-2">
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
                      className="flex items-center justify-between p-3 border rounded-xl bg-purple-50/50 border-purple-100"
                    >
                      <div className="flex items-center gap-3">
                        <Plane className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-950">
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
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-xl border border-gray-100">
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
