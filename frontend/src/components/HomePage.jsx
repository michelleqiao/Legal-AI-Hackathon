import React from 'react';

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
    emoji: '💡',
    title: 'Patents & IP',
    description: 'Understand what to protect and how to secure your intellectual property.',
    page: 'patents',
  },
  {
    emoji: '💰',
    title: 'Fundraising',
    description: 'Generate term sheets, understand SAFEs, and know your terms before you sign.',
    page: 'fundraising',
  },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1E293B',
  },
  header: {
    padding: '48px 24px 40px',
    textAlign: 'center',
    borderBottom: '1px solid #E2E8F0',
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
    maxWidth: '900px',
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
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#F8FAFC',
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
    fontSize: '36px',
    lineHeight: '1',
    marginBottom: '4px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1E293B',
    margin: '0',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: '1.6',
    margin: '0',
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
  footer: {
    borderTop: '1px solid #E2E8F0',
    padding: '24px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#94A3B8',
    lineHeight: '1.6',
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
      </main>

      <footer style={styles.footer}>
        Legal Foundry is not a law firm and does not provide legal advice. Always consult a qualified attorney for legal decisions.
      </footer>
    </div>
  );
}
