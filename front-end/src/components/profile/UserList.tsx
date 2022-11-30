import { FC, memo, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { IUserIcon } from 'interfaces/User'
import { cvtUrl } from 'functions/upload/convertImageUrl'
import { omitText } from 'functions/utils/docControl'
import styles from 'styles/UserList.module.css'
import tStyles from 'styles/Text.module.css'

type KeyType = 'er' | 'ed'
type SetKeyType = Dispatch<SetStateAction<KeyType>>

// listグリッドとicon部分はcssを分けたほうが良いか？
const UserList: FC<{ users: IUserIcon[] | undefined; setSelectKey: SetKeyType }> = memo(({ users, setSelectKey }) => {
  const router = useRouter()

  const selectTextBold = (key: KeyType) => {
    if (router.query.key === 'ed' && key === 'ed') {
      return 'selectKey'
    } else if (router.query.key === 'er' && key === 'er') {
      return 'selectKey'
    }
    return ''
  }

  return (
    <>
      <div className={`settingCenterWrap`}>
        <h1>フォロー</h1>
        <div className={styles.selectFollows}>
          <p onClick={() => setSelectKey(() => 'er')} className={`select ${selectTextBold('er')}`}>
            フォロー中
          </p>
          <p onClick={() => setSelectKey(() => 'ed')} className={`select ${selectTextBold('ed')}`}>
            フォローワー
          </p>
        </div>
        {users && (
          <div className={styles.gridContainer}>
            {users.map(user => {
              return (
                <div key={user._id} className={styles.boxWrap}>
                  {user.avatar ? (
                    <img src={cvtUrl(user.avatar)} alt={user.accountName} />
                  ) : (
                    <img src='/icons/general/user.svg'></img>
                  )}
                  <div className={styles.textWrap}>
                    <p onClick={() => router.push(`/${user.accountName}`)} className={styles.displayName}>
                      {omitText(user.displayName, 10)}
                    </p>
                    <p className={`${tStyles.sub50} ${styles.mbName}`}>@{user.accountName}</p>
                    <div className={styles.followerWrap}>
                      <p className={styles.followerLabel}>フォロワー</p>
                      <p className={styles.followNum}>{user.count ?? '0'}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
})

export default UserList
