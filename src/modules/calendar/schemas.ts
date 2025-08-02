// File: schemas.ts
import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date({ required_error: "Start date is required" }),
  startTime: z.object(
    { hour: z.number(), minute: z.number() },
    { required_error: "Start time is required" }
  ),
  type: z.enum(["general", "club", "exam", "deadline", "rescheduled"], {
    required_error: "Type is required",
  }),
});

export type TEventFormData = z.infer<typeof eventSchema>;
