const fs = require('fs');

const pagePath = 'app/admin/dashboard/page.tsx';
let data = fs.readFileSync(pagePath, 'utf8');

// 1. Add Interface
if (!data.includes('interface SiteCustomization')) {
    const interfaceStr = `
interface SiteCustomization {
  heroVideoWebm: string;
  heroVideoMp4: string;
  heroImageLeft: string;
  heroImageTopRight: string;
  heroImageBottomRight: string;
}
`;
    data = data.replace('interface CustomerOrder {', interfaceStr + '\ninterface CustomerOrder {');
}

// 2. Add State
if (!data.includes('const [customizations')) {
    const stateStr = `
  const [customizations, setCustomizations] = useState<SiteCustomization>({
    heroVideoWebm: '',
    heroVideoMp4: '',
    heroImageLeft: '',
    heroImageTopRight: '',
    heroImageBottomRight: ''
  })
  const [isSavingCustomizations, setIsSavingCustomizations] = useState(false)
`;
    data = data.replace('const [isLoading, setIsLoading] = useState(true)', 'const [isLoading, setIsLoading] = useState(true)' + stateStr);
}

// 3. Add fetch logic
if (!data.includes('fetchCustomizations()')) {
    const fetchStr = `
    const fetchCustomizations = async () => {
      try {
        const res = await fetch(\`\${API_BASE_URL}/api/Customizations\`);
        if (res.ok) setCustomizations(await res.json());
      } catch(e) {}
    }
    fetchCustomizations()
`;
    data = data.replace('fetchMessages()', 'fetchMessages()\n' + fetchStr);
}

// 4. Add Save Logic
if (!data.includes('handleCustomizationSave')) {
    const saveLogicStr = `
  const handleCustomizationChange = (field: keyof SiteCustomization, value: string) => {
    setCustomizations(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomizationSave = async () => {
    setIsSavingCustomizations(true)
    try {
      await fetch(\`\${API_BASE_URL}/api/Customizations\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customizations)
      })
      alert('Customizations saved successfully!')
    } catch(e) {
      alert('Failed to save customizations.')
    } finally {
      setIsSavingCustomizations(false)
    }
  }
`;
    data = data.replace('// Modals for editing/adding', saveLogicStr + '\n  // Modals for editing/adding');
}

// 5. Add Customizations Tab View
if (!data.includes('activeTab === \'customizations\'')) {
    const viewStr = `
          {/* Customizations Tab */}
          {activeTab === 'customizations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Site Customizations</h2>
                  <p className="text-slate-500 text-sm mt-1">Manage the hero videos and images displayed on the homepage.</p>
                </div>
                <button 
                  onClick={handleCustomizationSave}
                  disabled={isSavingCustomizations}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-200"
                >
                  {isSavingCustomizations ? (
                     <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
                  ) : (
                     <><Check className="h-5 w-5" /> Save Changes</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                       Hero Videos
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">WebM Video URL (Primary)</label>
                      <input 
                        type="text" 
                        value={customizations.heroVideoWebm}
                        onChange={(e) => handleCustomizationChange('heroVideoWebm', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        placeholder="/videos/hero-video.webm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">MP4 Video URL (Fallback)</label>
                      <input 
                        type="text" 
                        value={customizations.heroVideoMp4}
                        onChange={(e) => handleCustomizationChange('heroVideoMp4', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        placeholder="/videos/hero-video.mp4"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                       Hero Images
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Left Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageLeft}
                        onChange={(e) => handleCustomizationChange('heroImageLeft', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        placeholder="https://example.com/image1.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Top Right Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageTopRight}
                        onChange={(e) => handleCustomizationChange('heroImageTopRight', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        placeholder="https://example.com/image2.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bottom Right Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageBottomRight}
                        onChange={(e) => handleCustomizationChange('heroImageBottomRight', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        placeholder="https://example.com/image3.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
`;
    data = data.replace('{/* Messages Tab */}', viewStr + '\n          {/* Messages Tab */}');
}

fs.writeFileSync(pagePath, data);
