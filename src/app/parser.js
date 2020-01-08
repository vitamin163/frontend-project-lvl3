export default rss => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'application/xml');

  const title = doc.querySelector('title').textContent;

  const description = doc.querySelector('description').textContent;
  const feedLink = doc.querySelector('link').textContent;
  const feed = { title, description, feedLink };

  const items = [...doc.querySelectorAll('item')];
  const posts = items.map(item => {
    const titleItem = item.querySelector('title').textContent;
    const descriptionItem = item.querySelector('description').textContent;
    const pubDate = Date.parse(item.querySelector('pubDate').textContent);
    const postLink = item.querySelector('link').textContent;
    return { titleItem, descriptionItem, pubDate, feedLink, postLink };
  });

  return { feed, posts };
};
