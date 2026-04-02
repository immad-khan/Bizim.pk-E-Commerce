const fs = require('fs');

let productContextTsx = fs.readFileSync('lib/product-context.tsx', 'utf8');

const targetState = '  const [searchQuery, setSearchQuery] = useState(\'\')';
const injectState = '  const [selectedTags, setSelectedTags] = useState<string[]>([]);\n' + targetState;

if (!productContextTsx.includes('const [selectedTags')) {
    productContextTsx = productContextTsx.replace(targetState, injectState);
}

const targetContextBase = '  setSearchQuery: (query: string) => void\n}';
const injectContextBase = '  setSearchQuery: (query: string) => void\n  selectedTags: string[]\n  setSelectedTags: (tags: string[]) => void\n}';

if (!productContextTsx.includes('selectedTags: string[]')) {
    productContextTsx = productContextTsx.replace(targetContextBase, injectContextBase);
}

const targetValObj = '        setSearchQuery,\n        addProduct,';
const injectValObj = '        setSearchQuery,\n        selectedTags,\n        setSelectedTags,\n        addProduct,';

if(!productContextTsx.includes('selectedTags,')) {
    productContextTsx = productContextTsx.replace(targetValObj, injectValObj);
}


const filterTarget = `    // Filter by search query
    if (searchQuery) {`;
const filterInject = `    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.tags) return false;
        const pTags = p.tags.split(',').map(t => t.trim().toLowerCase());
        return selectedTags.some(stag => pTags.includes(stag.toLowerCase()));
      });
    }

    // Filter by search query
    if (searchQuery) {`;

if (!productContextTsx.includes('// Filter by tags')) {
    productContextTsx = productContextTsx.replace(filterTarget, filterInject);
}

fs.writeFileSync('lib/product-context.tsx', productContextTsx);
console.log('patched lib context');

