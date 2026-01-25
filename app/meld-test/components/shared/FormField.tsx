interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  helperText?: string
}

export function FormField({ label, required, children, helperText }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium mb-2 text-zinc-700 dark:text-zinc-300">
        {label} {required && <span className="text-zinc-500">*</span>}
      </label>
      {children}
      {helperText && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{helperText}</p>}
    </div>
  )
}
