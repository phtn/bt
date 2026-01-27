interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  helperText?: string
}

export function FormField({ label, required, children, helperText }: FormFieldProps) {
  return (
    <div className='w-full border-b border-zinc-700 border-dotted pb-2'>
      <div className='flex items-start justify-between'>
        <div className='w-full'>
          <label
            htmlFor={label}
            className='flex items-center space-x-1 text-xs font-brk font-medium mb-2 text-zinc-700 dark:text-zinc-300'>
            <span>{label}</span> {required && <div className='size-1.5 aspect-square bg-red-400 rounded-full'></div>}
          </label>
          {helperText && <p className='mt-1 text-xs text-zinc-500 dark:text-zinc-500'>{helperText}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
