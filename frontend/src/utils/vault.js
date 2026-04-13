// Legal Foundry — Vault utilities
// Stores documents to localStorage under key 'lf_vault_docs'

const VAULT_KEY = 'lf_vault_docs';
const DEMO_SEEDED_KEY = 'lf_vault_demo_seeded';

/**
 * Save or update a document in the vault.
 * doc shape: { id, name, category, content, date, source, icon? }
 */
export function saveToVault(doc) {
  const docs = getAllVaultDocs();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) {
    docs[idx] = doc;
  } else {
    docs.unshift(doc);
  }
  localStorage.setItem(VAULT_KEY, JSON.stringify(docs));
  return doc;
}

/** Return all vault documents (newest first). */
export function getAllVaultDocs() {
  try {
    return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Delete a document from the vault by id. */
export function deleteVaultDoc(id) {
  const docs = getAllVaultDocs().filter((d) => d.id !== id);
  localStorage.setItem(VAULT_KEY, JSON.stringify(docs));
}

/**
 * Find vault documents that mention all of the given party names (case-insensitive)
 * and optionally match a specific category.
 * partyNames: string[] — e.g. ['Acme', 'Jane Smith']
 * category: string | null — e.g. 'NDA'
 */
export function findRelatedDocsByParties(partyNames, category = null) {
  const docs = getAllVaultDocs();
  return docs.filter((doc) => {
    if (category && doc.category !== category) return false;
    const searchable = (doc.name + ' ' + doc.content).toLowerCase();
    return partyNames.every((name) => name.trim().length > 1 && searchable.includes(name.trim().toLowerCase()));
  });
}

/**
 * Seed the vault with demo documents for the hackathon demo.
 * Only runs once — subsequent calls are no-ops.
 */
export function seedDemoVault() {
  if (localStorage.getItem(DEMO_SEEDED_KEY)) return;

  const demoNDA = {
    id: 'demo-nda-acme-jane',
    name: 'Mutual NDA — Acme Corp & Jane Smith',
    category: 'NDA',
    icon: '🤝',
    status: 'active',
    expiresAt: 'December 31, 2027',
    date: 'Jan 15, 2025',
    source: 'upload',
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of January 15, 2025 ("Effective Date") between:

PARTY A: Acme Corp, a Delaware corporation with offices at 100 Silicon Valley Blvd, San Jose, CA 95101 ("Acme")
PARTY B: Jane Smith, an individual consultant operating as Jane Smith Consulting LLC ("Jane Smith")

1. PURPOSE
The parties wish to explore a potential business relationship (the "Purpose") and may need to disclose Confidential Information to each other.

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by either party that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

3. OBLIGATIONS
Each party agrees to: (a) hold the other's Confidential Information in strict confidence; (b) not disclose Confidential Information to third parties without prior written consent; (c) use Confidential Information only for the Purpose.

4. TERM
This Agreement is effective from the Effective Date and expires on December 31, 2027. Confidentiality obligations survive termination for a period of 3 years.

5. EXCLUSIONS
Confidential Information does not include information that: (a) is or becomes publicly known through no breach of this Agreement; (b) was rightfully known before disclosure; (c) is independently developed without use of Confidential Information.

6. GOVERNING LAW
This Agreement is governed by the laws of Delaware.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

ACME CORP: _________________________ Date: January 15, 2025
JANE SMITH: ________________________ Date: January 15, 2025`,
  };

  const docs = getAllVaultDocs();
  // Only add if not already present
  if (!docs.find((d) => d.id === demoNDA.id)) {
    docs.push(demoNDA);
    localStorage.setItem(VAULT_KEY, JSON.stringify(docs));
  }
  localStorage.setItem(DEMO_SEEDED_KEY, '1');
}

/**
 * Build a context string from vault documents to inject into AI prompts.
 * Pass categories array to filter (e.g. ['Incorporation','Service','Employment']).
 * If categories is null/undefined, all documents are included.
 * Each document is capped at 3000 chars to avoid token overflow.
 */
export function getVaultContext(categories = null) {
  const docs = getAllVaultDocs();
  const relevant = categories
    ? docs.filter((d) => categories.includes(d.category))
    : docs;
  if (relevant.length === 0) return '';

  let ctx = '=== LEGAL VAULT — COMPANY DOCUMENTS ===\n';
  ctx += 'Use the following documents already stored in this company\'s Legal Vault to customise your output. Tailor your response based on the company details, parties, and terms visible in these documents.\n\n';
  relevant.forEach((doc) => {
    ctx += `--- [${doc.category}] ${doc.name} (saved ${doc.date}) ---\n`;
    const body = doc.content.length > 3000
      ? doc.content.substring(0, 3000) + '\n...[document continues — truncated for context]'
      : doc.content;
    ctx += body + '\n\n';
  });
  ctx += '=== END OF VAULT CONTEXT ===\n';
  return ctx;
}
