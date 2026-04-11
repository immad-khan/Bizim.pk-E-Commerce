const fs = require('fs');

let code = fs.readFileSync('lib/product-context.tsx', 'utf8');
if (!code.includes('collection?: string;')) {
    code = code.replace(/description\?: string;\s*\}/, "description?: string;\n    collection?: string;\n  }");
    fs.writeFileSync('lib/product-context.tsx', code);
    console.log('Added collection to Product context');
}
