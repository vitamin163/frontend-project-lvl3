import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import isURL from 'validator/lib/isURL';
import _ from 'lodash';
import { watch } from 'melanke-watchjs';
import axios from 'axios';
// import $ from 'jquery';
import parser from './parser';
import { renderFeed, renderPost, renderInput } from './renderers';

export default () => {
  const state = {
    inputValue: '',
    validationState: null,
    feedURL: [],
    feeds: [],
    posts: [],
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

  let uniqueId;
  let feedUniqueId;

  const updateFeed = rss => {
    const { feed, posts } = parser(rss);

    const checkFeed = state.feeds.filter(item => item.title === feed.title);

    if (checkFeed.length === 0) {
      feedUniqueId = `feed ${_.uniqueId()}`;
      feed.newFeedId = feedUniqueId;
      state.feeds.push(feed);
    }

    const oldPost = state.posts.filter(post => post.feedLink === feed.feedLink);
    const pubDates = oldPost.map(post => post.pubDate);
    const latestPost = Math.max.apply(null, pubDates); // rename latestPostDate
    const newPosts = posts.filter(post => post.pubDate > latestPost);
    console.log(newPosts);

    if (newPosts.length > 0) {
      uniqueId = _.uniqueId();
      newPosts.forEach(post => {
        const newPost = post;
        newPost.newPostId = uniqueId;
      });
      return state.posts.push(...newPosts);
    }
    return null;
  };

  const request = links => {
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
      responses.map(promise => {
        if (promise.result === 'success') {
          return updateFeed(promise.value.data);
        }
        return console.log(`${promise.result} ${promise.error}`);
      });
    });
  };

  setInterval(() => request(state.feedURL), 30000);

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
  watch(state, 'feeds', () => renderFeed(state.feeds, feedUniqueId));
  watch(state, 'posts', () => renderPost(state.posts, uniqueId));
  watch(state, 'feedURL', () => request(state.feedURL));
};
