import type { Mock } from "vitest";
import type { ReactElement } from "react";

export type FieldQuery = { label: string } | { role: string; name?: string };
export type FormShape<TFormData extends object> = {
  [K in keyof TFormData]: {
    query: FieldQuery;
    inputFn?: (element: HTMLElement, value: TFormData[K]) => void;
  };
};
export type FormElements<TFormData extends object> = Record<
  keyof TFormData,
  HTMLElement
>;

export interface TestPath<TFormData extends object> {
  name: string;
  data: TFormData;
}

export interface SadPathFactory<TFormData extends object> {
  partials?: TestPath<Partial<TFormData>>[];
  required?: (keyof TFormData)[];
}

export interface TestFormSettings<TFormData extends object> {
  component: (onSubmit: Mock) => ReactElement;
  formShape: FormShape<TFormData>;
  submitButton: string | FieldQuery;
  happyPaths: TestPath<TFormData>[] | TestPath<TFormData>;
  sadPaths?: TestPath<TFormData>[] | TestPath<TFormData>;
  sadPathFactory?: SadPathFactory<TFormData>;
}
