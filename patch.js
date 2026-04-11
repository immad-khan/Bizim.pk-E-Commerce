const fs = require('fs');
let code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

code = code.replace(/<div className="grid grid-cols-1 border-t border-orange-900\/30 pt-4 mt-2">                    <div>/g,
  '<div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2 mb-4"><div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label><select value={editingProduct?.collection || newProductForm?.collection || ""} onChange={(e) => { if(isAddModalOpen){ setNewProductForm({...newProductForm, collection: e.target.value}); } else { setEditingProduct({...editingProduct, collection: e.target.value}); } }} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-black border border-orange-900/30 text-white appearance-none"><option value="">None</option><option value="mens">Men\\'s Collection</option><option value="womens">Women\\'s Collection</option><option value="smart-bags">Smart Bags</option></select></div></div><div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2"><div>'
);

fs.writeFileSync('app/admin/dashboard/page.tsx', code);
