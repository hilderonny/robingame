var scene;

var createScene = function (canvas, engine) {

    scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 5, -10));
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    //Creation of a material with an image texture
    var material = new BABYLON.StandardMaterial("texture", scene);
    material.diffuseTexture = new BABYLON.Texture("https://maps.googleapis.com/maps/api/staticmap?center=50.988,11.06055&zoom=17&size=512x542&maptype=roadmap&style=element:labels%7Cvisibility:off&style=feature:administrative%7Cvisibility:off&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.neighborhood%7Cvisibility:off&style=feature:landscape%7Celement:geometry.fill%7Ccolor:0x9ef0da%7Cvisibility:on&style=feature:landscape%7Celement:geometry.stroke%7Ccolor:0xb7dfc0%7Cvisibility:on&style=feature:landscape.man_made%7Celement:geometry.fill%7Ccolor:0xbdffb8%7Cvisibility:on&style=feature:landscape.man_made%7Celement:geometry.stroke%7Ccolor:0xb7dfc0%7Cvisibility:on&style=feature:poi%7Cvisibility:off&style=feature:road%7Celement:geometry%7Ccolor:0x529684%7Cvisibility:on&style=feature:road%7Celement:geometry.stroke%7Ccolor:0xffff90%7Cvisibility:on&style=feature:transit%7Cvisibility:off&key=AIzaSyAHEA7xh4Hdkmdl46XN809BrSmqK8dRJp0", scene);
    material.specularColor = new BABYLON.Color3(0, 0, 0);
    
    var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, scene);
    ground.material = material;

    return scene;
};

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
});
