import { FC, memo, useState, FormEvent, Dispatch, SetStateAction, useEffect } from 'react'
import { nanoid } from 'nanoid'
import axios from 'axios'
import LoaderSending from '../utils/LoaderSending '
import AvatarPreview from './EditProfile/AvatarPreview'
import ExternalLinksContainer from './EditProfile/ExternalLinks'
import { useUpdateAccount } from 'components/context/AccountContext'
import { useUpdateError } from '../context/ErrorReportContext'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { useSetResetProfileContext, useProfileContext, useProfLoadingContext } from 'components/context/ProfileContext'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import FETCH_API_URL from 'text/API_URL'
import { ErrorLevel } from 'interfaces/Error'
import { textLen } from 'text/Specification'
import { UserAccount } from 'interfaces/User'
import styles from 'styles/EditProfile.module.css'
import btnStyles from 'styles/Button.module.css'
import fStyles from 'styles/Form.module.css'

type Form = {
  displayName: string | undefined
  avatar: string | undefined
  introduction: string | undefined
  links?: {
    twitter: string | undefined
    instagram: string | undefined
    meta: string | undefined
    another: string | undefined
  }
}

export type Links = {
  twitter: boolean
  instagram: boolean
  meta: boolean
  another: boolean
}

export type LinksUrl = {
  twitter: string | undefined
  instagram: string | undefined
  meta: string | undefined
  another: string | undefined
}

export type LinkNames = 'twitter' | 'instagram' | 'meta' | 'another'
export type SetLinks = Dispatch<SetStateAction<Links>>
export type SetLinksUrl = Dispatch<SetStateAction<LinksUrl>>

const initialLinksState = { twitter: false, instagram: false, meta: false, another: false }
const initialForm = {
  displayName: '',
  avatar: '',
  introduction: '',
  links: { twitter: '', instagram: '', meta: '', another: '' },
}
const initialLinksUrl = { twitter: '', instagram: '', meta: '', another: '' }

const EditProfile: FC = memo(() => {
  const [form, setForm] = useState<Form>(initialForm)
  const [links, setLinks] = useState<Links>(initialLinksState)
  const [linksUrl, setLinksUrl] = useState<LinksUrl>(initialLinksUrl)
  const [file, setFile] = useState<File | null>(null)
  const setAccount = useUpdateAccount()
  const profile = useProfileContext()
  const isProfileLoading = useProfLoadingContext()
  const setResetProfile = useSetResetProfileContext()
  const setErrorMsg = useUpdateError()
  const isDataSending = useLoadingPreview()
  const setIsDataSending = useSetLoadingPreview()

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsDataSending(() => true)
    let fileName: string | undefined
    let oldFile: string | undefined
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      const { data, status } = await axios.patch(FETCH_API_URL.uploadAvatarImage, formData)
      if (status !== 200) throw new Error()
      // 更新用の新しいファイル名と古いデータ削除用の変数
      fileName = data
      oldFile = form.avatar
    }

    const resultData = mergeData(fileName)

    try {
      // データベースにデータを保存する
      await axios.patch(FETCH_API_URL.editProfile, resultData)
      setErrorMsg([{ id: nanoid(), message: 'プロフィールが変更されました', level: ErrorLevel.INFO }])
      // アカウントデータの更新
      const { data }: { data: UserAccount } = await axios.get(FETCH_API_URL.account)
      setAccount(data)
      setResetProfile(prev => !prev)
      // 古いアバター画像の削除
      oldFile && (await axios.delete(`${FETCH_API_URL.deleteOldImage}?file=${oldFile}`))
      form.avatar = fileName
      setIsDataSending(() => false)
    } catch (e: any) {
      console.log('err', e)
      setIsDataSending(() => false)
      catchErrorFromAPI(e, setErrorMsg)
    }
  }

  // フォームデータの作成
  const mergeData = (fileName: string | undefined) => {
    const finObj = { ...form }
    fileName ? (finObj.avatar = fileName) : delete finObj.avatar
    finObj.links = linksUrl

    !links.twitter && delete finObj.links!.twitter
    !links.instagram && delete finObj.links!.instagram
    !links.meta && delete finObj.links!.meta
    !links.another && delete finObj.links!.another

    return finObj
  }

  // initのprofile設定
  useEffect(() => {
    if (isProfileLoading) return
    setForm(prev => ({
      ...prev,
      displayName: profile!.displayName,
      avatar: profile!.avatar,
      introduction: profile!.introduction,
    }))

    setLinksUrl(prev => ({
      ...prev,
      twitter: profile?.links?.twitter,
      instagram: profile?.links?.instagram,
      meta: profile?.links?.meta,
      another: profile?.links?.another,
    }))
    // TODO: linksUrlがあると必要か？
    setLinks(prev => ({
      ...prev,
      twitter: profile?.links?.twitter ? true : false,
      instagram: profile?.links?.instagram ? true : false,
      meta: profile?.links?.meta ? true : false,
      another: profile?.links?.another ? true : false,
    }))
    setResetProfile(prev => !prev)
  }, [isProfileLoading])

  return (
    <>
      {isDataSending && <LoaderSending />}
      <div className='settingCenterWrap'>
        <div className={styles.container}>
          <h1>プロフィールの編集</h1>
          <form onSubmit={submitFormHandler} className={`${styles.form} ${fStyles.formWrap}`}>
            <div className={fStyles.labelWrap}>
              <label htmlFor='displayName'>表示名</label>
              <p className={styles.textCount}>
                <span>{form?.displayName?.length}</span> / {textLen.displayName.maxLen}
              </p>
            </div>
            <input
              className={fStyles.formInput}
              type='text'
              id='displayName'
              placeholder='表示名を入力して下さい'
              minLength={textLen.displayName.minLen}
              maxLength={textLen.displayName.maxLen}
              onChange={e => {
                setForm(prev => ({ ...prev, displayName: e.target.value }))
              }}
              value={form.displayName}
              required
            />

            <AvatarPreview avatar={form.avatar} accountName={profile?.accountName!} file={file} setFile={setFile} />
            <div className={fStyles.labelWrap}>
              <label htmlFor='introduction'>プロフィール紹介</label>
              <p className={styles.textCount}>
                <span>{form?.introduction?.length}</span> / {textLen.introduction.maxLen}
              </p>
            </div>
            <textarea
              className={fStyles.textArea}
              id='introduction'
              minLength={textLen.introduction.minLen}
              maxLength={textLen.introduction.maxLen}
              onChange={e => setForm(prev => ({ ...prev, introduction: e.target.value }))}
              value={form.introduction}
              cols={10}
              rows={5}></textarea>
            <ExternalLinksContainer links={links} setLinks={setLinks} linksUrl={linksUrl} setLinksUrl={setLinksUrl} />
            <button className={`${styles.updateBtn} ${btnStyles.btn} ${btnStyles.btnMRed}`}>更新する</button>
          </form>
        </div>
      </div>
    </>
  )
})

export default EditProfile
