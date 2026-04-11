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

export function getRecommendation(answers) {
  return post('/recommend', { answers });
}

export function draftAgreement(type, answers) {
  return post('/draft-agreement', { type, answers });
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
