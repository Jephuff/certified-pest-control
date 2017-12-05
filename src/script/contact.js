var tween = require("gsap").TweenLite;

var formTypes = {
  "Request a Free Quote": "request-form",
  "General Inquiries": "general-form"
};

window.onFormTypeChange = function onFormTypeChange(e) {
  var classList = document.querySelector(".form form").classList;

  Object.keys(formTypes).forEach(function(key) {
    classList.remove(formTypes[key]);
  });

  classList.add(formTypes[e.value]);

  var elementsIn = Array.prototype.slice.call(
    document.querySelectorAll(".form .request-form .only-request")
  );
  var elementsOut = Array.prototype.slice.call(
    document.querySelectorAll(".form .general-form .only-request")
  );

  elementsOut.forEach(function(el) {
    el.dataset.height = el.offsetHeight;
  });

  elementsIn.forEach(function(parent) {
    tween.to(parent, 0.5, {
      ease: Expo.easeOut,
      opacity: 1,
      y: "0%",
      height: parent.dataset.height,
      onComplete: function() {
        var el = parent.querySelector("[name]");
        if (el.dataset.required) {
          el.required = true;
        }
      }
    });
  });

  tween.to(elementsOut, 0.5, {
    ease: Expo.easeOut,
    opacity: 0,
    height: 0,
    y: "-100%",
    onComplete: function() {
      elementsOut.forEach(function(parent) {
        var el = parent.querySelector("[name]");
        el.value = "";
        if (el.required) {
          el.required = false;
          el.dataset.required = true;
        }
      });
    }
  });
};

window.initMap = function initMap() {
  var latlng = new google.maps.LatLng(43.992606, -78.023462);
  var map = new google.maps.Map(document.getElementById("map"), {
    center: latlng,
    zoom: 10,
    disableDefaultUI: true
  });

  var centered = false;
  map.addListener("projection_changed", function() {
    if (!centered) {
      centered = true;
      var center = window.innerWidth / 2;
      var overlay = document.querySelector(".map-overlay");
      var leftPostion = overlay.offsetWidth / 2 + 10;
      offsetCenter(latlng, leftPostion, overlay.offsetWidth / 2 - 100);
    }
  });

  function offsetCenter(latlng, offsetx, offsety) {
    // latlng is the apparent centre-point
    // offsetx is the distance you want that point to move to the right, in pixels
    // offsety is the distance you want that point to move upwards, in pixels
    // offset can be negative
    // offsetx and offsety are both optional

    var scale = Math.pow(2, map.getZoom());
    var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
    var pixelOffset = new google.maps.Point(
      offsetx / scale || 0,
      offsety / scale || 0
    );

    var worldCoordinateNewCenter = new google.maps.Point(
      worldCoordinateCenter.x - pixelOffset.x,
      worldCoordinateCenter.y + pixelOffset.y
    );

    var newCenter = map
      .getProjection()
      .fromPointToLatLng(worldCoordinateNewCenter);

    map.setCenter(newCenter);
  }

  var service = new google.maps.places.PlacesService(map);

  service.getDetails(
    {
      placeId: "ChIJOUaZBs7d1YkR4lHI05GKpRk"
    },
    function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        google.maps.event.addListener(marker, "click", function() {
          window.open(
            "https://www.google.ca/maps/place/Grafton,+ON+K0K+2G0/@43.9923162,-78.0345331,14.63z/data=!4m13!1m7!3m6!1s0x89d5ddce06994639:0x19a58a91d3c851e2!2sGrafton,+ON+K0K+2G0!3b1!8m2!3d43.992634!4d-78.023383!3m4!1s0x89d5ddce06994639:0x19a58a91d3c851e2!8m2!3d43.992634!4d-78.023383",
            "_BLANK"
          );
        });
      }
    }
  );
};
