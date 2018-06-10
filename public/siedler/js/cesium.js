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
                url : 'https://a.tile.openstreetmap.org/'
                // url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/',
                // maximumLevel: 16,
            }),
            // terrainProvider: Cesium.createWorldTerrain(),
        });
        this.viewer.scene.fog.density = 0.02;
        this.viewer.camera.flyHome = this.goToPlayerPosition;
        this.goToPlayerPosition();
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
                    300
                    // height + 500
                )
            });
        // });
    }

    goToPlayerPosition() {
        var self = this;
        navigator.geolocation.getCurrentPosition(function(geolocation) {
            self.flyToGeoLocation(geolocation);
        });
    }

}

var app;

window.addEventListener("load", function() {
    app = new App("cesiumContainer");
});