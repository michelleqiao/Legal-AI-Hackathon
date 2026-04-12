import React, { useState } from 'react';
import { draftAgreement, exportToPdf } from '../api.js';
import ChatBox from './ChatBox.jsx';
import DocumentEditor from './DocumentEditor.jsx';

// Base service fields — labels may be adjusted based on perspective
const SERVICE_FIELDS_BASE = [
  {
    id: 'client_name',
    label: 'Client name',
    labelProvider: "Client's name",
    placeholder: 'e.g. Acme Corp',
    type: 'text',
    section: 'parties',
  },
  {
    id: 'provider_name',
    label: 'Service provider name',
    labelProvider: 'Your name / company name (as provider)',
    placeholder: 'e.g. Jane Smith Consulting LLC',
    type: 'text',
    section: 'parties',
  },
  {
    id: 'provider_scope',
    label: "Provider's scope of work",
    labelProvider: 'Your scope of work (what you will deliver)',
    placeholder: 'Describe what the provider will do, deliver, or produce — be specific (e.g. "Design and develop a 5-page marketing website including homepage, about, services, portfolio, and contact page")',
    type: 'textarea',
    section: 'scope',
  },
  {
    id: 'client_scope',
    label: "Client's obligations",
    labelProvider: "Client's obligations to you",
    placeholder: 'What must the client provide or do for the project to succeed? (e.g. "Provide brand assets, copy, and written feedback within 5 business days of each milestone")',
    type: 'textarea',
    section: 'scope',
  },
  {
    id: 'start_date',
    label: 'Project start date',
    placeholder: 'e.g. May 1, 2025',
    type: 'text',
    section: 'timeline',
  },
  {
    id: 'end_date',
    label: 'Project end date / deadline',
    placeholder: 'e.g. June 30, 2025 or "Upon completion of all milestones"',
    type: 'text',
    section: 'timeline',
  },
  {
    id: 'payment_terms',
    label: 'Payment terms',
    placeholder: 'e.g. $5,000 total — $2,500 upfront, $2,500 on delivery. Net 15 invoice terms.',
    type: 'text',
    section: 'payment',
  },
  {
    id: 'ip_ownership',
    label: 'Who owns the work product?',
    placeholder: 'e.g. Client owns all deliverables upon final payment / Provider retains ownership and grants a perpetual license to client',
    type: 'text',
    section: 'payment',
  },
  {
    id: 'confidentiality',
    label: 'Is confidentiality needed?',
    type: 'select',
    options: ['Yes — mutual NDA', 'Yes — one-way (client to provider)', 'Yes — one-way (provider to client)', 'No'],
    section: 'other',
  },
];

const EMPLOYMENT_FIELDS = [
  { id: 'employee_name', label: 'Employee name', placeholder: 'e.g. Alex Johnson', type: 'text' },
  { id: 'company_name', label: 'Company name', placeholder: 'e.g. Legal Foundry Inc.', type: 'text' },
  { id: 'role_title', label: 'Role title', placeholder: 'e.g. Senior Software Engineer', type: 'text' },
  { id: 'salary', label: 'Annual salary', placeholder: 'e.g. $120,000', type: 'text' },
  { id: 'start_date', label: 'Start date', placeholder: 'e.g. February 1, 2025', type: 'text' },
  { id: 'equity', label: 'Equity offered', placeholder: 'e.g. 0.5% over 4 years with 1-year cliff, or None', type: 'text' },
  {
    id: 'non_compete',
    label: 'Non-compete clause needed?',
    type: 'select',
    options: ['Yes', 'No', 'Non-solicitation only (no full non-compete)'],
  },
  {
    id: 'ip_assignment',
    label: 'IP assignment?',
    type: 'select',
    options: ['Yes — all work-related IP assigned to company', 'Yes — with carve-out for pre-existing personal projects', 'No'],
  },
];

