import { fireEvent } from "@testing-library/react";
import dayjs from "dayjs";

interface FieldFiller {
  name: string;
  match(field: HTMLElement): boolean;
  fill(field: HTMLElement, value: unknown): void;
}

// TODO more input types
const fillers: FieldFiller[] = [
  {
    name: "check field",
    match: (field) => field.getAttribute("role") === "checkbox",
    fill: (field, value) => {
      if ((field as HTMLInputElement).checked !== value) {
        fireEvent.click(field);
      }
    },
  },
  {
    name: "date field",
    match: (field) => !!field.dataset.datesInput,
    fill: (field, value) => {
      const nodeName = field.nodeName.toLowerCase();

      if (nodeName === "input") {
        const strValue =
          value instanceof Date
            ? dayjs(value).utc().format("MM/DD/YYYY")
            : (value as string);
        fireEvent.change(field, { target: { value: strValue } });
        return;
      }

      if (nodeName === "button") {
        fireEvent.click(field);
      }
      // TODO navigate calendar
    },
  },
  {
    name: "default",
    match: () => true,
    fill: (field, value) => fireEvent.change(field, { target: { value } }),
  },
];

export function fillField(field: HTMLElement, data: unknown) {
  const filler = fillers.find((f) => f.match(field));
  filler?.fill(field, data);
}
