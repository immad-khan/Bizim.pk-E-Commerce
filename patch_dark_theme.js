const fs = require('fs');

const pagePath = 'app/admin/dashboard/page.tsx';
let data = fs.readFileSync(pagePath, 'utf8');

const oldCustomizationsTab = `          {/* Customizations Tab */}
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
                  className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:bg-orange-500"
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
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                        placeholder="/videos/hero-video.webm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">MP4 Video URL (Fallback)</label>
                      <input 
                        type="text" 
                        value={customizations.heroVideoMp4}
                        onChange={(e) => handleCustomizationChange('heroVideoMp4', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
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
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                        placeholder="https://example.com/image1.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Top Right Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageTopRight}
                        onChange={(e) => handleCustomizationChange('heroImageTopRight', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                        placeholder="https://example.com/image2.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bottom Right Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageBottomRight}
                        onChange={(e) => handleCustomizationChange('heroImageBottomRight', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                        placeholder="https://example.com/image3.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}`;

const newCustomizationsTab = `          {/* Customizations Tab */}
          {activeTab === 'customizations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Site Customizations</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage the hero videos and images displayed on the homepage.</p>
                </div>
                <button 
                  onClick={handleCustomizationSave}
                  disabled={isSavingCustomizations}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
                >
                  {isSavingCustomizations ? (
                     <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
                  ) : (
                     <><Check className="h-5 w-5" /> Save Changes</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                  <div className="border-b border-slate-800 px-6 py-4 bg-[#111]">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                       Hero Videos
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">WebM Video URL (Primary)</label>
                      <input 
                        type="text" 
                        value={customizations.heroVideoWebm}
                        onChange={(e) => handleCustomizationChange('heroVideoWebm', e.target.value)}
                        className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-slate-500" 
                        placeholder="/videos/hero-video.webm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">MP4 Video URL (Fallback)</label>
                      <input 
                        type="text" 
                        value={customizations.heroVideoMp4}
                        onChange={(e) => handleCustomizationChange('heroVideoMp4', e.target.value)}
                        className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-slate-500" 
                        placeholder="/videos/hero-video.mp4"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                  <div className="border-b border-slate-800 px-6 py-4 bg-[#111]">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                       Hero Images
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Left Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageLeft}
                        onChange={(e) => handleCustomizationChange('heroImageLeft', e.target.value)}
                        className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-slate-500" 
                        placeholder="https://example.com/image1.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Top Right Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageTopRight}
                        onChange={(e) => handleCustomizationChange('heroImageTopRight', e.target.value)}
                        className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-slate-500" 
                        placeholder="https://example.com/image2.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Bottom Right Image URL</label>
                      <input 
                        type="text" 
                        value={customizations.heroImageBottomRight}
                        onChange={(e) => handleCustomizationChange('heroImageBottomRight', e.target.value)}
                        className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-slate-500" 
                        placeholder="https://example.com/image3.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}`;

if (data.includes(oldCustomizationsTab)) {
    data = data.replace(oldCustomizationsTab, newCustomizationsTab);
    fs.writeFileSync(pagePath, data);
    console.log("Successfully replaced customizations tab matching exactly.");
} else {
    console.log("Couldn't exact match, attempting to replace parts.");
    data = data.replaceAll("bg-white p-6 rounded-2xl shadow-sm border border-slate-100", "bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-slate-800");
    data = data.replaceAll('h2 className="text-xl font-bold text-slate-900"', 'h2 className="text-xl font-bold text-white"');
    data = data.replaceAll('p className="text-slate-500 text-sm mt-1"', 'p className="text-slate-400 text-sm mt-1"');
    
    // Fallback button replacement
    data = data.replaceAll(
      'className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:bg-orange-500"',
      'className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"'
    );
    
    data = data.replaceAll('bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden', 'bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-800 overflow-hidden');
    data = data.replaceAll('border-b border-slate-100 px-6 py-4 bg-slate-50/50', 'border-b border-slate-800 px-6 py-4 bg-[#111]');
    data = data.replaceAll('h3 className="font-semibold text-slate-800 flex items-center gap-2"', 'h3 className="font-semibold text-white flex items-center gap-2"');
    data = data.replaceAll('label className="block text-sm font-medium text-slate-700 mb-1"', 'label className="block text-sm font-medium text-slate-300 mb-1"');
    data = data.replaceAll(
        'className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"',
        'className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 placeholder-slate-500"'
    );
    fs.writeFileSync(pagePath, data);
}
