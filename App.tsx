import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InvoiceList from './components/InvoiceList';
import InvoiceBuilder from './components/InvoiceBuilder';
import InvoiceDetails from './components/InvoiceDetails';
import Settings from './components/Settings';
import ChatBot from './components/ChatBot';
import { ViewState, Invoice } from './types';
import { MOCK_INVOICES } from './constants';
import { Bell, Search, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setCurrentView('details');
  };

  const handleEditInvoice = (invoice: Invoice) => {
    // Map existing invoice to builder form data structure
    const formData = {
        customerName: invoice.customer.name,
        customerEmail: invoice.customer.email,
        customerAddress: invoice.customer.address || '',
        date: invoice.date,
        dueDate: invoice.dueDate,
        items: invoice.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        })),
        notes: ''
    };
    
    // Save to local storage to "load" it into the builder
    localStorage.setItem('invoice_draft', JSON.stringify(formData));
    
    // Switch view
    setCurrentView('create');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard invoices={MOCK_INVOICES} />;
      case 'invoices':
        return <InvoiceList invoices={MOCK_INVOICES} onViewInvoice={handleViewInvoice} />;
      case 'create':
        return <InvoiceBuilder />;
      case 'details':
        return selectedInvoice ? (
            <InvoiceDetails 
                invoice={selectedInvoice} 
                onBack={() => setCurrentView('invoices')}
                onEdit={() => handleEditInvoice(selectedInvoice)}
            />
        ) : (
            <InvoiceList invoices={MOCK_INVOICES} onViewInvoice={handleViewInvoice} />
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard invoices={MOCK_INVOICES} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center text-slate-400">
             <span className="text-sm font-medium text-slate-500 capitalize">{currentView}</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Quick search..." 
                 className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none w-64"
               />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">admin@invoiceflow.ai</p>
              </div>
              <div className="h-9 w-9 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-md">
                 <UserCircle size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* AI Chatbot Overlay */}
      <ChatBot />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;