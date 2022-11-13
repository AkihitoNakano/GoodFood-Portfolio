# レシピ検索 WEB アプリケーション　【Next.js / React / Node.js / TypeScript / MongoDB / Docker / GCP / Vercel / Render】

## はじめに

---

レシピ検索アプリーション Good Food を解説した記事となります。

---

### レシピを検索して投稿、交流できるウェブアプリケーション【GOOD FOOD]

![picture 1](images/fd3f54a81779027a7ab4e0e0d32b27be6598fac69bdd8eecc54ef2b3972cae0f.png)

主な使用技術はフロントエンドに Next.js/TypeScript、バックエンドに Node.js/TypeScript、データベースに MongoDB、ストレージに GCP の Cloud Storage、コンテナ作成に Docker、デプロイサービスはフロントエンドを Vercel、バックエンドは GCP の Cloud Run または Render を使用。

### 目次

1. アプリケーションの概要
2. 企画
3. スケジュール
4. デザイン
5. 前回の反省点
6. アプリの機能
7. 使用した技術スタック
8. 使用ツール
9. 努力した点、難しかった実装
10. 実装予定の機能
11. どのように学習したか
12. 今後の学習

### 開発者について

---

- 12 年間コンピューターグラフィックスを使用した業界で映画や、TV、CM、ゲーム映像などの仕事に従事していました
- 趣味で 4，5 年程度 UNREAL ENGINE を使用したゲーム開発をしており、iOS に公開した経験もあります
- 2022 年から本格的にプログラミングにのめり込み転職も検討中
- 一歳になる子どもがいます
- 以前台湾に 2 年ほど仕事で住んでいたことがあり中国語を話すことができます

## 1. アプリの概要

---

- 登録してログインしてみよう
- レシピを登録する
- ページを作成する
- レシピを印刷する

![picture 5](images/450e5b50705e04eaf49250c3e54c4a93a14d3d9c5cae94044befff0b37f10b24.png)

web サイトはこちら

