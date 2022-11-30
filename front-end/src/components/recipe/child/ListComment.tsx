import { useState, useEffect, useRef } from 'react'
import type { FC, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { nanoid } from 'nanoid'
import LoaderSending from 'components/utils/LoaderSending '
import { RecipeContent, Comment } from 'interfaces/Recipe'
import { cvtUrl } from 'functions/upload/convertImageUrl'
import Moment from 'react-moment'
import { useLoadingPreview, useSetLoadingPreview } from 'components/context/PreviewSendingData'
import { useUpdateError } from 'components/context/ErrorReportContext'
import { useAccount } from 'components/context/AccountContext'
import { catchErrorFromAPI } from 'functions/error/errorHandle'
import FETCH_API_URL from 'text/API_URL'
import { ErrorLevel } from 'interfaces/Error'
import styles from 'styles/RecipeDetails.module.css'
import bStyles from 'styles/Button.module.css'
import tStyles from 'styles/Text.module.css'

const ListComment: FC<{ recipe: RecipeContent }> = ({ recipe }) => {
  const [count, setCount] = useState<number>(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [skip, setSkip] = useState<number>(0)
  const [isMaxLimit, setIsMaxLimit] = useState<boolean>(false)
  const [isReplying, setIsReplying] = useState<{ id: string; state: boolean }>({
    id: '',
    state: false,
  })
  const userAccount = useAccount()
  const commentObj = useRef<HTMLTextAreaElement>(null)
  const replyCommentObj = useRef<HTMLInputElement>(null)
  const errMsg = useUpdateError()
  const isSendingPreview = useLoadingPreview()
  const setSendingPreview = useSetLoadingPreview()
  const router = useRouter()

  // commentをリセットする
  useEffect(() => {
    setComments([])
    setSkip(0)
  }, [recipe])

  // commentを取得する
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const { data } = await axios.get(`${FETCH_API_URL.readComment}?id=${recipe._id}&skip=${skip}`)
        setComments(prev => [...prev, ...data])
        if (data.length < 5) setIsMaxLimit(true)
      } catch (e: any) {
        catchErrorFromAPI(e, errMsg)
      }
    }
    fetchComment()
  }, [skip, recipe])

  // コメントを送信する
  const submitComment = async (e: FormEvent<HTMLFormElement>, recipeId: string) => {
    e.preventDefault()

    const comment = commentObj.current?.value
    if (comment!.length === 0) return

    setSendingPreview(true)
    try {
      const { data }: { data: Comment } = await axios.post(FETCH_API_URL.leaveComment, { recipeId, comment })
      setComments(prev => {
        return [data, ...prev]
      })

      errMsg([{ id: nanoid(), message: 'コメントが投稿されました', level: ErrorLevel.INFO }])
      commentObj.current!.value = ''
      setSendingPreview(false)
    } catch (err: any) {
      setSendingPreview(false)
      catchErrorFromAPI(err, errMsg)
    }
  }

  // 返信用のコメントを送信する
  const submitReplyComment = async (e: FormEvent<HTMLFormElement>, recipeId: string) => {
    e.preventDefault()
    const body = { responseId: isReplying.id, comment: replyCommentObj.current!.value }
    setSendingPreview(true)
    try {
      const res = await axios.post(FETCH_API_URL.leaveComment, { ...body }).then(res => res.data)
      setComments(prev => {
        let arr = [...prev]
        arr = arr.map(cmt => {
          if (cmt._id === isReplying.id) {
            cmt.response ? cmt.response!.unshift(res) : (cmt.response = [res])
            return cmt
          }
          return cmt
        })

        return [...arr]
      })

      errMsg([{ id: nanoid(), message: 'コメントに返信しました', level: ErrorLevel.INFO }])
      setIsReplying({ id: '', state: false })
      setSendingPreview(false)
    } catch (err: any) {
      setSendingPreview(false)
      catchErrorFromAPI(err, errMsg)
    }
  }

  // commentをさらに読み込む
  const readMoreComments = () => {
    if (isMaxLimit) return
    setSkip(prev => prev + 1)
  }

  const countText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCount(() => e.target.value.length)
  }

  // コメントに返信用のinput formを追加する
  const responseComment = (comment: Comment) => {
    setIsReplying({ id: comment._id, state: true })
  }

  // 返信をキャンセルする
  const cancelReply = () => {
    setIsReplying({ id: '', state: false })
  }

  // コメントに返信している状態かどうか
  const isReplyingComment = (commentId: string) => {
    if (isReplying.state === true && isReplying.id === commentId) return true
    return false
  }

  // さらにコメントを表示
  const readMoreComment = () => {
    if (!isMaxLimit && comments.length !== 0)
      return (
        <p onClick={() => readMoreComments()} className={`${styles.readMoreComment}`}>
          さらにコメントを読み込む...
        </p>
      )
  }

  // user ページへジャンプする
  const jumpToUserProfile = (accountName: string) => {
    router.push(`/${accountName}`)
  }

  return (
    <>
      {/* list comment */}
      {isSendingPreview && <LoaderSending />}
      <div className={`${styles.contentBox} ${styles.commentContainer}`}>
        <p className={`${styles.commentTitle} ${tStyles.title70}`}>コメント</p>
        <div className={`${styles.commentWrap} `}>
          {comments &&
            comments?.map(comment => (
              <div key={comment._id} className={`${styles.commentBox} `}>
                <div className={`${styles.cmtUserWrap}`}>
                  <div className={`${styles.cmtAccWrap}`}>
                    <img src={cvtUrl(comment.avatar)} alt={comment.displayName} />
                    <p onClick={() => jumpToUserProfile(comment.accountName)} className={`${tStyles.title50}`}>
                      {comment.displayName}
                    </p>
                  </div>
                  <Moment className={styles.cmtCreatedAt} format='YYYY/MM/DD'>
                    {comment.createdAt}
                  </Moment>
                </div>
                <p>{comment.comment}</p>
                {/* reply */}
                {comment.response && (
                  <div className={`${styles.replyContainer}`}>
                    {comment.response.map(reply => (
                      <div key={reply._id} className={`${styles.replyWrap}`}>
                        <div className={`${styles.cmtUserWrap}`}>
                          <div className={`${styles.cmtAccWrap}`}>
                            <img src={cvtUrl(reply.avatar)} alt={reply.displayName} />
                            <p onClick={() => jumpToUserProfile(reply.accountName)} className={`${tStyles.title50}`}>
                              {reply.displayName}
                            </p>
                          </div>
                          <Moment className={styles.cmtCreatedAt} format='YYYY/MM/DD'>
                            {reply.createdAt}
                          </Moment>
                        </div>
                        <p>{reply.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 返信用のinput */}
                {isReplyingComment(comment._id) ? (
                  <form onSubmit={e => submitReplyComment(e, recipe._id)} className={`${styles.replyInputContainer}`}>
                    <input ref={replyCommentObj} type='text' placeholder='返信する' required maxLength={140} />
                    <div className={`${styles.replyBtnBox}`}>
                      <div
                        onClick={() => cancelReply()}
                        className={`${bStyles.btn} ${bStyles.btnSGray} ${styles.replyCancelBtn}`}>
                        キャンセル
                      </div>
                      <button className={`${bStyles.btn} ${bStyles.btnSBlack}`}>送信</button>
                    </div>
                  </form>
                ) : (
                  <p onClick={() => responseComment(comment)} className={`${styles.replayBtn} `}>
                    返信する
                  </p>
                )}
              </div>
            ))}
          {readMoreComment()}
        </div>
      </div>

      {/* leave comment */}
      {userAccount && (
        <>
          <div className={`${styles.contentBox} ${styles.leaveCmtContainer}`}>
            <p className={`${styles.commentTitle} ${tStyles.title70}`}>コメントを残す</p>
            <form onSubmit={e => submitComment(e, recipe._id)}>
              <textarea
                onChange={e => countText(e)}
                ref={commentObj}
                placeholder={`美味しいを伝えましょう！`}
                maxLength={140}
                cols={50}
                rows={3}></textarea>
              <button className={`${styles.levCmtBtn} ${bStyles.btn} ${bStyles.btnMBlack}`}>送信</button>
              <p className={styles.countLveCmt}>{count} / 140</p>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default ListComment
