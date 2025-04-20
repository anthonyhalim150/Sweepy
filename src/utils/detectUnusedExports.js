import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const { default: babelTraverse } = traverse;

function getExportedSymbols(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });

  const exported = new Set();

  babelTraverse(ast, {
    ExportNamedDeclaration({ node }) {
      if (node.declaration) {
        if (node.declaration.declarations) {
          node.declaration.declarations.forEach(d => {
            if (d.id?.name) exported.add(d.id.name);
          });
        } else if (node.declaration.id?.name) {
          exported.add(node.declaration.id.name);
        }
      }
      if (node.specifiers) {
        node.specifiers.forEach(spec => exported.add(spec.exported.name));
      }
    },
    ExportDefaultDeclaration({ node }) {
      if (node.declaration?.name) {
        exported.add('default:' + node.declaration.name);
      } else {
        exported.add('default');
      }
    }
  });

  return exported;
}

function getUsedSymbols(allFiles) {
  const used = new Set();

  for (const file of allFiles) {
    const code = fs.readFileSync(file, 'utf-8');
    let ast;
    try {
      ast = parse(code, {
        sourceType: 'unambiguous',
        plugins: ['jsx', 'typescript', 'dynamicImport']
      });
    } catch {
      continue;
    }

    babelTraverse(ast, {
      ImportSpecifier({ node }) {
        if (node.imported?.name) used.add(node.imported.name);
      },
      ImportDefaultSpecifier({ node }) {
        used.add('default');
      },
      CallExpression({ node }) {
        if (node.callee?.type === 'Identifier') {
          used.add(node.callee.name);
        }
      },
      MemberExpression({ node }) {
        if (node.object?.type === 'Identifier') {
          used.add(node.object.name);
        }
        if (node.property?.type === 'Identifier') {
          used.add(node.property.name);
        }
      },
      JSXIdentifier({ node }) {
        used.add(node.name);
      }
    });
  }

  return used;
}

export function detectUnusedExports(allJSFiles) {
  const unusedByFile = {};
  const usedSymbols = getUsedSymbols(allJSFiles);

  for (const file of allJSFiles) {
    const exported = getExportedSymbols(file);
    const unused = [...exported].filter(e => {
      const baseName = e.replace(/^default:/, '');
      return !usedSymbols.has(baseName);
    });

    if (unused.length) {
      unusedByFile[file] = unused;
    }
  }

  return unusedByFile;
}
