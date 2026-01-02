import type { DevToolType } from '../types'

interface TabNavigationProps {
  activeTab: DevToolType
  onTabChange: (tab: DevToolType) => void
}

const tabs: { id: DevToolType; label: string }[] = [
  { id: 'url', label: 'URL Encoder/Decoder' },
  { id: 'base64', label: 'Base64 Encoder/Decoder' },
  { id: 'json', label: 'JSON Formatter' },
  { id: 'html', label: 'HTML Encoder/Decoder' }
]

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className='flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-primary text-primary tracking-tighter'
              : 'text-gray-600 dark:text-gray-400 hover:text-foreground'
          }`}>
          {tab.label}
        </button>
      ))}
    </div>
  )
}

