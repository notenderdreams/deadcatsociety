// app/modules/calendar/components/dialogs/event-details-dialog.tsx
"use client";

import { format, parseISO } from "date-fns";
import { Calendar, Clock, Text, Pencil, Trash2 } from "lucide-react"; // Import Trash2 icon
import { Button } from "@/components/ui/button";
import { EditEventDialog } from "@/modules/calendar/components/dialogs/edit-event-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription, // Import DialogDescription
  DialogFooter, // Import DialogFooter for actions
} from "@/components/ui/dialog";
import type { IEvent } from "@/modules/calendar/interfaces";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react"; // Import useState for dialog control

interface IProps {
  event: IEvent;
  children: React.ReactNode;
  // Optional: Callback after successful deletion to close the main dialog or refresh data
  onDelete?: () => void;
}

export function EventDetailsDialog({ event, children, onDelete }: IProps) {
  // Get the active semester from the store
  const activeSemester = useDatabaseStore((state) => state.getActiveSemester());
  const setEvents = useDatabaseStore((state) => state.setEvents); // Get setEvents action

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete confirmation dialog

  const startDate = parseISO(event.date);

  // Extract references from description
  const extractReferences = (text: string) => {
    const mentionRegex = /@[\w\/\-]+/g;
    const mentions = text.match(mentionRegex) || [];
    const cleanDescription = text.replace(mentionRegex, "").trim();
    return { mentions, cleanDescription };
  };

  const { mentions, cleanDescription } = extractReferences(
    event.description || ""
  );

  // Function to handle event deletion
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to delete event. Status: ${response.status}`
        );
      }

      // Update the store by filtering out the deleted event
      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));

      toast.success("Event deleted successfully!");
      setIsDeleteDialogOpen(false); // Close confirmation dialog
      onDelete?.(); // Call optional onDelete callback (e.g., to close main dialog)
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event."
      );
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
                <div className="flex flex-wrap gap-2">
                  {mentions.map((mention, idx) => {
                    // Ensure active semester exists for navigation
                    if (!activeSemester) {
                      return (
                        <span
                          key={idx}
                          className="inline-block bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm text-gray-800 border border-gray-400 cursor-not-allowed transition-colors"
                          title="Active semester data not loaded"
                        >
                          {mention}
                        </span>
                      );
                    }

                    const path = mention.substring(1); // Remove '@'
                    const parts = path.split("/");
                    if (parts.length !== 2) {
                      return (
                        <span
                          key={idx}
                          className="inline-block bg-gray-200 px-3 py-1 rounded text-sm text-gray-800 border border-gray-500"
                          title="Invalid reference format"
                        >
                          {mention}
                        </span>
                      );
                    }

                    const [courseName, classId] = parts;
                    const semesterId = activeSemester.id;
                    const url = `/notes/${semesterId}/${courseName}/${classId}`;

                    return (
                      <Link
                        key={idx}
                        href={url}
                        passHref
                        className="no-underline"
                      >
                        <span className="inline-block bg-gray-100 hover:bg-gray-300 px-3 py-1 rounded text-sm text-gray-800 border border-gray-400 cursor-pointer transition-colors">
                          {mention}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div>
              <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Calendar size={18} />
                Date & Time
              </h2>
              <p className="text-sm text-neutral-700">
                {format(startDate, "MMM d, yyyy")}
              </p>
              <p className="text-sm text-neutral-500">
                {format(startDate, "h:mm a")}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-neutral-200">
            <EditEventDialog event={event}>
              <Button variant="outline" className="flex items-center gap-2">
                <Pencil size={16} />
                Edit Event
              </Button>
            </EditEventDialog>

            {/* Delete Button triggers the confirmation dialog */}
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the event &quot;
                    {event.title}&quot;? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:space-x-0">
                  {" "}
                  {/* Use DialogFooter for buttons */}
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
