const fs = require('fs');
let page = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// Fix the Edit Modal bug
page = page.split('setEditingProduct({ ...newProductForm,').join('setEditingProduct({ ...editingProduct,');

// Also add shipmentFee input to both modals
// Add Modal: Look for price/quantity row
const splitMarker1 =                         <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Price (PKR)</label>
                            <input
                              type="number"
                              value={newProductForm.price}
                              onChange={(e) => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                            <input
                              type="number"
                              value={newProductForm.quantity}
                              onChange={(e) => setNewProductForm({ ...newProductForm, quantity: parseInt(e.target.value) })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </div>;

const splitMarker1Replace =                         <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Price (PKR)</label>
                            <input
                              type="number"
                              value={newProductForm.price}
                              onChange={(e) => setNewProductForm({ ...newProductForm, price: parseFloat(e.target.value) })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                            <input
                              type="number"
                              value={newProductForm.quantity}
                              onChange={(e) => setNewProductForm({ ...newProductForm, quantity: parseInt(e.target.value) })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee</label>
                            <input
                              type="number"
                              value={newProductForm.shipmentFee || 0}
                              onChange={(e) => setNewProductForm({ ...newProductForm, shipmentFee: parseFloat(e.target.value) })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </div>;

if(page.includes(splitMarker1)) {
    page = page.replace(splitMarker1, splitMarker1Replace);
}

const splitMarker2 =                       <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Price (PKR)</label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                          <input
                            type="number"
                            value={editingProduct.quantity}
                            onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>;

const splitMarker2Replace =                       <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Price (PKR)</label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                          <input
                            type="number"
                            value={editingProduct.quantity}
                            onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee</label>
                          <input
                            type="number"
                            value={editingProduct.shipmentFee || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, shipmentFee: parseFloat(e.target.value) })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                      </div>;

if(page.includes(splitMarker2)) {
    page = page.replace(splitMarker2, splitMarker2Replace);
}

fs.writeFileSync('app/admin/dashboard/page.tsx', page, 'utf8');
console.log('Completed patching Add and Edit modals for bindings and Shipment Fee');
