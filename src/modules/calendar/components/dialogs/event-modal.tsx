"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAddEvent } from "@/modules/calendar/hooks/use-add-event";
import { useUpdateEvent } from "@/modules/calendar/hooks/use-update-event";
import { IEvent } from "@/types/models";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  type: "general" | "club" | "exam" | "deadline" | "rescheduled";
}

interface EventDialogProps {
  // For Add mode
  startDate?: Date;
  startTime?: { hour: number; minute: number };
  // For Edit mode
  event?: IEvent;
  isEditing?: boolean;
  // Modal control
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  disabled?: boolean;
}

const defaultFormData: EventFormData = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  startTime: "09:00",
  type: "general",
};

const eventTypes = [
  { value: "general", label: "General" },
  { value: "club", label: "Club" },
  { value: "exam", label: "Exam" },
  { value: "deadline", label: "Deadline" },
  { value: "rescheduled", label: "Rescheduled" },
];

export function EventDialog({
  startDate,
  startTime,
  event,
  isEditing = false,
  isOpen,
  onClose,
  onSuccess,
  disabled = false,
}: EventDialogProps) {
  const [formData, setFormData] = useState<EventFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { addEvent } = useAddEvent();
  const { updateEvent } = useUpdateEvent();

  // Determine if we're editing based on props
  const isEditMode = isEditing || !!event;

  // Ensure we're mounted before creating portal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      let newFormData = { ...defaultFormData };

      // If editing, populate with event data
      if (isEditMode && event) {
        const eventDate = parseISO(event.date);
        newFormData = {
          title: event.title,
          description: event.description || "",
          date: format(eventDate, "yyyy-MM-dd"),
          startTime: format(eventDate, "HH:mm"),
          type: event.type as EventFormData["type"],
        };
      } else {
        // If adding, use provided start date/time
        if (startDate) {
          newFormData.date = startDate.toISOString().split("T")[0];
        }

        if (startTime) {
          newFormData.startTime = `${startTime.hour
            .toString()
            .padStart(2, "0")}:${startTime.minute.toString().padStart(2, "0")}`;
        }
      }

      setFormData(newFormData);
    }
  }, [isOpen, event, startDate, startTime, isEditMode]);

  const handleSave = async () => {
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const [hours, minutes] = formData.startTime.split(":").map(Number);
      const eventDate = new Date(formData.date);
      eventDate.setHours(hours, minutes);

      if (isEditMode && event) {
        // Update existing event
        const updatedEvent: IEvent = {
          ...event,
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: eventDate.toISOString(),
          type: formData.type,
        };
        await updateEvent(updatedEvent);
      } else {
        // Create new event
        const newEventData: Omit<IEvent, "id" | "created_at" | "updated_at"> = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          date: eventDate.toISOString(),
          type: formData.type,
        };
        await addEvent(newEventData);
      }

      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Event save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData(defaultFormData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
        setFormData(defaultFormData);
        setIsSubmitting(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{
        zIndex: 2147483647, // Maximum z-index value
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-neutral-100 shadow-xl rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden"
        style={{
          zIndex: 2147483647,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between bg-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-900">
            {isEditMode ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={handleClose}
            disabled={disabled || isSubmitting}
            className="p-1 hover:bg-neutral-200 rounded-full transition-colors disabled:opacity-50 text-neutral-700 hover:text-neutral-900"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="py-6 px-6 overflow-y-auto max-h-[calc(90vh-140px)] bg-neutral-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                disabled={disabled || isSubmitting}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed bg-white text-neutral-900"
                placeholder="Enter event title"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                disabled={disabled || isSubmitting}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none disabled:bg-neutral-100 disabled:cursor-not-allowed bg-white text-neutral-900"
                placeholder="Enter event description (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  disabled={disabled || isSubmitting}
                  min={getTodayDate()}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed bg-white text-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  disabled={disabled || isSubmitting}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed bg-white text-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Event Type *
              </label>
              <select
                value={formData.type}
                disabled={disabled || isSubmitting}
                onChange={(e) =>
                  handleInputChange(
                    "type",
                    e.target.value as EventFormData["type"],
                  )
                }
                className="w-full px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed bg-white text-neutral-900"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-4 flex justify-end gap-3 bg-neutral-100">
          <button
            onClick={handleClose}
            disabled={disabled || isSubmitting}
            type="button"
            className="px-4 py-2 text-neutral-600 hover:bg-neutral-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={disabled || isSubmitting || !formData.title.trim()}
            type="button"
            className="px-4 py-2 bg-black text-white hover:bg-neutral-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Save Changes"
                : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal using React Portal directly to document.body
  return createPortal(modalContent, document.body);
}

// Export the old name for backward compatibility
export { EventDialog as AddEventDialog };
