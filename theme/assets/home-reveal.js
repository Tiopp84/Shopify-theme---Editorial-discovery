class HomeRevealController {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.desktop = window.matchMedia('(min-width: 64rem)');
    this.stickyMedia = window.matchMedia('(min-width: 48rem)');

    if (!window.gsap || !window.ScrollTrigger || this.reducedMotion.matches) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ limitCallbacks: true });
    this.choreographies = new Map();
    this.mediaSwaps = new Map();
    this.refreshFrame = null;
    this.onViewportChange = () => {
      this.destroy(document);
      this.hydrate(document);
    };

    this.hydrate(document);
    this.desktop.addEventListener('change', this.onViewportChange);
    this.stickyMedia.addEventListener('change', this.onViewportChange);
    document.addEventListener('shopify:section:load', (event) => this.hydrate(event.target));
    document.addEventListener('shopify:section:unload', (event) => this.destroy(event.target));
  }

  elementsIn(scope, selector) {
    const elements = [];
    if (scope.matches?.(selector)) elements.push(scope);
    elements.push(...scope.querySelectorAll?.(selector) || []);
    return elements;
  }

  hydrate(scope) {
    if (this.desktop.matches) {
      this.elementsIn(scope, '[data-motion="editorial-chapters"]').forEach((section) => this.createEditorialChoreography(section));
    }

    if (this.stickyMedia.matches) {
      this.elementsIn(scope, '[data-motion="editorial-chapters"]').forEach((section) => {
        this.createEditorialMediaSwap(section);
      });
    }
    this.scheduleRefresh();
  }

  createEditorialChoreography(section) {
    if (this.choreographies.has(section)) return;

    const media = section.querySelector('.pinned-visual-story__media');
    const chapters = [...section.querySelectorAll('[data-home-reveal-chapter]')];
    const mediaItems = [...media?.querySelectorAll('[data-pinned-story-media]') || []];
    if (!media || !chapters.length || !mediaItems.length) return;

    const introTargets = [...section.querySelectorAll('.pinned-visual-story__intro > *')];
    const chapterTargets = chapters.map((chapter) => [
      ...chapter.querySelectorAll('.pinned-visual-story__number, h3, .pinned-visual-story__body, a'),
    ]).filter((targets) => targets.length);
    if (!chapterTargets.length) return;

    const context = window.gsap.context(() => {
      const mediaVisuals = mediaItems.map((item) => item.querySelector('img, svg')).filter(Boolean);
      window.gsap.set(media, { autoAlpha: 1 });
      if (mediaVisuals.length) window.gsap.set(mediaVisuals, { scale: 1.045, transformOrigin: 'center center' });
      if (introTargets.length) window.gsap.set(introTargets, { autoAlpha: 0, y: 14 });
      chapterTargets.forEach((targets) => window.gsap.set(targets, { autoAlpha: 0, y: 20 }));

      const timeline = window.gsap.timeline({
        defaults: { ease: 'power2.out', overwrite: 'auto' },
        scrollTrigger: {
          trigger: section.querySelector('.pinned-visual-story__layout'),
          start: 'top 72%',
          end: 'bottom 56%',
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      if (introTargets.length) timeline.to(introTargets, { autoAlpha: 1, duration: 0.5, stagger: 0.1, y: 0 }, 0);
      if (mediaVisuals.length) timeline.to(mediaVisuals, { duration: chapterTargets.length, scale: 1 }, 0);
      chapterTargets.forEach((targets, index) => {
        timeline.to(targets, { autoAlpha: 1, duration: 0.7, y: 0 }, index * 0.72);
      });
    }, section);

    this.choreographies.set(section, { context, media, chapterTargets, introTargets });
  }

  createEditorialMediaSwap(section) {
    if (this.mediaSwaps.has(section)) return;

    const media = section.querySelector('.pinned-visual-story__media');
    const mediaItems = [...section.querySelectorAll('[data-pinned-story-media]')];
    const chapters = [...section.querySelectorAll('[data-home-reveal-chapter]')];
    if (!media || !mediaItems.length || !chapters.length) return;

    const headingTargets = chapters.map((chapter) => chapter.querySelector('[data-pinned-story-heading]') || chapter);
    const arcDirection = section.classList.contains('pinned-visual-story--media-right') ? -1 : 1;
    const flipEnabled = section.hasAttribute('data-pinned-story-flip');
    const wheelEnabled = section.hasAttribute('data-pinned-story-wheel');
    let activeMediaIndex = mediaItems.findIndex((item) => item.classList.contains('is-active'));
    let mediaTransitionTimer = null;
    const preloadMedia = (index) => {
      const image = mediaItems[index]?.querySelector('img');
      if (!image) return;
      image.loading = 'eager';
      image.decode?.().catch(() => {});
    };
    const preloadAdjacentMedia = (index) => {
      preloadMedia(index - 1);
      preloadMedia(index + 1);
    };

    const setActiveMedia = (index) => {
      if (wheelEnabled) chapters.forEach((chapter, chapterIndex) => chapter.classList.toggle('is-centered', chapterIndex === index));
      if (index !== activeMediaIndex) {
        mediaItems.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));
        activeMediaIndex = index;
        if (flipEnabled) {
          media.classList.add('is-transitioning');
          window.clearTimeout(mediaTransitionTimer);
          mediaTransitionTimer = window.setTimeout(() => media.classList.remove('is-transitioning'), 500);
        }
        preloadAdjacentMedia(index);
      }
    };
    let frame = null;
    const update = () => {
      frame = null;
      const mediaBounds = media.getBoundingClientRect();
      const mediaMiddle = mediaBounds.top + (mediaBounds.height / 2);
      const headingBounds = headingTargets.map((heading) => heading.getBoundingClientRect());
      const headingCenters = headingBounds.map((bounds) => bounds.top + (bounds.height / 2));
      const nearestIndex = headingCenters.reduce((closestIndex, center, index) => (
        Math.abs(center - mediaMiddle) < Math.abs(headingCenters[closestIndex] - mediaMiddle) ? index : closestIndex
      ), 0);
      const currentDistance = Math.abs(headingCenters[activeMediaIndex] - mediaMiddle);
      const nearestDistance = Math.abs(headingCenters[nearestIndex] - mediaMiddle);
      const activeIndex = activeMediaIndex >= 0 && nearestIndex !== activeMediaIndex && nearestDistance + 28 >= currentDistance
        ? activeMediaIndex
        : nearestIndex;
      setActiveMedia(activeIndex);

      if (wheelEnabled) {
        headingCenters.forEach((center, index) => {
          const distance = Math.min(1, Math.abs(center - mediaMiddle) / (mediaBounds.height * 0.72));
          const arcOffset = Math.round((distance ** 2) * 38 * arcDirection);
          chapters[index].style.setProperty('--pinned-story-chapter-opacity', (1 - (distance * 0.56)).toFixed(3));
          chapters[index].style.setProperty('--pinned-story-chapter-scale', (1 - (distance * 0.05)).toFixed(3));
          chapters[index].style.setProperty('--pinned-story-chapter-arc', `${arcOffset}px`);
        });
      }
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    const updateEdgeSpace = () => {
      section.style.setProperty('--pinned-story-edge-space', `${media.offsetHeight / 2}px`);
      scheduleUpdate();
    };
    const resizeObserver = new ResizeObserver(updateEdgeSpace);

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    resizeObserver.observe(media);
    preloadAdjacentMedia(activeMediaIndex);
    updateEdgeSpace();
    scheduleUpdate();
    this.mediaSwaps.set(section, { destroy: () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver.disconnect();
      window.clearTimeout(mediaTransitionTimer);
      media.classList.remove('is-transitioning');
      chapters.forEach((chapter) => {
        chapter.classList.remove('is-centered');
        chapter.style.removeProperty('--pinned-story-chapter-opacity');
        chapter.style.removeProperty('--pinned-story-chapter-scale');
        chapter.style.removeProperty('--pinned-story-chapter-arc');
      });
      if (frame !== null) window.cancelAnimationFrame(frame);
    } });
  }

  destroy(scope) {
    this.choreographies.forEach((choreography, section) => {
      if (scope !== section && !scope.contains(section)) return;
      choreography.context.revert();
      this.choreographies.delete(section);
    });
    this.mediaSwaps.forEach((mediaSwap, section) => {
      if (scope !== section && !scope.contains(section)) return;
      mediaSwap.destroy();
      this.mediaSwaps.delete(section);
    });
    this.scheduleRefresh();
  }

  scheduleRefresh() {
    if (this.refreshFrame) return;
    this.refreshFrame = window.requestAnimationFrame(() => {
      this.refreshFrame = null;
      window.ScrollTrigger.refresh();
    });
  }

}

if (!window.homeRevealController) window.homeRevealController = new HomeRevealController();
