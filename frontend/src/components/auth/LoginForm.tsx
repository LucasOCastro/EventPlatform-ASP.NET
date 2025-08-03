import type { FC } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { loginSchema, type LoginType } from "@/schemes/auth.schema.ts";
import { Button, PasswordInput, TextInput } from "@mantine/core";

interface LoginFormProps {
  onSubmit?: (data: LoginType) => void;
}

export const LoginForm: FC<LoginFormProps> = (props = {}) => {
  const { onSubmit = () => {} } = props;
  const form = useForm<LoginType>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zod4Resolver(loginSchema),
  });

  return (
    <form onSubmit={form.onSubmit((data) => onSubmit(data))}>
      <TextInput
        label="Email"
        placeholder="your@email.com"
        key={form.key("email")}
        {...form.getInputProps("email")}
        data-autofocus
      />
      <PasswordInput
        label="Password"
        key={form.key("password")}
        {...form.getInputProps("password")}
      />
      <Button type="submit">Login</Button>
    </form>
  );
};
