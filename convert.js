const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Update CSS Variables
css = css.replace('--bg-deep: #07080a;', '--bg-deep: #fbf9f6;');
css = css.replace('--panel-glass: var(--color-walnut-tint);', '--panel-glass: rgba(255, 255, 255, 0.95);');
css = css.replace('--panel-border: rgba(223, 186, 115, 0.42);', '--panel-border: rgba(212, 175, 55, 0.3);');
css = css.replace('--panel-shadow: 0 24px 60px rgba(0, 0, 0, 0.48), 0 4px 18px rgba(83, 56, 36, 0.45);', '--panel-shadow: 0 16px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(83, 56, 36, 0.05);');
css = css.replace('--text-headline: #ffffff;', '--text-headline: #18191c;');
css = css.replace('--text-body: #f7f1e8;', '--text-body: #42454a;');
css = css.replace('--text-muted: #d9ccb9;', '--text-muted: #72777d;');
css = css.replace('--gold-accent: #f5d78e;', '--gold-accent: #c19b45;');

// Update Header
css = css.replace('background: rgba(7, 8, 10, 0.65);', 'background: rgba(255, 255, 255, 0.85);');
css = css.replace('color: #ffffff;\n}', 'color: var(--text-headline);\n}');
css = css.replace('color: #f2ece2;', 'color: var(--text-body);');
css = css.replace('background: rgba(255, 255, 255, 0.1);', 'background: rgba(0, 0, 0, 0.05);');

// Update text references of #ffffff to var(--text-headline)
// Be careful with this, so let's do a selective replace
css = css.replace(/color: #ffffff;/g, 'color: var(--text-headline);');
css = css.replace(/color: #fff;/g, 'color: var(--text-headline);');
css = css.replace(/color: #f7f1e8;/g, 'color: var(--text-body);');

// Vignette
css = css.replace('background: radial-gradient(circle at center, rgba(7,8,10,0.3) 0%, rgba(7,8,10,0.7) 100%);', 'background: radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.85) 100%);');

// Update rgba(7, 8, 10, ...) with rgba(255, 255, 255, ...)
css = css.replace(/rgba\(7,\s*8,\s*10,\s*([0-9.]+)\)/g, 'rgba(255, 255, 255, $1)');

// Update pure white backgrounds to var(--bg-deep) if needed, but in this site white wasn't used for bg.
// Change borders
css = css.replace(/border: 1px solid rgba\(255, 255, 255, 0.1\);/g, 'border: 1px solid rgba(0, 0, 0, 0.1);');
css = css.replace(/border-top: 1px solid rgba\(255, 255, 255, 0.1\);/g, 'border-top: 1px solid rgba(0, 0, 0, 0.1);');

// Update glass CTA buttons
css = css.replace('background: rgba(255, 255, 255, 0.05);', 'background: rgba(0, 0, 0, 0.03);');
css = css.replace('border: 1px solid rgba(255, 255, 255, 0.2);', 'border: 1px solid rgba(0, 0, 0, 0.15);');
css = css.replace('background: rgba(255, 255, 255, 0.1);', 'background: rgba(0, 0, 0, 0.08);');

// Kicker dot and scroll wheel which might be white
css = css.replace('border: 1.5px solid rgba(255, 255, 255, 0.4);', 'border: 1.5px solid rgba(0, 0, 0, 0.3);');

// text colors with opacity
css = css.replace(/rgba\(255, 255, 255, 0.6\)/g, 'rgba(0, 0, 0, 0.6)');
css = css.replace(/rgba\(255, 255, 255, 0.8\)/g, 'rgba(0, 0, 0, 0.8)');
css = css.replace(/rgba\(255, 255, 255, 0.9\)/g, 'rgba(0, 0, 0, 0.9)');

// Other specific backgrounds
css = css.replace(/rgba\(56, 36, 21, 0.85\)/g, 'rgba(255, 255, 255, 0.9)');
css = css.replace(/rgba\(45, 28, 16, 0.85\)/g, 'rgba(255, 255, 255, 0.9)');

// Box shadows that used white
css = css.replace(/box-shadow: 0 4px 20px rgba\(0, 0, 0, 0.3\)/g, 'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08)');

// Fix footer
css = css.replace('.site-footer {\n  background: var(--bg-deep);', '.site-footer {\n  background: #111215; color: #fff;'); 
// We might want footer to stay dark or turn light. Let's make footer light too.
css = css.replace('.footer-grid {', '.footer-grid { color: var(--text-body); ');

fs.writeFileSync('style.css', css);
console.log('Conversion complete');
