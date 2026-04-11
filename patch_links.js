const fs = require('fs');

let code = fs.readFileSync('components/collections-section.tsx', 'utf8');

code = code.replace(
  "href: '/collections?filter=female'",
  "href: '/collections?collection=womens'"
);

code = code.replace(
  "name: 'SMART BAGS',\n      image: BAG_IMAGE,\n      href: '/collections'",
  "name: 'SMART BAGS',\n      image: BAG_IMAGE,\n      href: '/collections?collection=smart-bags'"
);

code = code.replace(
  "name: 'MEN\\'S COLLECTION',\n      image: BAG_IMAGE,\n      href: '/collections'",
  "name: 'MEN\\'S COLLECTION',\n      image: BAG_IMAGE,\n      href: '/collections?collection=mens'"
);

fs.writeFileSync('components/collections-section.tsx', code);
