const fs = require('fs');
const content = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// Find where "Unterminated regexp literal" could come from
const match = content.match(/\/[^\/]+?\//g);
// Usually this happens if we left an unescaped / inside JSX without {} or similar
console.log('Line 1421 surrounding code:', content.split('\n').slice(1415, 1425).join('\n'));
