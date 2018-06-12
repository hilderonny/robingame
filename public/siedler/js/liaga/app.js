class App {

    constructor(divId) {

        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNjcxOWU5NS03ZWQ4LTRjZjMtYmUyNi04MjE0ZjFiN2I0NjciLCJpZCI6MTQ3OCwiaWF0IjoxNTI4NjM0MzE5fQ.dgH-7CobMOwkmxJczcbVAqhLNNbu6WWl1r8bqv6ktao';

        this.viewer = new Cesium.Viewer(divId, {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            vrButton: false,
            geocoder: false,
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
            })
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

        var self = this;
        navigator.geolocation.watchPosition(function (geolocation) {
            self.updatePlayerPosition(geolocation);
        }/*, function() {}, { enableHighAccuracy: true }*/);

    }

    flyToGeoLocation(geolocation) {
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(geolocation.coords.longitude, geolocation.coords.latitude, 200)
        });
    }

    goToPlayerPosition() {
        if (this.playerLocation) this.flyToGeoLocation(this.playerLocation);
    }

    updatePlayerPosition(geolocation) {
        this.playerLocation = geolocation;
        this.playerRadius.position = Cesium.Cartesian3.fromDegrees(geolocation.coords.longitude, geolocation.coords.latitude, 0.1);
        this.playerSpot.position = Cesium.Cartesian3.fromDegrees(geolocation.coords.longitude, geolocation.coords.latitude, 0.2);
    }

}
