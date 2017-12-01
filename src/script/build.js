var Handlebars = require("handlebars");
require("handlebars-helpers")();

Handlebars.registerHelper("dist", function(context) {
  return context.replace("/src/", "");
});

Handlebars.registerHelper("num", function(context) {
  switch ("" + context) {
    case "0":
      return "one";
    case "1":
      return "two";
    case "2":
      return "three";
    case "3":
      return "four";
    default:
      return "";
  }
});

Handlebars.registerHelper("safe", function(context) {
  function strip_tags(input, allowed) {
    allowed = (
      ((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
    ).join(""); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input
      .replace(commentsAndPhpTags, "")
      .replace(tags, function($0, $1) {
        return allowed.indexOf("<" + $1.toLowerCase() + ">") > -1 ? $0 : "";
      });
  }

  var html = strip_tags(context, "<a>");
  return html;
});

module.exports = function(template, data) {
  return Handlebars.compile(template)(data);
}