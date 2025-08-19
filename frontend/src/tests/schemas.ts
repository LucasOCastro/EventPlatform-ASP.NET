import { z, ZodError, type ZodObject } from "zod";

interface TestField<TField> {
  happy: TField[];
  sad?: unknown[] | undefined;
}

type TestShape<T> = {
  [k in keyof T]: TestField<T[k]>;
};

function makeBaseTest<T>(test: TestShape<T>): T {
  return Object.fromEntries(
    Object.entries(test).map(([key, value]) => [
      key,
      (value as TestField<T[keyof T]>).happy[0],
    ]),
  ) as T;
}

export function testSchema<TSchema extends ZodObject>(
  schema: TSchema,
  test: TestShape<z.infer<TSchema>>,
) {
  const baseTest = makeBaseTest(test);

  it("should accept valid base test", () => {
    expect(() => schema.parse(baseTest)).not.toThrow();
  });

  for (const key in test) {
    const field = test[key];
    it(`should accept valid ${key}`, () => {
      for (const happy of field.happy.slice(1)) {
        const test = { ...baseTest, [key]: happy };
        expect(() => schema.parse(test)).not.toThrow();
      }
    });

    const sadArr = field.sad || [];
    if (!sadArr.length) continue;

    it(`should reject invalid ${key}`, () => {
      for (const sad of sadArr) {
        const test = { ...baseTest, [key]: sad };
        expect(() => schema.parse(test)).toThrow(ZodError);
      }
    });
  }
}
