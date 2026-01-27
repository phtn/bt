'use client'

import { createContext, useContext } from 'react'
import { parseAsString, useQueryState } from 'nuqs'

// Tab values
export type ProjectTab = 'overview' | 'gate' | 'meld' | 'swapped' | 'moonpay'

// Panel content variables
export type ProjectPanelState = {
  // Meld panel variables
  meldEndpointId?: string
  meldApiKey?: string
  meldEnvironment?: string
  // PayGate panel variables
  paygateTab?: string
}

const ProjectContext = createContext<{
  tab: ProjectTab
  setTab: (tab: ProjectTab) => void
  meldEndpointId: string | null
  setMeldEndpointId: (id: string | null) => void
  paygateTab: string | null
  setPaygateTab: (tab: string | null) => void
} | null>(null)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTabQuery] = useQueryState(
    'tab',
    parseAsString.withDefault('overview').withOptions({
      history: 'push',
      shallow: false
    })
  )

  const [meldEndpointId, setMeldEndpointId] = useQueryState(
    'meld.endpoint',
    parseAsString.withOptions({
      history: 'push',
      shallow: false
    })
  )

  const [paygateTab, setPaygateTab] = useQueryState(
    'paygate.tab',
    parseAsString.withOptions({
      history: 'push',
      shallow: false
    })
  )

  const setTab = (value: ProjectTab) => {
    setTabQuery(value)
  }

  return (
    <ProjectContext.Provider
      value={{
        tab: tab as ProjectTab,
        setTab,
        meldEndpointId,
        setMeldEndpointId,
        paygateTab,
        setPaygateTab
      }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext() {
  return useContext(ProjectContext)
}
