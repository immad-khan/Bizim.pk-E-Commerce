const fs = require('fs');

let productCs = fs.readFileSync('api/Models/Product.cs', 'utf8');
if (!productCs.includes('Description')) {
    productCs = productCs.replace('public string? Image { get; set; }', 'public string? Description { get; set; }\n        public string? Image { get; set; }');
    fs.writeFileSync('api/Models/Product.cs', productCs);
    console.log('Added Description to Product.cs');
}

let productContextTsx = fs.readFileSync('lib/product-context.tsx', 'utf8');   
if (!productContextTsx.includes('description?')) {
    productContextTsx = productContextTsx.replace('image?: string;', 'description?: string;\n  image?: string;');
    fs.writeFileSync('lib/product-context.tsx', productContextTsx);
    console.log('Added description to product-context.tsx');
}
