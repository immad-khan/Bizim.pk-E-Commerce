const fs = require('fs');

let page = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

page = page.replace(
    'status: true, sales: 0, onSale: false, saleDiscount: 0, quantity: 0',
    'status: true, sales: 0, onSale: false, saleDiscount: 0, quantity: 0, shipmentFee: 0'
);

const shipmentFeeHtmlAdd = \
                    <div className="col-span-1 border-l border-orange-900/30 pl-4">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>
                      <input type="number" value={newProductForm.shipmentFee || 0} onChange={(e) => setNewProductForm({ ...newProductForm, shipmentFee: Number(e.target.value) })} className="neo-input w-full rounded-lg px-3 py-2 text-sm" />
                    </div>\;

const priceHtmAddBlockString = \className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          />
                        </div>\;

page = page.replace(priceHtmAddBlockString, match => match + shipmentFeeHtmlAdd);

const shipmentFeeHtmlEdit = \
                    <div className="col-span-1 border-l border-orange-900/30 pl-4">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>
                      <input type="number" value={editingProduct?.shipmentFee || 0} onChange={(e) => setEditingProduct({ ...editingProduct, shipmentFee: Number(e.target.value) })} className="neo-input w-full rounded-lg px-3 py-2 text-sm" />
                    </div>\;

page = page.replace(priceHtmAddBlockString, match => match + shipmentFeeHtmlEdit);

fs.writeFileSync('app/admin/dashboard/page.tsx', page, 'utf8');
console.log('patched');
