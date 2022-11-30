import Link from 'next/link'
import styles from 'styles/Footer.module.css'

const Footer = () => {
  return (
    <>
      <div className={`${styles.container}`}>
        <div className={`${styles.wrap}`}>
          <Link href='#'>
            <p>GoodFoodについて</p>
          </Link>
          <Link href='#'>
            <p>プライバシーポリシー</p>
          </Link>
          <Link href='#'>
            <p>利用規約</p>
          </Link>
          <Link href='#'>
            <p>お問い合わせ</p>
          </Link>
        </div>
        <p className={`${styles.coop}`}>2022 GoodFood</p>
      </div>
    </>
  )
}

export default Footer
