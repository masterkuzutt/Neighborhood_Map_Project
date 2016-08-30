

// Model
var Location = function (initialData) {
  this.title = ko.observable(initialData.title);
  this.lat = ko.observable(initialData.position.lat);
  this.lng = ko.observable(initialData.position.lng);
  this.position = function () {
    return {lat : this.lat(),lng :this.lng()};
  };
  this.marker = new google.maps.Marker({
            title : this.title(),
            position : this.position(),
            map : null ,
            animation : google.maps.Animation.DROP,
      });
};

//centerLocation {lat: 40.74135, lng: -73.99802}
var googleMap = function  (mapElement,centerLocation,mapStyle) {

  var mapApi =  google.maps,
      self = this;
  // init map
  this.map  =  new mapApi.Map(mapElement, {
    center: centerLocation,
    zoom : 8,
    styles : mapStyle,
    mapTypeControl :false
  });

  // init infoWindow
  this.infoWindow = new mapApi.InfoWindow();
  // init bounds
  this.bounds = new mapApi.LatLngBounds();

  // init markers array
  this.markers = [];

  // init locacion data
  this.locationData = ko.observableArray([]);

  /*
   *
   *
   */
  this.addLocationData = function  (location) {
    this.locationData.push(ko.observable(new Location(location)));
  };

  /*
   *
   *
   */
  this.createMarkers = function () {
    for ( var i = 0 ,len = this.locationData().length; i < len ; i++){

      var marker = new mapApi.Marker({
            title : this.locationData()[i]().title(),
            position : this.locationData()[i]().position(),
            map : this.map ,
            animation : mapApi.Animation.DROP,
            id : i
      });
      this.markers.push(marker);
    }
  };

  /*
   *
   *
   */
  this.setAllMarkerMap = function () {
    for ( var i = 0 , len = self.markers.length ; i < len ; i++) {
      self.markers[i].setMap(self.map);
      self.bounds.extend(self.markers[i].position);
    }
    self.map.fitBounds(self.bounds);
  };

  /*
   *
   *
   */
  this.setAllMarkerNull = function (){
    for ( var i = 0 , len = self.markers.length ; i < len ; i++) {
      self.markers[i].setMap(null);
    }
  };

};


var initLocationData  = [
  { title :  'Initial Location' ,position :  {lat: 40.74135, lng: -73.99802} },
  { title :  'second  Location' ,position :  {lat: 40.74145, lng: -73.99812} },
  { title :  'third   Location' ,position :  {lat: 40.74155, lng: -73.99822} },
  { title :  'forth   Location' ,position :  {lat: 40.74165, lng: -73.99832} }
];



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
  /*
   *  initMap()
   *  It is called from google api callback parameter
   */
  this.initMap  =  function () {
    var mapApi =  google.maps // google.maps;

    // init googleMap model
    var Map = new googleMap($('#map')[0],initLocationData[0].position,styles);
    ko.applyBindings(Map);
    // add location data to map
    for ( var i = 0, len = initLocationData.length; i < len ; i++){
      // console.log(initLocationData[i]);
      Map.addLocationData(initLocationData[i]);
    }

    Map.createMarkers();

    for (var i = 0 ,len = Map.markers.length ; i <  len ; i++){
      var marker = Map.markers[i];
      marker.addListener('click',function () {
        self.setStreetVeiwToInfoWindow(Map.map,Map.infoWindow,marker,'pano');
      });
    }

    $('.show-allbtn').click(Map,Map.setAllMarkerMap);
    $('.hide-allbtn').click(Map,Map.setAllMarkerNull);

  };

  /*
   *
  */
  this.setStreetVeiwToInfoWindow = function (map,infowindow,marker,attachId) {
    var mapApi =  google.maps // google.maps;

    if ( infowindow.marker !== marker ){
      infowindow.marker = marker;

      var streetViewService = new google.maps.StreetViewService();

      streetViewService.getPanoramaByLocation(marker.position, 50,function (data,status) {
        if (status == mapApi.StreetViewStatus.OK){

          var location = data.location.latLng,
              panoramaOptions = {
                position: location,
                pov: {
                  heading: mapApi.geometry.spherical.computeHeading(location, marker.position),
                  pitch: 30
                }
              },
              panorama = "";

          infowindow.setContent('<div>test ' + marker.title + '</div><div id="' + attachId + '"></div>');

          var panorama = new mapApi.StreetViewPanorama( document.getElementById(attachId), panoramaOptions);
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

var viewmodel = new ViewModel();
// ko.applyBindings(viewmodel);
