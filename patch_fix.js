const fs = require('fs');

let content = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

const target = `                        <textarea
                            value={newProductForm.description || ''}
                            onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            rows={3}
                          />
                        </div>
                        </div>
                        <div>`;

const fixed = `                        <textarea
                            value={newProductForm.description || ''}
                            onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            rows={3}
                          />
                        </div>
                        <div>`;

if (content.includes(target)) {
    content = content.replace(target, fixed);
    console.log("Fixed double </div> in new form!");
}

const target2 = `                            <textarea
                              value={editingProduct.description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                              rows={3}
                            />
                          </div>
                          </div>
                          <div>`;

const fixed2 = `                            <textarea
                              value={editingProduct.description || ''}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                              rows={3}
                            />
                          </div>
                          <div>`;

if (content.includes(target2)) {
    content = content.replace(target2, fixed2);
    console.log("Fixed double </div> in edit form!");
}

fs.writeFileSync('app/admin/dashboard/page.tsx', content);

