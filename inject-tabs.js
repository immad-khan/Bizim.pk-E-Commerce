const fs = require("fs");
let f = fs.readFileSync("app/admin/dashboard/page.tsx", "utf8");

const tabs = `          {/* Customers Tab */}
          {activeTab === "customers" && (
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
                </div>
              ) : (
                <div className="neo-panel rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-175">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50 text-[10px] uppercase tracking-wider text-slate-400">
                          <th className="p-4 font-semibold">Customer</th>
                          <th className="p-4 font-semibold hidden sm:table-cell">Contact</th>
                          <th className="p-4 font-semibold hidden md:table-cell">Location</th>
                          <th className="p-4 font-semibold text-center">Total Orders</th>
                          <th className="p-4 font-semibold text-right">Lifetime Value</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {derivedCustomers.map((c, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                                  {c.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{c.name}</div>
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
                              {c.city}, {c.province}
                            </td>
                            <td className="p-4 text-center text-slate-300">
                              <div className="inline-flex items-center justify-center bg-slate-800 rounded px-2 py-1 text-xs font-mono border border-slate-700">
                                {c.totalOrders}
                              </div>
                            </td>
                            <td className="p-4 text-right font-medium text-white">
                              Rs {c.totalSpent.toLocaleString()}
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
          {activeTab === "messages" && (
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
                    <div key={message.id} className={\`neo-panel rounded-xl p-5 border-l-4 transition-all \${!message.isRead ? "border-l-orange-500 bg-slate-800/60 shadow-[0_4px_20px_rgba(234,88,12,0.1)]" : "border-l-slate-700 bg-slate-900/40 opacity-75"}\`}>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={\`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border \${!message.isRead ? "bg-orange-500/20 text-orange-500 border-orange-500/30" : "bg-slate-800 text-slate-500 border-slate-700"}\`}>
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className={\`font-bold \${!message.isRead ? "text-white" : "text-slate-300"}\`}>{message.name}</h4>
                            <div className="flex gap-3 text-xs mt-0.5">
                              <span className={!message.isRead ? "text-orange-400/80" : "text-slate-500"}>{message.email}</span>
                              {message.phone && <span className="text-slate-500 border-l border-slate-700 pl-3">{message.phone}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 mb-2">
                            {new Date(message.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
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
`;

f = f.replace("          {/* Edit Modal */}", tabs + "\n          {/* Edit Modal */}");

fs.writeFileSync("app/admin/dashboard/page.tsx", f, "utf8");
console.log("Success tabs injection");

