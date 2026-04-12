import React, { useState } from 'react';

const modules = [
  {
    emoji: '⚖️',
    title: 'Incorporation',
    description: 'Decide how to incorporate, where, and file the paperwork — guided by AI.',
    page: 'incorporation',
  },
  {
    emoji: '📝',
    title: 'Service Agreements',
    description: 'Generate a contractor or vendor service agreement tailored to your needs.',
    page: 'service-agreements',
  },
  {
    emoji: '👥',
    title: 'Employment Agreements',
    description: 'Create compliant employment contracts for full-time hires in minutes.',
    page: 'employment-agreements',
  },
  {
    emoji: '🤝',
    title: 'NDAs',
    description: 'Generate mutual or one-way non-disclosure agreements in under 2 minutes.',
    page: 'nda',
  },
  {
    emoji: '💡',
    title: 'Intellectual Property & Licenses',
    description: 'Understand what to protect and how to secure your patents, trademarks, and IP.',
    page: 'patents',
  },
  {
    emoji: '💰',
    title: 'Fundraising',
    description: 'Generate term sheets, understand SAFEs, and know your terms before you sign.',
    page: 'fundraising',
  },
];

const mockAlerts = [
  {
    id: 1,
    type: 'urgent',
    icon: '🚨',
    title: '83(b) Election Due Soon',
    detail: 'Stock grant issued Apr 1 — 30-day IRS deadline approaching.',
    dueLabel: 'Due May 1',
    action: 'File Now',
  },
  {
    id: 2,
    type: 'warning',
    icon: '⚠️',
    title: 'BOI Report Not Filed',
    detail: 'FinCEN BOI report required within 90 days of formation.',
    dueLabel: 'Due Jun 15',
    action: 'Learn More',
  },
  {
    id: 3,
    type: 'info',
    icon: '📋',
    title: 'NDA with Acme Corp — Expiring',
    detail: 'Mutual NDA signed Jan 2025 expires in 30 days.',
    dueLabel: 'Expires May 11',
    action: 'Renew',
  },
  {
    id: 4,
    type: 'info',
    icon: '🗂️',
    title: 'Delaware Annual Report',
    detail: 'Franchise tax and annual report due March 1, 2027.',
    dueLabel: 'Due Mar 1, 2027',
    action: 'View',
  },
];

const mockDocs = [
  { icon: '📄', name: 'Articles of Incorporation', date: 'Mar 12, 2025', tag: 'Incorporation' },
  { icon: '🤝', name: 'NDA — Acme Corp', date: 'Jan 8, 2025', tag: 'NDA' },
  { icon: '📝', name: 'Contractor Agreement — Dev Team', date: 'Feb 20, 2025', tag: 'Service' },
  { icon: '💡', name: 'Provisional Patent Application', date: 'Mar 28, 2025', tag: 'IP' },
];

const alertColors = {
  urgent: { bg: '#FEF2F2', border: '#FECACA', badge: '#DC2626', badgeBg: '#FEE2E2', text: '#991B1B' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', badge: '#D97706', badgeBg: '#FEF3C7', text: '#92400E' },
  info: { bg: '#F0F9FF', border: '#BAE6FD', badge: '#0284C7', badgeBg: '#E0F2FE', text: '#0C4A6E' },
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1E293B',
  },
  header: {
    padding: '48px 24px 40px',
    textAlign: 'center',
    borderBottom: '1px solid #E2E8F0',
    background: '#ffffff',
  },
  logo: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: '-0.5px',
    margin: '0 0 12px',
  },
  tagline: {
    fontSize: '18px',
    color: '#64748B',
    margin: '0',
    fontWeight: '400',
  },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '24px',
    marginTop: '0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
    marginBottom: '56px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    cursor: 'default',
    border: '1px solid #E2E8F0',
  },
  cardEmoji: {
    fontSize: '32px',
    lineHeight: '1',
    marginBottom: '4px',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: '1.6',
    margin: '0',
    flexGrow: 1,
  },
  cardLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: '14px',
    textDecoration: 'none',
    marginTop: '4px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0',
  },
  repoSection: {
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  repoHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 28px',
    borderBottom: '1px solid #E2E8F0',
    background: '#FAFBFF',
  },
  repoHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  repoTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0',
  },
  repoSubtitle: {
    fontSize: '13px',
    color: '#64748B',
    margin: '0',
  },
  repoViewAll: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4F46E5',
    background: 'none',
    border: '1px solid #C7D2FE',
    borderRadius: '8px',
    padding: '6px 14px',
    cursor: 'pointer',
  },
  repoBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
  },
  repoPanel: {
    padding: '24px 28px',
  },
  repoPanelRight: {
    padding: '24px 28px',
    borderLeft: '1px solid #E2E8F0',
    background: '#FAFBFF',
  },
  panelTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    margin: '0 0 16px',
  },
  alertCard: {
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '10px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  alertIcon: {
    fontSize: '18px',
    lineHeight: '1',
    marginTop: '2px',
    flexShrink: 0,
  },
  alertBody: {
    flex: 1,
    minWidth: 0,
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 3px',
  },
  alertDetail: {
    fontSize: '13px',
    color: '#64748B',
    margin: '0 0 8px',
    lineHeight: '1.4',
  },
  alertFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '999px',
  },
  alertAction: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4F46E5',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
  },
  docRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid #F1F5F9',
  },
  docIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  docName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1E293B',
    margin: '0',
    flex: 1,
  },
  docMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '3px',
  },
  docDate: {
    fontSize: '12px',
    color: '#94A3B8',
  },
  docTag: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6366F1',
    background: '#EEF2FF',
    padding: '2px 7px',
    borderRadius: '999px',
  },
  footer: {
    borderTop: '1px solid #E2E8F0',
    padding: '24px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#94A3B8',
    lineHeight: '1.6',
    background: '#ffffff',
  },
};

