import { mergeConfig, type ConfigEnv } from 'vite'
import baseConfig from './vite.config.base.js'  // your common config

function getSpecificConfig(mode: string) {
  return mode === 'development'
    ? require('./vite.config.dev.js').default
    : require('./vite.config.prod.js').default
}

export default ({ mode }: ConfigEnv) => {
  const specificConfig = getSpecificConfig(mode);
  return mergeConfig(baseConfig, specificConfig)
}