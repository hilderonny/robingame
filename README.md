Grundsätzlich sehe ich zwei Ansätze für die Implementiern:

1. Eine Spiele-Engine wie BabylonJS oder A-Frame wird verwendet und die Geodaten irgendwie dort rein projizziert
2. Eine Geo-Maps-Bibliothek wird verwendet und irgendwie dazu gebracht, aus der FPS-Perspektive zu funktionieren.

Beide Ansätze müssen grundlegend diese Anforderungen erfüllen:

1. Anzeige von 3D-Welten
2. Stereo-Rendering
3. Geo-Lokation
4. VR-Orientierung
5. Interaktion mit Objekten
6. Anzeige von Landschaften / Kartendaten
7. Platzierung von zusätzlichen Objekten

An sich ist BabylonJS ganz brauchbar, wenn man die Kartendaten als Vektordaten aus der Overpass API zieht.

Für den zweiten Ansatz bietet sich eventuell CesiumJS an, welches in den Beispielen viele der Anforderungen anreißt. CaesiumJS fokussiert sich bei den Karten hauptsächlich auf die 3D-Anzeige:

|Thema|Beispiel|
|:----|:----|
|Stereoskopie|https://cesiumjs.org/demos/DronesOculus/|
|BIM Daten|https://cesiumjs.org/demos/mago3D/|
|FPS-Shooter|https://cesiumjs.org/demos/geostrike/|
|Auch schön|https://cesiumjs.org/demos/EndPoint/|
|Gebäudeverwaltung|https://cesiumjs.org/demos/Create/|
|Forstplanung|https://cesiumjs.org/demos/3DHarvestingPlanner/|
|GIS|https://cesiumjs.org/demos/OpenWebGIS/|

Es gibt sogar ein Beispiel für den VR-Modus: https://cesiumjs.org/Cesium/Build/Apps/Sandcastle/index.html?src=Cardboard.html

```js
var viewer = new Cesium.Viewer('cesiumContainer', {
    vrButton: true,
    terrainProvider: Cesium.createWorldTerrain()
});
```