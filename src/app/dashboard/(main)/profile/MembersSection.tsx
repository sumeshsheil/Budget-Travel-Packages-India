"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Plane,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/image-upload";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IMember {
  name: string;
  email?: string;
  gender: "male" | "female" | "other";
  age: number;
  documents?: {
    aadharCard: string[];
    passport: string[];
  };
}

export default function MembersSection() {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [aadharCards, setAadharCards] = useState<string[]>([]);
  const [passports, setPassports] = useState<string[]>([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/members");
      const data = await res.json();
      if (res.ok) {
        setMembers(data.members || []);
      } else {
        toast.error(data.error || "Failed to load members");
      }
    } catch (error) {
      toast.error("Something went wrong loading members");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setGender("");
    setAge("");
    setAadharCards([]);
    setPassports([]);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    const member = members[index];
    setName(member.name);
    setEmail(member.email || "");
    setGender(member.gender);
    setAge(member.age.toString());
    setAadharCards(member.documents?.aadharCard || []);
    setPassports(member.documents?.passport || []);
    setEditIndex(index);
    setIsEditing(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    const updatedMembers = [...members];
    updatedMembers.splice(index, 1);

    await saveBulkMembers(updatedMembers);
  };

  const saveBulkMembers = async (updatedMembers: IMember[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/customer/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMembers),
      });

      const data = await res.json();
      if (res.ok) {
        setMembers(data.members);
        toast.success("Members updated successfully");
        resetForm();
      } else {
        toast.error(data.error || "Failed to update members");
      }
    } catch (error) {
      toast.error("Something went wrong modifying members");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !gender || !age) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    if (aadharCards.length === 0) {
      toast.error("Aadhar Card is mandatory for verification");
      return;
    }

    const newMember: IMember = {
      name,
      email: email.trim() || undefined,
      gender: gender as "male" | "female" | "other",
      age: parseInt(age, 10),
      documents: {
        aadharCard: aadharCards,
        passport: passports,
      },
    };

    if (editIndex !== null) {
      const updatedMembers = [...members];
      updatedMembers[editIndex] = newMember;
      await saveBulkMembers(updatedMembers);
    } else {
      if (members.length >= 30) {
        toast.error("You cannot add more than 30 members.");
        return;
      }

      setSaving(true);
      try {
        const res = await fetch("/api/customer/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMember),
        });

        const data = await res.json();
        if (res.ok) {
          setMembers(data.members);
          toast.success("Member added successfully");
          resetForm();
        } else {
          toast.error(data.error || "Failed to add member");
        }
      } catch (error) {
        toast.error("Something went wrong adding member");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Family & Companions
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage details for people you frequently travel with (up to 30
            members).
          </p>
        </div>
        {!isEditing && members.length < 30 && (
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-2 whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4" /> Add Member
          </Button>
        )}
      </div>

      {isEditing && (
        <Card className="border-emerald-100 py-0 dark:border-emerald-900/50 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/30 border-b border-emerald-100/50 dark:border-emerald-900/30 py-4">
            <CardTitle className="text-emerald-800 dark:text-emerald-300 text-base">
              {editIndex !== null ? "Edit Member" : "Add New Member"}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2.5">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                  className="border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div className="flex gap-4 md:col-span-2 w-full">
                <div className="space-y-2.5 flex-1">
                  <label className="text-sm font-medium">Gender *</label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger className="w-full border border-slate-200 dark:border-slate-800">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 flex-1">
                  <label className="text-sm font-medium">Age *</label>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    value={age}
                    className="border w-full border-slate-200 dark:border-slate-800"
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-6 pt-4 border-t dark:border-gray-800 border-gray-100">
                <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4">
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>
                      <strong>Verification Required:</strong> Companion Aadhar
                      Card is mandatory. Please upload a high-quality PDF
                      containing both front and back.
                    </span>
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold">Aadhar Card *</label>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border-0 text-[10px] px-2"
                      >
                        Mandatory
                      </Badge>
                    </div>
                    <ImageUpload
                      value={aadharCards}
                      onChange={setAadharCards}
                      onRemove={() =>
                        toast.info(
                          "Aadhar is required. Replace the file to update.",
                        )
                      }
                      maxFiles={1}
                      folder="/documents/aadhar"
                      accept="application/pdf"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-sm font-bold">Passport</label>
                      <Badge variant="outline" className="text-[10px] px-2">
                        Optional
                      </Badge>
                    </div>
                    <ImageUpload
                      value={passports}
                      onChange={setPassports}
                      onRemove={() => toast.info("Passport removed.")}
                      maxFiles={1}
                      folder="/documents/passport"
                      accept="application/pdf"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 mt-3 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-xl border-t border-slate-200 dark:border-slate-700 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {!isEditing && members.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {members.map((member, idx) => (
            <Card
              key={idx}
              className="group hover:shadow-md transition-all duration-200 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-200 dark:hover:border-emerald-800"
            >
              <CardContent className="p-4 relative">
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    onClick={() => handleEdit(idx)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => handleDelete(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white pr-12 truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {member.email || "No email"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300 capitalize border border-slate-200 dark:border-slate-700">
                      {member.gender}
                    </span>
                    <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 px-2 py-1 rounded">
                      {member.age} yrs
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {member.documents?.aadharCard?.[0] ? (
                      <a
                        href={member.documents.aadharCard[0]}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <ShieldCheck className="h-3 w-3" /> Aadhar
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/50">
                        <ShieldAlert className="h-3 w-3" /> No Aadhar
                      </span>
                    )}
                    {member.documents?.passport?.[0] ? (
                      <a
                        href={member.documents.passport[0]}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[10px] font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded-lg border border-purple-100 dark:border-purple-900/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        <Plane className="h-3 w-3" /> Passport
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/50">
                        <Plane className="h-3 w-3" /> No Passport
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isEditing && members.length === 0 && (
        <div className="text-center py-10 px-4  bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <Users className="h-8 w-8 text-emerald-400/70 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            No companions added yet.
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <UserPlus className="h-4 w-4 mr-2" /> Add Companion
          </Button>
        </div>
      )}
    </div>
  );
}
