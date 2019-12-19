export const renderFeed = feed => {
  const div = document.querySelector('#rss');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  feed.map(item => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = document.createElement('h3');
    h3.textContent = item.title;
    const p = document.createElement('p');
    p.textContent = item.description;
    li.append(h3);
    li.append(p);
    ul.append(li);
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
