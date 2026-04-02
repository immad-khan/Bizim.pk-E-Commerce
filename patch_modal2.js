const fs = require('fs');

let pageTsx = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

const newProductFormInitialStateOriginal = "name: '',\n    price: 0,\n    originalPrice: 0,";
const newProductFormInitialStateUpdated = "name: '',\n    description: '',\n    price: 0,\n    originalPrice: 0,";

if (pageTsx.includes(newProductFormInitialStateOriginal)) {
    pageTsx = pageTsx.replace(newProductFormInitialStateOriginal, newProductFormInitialStateUpdated);
}

fs.writeFileSync('app/admin/dashboard/page.tsx', pageTsx);
console.log('patched Add Modal initial state');

