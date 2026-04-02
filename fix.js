const fs = require('fs');
let code = fs.readFileSync('app/contact/page.tsx', 'utf8');
code = code.replace("Subject: formData.subject || 'General Inquiry' || 'General Inquiry',", "Subject: formData.subject || 'General Inquiry',");
fs.writeFileSync('app/contact/page.tsx', code, 'utf8');
console.log('Fixed');
