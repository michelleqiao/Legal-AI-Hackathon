import React, { useState } from 'react';

const MOCK_DOCUMENTS = [
  {
    id: 1,
    icon: '📄',
    name: 'Articles of Incorporation',
    category: 'Incorporation',
    date: 'Mar 12, 2025',
    status: 'active',
    expiresAt: null,
    size: '42 KB',
  },
  {
    id: 2,
    icon: '🤝',
    name: 'NDA — Acme Corp',
    category: 'NDA',
    date: 'Jan 8, 2025',
    status: 'expiring',
    expiresAt: 'May 11, 2025',
    size: '28 KB',
  },
  {
    id: 3,
    icon: '📝',
    name: 'Contractor Agreement — Dev Team',
    category: 'Service',
    date: 'Feb 20, 2025',
    status: 'active',
    expiresAt: 'Feb 20, 2026',
    size: '55 KB',
  },
  {
    id: 4,
    icon: '💡',
    name: 'Provisional Patent Application',
    category: 'IP',
    date: 'Mar 28, 2025',
    status: 'active',
    expiresAt: 'Mar 28, 2026',
    size: '118 KB',
  },
  {
    id: 5,
    icon: '👥',
    name: 'Employment Agreement — Jane Smith',
    category: 'Employment',
    date: 'Apr 1, 2025',
    status: 'active',
    expiresAt: null,
    size: '63 KB',
  },
  {
    id: 6,
    icon: '💰',
    name: 'SAFE Note — Seed Round',
    category: 'Fundraising',
    date: 'Apr 5, 2025',
    status: 'active',
    expiresAt: null,
    size: '34 KB',
  },
];

const ALERTS = [
  {
    id: 1,
    type: 'urgent',
    icon: '🚨',
    title: '83(b) Election Due Soon',
    detail: 'Stock grant issued Apr 1, 2025. You must file an 83(b) election with the IRS within 30 days. There are NO extensions and NO grace periods.',
    due: 'Due May 1, 2025',
    link: 'https://www.irs.gov/pub/irs-pdf/f83b.pdf',
    linkLabel: 'Download IRS Form',
  },
  {
    id: 2,
    type: 'urgent',
    icon: '⚠️',
    title: 'BOI Report Not Filed',
    detail: 'All corporations and LLCs must file a Beneficial Ownership Information report with FinCEN within 90 days of formation. Penalty: $500/day.',
    due: 'Due Jun 15, 2025',
    link: 'https://www.fincen.gov/boi',
    linkLabel: 'File at FinCEN →',
  },
  {
    id: 3,
    type: 'warning',
    icon: '📋',
    title: 'NDA with Acme Corp — Expiring in 30 Days',
    detail: 'Your mutual NDA with Acme Corp expires May 11, 2025. Decide whether to renew, renegotiate, or let it expire.',
    due: 'Expires May 11, 2025',
    link: null,
    linkLabel: null,
  },
  {
    id: 4,
    type: 'warning',
    icon: '📬',
    title: 'CA Statement of Information Due',
    detail: 'California requires all corporations to file a Statement of Information (SI-550) annually. $25 fee. $250 late penalty.',
    due: 'Due Jun 12, 2025',
    link: 'https://bizfileonline.sos.ca.gov/',
    linkLabel: 'File with CA SOS →',
  },
  {
    id: 5,
    type: 'info',
    icon: '🗂️',
    title: 'Delaware Franchise Tax & Annual Report',
    detail: 'Delaware requires all corps to file an annual report and pay franchise tax by March 1 each year.',
    due: 'Due Mar 1, 2026',
    link: 'https://corp.delaware.gov/paytaxes.shtml',
    linkLabel: 'Pay at Delaware →',
  },
  {
    id: 6,
    type: 'info',
    icon: '📊',
    title: '409A Valuation Reminder',
    detail: 'Before issuing any stock options, you need a valid 409A independent valuation. Without one, option holders face immediate income tax + 20% excise tax.',
    due: 'Before any option grants',
    link: null,
    linkLabel: null,
  },
];

const CATEGORIES = ['All', 'Meeting Notes', 'Incorporation', 'NDA', 'Service', 'Employment', 'IP', 'Fundraising'];

