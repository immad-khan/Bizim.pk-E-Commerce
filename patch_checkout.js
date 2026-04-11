const fs = require('fs');

function fixCheckout() {
    let code = fs.readFileSync('components/checkout-form.tsx', 'utf8');
    code = code.replace(/interface CartItem \{[\s\S]*?quantity: number\s*\}/m, 
        "interface CartItem {\n      id: string\n      name: string\n      price: number\n      image: string\n      quantity: number\n      shipmentFee?: number\n    }");
    fs.writeFileSync('components/checkout-form.tsx', code);
}

fixCheckout();

