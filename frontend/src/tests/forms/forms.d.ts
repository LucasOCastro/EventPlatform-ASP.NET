import type { ReactElement } from "react";
import type { FormProps } from "@/types/form-props.ts";

export interface TestPath<TFormData extends object> {
  name: string;
  data: TFormData;
  renderProps?: FormProps<TFormData>;
}

export interface SadPathFactory<TFormData extends object> {
  partials?: TestPath<Partial<TFormData>>[];
  required?: (keyof TFormData)[];
}

export interface TestFormSettings<TFormData extends object> {
  component: (props: FormProps<TFormData>) => ReactElement;
  formShape: FormShape<TFormData>;
  submitButton: string | FieldQuery;
  happyPaths: TestPath<TFormData>[] | TestPath<TFormData>;
  sadPaths?: TestPath<TFormData>[] | TestPath<TFormData>;
  sadPathFactory?: SadPathFactory<TFormData>;
}
