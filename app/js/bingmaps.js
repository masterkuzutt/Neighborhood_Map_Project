// [TODO] apply builder pattern
'use strict'

const $ = require("jquery");
const ko = require("./libs/knockout-3.2.0.js");
const config = require("./app.config.js")

/**
 * @description create pin bingmap and return it. 
 * @param  {sting}  colorcode 'FFF'
 * @param  {object} location 
 * @return {object} image marker object for google map marker
 */
function createMarkerIcon(markerColor, center) {
    let pin = new Microsoft.Maps.Pushpin(center, {
        color: markerColor,
        roundClickableArea: true,
        enableClickedStyle: true,
    });
    return pin
}

class Location {
    constructor(data) {
        this.title = data.title;
        this.lat = data.position.lat;
        this.lng = data.position.lng;
        this.address = ko.observable(data.address);
        this.message = "";
        this.description = "";
        this.visibility = ko.observable(true);
        this.latLng = new Microsoft.Maps.Location(this.lat, this.lng);
        this.marker = createMarkerIcon('black', this.latLng);
    }
};

/**
 * @description Represents MV for location data and hmtl
 * @constructor
 */
class ViewModel {
    constructor() {
        this.map = new Microsoft.Maps.Map($('#map')[0], {
            credentials: process.env.BINGMAPS_API_KEY,
            center: new Microsoft.Maps.Location(config.CENTER.lat, config.CENTER.lng),
            mapTypeId: Microsoft.Maps.MapTypeId.canvasLight,
            zoom: 10
        });


        // init infoWindow
        this.infoWindow = new Microsoft.Maps.Infobox(this.map.getCenter(), {
            title: 'Map Center',
            description: 'default',
            visible: false,
        });

        this.infoWindow.setMap(this.map);

        // init bounds
        this.bounds = Microsoft.Maps.LocationRect.fromLocations(this.map.getCenter());

        // init locacion data
        this.locationDataArray = ko.observableArray([]);

        // init filter
        this.query = ko.observable(""); /// for trigger search

        // init icon for marker
        // this.defaultIcon = createMarkerIcon('66d9ff', this.map.getCenter());

        //init searchBox
        this.searchBox = null;
        this.searchManager = null;
        this.searchStatus = ko.observable(false);

        // make accessible from knockout.js
        this.setInfoWindowKo = (location) => {
            this.setInfoWindow(location);
        }
        this.deleteLocationKo = (location) => {
            this.deleteLocation(location);
        }
        this.clearFilterKo = (location) => {
            this.clearFilter(location);
        }
        this.applyFilterKo = (location) => {
            this.applyFilter(location);
        }
        this.searchKo = () => {
            this.search();
        }

    }
    /**
     * @description
     * initial function for ViewModel. this function should be called after construction;
     */
    Init() {
        //init  location data
        config.INITIAL_LOCATION_DATA.map((locationData) => {
            this.createLocation(locationData);
        });

    };


    /**
     * @description
     *create location and push it to locationData ovservable array.this function construct location data from Location class
     * @param  {object} this data should be same as Location class
     */
    createLocation(locationData) {

        var location = new Location(locationData);
        this.map.entities.push(location.marker);
        this.setDescription(location);
        //add click event to marker
        Microsoft.Maps.Events.addHandler(location.marker, 'click', (e) => {
            this.setInfoWindow(location);
        });

        this.locationDataArray.push(location);
    };

    /**
     * @description delete location from locationData observableArray
     * @param  {object} this data should be same as Location class @oaram
     */
    deleteLocation(location) {

        this.map.entities.remove(location.marker);
        this.locationDataArray.remove(location);
        this.infoWindow.setOptions({visible:false});
    };


    /**
     * @description set description to location object from wikipedia by using wikipedia rest api
     * @param {object}
     */
    setDescription(location) {

        location.description = "<p>tring to get data from wikipedia. reopen later</p>";
        let discTemplate = '<li class="test"><a href=%href% target="_blank">%text%</a></li>',
            errTemplate = '<p class="msg">Failed to load wikipediaa link due to %msg%. delete location and try later</p>';

        let wikirequestTimeout = setTimeout(function () {
            location.description = "<p>failed to get wikipedia search</p>";
        }, 8000);

        const wikipediaUrl = 'https://jp.wikipedia.org/w/api.php?format=json&action=opensearch&search=' + location.title;
        $.ajax({
            method: "GET",
            url: wikipediaUrl,
            dataType: "jsonp"
        }).done((data) => {
            location.description = "";
            if (data[1].length > 0) {
                let i = 0, len = data[1].length;
                for (; i < len; i++) {
                    location.description += discTemplate.replace('%href%', data[3][i])
                        .replace('%text%', data[1][i]);
                }
            } else {
                location.description = "No related articles found in wikipedia";
            }
            clearTimeout(wikirequestTimeout);
        }).fail((data) => {
            location.description = errTemplate.replace('%msg%', data);
            clearTimeout(wikirequestTimeout);
        }).always(() => {
        });
    };


