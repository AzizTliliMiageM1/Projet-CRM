'use client';

import { useEffect, useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Send, Loader, RefreshCw, Database, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface BrevoStatus {
  status: 'connected' | 'disconnected' | 'loading';
  email?: string;
  planType?: string;
  credits?: number;
  message?: string;
}

export function EmailSettingsView() {
  const [brevoStatus, setBrevoStatus] = useState<BrevoStatus>({ status: 'loading' });
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check Brevo connection on mount
  useEffect(() => {
    checkBrevoStatus();
  }, []);

  const checkBrevoStatus = async () => {
    try {
      setBrevoStatus({ status: 'loading' });
      const response = await fetch('/api/emails/stats');
      const data = await response.json();

      if (data.success) {
        setBrevoStatus({
          status: 'connected',
          email: data.account.email,
          planType: data.account.planType,
          credits: data.account.credits,
        });
      } else {
        setBrevoStatus({
          status: 'disconnected',
          message: data.message || 'Brevo is not configured',
        });
      }
    } catch (error) {
      setBrevoStatus({
        status: 'disconnected',
        message: error instanceof Error ? error.message : 'Failed to check status',
      });
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!testEmail) {
      toast.error('Please enter a test email address');
      return;
    }

    try {
      setIsSendingTest(true);
      const response = await fetch('/api/emails/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Test email sent! Check your inbox.');
        setTestEmail('');
      } else {
        toast.error(data.error || 'Failed to send test email');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error sending test email');
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSyncContacts = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch('/api/emails/sync-contact');
      const data = await response.json();

      if (data.success) {
        toast.success(`Synced ${data.synced} contacts to Brevo`);
      } else {
        toast.error(data.error || 'Failed to sync contacts');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error syncing contacts');
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('BREVO_API_KEY=your_api_key_here');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
          <Mail className="w-10 h-10 text-sky-500" />
          Email Configuration
        </h1>
        <p className="text-slate-400 text-lg">Manage email notifications and Brevo integration</p>
      </div>

      {/* Brevo Status Card */}
      <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-50">Brevo Connection Status</h2>
          <button
            onClick={checkBrevoStatus}
            className="px-4 py-2 rounded-lg border border-slate-600 hover:border-sky-500 text-slate-300 hover:text-sky-400 hover:bg-sky-500/10 transition-all text-sm font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {brevoStatus.status === 'loading' && (
          <div className="space-y-3">
            <div className="h-6 bg-slate-800/50 rounded-lg w-1/3 animate-pulse"></div>
            <div className="h-4 bg-slate-800/50 rounded-lg w-1/4 animate-pulse"></div>
          </div>
        )}

        {brevoStatus.status === 'connected' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <span className="font-bold text-green-400 text-lg">Connected</span>
                <p className="text-sm text-slate-400">Your Brevo account is active and ready</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email</p>
                <p className="text-base font-bold text-slate-100 mt-2">{brevoStatus.email}</p>
              </div>
              <div className="p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Plan</p>
                <p className="text-base font-bold text-slate-100 mt-2">{brevoStatus.planType || 'Free'}</p>
              </div>
              <div className="p-4 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Credits</p>
                <p className="text-base font-bold text-slate-100 mt-2">{brevoStatus.credits || 'Unlimited'}</p>
              </div>
            </div>
          </div>
        )}

        {brevoStatus.status === 'disconnected' && (
          <div className="flex items-start gap-4 p-6 rounded-lg bg-red-500/10 border border-red-500/30">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-400 mb-1">Not Connected</h3>
              <p className="text-sm text-slate-400">{brevoStatus.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Guide */}
      {brevoStatus.status === 'disconnected' && (
        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-8">
          <h3 className="font-bold text-amber-300 mb-4 flex items-center gap-2 text-lg">
            <AlertCircle className="w-5 h-5" />
            Setup Required - Follow These Steps
          </h3>
          <ol className="space-y-3 text-sm text-amber-100/80">
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-300 text-lg flex-shrink-0">1</span>
              <span>Create a free account at <a href="https://www.brevo.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline font-semibold">brevo.com</a></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-300 text-lg flex-shrink-0">2</span>
              <span>Go to <strong>Settings → API & SMTP</strong> to get your <strong>API key</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-300 text-lg flex-shrink-0">3</span>
              <span>Add this to your <code className="bg-amber-900/40 px-2.5 py-1 rounded font-mono text-xs">.env.local</code> file:</span>
            </li>
            <li className="ml-6">
              <div className="flex items-center gap-2 bg-black/40 rounded-lg p-3 border border-amber-500/30">
                <code className="font-mono text-xs text-amber-100 flex-1">BREVO_API_KEY=your_api_key_here</code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-amber-500/20 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-amber-400" />
                  )}
                </button>
              </div>
            </li>
            <li className="flex items-start gap-3 pt-2">
              <span className="font-bold text-amber-300 text-lg flex-shrink-0">4</span>
              <span>Restart your development server (<code className="bg-amber-900/40 px-2.5 py-1 rounded font-mono text-xs">npm run dev</code>)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-300 text-lg flex-shrink-0">5</span>
              <span>Click the <strong>Refresh</strong> button above to verify connection</span>
            </li>
          </ol>
        </div>
      )}

      {/* Test Email Section */}
      <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-50 mb-2">Send Test Email</h2>
        <p className="text-slate-400 mb-6">Verify your Brevo configuration by sending a test email</p>
        <form onSubmit={handleSendTestEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Recipient Email Address</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={brevoStatus.status === 'disconnected'}
              className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 transition-all disabled:opacity-50 disabled:bg-slate-800/30"
            />
          </div>
          <button
            type="submit"
            disabled={isSendingTest || brevoStatus.status === 'disconnected' || !testEmail}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSendingTest ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Test Email
              </>
            )}
          </button>
        </form>
      </div>

      {/* Sync Contacts Section */}
      {brevoStatus.status === 'connected' && (
        <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-50 mb-2">Sync Contacts to Brevo</h2>
          <p className="text-slate-400 mb-6">Export all your CRM contacts to Brevo for email campaigns and automation</p>
          <button
            onClick={handleSyncContacts}
            disabled={isSyncing}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSyncing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Database className="w-5 h-5" />
                Sync All Contacts to Brevo
              </>
            )}
          </button>
        </div>
      )}

      {/* Email Features List */}
      <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-50 mb-6">Available Email Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: '📢 Lead Notifications', desc: 'Notify your team instantly of new leads' },
            { title: '⏰ Task Reminders', desc: 'Automatic reminders for upcoming tasks' },
            { title: '💼 Contact Follow-ups', desc: 'Send personalized follow-up emails' },
            { title: '📊 Weekly Summaries', desc: 'Get weekly activity reports via email' },
          ].map((feature) => (
            <div key={feature.title} className="p-5 border border-slate-700/50 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-200 hover:border-sky-500/50">
              <h3 className="font-bold text-slate-100 text-lg">{feature.title}</h3>
              <p className="text-sm text-slate-400 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
