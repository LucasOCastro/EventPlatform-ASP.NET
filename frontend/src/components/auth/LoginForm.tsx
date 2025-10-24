import type { FC } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { loginSchema, type LoginType } from "@/schemes/auth.schema.ts";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import type { FormProps } from "@/types/form-props.ts";
import { BaseForm } from "@/components/BaseForm.tsx";

export const LoginForm: FC<FormProps<LoginType>> = (props = {}) => {
  const form = useForm<LoginType>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: zod4Resolver(loginSchema),
  });

  return (
    <BaseForm<LoginType> form={form} schema={loginSchema} {...props}>
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
    </BaseForm>
  );
};
