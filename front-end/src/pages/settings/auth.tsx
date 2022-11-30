import type { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { nanoid } from 'nanoid'
import cookie from 'cookie'
import HeadComp from 'components/head/Head'
import { useUpdateError } from 'components/context/ErrorReportContext'
import axios from 'axios'
import { ErrorLevel } from 'interfaces/Error'

const UserAuthCheck: NextPage<{ message: string }> = ({ message }) => {
  const setErrorMsg = useUpdateError()
  const router = useRouter()

  useEffect(() => {
    if (message) {
      setErrorMsg([{ id: nanoid(), message: message, level: ErrorLevel.ALERT }])
    } else {
      router.push('/')
    }
  }, [])
  return (
    <>
      <HeadComp title={'Good Food'} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const { id, key } = context.query
    const result = await axios.post(`${process.env.SERVER_URL}/user/account/authentication?id=${id}&key=${key}`)
    const token = result.data
    // cookieのセット
    context.res.setHeader(
      'Set-Cookie',
      cookie.serialize('gf_jwt', token, {
        httpOnly: true,
        maxAge: token.maxAge,
        sameSite: 'strict',
        path: '/',
      })
    )

    return { props: {} }
  } catch (e: any) {
    console.log('error', e.response.data)
    return { props: { message: e.response.data } }
  }
}

export default UserAuthCheck