const alertColors = {
  urgent: { bg: '#FEF2F2', border: '#FECACA', badge: '#DC2626', badgeBg: '#FEE2E2', text: '#991B1B' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', badge: '#D97706', badgeBg: '#FEF3C7', text: '#92400E' },
  info: { bg: '#F0F9FF', border: '#BAE6FD', badge: '#0284C7', badgeBg: '#E0F2FE', text: '#0C4A6E' },
};

const statusConfig = {
  active: { color: '#16A34A', bg: '#DCFCE7', label: 'Active' },
  expiring: { color: '#D97706', bg: '#FEF3C7', label: 'Expiring Soon' },
  expired: { color: '#DC2626', bg: '#FEE2E2', label: 'Expired' },
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1E293B',
  },
  header: {
    background: '#ffffff',
    borderBottom: '1px solid #E2E8F0',
    padding: '20px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#64748B',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0',
    fontWeight: '500',
  },
  title: { fontSize: '20px', fontWeight: '700', color: '#1E293B', margin: '0' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: '4px 0 0' },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '36px 24px 80px',
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '28px',
    alignItems: 'start',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    margin: '0 0 16px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  cardPad: { padding: '20px 24px' },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 24px',
    borderBottom: '1px solid #F1F5F9',
    flexWrap: 'wrap',
  },
  filterChip: {
    fontSize: '13px',
    fontWeight: '500',
    padding: '5px 12px',
    borderRadius: '999px',
    border: '1px solid #E2E8F0',
    background: '#F8FAFC',
    cursor: 'pointer',
    color: '#64748B',
  },
  filterChipActive: {
    background: '#EEF2FF',
    border: '1px solid #C7D2FE',
    color: '#4F46E5',
    fontWeight: '600',
  },
  uploadBtn: {
    marginLeft: 'auto',
    background: '#4F46E5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  docRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 24px',
    borderBottom: '1px solid #F8FAFC',
    transition: 'background 0.1s ease',
    cursor: 'pointer',
  },
  docIcon: { fontSize: '22px', flexShrink: 0 },
  docBody: { flex: 1, minWidth: 0 },
  docName: { fontSize: '14px', fontWeight: '600', color: '#1E293B', margin: '0 0 2px' },
  docMeta: { fontSize: '12px', color: '#94A3B8', margin: '0' },
  docRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '999px',
  },
  catTag: {
    fontSize: '11px',
    color: '#6366F1',
    background: '#EEF2FF',
    padding: '2px 7px',
    borderRadius: '999px',
    fontWeight: '600',
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '14px',
  },
  alertCard: {
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '10px',
    border: '1px solid',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '6px',
  },
  alertTitle: { fontSize: '13px', fontWeight: '600', margin: '0' },
  alertDetail: { fontSize: '12px', color: '#64748B', margin: '0 0 8px', lineHeight: '1.5' },
  alertFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  alertBadge: { fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '999px' },
  alertLink: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#4F46E5',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
  },
};

function AlertCard({ alert }) {
  const c = alertColors[alert.type];
  return (
    <div style={{ ...styles.alertCard, background: c.bg, borderColor: c.border }}>
      <div style={styles.alertHeader}>
        <span style={{ fontSize: '16px' }}>{alert.icon}</span>
        <p style={{ ...styles.alertTitle, color: c.text }}>{alert.title}</p>
      </div>
      <p style={styles.alertDetail}>{alert.detail}</p>
      <div style={styles.alertFooter}>
        <span style={{ ...styles.alertBadge, background: c.badgeBg, color: c.badge }}>
          {alert.due}
        </span>
        {alert.link && (
          <a href={alert.link} target="_blank" rel="noopener noreferrer" style={styles.alertLink}>
            {alert.linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function DocRow({ doc }) {
  const [hovered, setHovered] = useState(false);
  const sc = statusConfig[doc.status];
  return (
    <div
      style={{ ...styles.docRow, background: hovered ? '#F8FAFC' : '#ffffff' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={styles.docIcon}>{doc.icon}</span>
      <div style={styles.docBody}>
        <p style={styles.docName}>{doc.name}</p>
        <p style={styles.docMeta}>
          Added {doc.date}{doc.expiresAt ? ` · Expires ${doc.expiresAt}` : ''} · {doc.size}
        </p>
      </div>
      <div style={styles.docRight}>
        <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
          {sc.label}
        </span>
        <span style={styles.catTag}>{doc.category}</span>
      </div>
    </div>
  );
}

export default function DocumentRepositoryPage({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('All');

  // Pull saved meeting notes from localStorage and merge with mock docs
  const savedMeetings = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('lf_meeting_notes') || '[]');
    } catch { return []; }
  }, []);

  const allDocs = React.useMemo(() => {
    const meetingDocs = savedMeetings.map((m, i) => ({
      id: `meeting-${m.id || i}`,
      icon: '🎙️',
      name: m.title,
      category: 'Meeting Notes',
      date: m.date || 'Recently',
      status: 'active',
      expiresAt: null,
      size: '—',
    }));
    return [...meetingDocs, ...MOCK_DOCUMENTS];
  }, [savedMeetings]);

  const filtered = activeFilter === 'All'
    ? allDocs
    : allDocs.filter((d) => d.category === activeFilter);

  const urgentCount = ALERTS.filter((a) => a.type === 'urgent').length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div>
          <h1 style={styles.title}>🗄️ Document Repository</h1>
          <p style={styles.subtitle}>All your legal documents and compliance alerts in one place</p>
        </div>
      </header>

      <main style={styles.main}>
        {/* Left: Documents */}
        <div>
          <p style={styles.sectionTitle}>Your Documents ({allDocs.length})</p>
          <div style={styles.card}>
            <div style={styles.filterRow}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  style={{
                    ...styles.filterChip,
                    ...(activeFilter === cat ? styles.filterChipActive : {}),
                  }}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
              <button style={styles.uploadBtn}>+ Upload Document</button>
            </div>

            {filtered.length === 0 ? (
              <div style={styles.emptyState}>No documents in this category yet.</div>
            ) : (
              filtered.map((doc) => <DocRow key={doc.id} doc={doc} />)
            )}
          </div>
        </div>

        {/* Right: Alerts */}
        <div>
          <p style={styles.sectionTitle}>
            🔔 Action Required
            {urgentCount > 0 && (
              <span style={{
                background: '#DC2626',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '700',
                padding: '1px 7px',
                borderRadius: '999px',
                marginLeft: '8px',
                verticalAlign: 'middle',
              }}>
                {urgentCount} urgent
              </span>
            )}
          </p>
          {ALERTS.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </main>
    </div>
  );
}
