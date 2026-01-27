export const Method = ({ method }: { method: string }) => {
  const color = method === 'GET' ? 'var(--color-get)' : method === 'POST' ? 'var(--color-post)' : 'var(--color-put)'
  return (
    <span className='text-xs font-brk rounded-sm px-1 py-0.5 bg-zinc-200 dark:bg-zinc-950' style={{ color }}>
      {method}
    </span>
  )
}
