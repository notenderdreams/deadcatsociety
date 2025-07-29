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
      date: typeof startDate !== "undefined" ? startDate : undefined,
      startTime: typeof startTime !== "undefined" ? startTime : undefined,
    },
  });

  const onSubmit = (_values: TEventFormData) => {
    // TO DO: Create use-add-event hook
    handleOpenChange(false);
    form.reset();
  };

  const handleClose = () => {
    handleOpenChange(false);
    onClose();
  };

  useEffect(() => {
    form.reset({
      title: "",
      description: "",
      date: startDate,
      startTime,
    });
  }, [startDate, startTime, form.reset, form, dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Event
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
                          <SelectContent>
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogClose>

          <Button form="event-form" type="submit">
            Create Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
