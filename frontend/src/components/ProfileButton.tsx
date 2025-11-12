import { Avatar, Popover, UnstyledButton } from "@mantine/core";
import type { FC } from "react";

interface ProfileButtonProps {
  user?: {
    displayName: string;
    imageUrl: string;
  };
}

export const ProfileButton: FC<ProfileButtonProps> = (props = {}) => {
  const { user } = props;
  return (
    <Popover width={300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <UnstyledButton>
          <Avatar
            src={user?.imageUrl}
            radius="xl"
          />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        test
      </Popover.Dropdown>
    </Popover>
  );
};
