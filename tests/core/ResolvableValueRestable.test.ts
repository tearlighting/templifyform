import { describe, it, expect } from "vitest"
import { ResolvableValueRestable } from "../../lib/core/ResolvableValueRestable"

describe("ResolvableValue", () => {
  it("should hide value", () => {
    const rv = new ResolvableValueRestable("hello")
    expect(rv.resolve({})).toBe("hello")
    rv.rest()
    expect(rv.resolve({})).toBe("")
  })
  it("should show value", () => {
    const rv = new ResolvableValueRestable("hello")
    rv.rest()
    expect(rv.resolve({})).toBe("")
    rv.show()
    expect(rv.resolve({})).toBe("hello")
  })
})
