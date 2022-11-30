import type { NextPage, GetServerSideProps } from 'next'
import HeadComp from 'components/head/Head'
import Setting from 'components/setting/Setting'
import ProfileProvider from 'components/context/ProfileContext'
import SettingCenterProvider from 'components/context/SettingCenterContent'
import AccountLoader from 'components/utils/AccountLoader'
import { UseUserAuth } from 'hooks/userAuth'
import getUserAuth from 'functions/account/auth'
import { AccountOrError } from 'interfaces/Error'

const SettingProfile: NextPage<AccountOrError> = ({ data, error }) => {
  const accLoading = UseUserAuth({ data, error })

  return (
    <>
      <HeadComp title={'Good Food / マイページ'} />
      {accLoading.isLoading && <AccountLoader />}
      <ProfileProvider>
        <SettingCenterProvider>
          <Setting accData={data} />
        </SettingCenterProvider>
      </ProfileProvider>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async context => {
  return await getUserAuth(context)
}

export default SettingProfile
