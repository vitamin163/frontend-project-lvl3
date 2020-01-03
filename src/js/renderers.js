// import $ from 'jquery';
import _ from 'lodash';

export const renderFeed = feeds => {
  const div = document.querySelector('#rss');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  feeds.map(feed => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = document.createElement('h3');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.textContent = feed.description;

    const ulFeed = document.createElement('ul');
    ulFeed.classList.add('list-group');
    li.append(h3, p, ulFeed);
    ul.append(li);
    feed.items.map(item => {
      const liFeed = document.createElement('li');
      liFeed.classList.add('list-group-item');
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const modalTemplate = document.querySelector('#myModal');
      const modal = modalTemplate.cloneNode(true);
      const modalId = _.uniqueId('myModal_'); // uiqueID
      modal.setAttribute('id', modalId);
      const modalTitle = modal.querySelector('#modal-title');
      modalTitle.textContent = title;
      const modalBody = modal.querySelector('#modal-body');
      modalBody.textContent = description;
      const content = `<div class="row">
          <div class="col-sm-10">
            <h5>${title}</h5>
            <p>${description}</p>
          </div>
          <div class="col-sm-2">
            <button type="button" class="btn btn-info" data-toggle='modal' data-target='#${modalId}'>
              Read
            </button>
          </div>
        </div>`;
      liFeed.innerHTML = content;
      liFeed.append(modal);
      ulFeed.append(liFeed);
      return null;
    });
    return null;
  });
  const newUL = div.querySelector('ul')
    ? div.querySelector('ul').replaceWith(ul)
    : div.append(ul);
  return newUL;
};

export const renderInput = stateApp => {
  const { inputValue, validationState } = stateApp;
  const input = document.getElementById('main-input');
  const addRssButton = document.querySelector('#addRssButton');
  if (validationState === null) {
    addRssButton.disabled = true;
    input.classList.remove('is-valid');
    input.value = '';
  } else if (!inputValue) {
    addRssButton.disabled = true;
    input.classList.remove('is-invalid');
  } else if (validationState) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    addRssButton.disabled = false;
  } else {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    addRssButton.disabled = true;
  }
};
