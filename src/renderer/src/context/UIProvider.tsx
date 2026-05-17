// UIProvider.tsx
import { ReactNode, ReactElement, useState } from 'react'
import { UIContext, AppMode } from './UIContext'

export const UIProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [currentMode, setCurrentMode] = useState<AppMode>('weaver')

  return <UIContext.Provider value={{ currentMode, setCurrentMode }}>{children}</UIContext.Provider>
}
