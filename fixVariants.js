const fs = require('fs');

let page = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// Use a less restrictive regex to find the block for editing Product variants.
// Basically look for parseColors(editingProduct.availableColors)
let targetBlockStart = page.indexOf('parseColors(editingProduct.availableColors)');
if (targetBlockStart === -1) {
    console.log('Start not found');
} else {
    // find the start of the <div className="flex flex-col gap-2"> around there
    let beginning = page.lastIndexOf('Color Variants & Images', targetBlockStart);
    let endOfMap = page.indexOf('))}</div>', targetBlockStart); // end of mapping block

    if (beginning > -1 && endOfMap > -1) {
        let chunk = page.substring(beginning, endOfMap + 10);
        let replacedBlock = chunk
          .replace(/addColorVariant\(false\)/g, 'addColorVariant(true)')
          .replace(/handleColorChange\(false/g, 'handleColorChange(true')
          .replace(/handleColorImageUpload\(([^,]+),\s*false/g, 'handleColorImageUpload(, true')
          .replace(/removeColorVariant\(false/g, 'removeColorVariant(true');
          
        let newPage = page.substring(0, beginning) + replacedBlock + page.substring(endOfMap + 10);
        fs.writeFileSync('app/admin/dashboard/page.tsx', newPage, 'utf8');
        console.log('Fixed Edit form boolean flags for variants!');
    } else {
        console.log('Bounds not found');
    }
}
