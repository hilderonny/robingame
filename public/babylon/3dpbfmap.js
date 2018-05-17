var loadpbf = function(callback) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function () {

        if (this.readyState !== 4 || this.status !== 200) return;

        var buffer = new Uint8Array(xhr.response);

        // See https://github.com/mapbox/pbf
        var pbf = new Pbf(buffer);

        // pbf.readFields(readTile, {});

        var vectortile = new VectorTile(pbf);

        callback(vectortile);

    }
    xhr.open("GET", "https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/16/34781/21943.vector.pbf?access_token=pk.eyJ1IjoiaGlsZGVyb25ueSIsImEiOiJjamg0cDVsczUweDFxMzNsbnl5M2Jtdjd0In0.quEIdB6c02FYsvPhR8hfdw", true);
    xhr.send();

}

var createScene = function (canvas, engine) {

	var scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, 3 * Math.PI / 8, 30, BABYLON.Vector3.Zero(), scene);

	camera.attachControl(canvas, true);

	var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);

	//Array of points to construct lines
	var myPoints = [
		new BABYLON.Vector3(0, 0, 10),
		new BABYLON.Vector3(10, 0, 10),
		new BABYLON.Vector3(10, 0, 0),
		new BABYLON.Vector3(10, 10, 0),
		new BABYLON.Vector3(0, 10, 0)
	];
	
	//Create lines with updatable parameter set to true for later changes
	var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints, updatable: true}, scene); 
	
	//Array of points to update lines
	//Will only update first four points, fifth point remains unchanged.
	var myPoints2 = [
		new BABYLON.Vector3(2, 0, 0),
		new BABYLON.Vector3(2, 0, 2),
		new BABYLON.Vector3(0, 0, 2),
		new BABYLON.Vector3(0, 2, 2)
	];
	
	//Update lines
	lines = BABYLON.MeshBuilder.CreateLines("lines", {points: myPoints2, instance: lines} );                       // Using a single coordinate component
	

	return scene;

};

function drawLine(points, scene) {
    var babPoints = points.map(function(p) {
        return new BABYLON.Vector3(p.x / 100 - 20, 0, -p.y / 100 + 20);
    });
    var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: babPoints}, scene);
    lines.color = new BABYLON.Color3(1, 1, 0);
}

function drawPolygon(points, scene, extrusion) {
    var babPoints = points.map(function(p) {
        return new BABYLON.Vector3(p.x / 100 - 20, 0, -p.y / 100 + 20);
    });
    var polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", {shape: babPoints, sideOrientation: BABYLON.Mesh.DOUBLESIDE, depth: extrusion/10}, scene);
    polygon.position.y += extrusion / 10;
    var material = new BABYLON.StandardMaterial("polygonmaterial", scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0); 
    polygon.material = material;
}

function drawRoads(layer, scene) {
    for (var i = 0; i < layer.features.length; i++) {
        var feature = layer.feature(i);
        var geometries = feature.geometry();
        geometries.forEach(function (geometry) {
            drawLine(geometry, scene);
        });
    }
}

function drawBuildings(layer, scene) {
    for (var i = 0; i < layer.features.length; i++) {
        var feature = layer.feature(i);
        var geometries = feature.geometry();
        geometries.forEach(function (geometry) {
            drawPolygon(geometry, scene, feature.properties.extrude === "true" ? feature.properties.height : 0);
        });
    }
}

window.addEventListener("load", function () { // Watch for browser/canvas resize events

    var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    var scene = createScene(canvas, engine); //Call the createScene function

    window.addEventListener("resize", function () { // Watch for browser/canvas resize events
        engine.resize();
    });

    engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
        scene.render();
    });

    loadpbf(function(vectortile) {
        console.log(vectortile);

        drawRoads(vectortile.layers.road, scene);
        drawBuildings(vectortile.layers.building, scene);

    });
});
