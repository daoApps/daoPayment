'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="gradient-bg noise min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 md:py-24 flex-1">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <span className="status-dot success"></span>
            <span className="text-sm text-text-secondary">Secured by Monad • Agent Native</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Agentic Payment</span>
            <br />
            <span className="text-text-primary">for the AI era</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            Secure, controllable, auditable decentralized payments
            <br />
            for AI Agents on Monad
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
              Open Dashboard
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5M5 12h13" />
              </svg>
            </Link>
            <a 
              href="https://github.com/daocollective/daoPayment" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border-color bg-bg-secondary hover:bg-bg-tertiary transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.384-.218.384-.482 0-.237-.008-.866-.013-1.7-2.834.603-3.636-1.26-3.636-1.26-.457-.353-.866-.546-1.153-.546.91-.217 1.852.45 2.548.45.837 0 1.996-.19 2.85-.668 3.746-1.09.078.615-.458 1.425-1.14 1.425-1.268-.911-2.24-2.24 2.025-2.49l.685-.065c4.02-.587 7.07-3.883 7.07-7.983C20 6.484 17.523 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="glass-card p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Non-Custodial</h3>
            <p className="text-text-secondary">
              Users hold their own keys. Agents can act without accessing master secrets. Full control remains with you.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Fine-grained Policy</h3>
            <p className="text-text-secondary">
              Per-agent permissions, daily limits, whitelists, and rule-based policies. Every transaction is checked before execution.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-2 0a5 5 0 00-5-5h-3a3 3 0 00-3 3v3a5 5 0 005 5m3 1h3m-3 0v-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Session Keys</h3>
            <p className="text-text-secondary">
              Time-limited, scope-bound session keys for continuous operation. Rotate or revoke at any time.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Full Auditability</h3>
            <p className="text-text-secondary">
              Every payment is logged with context: who, why, when, which policy approved it. Complete transparency.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4m-4 0h16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">MCP Integration</h3>
            <p className="text-text-secondary">
              Built-in Model Context Protocol server. Works out-of-the-box with Claude Code and other MCP clients.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 12h.01M12 6h.01M12 18h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Recovery & Revocation</h3>
            <p className="text-text-secondary">
              Disaster recovery built-in. Instantly revoke compromised credentials. Your security is always in your hands.
            </p>
          </div>
        </div>

        {/* Architecture Stats */}
        <div className="max-w-4xl mx-auto mt-20 md:mt-32">
          <div className="glass-card glow-border p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Architecture Overview</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="code-font text-4xl md:text-5xl font-bold text-gradient mb-2">9</div>
                <div className="text-text-secondary">Security Layers</div>
              </div>
              <div>
                <div className="code-font text-4xl md:text-5xl font-bold text-gradient mb-2">15+</div>
                <div className="text-text-secondary">MCP Tools</div>
              </div>
              <div>
                <div className="code-font text-4xl md:text-5xl font-bold text-gradient mb-2">∞</div>
                <div className="text-text-secondary">Scalable Policies</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-text-secondary mb-8">
            Start using daoPayment today and give your AI Agents secure payment capabilities on Monad
          </p>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border-color mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-text-muted">
          <p>Built for Monad Blitz • Agentic Payment Track</p>
        </div>
      </footer>
    </main>
  );
}
