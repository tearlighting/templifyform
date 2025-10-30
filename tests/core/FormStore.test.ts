import { beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"
import { FormStore, createFormStore } from "../../lib/core/FormStore"
import { ResolvableValueRestable } from "../../lib/core/ResolvableValueRestable"
import { ZodValidator, createZodValidator } from "../../lib/core/ZodValidator"

describe("FormStore", () => {
  let store: FormStore<any, any, any, any, any>
  let validator: ZodValidator<any>
  let formTemplate: any[]

  beforeEach(() => {
    const schema = z.object({
      name: z.string().min(1, "required"),
      age: z.number().min(0, "too small"),
    })
    const formData = { name: "Alice", age: 18 }

    validator = createZodValidator(schema)

    formTemplate = [
      {
        prop: "name",
        label: "Name",
        error: new ResolvableValueRestable(""),
      },
      {
        prop: "age",
        label: "Age",
        error: new ResolvableValueRestable(""),
      },
    ]

    store = createFormStore(formTemplate, formData, validator)
  })

  it("should initialize with snapshot correctly", () => {
    const snap = store.getSnapshot()
    expect(snap.formData.name).toBe("Alice")
    expect(snap.formData.age).toBe(18)
    expect(snap.isValid).toBe(true)
  })

  it("should handle validateAll and update errors", () => {

    store.setFormData({ name: "" })
    store.setFormData({ age: -1 })
    store.validateAll()

    const snap = store.getSnapshot()
    expect(snap.isValid).toBe(false)
    expect(Object.keys(snap.errors).length).toBeGreaterThan(0)
  })

  it("should handle validateField and update one field", () => {
    store.setFormData({ name: "" })
    store.validateField("name")

    const snap = store.getSnapshot()
    expect(snap.errors.name).toBe("required")
  })

  it("should allow setError manually", () => {
    store.setError("name", "manual error")
    const snap = store.getSnapshot()
    expect(snap.errors.name).toBe("manual error")
  })

  it("should reset formData and clear errors", () => {
    store.setError("name", "manual error")
    store.reset({ name: "Reset", age: 0 })
    const snap = store.getSnapshot()
    expect(snap.formData.name).toBe("Reset")
  })

  it("should publish and subscribe properly", () => {
    const callback = vi.fn()
    const unsubscribe = store.subscribe(callback)
    store.setFormData({ name: "Bob" })
    expect(callback).toHaveBeenCalled()
    unsubscribe()
  })

  it("should update formTemplate dynamically", () => {
    store.setFormTemplate({
      name: {
        label: "NewLabel",
      },
    })
    const snap = store.getSnapshot()
    expect(snap.formTemplate.find((x) => x.prop === "name")?.label).toBe("NewLabel")
  })

  it("should support function-based setFormTemplate updater", () => {
    store.setFormTemplate({
      name: ({ formTemplate }: { formTemplate: any[] }) => ({
        label: formTemplate.find((x) => x.prop === "name")?.label + "!",
      }),
    })
    const snap = store.getSnapshot()
    expect(snap.formTemplate.find((x) => x.prop === "name")?.label).toBe("Name!")
  })
})
