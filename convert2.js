const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Convert remaining dark roots
css = css.replace('--color-walnut-tint: rgba(83, 56, 36, 0.94);', '--color-walnut-tint: rgba(255, 255, 255, 0.94);');
css = css.replace('--color-walnut-chip: rgba(56, 36, 21, 0.82);', '--color-walnut-chip: rgba(255, 255, 255, 0.85);');

// Change hardcoded dark rgba to light
css = css.replace(/background: rgba\(56, 36, 21, 0\.70\);/g, 'background: rgba(255, 255, 255, 0.7);');
css = css.replace(/background: rgba\(70, 46, 28, 0\.85\);/g, 'background: rgba(255, 255, 255, 0.95);');
css = css.replace(/background: rgba\(83, 56, 36, 0\.75\);/g, 'background: rgba(255, 255, 255, 0.85);');

// Change shadow colors
css = css.replace(/box-shadow: 0 6px 20px rgba\(83, 56, 36, 0\.5\)/g, 'box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08)');
css = css.replace(/box-shadow: 0 10px 28px rgba\(83, 56, 36, 0\.65\)/g, 'box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12)');
css = css.replace(/box-shadow: 0 4px 14px rgba\(83, 56, 36, 0\.4\)/g, 'box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06)');
css = css.replace(/box-shadow: 0 8px 22px rgba\(83, 56, 36, 0\.6\)/g, 'box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1)');
css = css.replace(/box-shadow: 0 6px 18px rgba\(83, 56, 36, 0\.6\)/g, 'box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1)');

fs.writeFileSync('style.css', css);
console.log('Conversion 2 complete');
