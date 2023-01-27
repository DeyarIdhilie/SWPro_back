
const Cloud = require('@google-cloud/storage')
const path = require('path')

const serviceKey = path.join(__dirname, './laqeene-2940a76bfcea.json')

const { Storage } = Cloud

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'laqeene',
})

module.exports = storage