export const validateContact = (type, input, container) => {
  const regexpEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const onInputValue = input => {
    input.addEventListener('input', () => {
      input.style.borderColor = 'var(--color-txt-gray)';
      container.textContent = '';
    });

    input.oncut = input.oncopy = input.onpast = () => ('input', () => {
      input.style.borderColor = 'var(--color-txt-gray)';
      item.textContent = '';
    });

    input.onchange = () => {
      input.style.borderColor = 'var(--color-txt-gray)';
      if (input.value) {
        container.textContent = '';
      };
    };
  };

  const showErrorMessage = (message, container, input) => {
    container.textContent = message;
    input.style.borderColor = 'var(--color-red)';
  };

  onInputValue(input);

  if (!input.value) {
    showErrorMessage('Заполните поля контактов!', container, input);
    return false;
  };

  switch (type.value) {

    case 'Телефон':
       if (input.value.replace(/[^+0-9]/g, '').length !== 12) {
        showErrorMessage('Введите все 10 цифр не считая "+7"!', container, input);
        return false;
      };
      return true;

    case 'Email':
      if (!regexpEmail.test(input.value)) {
        showErrorMessage('Email введен не корректно!', container, input);
        return false;
      };
      return true;

      case 'Доп.телефон':
        if (input.value.replace(/[^+0-9]/g, '').length !== 12) {
          showErrorMessage('Введите все 10 цифр не считая "+7"!', container, input);
          return false;
        };
        return true;

    default:
      return true;
  };
};
