import { z } from "zod";
import { TextInput, Button, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BaseForm } from "@/components/BaseForm";
import type { FormProps } from "@/types/form-props";
import { testForm } from "@/tests/forms";
import type { FC } from "react";
import { act } from "@testing-library/react";
import { expect } from "vitest";
import { screen } from "@/tests/setup.tsx";
import { zod4Resolver } from "mantine-form-zod-resolver";

// --------------------------
// Schema and types
// --------------------------
const FORBIDDEN_NAME_VALUE = "forbidden-name";
const FORBIDDEN_SAME_VALUE = 1234;
const baseFormSchema = z
  .object({
    // Required field for required sad-path-factory
    name: z
      .string()
      .min(1, "Name is required")
      // Individual condition for partial sad-path-factory
      .refine((value) => value !== FORBIDDEN_NAME_VALUE, "Name is forbidden"),
    // Individual condition for partial sad-path-factory
    age: z.number().max(18, "Must be less than 18"),
    // Full form condition for complete sad-path
  })
  .refine(
    ({ name, age }) => name !== String(age) || age !== FORBIDDEN_SAME_VALUE,
    `Name and age can't both equate ${FORBIDDEN_SAME_VALUE}`,
  );

type BaseFormType = z.infer<typeof baseFormSchema>;

// --------------------------
// Test Component
// --------------------------
type TestBaseFormProps = FormProps<BaseFormType> & {
  _with_custom_error?: boolean;
};

const FORM_ERROR_POS_WRAPPER_TEST_ID = "custom-error-wrapper";
const TestBaseForm: FC<FormProps<BaseFormType>> = (
  props: TestBaseFormProps,
) => {
  const form = useForm<BaseFormType>({
    mode: "uncontrolled",
    initialValues: { name: "", age: 0 },
    validate: zod4Resolver(baseFormSchema),
  });

  return (
    <BaseForm<BaseFormType> form={form} schema={baseFormSchema} {...props}>
      <TextInput
        label="Name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />

      <div data-testid={FORM_ERROR_POS_WRAPPER_TEST_ID}>
        {props._with_custom_error && <BaseForm.FormError />}
      </div>

      <NumberInput
        label="Age"
        key={form.key("age")}
        {...form.getInputProps("age")}
      />

      <Button type="submit">Submit</Button>
    </BaseForm>
  );
};

// --------------------------
// Tests
// --------------------------
describe("BaseForm", () => {
  testForm<BaseFormType>({
    component: (props) => <TestBaseForm {...props} />,
    submitButton: "submit",
    formShape: {
      name: { query: { label: "name" } },
      age: { query: { label: "age" } },
    },
    happyPaths: {
      name: "valid input",
      data: {
        name: "Alice",
        age: 15,
      },
    },
    sadPaths: [
      {
        name: `both match ${FORBIDDEN_SAME_VALUE}`,
        data: {
          name: `${FORBIDDEN_SAME_VALUE}`,
          age: FORBIDDEN_SAME_VALUE,
        },
      },
    ],
    sadPathFactory: {
      required: ["name"],
      partials: [
        {
          name: `name equals ${FORBIDDEN_NAME_VALUE}`,
          data: { name: FORBIDDEN_NAME_VALUE },
        },
        {
          name: `age greater than 18`,
          data: { age: 20 },
        },
      ],
    },
    customTest({ testableForm, renderForm, mockOnSubmit }) {
      const TEST_ERROR_MESSAGE = "custom top level error message";
      describe("BaseForm error positioning", () => {
        it("renders the default FormError below fields when not defined explicitly", async () => {
          mockOnSubmit.mockImplementationOnce((_, form) =>
            form.setTopLevelError(TEST_ERROR_MESSAGE),
          );
          renderForm();

          act(() => testableForm.submitData({ name: "Alice", age: 15 }));

          const error =
            await testableForm.expectErrorMessage(TEST_ERROR_MESSAGE);
          const wrapper = screen.getByTestId(FORM_ERROR_POS_WRAPPER_TEST_ID);
          expect(error.parentNode).not.eq(wrapper);
        });

        it("renders the FormError only in the custom position when explicitly included", async () => {
          mockOnSubmit.mockImplementationOnce((_, form) =>
            form.setTopLevelError(TEST_ERROR_MESSAGE),
          );

          const props: TestBaseFormProps = { _with_custom_error: true };
          renderForm(props);

          act(() => testableForm.submitData({ name: "Alice", age: 15 }));

          const error =
            await testableForm.expectErrorMessage(TEST_ERROR_MESSAGE);
          const wrapper = screen.getByTestId(FORM_ERROR_POS_WRAPPER_TEST_ID);
          expect(error.parentNode).eq(wrapper);
        });
      });
    },
  });
});
