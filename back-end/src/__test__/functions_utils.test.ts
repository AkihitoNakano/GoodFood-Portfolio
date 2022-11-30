import {
  trimStrings,
  limitStringLen,
  areEqualArrLength,
  isLessOrLargerThanArrLength,
  isInArray,
} from '../routers/utils/docControl'

describe('正常系docControl関数', () => {
  // 配列内のstringをトリミングする
  test('trimStrings配列単体', () => {
    expect(trimStrings([' Hellow '])).toStrictEqual(['Hellow'])
  })
  test('trimStrings配列複数', () => {
    expect(trimStrings([' black ', ' green ', ' red', ' ye llo w'])).toStrictEqual([
      'black',
      'green',
      'red',
      'ye llo w',
    ])
  })
  test('isLessOrLargerThanArrLength/正常系', () => {
    expect(() => isLessOrLargerThanArrLength(['a', 'b', 'c'], 2, 'larger')).not.toThrow(Error)
  })
  // 配列の中身に含まれているか
  test('isInArray/正常系', () => {
    expect(() => isInArray(['a', 'b', 'c'], 'c')).not.toThrow(Error)
  })
})

describe('異常系docControl関数', () => {
  // 文字数の長さのチェック
  test('LimitStringLength/文字数最大値を超える', () => {
    expect(() => limitStringLen('こんにちは', 2, 4, 'こんにちは')).toThrow(Error)
  })
  test('LimitStringLength/文字数最小値より小さい', () => {
    expect(() => limitStringLen('あ', 2, 5, 'あ')).toThrow(Error)
  })
  // 配列の数と数字が合っているかどうか
  test('areEqualArrLenght/配列の数と数値が合うかどうか', () => {
    expect(() => areEqualArrLength(['a', 'b', 'c'], 2)).toThrow(Error)
  })
  //  与えられた数値よりも配列の数が少ないかどうか
  test('isLessOrLargerThanArrLength/配列の数よりも数値が小さい', () => {
    expect(() => isLessOrLargerThanArrLength(['a', 'b', 'c'], 2, 'less')).toThrow(Error)
  })
  test('isLessOrLargerThanArrLength/配列の数よりも数値が大きい', () => {
    expect(() => isLessOrLargerThanArrLength(['a', 'b', 'c'], 5, 'larger')).toThrow(Error)
  })
  // 配列の中身に含まれているか
  test('isInArray/配列の中身に含まれていない', () => {
    expect(() => isInArray(['a', 'b', 'c'], 'd')).toThrow(Error)
  })
})
