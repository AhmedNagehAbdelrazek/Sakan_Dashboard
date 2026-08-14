"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email" error={errors.email?.message}>
        <Input
          type="email"
          placeholder="you@example.com"
          error={!!errors.email}
          {...register("email")}
        />
      </FormField>
      <FormField label="Password" error={errors.password?.message}>
        <Input
          type="password"
          placeholder="Enter your password"
          error={!!errors.password}
          {...register("password")}
        />
      </FormField>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
