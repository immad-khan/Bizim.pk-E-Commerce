const fs = require('fs');

const pagePath = 'app/admin/dashboard/page.tsx';
let data = fs.readFileSync(pagePath, 'utf8');

// Replace indigo button with black and orange
data = data.replace(
  'bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-200',
  'bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:bg-orange-500'
);

// Replace indigo rings with orange rings
data = data.replaceAll(
  'focus:ring-indigo-500/20 focus:border-indigo-500',
  'focus:ring-orange-500/20 focus:border-orange-500'
);

data = data.replaceAll(
  'text-indigo-600',
  'text-orange-500'
);

fs.writeFileSync(pagePath, data);
