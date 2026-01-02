import type { EndpointType } from '../types'

interface TabNavigationProps {
  activeTab: EndpointType
  onTabChange: (tab: EndpointType) => void
}

const tabs: { id: EndpointType; label: string }[] = [
  { id: 'generic', label: 'Generic Endpoint' },
  { id: 'health', label: 'Health Check' },
  { id: 'config', label: 'Config' },
  { id: 'quote', label: 'Quote' }
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
