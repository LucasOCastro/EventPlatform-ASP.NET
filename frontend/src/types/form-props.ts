import type { UseFormReturnType } from "@mantine/form";

export type ExposedOnSubmitForm<TData> = Pick<
  UseFormReturnType<TData>,
  "setErrors" | "setFieldError" | "clearFieldError" | "clearErrors" | "reset"
>;

export type FormOnSubmit<TData> = (
  data: TData,
  form: ExposedOnSubmitForm<TData>,
) => Promise<void>;

export interface FormProps<TData> {
  onSubmit?: FormOnSubmit<TData>;
  isLoading?: boolean;
  isDisabled?: boolean;
}
