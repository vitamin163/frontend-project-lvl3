import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
// import $ from 'jquery';
import parser from './parser';
import { renderFeed, renderInput } from './renderers';

export default () => {
  const state = {
    inputValue: '',
    validationState: null,
    feedURL: [],
    feed: [],
  };

  const input = document.getElementById('main-input');
  const addRssButton = document.querySelector('#addRssButton');

  const inputValueHandler = e => {
    const { value } = e.target;
    state.inputValue = value;
  };

  const validationHandler = () => {
    const { inputValue } = state;
    const validation =
      isURL(inputValue, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }) && !state.feedURL.includes(inputValue);
    state.validationState = validation;
  };

  const request = links => {
    const { feed } = state;
    if (links.length <= 0) {
      return null;
    }
    const promises = links.map(url => {
      const link = `https://cors-anywhere.herokuapp.com/${url}`;
      return axios
        .get(link)
        .then(v => ({ result: 'success', value: v }))
        .catch(e => ({ result: 'error', error: e }));
    });
    const promisesAll = Promise.all(promises);
    return promisesAll.then(responses => {
      feed.splice(0, feed.length);
      responses.map(promise => {
        if (promise.result === 'success') {
          return feed.push(parser(promise.value.data));
        }
        return console.log(`${promise.result} ${promise.error}`);
      });
    });
  };

  setInterval(() => request(state.feedURL), 20000);

  const addRssButtonHandler = e => {
    e.preventDefault();
    const { inputValue, feedURL } = state;
    feedURL.push(inputValue);
    state.inputValue = '';
    state.validationState = null;
  };

  input.addEventListener('input', inputValueHandler);
  input.addEventListener('input', validationHandler);
  addRssButton.addEventListener('click', addRssButtonHandler);

  watch(state, 'inputValue', () => renderInput(state));
  watch(state, 'feed', () => renderFeed(state.feed));
  watch(state, 'feedURL', () => request(state.feedURL));
};
