const fs = require('fs');
let code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

const t1 = '<label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>';
const t2 = 'value={newProductForm.shipmentFee';
const r1 = '<div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label><select value={newProductForm.collection || \'\'} onChange={(e) => setNewProductForm({ ...newProductForm, collection: e.target.value })} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-[#111] text-white"><option value="">None</option><option value="mens">Men\\'s Collection</option><option value="womens">Women\\'s Collection</option><option value="smart-bags">Smart Bags</option></select></div><div className="mt-4"><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label><input type="number" value={newProductForm.shipmentFee';

const patternAdd = new RegExp(/<label className="block text-xs text-orange-400 mb-1\.5 uppercase tracking-wider">Shipment Fee \(Rs\)<\/label>\s*<input\s*type="number"\s*value=\{newProductForm\.shipmentFee/m);
code = code.replace(patternAdd, r1);


const p2 = 'value={editingProduct?.shipmentFee';
const r2 = '<div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label><select value={editingProduct?.collection || \'\'} onChange={(e) => setEditingProduct(prev => prev ? { ...prev, collection: e.target.value } : null)} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-[#111] text-white"><option value="">None</option><option value="mens">Men\\'s Collection</option><option value="womens">Women\\'s Collection</option><option value="smart-bags">Smart Bags</option></select></div><div className="mt-4"><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label><input type="number" value={editingProduct?.shipmentFee';

const patternEdit = new RegExp(/<label className="block text-xs text-orange-400 mb-1\.5 uppercase tracking-wider">Shipment Fee \(Rs\)<\/label>\s*<input\s*type="number"\s*value=\{editingProduct\?\.shipmentFee/m);
code = code.replace(patternEdit, r2);

fs.writeFileSync('app/admin/dashboard/page.tsx', code);
console.log('patched');
