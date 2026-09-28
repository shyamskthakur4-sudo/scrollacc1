const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Remove ALL text-shadow and box-shadow completely
css = css.replace(/text-shadow:[^;]+;/g, '');
css = css.replace(/box-shadow:[^;]+;/g, '');

// 2. Change body text in landing/pillars to warm white/off-white
css = css.replace(/--text-body: #2C2C2C;/g, '--text-body: #F4F2EC;');
css = css.replace(/--text-headline: #1A1A1A;/g, '--text-headline: #FFFFFF;');
css = css.replace(/--text-muted: #5A5A5A;/g, '--text-muted: #D1CFCA;');

// 3. Since text is white, backgrounds of cards/pillars need to be a subtle dark translucent overlay
// The user asked for "subtle dark translucent overlay behind the text where necessary"
// Change panel-glass and other card backgrounds to a dark translucent color
css = css.replace(/--panel-glass: rgba\(250, 249, 246, 0\.98\);/g, '--panel-glass: rgba(15, 15, 15, 0.65);');
css = css.replace(/background: rgba\(250, 249, 246, 0\.98\);/g, 'background: rgba(15, 15, 15, 0.65);');
css = css.replace(/--color-walnut-chip: rgba\(255, 255, 255, 0\.85\);/g, '--color-walnut-chip: rgba(15, 15, 15, 0.7);');
css = css.replace(/--color-walnut-tint: rgba\(255, 255, 255, 0\.94\);/g, '--color-walnut-tint: rgba(15, 15, 15, 0.8);');

// The hero description text color
css = css.replace(/\.editorial-description \{\s*font-family: var\(--font-sans\);\s*font-size: 1\.1rem;\s*line-height: 1\.6;\s*color: rgba\(255, 255, 255, 0\.9\);/g, '.editorial-description {\n  font-family: var(--font-sans);\n  font-size: 1.1rem;\n  line-height: 1.6;\n  color: #F4F2EC;');

// Fix specific text colors that were forced dark
css = css.replace(/color: #1A1A1A;/g, 'color: #FFFFFF;');
css = css.replace(/color: #2C2C2C;/g, 'color: #F4F2EC;');
css = css.replace(/color: rgba\(0, 0, 0, 0\.8\);/g, 'color: rgba(255, 255, 255, 0.9);');
css = css.replace(/color: rgba\(0, 0, 0, 0\.6\);/g, 'color: rgba(255, 255, 255, 0.7);');
css = css.replace(/color: rgba\(0, 0, 0, 0\.9\);/g, 'color: rgba(255, 255, 255, 0.95);');

// Change site footer background to dark
css = css.replace(/background: var\(--bg-deep\);/g, 'background: #0D0D0D;');
css = css.replace(/--bg-deep: #FAF9F6;/g, '--bg-deep: #0D0D0D;');
css = css.replace(/background: #FAF9F6;/g, 'background: #0D0D0D;');

// Remove any lingering glow borders
css = css.replace(/border: 1px solid rgba\(201, 162, 74, 0\.3\);/g, 'border: 1px solid rgba(255, 255, 255, 0.1);');
css = css.replace(/border-color: var\(--gold-accent\);/g, 'border-color: rgba(255, 255, 255, 0.2);');

// Keep gold for headings.
// (Gold accents are already in --gold-accent and applied to .gold-accent etc.)

fs.writeFileSync('style.css', css);
console.log('Shadows removed and text changed to warm white');
