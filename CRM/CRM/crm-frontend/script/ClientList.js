import { ClientRow } from './ClientRow.js';

export class ClientList {

  constructor(
    loadData = () => { },
    container,
    modalShow = () => { },
    searchClient = () => { },
    createPreloader = () => { }
  ) {
    this.clientList = [];
    this.container = container;
    this.modalShow = modalShow;
    this.sortColumnFlag = 'id';
    this.sortDirFlag = true;
    this.searchFunc = searchClient;
    this.createPreloader = createPreloader;
    this.getClientList = loadData;
    this.loadData = this.loadData.bind(this);
  };

  preloaderVisible() {
    this.container.innerHTML = ``;
    const preloaderBlock = this.createPreloader();
    this.container.append(preloaderBlock);
  };

  async loadData() {
    this.clientList = await this.getClientList();
    this.render();
  };

  async searchClient(searchValue) {
    this.preloaderVisible();
    this.clientList = await this.searchFunc(searchValue);
    this.render();
  };

  sortClient(sortFlag) {
    this.sortColumnFlag = sortFlag;
    this.sortDirFlag = !this.sortDirFlag;
  };

  render() {

    this.container.innerHTML = ``;

    this.clientList = this.clientList.sort((a, b) => {
      a = a[this.sortColumnFlag].toLowerCase();
      b = b[this.sortColumnFlag].toLowerCase();

      let sort = this.sortDirFlag === false ? a > b : a < b;

      if (sort) return -1;
    });

    this.clientList.map((clientEl) => {
      this.container.append(new ClientRow(clientEl, this.modalShow, this.loadData).render());
    });
  };
};

