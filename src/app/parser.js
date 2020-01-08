export default rss => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rss, 'application/xml');

  const titleElement = doc.querySelector('title');
  const title = titleElement.textContent;

  const descriptionElement = doc.querySelector('description');
  const description = descriptionElement.textContent;

  const linkElement = doc.querySelector('link');
  const feedLink = linkElement.textContent;

  const feed = { title, description, feedLink };

  const items = [...doc.querySelectorAll('item')];
  const posts = items.map(item => {
    const titleItemElement = item.querySelector('title');
    const titleItem = titleItemElement.textContent;

    const descriptionItemElement = item.querySelector('description');
    const descriptionItem = descriptionItemElement.textContent;

    const pubDateElement = item.querySelector('pubDate');
    const pubDate = Date.parse(pubDateElement.textContent);

    const postLinkElement = item.querySelector('link');
    const postLink = postLinkElement.textContent;
    return { titleItem, descriptionItem, pubDate, feedLink, postLink };
  });

  return { feed, posts };
};
