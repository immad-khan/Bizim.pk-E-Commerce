const fs = require('fs');

let page = fs.readFileSync('app/admin/dashboard/page.tsx', 'utf8');

// 1. Add Interface
if (!page.includes('export interface ContactMessage')) {
  page = page.replace('export interface Product {', \export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Product {\);
}

// 2. Add State & Derived State
if (!page.includes('const [messages, setMessages]')) {
  page = page.replace('const [orders, setOrders] = useState<CustomerOrder[]>([])', \const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])\);
}

// 3. fetchMessages
if (!page.includes('fetchMessages()')) {
  page = page.replace('const fetchOrders = async () => {', \const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5264/api/ContactMessages');
      if (res.ok) setMessages(await res.json());
    } catch (e) { console.error('Failed to fetch messages', e); }
  }

  const markMessageAsRead = async (id: string) => {
    try {
      const res = await fetch(\\\http://localhost:5264/api/ContactMessages/$\{id}/read\\\, { method: 'PUT' });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
      }
    } catch (e) {
      console.error('Failed', e);
    }
  }

  const derivedCustomers = React.useMemo(() => {
    const map = new Map<string, any>();
    orders.forEach(o => {
      const key = o.customer.email || o.customer.phone;
      if (!map.has(key)) {
        map.set(key, { ...o.customer, id: key, totalOrders: 0, totalSpent: 0 });
      }
      const c = map.get(key);
      c.totalOrders += 1;
      c.totalSpent += o.total;
    });
    return Array.from(map.values());
  }, [orders]);

  const fetchOrders = async () => {\);

  
  page = page.replace('fetchOrders()', \etchOrders();\\n    fetchMessages();\);
}

// 4. Icons
if (!page.includes('MessageSquare')) {
  page = page.replace('import { Edit', \import { MessageSquare, CheckCircle, Edit\);
}

// 5. Build Tabs UI
if (!page.includes('activeTab === \\'customers\\'')) {
  const target = \                )}
              </div>
            )}

            {/* Edit Modal */}\;
            
  const newContent = \                )}
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Customer Database</h2>
                    <p className="text-xs text-slate-400">{derivedCustomers.length} unique customer(s)</p>
                  </div>
                </div>

                {derivedCustomers.length === 0 ? (
                  <div className="neo-panel rounded-xl p-12 text-center">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No customers found</p>
                    <p className="text-slate-600 text-xs mt-1">Customers will appear here when orders are placed</p>
                  </div>
                ) : (
                  <div className="neo-panel rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-175">
                        <thead>
                          <tr className="border-b border-orange-900/30 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
                            <th className="p-4 font-medium min-w-[200px]">Customer</th>
                            <th className="p-4 font-medium hidden sm:table-cell">Contact</th>
                            <th className="p-4 font-medium hidden md:table-cell">Location</th>
                            <th className="p-4 font-medium text-center">Orders</th>
                            <th className="p-4 font-medium text-right">Total Spent</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-800">
                          {derivedCustomers.map((c) => (
                            <tr key={c.id} className="group hover:bg-slate-800/30 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold border border-orange-500/30">
                                    {(c.fullName || c.name || 'C').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-white">{c.fullName || c.name}</div>
                                    <div className="text-xs text-slate-400 sm:hidden mt-0.5">{c.phone}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 hidden sm:table-cell text-slate-300">
                                <div className="flex flex-col gap-1">
                                  {c.phone && <div className="text-xs">{c.phone}</div>}
                                  {c.email && <div className="text-xs text-slate-500">{c.email}</div>}
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell text-slate-400 capitalize text-xs">
                                {c.city}
                              </td>
                              <td className="p-4 text-center text-slate-300">
                                <div className="inline-flex items-center justify-center bg-slate-800 rounded px-2 py-1 text-xs font-mono border border-slate-700">
                                  {c.totalOrders}
                                </div>
                              </td>
                              <td className="p-4 text-right font-medium text-white">
                                Rs. {c.totalSpent.toLocaleString()}
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

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Messages Inbox</h2>
                    <p className="text-xs text-slate-400">{messages.filter(m => !m.isRead).length} unread message(s)</p>
                  </div>
                </div>

                {messages.length === 0 ? (
                  <div className="neo-panel rounded-xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No messages received yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {messages.map((message) => (
                      <div key={message.id} className={\
eo-panel rounded-xl p-5 border-l-4 transition-all hover:-translate-y-1 \\}>
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={\w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border \\}>
                              {(message.name || 'M').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className={\ont-bold \\}>{message.name}</h4>
                              <div className="flex gap-3 text-xs mt-0.5">
                                <span className={!message.isRead ? 'text-orange-400/80' : 'text-slate-500'}>{message.email}</span>
                                {message.phone && <span className="text-slate-500 border-l border-slate-700 pl-3">{message.phone}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500 mb-2">
                              {new Date(message.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {!message.isRead && (
                              <button onClick={() => markMessageAsRead(message.id)} className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-1 flex items-center gap-1 rounded hover:bg-orange-500 hover:text-white transition-colors">
                                <CheckCircle className="w-3 h-3" /> Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                          {message.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Edit Modal */}\;
            
  if (page.includes(target)) {
    page = page.replace(target, newContent);
  } else if (page.includes(target.replace(/\\n/g, '\\r\\n'))) {
    page = page.replace(target.replace(/\\n/g, '\\r\\n'), newContent);
  } else {
    console.log("Could not find the target string UI");
  }
}

fs.writeFileSync('app/admin/dashboard/page.tsx', page, 'utf8');
console.log('Injections fully written to page.tsx');
