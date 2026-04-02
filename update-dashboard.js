const fs = require('fs');
let code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// 1. Remove duplicate Customers Tab - we find the first occurrence and the second occurrence.
let firstCustomerIdx = code.indexOf('{/* Customers Tab */}');
let firstMessagesIdx = code.indexOf('{/* Messages Tab */}');
let secondCustomerIdx = code.indexOf('{/* Customers Tab */}', firstCustomerIdx + 10);
let editModalIdx = code.lastIndexOf('{/* Edit Modal */}');

if (firstCustomerIdx !== -1 && secondCustomerIdx !== -1) {
  // It means it was duplicated. Let's slice everything after firstMessagesIdx to the last Edit Modal out if it contains Customers Tab again
  code = code.substring(0, secondCustomerIdx) + code.substring(editModalIdx);
  fs.writeFileSync('app/admin/dashboard/page.tsx', code, 'utf8');
  console.log('Removed duplicate tabs');
}

// Now let's implement the logic fix for CRM / Orders filtering:
code = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// A. "orders" tab filters out 'Completed'
code = code.replace(/\{orders\.length\} order\(s\) placed/, '{orders.filter(o => o.status !== \\'Completed\\').length} active order(s)');
code = code.replace(/\{orders\.length === 0 \? \(/, '{orders.filter(o => o.status !== \\'Completed\\').length === 0 ? (');
// Replace orders.map inside "orders" tab
// We need to carefully replace the inline rendering just for the orders tab, not everywhere.
// {orders.map((order) => ( -> {orders.filter(o => o.status !== 'Completed').map((order) => (
// Since it appears twice (once in 'orders' tab, once in ecentOrders calculation but recentOrders doesn't use orders.map), we can do string replace:
code = code.replace(/\{orders\.map\(\(order\) => \(\n\s*<React\.Fragment key=\{order\.orderId\}>/g, '{orders.filter(o => o.status !== \\'Completed\\').map((order) => (\n                            <React.Fragment key={order.orderId}>');

// B. "derivedCustomers" logic should ONLY consider Completed orders.
code = code.replace(/orders\.reduce\(\(acc, order\) => \{/g, 'orders.filter(o => o.status === \\'Completed\\').reduce((acc, order) => {');

// C. Remove UI Elements, Tables, and Authentication from sidebar.
const sidebarPath = 'components/sidebar.tsx';
if (fs.existsSync(sidebarPath)) {
  let sidebarCode = fs.readFileSync(sidebarPath, 'utf8');
  sidebarCode = sidebarCode.replace(/\{\s*name:\s*'Authentication'[\s\S]*?\},?/g, '');
  sidebarCode = sidebarCode.replace(/\{\s*name:\s*'UI Elements'[\s\S]*?\},?/g, '');
  sidebarCode = sidebarCode.replace(/\{\s*name:\s*'Tables'[\s\S]*?\},?/g, '');
  fs.writeFileSync(sidebarPath, sidebarCode, 'utf8');
  console.log('Updated sidebar');
}

fs.writeFileSync('app/admin/dashboard/page.tsx', code, 'utf8');
console.log('Done patching frontend');
