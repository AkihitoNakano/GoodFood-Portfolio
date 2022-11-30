import { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import HeadComp from 'components/head/Head'
import Print from 'components/print/Print'
import { getAccessToken } from 'functions/account/auth'
import { RecipeContent } from 'interfaces/Recipe'
import { Page } from 'interfaces/Page'

const PrintPage: NextPage<{ recipes: RecipeContent[]; pageName: string }> = ({ recipes, pageName }) => {
  return (
    <>
      <HeadComp title={pageName} />
      <Print recipes={recipes} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const pageId = context.params?.id
  const token = getAccessToken(context)

  const options = {
    withCredentials: true,
    headers: {
      Cookie: `gf_jwt=${token}`,
    },
  }
  // レシピの詳細から飛んできたシングルレシピの場合
  if (context.query.id === '0' && context.query.recipe !== undefined) {
    try {
      const recipe = await axios.get(`${process.env.SERVER_URL}/recipe/details?id=${context.query.recipe}`, options)

      return { props: { recipes: recipe.data, pageName: recipe.data[0].title } }
    } catch (err: any) {
      return { props: { recipes: [] } }
    }
  }

  // pageから飛んできた複数のレシピを持つ場合
  try {
    // pageデータを取得
    const { data }: { data: Page } = await axios.get(`${process.env.SERVER_URL}/page/id/${pageId}`, options)

    const ids = data.recipeIds.join(',')
    //　pageデータのrecipeIdsからそれぞれの詳細レシピデータを取得
    const pages = await axios.get(`${process.env.SERVER_URL}/recipe/detailsMulti?id=${ids}`, {
      withCredentials: true,
      headers: {
        Cookie: `gf_jwt=${token}`,
      },
    })

    return { props: { recipes: pages.data, pageName: data.pageName } }
  } catch (err: any) {
    return { props: { recipes: [] } }
  }
}

export default PrintPage
