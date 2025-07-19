import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router";
import { router } from "@/routes.tsx";

export default function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />;
    </MantineProvider>
  );
}
