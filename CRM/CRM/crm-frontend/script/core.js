import { svgFacebook, svgOther, svgEmail, svgPhone, svgVk } from "./svg.js";


export function cnd(nm = 'div', cls = [], id = '', atr = {}, content = '') {

  const tr = document.createElement(nm);
  tr.classList.add(...cls);
  if (id !== '') {
    tr.id = id;
  }
  Object.keys(atr).map((key) => {
    tr.setAttribute(key, atr[key]);
  });
  tr.innerHTML = content;

  return tr;
};

export const getDate = (date = new Date()) =>
  `${(date.getDate() > 9) ? '' : '0'}${date.getDate()}.${(date.getMonth() + 1 > 9) ? '' : '0'}${date.getMonth() + 1}.${date.getFullYear()}`;

export const getTime = (date = new Date()) =>
  `${date.getHours()}:${(date.getMinutes() > 9) ? '' : '0'}${date.getMinutes()}`;

export function getContactsContent(type, value, item) {
  switch (type) {
    case 'Телефон':
      let phone;
      createContactLink(type, value, phone, svgPhone, item);
      break;
    case 'Facebook':
      let facebook;
      createContactLink(type, value, facebook, svgFacebook, item);
      break;
    case 'Vk':
      let vk;
      createContactLink(type, value, vk, svgVk, item);
      break;
    case 'Email':
      let email;
      createContactLink(type, value, email, svgEmail, item);
      break;
    case 'Доп.телефон':
      let other;
      createContactLink(type, value, other, svgOther, item);
      break;

    default:
      break;
  };
};


export function createContactLink(type, value, element, svg, item) {
  let hrefSrc = '';
  element = document.createElement('span');
  element.classList.add('contacts__svg');

  if (type === 'Email') {
    hrefSrc = `mailto:${value.trim()}`;
  } else if (type === 'Телефон') {
    hrefSrc = `tel:${value.replace(/[^+0-9]/g, '')}`;
  } else if (type === 'Доп.телефон') {
    hrefSrc = `tel:${value.replace(/[^+0-9]/g, '')}`;
  } else {
    hrefSrc = value.trim();
  };

  element.innerHTML = `${type}: <a href="${hrefSrc}">${value}</a>`;

  tippy(element, {
    content: element.innerHTML,
    allowHTML: true,
    interactive: true,
  });

  element.innerHTML = svg;

  item.append(element);
}
