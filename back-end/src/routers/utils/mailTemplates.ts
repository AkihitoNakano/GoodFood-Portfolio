import 'dotenv/config'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// 新規登録時メールアドレスの有効性を確認するためのHTML
export const validEmailTemplate = (email: string, name: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Good Food / メールアドレスの有効性確認</title>
  
    <style>
  
      .container {
        background-color: #fff;
        border-radius: 10px;
        width: 600px;
        padding: 30px 30px;
        margin: 100px auto 20px auto;
  
      }
  
      button {
        cursor:pointer;
        color:#fff;
        background-color: #FF0000;
        font-size: 0.8rem;
        text-align: center;
        border:none;
        border-radius: 5px;
        padding: 10px 15px;
        margin: 20px 0;
      }
  
      .footer {
        text-align: center;
      }
      .footer p {
        color: gray;
        font-size: 0.5rem;
      }
  
    </style>
  
  </head>
  <body>
    <div class="container">
      <h1>メールアドレスの確認</h1>
      <p><strong>${name}さん</strong></p>
      <p>登録ありがとうございます！そして、下記ボタンをクリックしてメールが有効であることを確認してね！</p>
      <p>もしこのメールに心当たりがない場合は、削除してもらえると嬉しいな！</p>
      <div class="key-valid">
      </div>

      <a href="${CLIENT_URL}/settings/auth?id=${name}&key=${email}"><button>メールアドレスを有効にする</button></a>
      <p>もし上記のボタンが動作しない場合は以下のリンクをブラウザに貼り付けて下さい。</p>
      <a href="${CLIENT_URL}/settings/auth?id=${name}&key=${email}">${CLIENT_URL}/settings/auth?id=${name}&key=${email}</a>
  
      <p>あともうちょっと!<br> Good Food</p>
      <p></p>
    </div>
    <div class="footer">
      <p>${CLIENT_URL}</p>
    </div>
  </body>
  </html>
  `
}
