const fs = require('fs');
const path = require('path');

const files = ['seller_dashboard.html', 'store_setup.html', 'add_new_product.html', 'inventory_management.html'];

files.forEach(file => {
  const html = fs.readFileSync(path.join('screens', file), 'utf8');
  let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
  
  // Basic HTML to JSX conversions
  body = body.replace(/class="/g, 'className="');
  body = body.replace(/for="/g, 'htmlFor="');
  body = body.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments
  
  // Replace style="font-variation-settings: 'FILL' 1;"
  body = body.replace(/style="font-variation-settings:\s*'FILL'\s*1;"/g, "style={{fontVariationSettings: \"'FILL' 1\"}}");
  body = body.replace(/style="font-variation-settings:\s*'FILL'\s*0;"/g, "style={{fontVariationSettings: \"'FILL' 0\"}}");
  
  // Close unclosed tags
  body = body.replace(/<img([^>]*)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<img${p1} />`;
  });
  body = body.replace(/<input([^>]*)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<input${p1} />`;
  });
  body = body.replace(/<br([^>]*)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<br${p1} />`;
  });
  body = body.replace(/<hr([^>]*)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<hr${p1} />`;
  });
  
  const compName = file.split('.')[0].split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const code = `import React from 'react';\n\nconst ${compName} = () => {\n  return (\n    <>\n${body}\n    </>\n  );\n};\n\nexport default ${compName};\n`;
  
  fs.writeFileSync(`src/components/seller/${compName}.jsx`, code);
});
console.log('Done');
