const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Completely strip out any text-shadow or box-shadow
css = css.replace(/text-shadow:[^;]+;/g, '');
css = css.replace(/box-shadow:[^;]+;/g, '');

// 2. Change variables to support white text on dark translucent overlay over the video
// The overarching theme has white/ivory text when on translucent cards over the video
css = css.replace(/--text-headline: #[a-fA-F0-9]+;/g, '--text-headline: #FFFFFF;');
css = css.replace(/--text-body: #[a-fA-F0-9]+;/g, '--text-body: #F4F2EC;');
css = css.replace(/--text-muted: #[a-fA-F0-9]+;/g, '--text-muted: #D1CFCA;');

// 3. Dark translucent overlay backgrounds for cards & panels
css = css.replace(/--panel-glass: rgba\([^\)]+\);/g, '--panel-glass: rgba(15, 15, 15, 0.65);');
css = css.replace(/--panel-border: rgba\([^\)]+\);/g, '--panel-border: rgba(201, 162, 74, 0.25);');

css = css.replace(/background: rgba\(250, 249, 246, 0\.98\);/g, 'background: rgba(15, 15, 15, 0.65);');

// The specific cards inside Pillar/Services/Portfolio
css = css.replace(/background: rgba\(255, 255, 255, 0\.95\);/g, 'background: rgba(15, 15, 15, 0.5);');
css = css.replace(/background: rgba\(255, 255, 255, 0\.9\);/g, 'background: rgba(15, 15, 15, 0.5);');
css = css.replace(/background: rgba\(255, 255, 255, 0\.85\);/g, 'background: rgba(15, 15, 15, 0.5);');
css = css.replace(/background: rgba\(255, 255, 255, 0\.7\);/g, 'background: rgba(15, 15, 15, 0.5);');

// The hero description should be warm white
css = css.replace(/color: rgba\(255, 255, 255, 0\.9\);/g, 'color: #F4F2EC;');
css = css.replace(/color: rgba\(255, 255, 255, 0\.8\);/g, 'color: #F4F2EC;');
css = css.replace(/color: rgba\(255, 255, 255, 0\.7\);/g, 'color: rgba(244, 242, 236, 0.7);');

// 4. Buttons
// Ensure buttons don't have text shadow
// Gold accents should remain gold.
css = css.replace(/color: #1A1A1A;/g, 'color: #FFFFFF;');
css = css.replace(/color: #2C2C2C;/g, 'color: #F4F2EC;');

// Fix .card-lead directly to ensure it uses the variable
css = css.replace(/\.card-lead \{/g, '.card-lead {\n  color: var(--text-body);');

fs.writeFileSync('style.css', css);
console.log('Fixed for dark translucent overlay + white text');
