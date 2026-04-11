const fs = require('fs');

let page = fs.readFileSync('app/collections/page.tsx', 'utf8');

if (!page.includes("Suspense")) {
    page = page.replace("import { useState } from 'react'", "import { useState, Suspense } from 'react'");
    page = page.replace("export default function CollectionsPage() {", "function CollectionsContent() {");
    
    page = page + "\n\nexport default function CollectionsPage() {\n  return (\n    <Suspense fallback={<div className=\"p-8 text-center text-orange-400\">Loading...</div>}>\n      <CollectionsContent />\n    </Suspense>\n  );\n}\n";

    fs.writeFileSync('app/collections/page.tsx', page);
}
