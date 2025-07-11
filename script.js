document.addEventListener('DOMContentLoaded', () => {
  const options = {
    root: null,
    rootMargin: '0px 0px -20% 0px',
    threshold: 0
  };

  const callback = entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  };

  const observer = new IntersectionObserver(callback, options);
  document.querySelectorAll('.fade-content').forEach(el => observer.observe(el));

});

// DOM elements
const navToggle   = document.querySelector('.nav-toggle');
const navLinks    = document.querySelector('.nav-links');
const menuLinks   = document.querySelectorAll('.menu a');

// 3.1 Hamburger toggle
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// 3.2 Intersection Observer for Active Links
const sections = document.querySelectorAll("section");
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = document.querySelector(`#link-${entry.target.id}`);
    if (entry.isIntersecting) {
      menuLinks.forEach(l => l.classList.remove("active"));
      link && link.classList.add("active");
    }
  });
}, { threshold: 0.7 });

sections.forEach(sec => observer.observe(sec));

