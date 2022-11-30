import { ReactNode, useState, useContext, createContext, Dispatch, SetStateAction } from 'react'

export const ShowNavContext = createContext<boolean>(true)
export const UpdateShowNavContext = createContext<Dispatch<SetStateAction<boolean>>>(undefined as never)

const ShowNavProvider = ({ children }: { children: ReactNode }) => {
  const [showNav, setShowNav] = useState<boolean>(true)
  // console.log('showNav', showNav)
  return (
    <ShowNavContext.Provider value={showNav}>
      <UpdateShowNavContext.Provider value={setShowNav}>{children}</UpdateShowNavContext.Provider>
    </ShowNavContext.Provider>
  )
}

export const useShowNav = () => useContext(ShowNavContext)
export const useUpdateShowNav = () => useContext(UpdateShowNavContext)

export default ShowNavProvider