const commonStyles = {
  page: {
    minHeight: '100vh',
    background: 'var(--lf-cream)',
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--lf-text)',
  },
  topBar: {
    background: 'var(--lf-white)',
    borderBottom: '1px solid var(--lf-border)',
    padding: '18px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'var(--lf-text-muted)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontFamily: "'DM Sans', sans-serif",
  },
  topBarTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--lf-navy)',
  },
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 40px 80px',
  },
  pageTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--lf-navy)',
    marginBottom: '8px',
  },
  pageSubtitle: {
    color: 'var(--lf-text-muted)',
    fontSize: '15px',
    marginBottom: '36px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--lf-text)',
    marginBottom: '6px',
    fontFamily: "'DM Sans', sans-serif",
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(15,26,46,0.15)',
    background: 'var(--lf-white)',
    fontSize: '14px',
    color: 'var(--lf-text)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(15,26,46,0.15)',
    background: 'var(--lf-white)',
    fontSize: '14px',
    color: 'var(--lf-text)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    resize: 'vertical',
    minHeight: '90px',
    boxSizing: 'border-box',
    lineHeight: '1.5',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(15,26,46,0.15)',
    fontSize: '14px',
    color: 'var(--lf-text)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    background: 'var(--lf-white)',
    boxSizing: 'border-box',
  },
  primaryButton: {
    padding: '12px 28px',
    background: 'var(--lf-navy)',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--lf-cream)',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  primaryButtonDisabled: {
    background: 'rgba(15,26,46,0.25)',
    cursor: 'not-allowed',
  },
  pdfButton: {
    padding: '10px 20px',
    background: 'none',
    border: '1px solid var(--lf-navy)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--lf-navy)',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(15,26,46,0.08)',
    borderTop: '3px solid var(--lf-warm)',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: 'var(--lf-text-muted)',
    fontSize: '16px',
  },
  draftHeader: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: 'var(--lf-navy)',
  },
  errorBanner: {
    borderLeft: '3px solid var(--lf-red-soft)',
    background: '#FEF2F2',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#DC2626',
    marginBottom: '20px',
  },
  secondaryButton: {
    padding: '10px 20px',
    background: 'none',
    border: '1px solid rgba(15,26,46,0.2)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--lf-text-muted)',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: '16px',
  },
  // Type selection cards
  typeSelectionWrap: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  typeCard: {
    flex: '1',
    minWidth: '220px',
    padding: '24px 20px',
    border: '1px solid var(--lf-border)',
    background: 'var(--lf-white)',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.15s, background 0.15s',
  },
  typeCardSelected: {
    border: '1px solid var(--lf-warm)',
    background: 'var(--lf-cream)',
  },
  typeCardIcon: {
    fontSize: '28px',
    marginBottom: '10px',
    display: 'block',
  },
  typeCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--lf-navy)',
    marginBottom: '6px',
    lineHeight: '1.3',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  typeCardSubtitle: {
    fontSize: '13px',
    color: 'var(--lf-text-muted)',
    lineHeight: '1.5',
  },
};

