"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// define schema
const testSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email"),
});

// Extract TypeScript type from Zod schema - keeps type and validation in sync
type FormData = z.infer<typeof testSchema>;

export default function ZodDemoClient() {
  // Initialize form with Zod validation
  const {
    register, // Connect input fields to form
    handleSubmit, // Handle form submission with validation
    formState: { errors }, // Access validation errors
  } = useForm<FormData>({
    resolver: zodResolver(testSchema), // Use Zod schema for validation
  });

  // Handle valid form submission
  const onSubmit = (data: FormData) => {
    alert(`Valid data: ${JSON.stringify(data)}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input type="text" placeholder="Name" {...register("name")} className="border" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <input type="email" placeholder="Email" {...register("email")} className="border" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <button type="submit" className="bg-foreground text-background">
        Submit
      </button>
    </form>
  );
}