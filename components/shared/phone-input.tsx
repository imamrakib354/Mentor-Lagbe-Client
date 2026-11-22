"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { isValidPhone } from "@/lib/helpers/phone"

export function PhoneInput({ id, defaultValue = "", required = false, className }: {
  id: string
  defaultValue?: string
  required?: boolean
  className?: string
}) {
  const [phone, setPhone] = useState(defaultValue)
  const [limitError, setLimitError] = useState("")
  const error = limitError || (phone && !isValidPhone(phone)
    ? "Enter 11 digits starting with 01, or 880 followed by 10 digits."
    : "")

  function handleChange(value: string) {
    const limit = value.startsWith("+880") ? 14 : value.startsWith("880") ? 13 : 11
    if (value.length > limit) {
      setPhone(value.slice(0, limit))
      setLimitError(limit === 11 ? "Numbers starting with 01 must be 11 digits." : "Numbers starting with 880 must be 13 digits.")
      return
    }
    setPhone(value)
    setLimitError("")
  }

  return (
    <>
      {error && <p id={`${id}-error`} role="alert" className="text-xs text-red-700">{error}</p>}
      <Input
        id={id}
        name="phone"
        type="tel"
        required={required}
        value={phone}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error ${id}-hint` : `${id}-hint`}
        className={className}
      />
      <p id={`${id}-hint`} className="text-xs text-slate-500">Use 01XXXXXXXXX, 8801XXXXXXXXX, or +8801XXXXXXXXX.</p>
    </>
  )
}
