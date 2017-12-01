var axios = require("axios");

module.exports = function(fileMap) {
  var data = {};

  var files = Object.keys(fileMap);
  return Promise.all(
    files.map(function(file) {
      return axios.get(
        "https://raw.githubusercontent.com/Jephuff/certified-pest-control/master/" +
          file
      );
    })
  ).then(function(data) {
    return data.reduce(function(acc, obj, i) {
      acc[fileMap[files[i]]] = obj.data;
      return acc;
    }, {});
  });
};
 