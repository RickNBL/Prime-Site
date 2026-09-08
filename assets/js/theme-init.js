(() => {
  'use strict';

  const html = document.documentElement;

  try {
    const savedTheme = localStorage.getItem('prime-theme');
    const theme = savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    html.dataset.theme = theme;
    html.dataset.bsTheme = theme;

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
  } catch (_) {
    html.dataset.theme = 'light';
    html.dataset.bsTheme = 'light';
  }
})();
