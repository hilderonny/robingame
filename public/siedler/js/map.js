class Map {

    constructor() {
        this.view = new ol.View({ center: [0, 0], zoom: 17 });
        this.map = new ol.Map({ controls: [], interactions: [], view: this.view,
            layers: [
                new ol.layer.Tile({ source: new ol.source.Stamen({ layer: 'watercolor' }) }),
            ],            
        });
        this.map.on("click", (event) => {
            // var features = this.map.getFeaturesAtPixel(event.pixel);
            // if (features) features.forEach(function (f) {
            //     var properties = f.getProperties();
            //     console.log(properties);
            // });
        });
        this.geolocation = new ol.Geolocation({
            projection: this.view.getProjection(),
            trackingOptions: { maximumAge: 10000, enableHighAccuracy: true, timeout: 600000 }
        });
        this.geolocation.on('change:position', () => {
            this.view.setCenter(this.geolocation.getPosition());
        });
        this.geolocation.setTracking(true);
        this.domElement = Helper.createDomElement('<div class="map"></div>');
    }

    show(id) {
        this.domElement.id = id;
        this.map.setTarget(id);
    }

}
