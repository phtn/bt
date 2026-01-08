import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { LossStreakBarDatum, StreakStats } from './types'

export function StreaksSection(props: {
  windowSize: number
  streaks: StreakStats
  lossStreakBarData: LossStreakBarDatum[]
}) {
  const { windowSize, streaks, lossStreakBarData } = props

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4'>
        <h2 className='text-xl font-bold'>Win/Loss streaks</h2>
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          Streaks are computed from the extracted metric stream (usable rounds only).
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <div className='p-5 rounded-lg border border-green-500/20 bg-green-500/10'>
          <div className='text-sm text-gray-700 dark:text-gray-200'>Longest win streak</div>
          <div className='text-3xl font-bold text-green-600 dark:text-green-300'>{streaks.longestWinStreak}</div>
          <div className='text-xs text-gray-600 dark:text-gray-300 mt-1'>
            Win streaks counted: <span className='font-mono'>{streaks.winStreaksTotal}</span>
          </div>
        </div>
        <div className='p-5 rounded-lg border border-red-500/20 bg-red-500/10'>
          <div className='text-sm text-gray-700 dark:text-gray-200'>Longest loss streak</div>
          <div className='text-3xl font-bold text-red-600 dark:text-red-300'>{streaks.longestLossStreak}</div>
          <div className='text-xs text-gray-600 dark:text-gray-300 mt-1'>
            Loss streaks counted: <span className='font-mono'>{streaks.lossStreaksTotal}</span>
          </div>
        </div>
      </div>

      {streaks.frequency.length === 0 ? (
        <p className='text-sm text-gray-500 dark:text-gray-400'>Not enough usable rounds to compute streaks.</p>
      ) : (
        <div className='space-y-6'>
          <div>
            <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3'>
              Losing streak frequency (last {windowSize} rounds)
            </h3>
            {lossStreakBarData.length === 0 ? (
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                No losing streaks found (all wins, or not enough usable data).
              </p>
            ) : (
              <div className='h-72'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={lossStreakBarData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray='3 3' opacity={0.25} />
                    <XAxis dataKey='length' tickMargin={8} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey='count' name='Losing streaks' fill='#ef4444' radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
              X = consecutive losses in a row. Y = how many times that streak length occurred.
            </p>
          </div>

          <div className='overflow-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-left border-b border-gray-200 dark:border-gray-700'>
                  <th className='py-2 pr-4'>Length</th>
                  <th className='py-2 pr-4'>Win streaks</th>
                  <th className='py-2 pr-4'>Loss streaks</th>
                  <th className='py-2 pr-0'>Total</th>
                </tr>
              </thead>
              <tbody>
                {streaks.frequency.map((row) => (
                  <tr key={row.length} className='border-b border-gray-100 dark:border-gray-800'>
                    <td className='py-2 pr-4 font-mono'>{row.length}</td>
                    <td className='py-2 pr-4 font-mono'>{row.winCount}</td>
                    <td className='py-2 pr-4 font-mono'>{row.lossCount}</td>
                    <td className='py-2 pr-0 font-mono'>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

