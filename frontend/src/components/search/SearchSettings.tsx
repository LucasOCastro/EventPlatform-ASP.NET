import type {FC} from "react";
import {Card, Grid} from "@mantine/core";
import type {FormProps} from "@/types/form-props.ts";
import type {SearchOptions} from "@/types/search.ts";
import {BaseForm} from "@/components/BaseForm.tsx";
import {useForm} from "@mantine/form";

export type SearchSettingsProps = FormProps<SearchOptions>
export const SearchSettings: FC<SearchSettingsProps> = (props = {}) => {
    const form = useForm<SearchOptions>()

    return (
        <Card>
            <BaseForm form={} schema={}>
                <Grid>
                    <Grid.Col>

                    </Grid.Col>
                </Grid>
            </BaseForm>
        </Card>
    )
}