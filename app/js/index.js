import "bootstrap";

import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";

const GoogleMap = require('./googlemap');
const BingMaps = require('./bingmaps');


window.onload = function () {
    BingMaps.init();
    // GoogleMap.init();
}


function mapLoadError() {
    "use strict";
    $('.sidebar-container').css('display', 'none');
    $('.map-container').css('display', 'none');
    $('.main-container').append('<p class="err-msg">Failed to load google map api.</p>');
}
