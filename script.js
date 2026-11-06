const toggle = document.querySelector('.hamburger');
const menu = document.querySelector('.nav');
toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  const formStatus = document.querySelector('#formStatus');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const originalButtonHTML = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.textContent = 'Sending enquiry…';
    formStatus.textContent = 'Sending your enquiry securely…';
    formStatus.dataset.state = 'sending';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent = 'Thank you! Your enquiry has been sent successfully. I’ll get back to you by email.';
        formStatus.dataset.state = 'success';
      } else {
        let message = 'Something went wrong while sending your enquiry. Please try again or email victorsignatures@gmail.com directly.';
        try {
          const result = await response.json();
          if (result.errors?.length) {
            message = result.errors.map(error => error.message).join(' ');
          }
        } catch (_) {}
        formStatus.textContent = message;
        formStatus.dataset.state = 'error';
      }
    } catch (error) {
      formStatus.textContent = 'We couldn’t connect to the form service. Please check your connection and try again, or email victorsignatures@gmail.com directly.';
      formStatus.dataset.state = 'error';
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      submitButton.innerHTML = originalButtonHTML;
    }
  });
}


// Sticky navigation: observe the hero boundary so the pill state persists
// through every later section and reverses only when returning to the hero.
const header = document.querySelector('.header');
const heroSection = document.querySelector('#home');
if (header && heroSection && 'IntersectionObserver' in window) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }, {
    root: null,
    rootMargin: '-82px 0px 0px 0px',
    threshold: 0
  });
  heroObserver.observe(heroSection);
}

const revealTargets = document.querySelectorAll('main > section, .footer, .about > div, .section-top, .service, .project, .testimonial-card, .steps > div, .contact-layout > div, .contact-form');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reveal-ready');
  revealTargets.forEach((element) => element.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach((element) => revealObserver.observe(element));
}


// Curved testimonial carousel: continuous motion with drag, swipe, wheel and buttons.
(() => {
  const viewport = document.querySelector('.testimonial-marquee');
  const track = document.querySelector('.testimonial-track');
  if (!viewport || !track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = viewport.clientWidth;
  let cardWidth = Math.min(410, Math.max(290, width * 0.32));
  let spacing = cardWidth + 24;
  let cycle = spacing * cards.length;
  let offset = 0;
  let lastTime = 0;
  let dragging = false;
  let pointerStart = 0;
  let offsetStart = 0;
  let lastPointer = 0;
  let velocity = 0;
  let activeCard = -1;

  function measure() {
    width = viewport.clientWidth;
    cardWidth = Math.min(410, Math.max(290, width * (width < 760 ? 0.82 : 0.32)));
    spacing = cardWidth + 24;
    cycle = spacing * cards.length;
    cards.forEach(card => { card.style.width = cardWidth + 'px'; });
  }

  function wrap(value, range) {
    return ((value % range) + range) % range;
  }

  function render(time) {
    if (!lastTime) lastTime = time;
    const delta = Math.min((time - lastTime) / 1000, 0.04);
    lastTime = time;

    if (!dragging) {
      if (!reduceMotion) offset += 34 * delta;
      offset += velocity * delta;
      velocity *= Math.pow(0.035, delta);
      if (Math.abs(velocity) < 0.5) velocity = 0;
    }

    const center = width / 2;
    let nearest = -1;
    let nearestDistance = Infinity;

    cards.forEach((card, index) => {
      const raw = wrap(index * spacing + offset + cycle / 2, cycle) - cycle / 2;
      const x = raw;
      const distance = Math.abs(x);
      const normalized = Math.min(distance / (width * 0.76), 1);
      const scale = 1.08 - normalized * 0.34;
      const opacity = 1 - normalized * 0.7;
      const blur = normalized * 1.25;
      const y = -Math.cos((x / Math.max(width * 0.82, 1)) * Math.PI) * 43;
      const z = Math.round(1000 - distance);

      card.style.transform = 'translate3d(' + (x - cardWidth / 2) + 'px,' + (y - 50) + 'px,0) scale(' + scale + ')';
      card.style.opacity = String(opacity);
      card.style.filter = 'blur(' + blur + 'px)';
      card.style.zIndex = String(z);
      card.style.visibility = distance < width * 0.82 + cardWidth ? 'visible' : 'hidden';

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    if (nearest !== activeCard) {
      if (activeCard >= 0) cards[activeCard].classList.remove('is-center');
      activeCard = nearest;
      if (activeCard >= 0) cards[activeCard].classList.add('is-center');
    }

    requestAnimationFrame(render);
  }

  function nudge(direction) {
    velocity = 0;
    offset += direction * spacing * 1.15;
  }

  viewport.addEventListener('pointerdown', event => {
    dragging = true;
    pointerStart = event.clientX;
    lastPointer = event.clientX;
    offsetStart = offset;
    velocity = 0;
    viewport.setPointerCapture?.(event.pointerId);
  });

  viewport.addEventListener('pointermove', event => {
    if (!dragging) return;
    const movement = event.clientX - lastPointer;
    offset = offsetStart + (event.clientX - pointerStart);
    velocity = movement * 8;
    lastPointer = event.clientX;
  });

  const stopDrag = () => { dragging = false; };
  viewport.addEventListener('pointerup', stopDrag);
  viewport.addEventListener('pointercancel', stopDrag);
  viewport.addEventListener('lostpointercapture', stopDrag);

  viewport.addEventListener('wheel', event => {
    event.preventDefault();
    offset += (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * 0.85;
  }, { passive: false });

  document.querySelector('.testimonial-prev')?.addEventListener('click', () => nudge(-1));
  document.querySelector('.testimonial-next')?.addEventListener('click', () => nudge(1));
  window.addEventListener('resize', measure, { passive: true });

  measure();
  requestAnimationFrame(render);
})();
