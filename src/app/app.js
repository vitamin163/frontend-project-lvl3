import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import _ from 'lodash';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import { getFeed, getPosts } from './parser';
import {
  renderFeed,
  renderPost,
  renderInput,
  renderSpinner,
  renderValidation,
  renderSubmitError,
} from './renderers';

export default () => {
  const state = {
    requestState: 'init',
    inputValue: '',
    validationState: 'init',
    feedURL: [],
    feeds: [],
    posts: [],
  };

  const form = document.getElementById('rss-form');
  const input = document.getElementById('main-input');

  let uniqueId;
  let feedUniqueId;

  const updateFeed = (data) => {
    const { feed, posts } = data;
    const checkFeed = state.feeds.filter(item => item.title === feed.title);
    if (checkFeed.length === 0) {
      feedUniqueId = `feed${_.uniqueId()}`;
      feed.newFeedId = feedUniqueId;
      state.feeds.push(feed);
    }
    const addedPosts = state.posts.filter(
      post => post.feedLink === feed.link,
    );
    const newPosts = _.differenceBy(posts, addedPosts, 'pubDate');
    uniqueId = _.uniqueId();
    const taggedPosts = newPosts.map((post) => {
      const newPost = post;
      newPost.newPostId = uniqueId;
      return newPost;
    });
    return state.posts.push(...taggedPosts);
  };

  let timerId = null;

  const request = (links, currentRequestState) => {
    if (links.length <= 0) {
      return null;
    }
    state.requestState = currentRequestState;
    const promises = links.map((url) => {
      const link = `https://cors-anywhere.herokuapp.com/${url}`;
      return axios
        .get(link)
        .then(response => ({ feed: getFeed(response.data), posts: getPosts(response.data) }))
        .then(res => updateFeed(res));
    });

    const promisesAll = Promise.all(promises);

    return promisesAll.then((promise) => {
      if (currentRequestState === 'submitted') {
        state.requestState = 'received';
        state.feedURL.push(state.inputValue);
        state.inputValue = '';
        return promise;
      }
      state.requestState = 'receivedAll';
      return promise;
    }).catch((e) => {
      if (currentRequestState === 'submitted') {
        state.requestState = 'error';
        return state.requestState;
      }
      return e;
    }).finally(() => {
      clearTimeout(timerId);
      timerId = setTimeout(() => request(state.feedURL, 'loading'), 5000);
    });
  };

  const inputValueHandler = (e) => {
    const { value } = e.target;
    state.inputValue = value;
  };

  const validationHandler = () => {
    const { inputValue } = state;
    const isValidValue = isURL(inputValue, {
      protocols: ['http', 'https'],
      require_protocol: true,
    }) && !state.feedURL.includes(inputValue);
    state.validationState = isValidValue;
  };


  const submitHandler = (e) => {
    e.preventDefault();
    const { inputValue } = state;
    state.validationState = 'init';
    clearTimeout(timerId);
    request([inputValue], 'submitted');
  };

  input.addEventListener('input', inputValueHandler);
  input.addEventListener('input', validationHandler);
  form.addEventListener('submit', submitHandler);

  watch(state, 'inputValue', () => renderValidation(state));
  watch(state, 'feeds', () => renderFeed(state.feeds, feedUniqueId));
  watch(state, 'posts', () => renderPost(state.posts, uniqueId));
  watch(state, 'requestState', () => {
    switch (state.requestState) {
      case 'submitted':
        renderSpinner('submitted');
        renderInput(state);
        break;
      case 'error':
        renderInput(state);
        renderSpinner('error');
        renderSubmitError();
        break;
      case 'received':
        renderInput(state);
        renderSpinner('received');
        break;
      case 'receivedAll':
        renderSpinner('receivedAll');
        break;
      default:
        renderSpinner('loading');
    }
  });
};
