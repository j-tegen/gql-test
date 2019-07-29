import * as crypto from 'crypto'

export const generateToken = async () => {
  const buffer: Buffer = await new Promise((resolve, reject) => {
    crypto.randomBytes(256, (ex, b) => {
      if (ex) {
        reject('error generating token')
      }
      resolve(b)
    })
  })
  const token = crypto
    .createHash('sha1')
    .update(buffer)
    .digest('hex')

  return token
}
