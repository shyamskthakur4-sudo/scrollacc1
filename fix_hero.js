const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Fix Hero Layout Padding
css = css.replace(/\.hero-editorial-layout \{\s*width: 100%;\s*height: 100vh;/g, '.hero-editorial-layout {\n  width: 100%;\n  min-height: 100vh;\n  padding-top: 100px;\n  padding-bottom: 40px;');

// 2. Fix broken -webkit- line in cta
css = css.replace(/-webkit-\s*color: #FFFFFF;/g, 'color: #F5F1E8;');

// 3. Make all hero body text and CTA text solid white/off-white (#F5F1E8)
css = css.replace(/color: #FFFFFF;/g, 'color: #F5F1E8;'); 
css = css.replace(/color: #F4F2EC;/g, 'color: #F5F1E8;');

// Fix CTA Arrow icon color to dark charcoal for high contrast against gold circle
css = css.replace(/\.cta-arrow-circle \{\s*width: 40px;\s*height: 40px;\s*background: var\(--gold-accent\);\s*border-radius: 50%;\s*display: flex;\s*align-items: center;\s*justify-content: center;\s*color: var\(--color-walnut\);/g, '.cta-arrow-circle {\n  width: 40px;\n  height: 40px;\n  background: var(--gold-accent);\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #1A1A1A;');

// 4. Update the dark overlay for better visibility
css = css.replace(/background: linear-gradient\(180deg, rgba\(15,15,15,0\.4\) 0%, rgba\(15,15,15,0\.7\) 100%\);/g, 'background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.65) 100%);');

// 5. Fix black borders/dividers in hero stats and scroll hint
css = css.replace(/border-top: 1px solid rgba\(0, 0, 0, 0\.1\);/g, 'border-top: 1px solid rgba(255, 255, 255, 0.15);');
css = css.replace(/background: rgba\(0, 0, 0, 0\.08\);/g, 'background: rgba(255, 255, 255, 0.15);');
css = css.replace(/border: 1\.5px solid rgba\(0, 0, 0, 0\.3\);/g, 'border: 1.5px solid rgba(245, 241, 232, 0.3);');

// 6. Remove any filter: drop-shadow()
css = css.replace(/filter:\s*drop-shadow\([^)]+\);/g, '');

// Clean up any remaining text-shadow just in case
css = css.replace(/text-shadow:[^;]+;/g, '');

fs.writeFileSync('style.css', css);
console.log('Hero section fixed');
