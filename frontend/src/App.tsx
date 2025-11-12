import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@/plugins/setup";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router";
import { router } from "@/config/routes.tsx";
import { LocaleProvider } from "@/contexts/LocaleProvider.tsx";
import AuthProvider from "@/contexts/AuthProvider.tsx";
import { registry } from "@/ioc";

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider authService={registry.get("IAuthService")}>
        <MantineProvider>
          <RouterProvider router={router} />
        </MantineProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}
