import { fireEvent, render, screen } from "@/tests/setup";
import { vi } from "vitest";
import type {
  FieldQuery,
  FormElements,
  FormShape,
  SadPathFactory,
  TestFormSettings,
  TestPath,
} from "@/tests/forms/forms.d.tsx";
import { fillField } from "@/tests/forms/field-filler.ts";

export function testForm<TFormData extends object>({
  component,
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

  const submitButtonQuery =
    typeof submitButton === "string"
      ? { role: "button", name: submitButton }
      : submitButton;

  const mockOnSubmit = vi.fn((data) =>
    console.log("onSubmit called with:", data),
  );
  beforeEach(() => mockOnSubmit.mockClear());

  it("renders all fields and a submit button", () => {
    render(component(mockOnSubmit));

    const elements = doFormQuery(formShape);
    //console.log("found elements = ", elements);
    Object.values(elements).forEach((field) => {
      expect(field).toBeInTheDocument();
    });

    expect(doFieldQuery(submitButtonQuery)).toBeInTheDocument();
  });

  function testPaths(paths: TestPath<TFormData>[], happy: boolean) {
    paths.forEach(({ name, data }) => {
      it(name, () => {
        render(component(mockOnSubmit));
        fillIn(formShape, data);

        fireEvent.click(doFieldQuery(submitButtonQuery));

        if (happy) {
          expect(mockOnSubmit).toHaveBeenCalledWith(data);
        } else {
          expect(mockOnSubmit).not.toHaveBeenCalled();
        }
      });
    });
  }

  describe("calls onSubmit when", () => {
    testPaths(happyPaths, true);
  });

  describe("does not call onSubmit when", () => {
    testPaths(sadPaths, false);
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
      name: `is missing ${String(key)}`,
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

    if (inputFn) {
      inputFn(field, value);
    } else {
      fillField(field, value);
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
