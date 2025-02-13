export const initializeCarousel = () => {
  const slides = document.querySelectorAll(".carousel .slider .slide-container");
  const dotsContainer = document.querySelector(".dotsContainer");
  const slider = document.querySelector(".carousel .slider");
  const prevButton = document.querySelector(".dotsNavOuterContainer .prevButton");
  const nextButton = document.querySelector(".dotsNavOuterContainer .nextButton");

  let currentIndex = 0;
  const totalImages = slides.length;
  let isTransitioning = false;

  if (!dotsContainer || slides.length === 0) {
    console.error("Dots container or slides not found!");
    return;
  }

  const createDots = () => {
    console.log(slides);
    
    slides.forEach((_, index) => {
      const dot = document.createElement("div");

      dot.classList.add("dot");

      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        goToSlide(index);
      });
      
      dotsContainer.appendChild(dot);
    });
  };

  const updateDots = async () => {
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
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

  nextButton.addEventListener("click", nextSlide);
  prevButton.addEventListener("click", prevSlide);
};
