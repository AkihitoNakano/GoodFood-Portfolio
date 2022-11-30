import sgMail from '@sendgrid/mail'
import 'dotenv/config'
import { createHash } from './docControl'
import { validEmailTemplate } from './mailTemplates'

sgMail.setApiKey(process.env.SENDGRID_APIKEY!)

// 新規登録でメールアドレスが有効かどうか確認する
export const sendValidationEmail = async (email: string, name: string) => {
  try {
    const hashedMail = await createHash(email)
    const encodedAddress = encodeURIComponent(hashedMail)

    const tempHTML = validEmailTemplate(encodedAddress, name)
    sgMail.send({
      to: email,
      from: 'paiku575@gmail.com',
      subject: '【Good Food新規ご登録ありがとうございます！】Emailが有効かどうかの確認をお願いします',
      html: tempHTML,
    })
  } catch (err: any) {
    throw new Error()
  }
}
