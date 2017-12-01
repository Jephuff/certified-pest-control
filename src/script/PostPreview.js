var makeDataUrl = require("./makeDataUrl");
var config = require('./config');
var createPreviewHtml = require('./createPreviewHtml');
var loadFiles = require('./loadFiles');
var pages = {};
var data = {};

loadFiles(config.jsonFiles).then(function(d) {
  data = d;
});

loadFiles(config.htmlFiles).then(function(d) {
  pages = d;
});

var PostPreview = createClass({
  render: function() {
    var entry = this.props.entry.toJS();
    var newData = Object.keys(data).reduce(function(acc, key) {
      acc[key] = data[key];
      return acc;
    }, {});
    console.log(newData);
    newData[config.jsonFiles[entry.path]] = entry.data;
    return h("iframe", {
      frameborder: 0,
      src: makeDataUrl(createPreviewHtml(pages[config.jsonFiles[entry.path]], newData), "html"),
      style: { width: "100%", height: "100%" }
    });
  }
});

CMS.registerPreviewTemplate("home", PostPreview);
CMS.registerPreviewTemplate("services", PostPreview);
CMS.registerPreviewTemplate("contact", PostPreview);

CMS.registerPreviewStyle(
  makeDataUrl(
    "html, body, body > div, .frame-content { height: calc(100% - 1px); margin: 0; }",
    "css"
  )
);
