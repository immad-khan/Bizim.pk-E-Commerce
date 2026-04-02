const fs = require('fs');
let content = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

const target1 = '    const fetchOrders = async () => {';
const inject1 = '    const fetchSubscribers = async () => {\n      try {\n        const res = await fetch("http://localhost:5264/api/Subscribers");\n        if (res.ok) setSubscribers(await res.json());\n      } catch(e) {}\n    };\n    fetchSubscribers();\n' + target1;

if (content.includes(target1)) {
    content = content.replace(target1, inject1);
    console.log('Injected fetchSubscribers()');
}

const target3 = '          {/* Messages Tab */}';
const inject3 = `          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Newsletter Subscribers</h2>
                  <p className="text-xs text-slate-400">{subscribers.length} total subscriber(s)</p>
                </div>
              </div>

              {subscribers.length === 0 ? (
                <div className="neo-panel rounded-xl p-12 text-center">
                  <Send className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No subscribers yet</p>
                </div>
              ) : (
                <div className="neo-panel rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-175">
                      <thead>
                        <tr className="border-b border-orange-900/30 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
                          <th className="p-4 font-medium">Email</th>
                          <th className="p-4 font-medium text-right">Subscribed At</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-slate-800">
                        {subscribers.map((sub, i) => (
                          <tr key={sub.id || i} className="group hover:bg-slate-800/30 transition-colors">
                            <td className="p-4 font-medium text-white">{sub.email}</td>
                            <td className="p-4 text-right text-slate-400 text-xs">
                              {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'Unknown'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

` + target3;

let replaced = false;
if (content.includes(target3)) {
    content = content.replace(target3, inject3);
    console.log('Injected Subscribers JSX');
    replaced = true;
} else {
    const normTarget3 = target3.replace(/\r\n/g, '\n');
    const normContent = content.replace(/\r\n/g, '\n');
    if (normContent.includes(normTarget3)) {
        content = normContent.replace(normTarget3, inject3);
        console.log('Injected Subscribers JSX (LF)');
        replaced = true;
    }
}

if(replaced) {
    fs.writeFileSync('app/admin/dashboard/page.tsx', content);
}
