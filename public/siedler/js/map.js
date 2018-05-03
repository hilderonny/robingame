var Map = {
    init: function () {
        // Avatar
        Map.avatar = new ol.Feature();
        Map.avatar.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                src: "images/ash.png"
            })
        }));
        Map.clickradius = new ol.Feature();
        var circleStyle = new ol.style.Circle({
            radius: Player.clickradius,
            fill: new ol.style.Fill({
                color: [66, 133, 244, 0.1]
            }),
            stroke: new ol.style.Stroke({
                color: [244, 244, 255, 0.9],
                width: 1
            })
        });
        Map.clickradius.setStyle(new ol.style.Style({
            image: circleStyle
        }));
        var clickradiuslayer =  new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [Map.clickradius]
            })
        });
        Player.onchange("clickradius", function(before, after) {
            circleStyle.setRadius(after);
            clickradiuslayer.getSource().changed();
        });
        // Map
        Map.view = new ol.View({
            center: [0, 0],
            zoom: 17
        });
        Map.map = new ol.Map({
            controls: [],
            interactions: [],
            layers: [
                // HintergrundMap
                new ol.layer.Tile({
                    source: new ol.source.Stamen({
                        layer: 'watercolor'
                    })
                }),
                // Klick-Radius
               clickradiuslayer,
                // Avatar
                new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [Map.avatar]
                    })
                })
            ],
            target: 'Map',
            view: Map.view,
        });
        Map.map.on("click", function (event) {
            var features = Map.map.getFeaturesAtPixel(event.pixel);
            if (features) features.forEach(function (f) {
                var properties = f.getProperties();
                console.log(properties);
            });
        });

        // GPS Position
        Map.geolocation = new ol.Geolocation({
            projection: Map.view.getProjection(),
            trackingOptions: {
                maximumAge: 10000,
                enableHighAccuracy: true,
                timeout: 600000
            }
        });
        Map.geolocation.on('change:position', function () {
            var coordinates = Map.geolocation.getPosition();
            Map.clickradius.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
            Map.avatar.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
            Map.view.setCenter(coordinates);
        });
        Map.geolocation.setTracking(true);
    }
};

window.addEventListener("load", function () {
    Map.init();

    // setInterval(function() {
    //     Player.clickradius += 10;
    // }, 1000);
    
});