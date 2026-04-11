const fs = require('fs');
let code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

code = code.replace(/<div className="grid grid-cols-1\s+border-t border-orange-900\/30 pt-4 mt-2">\s*<div>\s*<label className="block text-xs text-orange-400 mb-1\.5\s+uppercase tracking-wider">Shipment Fee/gm, 
  '<div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2"><div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label><select value={isAddModalOpen ? (newProductForm.collection || "") : (editingProduct?.collection || "")} onChange={(e) => { if(isAddModalOpen){ setNewProductForm({...newProductForm, collection: e.target.value}); } else if(editingProduct) { setEditingProduct({...editingProduct, collection: e.target.value}); } }} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-[#111] text-white"><option value="">None</option><option value="mens">Mens Collection</option><option value="womens">Womens Collection</option><option value="smart-bags">Smart Bags</option></select></div></div><div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2"><div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee'
);

fs.writeFileSync('app/admin/dashboard/page.tsx', code);
