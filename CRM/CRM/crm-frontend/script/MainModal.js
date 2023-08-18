import { cnd } from './core.js';
import { postObj, patchObj } from './API.js';
import { svgAddContact, svgDeleteNewContast, svgModalClose, svgMiniSavePreloader } from './svg.js';
import { validateClientForm } from './validateForm.js';
import { validateContact } from './validateContacts.js';
import { modalConfirm } from './main.js';

export class MainModal {

  constructor
    (
      container,
      confirmModalShow = () => { },
    ) {

    this.clientFlag = false;
    this.container = container;
    this.isVisible = false;
    this.modalShow = this.modalShow.bind(this);
    this.contacts = [];
    this.client = {};
    this.confirmModalShow = confirmModalShow;
    this.updateClientList = () => { };
  };

  modalShow(
    client = {},
    updateClientList = () => { }
  ) {
    this.updateClientList = updateClientList;
    this.client = client;
    this.isVisible = true;
    this.render();
  };

  modalClose() {

    this.isVisible = false;
    this.render();
    this.updateClientList();

  };

  checkStatus(status, container) {
    if (status === 200 || status === 201) {

      this.modalClose()
    } else if (status === 404) {


      container.textContent = 'Переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных';
      return
    } else if (status === 422) {


      container.textContent = 'Объект, переданный в теле запроса, не прошёл валидацию. Тело ответа содержит массив с описаниями ошибок валидации:';
      return
    } else if (status === 500) {


      container.textContent = 'Объект, переданный в теле запроса, не прошёл валидацию. Тело ответа содержит массив с описаниями ошибок валидации:';
    } else {

      container.textContent = 'Отсутствует связь с сервером :(';
    };
    return container;
  };

  async postClient(client, container, btn) {

    try {
      btn.innerHTML = `${svgMiniSavePreloader} Сохранить`;
      let status = await postObj(client);
      btn.innerHTML = `Сохранить`;
      this.checkStatus(status, container);
      this.updateClientList();
      return container;
    } catch (error) {
      console.log('error:', error);
    };
  };

  async patchClient(client, container, btn) {

    try {
      btn.innerHTML = `${svgMiniSavePreloader} Сохранить`;
      let status = await patchObj(client);
      btn.innerHTML = `Сохранить`;
      this.checkStatus(status, container);
      this.updateClientList();
      return container;
    } catch (error) {
      console.log('error:', error);
    };
  };

  getMask(input) {
    let im = new Inputmask(
      {
        alias: "+7 (999) 999-99-99",
        greedy: false,

      });
    return im.mask(input);
  };

  createNewContact(contactType = '', contactValue = '', container) {

    const $selectListItem = cnd('li', ['form__list-item', 'flex'], '', {}, ''),
      $select = cnd('select', ['form__select'], '', {}, ''),
      $optionOther = cnd('option', [], '', { 'value': 'Доп.телефон' }, 'Доп.телефон'),
      $optionEmail = cnd('option', [], '', { 'value': 'Email' }, 'Email'),
      $optionVk = cnd('option', [], '', { 'value': 'Vk' }, 'Vk'),
      $optionFb = cnd('option', [], '', { 'value': 'Facebook' }, 'Facebook'),
      $optionPhone = cnd('option', [], '', { 'value': 'Телефон', 'selected': 'true' }, 'Телефон'),
      $selectInput = cnd('input', ['form__select-input'], '', { 'placeholder': 'Введите данные' }, ''),
      $selectDeleteBtn = cnd('button', ['form__select-del-btn', 'visually-hidden'], '', { 'type': 'reset' }, `${svgDeleteNewContast}`);

    if (contactType === '' || contactType === 'Телефон' || contactType === 'Доп.телефон') {
      this.getMask($selectInput);
    };

    $select.addEventListener('change', function () {
      $selectInput.name = $select.value;
      if (!($select.value === 'Телефон') || !($select.value === 'Доп.телефон')) {

        Inputmask.remove($selectInput);
      };
      if ($select.value === 'Телефон' || $select.value === 'Доп.телефон') {
        let im = new Inputmask(
          {
            alias: "+7 (999) 999-99-99",
            greedy: false,

          });
        im.mask($selectInput);
      };
    });

    $selectDeleteBtn.addEventListener('click', function () {
      $select.value = '';
      $selectInput.value = '';
      $selectListItem.remove();

      if (container.children.length < 10) {
        container.parentNode.querySelector('.form__btn-add-contact').classList.remove('visually-hidden');
      };
      if (container.children.length === 0) {
        container.parentNode.style.paddingTop = '0';
        container.parentNode.style.paddingBottom = '0';
      };
    });

    tippy($selectDeleteBtn, {
      content: 'Удалить контакт',
      allowHTML: true,
    });

    $select.append($optionPhone);
    $select.append($optionOther);
    $select.append($optionEmail);
    $select.append($optionVk);
    $select.append($optionFb);
    $selectListItem.append($select);

    if (contactType !== '' && contactValue !== '') {
      $select.selected = contactType;
      $selectInput.value = contactValue;

      $selectListItem.querySelectorAll('option').forEach(function (option) {
        if (option.value == contactType) {
          option.selected = true;
        } else {
          option.selected = false;
        };
      });
    };

    $selectListItem.append($selectInput);
    $selectListItem.append($selectDeleteBtn);

    $selectInput.addEventListener('input', function () {
      if ($selectInput.value !== '') {
        $selectDeleteBtn.classList.remove('visually-hidden');
      } else {
        $selectDeleteBtn.classList.add('visually-hidden');
      };
    });

    if ($selectInput.value !== '') {
      $selectDeleteBtn.classList.remove('visually-hidden');
    } else {
      $selectDeleteBtn.classList.add('visually-hidden');
    };

    const choices = new Choices($select, {
      searchEnabled: false,
      itemSelectText: '',
      renderSelectedChoices: 'auto',
      shouldSort: false,
      allowHTML: true,
    });

    return $selectListItem;
  };

