const photoCards = [...document.querySelectorAll('.photo-card')];
const filterButtons = [...document.querySelectorAll('.filter-button')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxTitle = document.querySelector('#lightbox-title');
const lightboxMeta = document.querySelector('#lightbox-meta');
const lightboxCounter = document.querySelector('#lightbox-counter');
const favoriteButton = document.querySelector('.favorite-button');
const closeTriggers = [...document.querySelectorAll('[data-close]')];
const previousButton = document.querySelector('.gallery-prev');
const nextButton = document.querySelector('.gallery-next');

const photos = photoCards.map((card) => ({
  image: card.querySelector('img').src,
  alt: card.querySelector('img').alt,
  title: card.querySelector('h3').innerText.replace(/\n/g, ' '),
  category: card.querySelector('.card-meta span:last-child').innerText,
}));

let currentIndex = 0;
const favorites = new Set();

function updateLightbox() {
  const photo = photos[currentIndex];
  lightboxImage.src = photo.image;
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;
  lightboxMeta.textContent = photo.category;
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  favoriteButton.classList.toggle('is-favorite', favorites.has(currentIndex));
  favoriteButton.setAttribute('aria-pressed', favorites.has(currentIndex));
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');
  document.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
}

function showNextPhoto(direction) {
  currentIndex = (currentIndex + direction + photos.length) % photos.length;
  updateLightbox();
}

photoCards.forEach((card) => {
  card.querySelector('.photo-trigger').addEventListener('click', () => {
    openLightbox(Number(card.dataset.index));
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('is-selected', item === button));
    photoCards.forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

closeTriggers.forEach((trigger) => trigger.addEventListener('click', closeLightbox));
previousButton.addEventListener('click', () => showNextPhoto(-1));
nextButton.addEventListener('click', () => showNextPhoto(1));

favoriteButton.addEventListener('click', () => {
  if (favorites.has(currentIndex)) {
    favorites.delete(currentIndex);
  } else {
    favorites.add(currentIndex);
  }
  updateLightbox();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showNextPhoto(-1);
  if (event.key === 'ArrowRight') showNextPhoto(1);
});