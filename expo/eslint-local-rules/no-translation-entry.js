const path = require('path');
const translations = require(path.resolve(__dirname, '../assets/translations.json'));

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Validate translation string is registered in the translation file',
      category: 'Best Practices',
      recommended: false
    }
  },
  create(context) {
    return {
      CallExpression(node) {
        if (node.callee.name === 't') {
          const translationKey = node.arguments[0].value;
          if (translationKey === undefined) {
            context.report(node, 'the translation key is not a string');
          } else if (!translations[translationKey]) {
            context.report(node, `the translation key "${translationKey}" is not found in the translation file.`);
          }
        }
      }
    };
  }
};
