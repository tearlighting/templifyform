import { describe, expect, it } from "vitest"
import { z } from "zod"
import { ZodValidator } from "../../lib/core/ZodValidator"

// ✅ 测试数据 Schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Must be adult"),
})

// ✅ 实例化 validator
const validator = new ZodValidator<z.output<typeof userSchema>>(userSchema)

describe("ZodValidator", () => {
  it("should validate correct data", () => {
    const res = validator.validate({ name: "Alice", age: 22 })
    expect(res.valid).toBe(true)
  })

  it("should return errors for invalid data", () => {
    const res = validator.validate({ name: "", age: 10 })
    expect(res.valid).toBe(false)
    if (res.valid) return
    expect(Object.keys(res.error!)).toContain("name")
    expect(Object.keys(res.error!)).toContain("age")
    expect(res.error.name).toBe("Name is required")
    expect(res.error.age).toBe("Must be adult")
  })

  it("should support partial invalid data", () => {
    const res = validator.validate({ name: "Bob", age: 10 })
    expect(res.valid).toBe(false)
    if (res.valid) return
    expect(res.error).toHaveProperty("age", "Must be adult")
    expect(res.error).not.toHaveProperty("name")
  })

  it("should handle nested objects", () => {
    const schema = z.object({
      user: z.object({
        email: z.string().email("Invalid email"),
      }),
    })
    const nestedValidator = new ZodValidator(schema)
    const res = nestedValidator.validate({ user: { email: "wrong" } })
    expect(res.valid).toBe(false)
    if (res.valid) return
    expect(res.error).toHaveProperty("user.email")
  })

  it("should be deterministic for same input", () => {
    const input = { name: "Tom", age: 17 }
    const res1 = validator.validate(input)
    const res2 = validator.validate(input)
    expect(res1).toEqual(res2)
  })

  it("should not mutate input object", () => {
    const input = { name: "", age: 5 }
    const clone = { ...input }
    validator.validate(input)
    expect(input).toEqual(clone)
  })
})
