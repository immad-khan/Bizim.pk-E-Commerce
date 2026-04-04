const fs = require('fs');

let page = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// Replace typing inside both setNewProductForm and setEditingProduct objects
page = page.replace(
    'status: true, sales: 0, onSale: false, saleDiscount: 0, quantity: 0',
    'status: true, sales: 0, onSale: false, saleDiscount: 0, quantity: 0, shipmentFee: 0'
);

const shipmentFeeHtmlAdd = 
                    <div className="col-span-1">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>
                      <input
                        type="number"
                        value={newProductForm.shipmentFee || 0}
                        onChange={(e) => setNewProductForm({ ...newProductForm, shipmentFee: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>;

const priceHtmAddBlockRegex = /<input\s*type="number"\s*value=\{newProductForm\.price\}\s*onChange=\{\(e\) => setNewProductForm\(\{ \.\.\.newProductForm, price: Number\(e\.target\.value\) \}\)\}\s*className="neo-input w-full rounded-lg px-3 py-2 text-sm"\s*\/>\s*<\/div>/;

if(page.match(priceHtmAddBlockRegex)) {
    page = page.replace(priceHtmAddBlockRegex, match => match + shipmentFeeHtmlAdd);
    console.log('Added Shipment to Add Modal!');
}

const shipmentFeeHtmlEdit = 
                    <div className="col-span-1">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>
                      <input
                        type="number"
                        value={editingProduct.shipmentFee || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shipmentFee: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>;

const priceHtmEditBlockRegex = /<input\s*type="number"\s*value=\{editingProduct\.price\}\s*onChange=\{\(e\) => setEditingProduct\(\{ \.\.\.editingProduct, price: Number\(e\.target\.value\) \}\)\}\s*className="neo-input w-full rounded-lg px-3 py-2 text-sm"\s*\/>\s*<\/div>/;

if(page.match(priceHtmEditBlockRegex)) {
    page = page.replace(priceHtmEditBlockRegex, match => match + shipmentFeeHtmlEdit);
    console.log('Added Shipment Fee to Edit modal');
}

fs.writeFileSync('app/admin/dashboard/page.tsx', page, 'utf8');
