const path = require('path')
const fs = require('fs')
const ShellExec = require('./lib/ShellExec')

const prependFilenameInFolder = require('./lib/prependFilenameInFolder')
const isColab = require('./lib/isColab')

const processSinglePDF = require('./processSinglePDF')

let processSingleNonPDF = async function (file) {
  let filename = path.basename(file)
  // let dirname = path.dirname(file)
  let filenameNoExt = filename
  if (filenameNoExt.slice(-4, -3) === '.') {
    filenameNoExt = filenameNoExt.slice(0, -4)
  }

  let cmd = `unoconv -f pdf "${file}"`

  try {
    result = await ShellExec(cmd)
  }
  catch (e) {
    console.error(e)
  }

  let pdfFile = file
  if (pdfFile.slice(-4, -3) === '.') {
    pdfFile = pdfFile.slice(0, -4) + '.pdf'
  }
  else if (pdfFile.slice(-5, -4) === '.') {
    pdfFile = pdfFile.slice(0, -5) + '.pdf'
  }
  await processSinglePDF(pdfFile)

  fs.unlinkSync(pdfFile)
}

module.exports = processSingleNonPDF