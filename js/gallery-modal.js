const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.modal__close');

document.querySelectorAll('.gallery__item img').forEach(img => {
    img.addEventListener('click', () => {
        modal.classList.add('show');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
});

modal.addEventListener('click', e => {
    if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
});

const observer = new MutationObserver(() => {
    if (modal.classList.contains('show')) {
        modal.style.display = 'flex';
    }
});
observer.observe(modal, { attributes: true });