function ModuleCard({ module, onNavigate }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hovered
          ? '0 4px 12px rgba(79,70,229,0.12), 0 2px 4px rgba(0,0,0,0.06)'
          : styles.card.boxShadow,
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardEmoji}>{module.emoji}</div>
      <h2 style={styles.cardTitle}>{module.title}</h2>
      <p style={styles.cardDescription}>{module.description}</p>
      <button style={styles.cardLink} onClick={() => onNavigate(module.page)}>
        Get started →
      </button>
    </div>
  );
}

function AlertCard({ alert }) {
  const colors = alertColors[alert.type];
  return (
    <div style={{ ...styles.alertCard, background: colors.bg, borderColor: colors.border }}>
      <div style={styles.alertIcon}>{alert.icon}</div>
      <div style={styles.alertBody}>
        <p style={{ ...styles.alertTitle, color: colors.text }}>{alert.title}</p>
        <p style={styles.alertDetail}>{alert.detail}</p>
        <div style={styles.alertFooter}>
          <span style={{ ...styles.alertBadge, background: colors.badgeBg, color: colors.badge }}>
            {alert.dueLabel}
          </span>
          <button style={styles.alertAction}>{alert.action} →</button>
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "What's the difference between an LLC and a C-Corp?",
    a: "A C-Corp is the standard structure for VC-backed startups — it allows multiple share classes, unlimited investors, and clean equity grants. An LLC is more flexible for tax purposes (pass-through taxation) and easier to maintain, but can't issue preferred stock or accommodate most institutional investors. If you plan to raise venture capital, choose C-Corp.",
  },
  {
    q: "Do I need an 83(b) election? What happens if I miss it?",
    a: "Yes — if you receive restricted stock with a vesting schedule, you must file an 83(b) election with the IRS within 30 days of the grant. There are NO extensions and NO grace periods. Missing it means you'll owe ordinary income tax on the full value of your stock as it vests — which can be hundreds of thousands of dollars at Series A valuations.",
  },
  {
    q: "What is a BOI report and when do I need to file it?",
    a: "The Beneficial Ownership Information (BOI) report is required by FinCEN (the US Treasury's financial crimes unit) for all corporations and LLCs. You must file within 90 days of formation. The penalty for missing it is $500/day, up to $10,000, with potential prison time for willful violation. It's free to file at fincen.gov.",
  },
  {
    q: "Why do I keep hearing 'incorporate in Delaware'?",
    a: "Delaware has the most mature corporate law in the US, a dedicated business court (Court of Chancery), and is the standard for VC-backed companies. Most institutional investors expect Delaware C-Corps. If you're in California, you'll still need to register as a foreign corporation in CA and pay California's $800/year minimum franchise tax.",
  },
  {
    q: "What is a SAFE note and how does it work?",
    a: "A SAFE (Simple Agreement for Future Equity) is an investment instrument — not a loan — that converts to equity at your next priced round. Investors give you money now in exchange for shares later, typically at a discount or subject to a valuation cap. Unlike a convertible note, a SAFE has no interest rate and no maturity date. Y Combinator's post-money SAFE is the most common version.",
  },
  {
    q: "Do I need a 409A valuation before issuing stock options?",
    a: "Yes — always. A 409A is an independent appraisal of your company's fair market value. You must have one before granting any stock options. If you grant options below FMV without a valid 409A, option holders face immediate ordinary income tax plus a 20% IRS excise tax. Get a 409A before your first option grants and refresh it annually or after any material event.",
  },
  {
    q: "What's the California $800 minimum franchise tax?",
    a: "Every entity operating in California — LLC or corporation — owes California a minimum of $800/year in franchise tax, even if you have zero revenue. For LLCs formed after Jan 1, 2021, the first year is waived. If you incorporate in Delaware but operate out of California, you must register as a foreign corporation in CA and pay the $800/year anyway — in addition to Delaware fees.",
  },
  {
    q: "Can an S-Corp work for my startup?",
    a: "S-Corps work well for small, bootstrapped businesses with US citizen owners, but they have hard eligibility limits: no more than 100 shareholders, only one class of stock, and all shareholders must be US citizens or permanent residents. These restrictions make S-Corps incompatible with VC funding or international co-founders. If you plan to raise outside capital, choose C-Corp.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ background: '#ffffff', borderTop: '1px solid #E2E8F0', padding: '56px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', marginTop: 0 }}>
          FAQ
        </p>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', margin: '0 0 32px' }}>
          Common legal questions, answered plainly
        </h2>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{ borderBottom: '1px solid #F1F5F9', overflow: 'hidden' }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '18px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
                gap: '16px',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#1E293B', flex: 1 }}>
                {item.q}
              </span>
              <span style={{
                fontSize: '18px',
                color: '#4F46E5',
                flexShrink: 0,
                transform: openIndex === i ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.2s ease',
                lineHeight: 1,
              }}>
                +
              </span>
            </button>
            {openIndex === i && (
              <p style={{
                fontSize: '14px',
                color: '#64748B',
                lineHeight: '1.75',
                margin: '0 0 18px',
                paddingRight: '32px',
              }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage({ onNavigate }) {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Legal Foundry</h1>
        <p style={styles.tagline}>Your AI legal team. No billable hours.</p>
      </header>

      <main style={styles.main}>
        <p style={styles.sectionTitle}>Choose a module to get started</p>
        <div style={styles.grid}>
          {modules.map((mod) => (
            <ModuleCard key={mod.page} module={mod} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Document Repository */}
        <p style={{ ...styles.sectionTitle, marginBottom: '20px' }}>Document Repository & Compliance Alerts</p>
        <div style={styles.repoSection}>
          <div style={styles.repoHeader}>
            <div style={styles.repoHeaderLeft}>
              <span style={{ fontSize: '24px' }}>🗄️</span>
              <div>
                <h2 style={styles.repoTitle}>Document Repository</h2>
                <p style={styles.repoSubtitle}>All your legal documents + upcoming deadlines in one place</p>
              </div>
            </div>
            <button style={styles.repoViewAll} onClick={() => onNavigate('documents')}>
              View all documents →
            </button>
          </div>

          <div style={styles.repoBody}>
            {/* Left: Alerts */}
            <div style={styles.repoPanel}>
              <p style={styles.panelTitle}>🔔 Action Required</p>
              {mockAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>

            {/* Right: Recent Documents */}
            <div style={styles.repoPanelRight}>
              <p style={styles.panelTitle}>📁 Recent Documents</p>
              {mockDocs.map((doc, i) => (
                <div key={i} style={{ ...styles.docRow, borderBottom: i < mockDocs.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={styles.docIcon}>{doc.icon}</span>
                  <p style={styles.docName}>{doc.name}</p>
                  <div style={styles.docMeta}>
                    <span style={styles.docDate}>{doc.date}</span>
                    <span style={styles.docTag}>{doc.tag}</span>
                  </div>
                </div>
              ))}
              <button
                style={{ ...styles.cardLink, marginTop: '16px', fontSize: '13px' }}
                onClick={() => onNavigate('documents')}
              >
                Upload a document →
              </button>
            </div>
          </div>
        </div>
      </main>

      <FAQ />

      <footer style={styles.footer}>
        Legal Foundry is not a law firm and does not provide legal advice. Always consult a qualified attorney for legal decisions.
      </footer>
    </div>
  );
}
