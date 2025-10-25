import { screen } from "@/tests/setup.tsx";
import { fillField } from "@/tests/forms/field-filler.ts";
import { fireEvent } from "@testing-library/react";

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

export default class TestableForm<TFormData extends object> {
  static readonly LOADING_OVERLAY_TEST_ID = "loading-overlay";
  private readonly _shape: FormShape<TFormData>;
  private readonly _submitButton: FieldQuery;

  constructor(shape: FormShape<TFormData>, submitButton: FieldQuery | string) {
    this._shape = shape;
    this._submitButton =
      typeof submitButton === "string"
        ? { role: "button", name: submitButton }
        : submitButton;
  }

  findAllFields(): FormElements<TFormData> {
    const shape = this._shape;
    const keys = Object.keys(shape) as Array<keyof TFormData>;
    const entries = keys.map((key) => [key, this.findField(shape[key].query)]);
    return Object.fromEntries(entries) as FormElements<TFormData>;
  }

  findSubmitButton() {
    return this.findField(this._submitButton);
  }

  findField(query: FieldQuery): HTMLElement {
    if ("label" in query) {
      const { label } = query;
      return screen.getByLabelText(new RegExp(label, "i"));
    }

    const { role, name } = query;
    return screen.getByRole(
      role,
      name ? { name: new RegExp(name, "i") } : undefined,
    );
  }

  expectLoading() {
    const overlay = screen.getByTestId(TestableForm.LOADING_OVERLAY_TEST_ID);
    expect(overlay).toBeInTheDocument();
    expect(overlay).toBeVisible();
  }

  expectNotLoading() {
    const overlay = screen.queryByTestId(TestableForm.LOADING_OVERLAY_TEST_ID);
    expect(overlay).toBeNull();
  }

  async expectErrorMessage(message: string) {
    const element = await screen.findByText(message);
    expect(element).toBeInTheDocument();
    expect(element).toBeVisible();
  }

  expectNotError(message: string) {
    const element = screen.queryByText(message);
    expect(element).toBeNull();
  }

  fillWithData(data: TFormData) {
    const shape = this._shape;
    const elements = this.findAllFields();

    const keys = Object.keys(data) as Array<keyof TFormData>;
    keys.forEach((key) => {
      const field = elements[key];
      const { inputFn } = shape[key];
      const value = data[key];

      if (inputFn) {
        inputFn(field, value);
      } else {
        fillField(field, value);
      }
    });
  }

  submitData(data: TFormData) {
    this.fillWithData(data);
    fireEvent.click(this.findSubmitButton());
  }
}
