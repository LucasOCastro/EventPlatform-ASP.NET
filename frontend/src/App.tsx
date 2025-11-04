import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@/plugins/setup";
import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router";
import { router } from "@/routes.tsx";
import { LocaleProvider } from "@/contexts/LocaleProvider.tsx";
import { ModalsProvider } from "@mantine/modals";
import AuthProvider from "@/contexts/AuthProvider.tsx";
import { registry } from "@/ioc";

export default function App() {
  return (
    <LocaleProvider>
      <MantineProvider>
        <ModalsProvider>
          <AuthProvider authService={registry.get("IAuthService")}>
            <RouterProvider router={router} />;
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </LocaleProvider>
  );
}
