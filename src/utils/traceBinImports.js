import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const { default: babelTraverse } = traverse;

const visited = new Set();
const resolvedImports = new Set();

export function traceBinImports(entryPath) {
  visited.clear();
  resolvedImports.clear();
  const normalizedEntry = path.resolve(entryPath).replace(/\\/g, '/');
  walk(normalizedEntry);
  return Array.from(resolvedImports);
}

function walk(filePath) {
  const ext = path.extname(filePath);
  if (!['.js', '.ts', '.jsx', '.tsx', ''].includes(ext)) return;
  if (visited.has(filePath)) return;
  visited.add(filePath);

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.js')) filePath += '.js';
    else if (fs.existsSync(filePath + '.ts')) filePath += '.ts';
    else return;
  }

  let code = '';
  try {
    code = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return;
  }

  let ast;
  try {
    ast = parse(code, {
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'dynamicImport']
    });
  } catch {
    return;
  }

  resolvedImports.add(filePath.replace(/\\/g, '/'));

  babelTraverse(ast, {
    ImportDeclaration({ node }) {
      resolveAndWalk(node.source?.value, filePath);
    },
    CallExpression({ node }) {
      if (
        node.callee.name === 'require' &&
        node.arguments.length &&
        node.arguments[0].type === 'StringLiteral'
      ) {
        resolveAndWalk(node.arguments[0].value, filePath);
      }
    }
  });
}

function resolveAndWalk(raw, fromFile) {
  if (!raw || raw.startsWith('http') || raw.startsWith('fs') || raw.startsWith('chalk') || raw.startsWith('path')) return;
  if (raw.startsWith('.')) {
    const dir = path.dirname(fromFile);
    const full = path.resolve(dir, raw);
    walk(full);
  }
}
