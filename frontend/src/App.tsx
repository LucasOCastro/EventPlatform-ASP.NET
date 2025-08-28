import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router";
import { router } from "@/routes.tsx";
import { LocaleProvider } from "@/contexts/LocaleProvider.tsx";
import { ModalsProvider } from "@mantine/modals";
import "@/plugins/setup";

export default function App() {
  return (
    <LocaleProvider>
      <MantineProvider>
        <ModalsProvider>
          <RouterProvider router={router} />;
        </ModalsProvider>
      </MantineProvider>
    </LocaleProvider>
  );
}
