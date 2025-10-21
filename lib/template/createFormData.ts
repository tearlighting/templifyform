import type { ICreateFormDataProps } from 'templify-form';
import {
  z,
  type ZodType,
} from 'zod';

export function createFormData<TProp extends string, TShape extends Record<TProp, ZodType>>(payload: ICreateFormDataProps<TProp, TShape>) {
  const { defaultValues, schemaRelations, shapes, props } = normalizeParams(payload)
  const schema = z.object(shapes)
  const schemaWithRelations = schemaRelations(schema) as any as typeof schema
  const formData = Object.fromEntries(props.map((prop) => [prop, defaultValues[prop as unknown as keyof typeof defaultValues] ?? null])) as z.infer<typeof schema>
  return {
    schema: schemaWithRelations,
    formData,
  }
}
const normalizeParams = <TProp extends string, TShape extends Record<TProp, ZodType>>(params: ICreateFormDataProps<TProp, TShape>) => {
  const { props, defaultValues = {}, shapes, schemaRelations = (schema) => schema } = params
  if (props.length !== Object.keys(shapes).length) throw new Error("props and schema length must be equal")
  return { props, defaultValues, schemaRelations, shapes } as Required<ICreateFormDataProps<TProp, TShape>>
}
