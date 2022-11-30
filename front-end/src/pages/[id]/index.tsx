import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import HeadComp from 'components/head/Head'
import UserProfile from 'components/profile/UserProfile'
import AccountLoader from 'components/utils/AccountLoader'
import ProfileProvider from 'components/context/ProfileContext'
import { AccountOrError } from 'interfaces/Error'
import { UseUserAuth } from 'hooks/userAuth'
import getUserAuth from 'functions/account/auth'

const Profile: NextPage<AccountOrError> = ({ data, error }) => {
  const accLoading = UseUserAuth({ data, error })

  return (
    <div>
      {accLoading.isLoading && <AccountLoader />}
      <HeadComp title={'Good Food / プロフィール'} />
      <ProfileProvider>
        <UserProfile />
      </ProfileProvider>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  return await getUserAuth(context)
}

export default Profile
