import { mainModal } from './main.js';
import { cnd, getDate, getTime, getContactsContent } from './core.js';
import { svgDeleteClient, svgEditClient, svgMiniDeletePreloader, svgMiniPreloader } from './svg.js';
import { getClient } from './API.js';

export class ClientRow {

  constructor
    (
      client,
      confirmModalShow = () => { },
      updateClientList = () => { }
    ) {
    this.client = client;
    this.confirmModalShow = confirmModalShow;
    this.contacts = this.client.contacts;
    this.updateClientList = updateClientList;
  };

  render() {

    const $cliTr = cnd('tr', ['table__row', 'data']),
      $tdID = cnd('td', ['table__data', 'data__id'], '', {}, this.client.id.substr(0, 6)),
      $tdFName = cnd('td', ['table__data', 'data__full-name'], '', {}, `${this.client.surname} ${this.client.name} ${this.client.lastName}`),
      $tdCreate = cnd('td', ['table__data', 'data__create'], '', {}),
      $tdSpanCreateDate = cnd('span', ['data__create-date'], '', {}, getDate(new Date(this.client.createdAt))),
      $tdSpanCreateTime = cnd('span', ['data__create-time', 'table__data--gray'], '', {}, getTime(new Date(this.client.createdAt))),
      $tdEdit = cnd('td', ['table__data', 'data__edit'], '', {}),
      $tdSpanEditDate = cnd('span', ['data__edit-date'], '', {}, getDate(new Date(this.client.updatedAt))),
      $tdSpanEditTime = cnd('span', ['data__edit-time', 'table__data--gray'], '', {}, getTime(new Date(this.client.updatedAt))),
      $tdContacts = cnd('td', ['table__data', 'data__contacts'], '', {}),
      $tdAction = cnd('td', ['table__data', 'data__actions'], '', {}),
      $btnEdit = cnd('button', ['btn-reset', 'row-btn', 'btn-edit'], '', {}, `${svgEditClient}Изменить`),
      $btnDelete = cnd('button', ['btn-reset', 'row-btn', 'btn-delete'], '', {}, `${svgDeleteClient}Удалить`);

    $cliTr.append($tdID);
    $cliTr.append($tdFName);
    $tdCreate.append($tdSpanCreateDate);
    $tdCreate.append($tdSpanCreateTime);
    $cliTr.append($tdCreate);
    $tdEdit.append($tdSpanEditDate);
    $tdEdit.append($tdSpanEditTime);
    $cliTr.append($tdEdit);
    $cliTr.append($tdContacts);

    this.client.contacts.map((value) => {
      getContactsContent(value.type, value.value, $tdContacts);
    });

    $tdAction.append($btnEdit);
    $tdAction.append($btnDelete);
    $cliTr.append($tdAction);

    $btnEdit.addEventListener('click', async () => {
      $btnEdit.innerHTML = `${svgMiniPreloader}Изменить`;
      mainModal.modalShow(await getClient(this.client.id), this.updateClientList);
      $btnEdit.innerHTML = `${svgEditClient}Изменить`;
    });

    $btnDelete.addEventListener('click', () => {
      $btnDelete.innerHTML = `${svgMiniDeletePreloader}Удалить`;
      this.confirmModalShow(this.client, this.updateClientList);
    });

    return $cliTr
  };
};

