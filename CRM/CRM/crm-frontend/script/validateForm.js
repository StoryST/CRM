export const validateClientForm = (cliSurname, cliName, cliLastname, validateArray) => {

  const regexp = /^[\u0400-\u04FF]+$/;
  let validCount = 0;

  const onInputValue = input => {
    input.addEventListener('input', () => {
      input.style.borderColor = 'var(--color-txt-gray)';
      for (const item of validateArray) {
        item.textContent = '';
      };
    });

    input.oncut = input.oncopy = input.onpast = () => ('input', () => {
      input.style.borderColor = 'var(--color-txt-gray)';
      for (const item of validateArray) {
        item.textContent = '';
      };
    });

    input.onchange = () => {
      input.style.borderColor = 'var(--color-txt-gray)';
      if (cliSurname.value && cliName.value && cliLastname.value) {
        for (const item of validateArray) {
          item.textContent = '';
        };
      };
    };
  };

  onInputValue(cliSurname);
  onInputValue(cliName);
  onInputValue(cliLastname);

  const checkRequiredName = (input, message, name) => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--color-red)';
      message.textContent = `Введите ${name} клиента!`;
      validCount -= 1;
    } else {
      message.textContent = '';
      validCount += 1;
    };
  };

  const checkByRegexp = (input, regexp) => {
    if (!regexp.test(input.value.trim()) && input.value.trim()) {
      input.style.borderColor = 'var(--color-red)';
      unacceptableLetter.textContent = `Пожалуйста введите корректные символы, поля должны содержать кирилицу и не должны содержать символы '"@#!№;%:?*()_+].,`;
      validCount -= 1;
    } else {
      validCount += 1;
    };
  };

  checkRequiredName(cliSurname, writeSurname, 'Фамилию');
  checkRequiredName(cliName, writeName, 'Имя');
  // checkRequiredName(cliLastname, writeLastname, 'Отчество');
  checkByRegexp(cliSurname, regexp);
  checkByRegexp(cliName, regexp);
  checkByRegexp(cliLastname, regexp);

  if (validCount >= 5) {
    validCount = 0;
    return true;
  } else {
    return false;
  };
};
