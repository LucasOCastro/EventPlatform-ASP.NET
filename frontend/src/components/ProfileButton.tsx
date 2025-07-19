import { Avatar, Popover, UnstyledButton } from "@mantine/core";

export const ProfileButton = () => {
  const user = {
    image: "react.svg",
  };

  return (
    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <UnstyledButton>
          <Avatar src={user.image} radius="xl" />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>test</Popover.Dropdown>
    </Popover>
  );
};
