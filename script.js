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
