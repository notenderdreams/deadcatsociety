// modules/calendar/components/dialogs/edit-event-dialog.tsx
// app/modules/calendar/components/dialogs/edit-event-dialog.tsx
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { eventSchema } from "@/modules/calendar/schemas";
import { useUpdateEvent } from "@/modules/calendar/hooks/use-update-event"; // Ensure using the improved hook
import { DatabaseEvent } from "@/types/models"; // Adjust import path if needed
import type { TimeValue } from "react-aria-components";
import type { TEventFormData } from "@/modules/calendar/schemas";
import type { IEvent } from "@/modules/calendar/interfaces"; // Adjust import path if needed

interface IProps {
  children: React.ReactNode;
  event: IEvent; // Or DatabaseEvent if that's the type used internally
}

export function EditEventDialog({ children, event }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const { updateEvent } = useUpdateEvent(); // Use the improved hook

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description || "",
      date: new Date(event.date),
      startTime: {
        hour: new Date(event.date).getHours(),
        minute: new Date(event.date).getMinutes(),
      },
      type: event.type as any, // Cast if needed, ensure type compatibility
    },
  });

  // Reset form when event prop changes (e.g., if dialog is reused for different events)
  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      form.reset({
        title: event.title,
        description: event.description || "",
        date: eventDate,
        startTime: {
          hour: eventDate.getHours(),
          minute: eventDate.getMinutes(),
        },
        type: event.type as any, // Cast if needed
      });
    }
  }, [event, form]);

  const onSubmit = async (values: TEventFormData) => {
    try {
      const startDateTime = new Date(values.date);
      startDateTime.setHours(values.startTime.hour, values.startTime.minute);

      const updatedEventData: DatabaseEvent = {
        ...event, // Start with existing event data
        title: values.title,
        type: values.type,
        description: values.description || event.description, // Handle potential null/undefined
        date: startDateTime.toISOString(), // Ensure correct ISO format
        updated_at: new Date().toISOString(), // Update timestamp
      };

      await updateEvent(updatedEventData); // Call the improved hook function
      onClose(); // Close dialog on success
    } catch (error) {
      // Error handled by the hook
      console.error("Update error (handled by hook):", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
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
                      placeholder="Event description"
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
