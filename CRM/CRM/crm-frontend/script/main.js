import { ClientList } from './ClientList.js';
import { ModalConfirm } from './ModalConfirm.js';
import { loadData, searchClient } from './API.js';
import { MainModal } from './MainModal.js';
import { createPreloader } from './preloader.js';

const $tBody = document.getElementById('table__body'),
  $modalConfirmWrap = document.getElementById('modal-confirm-wrap'),
  $mainModalWrap = document.getElementById('main-modal-wrap'),
  $btnAddClient = document.getElementById('add-client');

export let mainModal = new MainModal($mainModalWrap);
export let modalConfirm = new ModalConfirm($modalConfirmWrap, closeMainModal);
let tableUser = new ClientList(loadData, $tBody, modalConfirm.confirmModalShow, searchClient, createPreloader);

tableUser.preloaderVisible();
await tableUser.loadData();

modalConfirm.render();
mainModal.render();

function closeMainModal() {
  mainModal.modalClose();
};

export function runRender() {
  tableUser.render();
};

$btnAddClient.addEventListener('click', () => {
  mainModal.modalShow({}, tableUser.loadData);
});

document.addEventListener('keydown', (evt) => {
  if (evt.keyCode === 27) {
    modalConfirm.modalClose();
    mainModal.modalClose();
  };
});

// sorting
const $sortBtn = document.querySelectorAll('.sort-btn');

$sortBtn.forEach(function (element) {
  element.addEventListener('click', function () {
    tableUser.sortClient(this.getAttribute('data-type'));
    $sortBtn.forEach(el => { if (el != this) el.classList.remove('arrow--rotate') });
    this.classList.toggle('arrow--rotate');
    tableUser.render();
  });
});

// filter
const $searchInput = document.getElementById('search-input');
$searchInput.addEventListener('input', findClient);

function findClient() {
  setTimeout(async () => {
    await tableUser.searchClient($searchInput.value);
  }, 300);
};


