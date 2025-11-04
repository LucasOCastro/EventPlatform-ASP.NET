import { describe, expect, it, vi } from "vitest";
import { IocRegistryImpl } from "./ioc-registry-impl";
import type { IocFactories } from "@/ioc/registry/ioc-registry.ts";
import { IocLoopError, IocMissingError } from "@/ioc/registry/errors.ts";

type TestConfig = {
  serviceA: string;
  serviceB: string;
  serviceC: string;
};

describe("IocRegistryImpl", () => {
  it("should create and retrieve an instance from the factory", () => {
    const factories: IocFactories<TestConfig> = {
      serviceA: () => "Service A",
      serviceB: () => "Service B",
      serviceC: () => "Service C",
    };

    const registry = new IocRegistryImpl(factories);
    expect(registry.get("serviceA")).toBe("Service A");
    expect(registry.get("serviceB")).toBe("Service B");
    expect(registry.get("serviceC")).toBe("Service C");
  });

  it("should throw IocMissingError for a missing service", () => {
    // @ts-expect-error Simulate missing service
    const factories: IocFactories<TestConfig> = {
      serviceA: () => "Service A",
      serviceB: () => "Service B",
    };

    const registry = new IocRegistryImpl(factories);
    expect(() => registry.get("serviceC")).toThrowError(IocMissingError);
  });

  it("should memoize instances and return the same instance for multiple calls", () => {
    const factorySpy = vi.fn(() => "Service A");
    // @ts-expect-error Unnecessary for test
    const factories: IocFactories<TestConfig> = {
      serviceA: factorySpy,
      serviceB: () => "Service B",
    };

    const registry = new IocRegistryImpl(factories);
    const instance1 = registry.get("serviceA");
    const instance2 = registry.get("serviceA");

    expect(instance1).toBe("Service A");
    expect(instance2).toBe("Service A");
    expect(factorySpy).toHaveBeenCalledOnce();
  });

  it("should throw IocLoopError on circular dependencies", () => {
    // @ts-expect-error Unnecessary for test
    const factories: IocFactories<TestConfig> = {
      serviceA: (registry) => registry.get("serviceB"),
      serviceB: (registry) => registry.get("serviceA"),
    };

    expect(() => new IocRegistryImpl(factories)).toThrow(
      new IocLoopError(["serviceA", "serviceB"], "serviceA"),
    );
  });
});
