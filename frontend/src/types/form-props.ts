import type { UseFormReturnType } from "@mantine/form";

export type ExposedOnSubmitForm<TData> = Pick<
  UseFormReturnType<TData>,
  "setErrors" | "setFieldError" | "clearFieldError" | "clearErrors" | "reset"
> & {
  setTopLevelError: (error: string) => void;
  clearTopLevelError: () => void;
};

export type FormOnSubmit<TData> = (
  data: TData,
  form: ExposedOnSubmitForm<TData>,
) => Promise<void> | void;

export interface FormProps<TData> {
  onSubmit?: FormOnSubmit<TData>;
  isLoading?: boolean;
  isDisabled?: boolean;
}
