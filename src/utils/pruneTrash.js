import fs from 'fs';
import path from 'path';

export function pruneSweepyTrash() {
  const trashDir = path.resolve(process.cwd(), '.sweepy-trash');

  if (!fs.existsSync(trashDir)) {
    console.log('🧼 No .sweepy-trash folder found.');
    return;
  }

  const files = fs.readdirSync(trashDir);
  if (!files.length) {
    console.log('🧼 .sweepy-trash is already empty.');
    return;
  }

  for (const file of files) {
    const fullPath = path.join(trashDir, file);
    fs.unlinkSync(fullPath);
  }

  fs.rmdirSync(trashDir);
  console.log('🧹 .sweepy-trash has been cleared.');
}
