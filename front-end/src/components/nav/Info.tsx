import { FC, memo } from 'react'
import styles from 'styles/Info.module.css'
import { useError, useUpdateError } from 'components/context/ErrorReportContext'
import { ErrorReport, ErrorLevel } from 'interfaces/Error'

const Info: FC = memo(() => {
  const errors = useError()
  const setError = useUpdateError()

  const clearMessageHandler = () => {
    setError(undefined)
  }

  return (
    <div className={errors ? `${styles.container} ${styles.show}` : styles.container}>
      {errors && (
        <>
          <div className={styles.listContainer}>
            {errors.map((err: ErrorReport) => (
              <div
                key={err.id}
                className={
                  err.level === ErrorLevel.ALERT
                    ? `${styles.listWrap} ${styles.alert}`
                    : `${styles.listWrap} ${styles.info}`
                }>
                <p>{err.message}</p>
              </div>
            ))}
            <div className={styles.clearMessage} onClick={clearMessageHandler}></div>
          </div>
        </>
      )}
    </div>
  )
})

export default Info
