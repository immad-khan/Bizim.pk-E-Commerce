const fs = require('fs');

let file = 'app/admin/dashboard/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// Insert the collection dropdown perfectly matching the input style into the New Product Form
const newProdLabel = <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>;
const newCollectionInputAdd = <div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label>
<select value={newProductForm.collection || ''} onChange={(e) => setNewProductForm({ ...newProductForm, collection: e.target.value })} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-black text-white appearance-none">
  <option value="">None</option>
  <option value="mens">Men's Collection</option>
  <option value="womens">Women's Collection</option>
  <option value="smart-bags">Smart Bags</option>
</select></div>
;

if(code.indexOf(newCollectionInputAdd) === -1) {
    code = code.replace(newProdLabel, newCollectionInputAdd + newProdLabel);
}

// Ensure the default shape of newProductForm has collection: ''
code = code.replace(/name: '',\s*price: 0,/, "name: '',\n      collection: '',\n      price: 0,");

// Update Edit Form: look for Shipment Fee in the Edit render block and prepend to it
const editProdLabel = <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>;
const editCollectionInputAdd = <div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label>
<select value={editingProduct?.collection || ''} onChange={(e) => setEditingProduct(prev => prev ? { ...prev, collection: e.target.value } : null)} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-black text-white appearance-none">
  <option value="">None</option>
  <option value="mens">Men's Collection</option>
  <option value="womens">Women's Collection</option>
  <option value="smart-bags">Smart Bags</option>
</select></div>
;

// we have to replace the occurrence that specifically deals with editingProduct.
// A simpler way: just split by the label, but we must target exactly the ones in the Add / Edit sections.
try {
   let parts = code.split(editProdLabel);
   if (parts.length === 3) {
      // 0 = Add form, 1 = Edit form
      // Actually we already replaced the first one. Let's do it carefully... Wait, if I already replaced the first one, the original editProdLabel shouldn't match the new added code directly, but the second occurrence remains.
      let newSplit = code.split(editProdLabel);
      if(newSplit.length === 2) {
         // This means we have 1 occurrence left, the one for edit form!
         code = newSplit[0] + editCollectionInputAdd + editProdLabel + newSplit[1];
      }
   }
} catch(e) {}

fs.writeFileSync(file, code);
console.log('Patched Page.tsx modals');

