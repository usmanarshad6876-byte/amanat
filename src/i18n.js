// i18n.js — English labels for the single-locale Amanat app.
window.AMANAT_I18N = {
  en: {
    brandName: 'Amanat',
    brandTagline: 'a private companion',
    nav: {
      home: 'Home',
      tools: 'Tools',
      journal: 'Journal',
      companion: 'Companion',
      partners: 'Partners',
      help: 'Help',
    },
    home: {
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      greetingNight: 'You are here',
      subtitle: 'You are not too much. You are not the problem.',
      startCheckIn: 'Start a check-in',
      browseTools: 'Browse tools',
      quickAffirm: 'A true sentence',
      recentMood: 'Recent mood',
      panicLabel: 'I need help now',
    },
    tools: {
      breathing: 'Box breathing',
      breathingDesc: 'A 4-4-4-4 breathing cycle, with orienting if breath feels hard.',
      grounding: '5-4-3-2-1 grounding',
      groundingDesc: 'Use your senses to notice the room you are in.',
      publicMode: '30-second grounding',
      publicModeDesc: 'A discreet public-place reset for work, class, or family rooms.',
      reframe: 'Reframe a thought',
      reframeDesc: 'Translate a painful thought into a steadier one.',
      journal: 'Safe journal',
      journalDesc: 'Write privately in this browser unless you choose to share or export.',
      mood: 'Mood log',
      moodDesc: 'Notice state changes without turning them into verdicts.',
      affirm: 'Affirmations',
      affirmDesc: 'A small sentence that can hold you for today.',
      checkIn: 'Check-in',
      checkInDesc: 'Three gentle questions and one next step.',
    },
    common: {
      close: 'Close',
      next: 'Next',
      back: 'Back',
      done: 'Done',
      copy: 'Copy',
      save: 'Save',
      delete: 'Delete',
      clear: 'Clear',
    },
  },
};

window.useI18n = function useI18n() {
  return function t(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], window.AMANAT_I18N.en) || path;
  };
};