  fieldEditor(str) {
    return str = str.trim().substring(0, 1).toUpperCase() + str.trim().substring(1).toLowerCase();
  };

  render() {
    this.container.innerHTML = ``;

    const overlayClass = ['modal', 'modal__add-client', 'overlay'],
      modalClass = ['modal__container'];
    let modalTitle = 'Новый клиент',
      modalSubTitle = '',
      clientName = '',
      clientSurname = '',
      clientLastname = '';

    if (this.isVisible) {
      overlayClass.push('overlay-show');
      modalClass.push('modal-show');
    };

    if (Object.keys(this.client).length !== 0) {
      this.clientFlag = true;
      modalTitle = 'Изменить данные';
      modalSubTitle = `ID: ${this.client.id.substr(0, 6)}`;
      clientName = this.client.name;
      clientSurname = this.client.surname;
      clientLastname = this.client.lastName;
    } else {
      this.clientFlag = false;
    };

    const $overlay = cnd('div', overlayClass, '', {}, ''),
      $modal = cnd('div', modalClass, '', {}, ''),

      $title = cnd('h2', ['modal__title', 'main-modal__title'], '', {}, modalTitle),
      $subtitle = cnd('span', ['modal__title-id'], '', {}, modalSubTitle),
      $closeBtn = cnd('button', ['modal__close', 'btn-reset'], 'main-modal-close', {}, `${svgModalClose}`),

      $form = cnd('form', ['form', 'add-form', 'flex'], '', {}, ''),
      $labelSurname = cnd('label', ['form__label'], '', {}, ''),
      $surnameInput = cnd('input', ['form__input', 'form__input-surname', 'add-form__surname'], '', { 'placeholder': ` ` }, ''),

      $surnameSpan = cnd('span', ['form__label-span'], '', {}, `Фамилия<sup>*</sup>`),
      $labelName = cnd('label', ['form__label'], '', {}, ''),
      $nameInput = cnd('input', ['form__input', 'form__input-name', 'add-form__name'], '', { 'placeholder': ` ` },),

      $nameSpan = cnd('span', ['form__label-span'], '', {}, `Имя<sup>*</sup>`),
      $labelLastname = cnd('label', ['form__label'], '', {}, ''),
      $lastnameInput = cnd('input', ['form__input', 'form__input-lastname'], '', { 'placeholder': ` ` }, ''),

      $lastnameSpan = cnd('span', ['form__label-span'], '', {}, `Отчество`),
      $selectSection = cnd('div', ['form__new-contact-wrap', 'add-form__new-contact-wrap', 'flex'], '', {}, ''),
      $formList = cnd('ul', ['form__list'], '', {}, ''),
      $addContactBtn = cnd('button', ['btn-reset', 'disabled', 'form__btn-add-contact'], '', { 'type': 'button' }, `${svgAddContact}Добавить контакт`),

      $errorBlock = cnd('p', ['modal__error'], '', {}, ''),
      $unacceptableLetter = cnd('span', [], 'unacceptableLetter', {}, ''),
      $writeName = cnd('span', [], 'writeName', {}, ''),
      $writeSurname = cnd('span', [], 'writeSurname', {}, ''),
      $writeLastname = cnd('span', [], 'writeLastname', {}, ''),
      $requiredValue = cnd('span', [], 'requiredValue', {}, ''),
      $requiredContacts = cnd('span', [], '', {}, ''),
      $statusMessage = cnd('span', [], 'status-message', {}, ''),

      $saveBtn = cnd('button', ['btn-reset', 'btn-primary', 'form__btn-submit', 'add-form-sub'], '', { 'type': 'submit' }, 'Сохранить'),
      $cancelBtn = cnd('button', ['btn-reset', 'form__btn-cancel', 'add-form-cancel'], '', { 'type': 'reset' }, 'Отмена');

    const validateArray = [$unacceptableLetter, $writeName, $writeSurname, $writeLastname, $requiredValue];

    $surnameInput.value = clientSurname;
    $nameInput.value = clientName;
    $lastnameInput.value = clientLastname;

    if (Object.keys(this.client).length !== 0) {
      this.client.contacts.map((value) => {
        let $newContact = this.createNewContact(value.type, value.value, $formList);
        $formList.append($newContact);
      });
    };

    if ($formList.children.length !== 0) {
      $selectSection.style.paddingTop = '25px';
      $selectSection.style.paddingBottom = '17px';
    };

    $closeBtn.addEventListener('click', () => {
      this.clientFlag = false;
      this.modalClose();
    });


    if (this.clientFlag) {
      $cancelBtn.textContent = 'Удалить клиента';
      $cancelBtn.setAttribute('type', 'button');
      $cancelBtn.addEventListener('click', () => {
        modalConfirm.confirmModalShow(this.client, this.updateClientList);
      });
    } else {
      $cancelBtn.addEventListener('click', () => {
        $cancelBtn.setAttribute('type', 'reset');
        this.modalClose();
      });
    };

    $overlay.addEventListener('click', (e) => {
      if (e.target === $overlay) {
        this.clientFlag = false;
        this.modalClose();
      };
    });

    $addContactBtn.addEventListener('click', () => {

      if ($formList.children.length < 10) {
        const $newContact = this.createNewContact('', '', $formList);
        $formList.append($newContact);
      };
      if ($formList.children.length === 10) {
        $addContactBtn.classList.add('visually-hidden');
      };
      if ($formList.children.length > 0) {
        $selectSection.style.paddingTop = '25px';
        $selectSection.style.paddingBottom = '17px';
      };
    });

    $form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateClientForm($surnameInput, $nameInput, $lastnameInput, validateArray)) return;

