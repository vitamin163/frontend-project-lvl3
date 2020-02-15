export default (rss) => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(rss, 'application/xml');

  const titleElement = doc.querySelector('title');
  const title = titleElement.textContent;

  const descriptionElement = doc.querySelector('description');
  const description = descriptionElement.textContent;

  const linkElement = doc.querySelector('link');
  const link = linkElement.textContent;

  const items = [...doc.querySelectorAll('item')];

  const posts = items.map((item) => {
    const titlePostElement = item.querySelector('title');
    const postTitle = titlePostElement.textContent;

    const descriptionPostElement = item.querySelector('description');
    const postDescription = descriptionPostElement.textContent;

    const pubDateElement = item.querySelector('pubDate');
    const pubDate = Date.parse(pubDateElement.textContent);

    const linkPostElement = item.querySelector('link');
    const postLink = linkPostElement.textContent;
    return {
      postTitle,
      postDescription,
      pubDate,
      postLink,
      link,
    };
  });

  return {
    title, description, link, posts,
  };
};
