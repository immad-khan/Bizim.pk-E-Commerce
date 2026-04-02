const fs = require('fs');

let pageTsx = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

const targetStr = `          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (`;

let count = 0;
while(pageTsx.indexOf(targetStr) !== pageTsx.lastIndexOf(targetStr)) {
    // replace the second occurrence
    const firstIdx = pageTsx.indexOf(targetStr);
    const secondIdx = pageTsx.indexOf(targetStr, firstIdx + 1);
    
    // Find the end of the div for the tab. It ends right before "          {/*" or end of file
    const endIdx = pageTsx.indexOf('          {/*', secondIdx + 1);
    if(endIdx !== -1) {
        pageTsx = pageTsx.substring(0, secondIdx) + pageTsx.substring(endIdx);
    } else {
        break; // safety
    }
}

fs.writeFileSync('app/admin/dashboard/page.tsx', pageTsx);
console.log("Removed duplicated tab");

