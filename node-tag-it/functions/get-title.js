function getTitle(text = "") {
  const regex = /\[([^\]]*)\]\(/gm;
  const result = regex.exec(text);
  const title = result && result.length > 0 ? result[1] : text;

  return title;
}

module.exports = getTitle;