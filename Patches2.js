const fs = require('fs');

let page = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// The replacement logic is simplified without escaping template literals because we're inside Powershell @"
const replace1 = "status: true, sales: 0, onSale: false, saleDiscount: 0, quantity: 0";
const target1 = "status: true, sales: 0, onSale: false, saleDiscount: 0, quantity: 0, shipmentFee: 0";

if(page.includes(replace1)) {
    page = page.replace(replace1, target1);
}

fs.writeFileSync('app/admin/dashboard/page.tsx', page, 'utf8');
console.log('patched');
