import { z } from "zod";
import { TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BaseForm } from "@/components/BaseForm";
import type { FormProps } from "@/types/form-props";
import { testForm } from "@/tests/forms";
import type {FC} from "react";

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
const TestBaseForm: FC<FormProps<BaseFormType>> = (props: FormProps<BaseFormType>) => {
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
    });
});
