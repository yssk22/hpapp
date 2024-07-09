const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow import of internals from other directories',
      category: 'Best Practices',
      recommended: false
    },
    messages: {
      noExternalInternalsImport: 'Importing from internals directories outside your own is not allowed.'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFilePath = context.getFilename();

        if (importPath.includes('internals')) {
          const currentDir = path.dirname(currentFilePath);
          const resolvedImportPath = importPath.startsWith('./')
            ? path.resolve(path.join(currentDir, importPath))
            : path.resolve(importPath.replace(/^@hpapp\//, ''));
          if (!resolvedImportPath.startsWith(currentDir)) {
            context.report({
              node,
              messageId: 'noExternalInternalsImport'
            });
          }
        }
      }
    };
  }
};
