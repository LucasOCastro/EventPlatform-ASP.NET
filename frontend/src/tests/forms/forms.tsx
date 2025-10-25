import { render } from "@/tests/setup";
import { expect, type Mock, vi } from "vitest";
import type {
  SadPathFactory,
  TestFormSettings,
  TestPath,
  TestPathHooks,
} from "@/tests/forms/forms.d.tsx";
import type {
  ExposedOnSubmitForm,
  FormOnSubmit,
  FormProps,
} from "@/types/form-props";
import TestableForm from "@/tests/forms/testable-form";
import { act } from "@testing-library/react";

export function testForm<TFormData extends object>({
  component,
  formShape,
  happyPaths,
  sadPaths,
  submitButton,
  sadPathFactory,
  customTest
}: TestFormSettings<TFormData>) {
  // Guarantee happyPaths is an array
  if (!Array.isArray(happyPaths)) happyPaths = [happyPaths];

  // Guarantee sadPaths is an array
  if (sadPaths === undefined) sadPaths = [];
  else if (!Array.isArray(sadPaths)) sadPaths = [sadPaths];

  // Fill sadPaths
  makeSadPaths(sadPathFactory, sadPaths, happyPaths);

  const mockOnSubmit: Mock<FormOnSubmit<TFormData>> = vi.fn();
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
    testType: "happy" | "unhappy" | "custom",
    { setup, customTest, cleanup }: TestPathHooks = {},
  ) {
    it(name, async () => {
      await setup?.();

      renderForm(renderProps);
      act(() => {
        testableForm.submitData(data);
      });

      if (testType === "happy") {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          data,
          expect.objectContaining<ExposedOnSubmitForm<TFormData>>(
            getExpectedFormObject<TFormData>(),
          ),
        );
      } else if (testType === "unhappy") {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      } else if (testType === "custom") {
        await customTest?.();
      }

      await cleanup?.();
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
      "custom",
      { customTest: testableForm.expectLoading },
    );

    testPath(
      {
        name: "async onSubmit",
        data: happyPaths[0].data,
      },
      "custom",
      {
        setup() {
          vi.useFakeTimers();
          mockOnSubmit.mockImplementationOnce(
            async () =>
              await new Promise((resolve) => setTimeout(resolve, 1000)),
          );
        },
        async customTest() {
          async function innerTest() {
            await new Promise((resolve) => setTimeout(resolve, 500));
            testableForm.expectLoading();
            await new Promise((resolve) => setTimeout(resolve, 501));
            testableForm.expectNotLoading();
          }

          innerTest();
          await act(async () => {
            await vi.runAllTimersAsync();
          });
        },
        cleanup() {
          vi.useRealTimers();
        },
      },
    );
  });

  describe("does not show loading overlay when", () => {
    testPath(
      {
        name: "not loading",
        data: happyPaths[0].data,
      },
      "custom",
      { customTest: testableForm.expectNotLoading },
    );
  });

  it("shows top level error message", async () => {
    const TEST_MESSAGE = "top level error test message";
    mockOnSubmit.mockImplementationOnce((_, form) =>
      form.setTopLevelError(TEST_MESSAGE),
    );

    renderForm();
    act(() => testableForm.submitData(happyPaths[0].data));
    await testableForm.expectErrorMessage(TEST_MESSAGE);

    act(() => testableForm.submitData(happyPaths[0].data));
    testableForm.expectNotError(TEST_MESSAGE);
  });

  customTest?.({testableForm, renderForm, mockOnSubmit});
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

function getExpectedFormObject<TFormData>(): ExposedOnSubmitForm<TFormData> {
  return {
    setErrors: expect.any(Function),
    setFieldError: expect.any(Function),
    clearFieldError: expect.any(Function),
    clearErrors: expect.any(Function),
    reset: expect.any(Function),
    setTopLevelError: expect.any(Function),
    clearTopLevelError: expect.any(Function),
  };
}
