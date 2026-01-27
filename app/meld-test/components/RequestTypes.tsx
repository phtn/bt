import { Method } from '@/components/ui/method'
import { ParamType } from '@/components/ui/param-type'
import { Title } from '@/components/ui/title'
import { EndpointConfig, hasBodySchema } from '../endpoints'

interface RequestTypeProps {
  endpoint: EndpointConfig
}

export const RequestTypes = ({ endpoint }: RequestTypeProps) => {
  return (
    <div className='p-2 space-y-4 dark:bg-zinc-800/80'>
      <div>
        <h2 className='text-lg font-okxs font-medium text-zinc-900 dark:text-zinc-100 mb-1'>{endpoint.name}</h2>
        <p className='text-sm font-okxs opacity-60'>{endpoint.description}</p>
        <div className='mt-2 flex items-center gap-2'>
          <Method method={endpoint.method} />
          <span className='text-xs font-brk opacity-80'>{endpoint.path}</span>
        </div>
      </div>
      <Title text='Request Params' />
      {endpoint.params && endpoint.params.length > 0 ? (
        <div className='space-y-3'>
          {endpoint.params.map((param) => (
            <div key={param.name} className='border-b border-zinc-200 dark:border-zinc-800 pb-3 last:border-0'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center space-x-1 text-xs font-brk font-medium text-zinc-900 dark:text-zinc-100'>
                  <span>{param.name}</span>
                  {param.required && <div className='size-1.5 aspect-square rounded-full bg-red-400'></div>}
                </div>
                <ParamType type={param.type} />
              </div>

              {param.description && (
                <p className='text-xs text-zinc-500 dark:text-zinc-500 mt-1'>{param.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>No parameters required</p>
      )}
      {hasBodySchema(endpoint) && (
        <div>
          <Title text='Body Schema' />
          <div className='p-3 bg-zinc-50 dark:bg-zinc-950'>
            <pre className='text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto'>
              {JSON.stringify(endpoint.bodySchema, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
