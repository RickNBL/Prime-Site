(() => {
  'use strict';

  const html = document.documentElement;
  const motionReduced = () =>
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
    html.dataset.a11yMotion === 'reduce';

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  /* Hero: a marca permanece como plano de fundo e se reorganiza suavemente durante a rolagem. */
  const hero = document.querySelector('[data-scroll-hero]');
  let ticking = false;

  const updateScrollEffects = () => {
    ticking = false;
    if (!hero || motionReduced()) {
      if (hero) hero.style.setProperty('--hero-progress', '0');
      return;
    }

    const rect = hero.getBoundingClientRect();
    const height = Math.max(rect.height, 1);
    const progress = clamp(-rect.top / height);
    hero.style.setProperty('--hero-progress', progress.toFixed(3));

    const story = document.querySelector('[data-service-story]');
    if (story) {
      const storyRect = story.getBoundingClientRect();
      const travel = Math.max(storyRect.height - window.innerHeight, 1);
      const storyProgress = clamp(-storyRect.top / travel);
      story.style.setProperty('--story-progress', storyProgress.toFixed(3));
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  if (hero) {
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    requestUpdate();
  }

  /* Showcase: em telas grandes, a imagem fica fixa e muda conforme cada conteúdo entra em foco. */
  const steps = [...document.querySelectorAll('[data-service-step]')];
  const visuals = [...document.querySelectorAll('[data-service-visual]')];

  const activate = (index) => {
    steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
    visuals.forEach((visual, visualIndex) => visual.classList.toggle('is-active', visualIndex === index));
  };

  if (steps.length && visuals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const index = Number(visible.target.dataset.serviceStep || 0);
      activate(index);
    }, {
      root: null,
      rootMargin: '-24% 0px -38% 0px',
      threshold: [0.05, 0.2, 0.45, 0.7]
    });

    steps.forEach((step) => observer.observe(step));
  } else {
    activate(0);
  }


  /* Vídeo da marca: toca ao entrar na área, termina parado no último frame
     e reinicia somente quando sair da área e voltar. */
  const brandVideo = document.querySelector('[data-brand-video]');
  if (brandVideo) {
    brandVideo.muted = true;
    brandVideo.controls = false;
    brandVideo.removeAttribute('autoplay');

    let brandVideoInside = false;

    const playBrandVideoFromStart = () => {
      try {
        brandVideo.currentTime = 0;
      } catch (_) {}
      const playPromise = brandVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    };

    if ('IntersectionObserver' in window) {
      const brandVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.42) {
            if (!brandVideoInside) {
              brandVideoInside = true;
              playBrandVideoFromStart();
            }
          } else if (brandVideoInside) {
            brandVideoInside = false;
            brandVideo.pause();
          }
        });
      }, {
        threshold: [0, 0.2, 0.42, 0.65, 1]
      });

      brandVideoObserver.observe(brandVideo);
    } else {
      playBrandVideoFromStart();
    }
  }

  document.addEventListener('prime:a11y-motion-change', requestUpdate);
})();
