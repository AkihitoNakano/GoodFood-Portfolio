import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'
import { IUserProfile } from 'interfaces/User'

export const ProfileContext = createContext<IUserProfile | undefined>(undefined)
export const SetProfileContext = createContext<Dispatch<SetStateAction<IUserProfile | undefined>>>(undefined as never)
export const IsProfLoadingContext = createContext(true)
export const SetProfLoadingContext = createContext<Dispatch<SetStateAction<boolean>>>(undefined as never)
export const IsResetProfile = createContext(false)
export const SetResetProfile = createContext<Dispatch<SetStateAction<boolean>>>(undefined as never)

const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<IUserProfile>()
  const [isProfLoading, setProfLoading] = useState(true)
  const [isResetProfile, setResetProfile] = useState(false)

  return (
    <ProfileContext.Provider value={profile}>
      <SetProfileContext.Provider value={setProfile}>
        <IsProfLoadingContext.Provider value={isProfLoading}>
          <SetProfLoadingContext.Provider value={setProfLoading}>
            <IsResetProfile.Provider value={isResetProfile}>
              <SetResetProfile.Provider value={setResetProfile}>{children}</SetResetProfile.Provider>
            </IsResetProfile.Provider>
          </SetProfLoadingContext.Provider>
        </IsProfLoadingContext.Provider>
      </SetProfileContext.Provider>
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => useContext(ProfileContext)
export const useSetProfileContext = () => useContext(SetProfileContext)
export const useProfLoadingContext = () => useContext(IsProfLoadingContext)
export const useSetProfLoadingContext = () => useContext(SetProfLoadingContext)
export const useResetProfileContext = () => useContext(IsResetProfile)
export const useSetResetProfileContext = () => useContext(SetResetProfile)

export default ProfileProvider
