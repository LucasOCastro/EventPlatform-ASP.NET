import {
  MIN_PASSWORD_LENGTH,
  registerSchema,
  type RegisterType,
} from "@/schemes/auth.schema.ts";
import type { FormProps } from "@/types/form-props.ts";
import type { FC } from "react";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { BaseForm } from "@/components/BaseForm.tsx";

const PASSWORD_PLACEHOLDER = "*".repeat(MIN_PASSWORD_LENGTH);

type RegisterFormType = Omit<RegisterType, "birthDate"> & {
  birthDate: Date | null;
};
export const RegisterForm: FC<FormProps<RegisterType>> = (props = {}) => {
  const form = useForm<RegisterFormType>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      birthDate: null,
    },
    validate: zod4Resolver(registerSchema),
  });

  return (
    <BaseForm<RegisterFormType, RegisterType>
      form={form}
      schema={registerSchema}
      {...props}
    >
      <TextInput
        label="Email"
        placeholder="your@email.com"
        key={form.key("email")}
        {...form.getInputProps("email")}
        data-autofocus
      />
      <PasswordInput
        label="Password"
        placeholder={PASSWORD_PLACEHOLDER}
        key={form.key("password")}
        {...form.getInputProps("password")}
      />
      <PasswordInput
        label="Confirm Password"
        placeholder={PASSWORD_PLACEHOLDER}
        key={form.key("confirmPassword")}
        {...form.getInputProps("confirmPassword")}
      />

      <BaseForm.FormError />

      <TextInput
        label="First Name"
        key={form.key("firstName")}
        {...form.getInputProps("firstName")}
      />
      <TextInput
        label="Last Name"
        key={form.key("lastName")}
        {...form.getInputProps("lastName")}
      />
      <DateInput
        label="Birth Date"
        // TODO based on locale
        valueFormat="MM/DD/YYYY"
        placeholder="MM/DD/YYYY"
        key={form.key("birthDate")}
        {...form.getInputProps("birthDate")}
      />
      <Button type="submit">Register</Button>
    </BaseForm>
  );
};
