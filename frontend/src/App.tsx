import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router";
import { router } from "@/routes.tsx";
import { LocaleProvider } from "@/contexts/LocaleProvider.tsx";

export default function App() {
  return (
    <LocaleProvider>
      <MantineProvider>
        <RouterProvider router={router} />;
      </MantineProvider>
    </LocaleProvider>
  );
}
