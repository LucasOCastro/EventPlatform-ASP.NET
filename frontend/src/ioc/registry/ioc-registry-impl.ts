import {
  type IIocRegistry,
  type IocFactories,
  type IocInstances,
} from "@/ioc/registry/ioc-registry.ts";
import { IocLoopError, IocMissingError } from "@/ioc/registry/errors.ts";

export class IocRegistryImpl<TConfig extends Record<string, unknown>>
  implements IIocRegistry<TConfig>
{
  private readonly _instances = {} as IocInstances<TConfig>;
  private readonly _factories: IocFactories<TConfig>;
  private readonly _currentStack = new Set<string>();

  public constructor(factories: IocFactories<TConfig>) {
    this._factories = factories;

    for (const name in this._factories) {
      this.get(name);
    }
  }

  public get<TName extends Extract<keyof TConfig, string>>(
    name: TName,
  ): TConfig[TName] {
    if (name in this._instances) return this._instances[name];

    if (this._factories[name]) {
      if (this._currentStack.has(name)) {
        throw new IocLoopError([...this._currentStack], name);
      }

      this._currentStack.add(name);
      try {
        const instance = this._factories[name](this);
        this._instances[name] = instance;
        return instance;
      } finally {
        this._currentStack.delete(name);
      }
    }

    throw new IocMissingError(name);
  }
}
