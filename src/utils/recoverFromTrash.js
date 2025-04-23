import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'

const trashDir = path.resolve(process.cwd(), '.sweepy-trash')
const manifestPath = path.join(trashDir, 'manifest.json')

export function recoverFile(fileName) {
  if (!fs.existsSync(manifestPath)) {
    console.log('No recovery manifest found.')
    return
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  if (!manifest[fileName]) {
    console.log('File not found in manifest.')
    return
  }

  const fromPath = path.join(trashDir, fileName)
  const toPath = manifest[fileName]

  if (!fs.existsSync(fromPath)) {
    console.log('Trashed file not found.')
    return
  }

  const toDir = path.dirname(toPath)
  if (!fs.existsSync(toDir)) {
    fs.mkdirSync(toDir, { recursive: true })
  }

  try {
    fs.renameSync(fromPath, toPath)
  } catch (err) {
    console.error('❌ Could not recover', fileName, err)
    return
  }  
  delete manifest[fileName]
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log('✅ Recovered:', toPath)
}

export function recoverAll() {
  if (!fs.existsSync(manifestPath)) {
    console.log('No recovery manifest found.')
    return
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  for (const fileName of Object.keys(manifest)) {
    recoverFile(fileName)
  }
}

export async function recoverInteractive() {
  if (!fs.existsSync(manifestPath)) {
    console.log('No recovery manifest found.')
    return
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  const files = Object.keys(manifest)

  if (!files.length) {
    console.log('No files available to recover.')
    return
  }

  const { toRecover } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'toRecover',
      message: 'Select files to recover:',
      choices: files,
      pageSize: 20
    }
  ])

  for (const file of toRecover) {
    recoverFile(file)
  }
}
