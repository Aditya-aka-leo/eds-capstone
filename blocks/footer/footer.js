import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const createElementWithClass = (tag, className) => {
  const element = document.createElement(tag);

  element.classList.add(className);

  return element;
};

const processFooterContent = (footer, structure) => {
  [...footer.children].forEach((section, sectionIndex) => {
    switch (sectionIndex) {
      case 0:
        [...section.children].forEach((child) => {
          [...child.children].forEach((element, elementIndex) => {
            if (elementIndex === 0) structure.logo.appendChild(element);

            if (elementIndex === 1) structure.nav.appendChild(element);
          });
        });
        break;

      case 1:
        [...section.children].forEach((child) => {
          [...child.children].forEach((element, elementIndex) => {
            if (elementIndex === 0) {
              element.classList.add('follow-us');

              structure.socialsContent.appendChild(element);
            } else structure.socialsIcons.appendChild(element);
          });
        });
        break;

      case 2:
        [...section.children].forEach((child) => {
          [...child.children].forEach((element) => {
            structure.content.appendChild(element);
          });
        });
        break;

      default:
        break;
    }
  });
};

const createDom = async (footer, block) => {
  const structure = {
    outerContainer: createElementWithClass('div', 'footer-outer-container'),
    header: createElementWithClass('div', 'footer-header'),
    logoNav: createElementWithClass('div', 'logo-nav-container'),
    logo: createElementWithClass('div', 'footer-header-logo'),
    nav: createElementWithClass('div', 'footer-header-nav'),
    socials: createElementWithClass('div', 'socials-container'),
    socialsContent: createElementWithClass('div', 'socials-content'),
    socialsIcons: createElementWithClass('div', 'socials-icons'),
    content: createElementWithClass('div', 'footer-content'),
  };

  block.appendChild(structure.outerContainer);
  structure.outerContainer.appendChild(structure.header);

  structure.header.appendChild(structure.logoNav);
  structure.logoNav.appendChild(structure.logo);
  structure.logoNav.appendChild(structure.nav);
  structure.header.appendChild(structure.socials);

  structure.socials.appendChild(structure.socialsContent);
  structure.socials.appendChild(structure.socialsIcons);

  structure.outerContainer.appendChild(structure.content);

  footer.classList.add('footer-inner-container');

  processFooterContent(footer, structure);
};

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  await createDom(footer, block);
}
