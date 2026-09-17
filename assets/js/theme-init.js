(() => {
  'use strict';

  const html = document.documentElement;
  html.dataset.bsTheme = 'light';

  try {
    localStorage.removeItem('prime-theme');
    const raw = localStorage.getItem('prime-a11y');
    if (!raw) return;
    const settings = JSON.parse(raw);

    if (settings.contrast) html.dataset.a11yContrast = 'high';
    if (settings.links) html.dataset.a11yLinks = 'on';
    if (settings.motion) html.dataset.a11yMotion = 'reduce';
    if (Number.isFinite(settings.fontScale)) {
      const scale = Math.min(125, Math.max(87.5, settings.fontScale));
      html.style.fontSize = `${scale}%`;
    }
  } catch (_) {}
})();
