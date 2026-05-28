// shells.jsx — three switchable app shells.
// Vite React module. Exposes window.Shell.

import React from 'react';

const SHELL_NAV = [
  { id: 'home',      key: 'nav.home',      icon: 'home' },
  { id: 'tools',     key: 'nav.tools',     icon: 'tools' },
  { id: 'journal',   key: 'nav.journal',   icon: 'journal' },
  { id: 'companion', key: 'nav.companion', icon: 'companion' },
  { id: 'help',      key: 'nav.help',      icon: 'help' },
];

window.SHELL_NAV = SHELL_NAV;

function BrandMark({ size = 32 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect x="4.5" y="4.5" width="23" height="23" rx="8" fill="var(--forest-wash)" stroke="currentColor" strokeWidth="1.4" opacity="0.95" />
      <path
        d="M16 8 C16 8, 21.1 12.1, 21.1 16.9 C21.1 21.4, 16 24.2, 16 24.2 C16 24.2, 10.9 21.4, 10.9 16.9 C10.9 12.1, 16 8, 16 8 Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path d="M13.2 16.4h5.6" stroke="var(--paper-bright)" strokeWidth="1.7" strokeLinecap="round" opacity="0.95" />
      <circle cx="16" cy="16.4" r="1.3" fill="var(--paper-bright)" opacity="0.95" />
    </svg>
  );
}

function HistoryNav({ canGoBack, canGoForward, onBack, onForward }) {
  return (
    <div className="history-nav" aria-label="Page history">
      <button
        className="nav-step"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label="Go back"
        title="Back"
      >
        <window.Icon name="chevronLeft" size={16} />
        <span>Back</span>
      </button>
      <button
        className="nav-step"
        onClick={onForward}
        disabled={!canGoForward}
        aria-label="Go forward"
        title="Forward"
      >
        <span>Forward</span>
        <window.Icon name="chevronRight" size={16} />
      </button>
    </div>
  );
}

function TopbarChrome({ t, onOpenTweaks, onOpenSettings, showBrandSub = true, canGoBack = false, canGoForward = false, onBack, onForward }) {
  return (
    <header className="topbar">
      <a className="brand" href="#home" onClick={(e)=>e.preventDefault()}>
        <span className="brand-mark"><BrandMark /></span>
        <span>
          <span style={{ display: 'block' }}>{t('brandName')}</span>
          {showBrandSub && (
            <span className="brand-sub">{t('brandTagline')}</span>
          )}
        </span>
      </a>
      <div className="topbar-actions">
        <HistoryNav
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onBack={onBack}
          onForward={onForward}
        />
        {onOpenSettings && (
          <button className="icon-btn" onClick={onOpenSettings} aria-label="Open settings">
            <window.Icon name="settings" size={18} />
          </button>
        )}
      </div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tab-bar shell
// ────────────────────────────────────────────────────────────────────────────
function TabBarShell({ t, current, onNavigate, children, onOpenSettings, canGoBack, canGoForward, onBack, onForward }) {
  return (
    <div className="app-root shell-tabbar">
      <TopbarChrome
        t={t}
        onOpenSettings={onOpenSettings}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onBack={onBack}
        onForward={onForward}
      />
      <div className="stage">{children}</div>
      <nav className="tabbar" aria-label="Primary">
        {SHELL_NAV.map(item => (
          <button
            key={item.id}
            className={"tabbar-item" + (current === item.id ? ' active' : '')}
            onClick={() => onNavigate(item.id)}
          >
            <window.Icon name={item.icon} size={22} />
            <span>{t(item.key)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Side-rail shell
// ────────────────────────────────────────────────────────────────────────────
function SideRailShell({ t, current, onNavigate, children, onOpenSettings, canGoBack, canGoForward, onBack, onForward }) {
  return (
    <div className="app-root shell-siderail">
      <aside className="siderail">
        <div className="siderail-brand hide-mobile">
          <a className="brand" href="#home" onClick={(e)=>e.preventDefault()}>
            <span className="brand-mark"><BrandMark size={28} /></span>
            <span>
              <span style={{ display: 'block', fontSize: 20 }}>{t('brandName')}</span>
              <span className="brand-sub">{t('brandTagline')}</span>
            </span>
          </a>
        </div>
        {SHELL_NAV.map(item => (
          <button
            key={item.id}
            className={"siderail-item" + (current === item.id ? ' active' : '')}
            onClick={() => onNavigate(item.id)}
          >
            <window.Icon name={item.icon} size={18} />
            <span>{t(item.key)}</span>
          </button>
        ))}
        <div className="siderail-footer hide-mobile">
          <button className="siderail-item" onClick={onOpenSettings}>
            <window.Icon name="settings" size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
      <main className="stage">
        <div className="topbar hide-mobile" style={{ background: 'transparent', border: 0, paddingLeft: 36, paddingRight: 36 }}>
          <div />
          <div className="topbar-actions">
            <HistoryNav
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              onBack={onBack}
              onForward={onForward}
            />
            <button className="icon-btn" onClick={onOpenSettings} aria-label="Open settings"><window.Icon name="settings" size={18} /></button>
          </div>
        </div>
        <div className="show-mobile">
          <TopbarChrome
            t={t}
            onOpenSettings={onOpenSettings}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onBack={onBack}
            onForward={onForward}
          />
        </div>
        {children}
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Hub (contemplative radial) shell — only "Home" goes to ring; other tabs
// open the same screens.
// ────────────────────────────────────────────────────────────────────────────
function HubShell({ t, current, onNavigate, children, onOpenSettings, canGoBack, canGoForward, onBack, onForward }) {
  // On non-home pages, fall back to a top-bar + back affordance
  const isHome = current === 'home';
  return (
    <div className="app-root shell-hub">
      <TopbarChrome
        t={t}
        onOpenSettings={onOpenSettings}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onBack={onBack}
        onForward={onForward}
      />
      <main className="stage">
        {!isHome && (
          <div style={{ padding: '12px 22px 0' }}>
            <button className="btn btn-ghost btn-tiny" onClick={() => onNavigate('home')}>
              <window.Icon name="chevronLeft" size={16} /> Hub
            </button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

window.Shell = function Shell({ kind, ...props }) {
  if (kind === 'siderail') return <SideRailShell {...props} />;
  if (kind === 'hub')      return <HubShell {...props} />;
  return <TabBarShell {...props} />;
};

window.BrandMark = BrandMark;
