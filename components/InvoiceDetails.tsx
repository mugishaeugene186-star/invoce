import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { ArrowLeft, Download, Share2, Smartphone, CreditCard, Copy, Check, Loader2, Building2, Pencil, Mail, Globe, Settings, Trash2 } from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onBack: () => void;
  onEdit: () => void;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onBack, onEdit }) => {
  const [generatingLink, setGeneratingLink] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | undefined>(invoice.paymentLink);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock company branding settings
  const companyBranding = {
    name: "InvoiceFlow Uganda Ltd",
    address: "Plot 42, Kampala Road\nKampala, Uganda",
    email: "accounts@invoiceflow.ug",
    website: "www.invoiceflow.ug",
    phone: "+256 700 123 456",
    primaryColor: "#2563eb", // blue-600
  };

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    const webhookUrl = "https://n8n.srv1102486.hstgr.cloud/webhook-test/74286128-8405-4dd7-8ad8-101380492a70";

    try {
        // Send details to the webhook
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generate_payment_link',
                invoice: invoice,
                payment_methods: ['mobile_money', 'mobile_banking'],
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        // We log the error but proceed with the mock link for the demo
        console.error("Webhook integration error:", error);
    }

    // Simulate API latency and link generation
    setTimeout(() => {
        const uniqueLink = `https://pay.invoiceflow.ai/pay/${invoice.id}?method=mobile_money&banking=true`;
        setPaymentLink(uniqueLink);
        setGeneratingLink(false);
    }, 1500);
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    const element = document.getElementById('invoice-content');
    
    // Check if library is loaded
    if (typeof (window as any).html2pdf === 'undefined') {
        alert('PDF generator library not loaded. Please refresh the page.');
        setIsDownloading(false);
        return;
    }
    
    if (element) {
        // Sanitize filename
        const safeNumber = invoice.number.replace(/[^a-zA-Z0-9-_]/g, '-');

        const opt = {
            margin: [10, 10, 10, 10], // Top, Left, Bottom, Right
            filename: `Invoice-${safeNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Access html2pdf from window object
        const worker = (window as any).html2pdf();
        
        worker.set(opt).from(element).save()
            .then(() => {
                setIsDownloading(false);
            })
            .catch((err: any) => {
                console.error('PDF generation failed', err);
                alert('Failed to generate PDF. Please try again.');
                setIsDownloading(false);
            });
    } else {
        setIsDownloading(false);
        console.error('Invoice element not found');
    }
  };

  const copyToClipboard = () => {
    if (paymentLink) {
        navigator.clipboard.writeText(paymentLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
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
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Controls */}
      <div className="flex items-center justify-between print:hidden">
        <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Invoices</span>
        </button>
        <div className="flex space-x-3">
             <button 
                onClick={onEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
            >
                <Pencil size={18} />
                <span>Edit Invoice</span>
            </button>
            <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
            </button>
             <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                <Share2 size={18} />
                <span>Email</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Preview / Printable Area */}
        <div id="invoice-content" className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
            
            {/* Branding Header */}
            <div className="p-10 pb-6 flex justify-between items-start">
                <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Building2 size={28} />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">{companyBranding.name}</h2>
                        <div className="mt-1 text-sm text-slate-500 space-y-0.5">
                            <p className="whitespace-pre-line">{companyBranding.address}</p>
                            <p>{companyBranding.phone}</p>
                        </div>
                    </div>
                </div>
                <div className="text-right text-sm text-slate-500 space-y-1">
                    <div className="flex items-center justify-end space-x-2">
                        <Mail size={14} />
                        <span>{companyBranding.email}</span>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <Globe size={14} />
                        <span>{companyBranding.website}</span>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100 mx-10" />

            {/* Invoice Title & Status */}
            <div className="px-10 py-6 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">INVOICE</h1>
                    <p className="text-slate-500 font-medium mt-1 text-lg">#{invoice.number}</p>
                </div>
                <div className="mb-2">
                    <button 
                        onClick={onEdit}
                        title="Click to edit status and details"
                        className={`group inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-blue-100 transition-all ${
                        invoice.status === InvoiceStatus.PAID ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        invoice.status === InvoiceStatus.OVERDUE ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                        {invoice.status}
                        <Pencil size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            <div className="px-10 py-6 bg-slate-50 border-y border-slate-100">
                <div className="flex justify-between">
                    <div className="w-1/2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
                        <p className="font-bold text-slate-800 text-lg">{invoice.customer.name}</p>
                        <p className="text-slate-600">{invoice.customer.email}</p>
                        <p className="text-slate-600 whitespace-pre-line mt-1">{invoice.customer.address}</p>
                    </div>
                    <div className="text-right space-y-4">
                         <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Issued</h3>
                            <p className="font-medium text-slate-800">{invoice.date}</p>
                         </div>
                         <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</h3>
                            <p className="font-medium text-slate-800">{invoice.dueDate}</p>
                         </div>
                    </div>
                </div>
            </div>

            <div className="p-10">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-slate-100">
                            <th className="text-left py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="text-center py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Qty</th>
                            <th className="text-right py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Price</th>
                            <th className="text-right py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoice.items.map((item, i) => (
                            <tr key={i}>
                                <td className="py-4 text-slate-800 font-medium">{item.description}</td>
                                <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                                <td className="py-4 text-right text-slate-600">{formatUGX(item.unitPrice)}</td>
                                <td className="py-4 text-right font-bold text-slate-800">{formatUGX(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end pt-8">
                    <div className="w-72 space-y-3">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>{formatUGX(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>VAT (18%)</span>
                            <span>{formatUGX(invoice.tax)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-slate-900 border-t-2 border-slate-100 pt-4 mt-2">
                            <span>Total</span>
                            <span className="text-blue-600">{formatUGX(invoice.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-12 pt-8 border-t border-slate-100 text-slate-500 text-sm">
                    <p className="font-semibold mb-1">Notes & Payment Terms:</p>
                    <p>Please include the invoice number in your payment reference. Payment is due within 14 days.</p>
                </div>
            </div>
            
            {/* Bottom Color Bar */}
            <div className="h-3 w-full bg-blue-600"></div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6 print:hidden">
            
            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Settings size={20} className="text-slate-500" />
                    <span>Manage Invoice</span>
                </h3>
                <div className="space-y-3">
                    <button 
                        onClick={onEdit}
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                        <Pencil size={18} />
                        <span>Edit Details</span>
                    </button>
                    <button 
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 px-4 py-3 rounded-lg transition-colors font-medium"
                        onClick={() => alert("Delete functionality would go here")}
                    >
                        <Trash2 size={18} />
                        <span>Delete Invoice</span>
                    </button>
                </div>
            </div>

            {/* Payment Link Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
                    <Smartphone size={20} className="text-blue-600" />
                    <span>Mobile & Banking Payment</span>
                </h3>
                
                <p className="text-sm text-slate-500 mb-6">
                    Create a payment link supporting <strong>Mobile Money (MTN/Airtel)</strong> and <strong>Mobile Banking</strong> integration.
                </p>

                {!paymentLink ? (
                    <button 
                        onClick={handleGenerateLink}
                        disabled={generatingLink}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {generatingLink ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Generating Link...</span>
                            </>
                        ) : (
                            <>
                                <Smartphone size={18} />
                                <span>Generate Payment Link</span>
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                             <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Payment Link</label>
                             <div className="flex items-center space-x-2">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={paymentLink} 
                                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-700 focus:outline-none"
                                />
                                <button 
                                    onClick={copyToClipboard}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Copy"
                                >
                                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                </button>
                             </div>
                        </div>

                        <div className="flex items-center justify-center space-x-6 pt-2">
                            <div className="flex flex-col items-center space-y-1 text-slate-500">
                                <Smartphone size={24} />
                                <span className="text-xs">MTN/Airtel</span>
                            </div>
                            <div className="flex flex-col items-center space-y-1 text-slate-500">
                                <Building2 size={24} />
                                <span className="text-xs">Mobile Bank</span>
                            </div>
                             <div className="flex flex-col items-center space-y-1 text-slate-500">
                                <CreditCard size={24} />
                                <span className="text-xs">Cards</span>
                            </div>
                        </div>
                        
                        <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg border border-emerald-100 flex items-start space-x-2">
                             <Check size={14} className="mt-0.5" />
                             <span>Mobile Money link active.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;