import 'styles/globals.css'
import 'styles/body.css'
import type { AppProps } from 'next/app'
import Layout from 'components/layout/Layout'
import AccountProvider from 'components/context/AccountContext'
import { ErrorReportProvider } from 'components/context/ErrorReportContext'
import ViewSendingDataProvider from 'components/context/PreviewSendingData'
import ShowNavProvider from 'components/context/ShowNavContext'

// cssファイル
import 'styles/UserList.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AccountProvider>
      <ErrorReportProvider>
        <ViewSendingDataProvider>
          <ShowNavProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ShowNavProvider>
        </ViewSendingDataProvider>
      </ErrorReportProvider>
    </AccountProvider>
  )
}

export default MyApp
