interface IRecipe {
  titles: string[]
  describe: string[]
  img: string[]
  ingredients: string[]
  ingreAmount: string[]
  flavors: string[]
  flavorsAmount: string[]
  steps: string[]
  tags: string[]
}

const recipes: IRecipe = {
  titles: [
    'ラーメン',
    '麻婆豆腐',
    'うどん',
    'パスタ',
    '焼肉',
    '焼売',
    '味噌汁',
    '親子丼',
    '卵かけご飯',
    '醤油ラーメン',
    '酢豚',
    'ビーフストロガノフ',
    'ピーマンに肉炒め',
    'トマトサラダ',
    'カボチャサラダ',
    'きのこのソテー',
    'きのこハンバーグ',
    'キムチときゅうりの和物',
    'ハンバーグ',
    'サンドウィッチ',
    '小籠包',
    'カボチャすーぷ',
    'シチュー',
    'ハヤシライス',
  ],
  describe: [
    '夜食に合うご飯、カロリー控えめなので毎日食べても大丈夫',
    '子どもが大好きなご飯、量は少し多めなので、子供に合わせて調整可能',
    '朝、急いでいるときにサッと作れて食べれる簡単料理。しかもおいしい',
    '今日はイタリアンの日だなと思った時作る料理、調理時間は割とかかる',
    '１週間分の献立を考えなくても済む簡単料理、困ったときはこれ',
    '辛いものが食べたくなった時、これを作ろう',
    '今日は中華の日、麺類が食べたくなったらこれ',
  ],
  img: [
    'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1664&q=80',
    'https://images.unsplash.com/photo-1619371042685-827b1c646923?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1560684352-8497838a2229?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=828&q=80',
    'https://images.unsplash.com/photo-1580959375944-abd7e991f971?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    'https://images.unsplash.com/photo-1625937751876-4515cd8e78bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=949&q=80',
  ],

  ingredients: [
    '鶏肉',
    '豚肉',
    '牛肉',
    '白米',
    '小麦粉',
    '片栗粉',
    'ニンジン',
    'じゃがいも',
    'ほうれん草',
    'キャベツ',
    'めんま',
  ],
  ingreAmount: ['本', 'g', '個', '片'],
  flavorsAmount: ['大さじ', '小さじ'],
  flavors: ['みりん', '醤油', '塩', 'コショウ', '酢', '油'],
  steps: ['ご飯を炒める', '野菜をきる', '皿に盛り付ける', '煮る', '焼く', '蒸す'],
  tags: ['豆腐', '豚ミンチ', '唐辛子', '夜食', '朝食', 'お昼', 'おやつ', '家庭料理', '中華', '洋風', '簡単', '難しい'],
}

export default recipes
