import React from 'react';
import { Webhook, Shield, Bell, Copy } from 'lucide-react';

const Settings: React.FC = () => {
  const webhookUrl = "https://n8n.srv1102486.hstgr.cloud/webhook-test/74286128-8405-4dd7-8ad8-101380492a70";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your integration and notification preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Webhook className="text-blue-600" />
          <h3 className="font-semibold text-slate-800">Webhook Integration</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-slate-600 text-sm">
            Use this URL to automatically trigger invoice generation from your n8n workflows or other backend systems.
          </p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-slate-900 text-slate-200 px-4 py-3 rounded-lg font-mono text-sm truncate">
              {webhookUrl}
            </code>
            <button 
              className="p-3 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              title="Copy to clipboard"
              onClick={() => alert("Copied to clipboard!")}
            >
              <Copy size={20} />
            </button>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <strong>Security Note:</strong> Always verify the <code>X-Signature</code> header in your webhook payloads to ensure authenticity.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="text-emerald-600" />
            <h3 className="font-semibold text-slate-800">API Keys</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-sm font-medium text-slate-700">Production Key</span>
              <span className="text-xs text-slate-500 font-mono">pk_live_...9x2a</span>
            </div>
            <button className="text-sm text-blue-600 hover:underline font-medium">Regenerate Key</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="text-purple-600" />
            <h3 className="font-semibold text-slate-800">Notifications</h3>
          </div>
          <div className="space-y-3">
             <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-slate-700">Email me when invoice is paid</span>
             </label>
             <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" defaultChecked />
                <span className="text-sm text-slate-700">Email me on webhook failure</span>
             </label>
             <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                <span className="text-sm text-slate-700">Daily summary report</span>
             </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;