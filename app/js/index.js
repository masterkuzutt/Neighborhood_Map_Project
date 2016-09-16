var jQuery = $ = require ("./libs/jquery.min.js"),
    ko = require ("./libs/knockout-3.2.0.js"),
    config = require("./app.config.js")


/**
 * @description create marker icon for google map and set it to marker
 * @param  {sting}  colorcode 'FFF'
 * @return {object} image marker object for google map marker
 */
function createMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

/**
 * @description Represents  location data position and related data for google.maps.api
 * @constructor
 * @param  {object}  title :  'Initial Location' ,position :  {lat: 40.74135, lng: -73.99802},imgUrl:'http://www.hoge.jp/img' ,address: 'ocation address'
 */

var Location = function(data) {
    "use strict";
    var self = this;
    this.title = data.title;
    this.lat = data.position.lat;
    this.lng = data.position.lng;
    this.position = data.position;
    this.address = ko.observable(data.address);
    this.message = "";
    this.discription = "";
    this.visibility = ko.observable(true);
    this.latLng = new google.maps.LatLng(data.position.lat, data.position.lng);
    this.marker = new google.maps.Marker({
        title: this.title,
        position: this.position,
        map: null,
        animation: google.maps.Animation.DROP
    });
    this.streetViewLoc = null;

};


/**
 * @description Represents MV for location data and hmtl
 * @constructor
 */
var ViewModel = function() {
    "use strict";
    var self = this;

    // init map
    this.map = new google.maps.Map($('#map')[0], {
        center: config.INITIAL_LOCATION_DATA[0].position,
        zoom: 8,
        styles: config.STYLES,
        mapTypeControl: false
    });
    // init infoWindow
    this.infoWindow = new google.maps.InfoWindow();
    // init bounds
    this.bounds = new google.maps.LatLngBounds();
    // init locacion data
    this.locationData = ko.observableArray([]);

    // init filter
    this.query = ko.observable(""); /// for trigger search

    // init icon for marker
    this.defaultIcon = createMarkerIcon('66d9ff');

    //init searchBox
    var input = document.getElementById('pac-input'); //search box
    this.searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    this.map.addListener('bounds_changed', function() {
        self.searchBox.setBounds(self.map.getBounds());
    });

    this.searchBox.addListener('places_changed', function() {
        var place = self.searchBox.getPlaces();

        if (place.length === 0) {
            return;
        }

        if (window.confirm("Add this place to list ? \n" + place[0].name)) {
            var data = {};
            data.title = place[0].name;
            data.position = {
                lat: place[0].geometry.location.lat(),
                lng: place[0].geometry.location.lng()
            };

            data.address = place[0].formatted_address;
            self.createLocation(data);
            //show infowindow when data add
            self.setInfoWindow(self.locationData()[self.locationData().length - 1]);

        }
        //fit bounds for new location
        self.map.fitBounds(self.bounds);

    });

    /**
     * @description
     * initial function for ViewModel. this function should be called after construction;
     */
    this.init = function() {
      //init  location data
      config.INITIAL_LOCATION_DATA.map( function (location) {
        self.createLocation(location);
      });

      self.map.fitBounds(self.bounds);
      self.query.subscribe(self.applyFileter);
    };


    /**
     * @description
     *create location and push it to locationData ovservable array.this function construct location data from Location class
     * @param  {object} this data should be same as Location class
     */
    this.createLocation = function(data) {

        var location = new Location(data);

        location.marker.setMap(self.map);
        location.marker.setIcon(self.defaultIcon);

        //add click event to marker
        location.marker.addListener('click', function() {
            self.setInfoWindow(location);
        });
        self.bounds.extend(location.latLng);
        this.setDiscription(location);
        this.locationData.push(location);

        $(".list-container").scrollTop($(".list-container")[0].scrollHeight);
    };

    /**
     * @description set discription to location object from wikipedia by using wikipedia rest api
     * @param {object}
     */
    this.setDiscription = function(location) {

        location.discription = "<p>tring to get data from wikipedia. reopen later</p>";
        var discTemplate ='<li class="test"><a href=%href% target="_blank">%text%</a></li>',
            errTemplate ='<p class="msg">Failed to load wikipediaa link due to %msg%. delete location and try later</p>';

        var wikirequestTimeout = setTimeout(function() {
            location.discription = "<p>failed to get wikipedia search</p>";
        }, 8000);

        var wikipediaUrl = 'https://jp.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + location.title;
        $.ajax({
          method: "GET",
          url: wikipediaUrl,
          dataType: "jsonp"
        })
        .done( function(data) {
          location.discription = "";
          if (data[1].length > 0) {
            var i = 0, len = data[1].length;
            for (; i < len; i++) {
              location.discription += discTemplate.replace('%href%',data[3][i])
                                         .replace('%text%',data[1][i]);
            }
          } else {
              location.discription = "No related articles found in wikipedia";
          }
          clearTimeout(wikirequestTimeout);
        })
        .error(function(data) {
            location.discription = errTemplate.replace('%msg%',data);
            clearTimeout(wikirequestTimeout);
        });
    };

    /**
     * @description delete location from locationData observableArray
     * @param  {object} this data should be same as Location class @oaram
     */
    this.deleteLocation = function(data) {
        // set Null to delete marker from google map
        data.marker.setMap(null);
        self.locationData.remove(data);
    };

    /**
     * @description set  all marker and list  to visible
     */
    this.clearFilter = function() {
        self.locationData().map( function (elm) {
          elm.marker.setMap(self.map);
          elm.visibility(true);
          self.bounds.extend(elm.latLng);
        });
        self.map.fitBounds(self.bounds);
    };


    /*
     * @description set visiblity true if inputText macth location title
     * @param {object} location object
     * @param {string} text
     */
    this.filter = function (inputText) {

      return function (location) {
        if (location.title.match(inputText)) {
            location.marker.setMap(self.map);
            location.visibility(true);
        } else {
            location.marker.setMap(null);
            location.visibility(false);
        }
      }
    };

    /**
     * @description hide location from map and list if inputText doesn't match
     */
    this.applyFileter = function() {
        var fn = self.filter($('#filter-textbox').val());
        self.locationData().map(function (elm) {fn(elm);});
    };

    /**
     * @description set InfoWIndow object and open it. this function is expected to attach click event of google.maps.marker
     * @param {object}
     */
    this.setInfoWindow = function(location) {

        if (self.infoWindow.marker !== location.marker) {
            // set infowindow marker
            self.infoWindow.marker = location.marker;

            self.infoWindow.setContent(location.discription);
            self.infoWindow.open(location.map, location.marker);
            self.infoWindow.addListener('closeclick', function() {
                self.infoWindow.marker = null;
            });
        }
        self.toggleBounce(location.marker);
    };

    this.changeSidebar = function() {
        var element = $(".sidebar-container");
        if (element.css('left') !== "0px") {
            element.css('left', "0");
        } else {
            element.css('left', "-250px");
        }
    };

    this.toggleBounce = function(marker) {
        var aniMationTimeout = setTimeout(function() {
            marker.setAnimation(null);
        }, 2000);
        marker.setAnimation(google.maps.Animation.BOUNCE);
    };

};

/**
 * @description  inititial  function called by google map api callback parameter.
 */
function init() {
    "use strict";

    // create viewmodel
    var viewmodel = new ViewModel();

    ko.applyBindings(viewmodel);
    viewmodel.init();

}
init();

function mapLoadError() {
    "use strict";
    $('.sidebar-container').css('display', 'none');
    $('.map-container').css('display', 'none');
    $('.main-container').append('<p class="err-msg">Failed to load google map api.</p>');
}
