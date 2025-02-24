const createMainContainer = async (block) => {
  [...block.children].forEach((child) => {
    child.classList.add('outer-container');

    [...child.children].forEach((elem, index) => {
      if (index === 0) elem.classList.add('image-container');

      else {
        elem.classList.add('text-container');

        [...elem.children].forEach((el, ind) => {
          if (ind === elem.children.length - 1) {
            const buttonContainer = document.createElement('div');

            buttonContainer.classList.add('button-container');

            const button = document.createElement('button');
            button.classList.add('button');

            button.innerHTML = el.innerHTML;

            buttonContainer.appendChild(button);

            elem.appendChild(buttonContainer);

            elem.removeChild(el);
          }
        });
      }
    });
  });
};

export default async function decorate(block) {
  if (!block) return;

  await createMainContainer(block);
}
