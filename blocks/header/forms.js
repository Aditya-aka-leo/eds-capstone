/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

const getFormData = async () => {
  try {
    const responseMetaData = await fetch(`${window.location.origin}/registration-form.json`);
    if (!responseMetaData.ok) {
      throw new Error(`HTTP error! status: ${responseMetaData.status}`);
    }
    const response = await responseMetaData.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formValues = {};

  formData.forEach((value, key) => {
    formValues[key] = value;
  });

  const checkboxInputs = event.target.querySelectorAll('input[type="checkbox"]');
  checkboxInputs.forEach((checkbox) => {
    formValues[checkbox.name] = checkbox.checked;
  });

  console.log('Form submitted with values:', formValues);
};

const createForm = async () => {
  const data = await getFormData();
  if (!data) {
    console.error('Failed to load form data');
    return null;
  }

  let formContainer = document.getElementById('registration-form-container');
  if (!formContainer) {
    formContainer = document.createElement('div');
    formContainer.id = 'registration-form-container';
    document.body.appendChild(formContainer);
  }

  const form = document.createElement('form');
  form.id = 'registration-form';
  form.className = 'registration-form';

  const header1 = document.createElement('h2');
  header1.textContent = 'Register';
  form.appendChild(header1);

  data.forEach((field) => {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'form-field';

    if (field.Type === 'plaintext') {
      const header = document.createElement('h3');
      header.textContent = field.Label;
      fieldContainer.appendChild(header);
      form.appendChild(fieldContainer);
      return;
    }

    if (field.Type === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = field.Label;
      button.className = 'submit-button';
      fieldContainer.appendChild(button);
      form.appendChild(fieldContainer);
      return;
    }

    if (field.Label && field.Type !== 'checkbox') {
      const label = document.createElement('label');
      label.htmlFor = field.Field;
      label.textContent = field.Label;

      if (field.Mandatory === 'true') {
        const required = document.createElement('span');
        required.className = 'required';
        required.textContent = ' *';
        label.appendChild(required);
      }

      fieldContainer.appendChild(label);
    }

    if (field.Type === 'checkbox') {
      const checkboxLabel = document.createElement('label');
      checkboxLabel.className = 'checkbox-label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = field.Field;
      checkbox.name = field.Field;

      checkboxLabel.appendChild(checkbox);
      checkboxLabel.appendChild(document.createTextNode(` ${field.Label}`));

      fieldContainer.appendChild(checkboxLabel);
    } else if (['text', 'email'].includes(field.Type)) {
      const input = document.createElement('input');
      input.type = field.Type;
      input.id = field.Field;
      input.name = field.Field;
      input.placeholder = field.Placeholder || '';

      if (field.Mandatory === 'true') {
        input.required = true;
      }

      fieldContainer.appendChild(input);
    }

    form.appendChild(fieldContainer);
  });

  form.addEventListener('submit', handleFormSubmit);

  formContainer.innerHTML = '';
  formContainer.appendChild(form);

  return formContainer;
};

export { createForm };
