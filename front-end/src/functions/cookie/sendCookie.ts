import axios from 'axios'
import { METHOD_TYPE } from 'interfaces/Connection'

export const FetchWithCookies = async (URL: string, accessToken: string) => {
  return await axios
    .get(URL, {
      withCredentials: true,
      headers: {
        Cookie: `gf_jwt=${accessToken}`,
      },
    })
    .then(res => res.data)
}

//　TODO: コードの重複がある為整理する必要がある。 postでbodyを使っていないため下のsendReqWithBodyに置き換えが必要
export const SelectMethodWithCookies = async (type: string, URL: string, accessToken: string) => {
  const credential = {
    withCredentials: true,
    headers: {
      Cookie: `gf_jwt=${accessToken}`,
    },
  }

  switch (type) {
    case METHOD_TYPE.GET:
      return await axios.get(URL, { ...credential }).then(res => res.data)
    case METHOD_TYPE.POST:
      return await axios.post(URL, { ...credential }).then(res => res.data)
    case METHOD_TYPE.PATCH:
      return await axios.patch(URL, { ...credential }).then(res => res.data)
    case METHOD_TYPE.DELETE:
      return await axios.delete(URL, { ...credential }).then(res => res.data)
  }
}

export const sendReqWithBody = async <T>(type: string, URL: string, accessToken: string, body?: T) => {
  const credential = {
    withCredentials: true,
    headers: {
      Cookie: `gf_jwt=${accessToken}`,
    },
  }

  switch (type) {
    case METHOD_TYPE.GET:
      return await axios.get(URL, { ...credential }).then(res => res.data)
    case METHOD_TYPE.POST:
      const option = { method: 'POST', ...credential, data: body }
      return await axios(URL, option).then(res => res.data)
    case METHOD_TYPE.PATCH:
      return await axios(URL, { method: 'PATCH', ...credential, data: body }).then(res => res.data)
    case METHOD_TYPE.DELETE:
      return await axios.delete(URL, { ...credential }).then(res => res.data)
  }
}
