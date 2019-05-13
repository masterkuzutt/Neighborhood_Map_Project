# Neighborhood Map Project
This project is originally created for Frontend developer nanodegree by using google maps api ,wikipedia web and knockout.js , implement web app that show list of location and icon on the map.
# Updates
- For google map api policy changing, now this work with BingMaps API.
- built with webpack, gulp

## How To Use
### requirements 
- node installed
### installation
- download or clone repository
- install node packages
```
npm install
```
- create .env file
```
BINGMAPS_API_KEY=<your api key>
```
- run build 
```
npm run build
```

- open app/index.html on your browser

### add location
* input word related to location you want to add  in textbox on google map.
* select location from google map api suggestion.
* click ok button on confirmation window.
* if you skip step 2 and press enter key on keyboard,first location on suggestion is selected.

### Delete location
* click/tap delete button on the list of locations.

### Show wikipedia link
* click marker on the map will pop up window of wikipedia link.

### Apply filter
* input search word on sarch box  and click filter icon or enter key.

### Clear filter
* cleck/tap clear icon on the header

### Search
* click search input on navbar and click seach icon or press enter key. 

## Limitation 
* This webapp do not store data. if you close browser tab or  window, all the data you add will disappear.
* searched location can't be deleted and not dissapper unless reloading page.


## reference
- https://bootstrapious.com/p/bootstrap-sidebar
- https://stackoverflow.com/questions/40497288/how-to-create-a-fixed-sidebar-layout-with-bootstrap-4
- https://qiita.com/riversun/items/4faa56ac40071f638313
- https://stackoverflow.com/questions/27221332/bootstrap-collapse-animation-not-smooth
- https://forums.asp.net/t/1958546.aspx?Bing+Maps+Zoom+in+on+Array+of+lats+and+longs
- https://stackoverflow.com/questions/25062157/how-do-i-set-a-version-7-0-bing-map-center-to-a-location
- https://github.com/webpack-contrib/css-loader/issues/447