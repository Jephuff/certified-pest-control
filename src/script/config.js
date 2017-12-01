module.exports = {
  origin: window.__origin || location.origin,
  htmlFiles: {
    "src/contact.html": "contact",
    "src/index.html": "home",
    "src/services.html": "services"
  },
  jsonFiles: {
    "data/contact.json": "contact",
    "data/home.json": "home",
    "data/services.json": "services"
  }
};
