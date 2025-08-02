// modules/calendar/components/dialogs/event-details-dialog.tsx
// app/modules/calendar/components/dialogs/event-details-dialog.tsx
"use client";

import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  Text,
  Pencil,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditEventDialog } from "@/modules/calendar/components/dialogs/edit-event-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useDeleteEvent } from "@/modules/calendar/hooks/use-delete-event"; // Import the new hook
import type { IEvent } from "@/types/models"; // Adjust import path if needed

interface IProps {
  event: IEvent; // Or DatabaseEvent if that's the consistent type
  children: React.ReactNode;
  // Optional: Callback after successful deletion to close the main dialog or refresh data
  onDelete?: () => void;
}

export function EventDetailsDialog({ event, children, onDelete }: IProps) {
  // Get the active semester from the store (if needed for references)
  const activeSemester = useDatabaseStore((state) => state.getActiveSemester());
  const { deleteEvent } = useDeleteEvent(); // Use the new hook
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const startDate = parseISO(event.date);

  // --- Reference Extraction Logic ---
  // Extract references from description (assuming @code/class-id format)
  const extractReferences = (text: string | null) => {
    if (!text) return [];
    const mentionRegex = /@[\w\/\-]+/g;
    const matches = text.match(mentionRegex) || [];
    return matches.map((mention) => mention.substring(1)); // Remove '@' symbol
  };

  const cleanDescription = event.description
    ? event.description.replace(/@[\w\/\-]+/g, "").trim()
    : "";
  const mentions = extractReferences(event.description);

  // --- Event Duration Logic (if applicable) ---
  // This part assumes multi-day events are handled. Adjust if events are strictly single-day.
  // const eventStart = parseISO(event.date);
  // const eventEnd = event.endDate ? parseISO(event.endDate) : eventStart;
  // const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1;
  // const eventCurrentDay = differenceInDays(startDate, eventStart) + 1;
  // --- End Event Duration Logic ---

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(event.id); // Call the hook function

      setIsDeleteDialogOpen(false); // Close confirmation dialog
      onDelete?.(); // Call optional onDelete callback (e.g., to close main dialog)
    } catch (err) {
      // Error handled by the hook
      console.error("Delete error (handled by hook):", err);
      // setIsDeleteDialogOpen might be handled by hook or kept here
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Event Details
            </DialogTitle>
          </DialogHeader>
          {/* Event Title */}
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold">{event.title}</h1>
          </div>
          {/* Content */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Text size={18} />
                Description
              </h2>
              <p className="text-sm text-neutral-700">
                {cleanDescription || "No description provided."}
              </p>
            </div>
            {/* References */}
            {mentions.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-2">References</h2>
                <ul className="space-y-2">
                  {mentions.map((mention, index) => {
                    // const course = getCourseById(mention);
                    // const cls = getClassById(mention);
                    // const linkHref = course
                    //   ? `/notes/${activeSemester?.id}/${course.id}`
                    //   : cls
                    //   ? `/notes/${activeSemester?.id}/${cls.course_id}#${cls.id}`
                    //   : "#";
                    // const linkText = course ? course.name : cls ? cls.title : mention;
                    // Simple fallback for now, adjust based on your linking logic
                    const linkHref = "#"; // Placeholder
                    const linkText = mention; // Placeholder

                    return (
                      <li key={index}>
                        <Link
                          href={linkHref}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <LinkIcon size={14} />
                          {linkText}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-neutral-500" />
                <span>{format(startDate, "PPP")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-neutral-500" />
                <span>{format(startDate, "h:mm a")}</span>
              </div>
              {/* {eventTotalDays > 1 && (
                <div className="flex items-center gap-2 text-sm col-span-2">
                  <span>
                    Day {eventCurrentDay} of {eventTotalDays} •{" "}
                  </span>
                  {event.title}
                </div>
              )} */}
            </div>
          </div>
          {/* Actions */}
          <DialogFooter className="gap-2 sm:gap-0">
            <EditEventDialog event={event}>
              <Button variant="outline" className="gap-2">
                <Pencil size={16} />
                Edit
              </Button>
            </EditEventDialog>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event &quot;{event.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
