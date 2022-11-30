import { FC, useState, useEffect } from 'react'
import Loader from 'components/utils/AccountLoader'
import DateAndAuthor from './children/DateAndAuthor'
import PrintBtn from './children/PrintBtn'
import Materials from './children/Materials'
import PrintSteps from './children/PrintSteps'
import { useUpdateShowNav } from 'components/context/ShowNavContext'
import { RecipeContent } from 'interfaces/Recipe'
import styles from 'styles/Print.module.css'
import tStyles from 'styles/Text.module.css'

const Print: FC<{ recipes: RecipeContent[] }> = ({ recipes }) => {
  const [isLoading, setLoading] = useState<boolean>(true)
  const updateShowNav = useUpdateShowNav()

  // 上部のナビゲーションをオフにする
  useEffect(() => {
    updateShowNav(false)
    setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [])

  const printPage = () => {
    window.print()
  }

  const printAlert = (recipeLen: number) => {
    if (recipeLen <= 1) return
    return (
      <div className={`${styles.alertWrap} ${styles.no_print}`}>情報量が多いとはみ出した箇所はカットされます。</div>
    )
  }

  return (
    <>
      {isLoading && <Loader />}
      {printAlert(recipes.length)}
      {recipes.length > 0 ? ShowPrint(recipes, printPage) : <div>表示するレシピはありません</div>}
    </>
  )
}

// 分割数に応じた印刷レンダリング
const ShowPrint = (recipes: RecipeContent[], printPage: () => void) => {
  const recipeNum = recipes.length
  if (recipeNum <= 1) {
    const data = recipes[0]
    return (
      <>
        <section className={`${styles.container}`}>
          <PrintBtn printPage={printPage} />
          <div className={styles.containerOne}>
            <h1>{data.title}</h1>
            <DateAndAuthor data={data} divType={1} />
            <p className={`${styles.describe} ${styles.contentBox} ${styles.text}`}>{data.describe}</p>
            <label className={`${styles.contentBox} ${tStyles.title40}`}>調理時間 　　{data.cookTime}分</label>
            <label className={`${tStyles.title40}`}>材料 - 分量</label>
            <Materials data={data} type={'ingredient'} divType={1} />
            <label className={`${tStyles.title40}`}>調味料 - 分量</label>
            <Materials data={data} type={'flavor'} divType={1} />
            <label className={`${tStyles.title40}`}>手順</label>
            <PrintSteps data={data} divType={1} />
            <label className={`${tStyles.title40}`}>メモ</label>
          </div>
        </section>
      </>
    )
  }
  if (recipeNum <= 4) {
    return (
      <>
        <section className={`${styles.baseContainerFour}`}>
          <PrintBtn printPage={printPage} />
          <div className={`${styles.containerFour}`}>
            {recipes.map(data => (
              <div key={data._id} className={`${styles.content4Box}`}>
                <div className={styles.containerWrap}>
                  <p className={`${styles.titleFour} ${tStyles.title40}`}>■ {data.title}</p>
                  <p className={`${styles.author} ${tStyles.text20}`}>by {data.displayName}</p>
                  <label className={`${styles.contentBox} ${tStyles.title30}`}>調理時間 　　{data.cookTime}分</label>
                  <div className={`${styles.materialContainer}`}>
                    <div>
                      <label className={`${tStyles.title30}`}>材料 - 分量</label>
                      <Materials data={data} type={'ingredient'} divType={4} />
                    </div>
                    <div>
                      <label className={`${tStyles.title30}`}>調味料 - 分量</label>
                      <Materials data={data} type={'flavor'} divType={4} />
                    </div>
                  </div>
                  <label className={`${tStyles.title30}`}>手順</label>
                  <PrintSteps data={data} divType={4} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    )
  }
  // 6分割
  return (
    <>
      <section className={`${styles.baseContainerFour}`}>
        <PrintBtn printPage={printPage} />
        <div className={`${styles.containerSix}`}>
          {recipes.map(data => (
            <div key={data._id} className={`${styles.content6Box}`}>
              <p className={` ${styles.title6} ${tStyles.title40}`}>■{data.title}</p>
              <p className={`${styles.contentBox} ${tStyles.title40}`}>調理時間 　　{data.cookTime}分</p>
              <div className={`${styles.materialContainer}`}>
                <div>
                  <label className={`${tStyles.title40}`}>材料 - 分量</label>
                  <Materials data={data} type={'ingredient'} divType={6} />
                </div>
                <div>
                  <label className={`${tStyles.title40}`}>調味料 - 分量</label>
                  <Materials data={data} type={'flavor'} divType={6} />
                </div>
              </div>
              <label className={`${tStyles.title40}`}>手順</label>
              <PrintSteps data={data} divType={6} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Print
