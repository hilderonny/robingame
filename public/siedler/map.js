var Karte = {
    init: function () {
        // Avatar
        Karte.avatar = new ol.Feature();
        Karte.avatar.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                src: "images/ash.png"
            })
        }));
        Karte.clickradius = new ol.Feature();
        Karte.clickradius.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: Player.clickradius,
                fill: new ol.style.Fill({
                    color: [66, 133, 244, 0.1]
                }),
                stroke: new ol.style.Stroke({
                    color: [244, 244, 255, 0.9],
                    width: 1
                })
            })
        }));
        Player.onchange("clickradius", function(before, after) {
            console.log(before, after);
        });
        // Karte
        Karte.view = new ol.View({
            center: [0, 0],
            zoom: 17
        });
        Karte.map = new ol.Map({
            controls: [],
            interactions: [],
            layers: [
                // Hintergrundkarte
                new ol.layer.Tile({
                    source: new ol.source.Stamen({
                        layer: 'watercolor'
                    })
                }),
                // Klick-Radius
                new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [Karte.clickradius]
                    })
                }),
                // Avatar
                new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [Karte.avatar]
                    })
                })
            ],
            target: 'Karte',
            view: Karte.view,
        });
        Karte.map.on("click", function (event) {
            var features = Karte.map.getFeaturesAtPixel(event.pixel);
            if (features) features.forEach(function (f) {
                var properties = f.getProperties();
                console.log(properties);
            });
        });

        // GPS Position
        Karte.geolocation = new ol.Geolocation({
            projection: Karte.view.getProjection(),
            trackingOptions: {
                maximumAge: 10000,
                enableHighAccuracy: true,
                timeout: 600000
            }
        });
        Karte.geolocation.on('change:position', function () {
            var coordinates = Karte.geolocation.getPosition();
            Karte.clickradius.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
            Karte.avatar.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
            Karte.view.setCenter(coordinates);
        });
        Karte.geolocation.setTracking(true);
    }
};

window.addEventListener("load", function () {
    Karte.init();

    Player.clickradius = 30;
    
});