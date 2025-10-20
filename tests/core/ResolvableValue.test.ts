import { describe, it, expect } from "vitest"
import { ResolvableValue } from "../../lib/core/ResolvableValue"

describe("ResolvableValue", () => {
  it("should resolve a static value", () => {
    const rv = new ResolvableValue("hello")
    expect(rv.resolve({})).toBe("hello")
  })

  it("should resolve via function", () => {
    const rv = new ResolvableValue("", ({ t }) => t("world"))
    const result = rv.resolve({ t: (key: string) => key.toUpperCase() })
    expect(result).toBe("WORLD")
  })

  it("should resolve via ctx", () => {
    const rv = new ResolvableValue("value", ({ ctx }, value) => ctx + value)
    const result = rv.resolve({ ctx: "ctx" })
    expect(result).toBe("ctxvalue")
  })

  it("should resolve via new value", () => {
    const rv = new ResolvableValue("hello")
    expect(rv.resolve({})).toBe("hello")
    rv.setValue("world")
    expect(rv.resolve({})).toBe("world")
  })
})
