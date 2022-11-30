import { useState, useContext, createContext } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'

export const IsSendingDataContext = createContext<boolean>(false)
export const IsSetSendingDataContext = createContext<Dispatch<SetStateAction<boolean>>>(undefined as never)

export const ViewSendingDataProvider = ({ children }: { children: ReactNode }) => {
  const [isSendingData, setIsSendingData] = useState<boolean>(false)

  return (
    <IsSendingDataContext.Provider value={isSendingData}>
      <IsSetSendingDataContext.Provider value={setIsSendingData}>{children}</IsSetSendingDataContext.Provider>
    </IsSendingDataContext.Provider>
  )
}

export const useLoadingPreview = () => useContext(IsSendingDataContext)
export const useSetLoadingPreview = () => useContext(IsSetSendingDataContext)

export default ViewSendingDataProvider
