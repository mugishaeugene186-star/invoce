import React, { useState, useEffect } from 'react';
import { InvoiceStatus } from '../types';
import { Sparkles, Plus, Trash2, Save, Send, Loader2 } from 'lucide-react';
import { generateInvoiceDataFromText } from '../services/geminiService';

const InvoiceBuilder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  
  // Initialize form data from local storage if available
  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('invoice_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        console.error("Failed to parse saved draft:", e);
      }
    }
    return {
      customerName: '',
      customerEmail: '',
      customerAddress: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: ''
    };
  });

  // Auto-save draft to local storage whenever form data changes
  useEffect(() => {
    localStorage.setItem('invoice_draft', JSON.stringify(formData));
  }, [formData]);

  const handleMagicFill = async () => {
    if (!naturalLanguageInput.trim()) return;
    setLoading(true);
    try {
        const result = await generateInvoiceDataFromText(naturalLanguageInput);
        if (result) {
            setFormData(prev => ({
                ...prev,
                customerName: result.customer?.name || prev.customerName,
                customerEmail: result.customer?.email || prev.customerEmail,
                customerAddress: result.customer?.address || prev.customerAddress,
                date: result.date || prev.date,
                items: result.items?.length ? result.items : prev.items
            }));
        }
    } catch (e) {
        alert("Failed to generate invoice from text. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Explicitly save (redundant with useEffect but good for feedback)
    localStorage.setItem('invoice_draft', JSON.stringify(formData));
    alert("Draft saved successfully! You can return to it later.");
  };

  const handleGenerateAndSend = async () => {
    setSending(true);
    const webhookUrl = "https://n8n.srv1102486.hstgr.cloud/webhook-test/74286128-8405-4dd7-8ad8-101380492a70";
    
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create_invoice',
                data: formData,
                currency: 'UGX',
                timestamp: new Date().toISOString()
            })
        });
        alert("Invoice generated and sent to processing webhook!");
        
        // Reset form after success
        setFormData({
            customerName: '',
            customerEmail: '',
            customerAddress: '',
            date: new Date().toISOString().split('T')[0],
            dueDate: '',
            items: [{ description: '', quantity: 1, unitPrice: 0 }],
            notes: ''
        });
    } catch (error) {
        console.error("Failed to send invoice:", error);
        alert("Note: Could not connect to webhook, but your draft is saved locally.");
    } finally {
        setSending(false);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const formatUGX = (amount: number) => {
    return new Intl.NumberFormat('en-UG', { 
        style: 'currency', 
        currency: 'UGX', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Form */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* AI Input Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="text-yellow-300" />
            <h3 className="font-bold text-lg">Magic Fill with AI</h3>
          </div>
          <p className="text-indigo-100 text-sm mb-4">
            Describe your invoice and let AI fill the details. E.g., "Web design for Nile Coffee, 10 hours at 150,000 UGX/hr."
          </p>
          <div className="relative">
            <textarea
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              rows={3}
              placeholder="Type invoice details here..."
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
            />
            <button 
                onClick={handleMagicFill}
                disabled={loading || !naturalLanguageInput}
                className="absolute bottom-3 right-3 bg-white text-indigo-600 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {loading && <Loader2 className="animate-spin" size={14} />}
                Generate
            </button>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Invoice Details</h2>
            <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">
               {formData.customerName ? 'Draft Saved' : 'New Draft'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900 border-b pb-2">Customer Info</h3>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.customerName}
                  onChange={e => setFormData({...formData, customerName: e.target.value})}
                  placeholder="e.g. Nile Coffee Exports Ltd"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.customerEmail}
                  onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900 border-b pb-2">Invoice Meta</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Issue Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-900">Line Items (UGX)</h3>
              <button onClick={addItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                <Plus size={16} className="mr-1" /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Description"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={item.description}
                      onChange={e => updateItem(idx, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <input 
                      type="number" 
                      placeholder="Qty"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-center"
                      value={item.quantity}
                      onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number" 
                      placeholder="Price"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                      value={item.unitPrice}
                      onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="w-32 pt-2 text-right font-medium text-slate-700 text-sm">
                    {formatUGX(item.quantity * item.unitPrice)}
                  </div>
                  <button onClick={() => removeItem(idx)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-6 flex justify-end">
             <div className="w-64 space-y-3">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatUGX(calculateTotal())}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span>VAT (18%)</span>
                    <span>{formatUGX(calculateTotal() * 0.18)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-800 border-t pt-2 border-dashed border-slate-300">
                    <span>Total</span>
                    <span>{formatUGX(calculateTotal() * 1.18)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column: Actions */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
          <h3 className="font-bold text-slate-800 mb-4">Actions</h3>
          <div className="space-y-3">
            <button 
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors font-medium">
              <Save size={18} />
              <span>Save Draft</span>
            </button>
            <button 
                onClick={handleGenerateAndSend}
                disabled={sending}
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              <span>{sending ? 'Sending...' : 'Generate & Send'}</span>
            </button>
          </div>
          
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h4 className="text-sm font-medium text-slate-500 mb-2">Completion Status</h4>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (Object.values(formData).filter(Boolean).length / 7) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
                {formData.customerName && formData.items[0].unitPrice > 0 ? 'Ready to send' : 'In progress'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceBuilder;