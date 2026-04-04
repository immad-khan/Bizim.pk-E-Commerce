const fs = require('fs'); let p = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8'); p = p.replace(/\n}\n\s*<\/main>/, '\n        </main>'); fs.writeFileSync('app/admin/dashboard/page.tsx', p);
