// recovery-postprocess.js — app-readiness metadata for imported recovery modules.

const MODULE_VISIBILITY = {
  research: 'Research-only',
  intimacy: 'Consent-led',
  culture: 'Culturally sensitive',
  roughDay: 'Survivor-facing',
  angerGrief: 'Survivor-facing',
  night: 'Survivor-facing',
  goodDay: 'Survivor-facing',
  environmentSafety: 'Survivor-facing',
  relationships: 'Survivor-facing',
  workplace: 'Survivor-facing',
};

const MODULE_PLAIN_TITLES = {
  survivorCards: 'Understanding what happened to me',
  shameSpiral: 'Why I feel so bad about myself',
  responseProfiles: 'How my body learned to protect me',
  languageGuide: 'Words that feel safer',
  mindLoops: 'Thoughts that go in circles',
  angerGrief: 'Making room for anger and grief safely',
  roughDay: 'What to do on a very hard day',
  night: 'A plan for when night feels hard',
  goodDay: 'Letting good things feel safer',
  environmentSafety: 'Making my space feel safer',
  culture: 'Family, faith, and pressure',
  relationships: 'What happens between me and other people',
  intimacy: 'Closeness with choice and pause',
  workplace: 'Getting through work pressure',
  research: 'Research notes and codebook',
};

const MODULE_CLINICAL_TITLES = {
  survivorCards: 'Psychoeducation',
  shameSpiral: 'Shame Spiral Map',
  responseProfiles: 'Trauma Response Profile',
  languageGuide: 'Trauma-Informed Language Guide',
  mindLoops: 'Metacognitive Mind Loops',
};

function ensureMetaTitle(target, key) {
  if (!target) return;
  target.meta = target.meta || {};
  target.meta.title = target.meta.title || MODULE_CLINICAL_TITLES[key] || target.meta.title;
  target.meta.plainTitle = target.meta.plainTitle || MODULE_PLAIN_TITLES[key] || target.meta.title;
}

ensureMetaTitle(window.AMANAT_SURVIVOR_CARDS, 'survivorCards');
ensureMetaTitle(window.AMANAT_SHAME_SPIRAL_CARDS, 'shameSpiral');
ensureMetaTitle(window.AMANAT_RESPONSE_PROFILE_CARDS, 'responseProfiles');

function normalizeRisk(value) {
  const text = String(value || '').toLowerCase();
  if (text.includes('high') || text.includes('red') || text.includes('urgent')) return 'red';
  if (text.includes('moderate') || text.includes('medium') || text.includes('amber')) return 'amber';
  if (text.includes('low') || text.includes('green')) return 'green';
  return text ? 'unspecified' : '';
}

function supportLevelFor(riskCode) {
  if (riskCode === 'red') return 'Urgent support';
  if (riskCode === 'amber') return 'Extra support';
  if (riskCode === 'green') return 'Light support';
  return '';
}

function modulePrefix(moduleKey) {
  return String(moduleKey || 'module')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase();
}

function isFormulaBlankRow(row) {
  const values = Object.values(row || {});
  if (!values.length) return true;
  return values.every(value => value === '' || value === null || value === undefined || value === 0 || value === '0');
}

Object.entries(window.AMANAT_RECOVERY_MODULES || {}).forEach(([moduleKey, module]) => {
  ensureMetaTitle(module, moduleKey);

  Object.entries(module.support || {}).forEach(([sheetName, rows]) => {
    if (Array.isArray(rows)) module.support[sheetName] = rows.filter(row => !isFormulaBlankRow(row));
  });

  (module.items || []).forEach((item, index) => {
    const rowNumber = String(index + 1).padStart(4, '0');
    const prefix = modulePrefix(moduleKey);
    item.moduleKey = item.moduleKey || moduleKey;
    item.rowId = item.rowId || `${moduleKey}-${rowNumber}`;
    item.sourceCardId = item.sourceCardId || item.sourceId || item.id || '';
    item.standardId = item.standardId || `${prefix}:${item.sourceCardId || rowNumber}`;
    item.baselineRiskCode = item.baselineRiskCode || normalizeRisk(item.risk);
    item.baselineSupportLevel = item.baselineSupportLevel || supportLevelFor(item.baselineRiskCode);
    item.liveSafetyState = item.liveSafetyState || 'not_assessed';
    item.riskCode = item.riskCode || item.baselineRiskCode;
    item.supportLevel = item.supportLevel || item.baselineSupportLevel;
    item.visibility = item.visibility || MODULE_VISIBILITY[moduleKey] || 'Survivor-facing';
  });
});
