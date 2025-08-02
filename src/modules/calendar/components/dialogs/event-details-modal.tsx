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
import { useState } from "react";
import Link from "next/link";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useDeleteEvent } from "@/modules/calendar/hooks/use-delete-event";
import { EventDialog } from "@/modules/calendar/components/dialogs/event-modal";
import type { IEvent } from "@/types/models";

interface EventDetailsDialogProps {
  event: IEvent;
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
}

export function EventDetailsDialog({
  event,
  children,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onDelete,
}: EventDetailsDialogProps) {
  const { deleteEvent } = useDeleteEvent();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle controlled vs uncontrolled state
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen! : internalIsOpen;
  const onClose = isControlled
    ? controlledOnClose!
    : () => setInternalIsOpen(false);

  const startDate = parseISO(event.date);

  const extractReferences = (text: string | null): string[] => {
    if (!text) return [];
    return (text.match(/@[\w/-]+/g) || []).map((m) => m.slice(1));
  };

  const cleanDescription = event.description
    ? event.description.replace(/@[\w/-]+/g, "").trim()
    : "";

  const mentions = extractReferences(event.description);

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(event.id);
      setIsDeleteDialogOpen(false);
      onClose();
      onDelete?.();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Close details modal first
    onClose();

    // Open edit modal after a brief delay to ensure proper transition
    setTimeout(() => {
      setIsEditDialogOpen(true);
    }, 150);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    // Don't reopen details modal after successful edit
    // User expects to return to calendar view
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  };

  return (
    <>
      {children && (
        <div onClick={handleTriggerClick} style={{ cursor: "pointer" }}>
          {children}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
        classNames={{
          base: "bg-neutral-100 shadow-xl h-4/5 px-2 rounded-xl",
          header: "border border-neutral-200 bg-neutral-200/50 mt-2 rounded-xl",
          body: "py-6 border-b-2 border-neutral-200",
          footer: "",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-xl font-semibold">
            Event Details
          </ModalHeader>
          <ModalBody>
            <div className="py-8 border-b-2 border-neutral-200">
              <h1 className="text-4xl font-bold">{event.title}</h1>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Text size={18} />
                  Description
                </h2>
                <p className="text-sm text-neutral-700">
                  {cleanDescription || "No description provided."}
                </p>
              </div>

              {mentions.length > 0 && (
                <div>
                  <h2 className="font-semibold text-lg mb-2">References</h2>
                  <ul className="space-y-2">
                    {mentions.map((mention, i) => (
                      <li key={i}>
                        <Link
                          href="#"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <LinkIcon size={14} />
                          {mention}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-neutral-500" />
                  <span>{format(startDate, "PPP")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-neutral-500" />
                  <span>{format(startDate, "h:mm a")}</span>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onClick={handleEditClick}
              className="text-neutral-600 hover:bg-neutral-100 gap-2"
            >
              <Pencil size={16} />
              Edit
            </Button>
            <Button
              color="danger"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-2 ml-2"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Dialog - Uses the new EventDialog without children */}
      <EventDialog
        event={event}
        isEditing={true}
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        size="xl"
        classNames={{
          base: "bg-neutral-100 shadow-xl h-1/3 px-2 rounded-xl",
          header: "border border-neutral-200 bg-neutral-200/50 mt-2 rounded-xl",
          body: "py-6 border-b-2 border-neutral-200",
          footer: "",
        }}
      >
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p className="text-neutral-700">
              Are you sure you want to delete the event &quot;{event.title}
              &quot;? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onClick={handleDeleteEvent}
              className="ml-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
