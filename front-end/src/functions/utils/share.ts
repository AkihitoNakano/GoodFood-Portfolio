// Twitterにシェアする
export const shareToTwitter = (content: string, tags: string, shareUrl: string) => {
  const baseUrl = 'https://twitter.com/intent/tweet?'
  const text = ['text', `${content}レシピを作りました!`]
  const hashTags = ['hashtags', ['GoodFood', tags].join(',')]
  const url = ['url', shareUrl]
  const query = new URLSearchParams([text, hashTags, url])
  window.open(`${baseUrl}${query}`)
}
