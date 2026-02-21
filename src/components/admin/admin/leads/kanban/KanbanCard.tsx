"use client";

import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";
import { format } from "date-fns";
import { MapPin, Calendar, User as UserIcon, Banknote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { KanbanLead } from "./types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface KanbanCardProps {
  lead: KanbanLead;
}

export function KanbanCard({ lead }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead._id,
      data: { lead },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-card p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing touch-none relative group hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 select-none",
        isDragging && "opacity-90 z-50 shadow-xl rotate-2 scale-105",
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm line-clamp-1">
          {lead.travelers?.[0]?.name || "Unknown"}
        </h4>
        <Link
          href={`/admin/leads/${lead._id}`}
          className="absolute inset-0 z-10"
          onClick={(e) => isDragging && e.preventDefault()}
        />
        {lead.tripType === "international" ? (
          <Badge
            variant="secondary"
            className="text-[10px] h-5 px-1 bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            Intl
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="text-[10px] h-5 px-1 bg-green-50 text-green-700 hover:bg-green-50"
          >
            Dom
          </Badge>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{lead.destination}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>{lead.travelDate}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 font-medium text-emerald-600">
            <Banknote className="h-3 w-3" />₹
            {lead.budget >= 1000
              ? `${(lead.budget / 1000).toFixed(1)}k`
              : lead.budget}
          </div>
          <div className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            {lead.guests}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <span className="text-[10px] text-muted-foreground">
          {format(new Date(lead.createdAt), "MMM d")}
        </span>

        {lead.agentId ? (
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[9px] bg-emerald-100 text-emerald-700">
              {lead.agentId.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-5 w-5 rounded-full border border-dashed flex items-center justify-center">
            <span className="text-[8px] text-muted-foreground">-</span>
          </div>
        )}
      </div>
    </div>
  );
}
