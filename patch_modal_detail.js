const fs = require('fs');
let modalTsx = fs.readFileSync('components/product-detail-modal.tsx', 'utf8');

const targetStr = `<p>
                    Premium luxury bag crafted with the finest materials. This exclusive piece features sophisticated design elements and superior craftsmanship, perfect for those who appreciate quality and elegance in their daily ventures.
                    </p>`;

const injectStr = `<p>
                    {product.description || "Premium luxury bag crafted with the finest materials. This exclusive piece features sophisticated design elements and superior craftsmanship, perfect for those who appreciate quality and elegance in their daily ventures."}
                    </p>`;

if (modalTsx.includes(targetStr)) {
    modalTsx = modalTsx.replace(targetStr, injectStr);
    fs.writeFileSync('components/product-detail-modal.tsx', modalTsx);
    console.log('patched Product Detail Modal');
} else {
    // fallback if indentation or newlines differ
    modalTsx = modalTsx.replace(/<p>[\s\S]*?Premium luxury bag crafted with the finest materials\. This exclusive piece features sophisticated design elements and superior craftsmanship, perfect for those who appreciate quality and elegance in their daily ventures\.[\s\S]*?<\/p>/, injectStr);
    fs.writeFileSync('components/product-detail-modal.tsx', modalTsx);
    console.log('patched Product Detail Modal (regex)');
}
