import React from 'react';
import './styles.css';

window.React = React;

await import('./i18n.js');
await import('./content.js');
await import('./safety.js');
await import('./claude-client.js');
await import('./trigger-library.js');
await import('./survivor-cards.js');
await import('./shame-spiral-cards.js');
await import('./response-profile-cards.js');
await import('./boundary-scripts.js');
await import('./recovery-modules.js');
await import('./recovery-postprocess.js');
await import('./companion-training.js');
await import('./tweaks-panel.jsx');
await import('./store.jsx');
await import('./icons.jsx');
await import('./shells.jsx');
await import('./tools.jsx');
await import('./companion.jsx');
await import('./screens.jsx');
await import('./app.jsx');
