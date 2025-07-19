import type { FC } from "react";
import { Image } from "@mantine/core";
import reactSvg from "@/assets/react.svg";

interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo: FC<LogoProps> = (props = {}) => {
  const { width = 72, height = 64 } = props;
  return <Image w={width} h={height} alt="Website Logo" src={reactSvg}></Image>;
};
