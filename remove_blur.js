const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Completely remove any blur filters
css = css.replace(/backdrop-filter:[^;]+;/g, '');
css = css.replace(/-webkit-backdrop-filter:[^;]+;/g, '');

fs.writeFileSync('style.css', css);
console.log('Blurs removed');
