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
if (contactForm) contactForm.addEventListener('submit', (event) => {
 event.preventDefault();
 const data = new FormData(contactForm);
 const name = String(data.get('name') || '').trim();
 const email = String(data.get('email') || '').trim();
 const project = String(data.get('project') || '').trim();
 const subject = encodeURIComponent('Website Project Enquiry from ' + name);
 const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nProject details:\n' + project);
 document.querySelector('#formStatus').textContent = 'Your email app is opening. Press Send there to deliver your enquiry.';
 window.location.href = 'mailto:victorsignatures@gmail.com?subject=' + subject + '&body=' + body;
});


// Sticky header styling and low-cost scroll reveals
const header = document.querySelector('.header');
const aboutSection = document.querySelector('#about');
if (header && aboutSection) {
  const navObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      header.classList.toggle('is-scrolled', entry.isIntersecting);
    }
  }, {
    root: null,
    rootMargin: '-110px 0px 0px 0px',
    threshold: 0
  });
  navObserver.observe(aboutSection);
}

const revealTargets = document.querySelectorAll(\n  'main > section, .footer, .about > div, .section-top, .service, .project, .testimonial-card, .steps > div, .contact-layout > div, .contact-form'\n);
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
