import { cnd } from './core.js';
import { deleteObj } from './API.js';
import { svgModalClose } from './svg.js';

export class ModalConfirm {

  constructor(container, mainModalClose = () => {}) {

    this.container = container;
    this.isVisible = false;
    this.client = {};
    this.confirmModalShow = this.confirmModalShow.bind(this);
    this.mainModalClose = mainModalClose;
    this.preloaderBtn = '';
    this.updateClientList = () => {};
  };

  async deleteClient() {
    try {
      let response = await deleteObj(this.client);
    } catch (error) {
      console.log(error);
    };
  };

  confirmModalShow(client, updateClientList = () => {}) {
    this.client = client;
    this.updateClientList = updateClientList;
    this.isVisible = true;
    this.render();
  };

  modalClose() {
    this.isVisible = false;
    this.mainModalClose();
    this.updateClientList();
    this.client = {};
    this.render();
  };

  render() {

    this.container.innerHTML = ``;

    const overlayClass = ['modal', 'modal__confirm', 'overlay'],
      modalClass = ['modal__container', 'confirm', 'flex'];

    if (this.isVisible) {

      overlayClass.push('overlay-show');
      modalClass.push('modal-show');
    };

    const $overlay = cnd('div', overlayClass, 'confirm-overlay', {}, ''),
      $modal = cnd('div', modalClass, 'modal-confirm', {}, ''),
      $title = cnd('h2', ['modal__title', 'confirm__title'], '', {}, 'Удалить клиента'),
      $closeBtn = cnd('button', ['modal__close', 'confirm__close', 'btn-reset'], '', {}, `${svgModalClose}`),
      $textContent = cnd('p', ['modal__text', 'confirm__text'], '', {}, 'Вы действительно хотите удалить данного клиента?'),
      $confirmBtn = cnd('button', ['btn-reset', 'btn-primary', 'form__btn-submit', 'confirm__btn-delete'], '', { type: 'submit' }, 'Удалить'),
      $cancelBtn = cnd('button', ['btn-reset', 'form__btn-cancel', 'confirm__btn-cancel'], '', {}, 'Отмена');

    $modal.style.zIndex = '10000';
    $overlay.style.zIndex = '10000';

    $overlay.addEventListener('click', (e) => {
      this.modalClose();
    });

    $modal.addEventListener('click', (e) => {
      e.stopPropagation()
    });

    $confirmBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await this.deleteClient();
      this.modalClose();
    });

    $closeBtn.addEventListener('click', () => {
      this.modalClose();
    });

    $cancelBtn.addEventListener('click', () => {
      this.modalClose();
    });

    $modal.append($title);
    $modal.append($textContent);
    $modal.append($confirmBtn);
    $modal.append($cancelBtn);
    $modal.append($closeBtn);
    $overlay.append($modal);

    this.container.append($overlay);
  };
};
