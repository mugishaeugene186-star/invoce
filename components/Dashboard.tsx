import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileClock, CheckCircle, AlertCircle, Sparkles, Loader2, Coins } from 'lucide-react';
import { Invoice, DashboardStats, InvoiceStatus } from '../types';
import { REVENUE_DATA } from '../constants';
import { getBusinessInsights } from '../services/geminiService';

interface DashboardProps {
  invoices: Invoice[];
}

const Dashboard: React.FC<DashboardProps> = ({ invoices }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    pendingAmount: 0,
    totalInvoices: 0,
    overdueCount: 0
  });
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    const totalRev = invoices.reduce((acc, inv) => 
      inv.status === InvoiceStatus.PAID ? acc + inv.total : acc, 0);
    const pending = invoices.reduce((acc, inv) => 
      inv.status === InvoiceStatus.PENDING ? acc + inv.total : acc, 0);
    const overdue = invoices.filter(inv => inv.status === InvoiceStatus.OVERDUE).length;

    setStats({
      totalRevenue: totalRev,
      pendingAmount: pending,
      totalInvoices: invoices.length,
      overdueCount: overdue
    });
  }, [invoices]);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const insights = await getBusinessInsights(invoices);
    setAiInsights(insights || "No insights available.");
    setLoadingInsights(false);
  };

  const formatUGX = (val: number) => {
    return new Intl.NumberFormat('en-UG', { 
        style: 'currency', 
        currency: 'UGX',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <button 
          onClick={fetchInsights}
          disabled={loadingInsights}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
        >
          {loadingInsights ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          <span>Generate AI Insights</span>
        </button>
      </div>

      {aiInsights && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="text-indigo-600" size={20} />
            <h3 className="font-semibold text-indigo-900">AI Business Analysis</h3>
          </div>
          <p className="text-indigo-800 whitespace-pre-line leading-relaxed">{aiInsights}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={formatUGX(stats.totalRevenue)} 
          icon={Coins} 
          color="text-emerald-600" 
          bg="bg-emerald-50" 
        />
        <StatCard 
          title="Pending Amount" 
          value={formatUGX(stats.pendingAmount)} 
          icon={FileClock} 
          color="text-amber-600" 
          bg="bg-amber-50" 
        />
        <StatCard 
          title="Paid Invoices" 
          value={invoices.filter(i => i.status === InvoiceStatus.PAID).length.toString()} 
          icon={CheckCircle} 
          color="text-blue-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Overdue Invoices" 
          value={stats.overdueCount.toString()} 
          icon={AlertCircle} 
          color="text-rose-600" 
          bg="bg-rose-50" 
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Trends (Last 6 Months)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b'}} 
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [formatUGX(value), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${bg} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export default Dashboard;