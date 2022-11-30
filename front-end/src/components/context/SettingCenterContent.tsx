import { useState, useContext, createContext } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { ContentType } from 'interfaces/Query'

const SettingContentContext = createContext<string>(ContentType.myRecipe)
const SetSettingContentContext = createContext<Dispatch<SetStateAction<string>>>(undefined as never)

const SettingCenterContent = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<string>(ContentType.myRecipe)

  return (
    <SettingContentContext.Provider value={content}>
      <SetSettingContentContext.Provider value={setContent}>{children}</SetSettingContentContext.Provider>
    </SettingContentContext.Provider>
  )
}

export const useCenterContent = () => useContext(SettingContentContext)
export const useSetCenterContent = () => useContext(SetSettingContentContext)

export default SettingCenterContent
