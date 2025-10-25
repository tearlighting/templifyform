import { Input, type InputProps } from "antd"
import { useEffectEvent } from "react"
interface NumericInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: string | number
  onChange: (value: number) => void
}

export const NumericInput = ({ value, onChange, ...props }: NumericInputProps) => {
  const handleChange = useEffectEvent((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target
    const reg = /^-?\d*(\.\d*)?$/
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(+inputValue)
    }
  })

  return <Input {...props} value={value} onChange={handleChange} maxLength={16} />
}
