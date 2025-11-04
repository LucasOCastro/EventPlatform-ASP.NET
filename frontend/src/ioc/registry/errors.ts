export class IocMissingError extends Error {
  constructor(name: string) {
    super(`Service ${name} is not registered`);
  }
}

export class IocLoopError extends Error {
  constructor(stack: string[], name?: string) {
    const sequence = [...stack];
    if (name) sequence.push(name);

    super(sequence.join("->"));
  }
}
