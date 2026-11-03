import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, FileCheck, Plus, Download, ChevronDown, ChevronUp, Trash2, X, FileText, Calendar, PlusCircle, Check, AlertTriangle, Printer } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useApp, Transaction } from '../../app/AppContext';

type GraphFilter = 'monthly' | 'quarterly' | 'yearly';
type ExportPeriod = 'current_month' | 'last_month' | 'complete';

interface ExpenseItemDraft {
  name: string;
  cost: number;
}

const ROTARACT_MONTHS = [
  { key: 'Jul 2026', label: 'July 2026' },
  { key: 'Aug 2026', label: 'August 2026' },
  { key: 'Sep 2026', label: 'September 2026' },
  { key: 'Oct 2026', label: 'October 2026' },
  { key: 'Nov 2026', label: 'November 2026' },
  { key: 'Dec 2026', label: 'December 2026' },
  { key: 'Jan 2027', label: 'January 2027' },
  { key: 'Feb 2027', label: 'February 2027' },
  { key: 'Mar 2027', label: 'March 2027' },
  { key: 'Apr 2027', label: 'April 2027' },
  { key: 'May 2027', label: 'May 2027' },
  { key: 'Jun 2027', label: 'June 2027' },
];

export const FinancePage: React.FC = () => {
  const { activeMembers, transactions, addTransaction, deleteTransaction } = useApp();

  // Graph filter states
  const [graphFilter, setGraphFilter] = useState<GraphFilter>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<string>('Aug 2026');
  const [expandedTxIds, setExpandedTxIds] = useState<Set<string>>(new Set());

  // Action Modals & Dropdown
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'income' | 'expense' | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfPeriod, setPdfPeriod] = useState<ExportPeriod>('complete');
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  React.useEffect(() => {
    const afterPrint = () => setPdfPeriod('complete');
    window.addEventListener('afterprint', afterPrint);
    return () => window.removeEventListener('afterprint', afterPrint);
  }, []);

  // Income form state
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('Fundraising');

  // Expense form state
  const [expenseEventName, setExpenseEventName] = useState('');
  const [expenseItems, setExpenseItems] = useState<ExpenseItemDraft[]>([
    { name: 'Stage & Sound Setup', cost: 300 },
    { name: 'Banners & Printing', cost: 400 },
  ]);

  // Calculations
  const memberDuesTotal = transactions
    .filter(t => t.type === 'income' && t.category.includes('Dues'))
    .reduce((sum, t) => sum + t.amount, 0);

  const otherIncomeTotal = transactions
    .filter(t => t.type === 'income' && !t.category.includes('Dues'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = memberDuesTotal + otherIncomeTotal;

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const pdfTransactions = pdfPeriod === 'current_month' ? transactions.filter(t => t.date.includes('Aug')) :
                          pdfPeriod === 'last_month' ? transactions.filter(t => t.date.includes('Jul')) :
                          transactions;

  const pdfTotalIncome = pdfTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const pdfTotalExpense = pdfTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const pdfNetBalance = pdfTotalIncome - pdfTotalExpense;

  // Graph Datasets
  const getGraphData = () => {
    if (graphFilter === 'monthly') {
      // Return data points for the selected month
      const monthTx = transactions.filter(t => t.date.includes(selectedMonth.split(' ')[0]));
      if (monthTx.length === 0) {
        return [
          { name: `${selectedMonth.split(' ')[0]} 01`, income: 0, expense: 0 },
          { name: `${selectedMonth.split(' ')[0]} 15`, income: 0, expense: 0 },
          { name: `${selectedMonth.split(' ')[0]} 30`, income: 0, expense: 0 },
        ];
      }
      return monthTx.map(t => ({
        name: t.date,
        income: t.type === 'income' ? t.amount : 0,
        expense: t.type === 'expense' ? t.amount : 0,
      }));
    } else if (graphFilter === 'quarterly') {
      // Rotaract Year Quarters: Q1 (Jul-Sep), Q2 (Oct-Dec), Q3 (Jan-Mar), Q4 (Apr-Jun)
      return [
        { name: 'Q1 (Jul-Sep)', income: 49100, expense: 10300 },
        { name: 'Q2 (Oct-Dec)', income: 0, expense: 0 },
        { name: 'Q3 (Jan-Mar)', income: 0, expense: 0 },
        { name: 'Q4 (Apr-Jun)', income: 0, expense: 0 },
      ];
    } else {
      // Yearly: All 12 Months comparison (July 2026 to June 2027)
      return [
        { name: 'Jul 26', income: 20900, expense: 0 },
        { name: 'Aug 26', income: 27400, expense: 10300 },
        { name: 'Sep 26', income: 0, expense: 0 },
        { name: 'Oct 26', income: 0, expense: 0 },
        { name: 'Nov 26', income: 0, expense: 0 },
        { name: 'Dec 26', income: 0, expense: 0 },
        { name: 'Jan 27', income: 0, expense: 0 },
        { name: 'Feb 27', income: 0, expense: 0 },
        { name: 'Mar 27', income: 0, expense: 0 },
        { name: 'Apr 27', income: 0, expense: 0 },
        { name: 'May 27', income: 0, expense: 0 },
        { name: 'Jun 27', income: 0, expense: 0 },
      ];
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTxIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeName || !incomeAmount) return;

    addTransaction({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      description: incomeName,
      category: incomeCategory,
      type: 'income',
      amount: parseFloat(incomeAmount) || 0,
    });

    setIncomeName('');
    setIncomeAmount('');
    setActiveModal(null);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseEventName || expenseItems.length === 0) return;

    const computedTotal = expenseItems.reduce((sum, item) => sum + (item.cost || 0), 0);

    addTransaction({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      description: expenseEventName,
      category: 'Event Expense',
      type: 'expense',
      amount: computedTotal,
      items: expenseItems.filter(i => i.name.trim() !== ''),
    });

    setExpenseEventName('');
    setExpenseItems([
      { name: 'Stage & Sound Setup', cost: 300 },
      { name: 'Banners & Printing', cost: 400 },
    ]);
    setActiveModal(null);
  };

  const confirmDeleteTx = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  const handleExportPdf = (period: ExportPeriod) => {
    setPdfPeriod(period);
    setIsPdfModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-8">
      {/* ── Printable Formal Ledger Header (Hidden on Screen, Visible on PDF Print) ── */}
      <div className="hidden print:block text-black p-6 border-b-2 border-black mb-6">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-black uppercase">Rotaract Club of Acropolis Royals</h1>
          <h2 className="text-xl font-bold uppercase mt-1">Financial Ledger</h2>
          <p className="text-sm font-bold mt-2 text-gray-700">
            Duration: {
              pdfPeriod === 'current_month' ? 'August 2026' :
              pdfPeriod === 'last_month' ? 'July 2026' :
              'July 2026 to June 2027'
            }
          </p>
        </div>
      </div>

      {/* ── Screen Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Treasury</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2.5 rounded-xl glass-panel text-white text-xs font-semibold hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#F7A81B]" />
            Export as PDF
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsAddMenuOpen(prev => !prev)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Budget Entry
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAddMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isAddMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0E131F] border border-white/10 rounded-2xl p-2 z-30 shadow-2xl space-y-1">
                <button
                  onClick={() => { setIsAddMenuOpen(false); setActiveModal('income'); }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  🟢 Add Income
                </button>
                <button
                  onClick={() => { setIsAddMenuOpen(false); setActiveModal('expense'); }}
                  className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  🔴 Add Expense
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Analytics & Summary Section (Graph on Left, Summary Cards on Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Left Side: Cashflow Graph with Filters & Scrollable Month Dropdown */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mt-1">
              <DollarSign className="w-5 h-5 text-[#F7A81B]" />
              Cashflow Analytics (Rotaract Year 2026-27)
            </h2>
            <div className="flex flex-col items-end gap-2">
              {/* Graph Filters: Monthly / Quarterly / Yearly */}
              <div className="flex items-center gap-1.5 glass-panel p-1 rounded-xl border border-white/10">
                {(['monthly', 'quarterly', 'yearly'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setGraphFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      graphFilter === f ? 'bg-[#F7A81B] text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Monthly Scrollable Dropdown */}
              {graphFilter === 'monthly' && (
                <div className="w-full flex justify-end">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#141A29] text-xs font-bold text-[#F7A81B] border border-[#F7A81B]/30 focus:outline-none cursor-pointer max-w-[150px] shadow-lg"
                  >
                    {ROTARACT_MONTHS.map(m => (
                      <option key={m.key} value={m.key}>{m.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {graphFilter === 'yearly' ? (
                /* Yearly 12 Months Comparison Bar Chart */
                <BarChart data={getGraphData()}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0E131F', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF', borderRadius: 12 }} />
                  <Bar dataKey="income" fill="#34D399" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              ) : (
                /* Area Chart for Monthly and Quarterly Views */
                <AreaChart data={getGraphData()}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0E131F', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="income" stroke="#34D399" fillOpacity={1} fill="url(#incomeGrad)" />
                  <Area type="monotone" dataKey="expense" stroke="#F43F5E" fillOpacity={1} fill="url(#expenseGrad)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Stacked KPI Flash Cards */}
        <div className="lg:col-span-1 space-y-4">
          {/* Total Income Card */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Income</p>
            <h2 className="text-3xl font-black text-emerald-400 mt-1">₹{totalIncome.toLocaleString('en-IN')}</h2>
            <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Member Dues (₹{memberDuesTotal.toLocaleString('en-IN')}) + Fundraising (₹{otherIncomeTotal.toLocaleString('en-IN')})
            </p>
          </div>

          {/* Total Expenses Card */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Expenses</p>
            <h2 className="text-3xl font-black text-rose-400 mt-1">₹{totalExpense.toLocaleString('en-IN')}</h2>
            <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Event Execution &amp; Logistics
            </p>
          </div>

          {/* Net Treasury Balance Card */}
          <div className="glass-panel p-5 rounded-2xl border border-[#F7A81B]/30 bg-[#F7A81B]/5">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Net Treasury Balance</p>
            <h2 className="text-3xl font-black text-[#F7A81B] mt-1">₹{netBalance.toLocaleString('en-IN')}</h2>
            <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-[#F7A81B]" /> Audited Live Balance
            </p>
          </div>
        </div>
      </div>

      {/* ── Budget & Finance Ledger List (Screen + Clean Print PDF Layout) ── */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden p-6 space-y-4 print:border-none print:p-0 print:bg-white print:text-black">
        <h2 className="text-lg font-bold text-white print:text-black print:text-base print:font-extrabold border-b border-white/10 print:border-black pb-2">
          Budget &amp; Financial Ledger ({transactions.length} Records)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 print:text-black print:text-xs border-collapse">
            <thead className="bg-white/5 print:bg-gray-200 text-slate-400 print:text-black uppercase text-[10px] tracking-wider font-semibold border-b border-white/10 print:border-black">
              <tr>
                <th className="p-3.5 print:p-2">Transaction &amp; Date</th>
                <th className="p-3.5 print:p-2">Category</th>
                <th className="p-3.5 print:p-2">Type</th>
                <th className="p-3.5 text-right print:p-2">Amount (₹)</th>
                <th className="p-3.5 text-center print:hidden">Breakdown</th>
                <th className="p-3.5 text-right print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 print:divide-gray-300">
              {pdfTransactions.map(t => {
                const isExpanded = expandedTxIds.has(t.id);
                const hasItems = t.items && t.items.length > 0;

                return (
                  <React.Fragment key={t.id}>
                    <tr
                      onClick={() => hasItems && toggleExpand(t.id)}
                      className={`hover:bg-white/5 print:hover:bg-transparent transition-colors ${hasItems ? 'cursor-pointer' : ''}`}
                    >
                      <td className="p-3.5 print:p-2">
                        <span className="text-white print:text-black font-bold text-sm print:text-xs block">{t.description}</span>
                        <span className="text-slate-400 print:text-gray-600 text-[11px] print:text-[10px] font-mono">{t.date} • {t.receipt}</span>
                      </td>
                      <td className="p-3.5 print:p-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10 print:border-gray-400 print:text-black text-[10px] font-semibold">
                          {t.category}
                        </span>
                      </td>
                      <td className="p-3.5 print:p-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 print:text-green-700 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 print:text-red-700 border border-rose-500/20'
                        }`}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className={`p-3.5 text-right print:p-2 font-black text-sm print:text-xs font-mono ${t.type === 'income' ? 'text-emerald-400 print:text-green-700' : 'text-rose-400 print:text-red-700'}`}>
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 text-center print:hidden">
                        {hasItems ? (
                          <button
                            onClick={e => { e.stopPropagation(); toggleExpand(t.id); }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#F7A81B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#F7A81B]" />}
                            {t.items?.length} Items
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">—</span>
                        )}
                      </td>
                      {/* Delete dustbin icon button */}
                      <td className="p-3.5 text-right print:hidden" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setTxToDelete(t)}
                          title="Delete Transaction"
                          className="p-2 rounded-xl text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 transition-all cursor-pointer shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expense Breakdown List (Always visible on print for full audit, or when expanded on screen) */}
                    {hasItems && (isExpanded || true) && (
                      <tr className={`${isExpanded ? '' : 'hidden print:table-row'} bg-black/30 print:bg-gray-100 border-b border-white/5 print:border-gray-300`}>
                        <td colSpan={6} className="p-4 pl-8 print:p-2 print:pl-4">
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 print:bg-white print:border-gray-300 space-y-2 max-w-xl">
                            <p className="text-xs font-bold text-[#F7A81B] print:text-black uppercase tracking-wider flex items-center gap-1.5">
                              Expense Distribution &amp; Cost Breakdown
                            </p>
                            <div className="divide-y divide-white/5 print:divide-gray-200 font-mono text-xs print:text-[11px]">
                              {t.items?.map((item, idx) => (
                                <div key={idx} className="py-1.5 flex items-center justify-between text-slate-200 print:text-black">
                                  <span>{item.name}</span>
                                  <span className="font-bold text-rose-300 print:text-red-700">₹{item.cost.toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                              <div className="pt-2 flex items-center justify-between font-bold text-white print:text-black text-xs border-t border-white/10 print:border-gray-300">
                                <span>Total Event Expense:</span>
                                <span className="text-rose-400 print:text-red-700 font-extrabold text-sm print:text-xs">₹{t.amount.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Printable Summary & Audit Sign-Off Footer */}
        <div className="hidden print:block mt-8 text-black">
          <div className="grid grid-cols-3 gap-4 py-4 border-t-2 border-black border-b-2 text-sm font-black uppercase text-center mb-16 bg-gray-50">
            <div>Total Income:<br/>₹{pdfTotalIncome.toLocaleString('en-IN')}</div>
            <div>Total Expense:<br/>₹{pdfTotalExpense.toLocaleString('en-IN')}</div>
            <div>Net Budget:<br/>₹{pdfNetBalance.toLocaleString('en-IN')}</div>
          </div>
          <div className="flex justify-between items-end text-xs font-bold pt-8">
            <div className="text-center w-40 border-t border-black pt-1">
              Treasurer Signature
            </div>
            <div className="text-center w-40 border-t border-black pt-1">
              President Signature
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CONFIRM DELETE TRANSACTION MODAL
      ══════════════════════════════════════════════════════════ */}
      {txToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 print:hidden">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setTxToDelete(null)} />
          <div className="relative max-w-md w-full bg-[#0E131F] border border-rose-500/30 rounded-3xl p-6 z-10 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">Delete Transaction Entry</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">"{txToDelete.description}"</strong> (₹{txToDelete.amount.toLocaleString('en-IN')}) from the ledger?
              </p>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                ⚠️ This will automatically update your Net Treasury Balance.
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setTxToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTx}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <Trash2 className="w-4 h-4" />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADD INCOME MODAL
      ══════════════════════════════════════════════════════════ */}
      {activeModal === 'income' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setActiveModal(null)} />
          <div className="relative max-w-md w-full bg-[#0E131F] border border-emerald-500/30 rounded-3xl p-6 z-10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                🟢 Add Income Entry
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>

            <form onSubmit={handleAddIncome} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Income Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Campus Carnival Sponsorship"
                  value={incomeName}
                  onChange={e => setIncomeName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel text-xs text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={incomeAmount}
                  onChange={e => setIncomeAmount(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel text-xs text-white border border-white/10 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Category
                </label>
                <select
                  value={incomeCategory}
                  onChange={e => setIncomeCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141A29] text-xs text-white border border-white/10 focus:outline-none"
                >
                  <option value="Fundraising">Fundraising</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Donation">Donation</option>
                  <option value="Merchandise">Merchandise</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Add to Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ADD EXPENSE MODAL (Dynamic Item Distribution)
      ══════════════════════════════════════════════════════════ */}
      {activeModal === 'expense' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setActiveModal(null)} />
          <div className="relative max-w-lg w-full bg-[#0E131F] border border-rose-500/30 rounded-3xl p-6 z-10 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                🔴 Add Expense Event
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Blood Donation Camp 2026"
                  value={expenseEventName}
                  onChange={e => setExpenseEventName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel text-xs text-white border border-white/10 focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#F7A81B] uppercase tracking-wider">
                    Expense Distribution Items
                  </label>
                  <button
                    type="button"
                    onClick={() => setExpenseItems(prev => [...prev, { name: '', cost: 0 }])}
                    className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> + Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {expenseItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Item ${idx + 1} Name`}
                        value={item.name}
                        onChange={e => {
                          const val = e.target.value;
                          setExpenseItems(prev => prev.map((it, i) => i === idx ? { ...it, name: val } : it));
                        }}
                        className="flex-1 px-3 py-2 rounded-xl glass-panel text-xs text-white border border-white/10 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Cost (₹)"
                        value={item.cost || ''}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setExpenseItems(prev => prev.map((it, i) => i === idx ? { ...it, cost: val } : it));
                        }}
                        className="w-28 px-3 py-2 rounded-xl glass-panel text-xs text-white border border-white/10 focus:outline-none"
                      />
                      {expenseItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setExpenseItems(prev => prev.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Total Expense:</span>
                <span className="text-lg font-black text-rose-400 font-mono">
                  ₹{expenseItems.reduce((sum, item) => sum + (item.cost || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
                >
                  Add to Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          EXPORT AS PDF PERIOD SELECTION MODAL
      ══════════════════════════════════════════════════════════ */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsPdfModalOpen(false)} />
          <div className="relative max-w-md w-full bg-[#0E131F] border border-white/10 rounded-3xl p-6 z-10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F7A81B]" /> Export Financial Report (PDF)
              </h3>
              <button onClick={() => setIsPdfModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5 text-rose-400" />
              </button>
            </div>

            <p className="text-xs text-slate-300">Select the time frame for generating the institutional PDF report:</p>

            <div className="space-y-2.5">
              {[
                { id: 'current_month', label: 'Current Month', desc: 'August 2026 activity ledger' },
                { id: 'last_month', label: 'Last Month', desc: 'July 2026 financial records' },
                { id: 'complete', label: 'Complete Financial Record', desc: 'All historical income & expense entries' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => handleExportPdf(p.id as ExportPeriod)}
                  className="w-full p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-[#F7A81B] text-left hover:bg-white/5 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#F7A81B] transition-colors">{p.label}</h4>
                    <p className="text-[11px] text-slate-400">{p.desc}</p>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-[#F7A81B] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
