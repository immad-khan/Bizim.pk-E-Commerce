const fs = require('fs');

let page = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');
const oldPage = fs.readFileSync('recovered_page.tsx', 'utf8');

const addModalStartIndex = oldPage.indexOf('{/* Add Modal */}');
const addModalEndIndex = oldPage.indexOf('</main>', addModalStartIndex);
let addModalText = oldPage.substring(addModalStartIndex, addModalEndIndex);

const idx = addModalText.lastIndexOf(')}');
addModalText = addModalText.substring(0, idx + 2) + '\n';

const editModalIndex = page.indexOf('{/* Edit Modal */}');
const editModalEndIndex = page.indexOf('</main>', editModalIndex);

if (editModalEndIndex !== -1) {
    page = page.substring(0, editModalEndIndex - 11) + addModalText + page.substring(editModalEndIndex - 11);
    
    let beforeEdit = page.substring(0, editModalIndex);
    let editModal = page.substring(editModalIndex, editModalIndex + page.substring(editModalIndex).indexOf('{/* Add Modal */}'));
    let afterEdit = page.substring(editModalIndex + editModal.length);
    
    editModal = editModal.replace(/newProductForm\./g, 'editingProduct.');
    editModal = editModal.replace(/setNewProductForm/g, 'setEditingProduct');
    editModal = editModal.replace(/onClick=\{handleCreateProduct\}/g, 'onClick={handleSaveEdit}');
    editModal = editModal.replace(/Create Product/g, 'Save Changes');
    
    page = beforeEdit + editModal + afterEdit;
    
    fs.writeFileSync('app/admin/dashboard/page.tsx', page, 'utf8');
    console.log('Restored Add Modal successfully and fixed Edit Modal!');
} else {
    console.log('Could not find injection point.');
}
