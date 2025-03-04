export const initializeCarousel = (block) => {
  const slides = block.querySelectorAll('.slider .slide-container');
  const dotsContainer = block.querySelector('.dots-container');
  const slider = block.querySelector('.slider');
  const prevButton = block.querySelector('.prev-button');
  const nextButton = block.querySelector('.next-button');

  let currentIndex = 0;
  const totalImages = slides.length;
  let isTransitioning = false;

  if (!dotsContainer || slides.length === 0) {
    return;
  }

  const updateDots = async () => {
    const dots = block.querySelectorAll('.dot');

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = index;

    const translateX = -currentIndex * 100;

    slider.style.transform = `translateX(${translateX}%)`;

    updateDots();

    setTimeout(() => {
      isTransitioning = false;
    }, 500);
  };

  const createDots = () => {
    slides.forEach((_, index) => {
      const dot = document.createElement('div');

      dot.classList.add('dot');

      if (index === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        goToSlide(index);
      });

      dotsContainer.appendChild(dot);
    });
  };

  const nextSlide = () => {
    if (isTransitioning) return;

    currentIndex = (currentIndex + 1) % totalImages;

    goToSlide(currentIndex);
  };

  const prevSlide = () => {
    if (isTransitioning) return;

    currentIndex = (currentIndex - 1 + totalImages) % totalImages;

    goToSlide(currentIndex);
  };

  createDots();

  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);
};

export default initializeCarousel;
