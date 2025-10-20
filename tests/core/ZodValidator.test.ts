import { describe, it, expect, beforeEach, vi } from "vitest"
import { z } from "zod"
import { createZodValidator, ZodValidator } from "../../lib/core/ZodValidator"

// mock 简单的 sub/pub 机制

describe("ZodValidator", () => {
  let validator: ZodValidator<any>

  beforeEach(() => {
    const schema = z.object({
      name: z.string().min(1, "required"),
      age: z.number().min(0, "too small"),
    })
    validator = createZodValidator(schema, { name: "Alice", age: 20 })
  })

  it("should get and set values", () => {
    expect(validator.getValue("name")).toBe("Alice")
    validator.setValue("name", "Bob")
    expect(validator.getValue("name")).toBe("Bob")
  })

  it("should reset formData correctly", () => {
    validator.reset({ name: "NewName" })
    const data = validator.formData
    expect(data.name).toBe("NewName")
    expect(data.age).toBeNull()
  })

  it("should validate all fields successfully", () => {
    const res = validator.validateAll()
    expect(res.valid).toBe(true)
    expect(res.error).toBeNull()
  })

  it("should return validation errors when invalid", () => {
    validator.setValue("name", "")
    validator.setValue("age", -5)
    const res = validator.validateAll()
    expect(res.valid).toBe(false)
    expect(res.error?.name).toBe("required")
    expect(res.error?.age).toBe("too small")
  })

  it("should publish validation result via pub/sub", () => {
    const callback = vi.fn()
    validator.subscribe(callback)
    validator.setValue("name", "")
    validator.runValidation("name")
    expect(callback).toHaveBeenCalled()
    const [result] = callback.mock.calls[0]
    expect(result.valid).toBe(false)
    expect(result.error?.name).toBe("required")
  })
})
