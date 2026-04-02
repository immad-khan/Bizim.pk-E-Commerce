const fs = require('fs');

let pageTsx = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

const editNameBlock = `<label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                            <input
                              type="text"
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            />
                          </div>`;

const editDescBlock = `<label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                            <input
                              type="text"
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Description</label>
                            <textarea
                              value={editingProduct.description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                              rows={3}
                            />
                          </div>`;

const addNameBlock = `<label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                        <input
                          type="text"
                          value={newProductForm.name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                          className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                        />
                      </div>`;

const addDescBlock = `<label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                        <input
                          type="text"
                          value={newProductForm.name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                          className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Description</label>
                        <textarea
                          value={newProductForm.description || ''}
                          onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                          className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          rows={3}
                        />
                      </div>`;

// Normalize logic for replacement due to whitespace
pageTsx = pageTsx.replace(/<label className="block text-xs text-orange-400 mb-1\.5 uppercase tracking-wider">Product Name<\/label>[\s\S]*?onChange=\{\(e\) => setEditingProduct\(\{ \.\.\.editingProduct, name: e\.target\.value \}\)\}[\s\S]*?<\/div>/, editDescBlock);

pageTsx = pageTsx.replace(/<label className="block text-xs text-orange-400 mb-1\.5 uppercase tracking-wider">Product Name<\/label>[\s\S]*?onChange=\{\(e\) => setNewProductForm\(\{ \.\.\.newProductForm, name: e\.target\.value \}\)\}[\s\S]*?<\/div>/, addDescBlock);

const newProductFormOriginal = "name: '', price: 0, originalPrice: 0, rating: 5, reviews: 0, badge: null,";
const newProductFormUpdated = "name: '', description: '', price: 0, originalPrice: 0, rating: 5, reviews: 0, badge: null,";

if (pageTsx.includes(newProductFormOriginal)) {
    pageTsx = pageTsx.replace(newProductFormOriginal, newProductFormUpdated);
}

fs.writeFileSync('app/admin/dashboard/page.tsx', pageTsx);
console.log('patched Add/Edit Modals');

