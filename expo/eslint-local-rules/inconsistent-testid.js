const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'testID should be consistent with the module name',
      category: 'Best Practices',
      recommended: false
    }
  },
  create(context) {
    return {
      JSXAttribute: (node) => {
        if (node.name.name === 'testID') {
          const currentFilePath = path.parse(context.getFilename());
          let expectedPrefix;
          if (currentFilePath.name === 'index') {
            expectedPrefix = currentFilePath.dir.split('/').pop();
          } else if (currentFilePath.name === 'index.test') {
            expectedPrefix = currentFilePath.dir.split('/').pop() + '.test';
          } else {
            expectedPrefix = currentFilePath.name;
          }
          let exp = node.value.value;
          if (exp === undefined) {
            if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'TemplateLiteral') {
              exp = node.value.expression.quasis.map((quasi) => quasi.value.raw).join('');
            }
            if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'Identifier') {
              // it's variable so we cannot check
              return;
            }
          }
          if (exp === undefined) {
            context.report(node, 'testID should starts with ' + expectedPrefix + ' but cannot identify.');
          } else {
            if (!exp.startsWith(expectedPrefix)) {
              context.report(node, 'testID should starts with ' + expectedPrefix + '.');
            }
          }
        }
      }
    };
  }
};
