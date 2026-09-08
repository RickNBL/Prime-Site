(() => {
  'use strict';

  const showcase = document.querySelector('[data-home-showcase]');
  if (!showcase) return;

  const image = showcase.querySelector('[data-showcase-image]');
  const kicker = showcase.querySelector('[data-showcase-kicker]');
  const title = showcase.querySelector('[data-showcase-title]');
  const buttons = [...showcase.querySelectorAll('[data-showcase-target]')];

  const items = {
    equipe: {
      image: 'assets/img/home-prime.webp',
      alt: 'Profissionais da Prime Terceirizados em ambiente corporativo',
      kicker: 'Visão integrada',
      title: 'Limpeza e controle de acesso apresentados com a mesma identidade operacional.'
    },
    limpeza: {
      image: 'assets/img/limpeza-home.webp',
      alt: 'Equipe de limpeza profissional em ambiente corporativo',
      kicker: 'Limpeza profissional',
      title: 'Rotinas de conservação e higienização alinhadas ao uso de cada ambiente.'
    },
    acesso: {
      image: 'assets/img/controle-home.webp',
      alt: 'Profissionais realizando controle de acesso em ambiente corporativo',
      kicker: 'Controle de acesso',
      title: 'Organização de entradas e saídas conforme os procedimentos definidos para o local.'
    }
  };

  const activate = (key) => {
    const item = items[key];
    if (!item) return;

    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.showcaseTarget === key));
    });

    showcase.classList.add('is-switching');
    window.setTimeout(() => {
      image.src = item.image;
      image.alt = item.alt;
      kicker.textContent = item.kicker;
      title.textContent = item.title;
      image.addEventListener('load', () => showcase.classList.remove('is-switching'), { once: true });
      window.setTimeout(() => showcase.classList.remove('is-switching'), 500);
    }, 120);
  };

  buttons.forEach((button) => button.addEventListener('click', () => activate(button.dataset.showcaseTarget)));
})();
