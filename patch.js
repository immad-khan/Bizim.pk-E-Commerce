const fs = require('fs');
let content = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

const targetStr = `    const fetchSubscribers = async () => {
      try {
        const res = await fetch("http://localhost:5264/api/Subscribers");       
        if (res.ok) setSubscribers(await res.json());
      } catch(e) {}
    };
    fetchSubscribers();`;

let count = 0;
while(content.includes(targetStr)) {
    content = content.replace(targetStr, count === 0 ? targetStr : '');
    count++;
}
if (count > 0) {
    fs.writeFileSync('app/admin/dashboard/page.tsx', content);
    console.log('Fixed duplicate fetchSubscribers');
}
