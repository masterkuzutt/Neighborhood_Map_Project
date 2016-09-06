/* INITIAL VALUE */
//Initial data declaration
var INITIAL_LOCATION_DATA = [{
      title: '阿佐ヶ谷駅',
      position: {
          lat: 35.704872,
          lng: 139.63585899999998
      },
      imgUrl: 'https://lh4.googleusercontent.com/-qSlKaZvHebQ/V4zlTsr9c1I/AAAAAAACKZo/UJ8hDXIwcjwscIOqEWSNBMBP2_khJ_glACLIB/w1100-h100-k/',
      address: '日本, 〒166-0004 東京都杉並区阿佐谷南３丁目５８'
  }, {
      title: '高円寺駅',
      position: {
          lat: 35.7052366,
          lng: 139.64966200000003
      },
      imgUrl: 'https://lh5.googleusercontent.com/-10yIPR5YrF4/VzbKSgsx2BI/AAAAAAABoOs/jvwhx7GkRbwIa0DVfgsbUQQkV3KwwnAcgCLIB/w1100-h100-k/',
      address: '日本, 〒166-0003 東京都杉並区高円寺南４丁目４８'
  }, {
      title: '大森駅',
      position: {
          lat: 35.5884467,
          lng: 139.72786829999995
      },
      imgUrl: 'https://lh4.googleusercontent.com/-x52fiD5jgRg/V2382yj06cI/AAAAAAAJcEE/UFywvGiWj0w7tbql_CFn3tblRHx9aEH3wCLIB/w1100-h100-k/',
      address: '日本, 〒143-0016 東京都大田区大森北１丁目２９−１１'
  }, {
      title: '武蔵小金井駅',
      position: {
          lat: 35.7010622,
          lng: 139.50674030000005
      },
      imgUrl: 'https://lh3.googleusercontent.com/-dpD-iGgT2KY/V5N38aYK13I/AAAAAAAAAHg/FPSnN7UzXwsSbOR7e6ZzieWwjiyzuKzqwCLIB/w1100-h100-k/',
      address: '日本, 〒184-0004 東京都小金井市本町６丁目１４'
  }, {
      title: '東部練馬駅',
      position: {
          lat: 35.768671,
          lng: 139.66238199999998
      },
      imgUrl: 'https://lh6.googleusercontent.com/-OWfxEG2DfnU/V2tu-E5VukI/AAAAAAAAOqg/S_W1pXjtiG0fyiCVq29FlWHsr1idRgezQCLIB/w1100-h100-k/',
      address: '日本, 〒175-0083 東京都板橋区徳丸２丁目２'
  },
];

  //goole map style object declaration
var STYLES = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
            color: '#ffffff'
        }, {
            weight: 6
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#efe9e4'
        }, {
            lightness: -40
        }]
    }, {
        featureType: 'transit.station',
        stylers: [{
            weight: 9
        }, {
            hue: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
            visibility: 'on'
        }, {
            color: '#f0e4d3'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
            color: '#efe9e4'
        }, {
            lightness: -25
        }]
    }
];



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
    this.imgUrl = data.imgUrl || "";
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
        center: INITIAL_LOCATION_DATA[0].position,
        zoom: 8,
        styles: STYLES,
        mapTypeControl: false
    });
    // init infoWindow
    this.infoWindow = new google.maps.InfoWindow();
    // init bounds
    this.bounds = new google.maps.LatLngBounds();
    // init locacion data
    this.locationData = ko.observableArray([]);

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
            if (place[0].photos) {
                data.imgUrl = place[0].photos[0].getUrl({
                    'maxWidth': 1100,
                    'maxHeight': 100
                });
            } else {
                data.imgUrl = "no-image";
            }

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
      for (var i = 0, len = INITIAL_LOCATION_DATA.length; i < len; i++) {
        this.createLocation((INITIAL_LOCATION_DATA[i]));
      }
      self.map.fitBounds(self.bounds);
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
        var wikirequestTimeout = setTimeout(function() {
            location.discription = "<p>failed to get wikipedia search</p>";
        }, 8000);

        var wikipediaUrl = 'https://jp.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + location.title;
        $.ajax({
                method: "GET",
                url: wikipediaUrl,
                dataType: "jsonp"
            })
            .done(function(data) {
                location.discription = "";
                if (data[1].length > 0) {
                    for (var i = 0, len = data[1].length; i < len; i++) {
                        location.discription = location.discription + '<li class="test">' +
                            '<a href=' + data[3][i] + ' target="_blank">' + data[1][i] + '</a></li>';
                    }
                } else {
                    location.discription = "No related articles found in wikipedia";
                }
                clearTimeout(wikirequestTimeout);
            })
            .error(function(data) {
                location.discription = '<p class="msg">Failed to load wikipediaa link due to' +
                    data +
                    ' delete location and try later</p>';
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
        for (var i = 0, len = self.locationData().length; i < len; i++) {
            self.locationData()[i].marker.setMap(self.map);
            self.bounds.extend(self.locationData()[i].latLng);
            self.locationData()[i].visibility(true);
        }
        self.map.fitBounds(self.bounds);
    };

    /**
     * @description hide location from map and list if inputText doesn't match
     */
    this.applyFileter = function() {
        var inputText = $('#filter-textbox').val();
        for (var i = 0, len = self.locationData().length; i < len; i++) {
            if (self.locationData()[i].title.match(inputText)) {
                self.locationData()[i].marker.setMap(self.map);
                self.locationData()[i].visibility(true);
            } else {
                self.locationData()[i].marker.setMap(null);
                self.locationData()[i].visibility(false);
            }
        }
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

function mapLoadError() {
    "use strict";
    $('.sidebar-container').css('display', 'none');
    $('.map-container').css('display', 'none');
    $('.main-container').append('<p class="err-msg">Failed to load google map api.</p>');
}
