import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date({ required_error: "Start date is required" }),
  startTime: z.object({ hour: z.number(), minute: z.number() }, { required_error: "Start time is required" }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"], { required_error: "Color is required" }),
});

export type TEventFormData = z.infer<typeof eventSchema>;
