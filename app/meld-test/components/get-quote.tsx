import { FormField } from './shared/FormField'

//
interface Props {
  onSubmit: VoidFunction
}

export const GetQuote = ({ onSubmit }: Props) => {
  // const handleSubmit = (event: FormEvent) => {
  //   event.preventDefault()
  //   // Add your logic here to handle form submission
  //   console.log('Form submitted')
  // }

  return (
    <form onSubmit={onSubmit} className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-semibold mb-4'>Generic Endpoint</h2>
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>Test any Meld API endpoint with custom parameters</p>
      <div className='space-y-4'>
        <FormField label='PHP' required>
          <input
            type='text'
            // value={apiKey}
            // onChange={(e) => setApiKey(e.target.value)}
            placeholder='0.00'
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground'
            required
          />
          <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>Amount</p>
          <button
            type='submit'
            onClick={(e) => {
              e.preventDefault()
              onSubmit()
            }}>
            Submit
          </button>
        </FormField>
      </div>
    </form>
  )
}
