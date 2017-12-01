var config = require("./config");
var loadFiles = require("./loadFiles");
var createPreviewHtml = require('./createPreviewHtml');
var makeDataUrl = require("./makeDataUrl");
// window.data
var pages = {};

loadFiles(config.htmlFiles).then(function(pages) {
  document
    .querySelectorAll(
      'a[href="index.html"],a[href="services.html"],a[href="contact.html"]'
    )
    .forEach(function(el) {
      var page = el.href.match(/([^/]+).html/)[1];
      el.href = makeDataUrl(createPreviewHtml(pages[page === "index" ? "home" : page], data), "html");
    });
});
