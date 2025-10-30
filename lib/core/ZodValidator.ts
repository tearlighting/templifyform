import { ZodObject } from "zod"

export type TValidateRes<TProp extends string> = {
    valid: true
} | {
    error: Record<TProp, string>,
    valid: false
}

export interface IValidator<TForm extends Record<string, any>> {
    validate(value: TForm): TValidateRes<keyof TForm & string>
}

export class ZodValidator<TForm extends Record<string, any>> implements IValidator<TForm> {
    constructor(private _schema: ZodObject<any>) { }
    validate(value: TForm): TValidateRes<keyof TForm & string> {
        const { success, error } = this._schema.safeParse(value)
        if (success) {
            return { valid: success }
        } else {
            const errorNew = error!.issues.reduce((acc, err) => {
                const fieldName = err.path.join(".")
                acc[fieldName as keyof TForm & string] = err.message
                return acc
            }, {} as Record<keyof TForm & string, string>)
            return { error: errorNew, valid: success }
        }
    }
}

export const createZodValidator = <TForm extends Record<string, any>>(schema: ZodObject<any>) => new ZodValidator<TForm>(schema)
