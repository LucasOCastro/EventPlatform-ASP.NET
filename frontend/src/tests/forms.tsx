import type { ReactElement } from "react";
import { render, screen, fireEvent } from "@/tests/setup";
import { type Mock, vi } from "vitest";

type FieldQuery = { label: string } | { role: string; name?: string };
type FormShape<TFormData extends object> = {
  [K in keyof TFormData]: {
    query: FieldQuery;
    inputFn?: (element: HTMLElement, value: TFormData[K]) => void;
  };
};
type FormElements<TFormData extends object> = Record<
  keyof TFormData,
  HTMLElement
>;

interface TestPath<TFormData extends object> {
  name: string;
  data: TFormData;
}

interface SadPathFactory<TFormData extends object> {
  partials?: TestPath<Partial<TFormData>>[];
  required?: (keyof TFormData)[];
}

interface TestFormSettings<TFormData extends object> {
  component: (onSubmit: Mock) => ReactElement;
  name: string;
  formShape: FormShape<TFormData>;
  submitButton: string | FieldQuery;
  happyPaths: TestPath<TFormData>[] | TestPath<TFormData>;
  sadPaths?: TestPath<TFormData>[] | TestPath<TFormData>;
  sadPathFactory?: SadPathFactory<TFormData>;
}

export function testForm<TFormData extends object>({
  component,
  name,
  formShape,
  happyPaths,
  sadPaths,
  submitButton,
  sadPathFactory,
}: TestFormSettings<TFormData>) {
  if (!Array.isArray(happyPaths)) happyPaths = [happyPaths];

  if (sadPaths === undefined) sadPaths = [];
  else if (!Array.isArray(sadPaths)) sadPaths = [sadPaths];

  if (sadPathFactory)
    sadPaths.push(...makeSadPaths(happyPaths[0].data, sadPathFactory));

  describe(name, () => {
    const mockOnSubmit = vi.fn();
    beforeEach(() => mockOnSubmit.mockClear());

    it("renders all fields and a submit button", () => {
      render(component(mockOnSubmit));

      const elements = doFormQuery(formShape);
      Object.values(elements).forEach((field) => {
        expect(field).toBeInTheDocument();
      });
    });

    function testPaths(paths: TestPath<TFormData>[], happy: boolean) {
      paths.forEach(({ name, data }) => {
        it(name, () => {
          render(component(mockOnSubmit));
          fillIn(formShape, data);

          const submitButtonQuery =
            typeof submitButton === "string"
              ? { role: "button", name: submitButton }
              : submitButton;
          fireEvent.click(doFieldQuery(submitButtonQuery));

          if (happy) {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockOnSubmit).toHaveBeenCalledWith(data);
          } else {
            expect(mockOnSubmit).toHaveBeenCalledTimes(0);
          }
        });
      });
    }

    describe("calls onSubmit with correct data when form is submitted", () => {
      testPaths(happyPaths, true);
    });

    describe("does not call onSubmit when form is submitted with invalid data", () => {
      testPaths(sadPaths, false);
    });
  });
}

function makeSadPaths<TFormData extends object>(
  happyData: TFormData,
  factory: SadPathFactory<TFormData>,
): TestPath<TFormData>[] {
  const partials =
    factory.partials?.map(({ name, data }) => ({
      name,
      data: {
        ...happyData,
        ...data,
      },
    })) || [];

  const required =
    factory.required?.map((key) => ({
      name: `missing ${String(key)}`,
      data: {
        ...happyData,
        [key]: undefined,
      },
    })) || [];

  return [...partials, ...required];
}

function fillIn<TFormData extends object>(
  shape: FormShape<TFormData>,
  data: TFormData,
) {
  const elements = doFormQuery(shape);
  const keys = Object.keys(data) as Array<keyof TFormData>;
  keys.forEach((key) => {
    const field = elements[key];
    const { inputFn } = shape[key];
    const value = data[key];

    // TODO more inputs types
    if (inputFn) {
      inputFn(field, value);
    } else if (field.getAttribute("role") === "checkbox") {
      if ((field as HTMLInputElement).checked !== value) {
        fireEvent.click(field);
      }
    } else {
      fireEvent.change(field, { target: { value } });
    }
  });
}

function doFormQuery<TFormData extends object>(
  shape: FormShape<TFormData>,
): FormElements<TFormData> {
  const keys = Object.keys(shape) as Array<keyof TFormData>;
  return Object.fromEntries(
    keys.map((key) => [key, doFieldQuery(shape[key].query)]),
  ) as FormElements<TFormData>;
}

function doFieldQuery(query: FieldQuery) {
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
