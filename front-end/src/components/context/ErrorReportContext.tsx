import { useState, useContext, createContext } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { ErrorReport } from 'interfaces/Error'

export const ErrorReportContext = createContext<ErrorReport[] | undefined>(undefined)
export const ErrorUpdateContext = createContext<Dispatch<SetStateAction<ErrorReport[] | undefined>>>(undefined as never)

export const ErrorReportProvider = ({ children }: { children: ReactNode }) => {
  const [errorMessage, setError] = useState<ErrorReport[]>()

  return (
    <ErrorReportContext.Provider value={errorMessage}>
      <ErrorUpdateContext.Provider value={setError}>{children}</ErrorUpdateContext.Provider>
    </ErrorReportContext.Provider>
  )
}

export const useError = () => useContext(ErrorReportContext)
export const useUpdateError = () => useContext(ErrorUpdateContext)
