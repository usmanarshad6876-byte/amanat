// icons.jsx — line icons rendered with consistent stroke. Avoids emoji.
// Vite React module. Exposes window.Icon.

import React from 'react';

const ICON_PATHS = {
  home: (
    <>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-5h4v5h3.5a1 1 0 0 0 1-1v-9" />
    </>
  ),
  tools: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" />
    </>
  ),
  journal: (
    <>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
      <path d="M5 4v13a3 3 0 0 0 3 3" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  companion: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8A2.5 2.5 0 0 1 17.5 17H13l-4 3.5V17H6.5A2.5 2.5 0 0 1 4 14.5z" />
      <circle cx="9" cy="10.5" r="0.8" fill="currentColor" />
      <circle cx="12" cy="10.5" r="0.8" fill="currentColor" />
      <circle cx="15" cy="10.5" r="0.8" fill="currentColor" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5a3 3 0 0 1 5.8 1c0 1.5-2.3 1.8-2.8 3M12 17h.01" />
    </>
  ),
  breathing: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  grounding: (
    <>
      <path d="M5 11c0-4 3-7 7-7s7 3 7 7v3a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4z" />
      <path d="M8 14v3M12 14v4M16 14v3" />
    </>
  ),
  reframe: (
    <>
      <path d="M4 7h11l-3-3M4 7l3 3" />
      <path d="M20 17H9l3 3M20 17l-3-3" />
    </>
  ),
  checkin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </>
  ),
  mood: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 13.5a3.5 3.5 0 0 0 6 0" />
      <circle cx="9" cy="9.5" r="0.8" fill="currentColor" />
      <circle cx="15" cy="9.5" r="0.8" fill="currentColor" />
    </>
  ),
  partners: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9.5" r="2.5" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M14 18c.3-2 2-3.5 4-3.5s3.7 1.5 4 3.5" />
    </>
  ),
  language: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 12h17M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
    </>
  ),
  crisis: (
    <>
      <path d="M12 3 2 20h20z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v6c0 4 3.5 7.5 8 9 4.5-1.5 8-5 8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  phone: (
    <>
      <path d="M5 4h3l2 5-2 1c1 2.5 3 4.5 5.5 5.5l1-2 5 2v3a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M6 18 18 6" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  chevronLeft: <path d="M15 6l-6 6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  send: <path d="M3 12 22 4l-4 18-4-9-9-1z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7.3 7.3 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7.2 7.2 0 0 0-2.2-1.3L14 3h-4l-.4 2.4a7.2 7.2 0 0 0-2.2 1.3L5 5.8 3 9.2l2 1.5a7.3 7.3 0 0 0 0 2.6l-2 1.5 2 3.4 2.3-.9a7.2 7.2 0 0 0 2.2 1.3L10 21h4l.4-2.4a7.2 7.2 0 0 0 2.2-1.3l2.3.9 2-3.4-2-1.5c.07-.43.1-.86.1-1.3z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 5-13 14-13 0 8-5 14-13 14a3 3 0 0 1-1-1z" />
      <path d="M5 19c4-4 7-7 12-9" />
    </>
  ),
  moon: (
    <>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
    </>
  ),
  bookmark: (
    <>
      <path d="M6 4h12v17l-6-4-6 4z" />
    </>
  ),
  check: <path d="m5 12 4 4 10-10" />,
  play: <path d="M7 5v14l12-7z" fill="currentColor" stroke="none" />,
  pause: (
    <>
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </>
  ),
  reload: (
    <>
      <path d="M4 11a8 8 0 0 1 14-3" />
      <path d="M18 4v4h-4" />
      <path d="M20 13a8 8 0 0 1-14 3" />
      <path d="M6 20v-4h4" />
    </>
  ),
};

window.Icon = function Icon({ name, size = 22, stroke = 1.5, className = '', style }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
};
