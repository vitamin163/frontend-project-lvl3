import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import { watch } from 'melanke-watchjs';
// import $ from 'jquery';

export default () => {
  const state = {
    rssAddingProcess: {
      inputValue: '',
      validationState: null,
    },
  };

  const feedList = new Set();

  const textArea = document.getElementById('exampleFormControlTextarea1');
  const addRssButton = document.querySelector('#addRssButton');

  const inputValueHandler = e => {
    const { value } = e.target;
    state.rssAddingProcess.inputValue = value;
  };

  const validationHandler = () => {
    const { inputValue } = state.rssAddingProcess;
    const validation = isURL(inputValue) && !feedList.has(inputValue);
    state.rssAddingProcess.validationState = validation;
  };

  const addRssButtonHandler = e => {
    e.preventDefault();
    const { inputValue } = state.rssAddingProcess;
    feedList.add(inputValue);
    state.rssAddingProcess = {
      inputValue: '',
      validationState: null,
    };
    // console.log(feedList);
  };

  textArea.addEventListener('input', inputValueHandler);
  textArea.addEventListener('input', validationHandler);
  addRssButton.addEventListener('click', addRssButtonHandler);

  const render = stateApp => {
    const { inputValue, validationState } = stateApp.rssAddingProcess;
    if (validationState === null) {
      addRssButton.disabled = true;
      textArea.classList.remove('is-valid');
      textArea.value = '';
    } else if (!inputValue) {
      addRssButton.disabled = true;
      textArea.classList.remove('is-invalid');
    } else if (validationState) {
      textArea.classList.add('is-valid');
      textArea.classList.remove('is-invalid');
      addRssButton.disabled = false;
    } else {
      textArea.classList.add('is-invalid');
      textArea.classList.remove('is-valid');
      addRssButton.disabled = true;
    }
  };

  watch(state, () => render(state));
};
