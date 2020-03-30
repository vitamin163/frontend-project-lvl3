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
  renderValidation,
  renderSubmitError,
} from './renderers';


export default () => {
  const state = {
    requestState: 'init',
    inputValue: '',
    validationState: 'init',
    feedsURL: [],
    feeds: [],
    posts: [],
  };


  const form = document.getElementById('rss-form');
  const input = document.getElementById('main-input');


  let uniqueId;
  let feedUniqueId;
  let timerId = null;


  const updateFeed = (feed) => {
    const {
      title, description, link, posts,
    } = feed;
    const checkFeed = state.feeds.filter(item => item.title === feed.title);
    if (checkFeed.length === 0) {
      feedUniqueId = `feed${_.uniqueId()}`;
      const taggedFeed = {
        title, description, link, newFeedId: feedUniqueId,
      };
      state.feeds.push(taggedFeed);
    }
    const addedPosts = state.posts.filter(
      post => post.link === link,
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


  const request = link => axios.get(`https://cors-anywhere.herokuapp.com/${link}`)
    .then(response => parser(response.data))
    .then(res => updateFeed(res));


  const refreshAllFeeds = (feedsURL) => {
    if (feedsURL.length === 0) {
      return null;
    }

    state.requestState = 'loading';

    const promises = Promise.all(feedsURL.map(url => request(url, 'loading')));
    const feeds = promises.then((responses) => {
      state.requestState = 'receivedAll';
      return responses;
    }).catch((error) => {
      state.requestState = 'otherError';
      console.log(error);
      return error;
    }).finally(() => {
      clearTimeout(timerId);
      timerId = setTimeout(() => refreshAllFeeds(feedsURL), 10000);
    });
    return feeds;
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
    }) && !state.feedsURL.includes(inputValue);
    state.validationState = isValidValue;
  };


  const submitHandler = (e) => {
    e.preventDefault();
    const { inputValue, feedsURL } = state;
    state.validationState = 'init';
    state.requestState = 'submitted';
    request(inputValue)
      .then(() => {
        state.feedsURL.push(inputValue);
        refreshAllFeeds(feedsURL);
      })
      .then(() => {
        state.requestState = 'received';
        state.inputValue = '';
      }).catch((error) => {
        console.log(error);
        state.requestState = 'error';
        return error;
      });
  };


  input.addEventListener('input', inputValueHandler);
  input.addEventListener('input', validationHandler);
  form.addEventListener('submit', submitHandler);


  watch(state, 'inputValue', () => renderValidation(state));
  watch(state, 'feeds', () => renderFeed(state.feeds, feedUniqueId));
  watch(state, 'posts', () => renderPost(state.posts, uniqueId));
  watch(state, 'requestState', () => {
    switch (state.requestState) {
      case 'error':
        renderInput(state);
        renderSubmitError();
        renderSpinner('error');
        break;
      default:
        renderInput(state);
        renderSpinner(state.requestState);
    }
  });
};
