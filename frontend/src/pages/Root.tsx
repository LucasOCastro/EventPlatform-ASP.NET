import { type FC } from "react";
import { Link, Outlet } from "react-router";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Logo } from "@/components/Logo.tsx";
import { Spacer } from "@/components/Spacer.tsx";
import { LoginButton } from "@/components/auth/LoginButton.tsx";

export const Root: FC = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <>
      <AppShell header={{ height: 70 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Link to="/">
              <Logo />
            </Link>
            <Spacer />
            <LoginButton />
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
};
