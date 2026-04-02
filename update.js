const fs = require('fs');

// Fix dashboard page
let p = 'app/admin/dashboard/page.tsx';
let c = fs.readFileSync(p, 'utf8');

// Filter orders inside Orders Tab
c = c.replace(/\{orders\.length\} order\(s\) placed/, '{orders.filter(o => o.status !== "Completed").length} active order(s)');
c = c.replace(/\{orders\.length === 0 \? \(/, '{orders.filter(o => o.status !== "Completed").length === 0 ? (');

// It's {orders.map((order) => (
//   <React.Fragment key={order.orderId}>
c = c.replace(/\{orders\.map\(\(order\) => \(/g, '{orders.filter(o => o.status !== "Completed").map((order) => (');

// Filter derivedCustomers
c = c.replace(/orders\.reduce\(\(acc, order\) => \{/g, 'orders.filter(o => o.status === "Completed").reduce((acc, order) => {');

// Remove duplicate Customer Tab
let s1 = c.indexOf('{/* Customers Tab */}');
if (s1 !== -1) {
  let temp = c.substring(s1 + 10);
  let s2 = temp.indexOf('{/* Customers Tab */}');
  if (s2 !== -1) {
    let duplicateStart = s1 + 10 + s2;
    // from duplicateStart, find the closest edit modal after it
    let endIdx = c.indexOf('{/* Edit Modal */}', duplicateStart);
    if (endIdx !== -1) {
      c = c.substring(0, duplicateStart) + c.substring(endIdx);
      console.log('Removed duplicate tabs');
    }
  }
}

fs.writeFileSync(p, c, 'utf8');

// Fix Sidebar
let sp = 'components/sidebar.tsx';
if (fs.existsSync(sp)) {
  let sc = fs.readFileSync(sp, 'utf8');
  // Remove object arrays for Authentication, UI elements, Tables
  const removeItems = ['Authentication', 'UI Elements', 'Tables'];
  for (let it of removeItems) {
    let regex = new RegExp("\\s*\\{\\s*name:\\s*['\"]" + it + "['\"][\\s\\S]*?\\}(?=,|\\w)", "g");
    sc = sc.replace(regex, '');
  }
  // There might be lingering commas if they were at the end of the list. We'll handle it nicely by just removing them via Regex.
  sc = sc.replace(/,\s*]/g, '\n]');
  fs.writeFileSync(sp, sc, 'utf8');
  console.log('Fixed sidebar');
}

