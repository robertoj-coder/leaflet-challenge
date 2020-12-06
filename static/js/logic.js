
var myMap = L.map("mapid", {
  center: [45.52, -122.67],
  zoom: 2
});

// console.log(myMap)
var quakeUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

console.log("works")

  // Define streetmap and darkmap layers
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });
// console.log(satelliteMap)
  var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var greyscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satelliteMap,
    "Outdoor": outdoorMap,
    "Greyscale": greyscaleMap
  };

  console.log('works')
  // Create overlay object to hold our overlay layer
  // var overlayMaps = {
  //   "Earthquakes": earthquakes
  // };

  var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [satelliteMap, outdoorMap, greyscaleMap]
  });

  satelliteMap.addTo(myMap);

var quakes = new L.LayerGroup();  
// var plates = new L.LayerGroup();


var overlayMaps = {
  
  "Earthquakes": quakes,
  // "Tectonic Plates": plates
};
 
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

d3.json(quakeUrl, function(data) {

 
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
  
    // Define the color of the marker based on the magnitude of the earthquake.
    function getColor(magnitude) {
      switch (true) {
        case magnitude > 5:
          return "#ea2c2c";
        case magnitude > 4:
          return "#ea822c";
        case magnitude > 3:
          return "#ee9c00";
        case magnitude > 2:
          return "#eecc00";
        case magnitude > 1:
          return "#d4ee00";
        default:
          return "#98ee00";
      }
    }
  
    // define the radius of the earthquake marker based on its magnitude.
  
    function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
  
      return magnitude * 3;
    }
  
    // add GeoJSON layer to the map
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
  
    }).addTo(quakes);
  
    quakes.addTo(myMap);
  
  
    var legend = L.control({
      position: "bottomright"
    });
  
  
    legend.onAdd = function() {
      var div = L
        .DomUtil
        .create("div", "info legend");
  
      var grades = [0, 1, 2, 3, 4, 5];
      var colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];
  
  
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
  
    legend.addTo(myMap);
  
    
  });
console.log('works')
