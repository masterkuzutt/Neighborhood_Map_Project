/* INITIAL VALUE */
//Initial data declaration
module.exports = {
  INITIAL_LOCATION_DATA : [{
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
  ],

    //goole map style object declaration
  STYLES : [{
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
  ]
};
