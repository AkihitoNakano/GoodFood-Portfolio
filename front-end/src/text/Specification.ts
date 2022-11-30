export const passwordLen = {
  minLen: 6,
  maxLen: 16,
}

export const textLen = {
  displayName: {
    minLen: 3,
    maxLen: 50,
  },
  accountName: {
    minLen: 3,
    maxLen: 20,
  },
  introduction: {
    minLen: 0,
    maxLen: 250,
  },
  tag: {
    minLen: 2,
    maxLen: 20,
  },
  recipeDescribe: {
    minLen: 1,
    maxLen: 50,
  },
  pageName: {
    minLen: 1,
    maxLen: 30,
  },
}

export const imageFileLimit = {
  avatarImageLimit: 1024 * 1024 * 2,
  recipeImageLimit: 1024 * 1024 * 5,
}
