const fs = require('fs');
let c = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');
c = c.replace(/<\/button>\s*\)\)\}\s*\{\/\*\s*Main Content\s*\*\/\}/, "</button>\n              ))}\n            </div>\n          </aside>\n\n          {/* Main Content */}");
fs.writeFileSync('app/admin/dashboard/page.tsx', c, 'utf8');
console.log('Fixed');
