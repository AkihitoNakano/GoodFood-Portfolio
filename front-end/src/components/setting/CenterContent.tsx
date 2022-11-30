import { FC, memo } from 'react'
import ContentMyRecipe from './ContentMyRecipe'
import ContentFav from './ContentFav'
import ContentMyFollowers from './MyFollowers'
import ChangePass from './ChangePass'
import EditProfile from './EditProfile'
import CreateRecipe from './CreateRecipe'
import EditRecipe from './EditRecipe'
import CreatePage from './CreatePage'
import Page from './Page'
import EditPage from './EditPage'
import Account from './Account'
import styles from 'styles/SettingCenterContents.module.css'
import { ContentType } from 'interfaces/Query'

const CenterContent: FC<{ content: string | string[] }> = memo(({ content }) => {
  const whichContent = (content: string | string[]) => {
    switch (content) {
      case ContentType.changePass:
        return <ChangePass />
      case ContentType.editProf:
        return <EditProfile />
      case ContentType.account:
        return <Account />
      case ContentType.myRecipe:
        return <ContentMyRecipe />
      case ContentType.favs:
        return <ContentFav />
      case ContentType.follow:
        return <ContentMyFollowers />
      case ContentType.createRecipe:
        return <CreateRecipe />
      case ContentType.editRecipe:
        return <EditRecipe />
      case ContentType.page:
        return <Page />
      case ContentType.createPage:
        return <CreatePage />
      case ContentType.editPage:
        return <EditPage />

      default:
        return <ContentMyRecipe />
    }
  }

  return <div className={styles.centerContent}>{whichContent(content)}</div>
})

export default CenterContent
