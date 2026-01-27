export const ParamType = ({ type }: { type: string }) => {
  const color =
    type === 'string' ? 'var(--color-string)' : type === 'number' ? 'var(--color-number)' : 'var(--color-boolean)'
  return (
    <span className='text-xs font-brk rounded-sm px-1 py-0.5 bg-zinc-200 dark:bg-zinc-950' style={{ color }}>
      {type}
    </span>
  )
}
