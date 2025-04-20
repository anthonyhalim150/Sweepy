import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const { default: babelTraverse } = traverse;

export function detectDynamicUsedFiles(files, cwd) {
  const usedFiles = new Set();

  for (const file of files) {
    let code;
    try {
      code = fs.readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    let ast;
    try {
      ast = parse(code, {
        sourceType: 'unambiguous',
        plugins: ['jsx', 'typescript', 'dynamicImport']
      });
    } catch {
      continue;
    }

    const dynamicFolders = [];

    babelTraverse(ast, {
      CallExpression({ node }) {
        const isReaddirSync =
          node.callee?.type === 'MemberExpression' &&
          node.callee.object?.name === 'fs' &&
          node.callee.property?.name === 'readdirSync' &&
          node.arguments?.[0]?.type === 'StringLiteral';

        if (isReaddirSync) {
          const folderPath = path.resolve(path.dirname(file), node.arguments[0].value);
          dynamicFolders.push(folderPath);
        }
      }
    });

    for (const folder of dynamicFolders) {
      if (!fs.existsSync(folder)) continue;
      const entries = fs.readdirSync(folder);

      for (const entry of entries) {
        const full = path.resolve(folder, entry);
        if (fs.existsSync(full) && fs.statSync(full).isFile()) {
          usedFiles.add(full.replace(/\\/g, '/'));
        }
      }
    }
  }

  return usedFiles;
}
