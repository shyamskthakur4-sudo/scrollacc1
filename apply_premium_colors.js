const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Update Root Variables for the global theme
css = css.replace(/--bg-deep: #fbf9f6;/g, '--bg-deep: #FAF9F6;');
css = css.replace(/--text-headline: #18191c;/g, '--text-headline: #1A1A1A;');
css = css.replace(/--text-body: #42454a;/g, '--text-body: #2C2C2C;');
css = css.replace(/--text-muted: #72777d;/g, '--text-muted: #5A5A5A;');

css = css.replace(/--gold-primary: #dfba73;/g, '--gold-primary: #C9A24A;');
css = css.replace(/--gold-accent: #c19b45;/g, '--gold-accent: #C9A24A;');
css = css.replace(/--gold-subtle: rgba\(212, 175, 55, 0\.2\);/g, '--gold-subtle: rgba(201, 162, 74, 0.2);');

// Panels & Cards - Clean solid/translucent backgrounds
css = css.replace(/--panel-glass: rgba\(255, 255, 255, 0\.95\);/g, '--panel-glass: rgba(250, 249, 246, 0.98);');
css = css.replace(/--panel-border: rgba\(212, 175, 55, 0\.3\);/g, '--panel-border: rgba(201, 162, 74, 0.3);');

// Replace all cards and specific backgrounds to the new ivory panel
css = css.replace(/background: rgba\(255, 255, 255, 0\.7\);/g, 'background: rgba(250, 249, 246, 0.98);');
css = css.replace(/background: rgba\(255, 255, 255, 0\.95\);/g, 'background: rgba(250, 249, 246, 0.98);');
css = css.replace(/background: rgba\(255, 255, 255, 0\.85\);/g, 'background: rgba(250, 249, 246, 0.98);');
css = css.replace(/background: rgba\(255, 255, 255, 0\.9\);/g, 'background: rgba(250, 249, 246, 0.98);');

// 2. Remove excessive glow/blur from hero
// Vignette overlay - "subtle dark overlays/gradients behind text when images are used"
css = css.replace(/background: radial-gradient\(circle at center, rgba\(255,255,255,0\.4\) 0%, rgba\(255,255,255,0\.85\) 100%\);/g, 'background: linear-gradient(180deg, rgba(15,15,15,0.4) 0%, rgba(15,15,15,0.7) 100%);');
css = css.replace(/background: rgba\(255, 255, 255, 0\.85\);\s*backdrop-filter: blur\(20px\) saturate\(1\.2\);\s*-webkit-backdrop-filter: blur\(20px\) saturate\(1\.2\);/g, 'background: rgba(250, 249, 246, 0.98);\n  backdrop-filter: blur(8px); /* Reduced blur */\n  -webkit-backdrop-filter: blur(8px);');

// Fix Hero Text Colors to white since they are over a dark overlay
css = css.replace(/\.kicker-text \{\s*font-family: var\(--font-sans\);\s*font-size: 0\.85rem;\s*font-weight: 600;\s*letter-spacing: 4px;\s*color: var\(--text-headline\);/g, '.kicker-text {\n  font-family: var(--font-sans);\n  font-size: 0.85rem;\n  font-weight: 600;\n  letter-spacing: 4px;\n  color: #FFFFFF;');
css = css.replace(/\.editorial-headline \{\s*font-family: var\(--font-heading\);\s*font-size: clamp\(3rem, 7vw, 6\.5rem\);\s*font-weight: 600;\s*line-height: 1\.05;\s*color: var\(--text-headline\);\s*margin-bottom: 30px;\s*letter-spacing: -1px;\s*text-shadow: 0 10px 40px rgba\(255,255,255,0\.9\), 0 0 15px rgba\(255,255,255,0\.7\);/g, '.editorial-headline {\n  font-family: var(--font-heading);\n  font-size: clamp(3rem, 7vw, 6.5rem);\n  font-weight: 600;\n  line-height: 1.05;\n  color: #FFFFFF;\n  margin-bottom: 30px;\n  letter-spacing: -1px;\n  text-shadow: 0 2px 10px rgba(0,0,0,0.5); /* subtle dark shadow for contrast */');
css = css.replace(/\.headline-italic \{\s*font-style: italic;\s*font-weight: 400;\s*color: rgba\(0, 0, 0, 0\.9\);/g, '.headline-italic {\n  font-style: italic;\n  font-weight: 400;\n  color: #F0F0F0;');
css = css.replace(/\.editorial-description \{\s*font-family: var\(--font-sans\);\s*font-size: 1\.1rem;\s*line-height: 1\.6;\s*color: rgba\(0, 0, 0, 0\.8\);/g, '.editorial-description {\n  font-family: var(--font-sans);\n  font-size: 1.1rem;\n  line-height: 1.6;\n  color: rgba(255, 255, 255, 0.9);');
css = css.replace(/\.ed-stat-lbl \{\s*font-family: var\(--font-sans\);\s*font-size: 0\.75rem;\s*text-transform: uppercase;\s*letter-spacing: 2px;\s*color: rgba\(0, 0, 0, 0\.6\);/g, '.ed-stat-lbl {\n  font-family: var(--font-sans);\n  font-size: 0.75rem;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  color: rgba(255, 255, 255, 0.8);');

// CTA Buttons over dark background should also be light
css = css.replace(/background: rgba\(0, 0, 0, 0\.03\);\s*border: 1px solid rgba\(0, 0, 0, 0\.15\);\s*backdrop-filter: blur\(10px\);\s*-webkit-backdrop-filter: blur\(10px\);\s*color: var\(--text-headline\);/g, 'background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  color: #FFFFFF;');
css = css.replace(/background: rgba\(0, 0, 0, 0\.05\);\s*border-color: var\(--gold-accent\);/g, 'background: rgba(255, 255, 255, 0.15);\n  border-color: var(--gold-accent);');

// 3. Fix glow/blur in certificate
css = css.replace(/box-shadow: 0 20px 50px rgba\(0, 0, 0, 0\.08\), 0 0 30px rgba\(223, 186, 115, 0\.1\);/g, 'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); /* Removed gold glow */');
css = css.replace(/box-shadow: 0 25px 60px rgba\(0, 0, 0, 0\.12\), 0 0 40px rgba\(223, 186, 115, 0\.15\);/g, 'box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08); /* Removed gold glow */');
css = css.replace(/border: 4px solid rgba\(212, 175, 55, 0\.2\);/g, 'border: 2px solid var(--gold-accent); /* Clean border */');
css = css.replace(/background: linear-gradient\(135deg, rgba\(223, 186, 115, 0\.15\) 0%, rgba\(223, 186, 115, 0\.05\) 100%\);/g, 'background: var(--bg-deep);');

// Remove dot glow
css = css.replace(/box-shadow: 0 0 10px rgba\(223, 186, 115, 0\.5\);/g, 'box-shadow: none;');

// Change #f4f2ef footer to #FAF9F6
css = css.replace(/background: #f4f2ef;/g, 'background: var(--bg-deep);');

fs.writeFileSync('style.css', css);
console.log('Premium luxury color theme applied');
