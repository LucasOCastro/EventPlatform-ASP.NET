import { Text, Fieldset, LoadingOverlay } from "@mantine/core";
import React, {
  createContext,
  type DetailedHTMLProps,
  type FC,
  type FormHTMLAttributes,
  useContext,
  useState,
} from "react";
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

type FormContextType = {
  formError: string | null;
  setFormError: (error: string | null) => void;
};
const FormContext = createContext<FormContextType | null>(null);

export const BaseForm = <TFormData, TData = TFormData>(
  props: BaseFormProps<TFormData, TData>,
) => {
  const [formError, setFormError] = useState<string | null>(null);
  const contextValue: FormContextType = { formError, setFormError };

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

  const wrappedOnSubmit = form.onSubmit((data) => {
    setFormError(null);
    return onSubmit?.(schema.parse(data), {
      ...form,
      clearErrors() {
        setFormError(null);
        form.clearErrors();
      },
      setTopLevelError: setFormError,
      clearTopLevelError() {
        return setFormError(null);
      },
    });
  });

  function hasFormErrorElement(nodes: React.ReactNode): boolean {
    if (!nodes) return false;

    return React.Children.toArray(nodes).some((child) => {
      if (!React.isValidElement(child)) return false;
      if ((child.type as FormErrorComponent).__IS_FORM_ERROR__) return true;

      const props = child.props as { children: React.ReactNode };
      return hasFormErrorElement(props.children);
    });
  }
  const hasDefinedErrorElement = hasFormErrorElement(children);

  return (
    <form
      style={{ position: "relative" }}
      onSubmit={wrappedOnSubmit}
      {...otherProps}
    >
      <Fieldset variant="unstyled" disabled={actuallyDisabled}>
        <LoadingOverlay
          visible={actuallyLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          data-testid="loading-overlay"
        />

        <FormContext.Provider value={contextValue}>
          {children}
          {!hasDefinedErrorElement && <FormError />}
        </FormContext.Provider>
      </Fieldset>
    </form>
  );
};

type FormErrorComponent = FC & { __IS_FORM_ERROR__: boolean };
const FormError: FormErrorComponent = () => {
  const { formError } = useContext(FormContext) ?? {};
  return (
    <Text size="sm" c="red" mt="xs" fw={500} data-testid="form-error">
      {formError}
    </Text>
  );
};
FormError.__IS_FORM_ERROR__ = true;
BaseForm.FormError = FormError;
