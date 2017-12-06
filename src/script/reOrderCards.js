var orderOfCards = ["Home Page", "Services Page", "Contact Page"];
function order() {
  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".nc-entryListing-cardsGrid h1")
  );
  cards.forEach(function(el) {
    var idx = orderOfCards.indexOf(el.textContent);
    if (idx >= 0) {
      el.parentNode.style.order = idx - orderOfCards.length;
    }
  });
  return cards.length;
}

window.onhashchange = order;
var checks = 0;
var intervalId = setInterval(function() {
  if (checks++ > 10) {
    clearInterval(intervalId);
  }
  if (document.querySelector(".nc-sidebar-root")) {
    clearInterval(intervalId);
    if (!order()) {
      for (var i = 0; i < 10; i += 1) {
        setTimeout(order, 100 * i);
      }
    }
  }
}, 100);
