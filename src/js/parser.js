export default rss => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'application/xml');

  const title = doc.querySelector('title').textContent;

  const description = doc.querySelector('description').textContent;

  return { title, description };
};
