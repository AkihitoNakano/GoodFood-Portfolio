export interface errRes {
  code: number
  message: string
}

export class ErrorOutput {
  errContent: string
  constructor(readonly statusCode: number, readonly message: string) {
    this.errContent = `${statusCode}/${message}`
  }

  static splitErrorContent(msg: string): { code: number; message: string } {
    const errMessage = msg.split('/')
    return { code: +errMessage[0], message: errMessage[1] }
  }
}
