const BASE_URL = 'http://localhost:8000';

async function post(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }
  return response.json();
}

export function getRecommendation(answers, vaultContext = '') {
  return post('/recommend', { answers, vault_context: vaultContext });
}

export function draftAgreement(type, answers, vaultContext = '') {
  return post('/draft-agreement', { type, answers, vault_context: vaultContext });
}

export function editSection(sectionText, instruction, documentContext = '', vaultContext = '') {
  return post('/edit-section', {
    section_text: sectionText,
    instruction,
    document_context: documentContext,
    vault_context: vaultContext,
  });
}

export function getPatentGuidance(description) {
  return post('/patent-guidance', { description });
}

export function generateTermsheet(details) {
  return post('/generate-termsheet', { details });
}

export function chat(module, context, history, message) {
  return post('/chat', { module, context, history, message });
}

export async function exportToPdf(title, content) {
  const response = await fetch(`${BASE_URL}/export-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) throw new Error('PDF export failed');
  return response.blob(); // returns a PDF blob for download
}

export function generateFilingDoc(entity, state, formData) {
  return post('/generate-filing-doc', { entity, state, form_data: formData });
}

export function generatePatentApp(guidance, filingDetails) {
  return post('/generate-patent-app', { guidance, filing_details: filingDetails });
}

export function summarizeMeeting(title, attendees, notes) {
  return post('/summarize-meeting', { title, attendees, notes });
}