👉 [https://good-food-one.vercel.app/](https://good-food-one.vercel.app/)

Good Food はレシピを投稿しお気に入りのレシピを保存、クリエイターをフォローすることができるアプリケーションです。
企画の項目で詳しく述べますがレシピの内容を印刷して使うことを目的として開発したので印刷に特化したレイアウトで出力できます。

### まずは登録してみよう

<div align="center">
<img src="images/ba7d5e603a323797306788e3ede461ab53e6591e3137d3d9c21ac9f6cc652967.gif" width="400px">
</div>

アカウント名、メールアドレス、パスワードを送信すると登録したメールアドレスに確認のメールが届きます（現在はメール送信サービスを中断していますのでそのままログインすることが可能です）。
登録後はログインしてみましょう！ 👏👏👏

### レシピを登録する

<div align="center">
<img src="images/030a7f455168e01a45c62a65f356104851454c422cb03ce6af99868037b6031a.gif" width="400px">
</div>

**記入項目は**

- レシピのタイトル
- レシピの説明
- 画像のアップロード
- 調理時間
- 材料と分量
  - 複数作成することが可能です
- 調味料と分量
  - 複数作成することが可能です
- 手順
- タグ

レシピを登録したら自分のレシピを確認してみましょう！
レシピに対してコメントすることもできます。

<div align="center">
<img src="images/26d99d9fab4e24dc26545e28769d0b7479d6c09ed1ec61d64b1719252d60bd31.gif" width="400px">
</div>

### ページを作成する

<div align="center">
<img src="images/7f28bccad38f36e3bc9cea3f92237428c8096c1c36b88078fa454892658bb206.gif" width="400px">
</div>

#### ページ機能とは？

ページとは複数のレシピをグループ化する機能です。
ページという名前から一枚のページ（A4 用紙を想定）にレシピを詰め込んで印刷、または PDF にして使用します。
分割数は現在 1, 4, 6 の 3 種類のみとなっています。

### レシピを印刷する

**６分割の場合**

<div align="center">
<img src="images/7ad408355180bd6e0234456bddb436e4f4fb927ec61ec305cd5a83b505e2b542.png" width="500px">
</div>

**4 分割の場合**

<div align="center">
<img src="images/f09863fdf0d2316b14fd0b49b6884b7fd7c1a23da20df4bf4bb73f9af2db6d55.png" width="500px">
</div>

## 2. 企画

---

- きっかけ
  - 印刷できるサイトはないのか
  - chrome の印刷オプションで分割レイアウトは可能では？
- コンセプト

### きっかけ

このレシピ検索アプリケーションを作ろうと行動したきっかけは私の妻が料理をしている際にそのとき使用していたレシピ検索アプリの不満からでした。

- レシピをノートに全部手書きすることは面倒

- 料理をしているときにスマートフォンを開きたくない

  - 料理をしているときは手が濡れていたり汚れているため 画面を触りたくない
  - スマホの画面は一定時間経過すると画面がオフになるためその度に立ち上げるのが面倒
  - 自分のメモが記入できない

- 自分のレシピノートが作成したい
  - 大きいノートは台所では邪魔になる為小さいノート、A6 サイズに貼り付けできるサイズが良い
  - メモができるある程度の余白が欲しい

#### 印刷できるサイトはないのか？

印刷できるサイトはありますが基本的に単品のレシピのみで A4 サイズに印刷するサイズのみを取り扱っているところがほとんどでした。

#### 印刷のオプションで（chrome では可能）一枚あたりのページ数を変更すれば分割したレイアウトをわざわざ作成する必要はないのではないか？

その通りだと思います。ただこの方法だと元々 A4 でレイアウトしていたページを縮小することになるので分割数によっては文字が非常に小さくなります。

### コンセプト

以上の内容を含めてその他の要望をまとめる以下のようになりました

**レシピを印刷して自分のマイレシピノートを作成しよう！**

- 印刷ができる
- 印刷のオプションがある
  - 分割数のオプション
- 印刷ができればそれ以外はシンプルなものでよい
- 複雑な機能は必要ない
- 綺麗で見易いサイト

最初の設計段階でフォローしているユーザー同士、メッセージを送ることができる機能も考えておりました。そのような機能は必要ないと判断されたため、ボツにしました。

## 3. スケジュール

---

スケジュールは 9 月の頭から開発を開始。当初の予定では１ヶ月で終わらせることを目標にしていましたが、新機能を使用するという目的があったため勉強の時間に費やす時間が増え結果的には 2 ヶ月程度かかりました。この 2 ヶ月はあくまでアプリケーションの機能開発の時間であるため、デプロイメント、テストの時間は含まれておりません。

```mermaid
gantt
title schedule 2022/09/01 - 2022/11/13
dateFormat YYYY-MM-DD

section backend dev
routing, database, authentication etc...  :  dev, 2022-09-01, 14d
test:2022-11-06, 5d

section design
design web pages: 2022-09-15, 6d

section frontend
development with next.js and studying: 2022-09-22, 45d

section infrastructure
deploy        : 2022-11-05, 5d

```

## 4. デザイン

---

- デザインは **AdobeXD** を使用して大まかなデザイン案を作成
- 当初はグラデーションを使用したリッチなデザインを考えておりましたがあまり合わないと感じたためポップ寄りに変更しました。
- 配色は赤と白をベースに緑をアクセントとしたデザインで最終的には落ち着きました。

### Web サイト全体図

- 上部の縦長サイズはモバイル用レイアウト

![picture 5](images/15573c538c380413f1214f5750a3fffccbe1d3f2490cd3c5fbb75ef8d6ce9ca9.png)

#### レシピカードの構想案

![picture 6](images/7017bc094cabbddb2a4eb6228cb4e69b3b3d07e743396ba9340cd2fab3f6f1df.png)

#### ホームの構想案

![picture 7](images/325c91dbd6c4b4fbedc8f93f5201a3248784ec969ef0c478a1f8de518ca14f12.png)

#### モバイルサイトの構想案、全体図

![picture 8](images/7cd28bbcae59a0fbe6c5dadbd1b8aca7403c200eeab4ecb69f53c5168bd02732.png)

#### 印刷時のレイアウト構想案

左から 1 分割、4 分割、6 分割

![picture 9](images/0b2808c18c0ba8702fefc17e30cff0f2e391e55008967c1d1db3edda3c75c598.png)

#### 全体のバランス調整チェック、配色、ボタンデザイン

![picture 10](images/0f164f093582317571f1c7e9d48c55f2b6a3a784771c7afe6dc147886ef5360e.png)

## 5. 前回の反省点

---

#### 開発の効率化

前回はアプリケーションを手探りで開発していった為、サーバー側の開発とクライアント側の開発を並行して進めて行きました。しかしこの方法は一方の開発に集中できないため開発効率がよくありませんでした。
一方今回は全体の作り方をある程度把握しているので、最初にバックエンドの機能に集中して取り組み、Postman を使用してルーティングなどのチェック、デバッグ、テスト（手動テスト）を行いました。
その後デザイン、フロントエンドの開発と順次進めていくスケジュールをとっています。

#### セキュリティ

前回はクライアント側の js ファイルに、バックエンドへの API の URL が丸見えの状態であった為これをどうにかしたいと考えておりました。
フロントエンドは Next.js を使用することを検討していましたが、その Next.js の API Routes を使用すればバックエンドへの URL を隠蔽することができます。

#### データベース設計

データベースは前回と同様、今回も MongoDB を使用しております。前回はコレクションを細かく分けなかったためスケールしたとき、アカウントを削除したときの不具合の原因を見抜くことができませんでした。
例えば、MongoDB のコレクションのスキーマは JSON オブジェクトのように階層（埋め込み）を作ることができるため、一つのドキュメントにどのようなデータも加えることができます。しかし MongoDB は一つのドキュメントに 16MB までの制限があるため、スケールしていくと必ずこの問題にぶつかることになります。
また、一つのドキュメントに全てのデータを入れるとアカウントを削除した際のシステムの負荷非常に大きくなります。このような理由があるため分けて作るようにしました。

#### N+1 問題

前回のアプリでは一つのサーバーへのリクエストに対して何度も DB にアクセスするような処理を記述していました。加えて DB から受け取った内容をさらに整形しクライアント側に渡す処理を Node.js 上で記述していたため、とにかく無駄が多かったです。
今回はそのような無駄をできる限り排除できるようにほぼ全ての DB へのクエリに Aggregation のパイプラインを使用し、一度のクエリで必要なデータを全て返すよう記述する努力をしました。Mongoose では$project のオペレーター を使用するため DB から渡ってきたデータを Node 上で整形することなくそのままクライアント側に返すことができます。

## 6. 機能

---

- 実装内容
- ページ遷移図
- データベース設計

### 主な実装内容

- サインアップ、ログイン、ログアウト
- ユーザーの認証、ユーザー情報の取得
- プロフィールの編集
- パスワードの変更
- メールアドレスの変更
- アカウントの削除
- レシピの検索
- レシピの投稿
- レシピの編集、削除
- レシピのお気に入り登録、削除
- 関連レシピの取得
- レシピへのコメント
- ユーザーのフォロー
- ページの作成、編集、削除
- メール認証
- Cloud Storage へ画像の保存
- JWT による認証
- パスワードの hash 化
- デバッグ
  - ランダムユーザーの作成
  - レシピの自動作成
  - 自動お気に入り登録
- レスポンシブ、モバイル対応

### ページ遷移図

#### 全体像

```mermaid
flowchart TD

idx(root) --> auth((authorization))
auth --> |already login|home(root)
auth --> |not login| index(index)
index --> |not login|login(search, login or sign up )

home --> profile(profile)
home --> settings(settings)
settings --> account(Account)
settings --> readAbout(Read about recipes)
settings --> create(Create)
account --> editProfile(edit profile)
account--> updatePassword(update password)
account --> accountInfo(account info)
readAbout --> favorites(favorites)
readAbout --> followers(followers)
readAbout --> page(read pages)
create --> createRecipe(create new recipe)
create --> createPage(create new page)

page --> printPage(print page)

```

### ルーティング一部

### データベース設計

- 使用した DB
- 概念図
- スキーマサンプル

#### 使用した DB

**MongoDB / MongDB Atlas**

前回同様データベースには MongoDB を使用しております。
MongoDB は前回の経験を活かせるということ、Aggregation パイプラインを使用した処理を学びたいという理由から選びました。

開発の初期段階ではローカルマシン上の MongoDB を使用し、開発後期ではホスティングサービスである MongoDB Atlas に切り替えて開発を行いました。

#### 概念図

```mermaid
erDiagram
User ||--|| Profile : contain
User ||--|{ Recipe : use
User ||--|| State : contain
User ||--|| Follow : contain
Tag ||--|| Recipe : contains
Page }|--|| User : use
Page ||--|{ Recipe : contain
fav }|--|| Recipe : use
Comment }|--|| Recipe: contain
```

#### スキーマ サンプル

**Recipe**

| field       | type   | Null     | key     | Default | Extra             |
| ----------- | ------ | -------- | ------- | ------- | ----------------- |
| \_id        | object | Not Null | primary | auto    |                   |
| owner       | object | Not Null | FK      | auto    | owner             |
| title       | String | Not Null |         |         |                   |
| describe    | String |          |         |         |                   |
| cookTime    | number |          |         |         |                   |
| img         | String |          |         |         |                   |
| ingredients | Array  |          |         |         | parent            |
| - name      | String |          |         |         | ingred name       |
| - amount    | String |          |         |         | ingred num        |
| flavors     | Array  |          |         |         | parent            |
| - name      | String |          |         |         | flavor name       |
| - amount    | String |          |         |         | flavor num        |
| step        | Array  |          |         |         | parent            |
| -           | String |          |         |         | step description  |
| timestamps  | Date   |          |         |         | create and update |

```typescript
import { model, Model, Schema, Types, Document } from 'mongoose'

//  Recipeモデルの型を定義
export interface RecipeFields extends Document {
  _id: Types.ObjectId
  owner: Types.ObjectId
  title: string
  describe: string
  cookTime: number
  img: string
  ingredients: { name: string; amount: string }[]
  flavors: { name: string; amount: string }[]
  steps: string[]
  timestamps: Date
}

const recipeSchema = new Schema<RecipeFields>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    describe: {
      type: String,
    },
    cookTime: {
      type: Number,
    },
    img: {
      type: String,
    },
    ingredients: [{ name: { type: String }, amount: { type: String } }],
    flavors: [{ name: { type: String }, amount: { type: String } }],
    steps: [{ type: String }],
  },
  { timestamps: true }
)

const Recipe = model<RecipeFields>('Recipe', recipeSchema)

export default Recipe
```
