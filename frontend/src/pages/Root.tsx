import { type FC } from "react";
import { Link, Outlet } from "react-router";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Logo } from "@/components/Logo.tsx";
import { ProfileButton } from "@/components/ProfileButton.tsx";
import { Spacer } from "@/components/Spacer.tsx";

export const Root: FC = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <>
      <AppShell header={{ height: 70 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Link to="/">
              <Logo />
            </Link>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Spacer />
            <ProfileButton />
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        );
      </AppShell>
    </>
  );
};
