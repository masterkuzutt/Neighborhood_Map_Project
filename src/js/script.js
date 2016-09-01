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
  this.imgUrl = data.imgUrl || "";
  this.discription = "";
  this.visibility = ko.observable(true);
  this.latLng = new google.maps.LatLng(data.position.lat,data.position.lng);
  this.marker = new google.maps.Marker({
            title : this.title,
            position : this.position,
            map : null ,
            animation : google.maps.Animation.DROP
  });
  this.streetViewLoc = null ;

};


var INITIAL_LOCATION_DATA  = [
  {title :'阿佐ヶ谷駅',  position : {lat : 35.704872, lng: 139.63585899999998} ,imgUrl  : 'https://lh4.googleusercontent.com/-qSlKaZvHebQ/V4zlTsr9c1I/AAAAAAACKZo/UJ8hDXIwcjwscIOqEWSNBMBP2_khJ_glACLIB/w1100-h100-k/'},
  {title :'高円寺駅',    position : {lat : 35.7052366, lng: 139.64966200000003} ,imgUrl: 'https://lh5.googleusercontent.com/-10yIPR5YrF4/VzbKSgsx2BI/AAAAAAABoOs/jvwhx7GkRbwIa0DVfgsbUQQkV3KwwnAcgCLIB/w1100-h100-k/' },
  {title :'大森駅',      position : {lat : 35.5884467, lng: 139.72786829999995},imgUrl: 'https://lh4.googleusercontent.com/-x52fiD5jgRg/V2382yj06cI/AAAAAAAJcEE/UFywvGiWj0w7tbql_CFn3tblRHx9aEH3wCLIB/w1100-h100-k/'  },
  {title :'武蔵小金井駅', position : {lat : 35.7010622, lng: 139.50674030000005},imgUrl: 'https://lh3.googleusercontent.com/-dpD-iGgT2KY/V5N38aYK13I/AAAAAAAAAHg/FPSnN7UzXwsSbOR7e6ZzieWwjiyzuKzqwCLIB/w1100-h100-k/' },
  {title :'東部練馬駅',   position : {lat : 35.768671, lng: 139.66238199999998}, imgUrl: 'https://lh6.googleusercontent.com/-OWfxEG2DfnU/V2tu-E5VukI/AAAAAAAAOqg/S_W1pXjtiG0fyiCVq29FlWHsr1idRgezQCLIB/w1100-h100-k/' }
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

  //init searchBox
  this.input = document.getElementById('pac-input') ;
  this.searchBox = new google.maps.places.SearchBox(this.input);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.input);
  this.map.addListener('bounds_changed',function () {
    self.searchBox.setBounds(self.map.getBounds());
  });

  this.searchBox.addListener('places_changed',function () {
    var place = self.searchBox.getPlaces();

    if (place.length == 0){
      return;
    }
    // self.map.fitBounds( new google.maps.LatLngBounds(location.position));
    if ( window.confirm("Add this place to list ? \n" + place[0].name )){

       //[Todo] Error handle
       self.createLocation({
        // title :  place[0].formatted_address
        title :  place[0].name,
        position:{
            lat : place[0].geometry.location.lat(),
            lng : place[0].geometry.location.lng()
        },
        imgUrl :  place[0].photos[0].getUrl({'maxWidth':1100,'maxHeight':100})
      });
    }
    self.map.fitBounds(self.bounds);

  });

  /**
  * @description [TODO] wirte comment
  */
  this.init  =  function () {

    //init  location data
    for ( var i = 0, len = INITIAL_LOCATION_DATA.length; i < len ; i++){
      this.createLocation((INITIAL_LOCATION_DATA[i]));
    }
    self.map.fitBounds(self.bounds);

    $('.apply-filter').click(this,this.applyFileter);
    $('.clear-fileter').click(this,this.clearFilter);

  };

  /**
  * @description [TODO] wirte comment
  */
  this.createLocation = function (data) {
     var key = data.position.lat.toString() + data.position.lng.toString(),
         location = {};
     location[key]  = new Location(data);

    //  console.log(data.position.lat.toString() + data.position.lng.toString());
     location[key].marker.setMap(self.map);
     location[key].marker.addListener('click',function () {
        // self.setStreetVeiwToInfoWindow(Map.map,Map.infoWindow,marker,'pano');
        // [Todo] add logic for info window
        // console.log("clicked! : " , location);
     });

     self.bounds.extend(location[key].latLng);

     this.locationData.push(location);
     $(".list-container").scrollTop($(".list-container")[0].scrollHeight);

    //  return location;
  };

  /**
  * @description [TODO] wirte comment
  */
  this.clearFilter = function () {
    for ( var i = 0 , len = self.locationData().length ; i < len ; i++) {
      self.locationData()[i].marker.setMap(self.map);
      self.bounds.extend(self.locationData()[i].latLng);
      self.locationData()[i].visibility(true);
    }
    self.map.fitBounds(self.bounds);
  };

  /**
  * @description [TODO] wirte comment
  */
  this.applyFileter = function (){
    var inputText = $('#filter-textbox').val();
    for ( var i = 0 , len = self.locationData().length ; i < len ; i++) {
      if (self.locationData()[i].title.match(inputText) ){
        self.locationData()[i].marker.setMap(self.map);
        self.locationData()[i].visibility(true);
      }else{
        self.locationData()[i].marker.setMap(null);
        self.locationData()[i].visibility(false) ;
      }
    }
  };

  /**
  * @description [TODO] wirte comment
  */
  this.deleteLocation = function (id) {

  }
  /**
  * @description update streetView location based on location parameter
  */
  this.setStreetViewLoc = function (position) {
    var streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanoramaByLocation(position, 50 ,function (data, status) {
      if (status == google.maps.StreetViewStatus.OK){
        return data.location.latLng;
      } else {
        return  null;
      }
    });
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
