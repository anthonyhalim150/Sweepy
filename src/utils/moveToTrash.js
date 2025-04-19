import fs from 'fs'
import path from 'path'

const trashDir = path.resolve(process.cwd(), '.sweepy-trash')
const manifestPath = path.join(trashDir, 'manifest.json')

export function ensureTrashDir() {
  if (!fs.existsSync(trashDir)) {
    fs.mkdirSync(trashDir)
  }
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, '{}')
  }
}

export function moveToTrash(filePath) {
  ensureTrashDir()
  const fileName = path.basename(filePath)
  const targetPath = path.join(trashDir, fileName)

  let finalPath = targetPath
  let counter = 1

  while (fs.existsSync(finalPath)) {
    const ext = path.extname(fileName)
    const base = path.basename(fileName, ext)
    finalPath = path.join(trashDir, `${base}-${counter}${ext}`)
    counter++
  }

  fs.renameSync(filePath, finalPath)

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  manifest[path.basename(finalPath)] = filePath
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
}
