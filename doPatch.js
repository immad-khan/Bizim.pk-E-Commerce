const fs = require('fs');

let code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// Instead of string replacement, we can use regex
let editRegex = /className="neo-input w-full rounded-lg px-3 py-2 text-sm disabled:opacity-50"\s*\/>\s*<\/div>\s*<\/div>/g;

let parts = code.split(editRegex);

if (parts.length === 3) {
    let suffix1 = \className="neo-input w-full rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2">
                    <div>
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>
                      <input
                        type="number"
                        value={editingProduct.shipmentFee || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shipmentFee: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                        placeholder="0 for Free Shipping"
                      />
                    </div>
                  </div>\;

    let suffix2 = \className="neo-input w-full rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2">
                    <div>
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>
                      <input
                        type="number"
                        value={newProductForm.shipmentFee || 0}
                        onChange={(e) => setNewProductForm({ ...newProductForm, shipmentFee: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                        placeholder="0 for Free Shipping"
                      />
                    </div>
                  </div>\;

    code = parts[0] + suffix1 + parts[1] + suffix2 + parts[2];
    fs.writeFileSync('app/admin/dashboard/page.tsx', code, 'utf8');
    console.log('patched');
}
