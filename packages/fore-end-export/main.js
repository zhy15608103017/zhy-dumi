const fs = require('fs');
const path = require('path');

let content = "\nimport './index.css';";

fs.writeFileSync('./dist/index.js', content, { flag: 'a' });
