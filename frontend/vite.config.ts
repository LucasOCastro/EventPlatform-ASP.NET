import { mergeConfig, type ConfigEnv, type UserConfig } from "vite";
import baseConfig from "./vite.config.base";

const configMap: Record<string, () => Promise<{ default: UserConfig }>> = {
  development: () => import("./vite.config.dev"),
  production: () => import("./vite.config.prod"),
  test: () => import("./vite.config.vitest"),
};

async function getSpecificConfig(mode: string) {
  const func = configMap[mode] || configMap["development"];
  const imported = await func();
  return imported.default;
}

async function getConfig(mode: string) {
  const specificConfig = await getSpecificConfig(mode);
  return mergeConfig(baseConfig, specificConfig);
}

export default async ({ mode }: ConfigEnv) => {
  const config = await getConfig(mode);

  console.log("--- Loading Vite Config ---");
  console.log("Mode = ", mode);
  console.log("Final config:", config);
  console.log("--- End Loading Vite Config ---");

  return config;
};
