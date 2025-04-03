const isDirectory = require('./lib/isDirectory')

const processDir = require('./processDir')
const processSinglePDF = require('./processSinglePDF')
const processSingleNonPDF = require('./processSingleNonPDF')

const path = require('path')

let processDocument = async function (file, checkDir = true) {
  if (checkDir && isDirectory(file)) {
    await processDir(file, processDocument)
  }
  else if (file.endsWith('.pdf')) {
    await processSinglePDF(file)
  }
  else if (file.endsWith('.odt') || file.endsWith('.ods') || file.endsWith('.odp') || file.endsWith('.odg')) {
    await processSingleNonPDF(file)
  }
  else if (file.endsWith('.docx') || file.endsWith('.xlsx') || file.endsWith('.pptx') || file.endsWith('.odg')) {
    await processSingleNonPDF(file)
  }
}

module.exports = processDocument