import { z } from "zod";
import { TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BaseForm } from "@/components/BaseForm";
import type { FormProps } from "@/types/form-props";
import { testForm } from "@/tests/forms";
import type {FC} from "react";
import {act} from "@testing-library/react";
import { expect } from "vitest";
import { screen } from "@/tests/setup.tsx";

// --------------------------
// Schema and types
// --------------------------
const baseFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

type BaseFormType = z.infer<typeof baseFormSchema>;

// --------------------------
// Test Component
// --------------------------
type TestBaseFormProps = FormProps<BaseFormType> & {
    _WITH_CUSTOM_ERROR?: boolean;
};

const FORM_ERROR_POS_WRAPPER_TEST_ID = "custom-error-wrapper";
const TestBaseForm: FC<FormProps<BaseFormType>> = (props: TestBaseFormProps) => {
    const form = useForm<BaseFormType>({
        mode: "uncontrolled",
        initialValues: { name: "" },
    });

    return (
        <BaseForm<BaseFormType> form={form} schema={baseFormSchema} {...props}>
            <TextInput
                label="Name"
                placeholder="Enter name"
                key={form.key("name")}
                {...form.getInputProps("name")}
            />

            <div data-testid={FORM_ERROR_POS_WRAPPER_TEST_ID}>
            {
                props._WITH_CUSTOM_ERROR &&
                    <BaseForm.FormError/>
            }
            </div>

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
        },
        happyPaths: {
            name: "valid input",
            data: {
                name: "Alice",
            },
        },
        sadPaths: [
            {
                name: "missing name",
                data: {
                    name: "",
                },
            },
            {
                name: "missing  name",
                    // @ts-expect-error simulate missing value
                data: { name: undefined },
            },
        ],
        customTest({ testableForm, renderForm, mockOnSubmit }) {
            const TEST_ERROR_MESSAGE = "custom top level error message";
            describe("BaseForm error positioning", () => {

                it("renders the default FormError below fields when not defined explicitly", async () => {
                    mockOnSubmit.mockImplementationOnce((_, form) => form.setTopLevelError(TEST_ERROR_MESSAGE))
                    renderForm();

                    act(() => testableForm.submitData({name: "Alice"}));

                    const error = await testableForm.expectErrorMessage(TEST_ERROR_MESSAGE);
                    const wrapper = screen.getByTestId(FORM_ERROR_POS_WRAPPER_TEST_ID);
                    expect(error.parentNode).not.eq(wrapper);
                });

                it("renders the FormError only in the custom position when explicitly included", async () => {
                    mockOnSubmit.mockImplementationOnce((_, form) => form.setTopLevelError(TEST_ERROR_MESSAGE))

                    const props: TestBaseFormProps = {_WITH_CUSTOM_ERROR: true};
                    renderForm(props);

                    act(() => testableForm.submitData({name: "Alice"}));

                    const error = await testableForm.expectErrorMessage(TEST_ERROR_MESSAGE);
                    const wrapper = screen.getByTestId(FORM_ERROR_POS_WRAPPER_TEST_ID);
                    expect(error.parentNode).eq(wrapper);
                });
            });
        }
    });

});
