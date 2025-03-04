import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { createForm } from './forms.js';

const createElementWithClass = (tag, className) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
};

const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};

const createHamburger = () => {
  const hamburger = document.createElement('button');
  hamburger.id = 'hamburger';
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  return hamburger;
};

const createSignInContainer = () => {
  const signInContainer = createElementWithClass('div', 'sign-in-container');
  const signInText = createElementWithClass('span', 'sign-in-text');
  signInText.textContent = 'Sign in';

  const registrationForm = document.getElementById('registration-form-container');

  signInContainer.appendChild(signInText);

  signInContainer.onclick = () => {
    signInContainer.classList.toggle('signed-in');

    registrationForm.classList.toggle('show-form');
  };

  return signInContainer;
};

const createLanguageSelector = (lanMetaDataTree, signInContainer) => {
  const languageContainer = createElementWithClass('div', 'language-selector-container');
  const currentLanguage = createElementWithClass('div', 'current-language');
  const flagIcon = createElementWithClass('span', 'flag-icon');
  const languageCode = createElementWithClass('span', 'language-code');
  const dropdownArrow = createElementWithClass('span', 'dropdown-arrow');
  dropdownArrow.innerHTML = '&#9662;';
  const dropdownContent = createElementWithClass('div', 'language-dropdown-content');

  languageContainer.appendChild(signInContainer);

  const languageList = [];

  if (lanMetaDataTree.querySelector('ul')) {
    const languageItems = lanMetaDataTree.querySelectorAll('li');

    languageItems.forEach((item) => {
      const languageEntry = {
        link: item.querySelector('a')?.href || '#',
        flagIconName: item.querySelector('.icon img')?.dataset?.iconName || '',
        flagIconSrc: item.querySelector('.icon img')?.src || '',
        name: item.textContent.split(/\s*<u>|\s*\w+-\w+/)[0].trim(),
        codes: [],
      };

      const codeElement = item.querySelector('u');
      if (codeElement) {
        const codesText = codeElement.textContent || '';
        languageEntry.codes = codesText.split('|').map((code) => code.trim());
      }

      languageList.push(languageEntry);
    });
  }

  if (languageList.length > 0) {
    const currentLang = languageList[0];

    // Set up current language display
    if (currentLang.flagIconSrc) {
      const imgElement = document.createElement('img');
      imgElement.src = currentLang.flagIconSrc;
      imgElement.alt = currentLang.flagIconName || '';
      imgElement.setAttribute('loading', 'lazy');
      flagIcon.appendChild(imgElement);
    }

    languageCode.textContent = currentLang.codes[0] || '';

    appendChildren(currentLanguage, [flagIcon, languageCode, dropdownArrow]);
  }

  languageList.forEach((lang) => {
    const languageOption = createElementWithClass('div', 'language-option');

    const countryFlag = createElementWithClass('span', 'country-flag');
    if (lang.flagIconSrc) {
      const imgElement = document.createElement('img');
      imgElement.src = lang.flagIconSrc;
      imgElement.alt = lang.flagIconName || '';
      imgElement.setAttribute('loading', 'lazy');
      countryFlag.appendChild(imgElement);
    }

    const countryInfo = createElementWithClass('div', 'country-info');
    const countryName = createElementWithClass('div', 'country-name');
    countryName.textContent = lang.name;

    const languageCodes = createElementWithClass('div', 'language-codes');
    languageCodes.textContent = lang.codes.join(' | ');

    appendChildren(countryInfo, [countryName, languageCodes]);
    appendChildren(languageOption, [countryFlag, countryInfo]);

    languageOption.onclick = () => {
      if (lang.link && lang.link !== '#') {
        window.location.href = lang.link;
      }
    };

    dropdownContent.appendChild(languageOption);
  });

  currentLanguage.onclick = () => {
    dropdownContent.classList.toggle('show');
  };

  document.addEventListener('click', (event) => {
    if (!languageContainer.contains(event.target)) {
      dropdownContent.classList.remove('show');
    }
  });

  appendChildren(languageContainer, [currentLanguage, dropdownContent]);

  return languageContainer;
};

const setupHamburger = (hamburger, block) => {
  hamburger.onclick = () => {
    block.classList.toggle('ham-active');
  };
};

const createStructure = () => {
  const structure = {
    navbar: createElementWithClass('div', 'nav-inner-container'),
    headerMainComp: createElementWithClass('div', 'header-main-comp'),
    logoContainer: createElementWithClass('div', 'logo-hamburger-container'),
    hamburger: createHamburger(),
    navLogo: createElementWithClass('div', 'nav-logo'),
    contentWrapper: createElementWithClass('div', 'nav-content-wrapper-custom'),
    navContent: createElementWithClass('div', 'nav-content'),
    navItems: createElementWithClass('div', 'nav-items'),
    search: createElementWithClass('div', 'search-container'),
    searchIcon: createElementWithClass('div', 'search-icon'),
    searchInput: createElementWithClass('input', 'search-input'),
    signInContainer: createSignInContainer(),
  };

  structure.searchInput.type = 'text';
  structure.searchInput.placeholder = 'Search';

  structure.searchInput.onfocus = () => {
    if (structure.searchInput.placeholder === 'Search') {
      structure.searchInput.placeholder = '';
    }
  };

  structure.searchInput.onblur = () => {
    if (structure.searchInput.value.trim() === '') {
      structure.searchInput.placeholder = 'Search';
    }
  };

  structure.searchInput.onkeypress = (event) => {
    if (event.key === 'Enter') {
      const query = structure.searchInput.value.trim();
      if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    }
  };

  return structure;
};

const buildNavContent = (structure, block) => {
  appendChildren(structure.navbar, [structure.headerMainComp]);
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

  appendChildren(structure.headerMainComp, [
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
      case 3: {
        const languageSelector = createLanguageSelector(navComp, structure.signInContainer);
        structure.navbar.prepend(languageSelector);
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
        structure.headerMainComp.classList.add('nav-scroll');
      } else {
        structure.headerMainComp.classList.remove('nav-scroll');
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

  const formContainer = await createForm();
  block.append(formContainer);
  await createDom(nav);
  block.append(nav);

  document.body.appendChild(formContainer);
}
