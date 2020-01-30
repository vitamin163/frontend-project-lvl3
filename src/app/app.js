import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import _ from 'lodash';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
import parser from './parser';
import {
  renderFeed,
  renderPost,
  renderInput,
  renderSpinner,
} from './renderers';

export default () => {
  const state = {
    requestState: null,
    inputValue: '',
    validationState: null,
    feedURL: [],
    feeds: [],
    posts: [],
  };

  const form = document.getElementById('rss-form');
  const input = document.getElementById('main-input');

  let uniqueId;
  let feedUniqueId;

  const updateFeed = (rss) => {
    const { feed, posts } = parser(rss);
    const checkFeed = state.feeds.filter(item => item.title === feed.title);

    if (checkFeed.length === 0) {
      feedUniqueId = `feed${_.uniqueId()}`;
      feed.newFeedId = feedUniqueId;
      state.feeds.push(feed);
    }

    const addedPosts = state.posts.filter(
      post => post.feedLink === feed.feedLink,
    );
    const newPosts = _.differenceBy(posts, addedPosts, 'pubDate');

    if (newPosts.length > 0) {
      uniqueId = _.uniqueId();
      newPosts.forEach((post) => {
        const newPost = post;
        newPost.newPostId = uniqueId;
      });
      return state.posts.push(...newPosts);
    }
    return null;
  };

  const request = (links, requestState) => {
    if (links.length <= 0) {
      return null;
    }
    state.requestState = requestState;
    const promises = links.map((url) => {
      const link = `https://cors-anywhere.herokuapp.com/${url}`;
      return axios
        .get(link)
        .then(v => ({ result: 'success', value: v }))
        .catch(e => ({ result: 'error', error: e }));
    });
    const promisesAll = Promise.all(promises);
    return promisesAll.then((responses) => {
      state.requestState = 'received';
      setTimeout(() => request(state.feedURL, 'loading'), 5000);
      responses.map((promise) => {
        if (promise.result === 'success') {
          return updateFeed(promise.value.data);
        }
        return console.log(`${promise.result} ${promise.error}`);
      });
    });
  };

  const inputValueHandler = (e) => {
    const { value } = e.target;
    state.inputValue = value;
  };

  const validationHandler = () => {
    const { inputValue } = state;
    const validation = isURL(inputValue, {
      protocols: ['http', 'https'],
      require_protocol: true,
    }) && !state.feedURL.includes(inputValue);
    state.validationState = validation;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { inputValue, feedURL } = state;
    feedURL.push(inputValue);
    state.inputValue = '';
    state.validationState = null;
    request(state.feedURL, 'submit');
  };

  input.addEventListener('input', inputValueHandler);
  input.addEventListener('input', validationHandler);
  form.addEventListener('submit', submitHandler);

  watch(state, 'inputValue', () => renderInput(state));
  watch(state, 'feeds', () => renderFeed(state.feeds, feedUniqueId));
  watch(state, 'posts', () => renderPost(state.posts, uniqueId));
  watch(state, 'requestState', () => {
    switch (state.requestState) {
      case 'submit':
        renderSpinner('submit');
        renderInput(state);
        break;
      case 'received':
        renderInput(state);
        renderSpinner('received');
        break;
      default:
    }
  });
};
