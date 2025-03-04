import { initializeCarousel } from './slider.js';

const createElementWithClass = (tag, className) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
};

const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};

const createArrowButton = (className, text) => {
  const button = createElementWithClass('button', className);
  button.textContent = text;
  return button;
};

const createStructure = () => {
  const structure = {
    slider: createElementWithClass('div', 'slider'),
    dotsNav: {
      outer: createElementWithClass('div', 'dots-nav-outer-container'),
      inner: createElementWithClass('div', 'dots-nav-inner-container'),
      dots: createElementWithClass('div', 'dots-container'),
      arrows: createElementWithClass('div', 'arrow-container'),
      prev: createArrowButton('prev-button', '←'),
      next: createArrowButton('next-button', '→'),
    },
  };

  return structure;
};

const buildNavigation = (structure) => {
  appendChildren(structure.dotsNav.arrows, [
    structure.dotsNav.prev,
    structure.dotsNav.next,
  ]);

  appendChildren(structure.dotsNav.inner, [
    structure.dotsNav.dots,
    structure.dotsNav.arrows,
  ]);

  structure.dotsNav.outer.appendChild(structure.dotsNav.inner);

  return structure.dotsNav.outer;
};

const createTextContainer = (slide) => {
  const textOuterContainer = createElementWithClass('div', 'text-outer-container');
  const children = [...slide.children];

  slide.classList.add('text-container');

  const lastElement = children[children.length - 1];
  if (lastElement) {
    const buttonContainer = createElementWithClass('div', 'button-container');
    const button = document.createElement('button');
    button.textContent = lastElement.textContent;
    buttonContainer.appendChild(button);
    slide.appendChild(buttonContainer);
    lastElement.remove();
  }

  textOuterContainer.appendChild(slide);
  return textOuterContainer;
};

const buildSlider = (structure, block) => {
  [...block.children].forEach((carousel) => {
    carousel.classList.add('slide-container');

    [...carousel.children].forEach((slide, index) => {
      if (index === 0) {
        slide.classList.add('image-container');
      } else {
        const textContainer = createTextContainer(slide);
        carousel.appendChild(textContainer);
      }
    });

    structure.slider.appendChild(carousel);
  });

  return structure.slider;
};

const createDom = async (block) => {
  const structure = createStructure();

  const slider = buildSlider(structure, block);
  const navigation = buildNavigation(structure);

  block.appendChild(slider);
  block.appendChild(navigation);

  await initializeCarousel(block);
};

export default async function decorate(block) {
  if (!block) return;

  await createDom(block);
}
