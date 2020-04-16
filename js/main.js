//
//Creating mapconsole var for div"map"
//
var map = L.map('map');
map.setView([49.887132, 33.544712], 4);

//
//adding base maps 
//
var defmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9'
}).addTo(map);

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'jpg'
});

var toner = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', { attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>' });

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// for using the base maps in the layer control, I defined a baseMaps variable
// the text on the left is the label shown in the layer control; the text right is the variable name
var baseMaps = {
        "Default BaseMap": defmap,
        "Stamen": Stamen_Watercolor,
        "Toner": toner,
        "ESRI": Esri_WorldImagery,
        "OpenTopoMap": OpenStreetMap_France
    }
    //
    //---- Part 2: Adding a scale bar
    //
var scale = L.control.scale({ maxWidth: 100, imperial: false, position: 'bottomleft' }).addTo(map);
//
// Canvas flow starts here
//
var mobility = L.canvasFlowmapLayer(data, { //data is the variable name I used for defining the cook.js data
    originAndDestinationFieldIds: {
        originUniqueIdField: 'ID1', //origin ID, use GEOID_B if you want to reverse the flow
        originGeometry: { //origin coordinates
            x: 'EndX',
            y: 'EndY'
        },
        destinationUniqueIdField: 'ID2', //destination ID
        destinationGeometry: { //destination coordinates
            x: 'CentX',
            y: 'CentY'
        }
    },
    pathDisplayMode: 'all',
    animationStarted: true,
    animationEasingFamily: 'Cubic',
    animationEasingType: 'In',
    animationDuration: 2000
}).addTo(map);

mobility.on('click', function(e) {

    if (e.sharedOriginFeatures.length) {
        mobility.selectFeaturesForPathDisplay(e.sharedOriginFeatures, 'SELECTION_NEW');

    }
    if (e.sharedDestinationFeatures.length) {
        mobility.selectFeaturesForPathDisplay(e.sharedDestinationFeatures, 'SELECTION_NEW');
    }
});
// immediately select an origin point for Bezier path display,
// instead of waiting for the first user click event to fire
mobility.selectFeaturesForPathDisplayById('NAME', 586, true, 'SELECTION_NEW');

var path = "css/images/";

//
//Adding countries file from geojson but with js extension method
//
var myStyle = {
    "color": "#ff7800",
    "weight": 2,
    "opacity": 0.80
}

//Testttttttttttttttttttttttttttttttttttttttt

var countriess = L.geoJson(country, {
    onEachFeature: function(feature, marker, layer) {
        marker.bindPopup("<center><img height=80 width=120 src=" + path + feature.properties.NAME + ".png><br>" + feature.properties.NAME + "<p></p></center>");
    }
});
countriess.addTo(map);

//testttttttttttttt



//the variable features lists layers that I want to control with the layer control
var features = {
    "Mobility": mobility,
    "Countries": countriess
}

//the legend uses the layer control with entries for the base maps and two of the layers we added
//in case either base maps or features are not used in the layer control, the respective element in the properties is null
var legend = L.control.layers(baseMaps, features, { position: 'bottomleft', collapsed: true }).addTo(map);