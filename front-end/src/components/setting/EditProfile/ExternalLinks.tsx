import { FC } from 'react'
import { Links, LinkNames, SetLinks, LinksUrl, SetLinksUrl } from '../EditProfile'
import styles from 'styles/EditProfile.module.css'
import btnStyles from 'styles/Button.module.css'
import fStyles from 'styles/Form.module.css'

// 外部リンクコンポーネント
const ExternalLink: FC<{
  links: Links
  setLinks: SetLinks
  linksUrl: LinksUrl
  setLinksUrl: SetLinksUrl
}> = ({ links, setLinks, linksUrl, setLinksUrl }) => {
  const tempDom = (name: LinkNames) => {
    return (
      <div className={styles.linkBox}>
        <label htmlFor={name}>{name}</label>
        <input
          value={linksUrl[name]}
          onChange={e => setLinksUrl(prev => ({ ...prev, [name]: e.target.value }))}
          className={fStyles.formInput}
          type='text'
        />
        <img
          onClick={() => setLinks(prev => ({ ...prev, [name]: false }))}
          className={styles.linkClose}
          src='/icons/general/square-x.svg'
          alt='close'
        />
      </div>
    )
  }

  return (
    <>
      {links.twitter && tempDom('twitter')}
      {links.instagram && tempDom('instagram')}
      {links.meta && tempDom('meta')}
      {links.another && tempDom('another')}
    </>
  )
}

const ExternalLinkContainer: FC<{ links: Links; setLinks: SetLinks; linksUrl: LinksUrl; setLinksUrl: SetLinksUrl }> = ({
  links,
  setLinks,
  linksUrl,
  setLinksUrl,
}) => {
  // +-ボタンを切り替える
  const addLink = (name: LinkNames) => {
    const bool = links[name]
    setLinks(prev => ({ ...prev, [name]: !bool }))
  }

  const AddLinkInput = () => {
    if (links.instagram == true || links.twitter == true || links.meta == true || links.another == true) {
      return true
    }
    return false
  }

  // 外部リンクの追加、削除を切り替える
  const switchAddMinus = (bool: boolean) => {
    if (!bool) return `${btnStyles.btnAddCircle} ${styles.addCircle}`
    return `${btnStyles.btnMinusCircle} ${styles.addCircle}`
  }

  return (
    <>
      <label htmlFor='link'>外部リンク</label>
      <div className={styles.linkContainer}>
        <div className={styles.linksWrap}>
          <div onClick={() => addLink('twitter')} className={switchAddMinus(links.twitter)} />
          <p>Twitter</p>
        </div>
        <div className={styles.linksWrap}>
          <div onClick={() => addLink('instagram')} className={switchAddMinus(links.instagram)} />
          <p>Instagram</p>
        </div>
        <div className={styles.linksWrap}>
          <div onClick={() => addLink('meta')} className={switchAddMinus(links.meta)} />
          <p>Meta</p>
        </div>
        <div className={styles.linksWrap}>
          <div onClick={() => addLink('another')} className={switchAddMinus(links.another)} />
          <p>他サイト</p>
        </div>
      </div>
      {AddLinkInput() && (
        <div className={styles.addLinkContainer}>
          <ExternalLink links={links} setLinks={setLinks} linksUrl={linksUrl} setLinksUrl={setLinksUrl} />
        </div>
      )}
    </>
  )
}

export default ExternalLinkContainer
