const fs = require('fs');

let sidebarTsx = fs.readFileSync('components/sidebar.tsx', 'utf8');

if (!sidebarTsx.includes('useProductContext')) {
    sidebarTsx = sidebarTsx.replace("import ModernButton from './modern-button'", "import ModernButton from './modern-button'\nimport { useProductContext } from '@/lib/product-context'");

    sidebarTsx = sidebarTsx.replace("export default function Sidebar() {", "export default function Sidebar() {\n  const { selectedTags, setSelectedTags } = useProductContext();\n\n  const handleTagToggle = (tag: string) => {\n    if (selectedTags.includes(tag)) {\n      setSelectedTags(selectedTags.filter(t => t !== tag));\n    } else {\n      setSelectedTags([...selectedTags, tag]);\n    }\n  };\n");
    
    const targetTagsBlock = `          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase mb-4">Category</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Leather</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Female</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>For Laptop Bag</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>High School</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>University</span>
              </label>
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase mb-4">Size</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Large</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Medium</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Small</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>XXL</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span>Backpack</span>
              </label>
            </div>
          </div>`;

    const injectTagsBlock = `          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase mb-4">Tags & Categories</h3>
            <div className="space-y-2 text-sm">
              {['Leather', 'Female', 'For Laptop Bag', 'High School', 'University', 'Large', 'Medium', 'Small', 'XXL', 'Backpack', 'girls', 'boys', 'office', 'trips'].map(tag => (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </div>`;

    // Try a strict clean whitespace replace because regex can be tricky with line endings
    const targetNorm = targetTagsBlock.replace(/\r\n/g, '\n');
    const sourceNorm = sidebarTsx.replace(/\r\n/g, '\n');
    if (sourceNorm.includes(targetNorm)) {
        sidebarTsx = sourceNorm.replace(targetNorm, injectTagsBlock);
        console.log('Replaced sidebar filters smoothly.');
    } else {
        console.log('Failed matching exact filter html. Using regex...');
        sidebarTsx = sourceNorm.replace(/\{\/\* Categories \*\/\}[\s\S]*?\{\/\* Size \*\/\}[\s\S]*?<\/div>\n          <\/div>/, injectTagsBlock);
    }
}

fs.writeFileSync('components/sidebar.tsx', sidebarTsx);
console.log('Patched Sidebar logic');

