const fs = require('fs');

const pagePath = 'd:/Desktop/Bizim.pk/app/admin/dashboard/page.tsx';
let data = fs.readFileSync(pagePath, 'utf8');

const oldStr = `<Download className="w-3 h-3" /> Download PDF
                                            </button>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.orderId) }}`;

const newStr = `<Download className="w-3 h-3" /> Download PDF
                                            </button>
                                            
                                            {!order.isBookedAtPostEx ? (
                                              <button
                                                onClick={(e) => { e.stopPropagation(); bookAtPostEx(order.orderId) }}
                                                className="text-[10px] flex items-center gap-1.5 px-2 py-1 rounded bg-[#107f61]/20 text-[#107f61] font-bold border border-[#107f61]/50 hover:bg-[#107f61]/30 transition"
                                                title="Book this order at PostEx"
                                              >
                                                Book at PostEx
                                              </button>
                                            ) : (
                                              <a
                                                href={\`https://merchant.postex.pk/?cn=\${order.trackingNumber}\`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-[10px] flex items-center gap-1.5 px-2 py-1 rounded font-bold transition"
                                                style={{ backgroundColor: '#107f61', color: 'white' }}
                                                title="Track Order"
                                              >
                                                Track: {order.trackingNumber}
                                              </a>
                                            )}

                                            <button
                                              onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.orderId) }}`;

let updated = data.replace(oldStr, newStr);

fs.writeFileSync(pagePath, updated, 'utf8');
console.log('Patched');