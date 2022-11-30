import { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import HeadComp from 'components/head/Head'
import Details from 'components/recipe/Details'
import Loader from 'components/utils/AccountLoader'
import { RecipeContent } from 'interfaces/Recipe'
import { accessUserAccount } from 'functions/account/auth'
import { UserAccount } from 'interfaces/User'
import { UseUserDataIfAny } from 'hooks/userAuth'

const RecipeDetails: NextPage<{ recipe: RecipeContent; userAccount: UserAccount }> = ({ recipe, userAccount }) => {
  // アカウントをロードしている
  const accLoading = UseUserDataIfAny(userAccount)

  return (
    <>
      {accLoading && <Loader />}
      <HeadComp title={'Good Food / レシピ詳細'} />
      <Details recipe={recipe} accLoading={accLoading} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const recipeId = context.query.id
  const { data } = await axios.get(`${process.env.SERVER_URL}/recipe/details?id=${recipeId}`)

  const userAccountData: UserAccount | undefined = await accessUserAccount(context)
  return userAccountData ? { props: { recipe: data[0], userAccount: userAccountData } } : { props: { recipe: data[0] } }
}

export default RecipeDetails
