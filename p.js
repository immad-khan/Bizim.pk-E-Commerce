const fs = require('fs');

let page = fs.readFileSync('app/collections/page.tsx', 'utf8');
if (!page.includes("useSearchParams")) {
    page = page.replace(
      "import { useState } from 'react'",
      "import { useState } from 'react'\nimport { useSearchParams } from 'next/navigation'"
    );

    page = page.replace(
      "const { products, maxPrice, selectedTags, searchQuery, setSearchQuery } = useProductContext()",
      "const { products, maxPrice, selectedTags, searchQuery, setSearchQuery } = useProductContext()\n  const searchParams = useSearchParams()\n  const collectionFilter = searchParams.get('collection')"
    );

    page = page.replace(
      "const matchesTags = selectedTags.length === 0 || selectedTags.some(tag =>",
      "const matchesCollection = !collectionFilter || (p.collection && p.collection.toLowerCase() === collectionFilter.toLowerCase())\n\n    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag =>"
    );

    page = page.replace(
      "return matchesPrice && matchesTags && matchesSearch;",
      "return matchesPrice && matchesTags && matchesSearch && matchesCollection;"
    );

    page = page.replace(
      "<h1>Collections</h1>",
      "<h1 className=\"text-3xl md:text-4xl font-heading font-bold text-foreground mb-2\">{collectionFilter ? collectionFilter.replace('-', ' ').toUpperCase() : 'Collections'}</h1>"
    );

    fs.writeFileSync('app/collections/page.tsx', page);
    console.log('patched collections');
}
