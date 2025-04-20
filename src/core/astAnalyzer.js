import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import {
  loadWebpackAliases,
  loadBabelAliases,
  loadViteAliases
} from '../utils/resolveMoreAliases.js';
import {
  loadTSPaths,
  resolveAliasImport
} from '../utils/resolveAlias.js';

const { default: babelTraverse } = traverse;
const supportedExtensions = ['.js', '.ts', '.jsx', '.tsx'];

export async function extractImportsFromFiles(files, customAliases = {}) {
  const usedFiles = new Set();

  const aliases = {
    ...customAliases,
    ...loadWebpackAliases(process.cwd()),
    ...loadViteAliases(process.cwd()),
    ...loadBabelAliases(process.cwd())
  };

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
        plugins: ['jsx', 'typescript', 'dynamicImport']
      });
    } catch (err) {
      console.warn(`❌ Failed to parse ${file}: ${err.message}`);
      continue;
    }
    

    const tryResolve = (importPath) => {
      if (!importPath) return;

    
      const tsResolved = resolveAliasImport(importPath, file, tsPaths);
      if (tsResolved && fs.existsSync(tsResolved)) {
        usedFiles.add(tsResolved);
        return;
      }


      let resolved;
      const aliasKey = Object.keys(aliases).find(k => importPath.startsWith(k + '/'));
      if (aliasKey) {
        const rest = importPath.slice(aliasKey.length + 1);
        resolved = path.resolve(aliases[aliasKey], rest);
      } else {
        resolved = path.resolve(path.dirname(file), importPath);
      }

   
      const candidates = supportedExtensions.map(ext => resolved + ext);
      const match = candidates.find(p => fs.existsSync(p));
      if (match) {
        usedFiles.add(match);
      } else if (fs.existsSync(resolved)) {
        usedFiles.add(resolved);
      }
    };

    babelTraverse(ast, {
      ImportDeclaration({ node }) {
        tryResolve(node.source?.value);
      },
      ExportAllDeclaration({ node }) {
        if (node.source?.value) {
          const dirPath = path.resolve(path.dirname(file), node.source.value);
          if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
            const entries = fs.readdirSync(dirPath).filter(f => /\.(js|ts|jsx|tsx)$/.test(f));
            for (const entry of entries) {
              const resolved = path.resolve(dirPath, entry);
              usedFiles.add(resolved);
            }
          } else {
            tryResolve(node.source?.value);
          }
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
      }
    });
  }

  return usedFiles;
}
