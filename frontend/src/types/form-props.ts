export interface FormProps<TData> {
  onSubmit?: (data: TData) => Promise<void>;
  isLoading?: boolean;
  isDisabled?: boolean;
}