export default function AgreementsPage({ type, onBack }) {
  const isService = type === 'service';

  // Service perspective state — only relevant for service agreements
  const [servicePerspective, setServicePerspective] = useState(null); // null | 'client' | 'provider'
  const [perspectiveChosen, setPerspectiveChosen] = useState(false);

  // Build fields dynamically based on perspective
  const fields = isService
    ? SERVICE_FIELDS_BASE.map((f) => ({
        ...f,
        label: servicePerspective === 'provider' && f.labelProvider ? f.labelProvider : f.label,
      }))
    : EMPLOYMENT_FIELDS;

  const title = isService ? '📝 Service Agreement' : '👥 Employment Agreement';
  const agreementTitle = isService
    ? servicePerspective === 'provider'
      ? 'Service Agreement (Provider)'
      : 'Service Agreement (Client)'
    : 'Employment Agreement';

  const subtitle = isService
    ? servicePerspective === 'provider'
      ? "Fill in the details below and we'll draft a service agreement that protects you as the provider."
      : "Fill in the details below and we'll draft a legally sound service agreement for you."
    : "Fill in the details below and we'll draft an employment agreement tailored to your hire.";

  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(
      (isService ? SERVICE_FIELDS_BASE : EMPLOYMENT_FIELDS).map((f) => [f.id, ''])
    )
  );
  const [phase, setPhase] = useState('form'); // 'form' | 'loading' | 'result'
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [pdfError, setPdfError] = useState('');

  function handleChange(id, value) {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  }

  function isFormValid() {
    return fields.every((f) => formValues[f.id]?.trim());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid()) return;
    setPhase('loading');
    setError('');
    try {
      const answers = {
        ...formValues,
        ...(isService && servicePerspective === 'provider' ? { perspective: 'provider' } : {}),
      };
      const data = await draftAgreement(type, answers);
      const text = data.draft || data.agreement || data.content || data.document || JSON.stringify(data, null, 2);
      setDraft(text);
      setPhase('result');
    } catch (err) {
      setError('Something went wrong drafting your agreement. Please try again.');
      setPhase('form');
    }
  }

  function handleReset() {
    setPhase('form');
    setDraft('');
    setError('');
    setShowChat(false);
    setPdfError('');
    if (isService) {
      setServicePerspective(null);
      setPerspectiveChosen(false);
    }
  }

  // Loading screen
  if (phase === 'loading') {
    return (
      <div style={commonStyles.page}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={commonStyles.topBar}>
          <button style={commonStyles.backButton} onClick={onBack}>← Back</button>
          <span style={commonStyles.topBarTitle}>{title}</span>
        </div>
        <div style={commonStyles.main}>
          <div style={commonStyles.loadingState}>
            <div style={commonStyles.spinner} />
            <p style={commonStyles.loadingText}>Drafting your agreement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (phase === 'result') {
    return (
      <div style={commonStyles.page}>
        <div style={commonStyles.topBar}>
          <button style={commonStyles.backButton} onClick={onBack}>← Back</button>
          <span style={commonStyles.topBarTitle}>{title}</span>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 40px 80px' }}>
          <h1 style={commonStyles.pageTitle}>Your draft is ready</h1>
          <p style={{ color: 'var(--lf-text-muted)', fontSize: '15px', marginBottom: '24px' }}>
            Review the agreement below. You can edit, comment, and download directly.
          </p>

          <p style={commonStyles.draftHeader}>{agreementTitle}</p>

          {pdfError && <div style={commonStyles.errorBanner}>{pdfError}</div>}

          <DocumentEditor content={draft} title={agreementTitle} />

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {!showChat && (
              <button style={commonStyles.primaryButton} onClick={() => setShowChat(true)}>
                Refine with AI chat
              </button>
            )}
          </div>

          {showChat && (
            <ChatBox
              module={type === 'service' ? 'service-agreements' : 'employment-agreements'}
              context={{ type, draft, answers: formValues }}
            />
          )}

          <div>
            <button style={commonStyles.secondaryButton} onClick={handleReset}>
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Service perspective selection (shown before form for service agreements)
  if (isService && !perspectiveChosen) {
    return (
      <div style={commonStyles.page}>
        <div style={commonStyles.topBar}>
          <button style={commonStyles.backButton} onClick={onBack}>← Back</button>
          <span style={commonStyles.topBarTitle}>{title}</span>
        </div>
        <div style={commonStyles.main}>
          <h1 style={commonStyles.pageTitle}>📝 Service Agreement</h1>
          <p style={{ color: 'var(--lf-text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
            Which best describes your situation?
          </p>

          <div style={commonStyles.typeSelectionWrap}>
            {/* Client card */}
            <button
              style={{
                ...commonStyles.typeCard,
                ...(servicePerspective === 'client' ? commonStyles.typeCardSelected : {}),
              }}
              onClick={() => setServicePerspective('client')}
            >
              <span style={commonStyles.typeCardIcon}>🤝</span>
              <p style={{
                ...commonStyles.typeCardTitle,
                color: servicePerspective === 'client' ? 'var(--lf-navy)' : 'var(--lf-navy)',
              }}>
                I need to hire someone
              </p>
              <p style={commonStyles.typeCardSubtitle}>
                I'm the client receiving services — get a contract protecting you when you bring in a contractor or vendor
              </p>
            </button>

            {/* Provider card */}
            <button
              style={{
                ...commonStyles.typeCard,
                ...(servicePerspective === 'provider' ? commonStyles.typeCardSelected : {}),
              }}
              onClick={() => setServicePerspective('provider')}
            >
              <span style={commonStyles.typeCardIcon}>💼</span>
              <p style={{
                ...commonStyles.typeCardTitle,
                color: servicePerspective === 'provider' ? 'var(--lf-navy)' : 'var(--lf-navy)',
              }}>
                I'm being hired for work
              </p>
              <p style={commonStyles.typeCardSubtitle}>
                I'm the provider giving services — get a contract protecting you when you're hired for a project
              </p>
            </button>
          </div>

          <button
            style={{
              ...commonStyles.primaryButton,
              ...(servicePerspective ? {} : commonStyles.primaryButtonDisabled),
            }}
            disabled={!servicePerspective}
            onClick={() => {
              if (servicePerspective) setPerspectiveChosen(true);
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div style={commonStyles.page}>
      <div style={commonStyles.topBar}>
        <button
          style={commonStyles.backButton}
          onClick={() => {
            if (isService && perspectiveChosen) {
              setPerspectiveChosen(false);
            } else {
              onBack();
            }
          }}
        >
          ← Back
        </button>
        <span style={commonStyles.topBarTitle}>{title}</span>
      </div>
      <div style={commonStyles.main}>
        <h1 style={commonStyles.pageTitle}>{title}</h1>
        <p style={commonStyles.pageSubtitle}>{subtitle}</p>

        {error && <div style={commonStyles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {isService ? (
            // Service form: render with section headers
            (() => {
              const sectionMeta = {
                parties: { label: '👤 Parties', desc: 'Who is involved in this agreement?' },
                scope: { label: '📋 Scope of Work', desc: 'What each party is responsible for' },
                timeline: { label: '📅 Timeline', desc: 'Start and end dates for the project' },
                payment: { label: '💰 Payment & IP', desc: 'Compensation and ownership of deliverables' },
                other: { label: '🔒 Additional Terms', desc: 'Confidentiality and other clauses' },
              };
              const seenSections = new Set();
              return fields.map((field) => {
                const showHeader = field.section && !seenSections.has(field.section);
                if (field.section) seenSections.add(field.section);
                const meta = field.section ? sectionMeta[field.section] : null;
                return (
                  <React.Fragment key={field.id}>
                    {showHeader && meta && (
                      <div style={{ margin: '28px 0 16px', paddingTop: seenSections.size > 1 ? '12px' : '0', borderTop: seenSections.size > 1 ? '1px solid var(--lf-border)' : 'none' }}>
                        <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--lf-warm)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'DM Sans', sans-serif" }}>{meta.label}</p>
                        <p style={{ fontSize: '13px', color: 'var(--lf-text-muted)', margin: '0 0 14px' }}>{meta.desc}</p>
                      </div>
                    )}
                    <div style={commonStyles.formGroup}>
                      <label style={commonStyles.label} htmlFor={field.id}>{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea id={field.id} style={commonStyles.textarea} placeholder={field.placeholder} value={formValues[field.id]} onChange={(e) => handleChange(field.id, e.target.value)} />
                      ) : field.type === 'select' ? (
                        <select id={field.id} style={commonStyles.select} value={formValues[field.id]} onChange={(e) => handleChange(field.id, e.target.value)}>
                          <option value="">Select an option...</option>
                          {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input id={field.id} type="text" style={commonStyles.input} placeholder={field.placeholder} value={formValues[field.id]} onChange={(e) => handleChange(field.id, e.target.value)} />
                      )}
                    </div>
                  </React.Fragment>
                );
              });
            })()
          ) : (
            // Employment form: plain fields
            fields.map((field) => (
              <div key={field.id} style={commonStyles.formGroup}>
                <label style={commonStyles.label} htmlFor={field.id}>
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    style={commonStyles.textarea}
                    placeholder={field.placeholder}
                    value={formValues[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.id}
                    style={commonStyles.select}
                    value={formValues[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  >
                    <option value="">Select an option...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={field.id}
                    type="text"
                    style={commonStyles.input}
                    placeholder={field.placeholder}
                    value={formValues[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                )}
              </div>
            ))
          )}

          <button
            type="submit"
            style={{
              ...commonStyles.primaryButton,
              ...(isFormValid() ? {} : commonStyles.primaryButtonDisabled),
            }}
            disabled={!isFormValid()}
          >
            Draft my agreement →
          </button>
        </form>
      </div>
    </div>
  );
}