    /**
     * @description set all marker and list to visible
     */
    clearFilter() {
        this.locationDataArray().map(function (location) {
            location.marker.setOptions({ visibility: true });
            location.visibility(true);
        });
    };


    /** 
     * @description set visiblity to true if inputText macth location title
     * @param {object} location object
     * @param {string} text
     */
    filter(inputText) {

        return (location) => {
            if (location.title.match(inputText)) {
                location.marker.setOptions({ visible: true });
                location.visibility(true);
            } else {

                location.marker.setOptions({ visible: false });
                location.visibility(false);
            }
        }
    };

    /**
     * @description get text from #filter-textbox and filter location
     */
    applyFilter() {
        let searchText = $('#filter-textbox').val();
        if (searchText === "") {
            this.clearFilter();
        }

        this.locationDataArray().map(this.filter(searchText));
    };

    /**
     * @description set InfoWIndow object and open it.
     * @param {object}
     */
    setInfoWindow(location) {

        // set infowindow marker
        this.infoWindow.setOptions({
            location: location.latLng,
            title: location.title,
            description: location.description,
            visible: true,
        });

        this.setBounds(location);

    };

    /**
     * @description set LocationRect object and set it.
     */
    setBounds() {
        let locationArray = [];

        this.locationDataArray().map((x) => {
            locationArray.push(x.latLng);
        });

        let bounds = Microsoft.Maps.LocationRect.fromLocations(locationArray);
        this.map.setView({bounds:bounds})

    }

    changeSidebar() {
        let element = $(".sidebar-container");
        if (element.css('left') !== "0px") {
            element.css('left', "0");
        } else {
            element.css('left', "-250px");
        }
    };

    toggleBounce(marker) {
        //[TODO] implement
    };
    
    /**
     * @description get input from #pac-input and call geocodeQuery
     */
    search() {
        if (!this.searchManager) {
            //Create an instance of the search manager and perform the search.
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', () => {
                this.searchManager = new Microsoft.Maps.Search.SearchManager(this.map);
                search();
            });
        } else {
            //Get the users query and geocode it.
            let query = $('#pac-input').val();
            this.geocodeQuery(query);
        }
    }
    /**
    * @description  send search request to bingmaps and receive result.
    * @param string query string to search 
    */
    geocodeQuery(query) { 

        let searchRequest = {
            where: query,
            callback: (r) => {
                console.log(r);
                
                if (r && r.results && r.results.length > 0) {
                    let pin;
                    let pins = [];
                    let locs = []; 
                    
                    // for (let i = 0; i < r.results.length; i++) {
                    r.results.forEach(result => {
                        //Create a pushpin for each result. 
                        pin = new Microsoft.Maps.Pushpin(result.location);
                        pins.push(pin);
                        locs.push(result.location);
                    });

                    //Add the pins to the map
                    this.map.entities.push(pins);

                    //Determine a bounding box to best view the results.
                    let bounds;

                    if (r.results.length == 1) {
                        bounds = r.results[0].bestView;
                    } else {
                        //Use the locations from the results to calculate a bounding box.
                        bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
                    }

                    this.map.setView({ bounds: bounds });
                }
                this.searchStatus(false);
            },
            errorCallback: (e) => {
                //If there is an error, alert the user about it.
                console.log(e, "No results found.");
                this.searchStatus(false);
                this.setBounds();
            }
        };

        //Make the geocode request.
        this.searchStatus(true);
        this.searchManager.geocode(searchRequest);
    }



};


/**
 * @description  inititial  function called by google map api callback parameter.
 */
export function init() {
    "use strict";

    // create viewmodel
    let viewmodel = new ViewModel();

    ko.applyBindings(viewmodel);
    viewmodel.Init();
}

