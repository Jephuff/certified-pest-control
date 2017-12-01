module.exports = function makeDataUrl(str, mimeType) {
  return (
    "data:text/" +
    mimeType +
    ";base64," +
    btoa(unescape(encodeURIComponent(str)))
  );
};
