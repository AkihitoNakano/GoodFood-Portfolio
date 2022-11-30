import { useState, useContext, createContext, useEffect } from 'react'
import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { UserAccount } from 'interfaces/User'

export const AccountContext = createContext<UserAccount | undefined>(undefined)
export const AccountUpdateContext = createContext<Dispatch<SetStateAction<UserAccount | undefined>>>(undefined as never)

const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<UserAccount>()

  return (
    <AccountContext.Provider value={account}>
      <AccountUpdateContext.Provider value={setAccount}>{children}</AccountUpdateContext.Provider>
    </AccountContext.Provider>
  )
}

export const useAccount = () => useContext(AccountContext)
export const useUpdateAccount = () => useContext(AccountUpdateContext)

export default AccountProvider
