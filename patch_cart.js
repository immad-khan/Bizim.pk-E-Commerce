const fs = require('fs');

function fixCartPage() {
    let code = fs.readFileSync('app/cart/page.tsx', 'utf8');
    code = code.replace(/const \[cart, setCart\] = useState<Array<\{[\s\S]*?quantity: number\s*\}\>>\(\[\]\)/m, 
        "const [cart, setCart] = useState<Array<{ id: string, name: string, price: number, image: string, quantity: number, shipmentFee?: number }>>([])");
    fs.writeFileSync('app/cart/page.tsx', code);
}

fixCartPage();
console.log('Fixed cart page');

