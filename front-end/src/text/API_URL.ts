// apiフォルダのURLなので変更があれば修正する

const FETCH_API_URL = {
  // recipe
  // フォローユーザの最新レシピ
  followersLatest: '/api/recipes/followUsersRecipe',
  // おすすめのレシピ（クエリは省く）
  recommend: '/api/recipes/home',
  // お気に入りに登録しているレシピを取得
  favs: '/api/recipes/myFavs',
  // 検索結果のレシピ
  search: '/api/recipes/find',
  // 検索結果のレシピの数
  totalSearchNum: '/api/recipes/findTotal',
  // profileで表示しているユーザーのレシピを取得する
  recipeProfile: '/api/recipes/profile',
  // 関連レシピ検索
  relatedRecipe: '/api/recipes/related',
  // レシピを作成する
  crateRecipe: '/api/recipes/create',
  // レシピを更新する
  updateRecipe: '/api/recipes/update',
  // 自分のレシピかどうか確認する
  isMyRecipe: '/api/recipes/isMyRecipe',
  // レシピデータをデータベースから削除する
  deleteRecipe: '/api/recipes/delete',
  // お気に入りの中から検索する
  searchRecipeInFavs: 'api/recipes/searchInFav',
  // 複数のレシピIDからレシピカードの型のデータを取得する
  multiRecipes: 'api/recipes/multi',
  // detailに表示する単一RecipeContentのデータを取得する
  getRecipeContent: 'api/recipes/detail',

  // page
  // userのpageを取得する
  getPages: 'api/page/get',
  //pageを登録する
  postPage: 'api/page/post',
  // pageを削除する
  deleteAndEditPage: 'api/page/deleteAndEdit',
  // page idから単一のページデータを取得する
  getSinglePage: 'api/page/id',

  // user
  // ログアウト
  logout: '/api/user/logout',
  // user profile
  userProfile: '/api/profile',
  // パスワードの変更
  changePass: '/api/user/changePass',
  // 編集したプロフィールデータの送信
  editProfile: '/api/user/updateProfile',
  // アカウントデータの取得
  account: '/api/user/account',
  // アカウントデータの削除
  deleteAccount: 'api/user/deleteAccount',
  // Emailアドレスの変更
  changeEmail: 'api/user/changeEmail',

  // follow
  // add/remove follow
  followUser: '/api/user/follow',
  // settingsのフォローユーザーを取得、表示する
  getFollowers: '/api/user/myFollowers',

  // 画像ファイルをCloud Storageにアップロード
  uploadAvatarImage: '/api/upload/avatar',
  // レシピの画像をCloud Storageにアップロード
  uploadRecipeImage: '/api/upload/recipe',
  // 古い画像ファイルの削除
  deleteOldImage: '/api/upload/delete',

  // commentを取得する
  readComment: '/api/recipes/getComment',
  // commentを送信する
  leaveComment: '/api/recipes/sendComment',

  // レシピをfav登録しているか確認する
  isFav: '/api/fav/isFav',
  // レシピをfavに登録する
  registerFav: '/api/fav/create',
  // レシピをfavから除外する
  deleteFav: '/api/fav/delete',
}

export default FETCH_API_URL
