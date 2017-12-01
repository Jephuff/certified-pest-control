var build = require("./build");
var config = require("./config");

module.exports = function(page, data) {
  return build(page, data).replace(
    "<head>",
    "<head>\n" +
      '<base href="' +
      config.origin +
      '">\n' +
      "<script>\n" +
      "window.__origin = '" +
      config.origin +
      "';\n" +
      "var data = " +
      JSON.stringify(data) +
      ";\n" +
      "</script>" +
      '<script src="/script/embeded.js"></script>'
  );
};
