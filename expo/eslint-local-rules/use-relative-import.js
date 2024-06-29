const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Use the relative path to import a module in the same or child directories.',
      category: 'Best Practices',
      recommended: false
    },
    messages: {
      useRelativePathImport: "Use the relative path to import a module in the same directory or it's children."
    },
    fixable: 'code'
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFilePath = context.getFilename();

        if (importPath.includes('@hpapp')) {
          const currentDir = path.dirname(currentFilePath);
          const resolvedImportPath = path.resolve(importPath.replace(/^@hpapp\//, ''));
          if (resolvedImportPath.startsWith(currentDir)) {
            context.report({
              node,
              messageId: 'useRelativePathImport',
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'./${path.relative(currentDir, resolvedImportPath)}'`);
              }
            });
          }
        }
      }
    };
  }
};
