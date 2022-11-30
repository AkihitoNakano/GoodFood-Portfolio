import { FC, memo } from 'react'
import ChangeEmail from './AccountChild/ChangeEmail'
import DeleteAccount from './AccountChild/DeleteAccount'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { useUpdateError } from '../context/ErrorReportContext'
import styles from 'styles/Account.module.css'

const Account: FC = memo(() => {
  const setErrorMsg = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()

  return (
    <>
      <div className='settingCenterWrap'>
        <div className={styles.container}>
          <h1>アカウント情報</h1>
          <ChangeEmail setErrorMsg={setErrorMsg} isDataSending={isDataSending} setIsDataSending={setIsDataSending} />
          <hr></hr>
          <DeleteAccount setErrorMsg={setErrorMsg} isDataSending={isDataSending} setIsDataSending={setIsDataSending} />
        </div>
      </div>
    </>
  )
})

export default Account
