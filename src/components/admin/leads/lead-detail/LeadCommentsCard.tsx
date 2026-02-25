"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addLeadComment } from "@/app/admin/(dashboard)/leads/actions";

interface Comment {
  _id?: string;
  text: string;
  agentName: string;
  createdAt: Date | string;
}

interface LeadCommentsCardProps {
  leadId: string;
  comments: Comment[];
  disabled?: boolean;
}

export function LeadCommentsCard({
  leadId,
  comments,
  disabled,
}: LeadCommentsCardProps) {
  const [newComment, setNewComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    startTransition(async () => {
      const result = await addLeadComment(leadId, newComment);
      if (result.success) {
        toast.success(result.message);
        setNewComment("");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            Agent Notes & Comments
          </CardTitle>
          <CardDescription>
            Internal conversation history for this lead.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment List */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {!comments || comments.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/30 rounded-md">
              No comments yet.
            </p>
          ) : (
            comments.map((comment, index) => (
              <div
                key={comment._id || index}
                className="text-sm p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-200 rounded-md border border-indigo-100 dark:border-indigo-900/50"
              >
                <p className="whitespace-pre-wrap">{comment.text}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-200/50 dark:border-indigo-800/50 text-xs text-indigo-500 dark:text-indigo-400">
                  <span className="font-medium">{comment.agentName}</span>
                  <span>
                    {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="space-y-2 pt-2">
          <Textarea
            placeholder={
              disabled
                ? "You don't have access to this lead."
                : "Write an internal note..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={disabled || isPending}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || disabled || isPending}
              size="sm"
            >
              {isPending ? (
                "Saving..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
