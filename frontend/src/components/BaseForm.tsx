import { Fieldset, LoadingOverlay } from "@mantine/core";
import type { DetailedHTMLProps, FormHTMLAttributes } from "react";

export type BaseFormProps = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
> & {
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const BaseForm = (props: BaseFormProps) => {
  const {
    isLoading = false,
    isDisabled = false,
    children,
    ...otherProps
  } = props;

  return (
    <form {...otherProps}>
      <Fieldset variant="unstyled" disabled={isDisabled || isLoading}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          data-testid="loading-overlay"
        />

        {children}
      </Fieldset>
    </form>
  );
};
