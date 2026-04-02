const fs = require('fs');
let code = fs.readFileSync('components/header.tsx', 'utf8');

code = code.replace(/text-muted-foreground/g, 'text-slate-300');
code = code.replace(/border-b border-border bg-background/g, 'border-b border-slate-800 bg-[#060b14]');
code = code.replace(/hover:bg-secondary/g, 'hover:bg-slate-800');
code = code.replace(/text-foreground/g, 'text-slate-200');
code = code.replace(/text-slate-600/g, 'text-slate-200');

fs.writeFileSync('components/header.tsx', code, 'utf8');
console.log('Fixed header');
