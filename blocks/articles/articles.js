const articles = async (data) => data.filter((block) => block.path.startsWith('/magazine/articles/')
    && !block.path.includes('/magazine/articles/nav')
    && !block.path.includes('/magazine/articles/footer'));

const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};

const createElementWithClass = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const generateArticleCard = (article) => {
  const structure = {
    articleCardOuterContainer: document.createElement('div'),
    articleCardInnerContainer: document.createElement('div'),
    articleCardImage: document.createElement('img'),
    articleCardTitle: document.createElement('p'),
    articleCardDescription: document.createElement('p'),
    articleCardLink: document.createElement('a'),
  };

  structure.articleCardOuterContainer.className = 'card-outer-container';
  structure.articleCardInnerContainer.className = 'card-inner-container';
  structure.articleCardImage.className = 'card-image';
  structure.articleCardTitle.className = 'card-title';
  structure.articleCardDescription.className = 'card-description';
  structure.articleCardLink.className = 'card-link';

  structure.articleCardImage.src = article['article-image'];
  structure.articleCardTitle.textContent = article['article-title'];
  structure.articleCardDescription.textContent = article['article-desc'];

  structure.articleCardLink.href = article.path;
  structure.articleCardLink.appendChild(structure.articleCardInnerContainer);

  appendChildren(structure.articleCardInnerContainer, [
    structure.articleCardImage,
    structure.articleCardTitle,
    structure.articleCardDescription,
  ]);
  appendChildren(structure.articleCardOuterContainer, [structure.articleCardLink]);

  return structure.articleCardOuterContainer;
};

const createDom = async (block, filteredArticles) => {
  const existingContent = Array.from(block.children);

  block.innerHTML = '';

  const structure = {
    articlesOuterContainer: createElementWithClass('div', 'articles-outer-container'),
    articlesInnerContainer: createElementWithClass('div', 'articles-inner-container'),
  };

  appendChildren(structure.articlesOuterContainer, [structure.articlesInnerContainer]);

  block.appendChild(structure.articlesOuterContainer);

  filteredArticles.forEach((article) => {
    const articleCard = generateArticleCard(article);
    structure.articlesInnerContainer.appendChild(articleCard);
  });

  existingContent.forEach((item) => {
    block.appendChild(item);
  });
};

export default async function decorate(block) {
  if (!block) return;

  try {
    const responseMetaData = await fetch(`${window.location.origin}/query-index.json`);
    if (!responseMetaData.ok) {
      throw new Error(`HTTP error! status: ${responseMetaData.status}`);
    }
    const response = await responseMetaData.json();

    const filteredArticles = await articles(response.data);

    await createDom(block, filteredArticles);

    const hrContainer = createElementWithClass('div', 'articles-hr-container');
    const hr = document.createElement('hr');
    hr.className = 'articles-divider';
    hrContainer.appendChild(hr);

    block.appendChild(hrContainer);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
