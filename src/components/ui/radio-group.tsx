import * as React from "react"

import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  name: string
  disabled?: boolean
  required?: boolean
  value?: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  name: "",
  onValueChange: () => {},
})

const useRadioGroupContext = () => {
  const context = React.useContext(RadioGroupContext)

  if (!context) {
    throw new Error(
      "useRadioGroupContext must be used within a RadioGroupProvider"
    )
  }

  return context
}

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    name: string
    value?: string
    defaultValue?: string
    required?: boolean
    disabled?: boolean
    onValueChange?: (value: string) => void
  }
>(
  (
    {
      name,
      value,
      defaultValue,
      required = false,
      disabled = false,
      onValueChange = () => {},
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")

    const contextValue = React.useMemo(
      () => ({
        name,
        disabled,
        required,
        value: value ?? internalValue,
        onValueChange: (newValue: string) => {
          setInternalValue(newValue)
          onValueChange(newValue)
        },
      }),
      [name, disabled, required, value, internalValue, onValueChange]
    )

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          aria-required={required}
          aria-orientation="vertical"
          {...props}
        />
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    value: string
  }
>(({ className, value, ...props }, ref) => {
  const { name, disabled, required, value: groupValue, onValueChange } =
    useRadioGroupContext()

  return (
    <span
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        groupValue === value && "bg-primary text-primary-foreground",
        className
      )}
    >
      <input
        type="radio"
        ref={ref}
        name={name}
        value={value}
        checked={groupValue === value}
        disabled={disabled}
        required={required}
        className="sr-only"
        onChange={() => onValueChange(value)}
        {...props}
      />
    </span>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
