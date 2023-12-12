const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

let myMap = L.map("map", {
    center: [37.09, -105.71],
    zoom: 3.5
  });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> |  &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(myMap);

function  fillColor(depth) {
    let color = ""
    if (depth < 10) {
        color = "#69B34C";
    }
    else if (depth < 30) {
        color = "#ACB334";
    }
    else if (depth < 50) {
        color = "#FAB733";
    }
    else if (depth < 70) {
        color = "#FF8E15";
    }
    else if (depth < 90) {
        color = "#FF4E11";
    }
    else {
        color = "#FF0D0D";
    }
    return color;
}

d3.json(url).then(function(data){
    let features = data.features;
    for (let i=0; i < features.length; i++) {
        let earthquake = features[i];
        let coordinates = earthquake.geometry.coordinates;
        lon = coordinates[1];
        lat = coordinates[0];
        L.circle([lon,lat], {
            color: "black",
            weight: .5,
            fillColor: fillColor(coordinates[2]),
            fillOpacity: 0.75,
            radius: earthquake.properties.mag*25000
          }).bindPopup(`<h3>${earthquake.properties.place}</h3>`).addTo(myMap);
    } 
    // Followed example from leaflet website: https://leafletjs.com/examples/choropleth/
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10,10,30,50,70,90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + fillColor(grades[i]) + '">&nbsp&nbsp&nbsp;</i>  <span>  <' + grades[i] + '</span><br>';
            //'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            //grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

    return div;
};

  // Adding the legend to the map
  legend.addTo(myMap);
});