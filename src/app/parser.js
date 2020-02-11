const parser = (rss) => {
  const domParser = new DOMParser();
  return domParser.parseFromString(rss, 'application/xml');
};

export const getFeed = (rss) => {
  const doc = parser(rss);
  const titleElement = doc.querySelector('title');
  const title = titleElement.textContent;

  const descriptionElement = doc.querySelector('description');
  const description = descriptionElement.textContent;

  const linkElement = doc.querySelector('link');
  const link = linkElement.textContent;

  return { title, description, link };
};

export const getPosts = (rss) => {
  const doc = parser(rss);
  const items = [...doc.querySelectorAll('item')];
  const linkElement = doc.querySelector('link');
  const feedLink = linkElement.textContent;
  const posts = items.map((item) => {
    const titleElement = item.querySelector('title');
    const title = titleElement.textContent;

    const descriptionElement = item.querySelector('description');
    const description = descriptionElement.textContent;

    const pubDateElement = item.querySelector('pubDate');
    const pubDate = Date.parse(pubDateElement.textContent);

    const postLinkElement = item.querySelector('link');
    const link = postLinkElement.textContent;
    return {
      title,
      description,
      pubDate,
      link,
      feedLink,
    };
  });
  return posts;
};
