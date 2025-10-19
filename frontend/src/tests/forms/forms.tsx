import { render } from "@/tests/setup";
import { vi } from "vitest";
import type {
  SadPathFactory,
  TestFormSettings,
  TestPath,
} from "@/tests/forms/forms.d.tsx";
import type { FormProps } from "@/types/form-props";
import TestableForm from "@/tests/forms/testable-form";

export function testForm<TFormData extends object>({
  component,
  formShape,
  happyPaths,
  sadPaths,
  submitButton,
  sadPathFactory,
}: TestFormSettings<TFormData>) {
  // Guarantee happyPaths is an array
  if (!Array.isArray(happyPaths)) happyPaths = [happyPaths];

  // Guarantee sadPaths is an array
  if (sadPaths === undefined) sadPaths = [];
  else if (!Array.isArray(sadPaths)) sadPaths = [sadPaths];

  // Fill sadPaths
  makeSadPaths(sadPathFactory, sadPaths, happyPaths);

  const mockOnSubmit = vi.fn(async (data: TFormData) =>
    console.log("onSubmit called with:", data),
  );
  beforeEach(() => mockOnSubmit.mockClear());

  function renderForm(props: Omit<FormProps<TFormData>, "onSubmit"> = {}) {
    render(
      component({
        onSubmit: mockOnSubmit,
        ...props,
      }),
    );
  }

  const testableForm = new TestableForm(formShape, submitButton);

  it("renders all fields and a submit button", () => {
    renderForm();

    const elements = testableForm.findAllFields();
    Object.values(elements).forEach((field) => {
      expect(field).toBeInTheDocument();
    });

    expect(testableForm.findSubmitButton()).toBeInTheDocument();
  });

  function testPath(
    { name, data, renderProps }: TestPath<TFormData>,
    test: "happy" | "unhappy" | (() => void),
  ) {
    it(name, () => {
      renderForm(renderProps);
      testableForm.submitData(data);

      if (test === "happy") {
        expect(mockOnSubmit).toHaveBeenCalledWith(data);
      } else if (test === "unhappy") {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      } else {
        test();
      }
    });
  }

  describe("calls onSubmit when", () => {
    happyPaths.forEach((path) => testPath(path, "happy"));
  });

  describe("does not call onSubmit when", () => {
    sadPaths.forEach((path) => testPath(path, "unhappy"));
  });

  describe("shows loading overlay when", () => {
    testPath(
      {
        name: "loading",
        data: happyPaths[0].data,
        renderProps: { isLoading: true },
      },
      () => {
        const overlay = testableForm.findLoadingOverlay();
        expect(overlay).toBeInTheDocument();
        expect(overlay).toBeVisible();
      },
    );
  });

  describe("does not show loading overlay when", () => {
    testPath(
      {
        name: "not loading",
        data: happyPaths[0].data,
      },
      () => {
        const overlay = testableForm.findLoadingOverlay();
        expect(overlay).toBeNull();
      },
    );
  });
}

function makeSadPaths<TFormData extends object>(
  sadPathFactory: SadPathFactory<TFormData> | undefined,
  sadPaths: TestPath<TFormData>[],
  happyPaths: TestPath<TFormData>[],
) {
  // Fill sadPaths from received factories
  if (sadPathFactory)
    sadPaths.push(...resolveSadPathFactory(happyPaths[0].data, sadPathFactory));

  // Fill sadPaths with disabled and loading paths
  sadPaths.push(
    {
      name: "disabled",
      data: happyPaths[0].data,
      renderProps: { isDisabled: true },
    },
    {
      name: "loading",
      data: happyPaths[0].data,
      renderProps: { isLoading: true },
    },
  );
}

function resolveSadPathFactory<TFormData extends object>(
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
