const createElementWithClass = (tag, className) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
};

const createDom = async (block) => {
  [...block.children].forEach((cardElement) => {
    const structure = {
      card: cardElement,
      outerContainer: createElementWithClass('div', 'cards-outer-container'),
      imageContainer: createElementWithClass('div', 'image-container'),
      infoContainer: createElementWithClass('div', 'card-info-outer-container'),
      authorName: createElementWithClass('div', 'author-name-container'),
      authorInterests: createElementWithClass('div', 'author-interests-container'),
      socialsContainer: createElementWithClass('div', 'socials-container'),
    };

    structure.card.classList.add('cards-inner-container');

    structure.outerContainer.append(structure.card);
    block.append(structure.outerContainer);

    [...cardElement.children].forEach((cardContent, index) => {
      if (index === 0) {
        structure.imageContainer.append(cardContent);
        structure.card.append(structure.imageContainer);
      } else {
        cardContent.classList.add('card-info-inner-container');
        structure.infoContainer.append(cardContent);
        structure.card.append(structure.infoContainer);

        [...cardContent.children].forEach((cardInfoContent, indexContent) => {
          if (indexContent === 0) {
            structure.authorName.append(cardInfoContent);
            cardContent.append(structure.authorName);
          } else if (indexContent === 1) {
            structure.authorInterests.append(cardInfoContent);
            cardContent.append(structure.authorInterests);
          } else structure.socialsContainer.append(cardInfoContent);
        });

        cardContent.append(structure.socialsContainer);
      }
    });
  });
};

export default async function decorate(block) {
  if (!block) return;
  await createDom(block);
}
