import _ from 'lodash';

export const renderFeed = (feeds, feedUniqueId) => {
  const divRss = document.querySelector('#rss');
  const [newFeed] = feeds.filter(feed => feed.newFeedId === feedUniqueId);
  const ulFeed = document.createElement('ul');
  ulFeed.classList.add('list-group');
  ulFeed.id = newFeed.link;
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = newFeed.title;
  const feedDescription = document.createElement('p');
  feedDescription.textContent = newFeed.description;
  ulFeed.append(feedTitle, feedDescription);
  divRss.append(ulFeed);
};

export const renderPost = (posts, uniqueId) => {
  const newPosts = posts.filter(post => post.newPostId === uniqueId);
  return newPosts.map((post) => {
    const {
      postTitle, postDescription, postLink, link,
    } = post;
    const ulFeed = document.getElementById(link);

    const liPost = document.createElement('li');

    liPost.classList.add('list-group-item');

    const modalTemplate = document.querySelector('#myModal');
    const modal = modalTemplate.cloneNode(true);
    const modalId = _.uniqueId('myModal_');
    modal.setAttribute('id', modalId);
    const modalTitle = modal.querySelector('#modal-title');
    modalTitle.textContent = postTitle;
    const modalBody = modal.querySelector('#modal-body');
    modalBody.textContent = postDescription;
    const content = (
      `<div class="row">
        <div class="col-sm-11">
          <a href="${postLink}" target="blanc">${postTitle}</a>
        </div>
        <div class="col-sm-1">
          <button type="button" class="btn btn-info" data-toggle='modal' data-target='#${modalId}'>
            Read
          </button>
        </div>
      </div>`
    );
    liPost.innerHTML = content;
    liPost.append(modal);
    return ulFeed.append(liPost);
  });
};

export const renderSubmitError = () => {
  const alertContainer = document.querySelector('#submitError');
  const alert = (
    `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        Не удалось получить данные. Проверьте url или повторите попытку позже.
        <button
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`
  );
  alertContainer.innerHTML = alert;
};

export const renderInput = (stateApp) => {
  const { requestState } = stateApp;
  const input = document.getElementById('main-input');
  const addRssButton = document.querySelector('#addRssButton');

  if (requestState === 'received') {
    input.removeAttribute('disabled');
    input.value = '';
  }
  if (requestState === 'receivedAll') {
    input.removeAttribute('disabled');
  }
  if (requestState === 'submitted') {
    input.setAttribute('disabled', 'true');
    addRssButton.disabled = true;
  }
  if (requestState === 'error') {
    input.removeAttribute('disabled');
    addRssButton.disabled = false;
  }
};

export const renderValidation = (state) => {
  const { inputValue, validationState } = state;
  const input = document.getElementById('main-input');
  const addRssButton = document.querySelector('#addRssButton');
  if (validationState === 'init') {
    addRssButton.disabled = true;
    input.classList.remove('is-valid');
  } else if (!inputValue) {
    addRssButton.disabled = true;
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
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

export const renderSpinner = (requestState) => {
  const spinnerContainer = document.getElementById('spinner-container');
  if (requestState === 'submitted' || requestState === 'loading') {
    spinnerContainer.classList.remove('d-none');
  } else {
    spinnerContainer.classList.add('d-none');
  }
};
