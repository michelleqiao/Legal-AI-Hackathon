import React, { useState } from 'react';
import { draftAgreement } from '../api.js';
import ChatBox from './ChatBox.jsx';

const SERVICE_FIELDS = [
  { id: 'client_name', label: 'Client name', placeholder: 'e.g. Acme Corp', type: 'text' },
  { id: 'provider_name', label: 'Service provider name', placeholder: 'e.g. Jane Smith / Your LLC', type: 'text' },
  { id: 'scope_of_work', label: 'Scope of work', placeholder: 'Describe the services to be provided...', type: 'textarea' },
  { id: 'payment_terms', label: 'Payment terms', placeholder: 'e.g. $5,000 due upon completion / $2,500 upfront + $2,500 on delivery', type: 'text' },
  { id: 'timeline', label: 'Project timeline', placeholder: 'e.g. 6 weeks starting January 15', type: 'text' },
  { id: 'ip_ownership', label: 'Who owns the work product?', placeholder: 'e.g. Client owns all deliverables / Provider retains ownership, grants license', type: 'text' },
  {
    id: 'confidentiality',
    label: 'Is confidentiality needed?',
    type: 'select',
    options: ['Yes — mutual NDA', 'Yes — one-way (client to provider)', 'Yes — one-way (provider to client)', 'No'],
  },
];

const EMPLOYMENT_FIELDS = [
  { id: 'employee_name', label: 'Employee name', placeholder: 'e.g. Alex Johnson', type: 'text' },
  { id: 'company_name', label: 'Company name', placeholder: 'e.g. StartStack Inc.', type: 'text' },
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
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1E293B',
  },
  topBar: {
    padding: '16px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0',
    fontFamily: 'inherit',
  },
  topBarTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1E293B',
  },
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  pageSubtitle: {
    color: '#64748B',
    fontSize: '15px',
    marginBottom: '36px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '90px',
    boxSizing: 'border-box',
    lineHeight: '1.5',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    background: '#ffffff',
    boxSizing: 'border-box',
  },
  primaryButton: {
    padding: '12px 28px',
    background: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  primaryButtonDisabled: {
    background: '#C7D2FE',
    cursor: 'not-allowed',
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #E2E8F0',
    borderTop: '3px solid #4F46E5',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#64748B',
    fontSize: '16px',
  },
  draftBox: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '28px',
    maxHeight: '520px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    fontSize: '13.5px',
    lineHeight: '1.75',
    color: '#334155',
    fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
    marginBottom: '12px',
  },
  draftHeader: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1E293B',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  errorBanner: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#DC2626',
    marginBottom: '20px',
  },
  secondaryButton: {
    padding: '10px 20px',
    background: '#ffffff',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748B',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: '16px',
  },
};

export default function AgreementsPage({ type, onBack }) {
  const isService = type === 'service';
  const fields = isService ? SERVICE_FIELDS : EMPLOYMENT_FIELDS;
  const title = isService ? '📝 Service Agreement' : '👥 Employment Agreement';
  const subtitle = isService
    ? 'Fill in the details below and we\'ll draft a legally sound service agreement for you.'
    : 'Fill in the details below and we\'ll draft an employment agreement tailored to your hire.';

  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.id, '']))
  );
  const [phase, setPhase] = useState('form'); // 'form' | 'loading' | 'result'
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

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
      const data = await draftAgreement(type, formValues);
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
  }

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

  if (phase === 'result') {
    return (
      <div style={commonStyles.page}>
        <div style={commonStyles.topBar}>
          <button style={commonStyles.backButton} onClick={onBack}>← Back</button>
          <span style={commonStyles.topBarTitle}>{title}</span>
        </div>
        <div style={commonStyles.main}>
          <h1 style={commonStyles.pageTitle}>Your draft is ready</h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '24px' }}>
            Review the agreement below. You can ask follow-up questions to refine specific clauses.
          </p>

          <p style={commonStyles.draftHeader}>Draft Agreement</p>
          <div style={commonStyles.draftBox}>{draft}</div>

          {!showChat && (
            <button style={commonStyles.primaryButton} onClick={() => setShowChat(true)}>
              Refine with AI chat
            </button>
          )}

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

  return (
    <div style={commonStyles.page}>
      <div style={commonStyles.topBar}>
        <button style={commonStyles.backButton} onClick={onBack}>← Back</button>
        <span style={commonStyles.topBarTitle}>{title}</span>
      </div>
      <div style={commonStyles.main}>
        <h1 style={commonStyles.pageTitle}>{title}</h1>
        <p style={commonStyles.pageSubtitle}>{subtitle}</p>

        {error && <div style={commonStyles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
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
          ))}

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
