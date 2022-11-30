interface CookieConfig {
  maxAge: number
}

const cookieConfig: CookieConfig = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
}

export default cookieConfig
