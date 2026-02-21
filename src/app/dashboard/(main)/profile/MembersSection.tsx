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
import { Users, UserPlus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface IMember {
  name: string;
  email?: string;
  gender: "male" | "female" | "other";
  age: number;
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
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    const member = members[index];
    setName(member.name);
    setEmail(member.email || "");
    setGender(member.gender);
    setAge(member.age.toString());
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

    const newMember: IMember = {
      name,
      email: email.trim() || undefined,
      gender: gender as "male" | "female" | "other",
      age: parseInt(age, 10),
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
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
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
        <Card className="border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/50 py-4">
            <CardTitle className="text-emerald-800 text-base">
              {editIndex !== null ? "Edit Member" : "Add New Member"}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Jane Doe"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E.g. jane@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Gender *</label>
                <Select value={gender} onValueChange={setGender} required>
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Age *</label>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="E.g. 28"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50/50 flex justify-end gap-3 rounded-b-xl border-t py-3">
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
              className="group hover:shadow-md transition-all duration-200 border-gray-200"
            >
              <CardContent className="p-4 relative">
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => handleEdit(idx)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(idx)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 pr-12 truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.email || "No email"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 capitalize">
                      {member.gender}
                    </span>
                    <span className="bg-emerald-50/50 text-emerald-800 border border-emerald-100 px-2 py-1 rounded">
                      {member.age} yrs
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isEditing && members.length === 0 && (
        <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Users className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-4">No companions added yet.</p>
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
