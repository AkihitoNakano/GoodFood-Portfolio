import type { RefObject } from 'react'
import { ExMaterial, Step } from 'interfaces/Recipe'
import { trimTextAndIsEmpty } from 'functions/utils/docControl'

type MergeData = {
  title: string
  describe: string
  cookTime: string
  ingredients?: { name: string; amount: string }[]
  flavors?: { name: string; amount: string }[]
  steps?: string[]
  tag?: string[]
  img?: string
}

// 送信データを統合

export const mergeData = (
  fileName: string | undefined,
  title: RefObject<HTMLInputElement>,
  describe: RefObject<HTMLTextAreaElement>,
  cookTime: RefObject<HTMLInputElement>,
  ingredients: ExMaterial[] | undefined,
  flavors: ExMaterial[] | undefined,
  steps: Step[],
  tags: RefObject<HTMLInputElement>
) => {
  const data: MergeData = {
    title: title.current!.value,
    describe: describe.current!.value,
    cookTime: cookTime.current!.value,
  }

  const reIngredients: { id?: number; name: string; amount: string }[] = [...ingredients!]
  for (let value of Object.values(reIngredients!)) {
    delete value.id
  }

  if (ingredients && ingredients?.length > 0) data.ingredients = reIngredients

  const reFlavors: { id?: number; name: string; amount: string }[] = [...flavors!]
  for (let value of Object.values(reFlavors!)) {
    delete value.id
  }

  if (flavors && flavors?.length > 0) data.flavors = reFlavors

  let reSteps: string[] = []
  for (let value of Object.values(steps)) {
    reSteps.push(value.desc)
  }
  if (steps && steps?.length > 0) data.steps = reSteps

  const IsTagEmpty = trimTextAndIsEmpty(tags.current!.value)
  if (!IsTagEmpty) data.tag = tags.current?.value.split(/[\s|　]+/)

  if (fileName) data.img = fileName

  return data
}

// 画像ファイルのサイズが上限を超えていた場合警告を出す
export const alertImageFileSize = (id: string, limit: number, alertLevel: string) => {
  return {
    id: id,
    message: `画像サイズは${limit / (1024 * 1024)}MB以下にして下さい。`,
    level: alertLevel,
  }
}
