import type { FC } from "react";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { AuthModal } from "@/components/auth/AuthModal.tsx";

export const LoginButton: FC = () => {
  function onClick() {
    modals.open({
      title: "Welcome!",
      children: <AuthModal />,
    });
  }

  return (
    <Button variant="primary" onClick={onClick}>
      Join
    </Button>
  );
};
