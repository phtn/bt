interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
}

export function FormField({ label, required, children, helperText }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {helperText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