      let contactsType = $form.querySelectorAll('.form__select'),
        contactsValue = $form.querySelectorAll('.form__select-input');

      for (let i = 0; i < contactsType.length; i++) {
        if (!validateContact(contactsType[i], contactsValue[i], $requiredContacts)) return;
        this.contacts.push({
          type: contactsType[i].value,
          value: contactsValue[i].value,
        });
      };

      this.client.name = this.fieldEditor($nameInput.value),
        this.client.surname = this.fieldEditor($surnameInput.value),
        this.client.lastName = this.fieldEditor($lastnameInput.value),
        this.client.contacts = this.contacts;

      this.clientFlag ?
        this.patchClient(this.client, $statusMessage, $saveBtn) :
        this.postClient(this.client, $statusMessage, $saveBtn);

      this.contacts = [];
      this.client = {};
      this.clientFlag = false;
    });

    $labelSurname.append($surnameInput, $surnameSpan);
    $labelName.append($nameInput, $nameSpan);
    $labelLastname.append($lastnameInput, $lastnameSpan);
    $selectSection.append($formList, $addContactBtn);

    $errorBlock.append($unacceptableLetter, $writeSurname,
      $writeName, $writeLastname,
      $requiredValue, $requiredContacts, $statusMessage);

    $form.append($labelSurname, $labelName,
      $labelLastname, $selectSection, $errorBlock,
      $saveBtn, $cancelBtn);

    $modal.append($title, $subtitle, $closeBtn, $form);
    $overlay.append($modal);

    this.container.append($overlay);
  };
};
