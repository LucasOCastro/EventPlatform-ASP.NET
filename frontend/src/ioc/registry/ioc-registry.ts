export interface IIocRegistry<TConfig extends Record<string, unknown>> {
  get: <TName extends Extract<keyof TConfig, string>>(
    name: TName,
  ) => TConfig[TName];
}

export type IocInstances<TConfig extends Record<string, unknown>> = {
  [TName in keyof TConfig]: TConfig[TName];
};

export type IocFactory<
  TConfig extends Record<string, unknown>,
  TName extends keyof TConfig,
> = (registry: IIocRegistry<TConfig>) => TConfig[TName];

export type IocFactories<TConfig extends Record<string, unknown>> = {
  [TName in keyof TConfig]: IocFactory<TConfig, TName>;
};
