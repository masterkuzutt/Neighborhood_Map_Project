/**
 * @description Represents  location data position and related data for google.maps.api
 * @constructor
 * @param  {object}  title :  'Initial Location' ,position :  {lat: 40.74135, lng: -73.99802}
 */
var Location = function (data) {
  "use strict";
  var self = this;
  this.title = data.title;
  this.lat = data.position.lat;
  this.lng = data.position.lng;
  this.position = data.position;
  this.latLng = new google.maps.LatLng(data.position.lat,data.position.lng);

  this.marker = new google.maps.Marker({
            title : this.title,
            position : this.position,
            map : null ,
            animation : google.maps.Animation.DROP
  });

  this.streetViewLoc = null ;

  /**
  * @description update streetView location based on location parameter
  */
  this.updateStreetViewLoc = function () {
    var streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanoramaByLocation(this.position, 50 ,function (data, status) {
      if (status == google.maps.StreetViewStatus.OK){
        self.streetViewLoc =  data.location.latLng;
      } else {
        self.streetViewLoc = null;
      }
    });
  };

  /**
  * @description update map property by parameter
  * @param {object} google.maps.Map
  */
  this.setMap = function (map){
    this.marker.setMap(map);
  };

};

var INITIAL_LOCATION_DATA  = [
  { title :  'Initial Location' ,position :  {lat: 40.74135, lng: -73.99802} },
  { title :  'second  Location' ,position :  {lat: 40.74145, lng: -73.99812} },
  { title :  'third   Location' ,position :  {lat: 40.74155, lng: -73.99822} },
  { title :  'forth   Location' ,position :  {lat: 40.74165, lng: -73.99832} }
];

//
var STYLES = [
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


/**
 * @description Represents MV for location data and hmtl
 * @constructor
 */
var ViewModel = function  () {
 "use strict";
  var self = this;
  // init map
  this.map  =  new google.maps.Map($('#map')[0], {
    center : INITIAL_LOCATION_DATA[0].position ,
    zoom : 8,
    styles : STYLES ,
    mapTypeControl :false
  });
  // init infoWindow
  this.infoWindow = new google.maps.InfoWindow();
  // init bounds
  this.bounds = new google.maps.LatLngBounds();
  // init locacion data
  this.locationData = ko.observableArray([]);

  /**
  * @description [TODO] wirte comment
  */
  this.init  =  function () {

    //init  location data
    for ( var i = 0, len = INITIAL_LOCATION_DATA.length; i < len ; i++){
     var location = new Location(INITIAL_LOCATION_DATA[i]);
     location.marker.addListener('click',function () {
        // self.setStreetVeiwToInfoWindow(Map.map,Map.infoWindow,marker,'pano');
        console.log("clicked! : " , location);
     });

     this.locationData.push(location);
    }

    $('.show-allbtn').click(this,this.setAllMarkerMap);
    $('.hide-allbtn').click(this,this.setAllMarkerNull);
    this.setAllMarkerMap();
  };

  /**
  * @description [TODO] wirte comment
  */
  this.setAllMarkerMap = function () {
    for ( var i = 0 , len = self.locationData().length ; i < len ; i++) {
      self.locationData()[i].setMap(self.map);
      self.bounds.extend(self.locationData()[i].latLng);
    }
    self.map.fitBounds(self.bounds);
  };

  /**
  * @description [TODO] wirte comment
  */
  this.setAllMarkerNull = function (){
    for ( var i = 0 , len = self.locationData().length ; i < len ; i++) {
      self.locationData()[i].setMap(null);
    }
  };

  /**
  * @description [TODO] もうめんどくさいのでストリートビューなしで行こうかな
  */
  this.setStreetVeiwToInfoWindow = function (map,infowindow,marker,attachId) {
    if ( infowindow.marker !== marker ){
      // set infowindow marker
      infowindow.marker = marker;
      //init streetview service
      var streetViewService = new google.maps.StreetViewService();
      streetViewService.getPanoramaByLocation(marker.position, 50,function (data,status) {
        if (status == google.maps.StreetViewStatus.OK){
          var location = data.location.latLng,
              panoramaOptions = {
                position: location,
                pov: {
                  heading: google.maps.geometry.spherical.computeHeading(location, marker.position),
                  pitch: 30
                }
              },
              panorama = "";
          infowindow.setContent('<div>test ' + marker.title + '</div><div id="' + attachId + '"></div>');
          // attatch streetVIew to element
          var panorama = new google.maps.StreetViewPanorama( document.getElementById(attachId), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      });

      infowindow.open(map,marker);
      infowindow.addListener('closeclick',function () {
          infowindow.marker = null ;
      });
    }
  };
};

// init function called by google map api callback
function init() {
  "use strict";
  var viewmodel = new ViewModel();
  ko.applyBindings(viewmodel);
  viewmodel.init();
};
