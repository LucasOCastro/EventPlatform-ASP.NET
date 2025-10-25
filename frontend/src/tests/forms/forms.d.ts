import type {ReactElement} from "react";
import type {FormOnSubmit, FormProps} from "@/types/form-props.ts";
import TestableForm, {type FormShape} from "@/tests/forms/testable-form.ts";
import type {Mock} from "vitest";

export interface TestPath<TFormData extends object> {
    name: string;
    data: TFormData;
    renderProps?: Omit<FormProps<TFormData>, "onSubmit">;
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
    customTest?: (props: {
        testableForm: TestableForm<TFormData>,
        renderForm: ((props?: Omit<FormProps<TFormData>, "onSubmit">) => void),
        mockOnSubmit: Mock<FormOnSubmit<TFormData>>,
    }) => void;
}

export interface TestPathHooks {
    setup?: () => Promise<void> | void;
    customTest?: () => Promise<void> | void;
    cleanup?: () => Promise<void> | void;
}
