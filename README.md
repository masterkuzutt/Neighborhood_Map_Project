# Neighborhood Map Project
This project is for Frontend developer naanodegree by using google maps api ,wikipedia web and knockout.js , implement web app that show list of location and icon on the map.

## How To Use
### installation
* download or clone repository
* open app/index.html on your editer
* input apropreate api-key below line 
```
<script src="https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry,places&key=AIzaSyB7PN2MCfC9FyBlvHEpOx3jZXzDUOITBJM&v=3"></script>
```
* open app/index.html on your browser

### add location
* input word related to location you want to add  in textbox on google map.
* select location from google map api suggestion.
* click ok button on confirmation window.
* if you skip step 2 and press enter key on keyboard,first location on suggestion is selected.

### delete location
* click/tap delete button on the list of locations.

### Show wikipedia link
* click marker on the map will pop up window of wikipedia link.

### apply filter
* input search word on sarch box  and click filter icon or enter key.
### clear filter
* cleck/tap clear icon on the header

## Limitation and Future plan
* This webapp do not store data. if you close browser tab or  window, all the data you add will disappear.I will add that function.
* infoWindow on the map is created by jQuery append. I'll change to use knockout.js functionality or add-ons.
* now google map api is loaded sync. figure it out how to load async with webpack
