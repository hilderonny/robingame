class App {

    constructor(divId) {

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNjcxOWU5NS03ZWQ4LTRjZjMtYmUyNi04MjE0ZjFiN2I0NjciLCJpZCI6MTQ3OCwiaWF0IjoxNTI4NjM0MzE5fQ.dgH-7CobMOwkmxJczcbVAqhLNNbu6WWl1r8bqv6ktao';

        this.viewer = new Cesium.Viewer(divId, {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            vrButton: false,
            geocoder: false,
            homeButton: true,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            scene3DOnly: true,
            imageryProvider: Cesium.createOpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
                // url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/',
                // maximumLevel: 16,
            }),
            // terrainProvider: Cesium.createWorldTerrain(),
        });
        this.viewer.scene.fog.density = 0.02;
        var self = this;
        this.viewer.camera.flyHome = function() {
            self.goToPlayerPosition();
        };
        
        this.playerRadius = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 0),
            ellipse: {
                semiMinorAxis: 50.0,
                semiMajorAxis: 50.0,
                height: 0.1,
                material: Cesium.Color.BLUE.withAlpha(0.3)
            }
        });

        this.playerSpot = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(0, 0),
            ellipse: {
                semiMinorAxis: 2.0,
                semiMajorAxis: 2.0,
                height: 0.2,
                material: new Cesium.ImageMaterialProperty({
                    image: "geolocation_marker.png",
                    transparent: true,
                })
            }
        });

    }

    flyToGeoLocation(geolocation) {
        var self = this;
        var pointOfInterest = Cesium.Cartographic.fromDegrees(
            geolocation.coords.longitude,
            geolocation.coords.latitude,
            1000.0,
            new Cesium.Cartographic());
        // Cesium.sampleTerrain(self.viewer.terrainProvider, 9, [pointOfInterest]).then(function (samples) {
        //     var height = samples && samples[0] && samples[0].height ? samples[0].height : 0.0;
        self.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                geolocation.coords.longitude,
                geolocation.coords.latitude,
                200
                // height + 500
            )
        });
        // });
    }

    goToPlayerPosition() {
        console.log(this.playerLocation);
        if (this.playerLocation) this.flyToGeoLocation(this.playerLocation);
    }

    updatePlayerPosition(geolocation) {
        this.playerLocation = geolocation;
        var position = Cesium.Cartesian3.fromDegrees(
            geolocation.coords.longitude,
            geolocation.coords.latitude,
            0.1
        );
        this.playerRadius.position = Cesium.Cartesian3.fromDegrees(geolocation.coords.longitude, geolocation.coords.latitude, 0.1);
        this.playerSpot.position = Cesium.Cartesian3.fromDegrees(geolocation.coords.longitude, geolocation.coords.latitude, 0.2);
    }

}

var app;

window.addEventListener("load", function () {
    app = new App("cesiumContainer");

    navigator.geolocation.watchPosition(function(geolocation) {
        app.updatePlayerPosition(geolocation);
    }/*, function() {}, { enableHighAccuracy: true }*/);

    navigator.geolocation.getCurrentPosition(function(geolocation) {
        app.updatePlayerPosition(geolocation);
        app.goToPlayerPosition();
    }/*, function() {}, { enableHighAccuracy: true }*/);
});