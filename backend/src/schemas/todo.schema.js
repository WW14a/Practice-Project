import z from "zod";

export const TodoScehema = z.object({
  title: z.string().max(255),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.string().optional(),
});

export const UpdateTodoSchema = TodoScehema.partial();
