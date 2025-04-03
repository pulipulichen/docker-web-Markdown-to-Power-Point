const path = require('path')
const fs = require('fs')
const ShellExec = require('./lib/ShellExec')

const prependFilenameInFolder = require('./lib/prependFilenameInFolder')
const isColab = require('./lib/isColab')

let processSinglePDF = async function (file) {
  let filename = path.basename(file)
  // let dirname = path.dirname(file)
  let filenameNoExt = filename
  if (filenameNoExt.endsWith('.pdf')) {
    filenameNoExt = filenameNoExt.slice(0, -4)
  }

  let cacheFolder = `/cache/${filenameNoExt}`
  console.log({cacheFolder})
  if (fs.existsSync(cacheFolder)) {
    await ShellExec(`rm -rf "${cacheFolder}"`)
  }
  fs.mkdirSync(cacheFolder, {recursive: true})

  // ----------------------------------------------------------------

  let cmd = `pdftoppm "${file}" "${cacheFolder}/${filenameNoExt}" -png`
  console.log(cmd)
  try {
    await ShellExec(cmd)
  }
  catch (e) {
    console.error(e)
  }

  // --------------------------------
  // 稍微將圖片轉個角度吧
  await rotateImages(cacheFolder)

  // --------------------------------

  let convertCmd = `img2pdf "${cacheFolder}/${filenameNoExt}"*.png -o "/output/${filenameNoExt}-scanned.pdf"`
  try {
    await ShellExec(convertCmd)
  }
  catch (e) {
    console.error(e)
  }

  // --------------------------------

  // prependFilenameInFolder(filenameNoExt, outputFolder)

  // if (isColab) {
  //   await ShellSpawn(`cd "${outputFolder}"; zip -r ../"${filenameNoExt}.zip" . -i *`)
  // }
}

function getRandomAngle() {
  return (Math.random() - 0.5).toFixed(2);  // Random number between -1 and 1
}

async function rotateImages (imageDir) {
  // Read all files in the directory synchronously
  const files = fs.readdirSync(imageDir);

  // Filter to include only .png files
  const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

  for (let i = 0; i < pngFiles.length; i++) {
    let file = pngFiles[i]

    const filePath = path.join(imageDir, file);
    const angle = getRandomAngle();

    let command

    command = `convert "${filePath}" -rotate "${angle}" "${filePath}"`
    await ShellExec(command)

    command = `convert "${filePath}" +noise Laplacian \ "${filePath}"`
    await ShellExec(command)

    // command = `convert "${filePath}" \\( -size 100x1 gradient:gray50-gray80 -resize x2000! \\) -compose Multiply -composite "${filePath}"`
    // await ShellExec(command)
  }
}

module.exports = processSinglePDF