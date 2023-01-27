const util = require('util')
const gc = require('../config/')
const bucket = gc.bucket('laqeene-bucket')

const { format } = util

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file,id) => new Promise((resolve, reject) => {
    console.log(id);
  const { originalname, buffer } = file
   console.log(file["originalname"]);
  const blob = bucket.file(id)
  const blobStream = blob.createWriteStream({
    resumable: false
  })

  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (error) => {
    reject(error)
  })
  .end(buffer)

})

module.exports = uploadImage