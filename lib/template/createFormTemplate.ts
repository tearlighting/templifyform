import type {
  I18nResolveCxt,
  ICreateFormTemplateProps,
  IFormTemplateItem,
  IRender,
} from 'templify-form';

import { ETemplateType } from '../constants';
import {
  normalizeFormTemlatePayloads,
} from '../utils/normalizeFormTemlatePayloads';

export function createFormTemplate<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TResolveCxt extends any = any, TFormData extends any = any>(
  payload: ICreateFormTemplateProps<TProp, TTypes, TResolveCxt>
) {
  const { props, labels, types, options, readonlys, errors, renders, formItemClassNames, formItemContentClassNames, formItemLabelClassNames } = normalizeFormTemlatePayloads<
    TProp,
    TTypes,
    TResolveCxt
  >(payload)
  return props.map((prop) => {
    const label = labels[prop]
    const type: ETemplateType = types[prop] ?? ETemplateType.input
    const readonly: boolean = readonlys[prop] ?? false
    const option = type === ETemplateType.select ? options[prop as keyof typeof options] || null : null
    const error = errors[prop]
    const formItemClassName = formItemClassNames[prop] ?? ""
    const formItemContentClassName = formItemContentClassNames[prop] ?? ""
    const formItemLabelClassName = formItemLabelClassNames[prop] ?? ""
    const res = {
      prop,
      label,
      type,
      readonly,
      ...(option ? { option } : {}),
      error,
      formItemClassName,
      formItemContentClassName,
      formItemLabelClassName,
      render: undefined as unknown as IRender<TProp, TResolveCxt, TFormData>,
    }
    if (renders[prop]) {
      res.render = function (...args: any[]) {
        return (renders[prop] as any)!(res, ...args)
      }
    }
    return res as any as IFormTemplateItem<TProp, TResolveCxt, TFormData>
  })
}

export const generateCreateFormTemplate = <TResolveCxt>() => {
  return function <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>>(payload: ICreateFormTemplateProps<TProp, TTypes, TResolveCxt>) {
    return createFormTemplate<TProp, TTypes, TResolveCxt>(payload)
  }
}

export const createFormTemplateResolverI18n = generateCreateFormTemplate<I18nResolveCxt>()
