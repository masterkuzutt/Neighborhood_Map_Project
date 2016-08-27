var Common = {
  getJSON : function (urlStr,callback,callback_err) {
    $.getJSON(urlStr,callback)
    .error(callback_err);
  },

  sendAjax : function (urlStr,callback) {
    var requestTimeout = setTimeout(function  () {
    },8000);

    $.ajax({
      method : "GET",
      url : urlStr,
      dataType : api.dataType
    })
    .done(function  (data){
      callback(data);
      clearTimeout(requestTimeout);
    });
  }
};


// Model
var Location = function (initialData) {
  this.title = ko.observable(initialData.title);
  this.lat = ko.observable(initialData.position.lat);
  this.lng = ko.observable(initialData.position.lng);
  this.position = function () {
    return {lat : this.lat(),lng :this.lng()};
  };
};

var ArticleModel = function (initialData) {

};

//

var initLocationData  = [
  { title :  'Initial Location' ,position :  {lat: 40.74135, lng: -73.99802} },
  { title :  'second  Location' ,position :  {lat: 40.74145, lng: -73.99812} },
  { title :  'third   Location' ,position :  {lat: 40.74155, lng: -73.99822} },
  { title :  'forth   Location' ,position :  {lat: 40.74165, lng: -73.99832} }
];
var LocationData  = [];
for (var i = 0 , len = initLocationData.length ; i < len ; i++ ){
  LocationData.push(ko.observable(new Location(initLocationData[i])));
}

//
var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

// ViewModel
function ViewModel () {
  var self = this;
  this.map  =  "";
  this.bounds = ""
  this.mapDiv =  $('#map')[0];
  this.infoWindow =  "";
  this.streetViewService = "";
  this.markers = [];
  this.elemStreetText = $('#street');
  this.elemCityText =  $('#city');

  this.initMap  =  function () {
    // init map

    this.map = new google.maps.Map(this.mapDiv, {
      center:LocationData[0]().position(),
      zoom : 8,
      styles : styles,
      mapTypeControl :false
    });


    // init infoWindow
    this.infoWindow = new google.maps.InfoWindow();
    // init bounds
    this.bounds = new google.maps.LatLngBounds();

    // init street view
    this.streetViewService = new google.maps.StreetViewService();
    // init markers for initial data;

    for ( var i = 0 , len = LocationData.length ; i < len ;i++){
      var marker = this.createMarker(LocationData[i],i)
      this.markers.push(marker);
    }

    $('.show-allbtn').click(this,this.showListings);
    $('.hide-allbtn').click(this,this.hideListings);

  };

  this.createMarker = function (location,id) {
    var marker = new google.maps.Marker({
          title : location().title(),
          position : location().position(),
          map : this.map ,
          animation : google.maps.Animation.DROP,
          id : id
    });

    // marker.setMap(this.map);
    marker.addListener('click',function () {
        self.populateInfoWindow(this,self.infoWindow);

    });

    return marker;
  };

  this.populateInfoWindow = function (marker,infowindow) {
    if ( infowindow.marker !== marker ){
      infowindow.marker = marker;

      // infowindow.setContent ( '<div>' + marker.title + '</div>');

      function getStreetView   (data,status) {
        if (status == google.maps.StreetViewStatus.OK){

          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>test ' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
          console.log(panorama);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }

      this.streetViewService.getPanoramaByLocation(marker.position, 50, getStreetView);

      infowindow.open(this.map,marker);
      // console.log(infowindow);
      infowindow.addListener('closeclick',function () {
          infowindow.marker = null ;
      });
    }
  };

  this.showListings = function () {
    for (var i = 0; i < self.markers.length; i++) {
      self.markers[i].setMap(self.map);
      // console.log(self.markers[i]);
      self.bounds.extend(self.markers[i].position);
    }
    self.map.fitBounds(self.bounds);
  };

  this.hideListings = function () {
    for (var i = 0; i < self.markers.length; i++) {
      self.markers[i].setMap(null);
    }
    // self.map.fitBounds(self.bounds);
  };


};


var viewmodel = new ViewModel();
// var viewmodel = new ViewModel();
