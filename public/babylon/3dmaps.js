var scene;

var createScene = function (canvas, engine) {

    scene = new BABYLON.Scene(engine);


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
