import { Fieldset, LoadingOverlay } from "@mantine/core";
import type { DetailedHTMLProps, FormHTMLAttributes } from "react";
import type { UseFormReturnType } from "@mantine/form";
import { z } from "zod";
import type { FormProps } from "@/types/form-props.ts";

export type BaseFormProps<TFormData, TData = TFormData> = Omit<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  "onSubmit"
> &
  FormProps<TData> & {
    form: UseFormReturnType<TFormData>;
    schema: z.Schema<TData>;
  };

export const BaseForm = <TFormData, TData = TFormData>(
  props: BaseFormProps<TFormData, TData>,
) => {
  const {
    isLoading = false,
    isDisabled = false,
    onSubmit,
    form,
    schema,
    children,
    ...otherProps
  } = props;

  const actuallyLoading = isLoading || form.submitting;
  const actuallyDisabled = isDisabled || actuallyLoading;

  return (
    <form
      style={{ position: "relative" }}
      onSubmit={form.onSubmit((data) => onSubmit?.(schema.parse(data), form))}
      {...otherProps}
    >
      <Fieldset variant="unstyled" disabled={actuallyDisabled}>
        <LoadingOverlay
          visible={actuallyLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          data-testid="loading-overlay"
        />

        {children}
      </Fieldset>
    </form>
  );
};
