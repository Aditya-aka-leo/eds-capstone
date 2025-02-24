import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const createElementWithClass = (tag, className) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
};

const createHamburger = () => {
  const hamburger = document.createElement('button');
  hamburger.id = 'hamburger';
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  return hamburger;
};

const setupHamburger = (hamburger, block) => {
  hamburger.onclick = () => {
    block.classList.toggle('ham-active');
  };
};

const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};

const createStructure = () => {
  const structure = {
    navbar: createElementWithClass('div', 'nav-inner-container'),
    logoContainer: createElementWithClass('div', 'logo-hamburger-container'),
    hamburger: createHamburger(),
    navLogo: createElementWithClass('div', 'nav-logo'),
    contentWrapper: createElementWithClass('div', 'nav-content-wrapper-custom'),
    navContent: createElementWithClass('div', 'nav-content'),
    navItems: createElementWithClass('div', 'nav-items'),
    search: createElementWithClass('div', 'search-container'),
    searchIcon: createElementWithClass('div', 'search-icon'),
    searchInput: createElementWithClass('input', 'search-input'),
  };

  // Set default value for search input
  structure.searchInput.type = 'text';
  structure.searchInput.value = 'SEARCH';

  structure.searchInput.onfocus = () => {
    if (structure.searchInput.value === 'Search') {
      structure.searchInput.value = '';
    }
  };

  structure.searchInput.onblur = () => {
    if (structure.searchInput.value.trim() === '') {
      structure.searchInput.value = 'Search';
    }
  };

  return structure;
};

const buildNavContent = (structure, block) => {
  appendChildren(structure.logoContainer, [
    structure.hamburger,
    structure.navLogo,
  ]);

  structure.navContent.appendChild(structure.navItems);

  appendChildren(structure.search, [
    structure.searchIcon,
    structure.searchInput,
  ]);

  appendChildren(structure.contentWrapper, [
    structure.navContent,
    structure.search,
  ]);

  appendChildren(structure.navbar, [
    structure.logoContainer,
    structure.contentWrapper,
  ]);

  [...block.children].forEach((navComp, navCompIndex) => {
    switch (navCompIndex) {
      case 0: {
        const logoLink = document.createElement('a');
        logoLink.href = '/';
        appendChildren(logoLink, [...navComp.children]);
        appendChildren(structure.navLogo, [logoLink]);
        break;
      }
      case 1: {
        [...navComp.children].forEach((navItemComp) => {
          appendChildren(structure.navItems, [...navItemComp.children]);
        });
        break;
      }
      case 2: {
        appendChildren(structure.searchIcon, [...navComp.children]);
        break;
      }
      default:
        break;
    }
    navComp.remove();
  });

  block.appendChild(structure.navbar);
};

const createDom = async (block) => {
  const structure = createStructure();
  setupHamburger(structure.hamburger, block);
  buildNavContent(structure, block);

  let lastScrollY = window.scrollY;

  const onScroll = () => {
    if (lastScrollY !== window.scrollY) {
      if (window.scrollY > 0) {
        structure.navbar.classList.add('nav-scroll');
      } else {
        structure.navbar.classList.remove('nav-scroll');
      }
      lastScrollY = window.scrollY;
    }
    requestAnimationFrame(onScroll);
  };
  requestAnimationFrame(onScroll);
};

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';

  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  await createDom(nav);
  block.append(nav);
}
