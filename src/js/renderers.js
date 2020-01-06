import _ from 'lodash';

export const renderFeed = (feeds, feedUniqueId) => {
  const divRss = document.querySelector('#rss');
  const [newFeed] = feeds.filter(feed => feed.newFeedId === feedUniqueId);
  const UlFeed = document.createElement('ul');
  UlFeed.classList.add('list-group');
  UlFeed.id = newFeed.feedLink;
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = newFeed.title;
  const feedDescription = document.createElement('p');
  feedDescription.textContent = newFeed.description;
  UlFeed.append(feedTitle, feedDescription);
  divRss.append(UlFeed);
};

export const renderPost = (posts, uniqueId) => {
  const newPosts = posts.filter(post => post.newPostId === uniqueId);
  newPosts.map(post => {
    const UlFeed = document.getElementById(post.feedLink);
    const liPost = document.createElement('li');
    liPost.classList.add('list-group-item');
    const title = post.titleItem;
    const description = post.descriptionItem;
    const modalTemplate = document.querySelector('#myModal');
    const modal = modalTemplate.cloneNode(true);
    const modalId = _.uniqueId('myModal_');
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
    liPost.innerHTML = content;
    liPost.append(modal);
    return UlFeed.append(liPost);
  });
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
