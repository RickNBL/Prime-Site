(() => {
  'use strict';

  const html = document.documentElement;
  const STORAGE_KEY = 'prime-a11y';
  const defaults = { fontScale: 100, contrast: false, links: false, motion: false };

  const readSettings = () => {
    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')) };
    } catch (_) {
      return { ...defaults };
    }
  };

  let settings = readSettings();

  const persist = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (_) {}
  };

  const applySettings = () => {
    html.style.fontSize = `${settings.fontScale}%`;
    settings.contrast ? html.dataset.a11yContrast = 'high' : delete html.dataset.a11yContrast;
    settings.links ? html.dataset.a11yLinks = 'on' : delete html.dataset.a11yLinks;
    settings.motion ? html.dataset.a11yMotion = 'reduce' : delete html.dataset.a11yMotion;
  };

  const createWidget = () => {
    if (document.querySelector('[data-a11y-widget]')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'a11y-widget';
    wrapper.dataset.a11yWidget = '';
    wrapper.innerHTML = `
      <div class="a11y-panel" id="primeAccessibilityPanel" hidden>
        <div class="a11y-panel-header">
          <h2 class="a11y-panel-title">Acessibilidade</h2>
          <button type="button" class="a11y-close" data-a11y-close aria-label="Fechar acessibilidade"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
        </div>
        <div class="a11y-group">
          <span class="a11y-label">Tamanho do texto</span>
          <div class="a11y-font-controls">
            <button type="button" class="a11y-control" data-font-minus aria-label="Diminuir tamanho do texto"><i class="bi bi-dash-lg" aria-hidden="true"></i> A</button>
            <span class="a11y-font-value" data-font-value aria-live="polite">100%</span>
            <button type="button" class="a11y-control" data-font-plus aria-label="Aumentar tamanho do texto">A <i class="bi bi-plus-lg" aria-hidden="true"></i></button>
          </div>
        </div>
        <div class="a11y-group">
          <button type="button" class="a11y-toggle" data-a11y-contrast aria-pressed="false"><span>Alto contraste</span><span class="a11y-state">Desligado</span></button>
          <button type="button" class="a11y-toggle" data-a11y-links aria-pressed="false"><span>Destacar links</span><span class="a11y-state">Desligado</span></button>
          <button type="button" class="a11y-toggle" data-a11y-motion aria-pressed="false"><span>Reduzir animações</span><span class="a11y-state">Desligado</span></button>
        </div>
        <div class="a11y-group">
          <button type="button" class="a11y-reset" data-a11y-reset><i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Restaurar acessibilidade</button>
        </div>
        <p class="a11y-note">As preferências ficam salvas apenas neste navegador.</p>
      </div>
      <button type="button" class="a11y-trigger" data-a11y-trigger aria-controls="primeAccessibilityPanel" aria-expanded="false">
        <i class="bi bi-universal-access-circle" aria-hidden="true"></i><span class="a11y-trigger-text">Acessibilidade</span>
      </button>`;

    document.body.appendChild(wrapper);

    const trigger = wrapper.querySelector('[data-a11y-trigger]');
    const panel = wrapper.querySelector('.a11y-panel');
    const close = wrapper.querySelector('[data-a11y-close]');
    const fontValue = wrapper.querySelector('[data-font-value]');

    const sync = () => {
      fontValue.textContent = `${settings.fontScale}%`;
      const items = [
        [wrapper.querySelector('[data-a11y-contrast]'), settings.contrast],
        [wrapper.querySelector('[data-a11y-links]'), settings.links],
        [wrapper.querySelector('[data-a11y-motion]'), settings.motion]
      ];
      items.forEach(([button, active]) => {
        button.setAttribute('aria-pressed', String(active));
        const state = button.querySelector('.a11y-state');
        if (state) state.textContent = active ? 'Ligado' : 'Desligado';
      });
    };

    const openPanel = () => {
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      close.focus();
    };
    const closePanel = (restoreFocus = true) => {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    };

    trigger.addEventListener('click', () => panel.hidden ? openPanel() : closePanel(false));
    close.addEventListener('click', () => closePanel());

    wrapper.querySelector('[data-font-minus]').addEventListener('click', () => {
      settings.fontScale = Math.max(87.5, settings.fontScale - 12.5);
      applySettings(); persist(); sync();
    });
    wrapper.querySelector('[data-font-plus]').addEventListener('click', () => {
      settings.fontScale = Math.min(125, settings.fontScale + 12.5);
      applySettings(); persist(); sync();
    });
    wrapper.querySelector('[data-a11y-contrast]').addEventListener('click', () => {
      settings.contrast = !settings.contrast; applySettings(); persist(); sync();
    });
    wrapper.querySelector('[data-a11y-links]').addEventListener('click', () => {
      settings.links = !settings.links; applySettings(); persist(); sync();
    });
    wrapper.querySelector('[data-a11y-motion]').addEventListener('click', () => {
      settings.motion = !settings.motion; applySettings(); persist(); sync();
    });
    wrapper.querySelector('[data-a11y-reset]').addEventListener('click', () => {
      settings = { ...defaults };
      applySettings();
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      sync();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) closePanel();
    });
    document.addEventListener('pointerdown', (event) => {
      if (!panel.hidden && !wrapper.contains(event.target)) closePanel(false);
    });

    applySettings();
    sync();
  };

  const init = () => {
    createWidget();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
