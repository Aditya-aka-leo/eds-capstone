import { initializeCarousel } from "./slider.js";

const dotsNavs = async (block) => {
  const dotsNavOuterContainer = document.createElement("div");
  dotsNavOuterContainer.classList.add("dotsNavOuterContainer");

  const dotsNavInnerContainer = document.createElement("div");
  dotsNavInnerContainer.classList.add("dotsNavInnerContainer");

  dotsNavOuterContainer.append(dotsNavInnerContainer);

  const dotsContainer = document.createElement("div");
  dotsContainer.classList.add("dotsContainer");

  dotsNavInnerContainer.append(dotsContainer);
  block.append(dotsNavOuterContainer);

  const arrowContainer = document.createElement("div");
  arrowContainer.classList.add("arrowContainer");

  const prevButton = document.createElement("button");
  prevButton.classList.add("prevButton");
  prevButton.textContent = "←";

  const nextButton = document.createElement("button");
  nextButton.classList.add("nextButton");
  nextButton.textContent = "→";
  
  arrowContainer.append(prevButton, nextButton);

  dotsNavInnerContainer.append(arrowContainer);
};

const createSlider = async (block) => {
  const slider = document.createElement("div");
  slider.classList.add("slider");

  [...block.children].forEach((carousel) => {
    carousel.classList.add("slide-container");
    

    [...carousel.children].forEach((slide, index) => {
      
      if (index === 0) slide.classList.add("image-container");
      else {
        const textOuterContainer = document.createElement("div");
        textOuterContainer.classList.add("textOuterContainer");
        carousel.append(textOuterContainer);
        slide.classList.add("text-container");
        textOuterContainer.append(slide);

        [...slide.children].forEach((element, index) => {
          if (index == [...slide.children].length - 1) {
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            const button = document.createElement("button");
            button.textContent = element.textContent;

            buttonContainer.append(button);
            slide.append(buttonContainer);
            
            element.remove();
          }
        });
      }
    });
    slider.append(carousel);
  });

  block.append(slider);
};

export default async function decorate(block) {
  if (!block) return;

  await createSlider(block);
  await dotsNavs(block);
  await initializeCarousel();
}
