document.addEventListener('DOMContentLoaded', function () {
  var slideshow = document.querySelector('.hero-slideshow');
  if (slideshow) {
    var slides = slideshow.querySelectorAll('.hero-slide');
    var interval = parseInt(slideshow.dataset.interval, 10) || 400;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, interval);
  }

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var galleryImgs = document.querySelectorAll('.gallery-grid img');
  var lightbox = document.querySelector('.lightbox');
  if (galleryImgs.length && lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    galleryImgs.forEach(function (img) {
      img.addEventListener('click', function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });
  }

  var forms = document.querySelectorAll('form[data-fake-submit]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) note.classList.add('show');
      form.reset();
    });
  });
});
