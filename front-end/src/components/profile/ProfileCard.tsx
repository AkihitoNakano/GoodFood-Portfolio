import type { NextPage } from 'next'
import Link from 'next/link'
import axios from 'axios'
import LoaderFill from 'components/utils/LoaderFill'
import { useAccount } from 'components/context/AccountContext'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { useProfileContext, useSetProfileContext, useProfLoadingContext } from '../context/ProfileContext'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import { IUserProfile } from 'interfaces/User'
import { cvtUrl } from 'functions/upload/convertImageUrl'
import API_URL from 'text/API_URL'
import styles from 'styles/ProfileCard.module.css'
import tStyles from 'styles/Text.module.css'

const WhichBtn = {
  Follow: 'follow',
  UnFollow: 'unfollow',
  None: 'none',
}

const ProfileCard: NextPage = () => {
  const setErrorMsg = useUpdateError()

  const self = useAccount()
  const prf = useProfileContext()
  const setPrf = useSetProfileContext()
  const isProfLoading = useProfLoadingContext()

  const followHandler = async () => {
    try {
      const result = await axios.post(API_URL.followUser, { user: prf?._id }).then(res => res.data)
      // providerで管理しているprofileデータを更新する
      setPrf({ ...prf, ...result })
    } catch (e: any) {
      catchErrorFromAPI(e, setErrorMsg)
    }
  }

  const whichFollow = (prf: IUserProfile) => {
    let btn: 'follow' | 'unfollow'
    prf?.isFollowing ? (btn = 'unfollow') : (btn = 'follow')

    switch (btn) {
      case WhichBtn.Follow:
        return (
          <button onClick={followHandler} className={styles.followBtn}>
            <img src='/icons/general/user-plus.svg' />
            <p>フォロー</p>
          </button>
        )
      case WhichBtn.UnFollow:
        return (
          <button onClick={followHandler} className={styles.followBtn}>
            <img src='/icons/general/user-plus.svg' />
            <p>フォロー解除</p>
          </button>
        )
    }
  }

  // loading中か、profがundefinedかによって中身を変える
  const setHTMLElement = () => {
    if (isProfLoading) {
      return (
        <div className={styles.cardContainer}>
          <LoaderFill />
        </div>
      )
    } else {
      return (
        <>
          {prf ? (
            <div className={styles.cardContainer}>
              <div className={styles.topContainer}>
                <div className={styles.avatarContainer}>
                  <img src={cvtUrl(prf.avatar)} alt={prf.accountName} />
                  <div className={styles.nameWrap}>
                    <p className={tStyles.title60}>{prf.displayName}</p>
                    <p className={tStyles.fontLight}>@{prf.accountName}</p>
                  </div>
                </div>
                <div className={styles.followWrap}>
                  <div className={styles.followBlock}>
                    <p className={styles.followTitle}>フォロー中</p>
                    <p className={styles.followNumber}>{prf.followers ?? 0}</p>
                  </div>
                  <div className={styles.followBlock}>
                    <p className={styles.followTitle}>フォロワー</p>
                    <p className={styles.followNumber}>{prf.followeds ?? 0}</p>
                  </div>
                </div>
              </div>
              <div className={styles.linkWrap}>
                {prf.links?.twitter && (
                  <Link href={prf.links.twitter}>
                    <img src='/icons/general/brand-twitter.svg' alt='twitter' />
                  </Link>
                )}
                {prf.links?.instagram && (
                  <Link href={prf.links.instagram}>
                    <img src='/icons/general/brand-instagram.svg' alt='instagram' />
                  </Link>
                )}
                {prf.links?.meta && (
                  <Link href={prf.links.meta}>
                    <img src='/icons/general/brand-meta.svg' alt='meta' />
                  </Link>
                )}
                {prf.links?.another && (
                  <Link href={prf.links.another}>
                    <img src='/icons/general/world.svg' alt='home page' />
                  </Link>
                )}
              </div>
              <div className={styles.bottomWrap}>
                <p className={styles.introduction}>{prf.introduction}</p>
              </div>
              {prf?.accountName !== self?.accountName && whichFollow(prf)}
            </div>
          ) : (
            <div className={styles.cardContainer}>
              <h2>そのアカウントネームのユーザーはいません</h2>
            </div>
          )}
        </>
      )
    }
  }

  return <>{setHTMLElement()}</>
}

export default ProfileCard
