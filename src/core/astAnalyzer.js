import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { loadTSPaths, resolveAliasImport } from '../utils/resolveAlias.js';

const { default: babelTraverse } = traverse;

const supportedExtensions = ['.js', '.ts', '.jsx', '.tsx'];

export async function extractImportsFromFiles(files) {
  const usedFiles = new Set();
  const tsPaths = loadTSPaths(process.cwd());

  for (const file of files) {
    const ext = path.extname(file);
    if (!supportedExtensions.includes(ext)) continue;

    let code = '';
    try {
      code = fs.readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    let ast;
    try {
      ast = parse(code, {
        sourceType: 'unambiguous',
        plugins: ['jsx', 'typescript', 'dynamicImport'],
      });
    } catch (e) {
      console.warn('Failed to parse:', file);
      continue;
    }

    const tryResolve = (importPath) => {
      const aliasResolved = resolveAliasImport(importPath, file, tsPaths);
      if (aliasResolved) {
        usedFiles.add(aliasResolved);
      } else {
        const resolved = path.resolve(path.dirname(file), importPath);
        usedFiles.add(resolved);
      }
    };

    babelTraverse(ast, {
      ImportDeclaration({ node }) {
        if (node.source?.value) {
          tryResolve(node.source.value);
        }
      },
      CallExpression({ node }) {
        if (
          node.callee.name === 'require' &&
          node.arguments.length &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          tryResolve(node.arguments[0].value);
        }
      },
      Import({ node }) {
        if (node.arguments?.[0]?.type === 'StringLiteral') {
          tryResolve(node.arguments[0].value);
        }
      },
    });
  }

  return usedFiles;
}
