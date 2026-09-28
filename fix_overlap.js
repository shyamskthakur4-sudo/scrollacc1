const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Fix Layout to prevent overflow upwards (centering issue)
css = css.replace(/\.hero-editorial-layout \{\s*width: 100%;\s*min-height: 100vh;\s*padding-top: 100px;\s*padding-bottom: 40px;\s*display: flex;\s*align-items: center;\s*justify-content: center;\s*position: relative;\s*text-align: center;\s*\}/g, '.hero-editorial-layout {\n  width: 100%;\n  min-height: 100vh;\n  padding-top: 120px;\n  padding-bottom: 60px;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  text-align: center;\n}');

css = css.replace(/\.hero-editorial-content \{\s*display: flex;\s*flex-direction: column;\s*align-items: center;\s*max-width: 1000px;\s*width: 100%;\s*padding-top: 5vh;\s*\}/g, '.hero-editorial-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  max-width: 1000px;\n  width: 100%;\n  margin: auto auto;\n}');

// Reduce huge font sizes that cause content to exceed viewport height on some screens
css = css.replace(/font-size: clamp\(3rem, 7vw, 6\.5rem\);/g, 'font-size: clamp(2.5rem, 5.5vw, 5.5rem);');
css = css.replace(/font-size: clamp\(3\.2rem, 7\.5vw, 7rem\);/g, 'font-size: clamp(2.8rem, 6vw, 6rem);');

// Shrink margins on elements in hero to save vertical space
css = css.replace(/margin-bottom: 30px;/g, 'margin-bottom: 20px;'); // used in kicker and headline
css = css.replace(/\.editorial-description \{\s*font-family: var\(--font-sans\);\s*font-size: 1\.1rem;\s*line-height: 1\.6;\s*color: #F5F1E8;\s*max-width: 600px;\s*margin: 0 auto 40px;\s*font-weight: 300;\s*\}/g, '.editorial-description {\n  font-family: var(--font-sans);\n  font-size: 1.1rem;\n  line-height: 1.5;\n  color: #F5F1E8;\n  max-width: 600px;\n  margin: 0 auto 30px;\n  font-weight: 300;\n}');

// Fix CTA margin
css = css.replace(/\.editorial-cta-row \{\s*margin-bottom: 60px;\s*\}/g, '.editorial-cta-row {\n  margin-bottom: 30px;\n}');

fs.writeFileSync('style.css', css);
console.log('Fixed overlap and centering');
