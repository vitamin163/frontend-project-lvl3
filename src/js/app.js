import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import parser from './parser';
import { renderFeed, renderInput } from './renderers';
// import $ from 'jquery';

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

  const addRssButtonHandler = e => {
    e.preventDefault();
    const { inputValue, feedURL, feed } = state;
    feedURL.push(inputValue);
    const url = `https://cors-anywhere.herokuapp.com/${inputValue}`;
    axios
      .get(url)
      .then(response => {
        feed.push(parser(response.data));
      })
      .catch(console.log);

    state.inputValue = '';
    state.validationState = null;
  };

  input.addEventListener('input', inputValueHandler);
  input.addEventListener('input', validationHandler);
  addRssButton.addEventListener('click', addRssButtonHandler);

  watch(state, 'inputValue', () => renderInput(state));
  watch(state, 'feed', () => renderFeed(state.feed));
};
