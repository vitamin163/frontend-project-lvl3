export default rss => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'application/xml');
  console.log(doc);

  const title = doc.querySelector('title').textContent;

  const description = doc.querySelector('description').textContent;
  // const ttl = doc.querySelector('ttl');

  return { title, description };
};
