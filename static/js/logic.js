
var quakeUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var plateUrl ="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

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
var plates = new L.LayerGroup();


var overlayMaps = {
  
  "Earthquakes": quakes,
  "Tectonic Plates": plates
};
 
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

d3.json(quakeUrl, function(data) {

  


// used a gradient to determine the color of the depth automatically
function getColor(depth) {
	var r, g, b = 0;
	if(depth > 200) {
		r = 255;
		g = Math.round(5.1 * depth);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * depth);
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}

// creating the market size and color according the earthquake depth
    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
  
    
  
    // // define the radius of the earthquake marker based on its magnitude.
  
    function markerSize(magnitude) {
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
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br> Depth: "+ feature.geometry.coordinates[2]);
      }
  
    }).addTo(quakes);
  
    quakes.addTo(myMap);
  
  
    var legend = L.control({
      position: "bottomright"
    });
  
  // creating the legend "difficult to match the color with the gradient"
    legend.onAdd = function() {
      var div = L
        .DomUtil
        .create("div", "info legend");
  
      var grades = [-10, 10, 25, 50, 100, 150];
      var colors = [
        "#f7f711",
        "#d4ee00",
        "#88e87d",
        "#2ae815",
        "#8a2222",
        "#f50202"
        
      ];
  
  
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
  
    legend.addTo(myMap);


    d3.json(plateUrl,function(tectodata) {
 
      L.geoJson(tectodata, {
        color: "#f24c0a",
        weight: 3
      })
      .addTo(plates);

      // add the tectonicplates layer to the map.
      plates.addTo(myMap);
  
    
  });

});

 console.log('works')
