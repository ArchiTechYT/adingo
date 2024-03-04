import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'jagilley/controlnet-seg:f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d'
const input = {
  image: 'https://replicate.delivery/pbxt/IJYtXSDZ6sxDVWj3tcrf4JvNHT4f9LH5BAQhVSjJWf9BU3v4/house.png',
  scale: 9,
  prompt: 'A modernist house in a nice landscape',
  a_prompt: 'best quality, extremely detailed',
  n_prompt: 'longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality',
  ddim_steps: 20,
  num_samples: '1',
  image_resolution: '512',
  detect_resolution: 512,
}

console.log({ model, input })
console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
