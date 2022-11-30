export interface IAccountConfig {
  accountName: { min: number; max: number }
  displayName: { min: number; max: number }
  password: { min: number; max: number }
  introduction: { min: number; max: number }
}

const accountConfig: IAccountConfig = {
  accountName: {
    min: 3,
    max: 20,
  },
  displayName: {
    min: 3,
    max: 50,
  },
  password: {
    min: 6,
    max: 16,
  },
  introduction: {
    min: 0,
    max: 250,
  },
}

export default accountConfig
