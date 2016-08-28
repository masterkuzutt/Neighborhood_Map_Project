// Model
var Location = function (initialData) {
  this.title = ko.observable(initialData.title);
  this.lat = ko.observable(initialData.position.lat);
  this.lng = ko.observable(initialData.position.lng);
  this.position = function () {
    return {lat : this.lat(),lng :this.lng()};
  };
};


var googleMap = function  (mapElement,centerLocation,mapStyle,locationData) {
  var mapApi =  google.maps; // google.maps;

  this.map  =  new mapApi.Map(mapElement, {
    // center: centerLocation, //{lat: 40.74135, lng: -73.99802}
    center: {lat: 40.74135, lng: -73.99802},
    zoom : 8,
    styles : mapStyle,
    mapTypeControl :false
  });

  // init infoWindow
  this.infoWindow = new mapApi.InfoWindow();
  // init bounds
  this.bounds = new mapApi.LatLngBounds();
  // init street view
  this.streetViewService = new mapApi.StreetViewService();

      drawingManager = "",
      polygon = ""

  this.locationData = locationData || [];

  this.markers = [];
  this.drawingManager = new mapApi.drawing.DrawingManager({
    drawingMode: mapApi.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: mapApi.ControlPosition.TOP_CENTER,
      drawingModes: [
          mapApi.drawing.OverlayType.POLYGON,
          // google.maps.drawing.OverlayType.MARKER,
          // google.maps.drawing.OverlayType.CIRCLE,
          // google.maps.drawing.OverlayType.POLYLINE,
          // google.maps.drawing.OverlayType.RECTANGLE
        ]
    },
    // markerOptions: {icon: 'images/beachflag.png'},
    circleOptions: {
      fillColor: '#ffff00',
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1
    },
    map : this.map
  });

  this.addLocationData = function  (title,lat,lng) {
    this.locationData.push({title:title, position : { lat:lat, lng : lng }});
  };

  this.createMarkers = function () {
    for ( var i = 0 ,len = this.locationData.length; i < len ; i++){
      var marker = new mapApi.Marker({
            title : this.locationData[i].title,
            position : this.locationData[i].position,
            map : this.map ,
            animation : mapApi.Animation.DROP,
            id : i
      });
      this.markers.push(marker);
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
    // init googleMap model
    var Map = new googleMap($('#map')[0],styles,{lat: 40.74135, lng: -73.99802},initLocationData);

    Map.createMarkers();

    // marker.addListener('click',function () {
    //     self.populateInfoWindow(this,self.infoWindow);
    //
    // });
    //
    // $('.show-allbtn').click(this,this.showListings);
    // $('.hide-allbtn').click(this,this.hideListings);


  }


  this.populateInfoWindow = function (marker,infowindow) {
    if ( infowindow.marker !== marker ){
      infowindow.marker = marker;

      function getStreetView   (data,status) {
        if (status == googleMap.StreetViewStatus.OK){

          var nearStreetViewLocation = data.location.latLng;
          var heading = googleMap.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>test ' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
          var panorama = new googleMap.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);

        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      }

      this.streetViewService.getPanoramaByLocation(marker.position, 50, getStreetView);

      infowindow.open(map,marker);
      // console.log(infowindow);
      infowindow.addListener('closeclick',function () {
          infowindow.marker = null ;
      });
    }
  };

  /*
   *
   *
  */

  this.showListings = function () {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      // console.log(self.markers[i]);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  };

  /*
   *
   *
  */

  this.hideListings = function () {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    // self.map.fitBounds(self.bounds);
  };

  /*
   *
   *
   */
  this.searchWithInPolygon = function  () {
    for ( var i = 0, len = markers.length ; i < len ; i++){
      if(googleMap.geometry.poly.containsLocation(markers[i].position,polygon)){
        markers[i].setMap(map);
      }else {
        markers[i].setMap(null);
      }
    }
  };

  /*
  */
  // this.drawingManager.addListener('overlaycomplete',function  (e) {
  //   if(polygon){
  //     polygon.setMap(null);
  //     self.hideListings();
  //   }
  //   self.drawingManager.setDrawingMode ( null ) ;
  //
  //   polygon =  e.overlay;
  //   polygon.setEditable(true);
  //   self.searchWithInPolygon();
  //
  //
  //   polygon.getPath().addListener('set_at',self.searchWithInPolygon);
  //   polygon.getPath().addListener('insert_at',self.searchWithInPolygon);
  // });
};

var viewmodel = new ViewModel();
// var viewmodel = new ViewModel();
