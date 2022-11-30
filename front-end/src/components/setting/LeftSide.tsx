import Link from 'next/link'
import { FC, Dispatch, SetStateAction, useState, memo } from 'react'
import { useRouter } from 'next/router'
import { useSetCenterContent } from 'components/context/SettingCenterContent'
import { useProfileContext, useProfLoadingContext } from 'components/context/ProfileContext'
import { ContentType } from 'interfaces/Query'
import { cvtUrl } from 'functions/upload/convertImageUrl'
import styles from 'styles/SettingSide.module.css'
import btnStyles from 'styles/Button.module.css'
import tStyles from 'styles/Text.module.css'

type SetContent = Dispatch<SetStateAction<string>>

const SideColumn: FC = memo(() => {
  const [isOpenSideMenu, setIsOpenSideMenu] = useState<boolean>(false)
  const prf = useProfileContext()
  const isPrfLoading = useProfLoadingContext()
  const router = useRouter()
  const setCenterContent = useSetCenterContent()

  const switchContent = (content: string) => {
    setCenterContent(content)
    router.push(`/settings?page=${content}`)
  }

  const toggleSideMenu = () => {
    setIsOpenSideMenu(prev => !prev)
  }

  return (
    <>
      {!isPrfLoading && (
        <div className={isOpenSideMenu ? `${styles.leftColumn}` : `${styles.leftColumn} ${styles.hide}`}>
          <div className={`${styles.boxWrap} ${styles.boxWithShadow} ${styles.myProfWrap}`}>
            <div className={styles.profWrap}>
              <div className={styles.profTopWrap}>
                <img src={cvtUrl(prf?.avatar)} alt={prf?.accountName} />
                <div className={styles.nameWrap}>
                  <p className={tStyles.title50}>{prf?.displayName}</p>
                  <p className={tStyles.fontLight}>@{prf?.accountName}</p>
                </div>
              </div>
              <div className={styles.linksWrap}>
                {prf?.links?.twitter && (
                  <Link href={prf.links.twitter}>
                    <div className={`${styles.linkIcon} ${styles.icon_twitter}`}></div>
                  </Link>
                )}
                {prf?.links?.instagram && (
                  <Link href={prf.links.instagram}>
                    <div className={`${styles.linkIcon} ${styles.icon_instagram}`}></div>
                  </Link>
                )}
                {prf?.links?.meta && (
                  <Link href={prf.links.meta}>
                    <div className={`${styles.linkIcon} ${styles.icon_meta}`}></div>
                  </Link>
                )}
                {prf?.links?.another && (
                  <Link href={prf.links.another}>
                    <div className={`${styles.linkIcon} ${styles.icon_world}`}></div>
                  </Link>
                )}
              </div>
              <div className={styles.followWrap}>
                <div>
                  <p className={tStyles.title40}>フォロー中</p>
                  <p className={styles.followNum}>{prf?.followers ?? 0}</p>
                </div>
                <div>
                  <p className={tStyles.title40}>フォロワー</p>
                  <p className={styles.followNum}>{prf?.followeds ?? 0}</p>
                </div>
              </div>
              <div className={styles.introduction}>
                <p>{prf?.introduction}</p>
              </div>
            </div>
          </div>

          <div className={`${styles.boxWrap} ${styles.boxWithShadow} ${styles.editAndChange}`}>
            <div onClick={() => switchContent(ContentType.editProf)} className={styles.cellBox}>
              <img src='/icons/general/edit.svg' alt='edit profile' />
              <p>プロフィールの編集</p>
            </div>
            <div onClick={() => switchContent(ContentType.changePass)} className={styles.cellBox}>
              <img src='/icons/general/key.svg' alt='edit password' />
              <p className={styles.categoryTitle}>パスワードの変更</p>
            </div>
            <div onClick={() => switchContent(ContentType.account)} className={styles.cellBox}>
              <img src='/icons/general/user-check.svg' alt='account' />
              <p>アカウント情報</p>
            </div>
          </div>

          <div className={`${styles.boxWrap} ${styles.boxWithShadow}  ${styles.myContents}`}>
            <div onClick={() => switchContent(ContentType.favs)} className={styles.cellBox}>
              <img src='/icons/general/heart.svg' alt='favorite recipes' />
              <p>お気に入り</p>
            </div>

            <div onClick={() => switchContent(ContentType.follow)} className={styles.cellBox}>
              <img src='/icons/general/users.svg' alt='followers' />
              <p>フォロワー</p>
            </div>

            <div onClick={() => switchContent(ContentType.myRecipe)} className={styles.cellBox}>
              <img src='/icons/general/tools-kitchen-2.svg' alt='followers' />
              <p>レシピ</p>
            </div>

            <div onClick={() => switchContent(ContentType.page)} className={styles.cellBox}>
              <img src='/icons/general/clipboard-text.svg' alt='followers' />
              <p>ページ</p>
            </div>
          </div>

          <div className={`${styles.boxWrap} ${styles.createBtnWrap}`}>
            <button
              onClick={() => switchContent(ContentType.createRecipe)}
              className={`${btnStyles.btn} ${btnStyles.btnLRed} ${styles.createRecipeBtn}`}>
              レシピを新規作成
            </button>
            <button
              onClick={() => switchContent(ContentType.createPage)}
              className={`${btnStyles.btn} ${btnStyles.btnLBlack} ${styles.createPageBtn}`}>
              ページを新規作成
            </button>
          </div>
          {/* mobile専用のメニューボタン */}
          <div
            onClick={toggleSideMenu}
            className={
              isOpenSideMenu
                ? `${btnStyles.btn} ${btnStyles.btnMWhite} ${styles.openMobileMenu} ${styles.hide}`
                : `${btnStyles.btn} ${btnStyles.btnMWhite} ${styles.openMobileMenu} `
            }></div>
        </div>
      )}
    </>
  )
})

export default SideColumn
