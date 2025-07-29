"use client";

import { parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDisclosure } from "@/hooks/use-disclosure";
import { useUpdateEvent } from "@/modules/calendar/hooks/use-update-event";

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

import type { IEvent } from "@/modules/calendar/interfaces";
import type { TimeValue } from "react-aria-components";
import type { TEventFormData } from "@/modules/calendar/schemas";

interface IProps {
  children: React.ReactNode;
  event: IEvent;
}

export function EditEventDialog({ children, event }: IProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const { updateEvent } = useUpdateEvent();

  const form = useForm<TEventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      date: parseISO(event.date),
      startTime: {
        hour: parseISO(event.date).getHours(),
        minute: parseISO(event.date).getMinutes(),
      },
      type: event.type,
    },
  });

  const onSubmit = (values: TEventFormData) => {
    const startDateTime = new Date(values.date);
    startDateTime.setHours(values.startTime.hour, values.startTime.minute);

    updateEvent({
      ...event,
      title: values.title,
      type: values.type,
      description: values.description,
      date: startDateTime.toISOString(),
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Event
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4"
          >
            {/* Content Grid */}
            <div className="grid grid-cols-3 border-t border-l border-neutral-300 w-full">
              {/* Title Field */}
              <div className="border-b border-r border-neutral-300 p-6 col-span-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="title"
                        className="font-semibold text-lg mb-2 block"
                      >
                        Event Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          placeholder="Enter a title"
                          data-invalid={fieldState.invalid}
                          className="text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date Field */}
              <div className="border-b border-r border-neutral-300 p-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="startDate"
                        className="font-semibold text-lg mb-2 block"
                      >
                        Date
                      </FormLabel>
                      <FormControl>
                        <SingleDayPicker
                          id="startDate"
                          value={field.value}
                          onSelect={(date) => field.onChange(date as Date)}
                          placeholder="Select a date"
                          data-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time Field */}
              <div className="border-b border-r border-neutral-300 p-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-lg mb-2 block">
                        Start Time
                      </FormLabel>
                      <FormControl>
                        <TimeInput
                          value={field.value as TimeValue}
                          onChange={field.onChange}
                          hourCycle={12}
                          data-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Event Type Field */}
              <div className="border-b border-r border-neutral-300 p-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-lg mb-2 block">
                        Event Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger data-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent className="bg-neutral-100">
                            <SelectItem value="general">
                              <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-gray-600" />
                                General
                              </div>
                            </SelectItem>
                            <SelectItem value="club">
                              <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-blue-600" />
                                Club
                              </div>
                            </SelectItem>
                            <SelectItem value="exam">
                              <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-red-600" />
                                Exam
                              </div>
                            </SelectItem>
                            <SelectItem value="deadline">
                              <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-orange-600" />
                                Deadline
                              </div>
                            </SelectItem>
                            <SelectItem value="rescheduled">
                              <div className="flex items-center gap-2">
                                <div className="size-3.5 rounded-full bg-purple-600" />
                                Rescheduled
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field */}
              <div className="border-b border-r border-neutral-300 p-6 col-span-3">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-lg mb-2 block">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value}
                          data-invalid={fieldState.invalid}
                          className="text-sm"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button form="event-form" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
