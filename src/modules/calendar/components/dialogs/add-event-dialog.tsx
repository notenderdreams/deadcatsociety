// modules/calendar/components/dialogs/add-event-dialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@/hooks/use-disclosure";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TimeInput } from "@/components/ui/time-input";
import { SingleDayPicker } from "@/components/ui/single-day-picker";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { eventSchema } from "@/modules/calendar/schemas";
import { useAddEvent } from "@/modules/calendar/hooks/use-add-event"; // Import the new hook
import { IEvent } from "@/types/models"; // Adjust import path if needed
import type { TimeValue } from "react-aria-components";
import type { TEventFormData } from "@/modules/calendar/schemas";

interface IProps {
  children: React.ReactNode;
  startDate?: Date;
  startTime?: { hour: number; minute: number };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddEventDialog({
  children,
  startDate,
  startTime,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  // Use controlled state if provided, otherwise use internal state
  const dialogOpen = controlledOpen !== undefined ? controlledOpen : isOpen;
  const handleOpenChange = controlledOnOpenChange || onToggle;

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: startDate ? startDate : new Date(),
      startTime: startTime
        ? startTime
        : { hour: new Date().getHours(), minute: 0 },
      type: "general",
    },
  });

  // Ensure date and startTime reflect props if they change while dialog is open
  useEffect(() => {
    if (startDate) {
      form.setValue("date", startDate);
    }
    if (startTime) {
      form.setValue("startTime", startTime);
    }
  }, [startDate, startTime, form]);

  const { addEvent } = useAddEvent(); // Use the new hook

  const onSubmit = async (values: TEventFormData) => {
    try {
      const startDateTime = new Date(values.date);
      startDateTime.setHours(values.startTime.hour, values.startTime.minute);

      // Prepare data matching IEvent schema (excluding auto-generated fields)
      const newEventData: Omit<IEvent, "id" | "created_at" | "updated_at"> = {
        title: values.title,
        description: values.description || null, // Handle potential null/undefined
        date: startDateTime.toISOString(), // Ensure correct ISO format
        type: values.type,
      };

      await addEvent(newEventData); // Call the hook function

      handleOpenChange(false); // Close dialog on success
      form.reset(); // Reset form
    } catch (error) {
      // Error handled by the hook, prevent dialog close on error if desired
      console.error("Submission error (handled by hook):", error);
      // Optionally, don't close dialog if submission failed
      // handleOpenChange(false); // Only close on success
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Fill in the details for your new event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Event description (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <SingleDayPicker
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) field.onChange(date);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <TimeInput
                      value={field.value as TimeValue} // Cast to TimeValue
                      onChange={(timeValue) => {
                        // Ensure timeValue is defined before accessing hour/minute
                        if (timeValue) {
                          field.onChange({
                            hour: timeValue.hour,
                            minute: timeValue.minute,
                          });
                        } else {
                          // Handle case where timeValue is null/undefined (e.g., cleared)
                          field.onChange({ hour: 0, minute: 0 });
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="club">Club</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Add Event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
