import type { FC } from "react";
import { Center, Paper } from "@mantine/core";
import { useAuth } from "@/contexts/AuthProvider.tsx";

export const Home: FC = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Center>
        <Paper>
          {currentUser && <h1>Welcome, {currentUser.firstName}</h1>}
          <h2>Browse events. For free.</h2>
          {!currentUser && <span>Hosting or joining? Sign in or sign up.</span>}
        </Paper>
      </Center>
    </>
  );
};
