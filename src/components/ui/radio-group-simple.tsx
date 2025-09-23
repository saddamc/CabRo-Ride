import * as React from "react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ className, defaultValue, value, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  
  const contextValue = React.useMemo(
    () => ({
      value: value !== undefined ? value : internalValue,
      onValueChange: (newValue: string) => {
        setInternalValue(newValue)
        onValueChange?.(newValue)
      },
    }),
    [value, internalValue, onValueChange]
  )

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn("grid gap-2", className)}
        {...props}
      />
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

interface RadioGroupContextValue {
  value?: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  onValueChange: () => {},
})

const RadioGroupItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    disabled?: boolean
    id?: string
  }
>(({ className, value, disabled, id, ...props }, ref) => {
  const { value: groupValue, onValueChange } = React.useContext(RadioGroupContext)
  const checked = value === groupValue

  return (
    <div
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background",
        "flex items-center justify-center text-current",
        checked && "bg-primary text-primary-foreground",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <input
        type="radio"
        id={id}
        className="sr-only"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onValueChange(value)}
      />
      {checked && (
        <div className="h-2 w-2 rounded-full bg-current" />
      )}
    </div>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
