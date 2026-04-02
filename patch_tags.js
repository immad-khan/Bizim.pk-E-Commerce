const fs = require('fs');

let productCs = fs.readFileSync('api/Models/Product.cs', 'utf8');
if (!productCs.includes('public string? Tags { get; set; }')) {
    productCs = productCs.replace('public string? AvailableColors { get; set; }', 'public string? Tags { get; set; }\n        public string? AvailableColors { get; set; }');
    fs.writeFileSync('api/Models/Product.cs', productCs);
    console.log('Added Tags to Product.cs');
}

let productContextTsx = fs.readFileSync('lib/product-context.tsx', 'utf8');   
if (!productContextTsx.includes('tags?')) {
    productContextTsx = productContextTsx.replace('description?: string;', 'tags?: string;\n  description?: string;');
    fs.writeFileSync('lib/product-context.tsx', productContextTsx);
    console.log('Added tags to product-context.tsx');
}
