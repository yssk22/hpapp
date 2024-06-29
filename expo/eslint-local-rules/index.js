const path = require('path');

module.exports = {
  'inconsistent-testid': require(path.resolve(__dirname, 'inconsistent-testid.js')),
  'no-internals-import': require(path.resolve(__dirname, 'no-internals-import.js')),
  'use-relative-import': require(path.resolve(__dirname, 'use-relative-import.js')),
  'no-translation-entry': require(path.resolve(__dirname, 'no-translation-entry.js'))
};
